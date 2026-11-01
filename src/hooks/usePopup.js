import { useEffect, useState } from "react";

export function usePopup(){
    const [popup,setPopup] = useState(null)

    // กด Back กลับจากหน้า Google เบราว์เซอร์คืนหน้าเดิมจากแคช ต้องปิด popup โหลดที่ค้างอยู่
    useEffect(()=>{
        function handlePageShow(e){
            if (e.persisted) setPopup(prev => prev?.type === 'loading' ? null : prev)
        }

        window.addEventListener('pageshow',handlePageShow)
        return ()=>window.removeEventListener('pageshow',handlePageShow)
    },[])

    function closePopup(){
        setPopup(null)
        popup?.afterClose?.()
    }

    return { popup, setPopup, closePopup }
}
