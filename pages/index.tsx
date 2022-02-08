import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../client'
import { useUser } from '../lib/hooks'
import TextInput from '../components/TextInput'

const Login: NextPage = () => {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const user = useUser()
    const [error, setError] = useState('')
    
    useEffect(() => {
        if (user) {
            router.replace('/employees')
        }
    }, [user, router])

    const handleLogin = async () => {
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

    const sendPasswordReset = async () => {
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
                <h1>Welcome back</h1>
                <p className='mb-10 text-dark-grey'>Welcome back! Please, sign in</p>
                <div>
                    <TextInput
                        type='email'
                        value={email}
                        name='email'
                        label='Email address'
                        placeholder='Enter your email address'
                        onChange={email => setEmail(email)}
                        textInputClass='mb-8'
                    />
                    <TextInput
                        type='password'
                        value={password}
                        name='password'
                        label='Password'
                        placeholder='Enter your password'
                        onChange={password => setPassword(password)}
                        textInputClass='mb-8'
                    />
                </div>
                <div>{ error }</div>
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        handleLogin()
                    }}
                    disabled={loading}
                    className='bg-primary-blue text-white font-bold rounded py-2 mb-8'
                >
                    <span>{loading ? 'Loading...' : 'Sign In'}</span>
                </button>
                <button
                    className='underline'
                    onClick={(e) => {
                        e.preventDefault()
                        sendPasswordReset()
                    }}
                    disabled={loading}
                >
                    Forgot Password?
                </button>
            </div>
            <div className='bg-cover bg-login col-span-4 shadow-2xl' />
        </div>
    )
}

export default Login