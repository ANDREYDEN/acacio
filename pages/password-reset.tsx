import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { supabase } from '@client'
import PrimaryButton from '@components/PrimaryButton'
import TextInput from '@components/TextInput'
import ErrorMessage from '@components/ErrorMessage'
import { useForm } from 'react-hook-form'
import { useTranslation } from '@lib/hooks'

const PasswordReset: NextPage = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const content = useTranslation()

    const defaultValues = {
        password: '',
        confirmPassword: ''
    }
    const { register, handleSubmit, trigger, control } = useForm({ defaultValues })
    register('password', { required: content.reset_password.password_required })

    const handleForm = async (data: any) => {
        await handlePasswordReset(data.password, data.confirmPassword)
    }

    const handlePasswordReset = async (password: string, confirmPassword: string) => {
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
                <form className='w-96' onSubmit={handleSubmit(handleForm)}>
                    <TextInput
                        type='password'
                        name='password'
                        label='Password'
                        placeholder='Enter New Password'
                        textInputClass='mb-6'
                        {...{ control, trigger }}
                    />
                    <TextInput
                        type='password'
                        name='confirmPassword'
                        label='Confirm Password'
                        placeholder='Confirm New Password'
                        textInputClass='mb-8'
                        {...{ control, trigger }}
                    />
                    <PrimaryButton label='Reset Password' loading={loading} />
                </form>
            </div>
        </>
    )
}

export default PasswordReset