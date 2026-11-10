import './ChatWindow.css'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { BotAvatar, UserIcon, PaperclipIcon, SendIcon, MenuIcon, LoginIcon, PhoneIcon } from './Icons.jsx'
import { supabase } from '../database/supabase.js'
import { createConversation, getMessages, saveMessage } from '../database/chats.js'

const WELCOME_TEXT = 'สวัสดีครับ บอกอาการที่เป็นอยู่ได้เลย เช่น มีไข้กี่องศา ไอ เจ็บคอ ปวดหัว และเริ่มมีอาการมากี่วันแล้ว ยิ่งเล่าละเอียด ผมยิ่งช่วยวิเคราะห์ได้ตรงขึ้นครับ'

const ERROR_REPLY = 'ขออภัยครับ ตอนนี้ AI ตอบกลับไม่ได้ กรุณาลองใหม่อีกครั้งในอีกสักครู่'
const HISTORY_ERROR = 'โหลดประวัติแชทไม่สำเร็จ กรุณาลองเปิดใหม่อีกครั้ง'

function formatTime(date){
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}

// session: undefined = กำลังเช็กการล็อกอิน, null = ยังไม่ได้ล็อกอิน
// conversationId: ห้องแชทเก่าที่จะเปิด (null = แชทใหม่)
export default function ChatWindow({ session, conversationId, onHistoryChange, onOpenSidebar, onOpenEmergency }){

    const [messages,setMessages] = useState(() => [
        { id: 0, role: 'bot', text: WELCOME_TEXT, time: new Date() }
    ])
    const [input,setInput] = useState('')
    const [isTyping,setIsTyping] = useState(false)
    const [isLoadingHistory,setIsLoadingHistory] = useState(Boolean(conversationId))

    const nextId = useRef(1)
    const conversationRef = useRef(conversationId)
    const endRef = useRef(null)
    const textareaRef = useRef(null)

    // เปิดแชทเก่า: โหลดข้อความจาก database ครั้งเดียวตอนเปิด
    // (แชทใหม่ที่เพิ่งบันทึกไม่ต้องโหลดซ้ำ เพราะข้อความอยู่บนจออยู่แล้ว)
    useEffect(() => {
        if (!conversationRef.current) return
        let cancelled = false

        getMessages(conversationRef.current)
            .then(rows => {
                if (cancelled) return
                const loaded = rows.map(row => ({
                    id: nextId.current++,
                    role: row.role === 'assistant' ? 'bot' : 'user',
                    text: row.content,
                    time: new Date(row.created_at),
                }))
                setMessages(prev => [prev[0], ...loaded])
            })
            .catch(error => {
                console.error(error)
                if (!cancelled) addMessage('bot', HISTORY_ERROR, true)
            })
            .finally(() => {
                if (!cancelled) setIsLoadingHistory(false)
            })

        return () => { cancelled = true }
    }, [])

    // เลื่อนลงข้อความล่าสุดทุกครั้งที่มีข้อความใหม่
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, [messages, isTyping])

    // ขยายความสูงช่องพิมพ์ตามข้อความ
    useEffect(() => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    }, [input])

    function addMessage(role, text, isError = false){
        const message = { id: nextId.current++, role, text, time: new Date(), isError }
        setMessages(prev => [...prev, message])
    }

    // บันทึกข้อความลง database ถ้าบันทึกไม่สำเร็จก็ยังคุยต่อได้ แค่จะไม่มีในประวัติ
    async function saveToHistory(role, text){
        try{
            if (!conversationRef.current){
                conversationRef.current = await createConversation(text)
            }
            await saveMessage(conversationRef.current, role, text)
            onHistoryChange?.(conversationRef.current)
        }catch(error){
            console.error('save chat history failed', error)
        }
    }

    async function sendMessage(){
        const text = input.trim()
        if (!text || isTyping || isLoadingHistory || !session) return

        // ส่งประวัติแชทไปด้วยให้ AI รู้บริบท ไม่รวมข้อความต้อนรับและข้อความ error
        const history = [...messages.slice(1), { role: 'user', text }]
            .filter(message => !message.isError)
            .map(message => ({
                role: message.role === 'bot' ? 'assistant' : 'user',
                content: message.text,
            }))

        addMessage('user', text)
        setInput('')
        setIsTyping(true)

        // บันทึกข้อความผู้ใช้ไปพร้อมกับถาม AI จะได้ไม่ต้องรอ
        const savingUserMessage = saveToHistory('user', text)

        try{
            const { data, error } = await supabase.functions.invoke('Chat',{ body: { messages: history } })
            if (error) throw error
            addMessage('bot', data.reply)
            await savingUserMessage
            await saveToHistory('assistant', data.reply)
        }catch(error){
            console.error(error)
            addMessage('bot', ERROR_REPLY, true)
        }finally{
            setIsTyping(false)
        }
    }

    function handleKeyDown(e){
        // Enter = ส่ง, Shift + Enter = ขึ้นบรรทัดใหม่
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing){
            e.preventDefault()
            sendMessage()
        }
    }

    return(
        <main className="Chat-container">
            {/* Header */}
            <header className="Chat-header">
                <button className="Chat-menuBtn" onClick={onOpenSidebar} aria-label="เปิดแถบเมนู">
                    <MenuIcon/>
                </button>
                <BotAvatar size={64} className="Chat-headerAvatar"/>
                <div className="Chat-headerText">
                    <h1>สวัสดี! เราคือ <span>CheckRoke</span></h1>
                    <p>บอกอาการของคุณได้เลยครับ ผมจะช่วยวิเคราะห์ว่าอาการของคุณอาจเกี่ยวข้องกับโรคอะไรได้บ้าง พร้อมคำแนะนำเบื้องต้น</p>
                </div>
                <button className="Chat-emergencyBtn" onClick={onOpenEmergency} aria-label="เบอร์โทรฉุกเฉิน" title="เบอร์โทรฉุกเฉิน">
                    <PhoneIcon size={16}/>
                    <span className="Chat-emergencyText">เบอร์ฉุกเฉิน</span>
                </button>
                <div className="Chat-status">
                    <span className="Chat-statusDot"/>
                    <span className="Chat-statusText">AI พร้อมใช้งาน</span>
                </div>
            </header>

            {/* Messages */}
            <div className="Chat-messages">
                <div className="Chat-messagesInner">
                    {messages.map(message => (
                        <div key={message.id} className={`Chat-row Chat-row--${message.role}`}>
                            {message.role === 'bot'
                                ? <BotAvatar className="Chat-avatar"/>
                                : <div className="Chat-avatar Chat-avatar--user"><UserIcon size={20}/></div>}
                            <div className="Chat-bubbleWrap">
                                <div className="Chat-bubble">{message.text}</div>
                                <span className="Chat-time">{formatTime(message.time)}</span>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="Chat-row Chat-row--bot">
                            <BotAvatar className="Chat-avatar"/>
                            <div className="Chat-bubble Chat-typing" aria-label="AI กำลังพิมพ์">
                                <span/><span/><span/>
                            </div>
                        </div>
                    )}
                    <div ref={endRef}/>
                </div>
            </div>

            {/* Input */}
            <div className="Chat-inputArea">
                {session === null ? (
                    // ยังไม่ได้ล็อกอิน: ต้องเข้าสู่ระบบก่อนถึงจะคุยกับ AI ได้
                    <div className="Chat-loginPrompt">
                        <p>เข้าสู่ระบบเพื่อเริ่มคุยกับ AI</p>
                        <Link to="/login" className="Chat-loginBtn">
                            <LoginIcon size={18}/>
                            เข้าสู่ระบบ
                        </Link>
                    </div>
                ) : (
                    <form
                        className="Chat-inputBox"
                        onSubmit={(e) => { e.preventDefault(); sendMessage() }}
                    >
                        <button type="button" className="Chat-attach" aria-label="แนบไฟล์" title="แนบไฟล์ (เร็ว ๆ นี้)" disabled>
                            <PaperclipIcon/>
                        </button>
                        {/* ปิดช่องพิมพ์ไว้ระหว่างเช็กการล็อกอิน */}
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={session && !isLoadingHistory ? 'พิมพ์อาการของคุณได้เลย...' : 'กำลังโหลด...'}
                            aria-label="พิมพ์ข้อความ"
                            disabled={!session || isLoadingHistory}
                        />
                        <button type="submit" className="Chat-send" disabled={!input.trim() || isTyping || isLoadingHistory || !session} aria-label="ส่งข้อความ">
                            <SendIcon size={18}/>
                        </button>
                    </form>
                )}
                <p className="Chat-disclaimer">
                    ผลการวิเคราะห์เป็นเพียงการประเมินเบื้องต้น ไม่สามารถใช้แทนการวินิจฉัยจากแพทย์ได้
                </p>
            </div>
        </main>
    )
}
