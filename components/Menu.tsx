import React, { ReactElement } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Home, IconProps, Setting, TickSquare, User } from 'react-iconly'

const AppRoutes: Record<string, { route: string, icon: ReactElement<IconProps>, iconFilled: ReactElement<IconProps> }> = {
    Sales: {
        route: '/reports',
        icon: <Home />,
        iconFilled: <Home filled={true} />
    },
    People: {
        route: '/employees',
        icon: <User />,
        iconFilled: <User filled={true} />
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
              <ul className='space-y-8 text-primary-blue font-header font-extrabold'>
                  {Object.keys(AppRoutes).map((pageName, index) => {
                      const currentItem = AppRoutes[pageName]
                      return (
                          <li key={index} className='flex'>
                              {currentRoute === currentItem.route ? currentItem.iconFilled :currentItem.icon}
                              <h5 className='pl-6'><Link href={currentItem.route}>{pageName}</Link></h5>
                          </li>
                      )
                  })}
              </ul>
          </nav>
          { children }
      </div>
  )
}

export default Menu