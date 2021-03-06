import React, { useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import { supabase } from '@client'
import { Button, ConfirmationModal, ErrorMessage, Loader, TextInput } from '@components'
import { useMounted } from '@lib/hooks'
import { enforceAuthenticated } from '@lib/utils'

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['settings', 'common']),
    },
}))

const Settings: NextPage = () => {
    const { mounted } = useMounted()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const router = useRouter()
    const { t } = useTranslation('settings')

    const defaultValues = {
        newPassword: '',
        confirmPassword: ''
    }
    const { register, handleSubmit, trigger, control, setValue } = useForm({ defaultValues })
    register('newPassword', { required: t('password.new_required').toString() })
    register('confirmPassword', { required: t('password.confirm_required').toString() })

    if (!mounted) {
        return <Loader />
    }

    const getRadioIcon = (locale: string) => {
        if (router.locale === locale) {
            return <Image src='/img/radiobox_checked.svg' width={18} height={18} alt='LanguageChecked' />
        }
        return <Image src='/img/radiobox_unchecked.svg' width={18} height={18} alt='LanguageUnChecked' />
    }

    const handleForm = async (data: any) => {
        setError('')
        try {
            setLoading(true)
            if (data.newPassword !== data.confirmPassword) {
                throw new Error(t('password.match_error').toString())
            }

            const { error } = await supabase.auth.update({ password: data.newPassword })
            if (error) throw new Error(error.message)
            setShowConfirmationModal(true)
        } catch (error: any) {
            setError(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex flex-col'>
            {showConfirmationModal &&
                <ConfirmationModal
                    header={t('password.success_header')}
                    message={t('password.success_message')}
                    toggleModal={() => {
                        setShowConfirmationModal(false)
                        setValue('newPassword', '')
                        setValue('confirmPassword', '')
                    }}
                />
            }

            <h3 className='mb-8'>{t('header').toString()}</h3>
            <div className='flex rounded-xl border border-table-grey w-full p-10 mb-8'>
                <h6 className='mr-12'>{t('language').toString()}</h6>
                <div className='mr-8 flex justify-center'>
                    {getRadioIcon('en-CA')}
                    <span className='ml-2'><Link href={router.asPath} locale='en-CA'>ENG</Link></span>
                </div>
                <div className='flex justify-center'>
                    {getRadioIcon('ru-UA')}
                    <span className='ml-2'><Link href={router.asPath} locale='ru-UA'>RUS</Link></span>
                </div>
            </div>
            <div className='flex flex-col rounded-xl border border-table-grey w-full p-10'>
                <h6 className='mr-12 mb-8'>{t('password.header').toString()}</h6>
                {loading && <Loader />}

                <form className='w-96' onSubmit={handleSubmit(handleForm)}>
                    {error && <ErrorMessage message={error} errorMessageClass='mb-8' />}
                    <TextInput
                        type='password'
                        name='newPassword'
                        label={t('password.new')}
                        placeholder={t('password.new_placeholder')}
                        textInputClass='mb-8'
                        control={control}
                        trigger={trigger}
                    />
                    <TextInput
                        type='password'
                        name='confirmPassword'
                        label={t('password.confirm')}
                        placeholder={t('password.confirm')}
                        textInputClass='mb-8'
                        control={control}
                        trigger={trigger}
                    />
                    <Button label={t('save', { ns: 'common' })} buttonClass='w-full' />
                </form>
            </div>
        </div>
    )
}

export default Settings