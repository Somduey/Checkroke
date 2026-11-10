import './Sidebar.css'
import { Link } from 'react-router'
import Icon from '../assets/checkroke-logo.svg'
import { PlusIcon, PanelIcon, ChatIcon, LoginIcon } from './Icons.jsx'
import { useSession } from '../hooks/useSession.js'
import {signOut} from '../database/Auth.js'

export default function SideBar({ open, onToggle, onNewChat, conversations, activeId, onSelectConversation }){

    const session = useSession()
    const user = session?.user
    const avatarUrl = user?.user_metadata?.avatar_url
    const name = user?.user_metadata?.full_name || user?.email

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
                {conversations.length > 0 ? (
                    <ul className="Sb-list">
                        {conversations.map(conversation => (
                            <li key={conversation.id}>
                                <button
                                    className={`Sb-item ${conversation.id === activeId ? 'Sb-item--active' : ''}`}
                                    onClick={() => onSelectConversation(conversation.id)}
                                    title={conversation.title}
                                    aria-current={conversation.id === activeId ? 'true' : undefined}
                                >
                                    <ChatIcon size={16}/>
                                    <span>{conversation.title}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="Sb-empty">
                        <ChatIcon size={22}/>
                        <p>ยังไม่มีประวัติการคุย</p>
                    </div>
                )}
            </div>
            {user ? (
                <div className="Sb-profile">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="profile" className="Sb-avatar" referrerPolicy="no-referrer" />
                    ) : (
                        <div className="Sb-avatar">{name[0].toUpperCase()}</div>
                    )}
                    <div className="Sb-label Sb-profileInfo">
                        <p className="Sb-name">{name}</p>
                        <button className="Sb-logout" onClick={signOut}>ออกจากระบบ</button>
                    </div>
                </div>
            ) : (
                <Link to="/login" className="Sb-login" title="เข้าสู่ระบบ">
                    <LoginIcon size={18}/>
                    <span className="Sb-label">เข้าสู่ระบบ</span>
                </Link>
            )}
        </aside>
    )
}
