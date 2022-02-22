import React from 'react'
import { useController } from 'react-hook-form'
import { IValidatedDropdown } from '@interfaces'

// TODO: use headless ui to style dropdown better
const ValidatedDropdown: React.FC<IValidatedDropdown> = ({
    label, name, data, control, defaultOption, dropdownClass
}: IValidatedDropdown) => {
    const { field, formState: { errors } } = useController({ name, control })
    const error = errors[name]?.message

    return (
        <div className={`flex flex-col text-secondary-text ${dropdownClass}`}>
            <label htmlFor={name} className='mb-2 font-bold'>
                {label}
            </label>
            <select
                id={name}
                className={`focus:outline-none rounded-lg px-6 py-2 text-primary-text placeholder-secondary-text
                    focus:border-dark-grey ${error ? 'border-2 border-error' : 'border border-grey'}`}
                {...field}
            >
                <option value={undefined}>{defaultOption}</option>
                {data.map(item =>
                    <option key={item.value} value={item.value}>
                        {item.label}
                    </option>
                )}
            </select>
            <p className='text-error text-sm'>{error}</p>
        </div>
    )
}

export default ValidatedDropdown