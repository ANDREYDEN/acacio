import React from 'react'
import { useForm } from 'react-hook-form'
import TextInput from './TextInput'
import Button from './Button'
import { useTranslation } from 'next-i18next'

interface ILoginForm {
    handleLogin: (email: string, password: string) => Promise<void>
    loading: boolean
}

const LoginForm: React.FC<ILoginForm> = ({ handleLogin, loading }: ILoginForm) => {
    const { t } = useTranslation('login')
    const defaultValues = {
        email: '',
        password: ''
    }
    const { register, handleSubmit, trigger, control } = useForm({ defaultValues })
    register('email', { required: t('form.email_updated').toString() })
    register('password', { required: t('form.password_required').toString() })

    const handleForm = async (data: any) => {
        await handleLogin(data.email, data.password)
    }
    
    return (
        <form className='flex flex-col' onSubmit={handleSubmit(handleForm)}>
            <TextInput
                type='email'
                name='email'
                label={t('form.email_label')}
                placeholder={t('form.email_label')}
                textInputClass='mb-8'
                control={control}
                trigger={trigger}
            />
            <TextInput
                type='password'
                name='password'
                label={t('form.password_label')}
                placeholder={t('form.password_placeholder')}
                textInputClass='mb-8'
                control={control}
                trigger={trigger}
            />
            <Button label={t('form.button')} loading={loading} buttonClass='mb-8' />
        </form>
    )
}

export default LoginForm