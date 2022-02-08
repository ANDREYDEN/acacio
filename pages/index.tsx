import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../client'
import { useUser } from '../lib/hooks'

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
        <div className='h-screen grid grid-cols-5 grid-flow-row-dense'>
            <div className='col-span-2 flex flex-col justify-center mx-16'>
                <h1 className='text-2xl'>Welcome back</h1>
                <p>Welcome back! Please, sign in</p>
                <div>
                    <label htmlFor='email'>Email address</label>
                    <input
                        id='email'
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor='password'>Email address</label>
                    <input
                        id='password'
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>{ error }</div>
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        handleLogin()
                    }}
                    disabled={loading}
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
            <div className='bg-cover bg-login col-span-3 shadow-2xl' />
        </div>
    )
}

export default Login