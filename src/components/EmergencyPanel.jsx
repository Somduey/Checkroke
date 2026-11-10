import './EmergencyPanel.css'
import { useEffect, useRef } from 'react'
import { PhoneIcon, CloseIcon } from './Icons.jsx'

// เบอร์โทรฉุกเฉินในประเทศไทย (กดแล้วโทรได้เลยบนมือถือ)
const EMERGENCY_NUMBERS = [
    { number: '1669', name: 'เจ็บป่วยฉุกเฉิน', detail: 'เรียกรถพยาบาล สถาบันการแพทย์ฉุกเฉินแห่งชาติ', urgent: true },
    { number: '1367', name: 'ศูนย์พิษวิทยา', detail: 'ได้รับสารพิษ กินยาเกินขนาด หรือถูกสัตว์มีพิษกัด' },
    { number: '1323', name: 'สายด่วนสุขภาพจิต', detail: 'ปรึกษาปัญหาความเครียดและสุขภาพจิต' },
    { number: '191', name: 'ตำรวจ', detail: 'แจ้งเหตุด่วนเหตุร้าย' },
    { number: '199', name: 'ดับเพลิงและกู้ภัย', detail: 'ไฟไหม้ หรือต้องการความช่วยเหลือ' },
]

// แผงเบอร์ฉุกเฉิน เลื่อนเข้ามาจากด้านขวา
export default function EmergencyPanel({ open, onClose }){

    const closeRef = useRef(null)

    // เปิดแล้วย้าย focus ไปปุ่มปิด และกด Esc เพื่อปิดได้
    useEffect(() => {
        if (!open) return
        closeRef.current?.focus()
        function handleKeyDown(e){
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [open, onClose])

    return(
        <>
            <div className={`Em-backdrop ${open ? 'Em-backdrop--open' : ''}`} onClick={onClose}/>
            {/* ตอนปิดใช้ inert กันไม่ให้กด Tab เข้าไปในแผงที่ซ่อนอยู่ */}
            <aside className={`Em-panel ${open ? 'Em-panel--open' : ''}`} inert={!open} aria-label="เบอร์โทรฉุกเฉิน">
                <div className="Em-header">
                    <h2>เบอร์โทรฉุกเฉิน</h2>
                    <button ref={closeRef} className="Em-close" onClick={onClose} aria-label="ปิด" title="ปิด">
                        <CloseIcon size={18}/>
                    </button>
                </div>

                <p className="Em-note">
                    ถ้ามีอาการรุนแรง เช่น เจ็บแน่นหน้าอก หายใจลำบาก หมดสติ ชัก ให้โทร <strong>1669</strong> ทันที
                </p>

                <ul className="Em-list">
                    {EMERGENCY_NUMBERS.map(item => (
                        <li key={item.number}>
                            <a href={`tel:${item.number}`} className={`Em-item ${item.urgent ? 'Em-item--urgent' : ''}`}>
                                <span className="Em-number">{item.number}</span>
                                <span className="Em-text">
                                    <strong>{item.name}</strong>
                                    <small>{item.detail}</small>
                                </span>
                                <PhoneIcon size={18} className="Em-call"/>
                            </a>
                        </li>
                    ))}
                </ul>
            </aside>
        </>
    )
}
