import { NextPage } from 'next'
import { useState } from 'react'
import { supabase } from '../client'

const Login: NextPage = () => {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    // @ts-ignore
    const handleLogin = async (email) => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signIn({ email })
            if (error) throw error
            alert('Check your email for the login link!')
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
                </div>
                <div>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            handleLogin(email)
                        }}
                        disabled={loading}
                    >
                        <span>{loading ? 'Loading' : 'Send magic link'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login