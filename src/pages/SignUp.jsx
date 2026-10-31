import { useState } from 'react'
import './AuthForm.css'
import { Link, useNavigate } from 'react-router'
import { signUp } from '../database/Auth.js'
import Icon from '../assets/checkroke-logo.svg'
import GoogleIcon from '../assets/google.svg'
import { Google } from '../database/Auth.js'

export default function SignUp(){

    const [loading,setLoading] = useState(false)
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate()

    function translateError(message){
        if (message.includes('rate limit')) return 'มีการสมัครบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'
        if (message.includes('User already registered')) return 'อีเมลนี้ถูกใช้สมัครแล้ว'
        if (message.includes('Password should be')) return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
        return message
    }

    async function handleSubmit(e){
        e.preventDefault()   
        try{
            setLoading(true)
            const data = await signUp(email,password)
            if(!data.session) alert('สมัครสำเร็จ กรุณาเช็คอีเมลเพื่อยืนยันบัญชี')
            navigate('/login')
        }catch(error){
            alert(translateError(error.message))
        }finally{
            setLoading(false)
        }
    }

    async function handleGoogle(e){
        e.preventDefault()
        try{
            setLoading(true)
            await Google()
        }catch(error){
            alert(error.message)
        }finally{
            setLoading(false)
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

                <button type="submit" className="Auth-submit">{loading ? 'กำลังโหลด' : 'สมัครสมาชิก'}</button>

                <div className="Auth-divider"><span>หรือ</span></div>

                <button type="button" onClick={(e)=>handleGoogle(e)} className="Auth-google">
                    <img src={GoogleIcon} alt="googleIcon" />
                    {loading ? 'กำลังโหลด' : 'ดำเนินการต่อด้วย Google'}
                </button>

                <p className="Auth-switch">
                    มีบัญชีอยู่แล้ว?
                    <Link to="/login" className="Auth-link">เข้าสู่ระบบ</Link>
                </p>
                <Link to="/" className="Auth-back">← กลับไปหน้าแชท</Link>
            </form>
        </div>
    )
}
