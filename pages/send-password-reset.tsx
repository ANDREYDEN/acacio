import { NextPage } from 'next'
import React, { useState } from 'react'
import { supabase } from '@client'
import PrimaryButton from '@components/PrimaryButton'
import TextInput from '@components/TextInput'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import ErrorMessage from '@components/ErrorMessage'

const SendPasswordReset: NextPage = () => {
    const defaultValues = {
        email: ''
    }
    const { register, handleSubmit, control, trigger } = useForm({ defaultValues })
    register('email', { required: 'Email is required' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSendPasswordReset = async (data: any) => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.api.resetPasswordForEmail(data.email, { redirectTo: `${window.location.origin}/password-reset` })
            if (error) {
                throw new Error(error.message)
            } else {
                toast('🦄 Check your email for the reset link')
            }
        } catch (error: any) {
            setError(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex justify-center text-center mt-8'>
            <form onSubmit={handleSubmit(handleSendPasswordReset)}>
                {error && <ErrorMessage message={error} errorMessageClass='w-96 mb-8' />}
                <TextInput
                    type='text'
                    name='email'
                    label='Email address'
                    placeholder='Enter your email address'
                    textInputClass='mb-6'
                    control={control}
                    trigger={trigger}
                />
                <PrimaryButton label='Send Password Reset Email' loading={loading} />
            </form>
        </div>
    )
}

export default SendPasswordReset