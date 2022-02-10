import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { supabase } from '../client'
import { useUser } from '../lib/hooks'
import LoginForm from '../components/LoginForm'

const Login: NextPage = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const router = useRouter()
    const user = useUser()

    useEffect(() => {
        if (user) {
            router.replace('/employees')
        }
    }, [user, router])

    const handleLogin = async (email: string, password: string) => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signIn({ email, password })
            if (error) throw new Error(error.message)
            router.replace('/employees')
        } catch (error: any) {
            setError(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    const sendPasswordReset = async (email: string) => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.api.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/password-reset` })
            if (error) throw new Error(error.message)
        } catch (error: any) {
            setError(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='h-screen grid grid-cols-7 grid-flow-row-dense'>
            <div className='col-span-3 flex flex-col justify-center mx-24'>
                <div className='absolute top-16'>
                    <Image src='/img/acacio.svg' alt='Logo' width={156} height={31} />
                </div>
                <h1>Welcome back</h1>
                <p className='mb-10 text-dark-grey'>Welcome back! Please, sign in</p>
                {error &&
                    <div className='text-center mb-8 border border-error rounded-lg border-dashed px-10 py-6'>
                        <Image src='/img/error.svg' alt='Logo' width={32} height={32} />
                        <p className='text-error'>{ error }</p>
                    </div>
                }
                <LoginForm handleLogin={handleLogin} sendPasswordReset={sendPasswordReset} loading={loading} />
            </div>
            <div className='bg-cover bg-login col-span-4 shadow-2xl' />
        </div>
    )
}

export default Login