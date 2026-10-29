import { supabase } from './supabase.js'

export async function login(){
    const { error } = await supabase.auth.signInWithPasskey({email,password})
    if(error) throw error
}

export async function signUp(){
    const { data, error } = await supabase.auth.signUp({email,password})
    if(error) throw error
    return data
}

export async function logout(){
    const { error } = await supabase.auth.signOut()
    if(error) throw error
}