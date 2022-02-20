import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { supabase } from '@client'
import Button from '@components/Button'
import TextInput from '@components/TextInput'
import ErrorMessage from '@components/ErrorMessage'

const PasswordReset: NextPage = () => {
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handlePasswordReset = async () => {
        if (password !== confirmPassword) {
            setError('Passwords should match')
            return
        }

        try {
            setLoading(true)
            const access_token = supabase.auth.session()?.access_token
            if (!access_token) throw new Error('Invalid access_token')
            const { error } = await supabase.auth.api.updateUser(access_token, { password })
            if (error) throw new Error(error.message)

            toast('🦄 Password has been reset successfully')
            router.replace('/')
        } catch (error: any) {
            setError(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {error && <ErrorMessage message={error} errorMessageClass='w-96 mb-8' />}
            <div className='flex justify-center text-center mt-8'>
                <div className='w-96'>
                    <TextInput
                        type='password'
                        name='password'
                        label='Password'
                        placeholder='Enter New Password'
                        textInputClass='mb-6'
                        value={password}
                        onChange={(val) => {
                            setPassword(val)
                            setError('')
                        }}
                    />
                    <TextInput
                        type='password'
                        name='confirmPassword'
                        label='Confirm Password'
                        placeholder='Confirm New Password'
                        textInputClass='mb-8'
                        value={confirmPassword}
                        onChange={(val) => {
                            setConfirmPassword(val)
                            setError('')
                        }}
                    />
                    <Button label='Reset Password' onClick={handlePasswordReset} loading={loading} />
                </div>
            </div>
        </>
    )
}

export default PasswordReset