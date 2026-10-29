import './AuthForm.css'
import { Link, useNavigate } from 'react-router'
import { login } from '../database/Auth.js'
import Icon from '../assets/checkroke-logo.svg'
import { useState } from 'react'

export default function Login(){

    const [loading,setLoading] = useState(false)
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.prevenDefault()
        try{
            setLoading(true)
            await login(email,password)
            navigate('/')
        }catch(error){
            alert(error.massage)
        }finally{
            setLoading(false)
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
                    <input id="login-email" type="email" placeholder="you@example.com" required/>
                </div>
                <div className="Auth-field">
                    <label htmlFor="login-password">รหัสผ่าน</label>
                    <input id="login-password" type="password" placeholder="••••••••" required/>
                </div>

                <button type="submit" className="Auth-submit">เข้าสู่ระบบ</button>

                <p className="Auth-switch">
                    ยังไม่มีบัญชี?
                    <Link to="/signup" className="Auth-link">สมัครสมาชิก</Link>
                </p>
                <Link to="/" className="Auth-back">← กลับไปหน้าแชท</Link>
            </form>
        </div>
    )
}
