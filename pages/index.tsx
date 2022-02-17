import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { supabase } from '@client'
import { useTranslation, useUser } from '@lib/hooks'
import LoginForm from '@components/LoginForm'
import Link from 'next/link'
import ErrorMessage from '@components/ErrorMessage'

const Login: NextPage = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const router = useRouter()
    const user = useUser()
    const content = useTranslation()

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

    return (
        <div className='h-screen grid grid-cols-7 grid-flow-row-dense'>
            <div className='col-span-3 flex flex-col justify-center mx-24'>
                <div className='absolute top-16'>
                    <Image src='/img/acacio.svg' alt='Logo' width={156} height={31} />
                </div>
                <h2>{content.login.welcome}</h2>
                <p className='mb-10 text-dark-grey'>{content.login.please_sign}</p>
                {error && <ErrorMessage message={error} errorMessageClass='mb-8 w-full' />}
                <LoginForm handleLogin={handleLogin} loading={loading} />
                <Link href={'/send-password-reset'} passHref>
                    <span className='underline text-center hover:cursor-pointer'>{content.login.forgot_password}</span>
                </Link>
            </div>
            <div className='bg-cover bg-login col-span-4 shadow-2xl' />
        </div>
    )
}

export default Login