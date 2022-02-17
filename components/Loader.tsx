import React from 'react'

const Loader: React.FC = () => {
    return (
        <div id='loader' className='flex justify-center items-center'>
            <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mt-3' />
        </div>
    )
}

export default Loader