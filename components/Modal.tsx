import React, { ReactElement } from 'react'
import Image from 'next/image'

interface IModal {
    children: ReactElement
    header?: ReactElement
    footer?: ReactElement
    toggler?: () => void
}

const Modal: React.FC<IModal> = ({ header, children, footer, toggler }: IModal) => {
    return (
        <>
            <div
                className='grid place-items-center py-6 fixed inset-0 z-50'
                onClick={toggler}
            >
                <div className='w-auto p-10 rounded-xl shadow-2xl flex flex-col bg-white max-h-screen overflow-y-auto'
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={`flex mb-6 ${ header ? 'items-start justify-between' : 'justify-end'}`}>
                        {header}
                        {toggler && <button onClick={toggler}>
                            <Image src='/img/cross.svg' alt='Logo' width={17} height={17} />
                        </button>}
                    </div>
                    <div className='w-full grid place-items-center'>{children}</div>
                    {footer && <div className='text-center mt-10'>{footer}</div>}
                </div>
            </div>
            <div className='fixed inset-0 z-40 bg-light-blue bg-opacity-70' />
        </>
    )
}

export default Modal