import { supabase } from '@client'
import ErrorMessage from '@components/ErrorMessage'
import InviteForm from '@components/InviteForm'
import Loader from '@components/Loader'
import { useMounted, useTranslation, useUser } from '@lib/hooks'
import { NextPage } from 'next'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const Login: NextPage = () => {
    const { mounted } = useMounted()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const user = useUser()
    const content = useTranslation()

    const handleInvite = async (email: string) => {
        try {
            setLoading(true)
            const password = Buffer.from(Date.now().toString(), 'utf-8').toString('base64')
            const { error } = await supabase.auth.api.inviteUserByEmail(email, { redirectTo: `${window.location.origin}/password-reset` })
            if (error) throw new Error(error.message)
            toast(content.invite.confirmation_toast + password)
        } catch (error: any) {
            setError(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    if (!mounted) {
        return <Loader />
    }

    if (!user) {
        return <div>Unauthorized</div>
    }

    return (
        <>
            {error && <ErrorMessage message={error} errorMessageClass='mb-8 w-full' />}
            <p className='mb-10 text-dark-grey'>{content.invite.title}</p>
            <div className='flex mt-8'>
                <InviteForm handleInvite={handleInvite} loading={loading} />
            </div>
        </>
    )
}

export default Login