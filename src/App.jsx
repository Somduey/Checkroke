import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import './App.css'
import Sidebar from './components/Sidebar.jsx'
import ChatWindow from './components/ChatWindow.jsx'
import EmergencyPanel from './components/EmergencyPanel.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import { useSession } from './hooks/useSession.js'
import { listConversations } from './database/chats.js'

const isMobile = () => window.matchMedia('(max-width: 768px)').matches

// หน้าแชท (Sidebar + ช่องแชท)
function ChatPage(){

    // จอใหญ่เปิด sidebar ไว้ตั้งแต่แรก มือถือซ่อนไว้ก่อน
    const [sidebarOpen,setSidebarOpen] = useState(() => !isMobile())
    // เปลี่ยน key เพื่อล้างแชทเดิมเมื่อกด "แชทใหม่"
    const [chatKey,setChatKey] = useState(0)
    const [emergencyOpen,setEmergencyOpen] = useState(false)
    const session = useSession()
    const userId = session?.user?.id ?? 'guest'

    // ประวัติแชท: รายการห้องแชทล่าสุด และห้องที่เปิดอยู่ (null = แชทใหม่)
    // เก็บว่าเป็นของใคร พอออกจากระบบหรือเปลี่ยนบัญชี จะได้ไม่เห็นแชทของคนก่อน
    const [history,setHistory] = useState({ userId: null, conversations: [] })
    const [active,setActive] = useState({ userId: null, id: null })
    const conversations = history.userId === userId ? history.conversations : []
    const activeId = active.userId === userId ? active.id : null

    async function refreshConversations(){
        try{
            const list = await listConversations()
            setHistory({ userId, conversations: list })
        }catch(error){
            console.error(error)
        }
    }

    // โหลดรายการแชทของคนที่ล็อกอินอยู่ (ถ้าเปลี่ยนบัญชีระหว่างโหลด ให้ทิ้งผลของคนเก่า)
    useEffect(() => {
        if (userId === 'guest') return
        let cancelled = false
        listConversations()
            .then(list => {
                if (!cancelled) setHistory({ userId, conversations: list })
            })
            .catch(error => console.error(error))
        return () => { cancelled = true }
    }, [userId])

    function setActiveId(id){
        setActive({ userId, id })
    }

    function handleNewChat(){
        setActiveId(null)
        setChatKey(chatKey + 1)
        if (isMobile()) setSidebarOpen(false)
    }

    function handleSelectConversation(id){
        if (id !== activeId){
            setActiveId(id)
            setChatKey(chatKey + 1)
        }
        if (isMobile()) setSidebarOpen(false)
    }

    // แชทใหม่ถูกบันทึกครั้งแรก หรือมีข้อความใหม่ → ไฮไลต์ห้องนั้นและอัปเดตลำดับในรายการ
    function handleHistoryChange(id){
        setActiveId(id)
        refreshConversations()
    }

    return(
        <div className={`main-appContainer ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <Sidebar
                open={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                onNewChat={handleNewChat}
                conversations={conversations}
                activeId={activeId}
                onSelectConversation={handleSelectConversation}
            />
            {/* ฉากหลังมืดตอนเปิด sidebar บนมือถือ */}
            <div className="App-backdrop" onClick={() => setSidebarOpen(false)}/>
            <ChatWindow
                key={`${userId}-${chatKey}`}
                session={session}
                conversationId={activeId}
                onHistoryChange={handleHistoryChange}
                onOpenSidebar={() => setSidebarOpen(true)}
                onOpenEmergency={() => setEmergencyOpen(true)}
            />
            <EmergencyPanel open={emergencyOpen} onClose={() => setEmergencyOpen(false)}/>
        </div>
    )
}

export default function App(){

    // จับคู่ URL กับหน้าที่จะแสดง
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ChatPage/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                {/* URL อื่นที่ไม่มีอยู่ → กลับหน้าแชท */}
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </BrowserRouter>
    )
}
