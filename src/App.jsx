import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import './App.css'
import Sidebar from './components/Sidebar.jsx'
import ChatWindow from './components/ChatWindow.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import { useSession } from './hooks/useSession.js'

const isMobile = () => window.matchMedia('(max-width: 768px)').matches

// หน้าแชท (Sidebar + ช่องแชท)
function ChatPage(){

    // จอใหญ่เปิด sidebar ไว้ตั้งแต่แรก มือถือซ่อนไว้ก่อน
    const [sidebarOpen,setSidebarOpen] = useState(() => !isMobile())
    // เปลี่ยน key เพื่อล้างแชทเดิมเมื่อกด "แชทใหม่"
    const [chatKey,setChatKey] = useState(0)
    const session = useSession()
    const userId = session?.user?.id ?? 'guest'

    function handleNewChat(){
        setChatKey(chatKey + 1)
        if (isMobile()) setSidebarOpen(false)
    }

    return(
        <div className={`main-appContainer ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <Sidebar
                open={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                onNewChat={handleNewChat}
            />
            {/* ฉากหลังมืดตอนเปิด sidebar บนมือถือ */}
            <div className="App-backdrop" onClick={() => setSidebarOpen(false)}/>
            <ChatWindow key={`${userId}-${chatKey}`} onOpenSidebar={() => setSidebarOpen(true)}/>
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
