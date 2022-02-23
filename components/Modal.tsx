import React, { ReactElement } from 'react'
import Image from 'next/image'

interface IModal {
    children: ReactElement
    toggler: () => void
    closable: boolean
    header?: ReactElement
    footer?: ReactElement
}

const Modal: React.FC<IModal> = ({ header, children, closable, footer, toggler }: IModal) => {
    return (
        <>
            <div
                className='grid place-items-center py-6 overflow-y-auto fixed inset-0 z-50'
                onClick={toggler}
            >
                <div className='w-auto p-10 rounded-xl shadow-2xl flex flex-col bg-white'
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={`flex mb-6 ${ header ? 'items-start justify-between' : 'justify-end'}`}>
                        {header}
                        {closable && <button onClick={toggler}>
                            <Image src='/img/cross.svg' alt='Logo' width={17} height={17} />
                        </button>}
                    </div>
                    <div className='w-full mb-10 grid place-items-center'>{children}</div>
                    <div className='text-center'>{footer}</div>
                </div>
            </div>
            <div className='fixed inset-0 z-40 bg-light-blue bg-opacity-70' />
        </>
    )
}

export default Modal