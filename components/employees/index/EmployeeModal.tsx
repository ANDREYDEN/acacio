import React, { ReactElement, useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '@components/Modal'
import Button from '@components/Button'
import { definitions } from '@types'
import TextInput from '@components/TextInput'
import ValidatedDropdown from '@components/ValidatedDropdown'
import { IDropdownOption } from '@interfaces'
import { useTranslation } from '@lib/hooks'

// TODO: pass down headers
interface IEmployeeModal {
    onUpsertEmployee: (currentEmployee: Partial<definitions['employees']>) => Promise<void>
    onSuccess: () => void
    onClose: () => void
    employeeRoles: definitions['employee_roles'][]
    employee?: Partial<definitions['employees']>
}

const EmployeeModal: React.FC<IEmployeeModal> = ({ onUpsertEmployee, onSuccess, onClose, employeeRoles, employee }: IEmployeeModal) => {
    const [loading, setLoading] = useState(false)
    const content = useTranslation()

    const defaultValues: Partial<definitions['employees']> = employee ?? {
        first_name: '',
        last_name: '',
        role_id: undefined,
        birth_date: '',
        salary: 0,
        income_percentage: 0,
    }
    const { register, handleSubmit, trigger, control } = useForm({ defaultValues })
    register('first_name', { required: content.employees.index.add_modal.first_name_required })
    register('last_name')
    register('role_id', { required: content.employees.index.add_modal.role_required })
    register('birth_date')
    register('salary', {
        required: content.employees.index.add_modal.salary_required,
        min: { value: 0, message: content.employees.index.add_modal.salary_negative }
    })
    register('income_percentage', {
        required: content.employees.index.add_modal.income_percentage_required,
        min: { value: 0, message: content.employees.index.add_modal.min_revenue },
        max: { value: 100, message: content.employees.index.add_modal.max_revenue }
    })

    const preparedRolesOptions: IDropdownOption[] = employeeRoles.map(role => {
        return {
            value: role.id,
            label: `${role.name.at(0)?.toUpperCase()}${role.name.slice(1)}`
        }
    })

    const handleAddEmployee = async (data: any) => {
        setLoading(true)

        const currentEmployee: Partial<definitions['employees']> = {
            first_name: data.first_name,
            last_name: data.last_name,
            role_id: data.role_id,
            birth_date: data.birth_date === '' ? null : data.birth_date,
            salary: data.salary,
            income_percentage: data.income_percentage
        }
        if (employee) currentEmployee.id = employee.id

        await onUpsertEmployee(currentEmployee)

        onSuccess()
        setLoading(false)
    }
    
    const Header: ReactElement = <div>
        <h4>{content.employees.index.add_employee}</h4>
        <p className='text-dark-grey w-96'>{content.employees.index.add_modal.message}</p>
    </div>

    return <Modal
        header={Header}
        toggler={() => onClose()}
        closable={true}
    >
        <form className='w-116' onSubmit={handleSubmit(handleAddEmployee)}>
            <TextInput
                type='text'
                name='first_name'
                label={content.employees.index.add_modal.first_name}
                placeholder={content.employees.index.add_modal.first_name_placeholder}
                textInputClass='mb-6'
                control={control}
                trigger={trigger}
            />
            <TextInput
                type='text'
                name='last_name'
                label={content.employees.index.add_modal.last_name}
                placeholder={content.employees.index.add_modal.last_name_placeholder}
                textInputClass='mb-6'
                control={control}
                trigger={trigger}
            />
            <ValidatedDropdown
                label={content.employees.index.add_modal.role}
                name='role_id'
                data={preparedRolesOptions}
                defaultOption={content.employees.index.add_modal.role_placeholder}
                control={control}
                dropdownClass='mb-6'
            />
            <TextInput
                type='date'
                name='birth_date'
                label={content.employees.index.add_modal.birth_date}
                textInputClass='mb-6'
                control={control}
                trigger={trigger}
            />
            <TextInput
                type='number'
                name='salary'
                label={content.employees.index.add_modal.salary}
                placeholder={content.employees.index.add_modal.salary_placeholder}
                textInputClass='mb-6'
                control={control}
                trigger={trigger}
            />
            <TextInput
                type='number'
                name='income_percentage'
                label={content.employees.index.add_modal.income_percentage}
                placeholder='0%'
                textInputClass='mb-10'
                control={control}
                trigger={trigger}
            />
            <Button label={content.employees.index.add_employee} loading={loading} buttonClass='w-full' />
        </form>
    </Modal>
}

export default EmployeeModal