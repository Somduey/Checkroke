import { useState } from 'react'
import './AuthForm.css'
import { Link, useNavigate } from 'react-router'
import { signUp } from '../database/Auth.js'
import Icon from '../assets/checkroke-logo.svg'
import GoogleIcon from '../assets/google.svg'
import { Google } from '../database/Auth.js'
import Popup from '../components/Popup.jsx'
import { usePopup } from '../hooks/usePopup.js'

export default function SignUp(){

    const { popup, setPopup, closePopup } = usePopup()
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate()

    function translateError(message){
        if (message.includes('rate limit')) return 'มีการสมัครบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'
        if (message.includes('User already registered')) return 'อีเมลนี้ถูกใช้สมัครแล้ว'
        if (message.includes('Password should be')) return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
        if (message.includes('Database error saving new user')) return 'สร้างบัญชีไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
        return message
    }

    async function handleSubmit(e){
        e.preventDefault()
        try{
            setPopup({ type: 'loading', title: 'กำลังสมัครสมาชิก' })
            const data = await signUp(email,password)
            setPopup({
                type: 'success',
                title: 'สมัครสมาชิกสำเร็จ',
                message: data.session ? 'บัญชีของคุณพร้อมใช้งานแล้ว' : 'กรุณาเช็คอีเมลเพื่อยืนยันบัญชี',
                buttonText: data.session ? 'ไปหน้าแชท' : 'ไปหน้าเข้าสู่ระบบ',
                afterClose: () => navigate(data.session ? '/' : '/login')
            })
        }catch(error){
            setPopup({
                type: 'error',
                title: 'สมัครสมาชิกไม่สำเร็จ',
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
                <h1>สมัครสมาชิก</h1>
                <p className="Auth-subtitle">สร้างบัญชีเพื่อเริ่มใช้งาน CheckRoke</p>

                <div className="Auth-field">
                    <label htmlFor="signup-email">อีเมล</label>
                    <input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                </div>
                <div className="Auth-field">
                    <label htmlFor="signup-password">รหัสผ่าน</label>
                    <input id="signup-password" type="password" placeholder="อย่างน้อย 6 ตัวอักษร" minLength={6} value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                </div>

                <button type="submit" className="Auth-submit">สมัครสมาชิก</button>

                <div className="Auth-divider"><span>หรือ</span></div>

                <button type="button" onClick={(e)=>handleGoogle(e)} className="Auth-google">
                    <img src={GoogleIcon} alt="googleIcon" />
                    ดำเนินการต่อด้วย Google
                </button>

                <p className="Auth-switch">
                    มีบัญชีอยู่แล้ว?
                    <Link to="/login" className="Auth-link">เข้าสู่ระบบ</Link>
                </p>
                <Link to="/" className="Auth-back">← กลับไปหน้าแชท</Link>
            </form>
            {popup && <Popup {...popup} onClose={closePopup}/>}
        </div>
    )
}
