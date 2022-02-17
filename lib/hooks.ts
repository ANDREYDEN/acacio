import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../client'
import ru from '../translations/ru/translation.json'
import en from '../translations/en/translation.json'

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

export const useTranslation = () => {
    const { locale } = useRouter()

    if (locale === 'ru-UA') {
        return ru
    }

    return en
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