import React, { ReactElement, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ChevronDown, ChevronUp, Home, IconProps, Setting, TickSquare, User } from 'react-iconly'

interface IRouteProps {
    route: string,
    icon: ReactElement<IconProps>,
    iconFilled: ReactElement<IconProps>,
    subRoutes?: Record<string, string>
}

type AppRoutesType = Record<string, IRouteProps>

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
    const [subRoutesOpened, setSubRoutesOpened] = useState(false)
    const currentRoute = router.route

    if (currentRoute === '/') {
        return (<>{ children }</>)
    }

    const SubRoutesList = (currentItem: any) => {
        return (
            <ul className='ml-6 mt-2'>
                {Object.keys(currentItem.subRoutes).map((route, index) => {
                    const currentSubItem = currentItem.subRoutes[route]
                    const fullPath = `${currentItem.route}${currentSubItem}`
                    return (
                        <li key={index} className='mb-2'>
                            <h6 className={`pl-6 ${currentRoute === fullPath ? 'underline' : ''}`}>
                                <Link href={fullPath}>{route}</Link>
                            </h6>
                        </li>
                    )
                })}
            </ul>
        )
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
                              <li className='flex'>
                                  {currentRoute === currentItem.route ? currentItem.iconFilled :currentItem.icon}
                                  <h5 className='pl-6'><Link href={currentItem.route}>{pageName}</Link></h5>
                                  {currentItem.subRoutes &&
                                      <div className='mt-1.5 ml-1' onClick={() => setSubRoutesOpened(!subRoutesOpened)}>
                                          {subRoutesOpened ? <ChevronDown stroke='bold' size='small' /> : <ChevronUp stroke='bold' size='small' />}
                                      </div>
                                  }
                              </li>
                              {currentItem.subRoutes && subRoutesOpened && SubRoutesList(currentItem)}
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