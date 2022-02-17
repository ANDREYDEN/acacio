import Link from 'next/link'
import React from 'react'
import { IRouteProps } from '@/interfaces'

const SubRoutesList = (currentItem: IRouteProps, currentRoute: string) => {
    if (!currentItem.subRoutes) {
        return
    }

    return (
        <ul className='ml-6 mt-2'>
            {Object.keys(currentItem.subRoutes).map((route, index) => {
                const currentSubItem = currentItem.subRoutes![route]
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

export default SubRoutesList