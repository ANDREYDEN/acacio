import React from 'react'

interface ITextInput {
    type: string
    value: string
    name: string
    label: string
    placeholder: string
    onChange: () => void
    error: string
}

const TextInput: React.FC<ITextInput> = ({ type, value, label, name, placeholder, onChange, error }: ITextInput) => {
    return (
        <div className='flex flex-col text-secondary-text'>
            <label htmlFor={name} className='text-sm'>
                {label}
            </label>
            <input
                id={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`focus:outline-none rounded-md text-primary-text h-10 p-4 placeholder-secondary-text
                    border border-secondary-text focus:border-primary-green 
                    ${error ? 'border-2 border-dark-peach' : 'border border-secondary-text'}`}
            />
        </div>
    )
}

export default TextInput