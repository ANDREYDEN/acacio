import React from 'react'

const Loader: React.FC = () => {
    return (
        <div id='loader' className='animate-spin flex justify-center items-center'>
            <div
                className='relative z-0 flex justify-center items-center h-44 w-44 rounded-full'
                style={{ background: 'conic-gradient(#649CD3 0deg, #649CD3 30deg, white 350deg)' }}
            >
                <div className='rounded-full h-28 w-28 bg-white' />
                <div className='absolute top-0 rounded-full h-8 w-8 bg-blue'/>
            </div>
        </div>
    )
}

export default Loader