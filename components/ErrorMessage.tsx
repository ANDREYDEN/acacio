import Image from 'next/image'
import React from 'react'

interface IErrorMessage {
    message: string
    errorMessageClass?: string
}

const ErrorMessage: React.FC<IErrorMessage> = ({ message, errorMessageClass }: IErrorMessage) => {
    return <div className='flex justify-center text-center'>
        <div className={`border border-error rounded-lg border-dashed px-10 py-6 w-full ${errorMessageClass}`}>
            <Image src='/img/error.svg' alt='Error' width={24} height={24} />
            <p className='text-error'>{ message }</p>
        </div>
    </div>
}

export default ErrorMessage