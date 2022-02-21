import React, { useEffect } from 'react'
import { useController } from 'react-hook-form'

interface ITextInput {
    type: string
    name: string
    label: string
    placeholder: string
    value?: string
    control: any
    trigger: any
    error?: string
    textInputClass?: string
}

const TextInput: React.FC<ITextInput> = ({ 
    type, name, label, placeholder, value = '', error, textInputClass, control, trigger
}: ITextInput) => {
    const { field, fieldState } = useController({ name, control })

    useEffect(() => {
        if (field.value !== value && !fieldState.isTouched) {
            trigger(name, { shouldFocus: true })
        }
    }, [value, field.value, fieldState.isTouched, trigger, name])

    return (
        <div className={`flex flex-col text-secondary-text ${textInputClass}`}>
            <label htmlFor={name} className={`mb-2 font-bold ${error ? 'text-error' : ''}`}>
                {label}
            </label>
            <input
                id={name}
                type={type}
                placeholder={placeholder}
                className={`focus:outline-none rounded-lg px-6 py-2 text-primary-text placeholder-secondary-text
                    focus:border-dark-grey ${error ? 'border-2 border-error' : 'border border-grey'}`}
                {...field}
            />
            <p className='text-error text-sm'>{error}</p>
        </div>
    )
}

export default TextInput