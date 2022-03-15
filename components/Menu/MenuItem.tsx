import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'react-iconly'
import SubRoutesList from './SubRoutesList'
import { IMenuItem } from '@interfaces'

const MenuItem: React.FC<IMenuItem> = ({ currentItem, currentRoute, pageName }: IMenuItem) => {
    const [subRoutesOpened, setSubRoutesOpened] = useState(true)

    return (
        <>
            <li className='flex'>
                {currentRoute.includes(currentItem.route) ? currentItem.iconFilled :currentItem.icon}
                <h5 className='pl-6'><Link href={currentItem.route}>{pageName}</Link></h5>
                {currentItem.subRoutes &&
                    <div className='mt-1.5 ml-1' onClick={() => setSubRoutesOpened(!subRoutesOpened)}>
                        {subRoutesOpened ? <ChevronDown stroke='bold' size='small' /> : <ChevronUp stroke='bold' size='small' />}
                    </div>
                }
            </li>
            {currentItem.subRoutes && subRoutesOpened && SubRoutesList(currentItem, currentRoute)}
        </>
    )
}

export default MenuItem