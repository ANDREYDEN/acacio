import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../client'

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

export const useMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return { mounted }
}