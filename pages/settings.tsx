import { supabase } from '@client'
import Loader from '@components/Loader'
import { useMounted } from '@lib/hooks'
import { enforceAuthenticated } from '@lib/utils'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import React from 'react'

export const getServerSideProps = enforceAuthenticated()

const Settings: NextPage = () => {
    const { mounted } = useMounted()
    const router = useRouter()
    const user = supabase.auth.user()

    if (!mounted) {
        return <Loader />
    }

    const getRadioIcon = (locale: string) => {
        if (router.locale === locale) {
            return <Image src='/img/radiobox_checked.svg' width={18} height={18} alt='LanguageChecked' />
        }
        return <Image src='/img/radiobox_unchecked.svg' width={18} height={18} alt='LanguageUnChecked' />
    }

    return (
        <div className='flex flex-col py-2 lg:mr-20 mr-10'>
            <h3 className='mb-8'>Settings</h3>
            <div className='flex rounded-xl border border-table-grey w-full p-10'>
                <h6 className='mr-12'>Language</h6>
                <div className='mr-8 flex justify-center'>
                    {getRadioIcon('en-CA')}
                    <span className='ml-2'><Link href={router.asPath} locale='en-CA'>ENG</Link></span>
                </div>
                <div className='flex justify-center'>
                    {getRadioIcon('ru-UA')}
                    <span className='ml-2'><Link href={router.asPath} locale='ru-UA'>RUS</Link></span>
                </div>
            </div>
        </div>
    )
}

export default Settings