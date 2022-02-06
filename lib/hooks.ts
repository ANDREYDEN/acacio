import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { supabase } from '../client'

export const useUser = () => {
  const router = useRouter();
  const user = supabase.auth.user()

  useEffect(() => {
    if (!user && router.route !== '/') {
      router.replace('/')
    }
  }, [router, user])

  return user;
};
