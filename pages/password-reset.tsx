import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useUser } from '../lib/hooks'

const PasswordReset: NextPage = () => {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const router = useRouter()
    const user = useUser()

    useEffect(() => {
        if (user) {
            router.replace('/employees')
        }
    }, [user, router])

    const handlePasswordReset = async () => {
        try {
            router.replace('/employees')
        } catch (error: any) {
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
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            handlePasswordReset()
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

export default PasswordReset