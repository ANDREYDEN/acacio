import { useTranslation } from '@lib/hooks'
import React from 'react'
import { useForm } from 'react-hook-form'
import PrimaryButton from './PrimaryButton'
import TextInput from './TextInput'

interface ILoginForm {
    handleLogin: (email: string, password: string) => Promise<void>
    loading: boolean
}

const LoginForm: React.FC<ILoginForm> = ({ handleLogin, loading }: ILoginForm) => {
    const content = useTranslation()
    const defaultValues = {
        'email': '',
        'password': ''
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
                {...{ control, trigger }}
            />
            <TextInput
                type='password'
                name='password'
                label={content.login.form.password_label}
                placeholder={content.login.form.password_placeholder}
                textInputClass='mb-8'
                {...{ control, trigger }}
            />
            <PrimaryButton label={content.login.form.button} loading={loading}/>
        </form>
    )
}

export default LoginForm