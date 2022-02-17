import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Home, Setting, TickSquare, User } from 'react-iconly'
import { AppRoutesType } from '@/interfaces'
import MenuItem from './MenuItem'

const AppRoutes: AppRoutesType = {
    Sales: {
        route: '/reports',
        icon: <Home />,
        iconFilled: <Home filled={true} />
    },
    People: {
        route: '/employees',
        icon: <User />,
        iconFilled: <User filled={true} />,
        subRoutes: {
            Employees: '',
            Shifts: '/shifts',
            Salary: '/salary',
        }
    },
    Inventory: {
        route: '/ingredients-movement',
        icon: <TickSquare />,
        iconFilled: <TickSquare filled={true} />
    },
    Settings: {
        route: '/settings',
        icon: <Setting />,
        iconFilled: <Setting filled={true} />
    },
}

const Menu: React.FC = ({ children }) => {
    const router = useRouter()
    const currentRoute = router.route

    if (currentRoute === '/') {
        return (<>{ children }</>)
    }

  return (
      <div className='flex'>
          <nav className='grid place-items-center h-screen w-64 bg-light-green mr-12'>
              <div className='absolute top-16'>
                  <Image src='/img/acacio.svg' alt='Logo' width={156} height={31} />
              </div>
              <ul className='text-primary-blue font-header font-extrabold'>
                  {Object.keys(AppRoutes).map((pageName, index) => {
                      const currentItem = AppRoutes[pageName]
                      return (
                          <div key={index} className='mb-8'>
                              <MenuItem currentItem={currentItem} currentRoute={currentRoute} pageName={pageName} />
                          </div>
                      )
                  })}
              </ul>
          </nav>
          { children }
      </div>
  )
}

export default Menu