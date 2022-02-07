import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { supabase } from '../client'

const PasswordReset: NextPage = () => {
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const router = useRouter()

    const [error, setError] = useState('')

    const handlePasswordReset = async () => {
        try {
            setLoading(true)
            const access_token = supabase.auth.session()?.access_token
            if (!access_token) throw new Error('Invalid access_token')
            const { error } = await supabase.auth.api.updateUser(access_token, { password })
            if (error) throw new Error(error.message)
            
            router.replace('/')
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
                <div className='text-red-500'>{ error }</div>
                <div>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            handlePasswordReset()
                        }}
                        disabled={loading}
                    >
                        <span>{loading ? 'Loading...' : 'Reset Password'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PasswordReset