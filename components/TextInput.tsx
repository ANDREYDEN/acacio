import React from 'react'

interface ITextInput {
    type: string
    name: string
    label: string
    placeholder: string
    onChange: (value: string) => void
    value?: string
    register?: any
    error?: string
    textInputClass?: string
}

const TextInput: React.FC<ITextInput> = ({ type, name, label, placeholder, onChange, value,
                                             register, error, textInputClass }: ITextInput) => {
    return (
        <div className={`flex flex-col text-secondary-text ${textInputClass}`}>
            <label htmlFor={name} className={`mb-2 font-bold ${error ? 'text-error' : ''}`}>
                {label}
            </label>
            <input
                {...register}
                id={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                className={`focus:outline-none rounded-lg px-6 py-2 text-primary-text placeholder-secondary-text
                    focus:border-dark-grey ${error ? 'border-2 border-error' : 'border border-grey'}`}
            />
            <p className='text-error text-sm'>{error}</p>
        </div>
    )
}

export default TextInput