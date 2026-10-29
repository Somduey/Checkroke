import './Sidebar.css'
import { Link } from 'react-router'
import Icon from '../assets/checkroke-logo.svg'
import { PlusIcon, PanelIcon, ChatIcon, LoginIcon } from './Icons.jsx'

export default function SideBar({ open, onToggle, onNewChat }){

    return(
        <aside className={`Sb-maincontainer ${open ? '' : 'Sb-collapsed'}`}>
            {/* Icon */}
            <div className="Sb-Header">
                <img src={Icon} alt="CheckRoke" className="Sb-logo"/>
                <div className="Icon-Title">
                    <h2>Check<span>Roke</span></h2>
                    <p>คุยกับ AI เพื่อเช็คอาการและรับคำแนะนำเบื้องต้น</p>
                </div>
                <button
                    className="Sb-toggle"
                    onClick={onToggle}
                    aria-label={open ? 'ปิดแถบเมนู' : 'เปิดแถบเมนู'}
                    title={open ? 'ปิดแถบเมนู' : 'เปิดแถบเมนู'}
                >
                    <PanelIcon/>
                </button>
            </div>
            {/* Menu */}
            <button className="Sb-newChat" onClick={onNewChat} title="แชทใหม่">
                <PlusIcon size={18}/>
                <span className="Sb-label">แชทใหม่</span>
            </button>
            <hr />
            {/* history */}
            <div className="Sb-history">
                <h3>ล่าสุด</h3>
                <div className="Sb-empty">
                    <ChatIcon size={22}/>
                    <p>ยังไม่มีประวัติการคุย</p>
                </div>
            </div>
            {/* ปุ่มเข้าสู่ระบบ (ยังไม่ได้เชื่อม Supabase) */}
            <Link to="/login" className="Sb-login" title="เข้าสู่ระบบ">
                <LoginIcon size={18}/>
                <span className="Sb-label">เข้าสู่ระบบ</span>
            </Link>
        </aside>
    )
}
