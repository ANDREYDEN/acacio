import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Home, Setting, TickSquare, User } from 'react-iconly'

const Menu: React.FC = ({ children }) => {
    const router = useRouter()

    if (router.route === '/') {
        return (<>{ children }</>)
    }
    
  return (
      <div className='flex'>
          <nav className='grid place-items-center h-screen w-64 bg-light-green mr-12'>
              <div className='absolute top-16'>
                  <Image src='/img/acacio.svg' alt='Logo' width={156} height={31} />
              </div>
              <ul className='space-y-8 text-primary-blue font-header font-extrabold'>
                  <li className='flex'>
                      <Home />
                      <h5 className='pl-6'><Link href={'/sales'}>Sales</Link></h5>
                  </li>
                  <li className='flex'>
                      <User />
                      <h5 className='pl-6'><Link href={'/employees'}>People</Link></h5>
                  </li>
                  <li className='flex'>
                      <TickSquare />
                      <h5 className='pl-6'><Link href={'/inventory'}>Inventory</Link></h5>
                  </li>
                  <li className='flex'>
                      <Setting />
                      <h5 className='pl-6'><Link href={'/settings'}>Settings</Link></h5>
                  </li>
              </ul>
          </nav>
          { children }
      </div>
  )
}

export default Menu