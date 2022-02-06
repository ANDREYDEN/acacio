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

    useEffect(() => {
        if (user) {
            router.replace('/employees')
        }
    }, [user, router])

    // @ts-ignore
    const handleLogin = async (email) => {
        try {
            setLoading(true)
            await supabase.auth.signIn({ email, password })
            router.replace('/employees')
        } catch (error) {
            // @ts-ignore
            alert(error.error_description || error.message)
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
                <div>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            handleLogin(email)
                        }}
                        disabled={loading}
                    >
                        <span>{loading ? 'Loading...' : 'Log In'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login