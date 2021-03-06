import React, { useEffect } from 'react'
import { useController } from 'react-hook-form'

interface ITextInput {
    type: string
    name: string
    label: string
    control: any
    trigger: any
    placeholder?: string
    value?: string
    textInputClass?: string
}

const TextInput: React.FC<ITextInput> = ({
    type, name, label, placeholder, value = '', textInputClass, control, trigger
}: ITextInput) => {
    const { field, fieldState, formState: { errors } } = useController({ name, control })
    const error = errors[name]?.message

    useEffect(() => {
        if (field.value !== value && !fieldState.isTouched) {
            trigger(name, { shouldFocus: true })
        }
    }, [value, field.value, fieldState.isTouched, trigger, name])

    return (
        <div className={`flex flex-col ${textInputClass}`}>
            <label htmlFor={name} className={`mb-2 font-bold ${error ? 'text-error' : ''}`}>
                {label}
            </label>
            <input
                id={name}
                type={type}
                placeholder={placeholder}
                className={`outline-none rounded-lg px-6 py-2 text-primary-text placeholder-dark-grey focus:border-dark-grey
                    ${error ? 'border-2 border-error' : 'border border-grey'}`}
                {...field}
            />
            <p className='text-error text-sm'>{error}</p>
        </div>
    )
}

export default TextInput