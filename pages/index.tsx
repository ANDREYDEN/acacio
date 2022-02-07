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
        <div className="text-center">
            <div>
                <p>Sign in via magic link with your email below</p>
                <div>
                    <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="Password"
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
                    <span>{loading ? 'Loading...' : 'Log In'}</span>
                </button>
                <br />
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        sendPasswordReset()
                    }}
                    disabled={loading}
                >
                    Forgot Password?
                </button>
            </div>
        </div>
    )
}

export default Login