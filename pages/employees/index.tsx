import React, { useMemo, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { definitions } from '@types'
import Loader from '@components/Loader'
import { useSupabaseGetEmployees, useSupabaseUpsertEntity, useSupabaseDeleteEntity } from '@services/supabase'

const Employees: NextPage = () => {
    const { mounted } = useMounted()
    const [showEmployeeModal, setShowEmployeeModal] = useState(false)
    const [showAddConfirmationModal, setShowAddConfirmationModal] = useState(false)
    const [employeeIdToEdit, setEmployeeIdToEdit] = useState<number | undefined>(undefined)
    const [employeeIdToDelete, setEmployeeIdToDelete] = useState<number | undefined>(undefined)
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const { t } = useTranslation('employees')

    const {
        data: employees, 
        loading: employeesLoading, 
        error: employeesError,
        mutate: revalidateEmployees
    } = useSupabaseGetEntity<definitions['employees']>('employees')
    const {
        data: employeeRoles,
        loading: employeeRolesLoading,
        error: employeeRolesError
    } = useSupabaseGetEntity<definitions['employee_roles']>('employee_roles')
    const { 
        upsertEntity: upsertEmployee,
        loading: upsertEmployeeLoading,
        error: upsertEmployeeError
    } = useSupabaseUpsertEntity('employees')
    const { 
        deleteEntity: deleteEmployee, 
        loading: deleteEmployeeLoading, 
        error: deleteEmployeeError 
    } = useSupabaseDeleteEntity('employees')

    const tableData: IEmployeesTableRow[] = useMemo(() =>
        employees
            .map((employee) => {
                const row = {
                    name: fullName(employee),
                    roleName: employeeRoles.find(role => employee.role_id === role.id)?.name ?? 'No Role',
                    birthDate: employee.birth_date ?? '',
                    salary: employee.salary,
                    revenuePercentage: employee.income_percentage,
                    editEmployee: {
                        label: t('edit', { ns: 'common' }),
                        action: () => {
                            setEmployeeIdToEdit(employee.id)
                            setShowEmployeeModal(true)
                        }
                    },
                    deleteEmployee: {
                        label: t('delete', { ns: 'common' }),
                        action: () => { setEmployeeIdToDelete(employee.id) },
                        textColor: 'error'
                    }
                }

                return row
            })
            .filter(employee => employee.name.toLowerCase().includes(searchValue.toLowerCase())),
    [employeeRoles, employees, searchValue, t]
    )

    if (!mounted) {
        return <Loader />
    }

    const updateEmployees = async (newEmployee: Partial<definitions['employees']>) => {
        await revalidateEmployees([...employees, newEmployee])
        await upsertEmployee(newEmployee)
        await revalidateEmployees()
    }

    const onDeleteEmployee = async () => {
        if (!employeeIdToDelete) return

        const filteredEmployees = employees.filter(employee => employee.id !== employeeIdToDelete)
        await revalidateEmployees(filteredEmployees)
        setEmployeeIdToDelete(undefined)

        await deleteEmployee(employeeIdToDelete)
        await revalidateEmployees()
        setShowDeleteConfirmationModal(true)
    }

    const toggleModal = () => {
        setShowEmployeeModal(false)
        if (!employeeIdToEdit) setShowAddConfirmationModal(true)
        setEmployeeIdToEdit(undefined)
    }

    const employeeForModal = () => {
        return employeeIdToEdit ? employees.find((employee) => employee.id === employeeIdToEdit) : undefined
    }

    const confirmationMessage = (): string => {
        const employeeToBeDeleted = employees.find(employee => employee.id === employeeIdToDelete)
        const employeeName = employeeToBeDeleted?.first_name ?? 'this employee'

        return t('deletion_modal.message', { employeeName, ns: 'employees' })
    }

    const handleExport = async () => {
        const columns: Partial<Column>[] = [
            { key: 'name', header: t('table_headers.name').toString(), width: 20 },
            { key: 'roleName', header: t('table_headers.role').toString() },
            { key: 'birthDate', header: t('table_headers.birth_date').toString(), width: 15 },
            { key: 'salary', header: t('table_headers.salary').toString() },
            { key: 'revenuePercentage', header: t('table_headers.revenue_percentage').toString(), width: 15 },
        ]
        await exportToXLSX(tableData, columns, 'Employees')
    }

    return (
        <div className='flex flex-col items-center justify-center py-2'>
            <div>
                <div className='flex flex-wrap items-center justify-around mt-6'>
                    <div className='p-8 mt-6 border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600'>
                        <div className='w-full max-w-sm'>
                            <form className='bg-white rounded px-8 pt-6 pb-8 mb-4'>
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
                                <div className='flex items-center justify-between'>
                                    <button
                                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                                        type='button'
                                        onClick={addEmployeeAndReload}
                                    >
                                        Add Employee
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className='p-2 mt-6 w-96 rounded-xl focus:text-blue-600'>
                        <table className='shadow-lg bg-white'>
                            <tbody>
                                <tr>
                                    <th className='bg-blue-400 border text-left px-4 py-4'>
                                    Id
                                    </th>
                                    <th className='bg-blue-400 border text-left px-4 py-4'>
                                    First Name
                                    </th>
                                    <th className='bg-blue-400 border text-left px-8 py-4'>
                                    Last Name
                                    </th>
                                    <th className='bg-blue-400 border text-left px-8 py-4'>
                                    BirthDate
                                    </th>
                                    <th className='bg-blue-400 border text-left px-14 py-4'>
                                    Salary
                                    </th>
                                    <th className='bg-blue-400 border text-left px-16 py-4'>
                                    Coefficient
                                    </th>

                                    <th className='bg-blue-400 border text-left px-4 py-4'>
                                    Action
                                    </th>
                                </tr>
                                {employees?.map((employee, index) => (
                                    <tr key={employee.id}>
                                        <td className='border px-4 py-4'>{index + 1}</td>
                                        <td className='border px-4 py-4'>{employee.first_name}</td>
                                        <td className='border px-8 py-4'>{employee.last_name}</td>
                                        <td className='border px-8 py-4'>{employee.date_of_birth}</td>
                                        <td className='border px-8 py-4'>{employee.salary}</td>
                                        <td className='border px-8 py-4'>{employee.coefficient}</td>
                                        <td className='border px-8 py-4'>
                                            {' '}
                                            <button
                                                className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                                                type='button'
                                                onClick={() => deleteEmployeeAndReload(employee.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {employeesError || employeeRolesError || upsertEmployeeError || deleteEmployeeError
                ? <ErrorMessage message={employeesError || employeeRolesError || upsertEmployeeError || deleteEmployeeError} />
                :  employeesLoading || employeeRolesLoading || upsertEmployeeLoading || deleteEmployeeLoading
                    ? <Loader />
                    : <EmployeesTable data={tableData} />
            }
        </div>
    )
}

export default Employees
