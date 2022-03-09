import { supabase } from '@client'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import axios from 'axios'
import { useEffect, useState } from 'react'

export const useUpdateAuthCookie = () => {
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            updateSupabaseCookie(event, session)
        })
    
        return () => {
            authListener?.unsubscribe()
        }
    })
    
    async function updateSupabaseCookie(event: AuthChangeEvent, session: Session | null) {
        console.log('Updating Cookie with ...', { event })
        
        await axios.post('/api/auth', { event, session })
    }
}

export const useMounted = () => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    return { mounted }
}
