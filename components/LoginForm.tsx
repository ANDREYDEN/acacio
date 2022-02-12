import React from 'react'
import { useForm } from 'react-hook-form'
import TextInput from './TextInput'
import PrimaryButton from './PrimaryButton'

interface ILoginForm {
    handleLogin: (email: string, password: string) => Promise<void>
    loading: boolean
}

const LoginForm: React.FC<ILoginForm> = ({ handleLogin, loading }: ILoginForm) => {
    const { register, formState: { errors }, handleSubmit, clearErrors } = useForm()
    const handleForm = async (data: any) => {
        await handleLogin(data.email, data.password)
    }
    
    return (
        <form className='flex flex-col' onSubmit={handleSubmit(handleForm)}>
            <TextInput
                type='email'
                name='email'
                label='Email address'
                placeholder='Enter your email address'
                textInputClass='mb-8'
                register={register('email', { required: 'Email is required' })}
                error={errors?.email && errors?.email?.message}
                onChange={() => clearErrors()}
            />
            <TextInput
                type='password'
                name='password'
                label='Password'
                placeholder='Enter your password'
                textInputClass='mb-8'
                register={register('password', { required: 'Password is required' })}
                error={errors?.password && errors?.password?.message}
                onChange={() => clearErrors()}
            />
            <PrimaryButton label='Sign In' loading={loading}/>
        </form>
    )
}

export default LoginForm