import React, { ReactElement, useState } from 'react'
import Modal from '@components/Modal'
import PrimaryButton from '@components/PrimaryButton'
import { definitions } from '@types'
import { useRouter } from 'next/router'

interface IAddEmployeeModal {
    addEmployee: (employee: any) => Promise<void>
    toggleModal: (visible: boolean) => void
}

const AddEmployeeModal: React.FC<IAddEmployeeModal> = ({ addEmployee, toggleModal }: IAddEmployeeModal) => {
    const emptyEmployee = {
        first_name: '',
        last_name: '',
        date_of_birth: '',
        salary: 0,
        coefficient: 0,
    }
    const [employee, setEmployee] = useState<Partial<definitions['employees']>>(emptyEmployee)
    const router = useRouter()

    const { first_name, last_name, date_of_birth, salary, coefficient } = employee

    async function addEmployeeAndReload() {
        await addEmployee(employee)
        router.reload()
    }
    
    const Header: ReactElement = <h4>Add Employee</h4>

    return <Modal
        header={Header}
        toggler={() => toggleModal(false)}
        closable={true}
    >
        <div className='w-96'>
            <div className='mb-4'>
                <label
                    className='block text-gray-700 text-sm font-bold mb-2'
                    htmlFor='first_name'
                >
                    First Name
                </label>
                <input
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='first_name'
                    type='text'
                    value={first_name?.toString()}
                    onChange={(e) =>
                        setEmployee({ ...employee, first_name: e.target.value })
                    }
                />
            </div>
            <div className='mb-4'>
                <label
                    className='block text-gray-700 text-sm font-bold mb-2'
                    htmlFor='last_name'
                >
                    Last Name
                </label>
                <input
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='last_name'
                    type='text'
                    value={last_name?.toString()}
                    onChange={(e) =>
                        setEmployee({ ...employee, last_name: e.target.value })
                    }
                />
            </div>

            <div className='mb-4'>
                <label
                    className='block text-gray-700 text-sm font-bold mb-2'
                    htmlFor='date_of_birth'
                >
                    BirthDate
                </label>
                <input
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='date_of_birth'
                    type='date'
                    value={date_of_birth?.toString()}
                    onChange={(e) =>
                        setEmployee({ ...employee, date_of_birth: e.target.value })
                    }
                />
            </div>

            <div className='mb-4'>
                <label
                    className='block text-gray-700 text-sm font-bold mb-2'
                    htmlFor='Salary'
                >
                    Salary
                </label>
                <input
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='salary'
                    type='number'
                    value={salary}
                    onChange={(e) =>
                        setEmployee({ ...employee, salary: +e.target.value })
                    }
                />
            </div>

            <div className='mb-4'>
                <label
                    className='block text-gray-700 text-sm font-bold mb-2'
                    htmlFor='Coefficient'
                >
                    Coefficient
                </label>
                <input
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='coefficient'
                    type='number'
                    value={coefficient?.toString()}
                    onChange={(e) =>
                        setEmployee({ ...employee, coefficient: +e.target.value })
                    }
                />
            </div>
            <PrimaryButton label='Add Employee' onClick={addEmployeeAndReload} />
        </div>
    </Modal>
}

export default AddEmployeeModal