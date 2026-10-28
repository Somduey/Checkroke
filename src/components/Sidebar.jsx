import './Sidebar.css'
import Icon from '../assets/checkroke-logo.svg'
import { useState } from 'react'

export default function SideBar(){

    const [activeNew,setActiveNew] = useState(false)

    return(
        <div className="Sb-maincontainer">
            {/* Icon */}
            <div className='Sb-Header'>
                <img src={Icon} alt="Icon" />
                <div className="Icon-Title">
                    <h2>CheckRoke</h2>
                    <p>คุยกับ Ai เพื่อเช็คอาการและรับคำแนะนำเบื้องต้น</p>
                </div>
            </div>
            {/* Menu */}
            <div className="Sb-menu">
                <button className={activeNew ? 'ActiveNewChat' : 'newChat'} onClick={()=>setActiveNew(!activeNew)}>New</button>
            </div>
        </div>
    )
}