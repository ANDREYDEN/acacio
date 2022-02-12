import React from 'react'

interface IPrimaryButton {
    label: string
    onClick?: () => void
    loading?: boolean
}

const PrimaryButton: React.FC<IPrimaryButton> = ({ label, onClick, loading }: IPrimaryButton) => {
  return (
      <button
          onClick={onClick}
          disabled={loading}
          className='bg-primary-blue text-white font-bold rounded py-2 px-10 mb-8'
      >
          <span>{loading ? 'Loading...' : label}</span>
      </button>
  )
}

export default PrimaryButton