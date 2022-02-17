import { useRouter } from 'next/router'
import { useEffect } from 'react'
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
