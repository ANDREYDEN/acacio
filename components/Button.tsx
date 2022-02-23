import React from 'react'

type ButtonVariant = 'primary' | 'secondary'

interface IPrimaryButton {
    label: string
    variant?: ButtonVariant
    onClick?: () => void
    loading?: boolean
    buttonClass?: string
}

const Button: React.FC<IPrimaryButton> = ({ label, variant = 'primary', onClick, loading, buttonClass }: IPrimaryButton) => {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={`font-bold rounded-md py-2 px-5 border-2 border-primary-blue ${buttonClass}
                ${variant === 'primary' ? 'bg-primary-blue text-white' : ''}
                ${variant === 'secondary' ? 'bg-white text-primary-blue' : ''}`}
        >
            <span>{loading ? 'Loading...' : label}</span>
        </button>
    )
}

export default Button