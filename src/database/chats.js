import { supabase } from './supabase.js'

// รายการห้องแชทล่าสุดของผู้ใช้ (RLS กรองให้เหลือเฉพาะของตัวเองอยู่แล้ว)
export async function listConversations(){
    const { data, error } = await supabase
        .from('conversations')
        .select('id, title, updated_at')
        .order('updated_at', { ascending: false })
        .limit(30)
    if(error) throw error
    return data
}

export async function createConversation(title){
    const { data, error } = await supabase
        .from('conversations')
        .insert({ title: title.replace(/\s+/g, ' ').trim().slice(0, 100) })
        .select('id')
        .single()
    if(error) throw error
    return data.id
}

export async function getMessages(conversationId){
    const { data, error } = await supabase
        .from('messages')
        .select('role, content, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
    if(error) throw error
    return data
}

export async function saveMessage(conversationId, role, content){
    const { error } = await supabase
        .from('messages')
        .insert({ conversation_id: conversationId, role, content: content.slice(0, 10000) })
    if(error) throw error
}
