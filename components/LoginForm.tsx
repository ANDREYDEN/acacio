import React from 'react'
import { useForm } from 'react-hook-form'
import TextInput from './TextInput'
import Button from './Button'
import { useTranslation } from '@lib/hooks'

interface ILoginForm {
    handleLogin: (email: string, password: string) => Promise<void>
    loading: boolean
}

const LoginForm: React.FC<ILoginForm> = ({ handleLogin, loading }: ILoginForm) => {
    const content = useTranslation()
    const defaultValues = {
        email: '',
        password: ''
    }
    const { register, handleSubmit, trigger, control } = useForm({ defaultValues })
    register('email', { required: content.login.form.email_required })
    register('password', { required: content.login.form.password_required })

    const handleForm = async (data: any) => {
        await handleLogin(data.email, data.password)
    }
    
    return (
        <form className='flex flex-col' onSubmit={handleSubmit(handleForm)}>
            <TextInput
                type='email'
                name='email'
                label={content.login.form.email_label}
                placeholder={content.login.form.email_label}
                textInputClass='mb-8'
                control={control}
                trigger={trigger}
            />
            <TextInput
                type='password'
                name='password'
                label={content.login.form.password_label}
                placeholder={content.login.form.password_placeholder}
                textInputClass='mb-8'
                control={control}
                trigger={trigger}
            />
            <Button label={content.login.form.button} loading={loading} buttonClass='mb-8' />
        </form>
    )
}

export default LoginForm