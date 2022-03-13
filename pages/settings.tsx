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

    const handleLogOut = async () => {
        await supabase.auth.signOut()
        router.replace('/')
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