import React from 'react'
import { useForm } from 'react-hook-form'
import TextInput from './TextInput'
import PrimaryButton from './PrimaryButton'
import { useTranslation } from 'react-i18next'

interface ILoginForm {
    handleLogin: (email: string, password: string) => Promise<void>
    loading: boolean
}

const LoginForm: React.FC<ILoginForm> = ({ handleLogin, loading }: ILoginForm) => {
    const { register, formState: { errors }, handleSubmit, clearErrors } = useForm()
    const { t } = useTranslation()

    const handleForm = async (data: any) => {
        await handleLogin(data.email, data.password)
    }
    
    return (
        <form className='flex flex-col' onSubmit={handleSubmit(handleForm)}>
            <TextInput
                type='email'
                name='email'
                label={t('login.form.email_label')}
                placeholder={t('login.form.email_label')}
                textInputClass='mb-8'
                register={register('email', { required: t('login.form.email_required') as string })}
                error={errors?.email && errors?.email?.message}
                onChange={() => clearErrors()}
            />
            <TextInput
                type='password'
                name='password'
                label={t('login.form.password_label')}
                placeholder={t('login.form.password_placeholder')}
                textInputClass='mb-8'
                register={register('password', { required: t('login.form.password_required') as string })}
                error={errors?.password && errors?.password?.message}
                onChange={() => clearErrors()}
            />
            <PrimaryButton label={t('login.form.button')} loading={loading}/>
        </form>
    )
}

export default LoginForm