import './AuthForm.css'
import { Link, useNavigate } from 'react-router'
import { login, Google } from '../database/Auth.js'
import Icon from '../assets/checkroke-logo.svg'
import GoogleIcon from '../assets/google.svg'
import Popup from '../components/Popup.jsx'
import { usePopup } from '../hooks/usePopup.js'
import { useState } from 'react'

export default function Login(){

    const { popup, setPopup, closePopup } = usePopup()
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate()

    function translateError(message){
        if (message.includes('Invalid login credentials')) return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
        if (message.includes('Email not confirmed')) return 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ'
        return message
    }

    async function handleSubmit(e){
        e.preventDefault()
        try{
            setPopup({ type: 'loading', title: 'กำลังเข้าสู่ระบบ' })
            await login(email,password)
            setPopup({
                type: 'success',
                title: 'เข้าสู่ระบบสำเร็จ',
                message: 'ยินดีต้อนรับกลับมา',
                buttonText: 'ไปหน้าแชท',
                afterClose: () => navigate('/')
            })
        }catch(error){
            setPopup({
                type: 'error',
                title: 'เข้าสู่ระบบไม่สำเร็จ',
                message: translateError(error.message),
                buttonText: 'ลองอีกครั้ง'
            })
        }
    }

    async function handleGoogle(e){
        e.preventDefault()
        try{
            // ไม่ต้องปิด popup เมื่อสำเร็จ เพราะเบราว์เซอร์กำลังจะเปลี่ยนไปหน้า Google
            setPopup({ type: 'loading', title: 'กำลังไปที่หน้า Google' })
            await Google()
        }catch(error){
            setPopup({
                type: 'error',
                title: 'เชื่อมต่อ Google ไม่สำเร็จ',
                message: error.message,
                buttonText: 'ลองอีกครั้ง'
            })
        }
    }

    return(
        <div className="Auth-container">
            <form className="Auth-card" onSubmit={handleSubmit}>
                <img src={Icon} alt="CheckRoke" className="Auth-logo"/>
                <h1>เข้าสู่ระบบ</h1>
                <p className="Auth-subtitle">ยินดีต้อนรับกลับมา</p>

                <div className="Auth-field">
                    <label htmlFor="login-email">อีเมล</label>
                    <input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                </div>
                <div className="Auth-field">
                    <label htmlFor="login-password">รหัสผ่าน</label>
                    <input id="login-password" type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                </div>

                <button type="submit" className="Auth-submit">เข้าสู่ระบบ</button>

                <div className="Auth-divider"><span>หรือ</span></div>

                <button type="button" onClick={(e)=>handleGoogle(e)} className="Auth-google">
                    <img src={GoogleIcon} alt="googleIcon" />
                    ดำเนินการต่อด้วย Google
                </button>

                <p className="Auth-switch">
                    ยังไม่มีบัญชี?
                    <Link to="/signup" className="Auth-link">สมัครสมาชิก</Link>
                </p>
                <Link to="/" className="Auth-back">← กลับไปหน้าแชท</Link>
            </form>
            {popup && <Popup {...popup} onClose={closePopup}/>}
        </div>
    )
}
