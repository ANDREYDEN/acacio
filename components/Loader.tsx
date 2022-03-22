import React from 'react'

const Loader: React.FC = () => {
    return (
        <div id='loader' className='animate-spin flex justify-center items-center'>
            <div
                className='flex justify-center items-center rounded-full h-40 w-40
                    bg-gradient-to-r from-blue to-white'
            >
                <div className='rounded-full h-24 w-24 bg-white' />
            </div>
        </div>
    )
}

export default Loader