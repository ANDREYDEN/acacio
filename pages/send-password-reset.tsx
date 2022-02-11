import { NextPage } from 'next'
import { useState } from 'react'
import { supabase } from '../client'
import PrimaryButton from '../components/PrimaryButton'
import TextInput from '../components/TextInput'
import { useForm } from 'react-hook-form'

const SendPasswordReset: NextPage = () => {
    const { register, formState: { errors }, handleSubmit, clearErrors } = useForm()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSendPasswordReset = async (data: any) => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.api.resetPasswordForEmail(data.email, { redirectTo: `${window.location.origin}/password-reset` })
            if (error) throw new Error(error.message)
        } catch (error: any) {
            setError(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex justify-center text-center mt-8'>
            <form onSubmit={handleSubmit(handleSendPasswordReset)}>
                <div className='text-red-500'>{ error }</div>
                <TextInput
                    type='text'
                    name='email'
                    label='Email address'
                    placeholder='Enter your email address'
                    textInputClass='mb-6'
                    register={register('email', { required: 'Email is required' })}
                    error={errors?.email && errors?.email?.message}
                    onChange={() => clearErrors()}
                />
                <PrimaryButton label='Send Password Reset Email' loading={loading} />
            </form>
        </div>
    )
}

export default SendPasswordReset