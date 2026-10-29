import './ChatWindow.css'
import { useEffect, useRef, useState } from 'react'
import { BotAvatar, UserIcon, PaperclipIcon, SendIcon, MenuIcon } from './Icons.jsx'

const WELCOME_TEXT = 'สวัสดีครับ บอกอาการที่เป็นอยู่ได้เลย เช่น มีไข้กี่องศา ไอ เจ็บคอ ปวดหัว และเริ่มมีอาการมากี่วันแล้ว ยิ่งเล่าละเอียด ผมยิ่งช่วยวิเคราะห์ได้ตรงขึ้นครับ'

// TODO: เปลี่ยนเป็นคำตอบจาก AI จริงเมื่อเชื่อมต่อ API แล้ว
const PLACEHOLDER_REPLY = 'ขอบคุณที่เล่าอาการให้ฟังนะครับ ตอนนี้ระบบยังไม่ได้เชื่อมต่อกับ AI จึงยังวิเคราะห์อาการให้ไม่ได้ เร็ว ๆ นี้จะพร้อมใช้งานครับ'

function formatTime(date){
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatWindow({ onOpenSidebar }){

    const [messages,setMessages] = useState(() => [
        { id: 0, role: 'bot', text: WELCOME_TEXT, time: new Date() }
    ])
    const [input,setInput] = useState('')
    const [isTyping,setIsTyping] = useState(false)

    const nextId = useRef(1)
    const replyTimer = useRef(null)
    const endRef = useRef(null)
    const textareaRef = useRef(null)

    // เลื่อนลงข้อความล่าสุดทุกครั้งที่มีข้อความใหม่
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, [messages, isTyping])

    // ขยายความสูงช่องพิมพ์ตามข้อความ
    useEffect(() => {
        const el = textareaRef.current
        el.style.height = 'auto'
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    }, [input])

    useEffect(() => () => clearTimeout(replyTimer.current), [])

    function addMessage(role, text){
        const message = { id: nextId.current++, role, text, time: new Date() }
        setMessages(prev => [...prev, message])
    }

    function sendMessage(){
        const text = input.trim()
        if (!text || isTyping) return

        addMessage('user', text)
        setInput('')
        setIsTyping(true)

        replyTimer.current = setTimeout(() => {
            addMessage('bot', PLACEHOLDER_REPLY)
            setIsTyping(false)
        }, 900)
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
                <form
                    className="Chat-inputBox"
                    onSubmit={(e) => { e.preventDefault(); sendMessage() }}
                >
                    <button type="button" className="Chat-attach" aria-label="แนบไฟล์" title="แนบไฟล์ (เร็ว ๆ นี้)" disabled>
                        <PaperclipIcon/>
                    </button>
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="พิมพ์อาการของคุณได้เลย..."
                        aria-label="พิมพ์ข้อความ"
                    />
                    <button type="submit" className="Chat-send" disabled={!input.trim() || isTyping} aria-label="ส่งข้อความ">
                        <SendIcon size={18}/>
                    </button>
                </form>
                <p className="Chat-disclaimer">
                    ผลการวิเคราะห์เป็นเพียงการประเมินเบื้องต้น ไม่สามารถใช้แทนการวินิจฉัยจากแพทย์ได้
                </p>
            </div>
        </main>
    )
}
