import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '@client'
import { useMounted, useUser } from '@lib/hooks'
import Loader from '@components/Loader'
import Button from '@components/Button'

const Settings: NextPage = () => {
    const { mounted } = useMounted()
    const user = useUser()
    const router = useRouter()

    const handleLogOut = async () => {
        await supabase.auth.signOut()
        router.replace('/')
    }

    if (!user || !mounted) {
        return <Loader />
    }

    return (
        <div className='text-center'>
            <div>
                <p className='mb-4'><b>User Email:</b> {user.email}</p>
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