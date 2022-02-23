import React, { ReactElement, useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '@components/Modal'
import Button from '@components/Button'
import { definitions } from '@types'
import TextInput from '@components/TextInput'
import ValidatedDropdown from '@components/ValidatedDropdown'
import { IDropdownOption } from '@interfaces'
import { useTranslation } from '@lib/hooks'

interface IAddEmployeeModal {
    addEmployee: (employee: Partial<definitions['employees']>) => Promise<void>
    toggleModal: (visible: boolean) => void
    toggleConfirmationModal: (visible: boolean) => void
    employeeRoles: definitions['employee_roles'][]
    revalidateEmployees: any
}

const AddEmployeeModal: React.FC<IAddEmployeeModal> = ({
    addEmployee, toggleModal, toggleConfirmationModal, employeeRoles, revalidateEmployees
}: IAddEmployeeModal) => {
    const [loading, setLoading] = useState(false)
    const content = useTranslation()

    const defaultValues = {
        first_name: '',
        last_name: '',
        role_id: undefined,
        birth_date: '',
        salary: '',
        income_percentage: '',
    }
    const { register, handleSubmit, trigger, control } = useForm({ defaultValues })
    register('first_name', { required: 'First name is required' })
    register('last_name')
    register('role_id', { required: 'Role is required' })
    register('birth_date')
    register('salary', {
        required: 'Salary is required',
        min: { value: 0, message: 'Cannot be negative' }
    })
    register('income_percentage', {
        required: 'Revenue percentage is required',
        min: { value: 0, message: 'Cannot be less than 0' },
        max: { value: 100, message: 'Cannot be more than 100' }
    })

    const preparedRolesOptions: IDropdownOption[] = employeeRoles.map(role => {
        return {
            value: role.id,
            label: `${role.name.at(0)?.toUpperCase()}${role.name.slice(1)}`
        }
    })

    const handleAddEmployee = async (data: any) => {
        setLoading(true)

        const newEmployee: Partial<definitions['employees']> = {
            first_name: data.first_name,
            last_name: data.last_name,
            role_id: data.role_id,
            birth_date: data.birth_date === '' ? null : data.birth_date,
            salary: data.salary,
            income_percentage: data.income_percentage
        }
        await addEmployee(newEmployee)
        toggleConfirmationModal(true)

        revalidateEmployees(newEmployee)
        toggleModal(false)
        setLoading(false)
    }
    
    const Header: ReactElement = <div>
        <h4>{content.employees.index.add_employee}</h4>
        <p className='text-dark-grey w-96'>{content.employees.index.add_modal.message}</p>
    </div>

    return <Modal
        header={Header}
        toggler={() => toggleModal(false)}
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

export default AddEmployeeModal