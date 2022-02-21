import React, { ReactElement, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Modal from '@components/Modal'
import Button from '@components/Button'
import { definitions } from '@types'
import { useRouter } from 'next/router'
import TextInput from '@components/TextInput'

interface IAddEmployeeModal {
    addEmployee: (employee: any) => Promise<void>
    toggleModal: (visible: boolean) => void
}

const AddEmployeeModal: React.FC<IAddEmployeeModal> = ({ addEmployee, toggleModal }: IAddEmployeeModal) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const defaultValues = {
        first_name: '',
        last_name: '',
        date_of_birth: '',
        salary: '',
        coefficient: '',
    }
    const { register, handleSubmit, trigger, control } = useForm({ defaultValues })
    register('first_name', { required: 'First name is required' })
    register('last_name', { required: 'Last name is required' })
    register('date_of_birth')
    register('salary', {
        required: 'Salary is required',
        min: { value: 0, message: 'Cannot be negative' }
    })
    register('coefficient', {
        required: 'Coefficient is required',
        min: { value: 0, message: 'Cannot be less than 0' },
        max: { value: 100, message: 'Cannot be more than 100' }
    })

    const handleAddEmployee = async (data: any) => {
        setLoading(true)
        const newEmployee: Partial<definitions['employees']> = {
            first_name: data.first_name,
            last_name: data.last_name,
            date_of_birth: data.date_of_birth === '' ? null : data.date_of_birth,
            salary: data.salary,
            coefficient: data.coefficient
        }
        await addEmployee(newEmployee)
        toast('🦄 An employee has been successfully added')
        setLoading(false)
        router.reload()
    }
    
    const Header: ReactElement = <h4>Add Employee</h4>

    return <Modal
        header={Header}
        toggler={() => toggleModal(false)}
        closable={true}
    >
        <form className='w-96' onSubmit={handleSubmit(handleAddEmployee)}>
            <TextInput
                type='text'
                name='first_name'
                label='First Name'
                placeholder='Enter employee’s first name'
                textInputClass='mb-6'
                control={control}
                trigger={trigger}
            />
            <TextInput
                type='text'
                name='last_name'
                label='Last Name'
                placeholder='Enter employee’s last name'
                textInputClass='mb-6'
                control={control}
                trigger={trigger}
            />
            <TextInput
                type='date'
                name='date_of_birth'
                label='Birth date'
                textInputClass='mb-6'
                control={control}
                trigger={trigger}
            />
            <TextInput
                type='number'
                name='salary'
                label='Salary'
                placeholder='0$/hr'
                textInputClass='mb-6'
                control={control}
                trigger={trigger}
            />
            <TextInput
                type='double'
                name='coefficient'
                label='Income Percentage'
                placeholder='0.00%'
                textInputClass='mb-10'
                control={control}
                trigger={trigger}
            />
            <Button label='Add Employee' loading={loading} buttonClass='w-full' />
        </form>
    </Modal>
}

export default AddEmployeeModal