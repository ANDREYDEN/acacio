import React from 'react'

interface ITextInput {
    type: string
    value: string
    name: string
    label: string
    placeholder: string
    onChange: (value: string) => void
    error?: string
    textInputClass?: string
}

const TextInput: React.FC<ITextInput> = ({ type, value, label, name, placeholder, onChange, error, textInputClass }: ITextInput) => {
    return (
        <div className={`flex flex-col text-secondary-text ${textInputClass}`}>
            <label htmlFor={name} className='mb-2 font-bold'>
                {label}
            </label>
            <input
                id={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                className={`focus:outline-none rounded-lg px-6 py-2 text-primary-text placeholder-secondary-text
                    focus:border-dark-grey ${error ? 'border-2 border-error' : 'border border-grey'}`}
            />
        </div>
    )
}

export default TextInput