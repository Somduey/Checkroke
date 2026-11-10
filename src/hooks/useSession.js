import { useEffect, useState } from "react";
import { supabase } from '../database/supabase.js'

export function useSession(){
    // undefined = กำลังโหลด, null = ยังไม่ได้ล็อกอิน
    const [session,setSession] = useState(undefined)

    useEffect(()=>{
        supabase.auth.getSession().then(({data})=>{
            setSession(data.session)
        })

        const {data:{subscription}} = supabase.auth.onAuthStateChange((_event,session)=>{
            setSession(session)
        })

        return ()=>subscription.unsubscribe()
    },[])

    return session
}