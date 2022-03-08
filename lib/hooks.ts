import { supabase } from '@client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export const useUser = () => {
    const router = useRouter()
    const user = supabase.auth.user()

    useEffect(() => {
        if (!user && router.route !== '/') {
            router.replace('/')
        }
    }, [router, user])

    return user
}

export const useMounted = () => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    return { mounted }
}
