import React from 'react'
import { useForm } from 'react-hook-form'
import TextInput from './TextInput'
import Button from './Button'
import { useTranslation } from '@lib/hooks'

interface IInviteForm {
    handleInvite: (email: string) => Promise<void>
    loading: boolean
}

const InviteForm: React.FC<IInviteForm> = ({ handleInvite: handleLogin, loading }: IInviteForm) => {
    const content = useTranslation()
    const defaultValues = {
        email: '',
    }
    const { register, handleSubmit, trigger, control } = useForm({ defaultValues })
    register('email', { required: 'asd' })

    const handleForm = async (data: any) => {
        await handleLogin(data.email)
    }
    
    return (
        <form className='flex flex-col' onSubmit={handleSubmit(handleForm)}>
            <TextInput
                type='email'
                name='email'
                label={content.invite.form.email_label}
                placeholder={content.invite.form.email_label}
                textInputClass='mb-8'
                control={control}
                trigger={trigger}
            />
            <Button label={content.invite.form.button} loading={loading}/>
        </form>
    )
}

export default InviteForm