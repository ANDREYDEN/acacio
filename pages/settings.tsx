import { supabase } from '@client'
import Button from '@components/Button'
import Loader from '@components/Loader'
import { useMounted } from '@lib/hooks'
import { enforceAuthenticated } from '@lib/utils'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const getServerSideProps = enforceAuthenticated()

const Settings: NextPage = () => {
    const { mounted } = useMounted()
    const router = useRouter()
    const user = supabase.auth.user()

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

    if (!mounted) {
        return <Loader />
    }

    return (
        <div className='text-center'>
            <div>
                <p className='mb-4'><b>User Email:</b> {user?.email}</p>
                <Button label='Log Out' onClick={handleLogOut} />
            </div>
            <div>
                <Link href={router.asPath} locale='ru-UA'>Russian</Link>
                <Link href={router.asPath} locale='en-CA'>English</Link>
            </div>
        </div>
    )
}

export default Settings