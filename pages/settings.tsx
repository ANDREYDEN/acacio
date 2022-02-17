import { NextPage } from 'next'
import { supabase } from '@/client'
import { useRouter } from 'next/router'
import { useMounted, useUser } from '@/lib/hooks'
import Loader from '@/components/Loader'
import PrimaryButton from '@/components/PrimaryButton'

const Settings: NextPage = () => {
    const { mounted } = useMounted()
    const user = useUser()
    const router = useRouter()

    const handleLogOut = async () => {
        await supabase.auth.signOut()
        router.replace('/')
    }

    if (!user || !mounted) {
        return (<Loader />)
    }

    return (
      <div className='text-center'>
          <div>
              <p className='mb-4'><b>User Email:</b> {user.email}</p>
              <PrimaryButton label='Log Out' onClick={handleLogOut} />
          </div>
      </div>
    )
}

export default Settings