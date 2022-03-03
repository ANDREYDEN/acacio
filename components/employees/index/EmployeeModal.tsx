import React, { ReactElement, useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '@components/Modal'
import Button from '@components/Button'
import { definitions } from '@types'
import TextInput from '@components/TextInput'
import ValidatedDropdown from '@components/ValidatedDropdown'
import { IDropdownOption } from '@interfaces'
import { useTranslation } from 'next-i18next'

interface IEmployeeModal {
    onUpsertEmployee: (currentEmployee: Partial<definitions['employees']>) => Promise<void>
    onSuccess: () => void
    onClose: () => void
    employeeRoles: definitions['employee_roles'][]
    employee?: Partial<definitions['employees']>
}

const EmployeeModal: React.FC<IEmployeeModal> = ({
    onUpsertEmployee, onSuccess, onClose, employeeRoles, employee
}: IEmployeeModal) => {
    const [loading, setLoading] = useState(false)
    const { t } = useTranslation('employees')

    const defaultValues: Partial<definitions['employees']> = employee ?? {
        first_name: '',
        last_name: '',
        role_id: undefined,
        birth_date: '',
        salary: 0,
        income_percentage: 0,
    }
    const { register, handleSubmit, trigger, control } = useForm({ defaultValues })
    register('first_name', { required: t('modal.first_name_required').toString() })
    register('last_name')
    register('role_id', { required: t('modal.role_required').toString() })
    register('birth_date')
    register('salary', {
        required: t('modal.salary_required').toString(),
        min: { value: 0, message: t('modal.salary_negative').toString() }
    })
    register('income_percentage', {
        required: t('modal.income_percentage_required').toString(),
        min: { value: 0, message: t('modal.min_revenue').toString() },
        max: { value: 100, message: t('modal.max_revenue').toString() }
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
        <h4>
            {employee ? t('edit_employee') : t('add_employee')}
        </h4>
        <p className='text-dark-grey w-96'>
            {employee ? t('modal.edit_message') : t('modal.add_message')}
        </p>
    </div>

    return <Modal
        header={Header}
        toggler={onClose}
    >
        <form className='w-116' onSubmit={handleSubmit(handleAddEmployee)}>
            <TextInput
                type='text'
                name='first_name'
                label={t('modal.first_name')}
                placeholder={t('modal.first_name_placeholder')}
                textInputClass='mb-6'
                control={control}
                trigger={trigger}
            />
            <TextInput
                type='text'
                name='last_name'
                label={t('modal.last_name')}
                placeholder={t('modal.last_name_placeholder')}
                textInputClass='mb-6'
                control={control}
                trigger={trigger}
            />
            <ValidatedDropdown
                label={t('modal.role')}
                name='role_id'
                data={preparedRolesOptions}
                defaultOption={t('modal.role_placeholder')}
                control={control}
                dropdownClass='mb-6'
            />
            <TextInput
                type='date'
                name='birth_date'
                label={t('modal.birth_date')}
                textInputClass='mb-6'
                control={control}
                trigger={trigger}
            />
            <TextInput
                type='number'
                name='salary'
                label={t('modal.salary')}
                placeholder={t('modal.salary_placeholder')}
                textInputClass='mb-6'
                control={control}
                trigger={trigger}
            />
            <TextInput
                type='number'
                name='income_percentage'
                label={t('modal.income_percentage')}
                placeholder='0%'
                textInputClass='mb-10'
                control={control}
                trigger={trigger}
            />
            <Button
                label={employee ? t('general.save') : t('add_employee')}
                loading={loading}
                buttonClass='w-full'
            />
        </form>
    </Modal>
}

export default EmployeeModal