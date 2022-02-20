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
    const { register, formState: { errors }, handleSubmit, clearErrors, setValue, trigger, control } = useForm({
        defaultValues: {
            'email': '',
            'password': ''
        }
    })
    const content = useTranslation()

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
                register={register('email', { required: content.login.form.email_required })}
                error={errors?.email && errors?.email?.message}
                onChange={() => clearErrors()}
                {...{ control, trigger }}
            />
            <TextInput
                type='password'
                name='password'
                label={content.login.form.password_label}
                placeholder={content.login.form.password_placeholder}
                textInputClass='mb-8'
                register={register('password', { required: content.login.form.password_required })}
                error={errors?.password && errors?.password?.message}
                onChange={() => clearErrors()}
                {...{ control, trigger }}
            />
            <PrimaryButton label={content.login.form.button} loading={loading}/>
        </form>
    )
}

export default LoginForm