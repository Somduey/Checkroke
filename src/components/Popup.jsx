import './Popup.css'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircleIcon, XCircleIcon, CloseIcon } from './Icons.jsx'

// type: 'loading' = กดอะไรไม่ได้จนกว่าจะเสร็จ, 'success' / 'error' = มีปุ่มให้กดปิด
export default function Popup({ type, title, message, buttonText = 'ตกลง', onClose }){

    const isLoading = type === 'loading'

    // ล็อกหน้าเว็บด้านหลังทั้งเมาส์และคีย์บอร์ด ปิด popup แล้วคืน focus ที่เดิม
    useEffect(() => {
        const root = document.getElementById('root')
        const lastFocused = document.activeElement
        root.inert = true
        return () => {
            root.inert = false
            lastFocused?.focus()
        }
    }, [])

    // กด Esc เพื่อปิด ยกเว้นตอนกำลังโหลด
    useEffect(() => {
        if (isLoading) return
        function handleKeyDown(e){
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isLoading, onClose])

    return createPortal(
        <div className="Popup-backdrop">
            <div
                className="Popup-card"
                role={isLoading ? 'status' : 'alertdialog'}
                aria-modal={!isLoading}
                aria-label={title}
            >
                {!isLoading && (
                    <button className="Popup-close" onClick={onClose} aria-label="ปิด" title="ปิด">
                        <CloseIcon size={18}/>
                    </button>
                )}

                {isLoading && <div className="Popup-spinner"/>}
                {type === 'success' && <CheckCircleIcon size={56} className="Popup-icon Popup-icon--success"/>}
                {type === 'error' && <XCircleIcon size={56} className="Popup-icon Popup-icon--error"/>}

                <h2>{title}</h2>
                {message && <p>{message}</p>}

                {!isLoading && (
                    <button className="Popup-button" onClick={onClose} autoFocus>{buttonText}</button>
                )}
            </div>
        </div>,
        document.body
    )
}
