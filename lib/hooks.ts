import { supabase } from '@client'
import axios from 'axios'
import { useEffect, useState } from 'react'

export const useUpdateAuthCookie = () => {
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            axios.post('/api/auth', { event, session })
        })
    
        return () => {
            authListener?.unsubscribe()
        }
    })
}

export const useMounted = () => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    return { mounted }
}
