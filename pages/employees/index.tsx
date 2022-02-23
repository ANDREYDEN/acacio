import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Loader from '@components/Loader'
import {
    useSupabaseDeleteEntity,
    useSupabaseGetEmployees,
    useSupabaseGetEmployeeRoles,
    useSupabaseUpsertEntity
} from '@services/supabase'
import Button from '@components/Button'
import AddEmployeeModal from '@components/employees/index/AddEmployeeModal'
import ErrorMessage from '@components/ErrorMessage'
import Table from '@components/Table'
import { IActionsList } from '@interfaces'
import { useTranslation } from '@lib/hooks'
import { definitions } from '@types'
import ConfirmationModal from '@components/ConfirmationModal'

// TODO: add internalization
const Employees: NextPage = () => {
    useEffect(() => setMounted(true), [])
    const [mounted, setMounted] = useState(false)
    const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false)
    const [showAddConfirmationModal, setShowAddConfirmationModal] = useState(false)
    // TODO: add editEmployeeModal
    const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false)
    const router = useRouter()
    const content = useTranslation()

    const {
        data: employees, 
        loading: employeesLoading, 
        error: employeesError,
        mutate: revalidateEmployees
    } = useSupabaseGetEmployees()
    const {
        data: employeeRoles,
        loading: employeeRolesLoading,
        error: employeeRolesError
    } = useSupabaseGetEmployeeRoles()
    const { 
        upsertEntity: addEmployee,
        loading: addEmployeeLoading, 
        error: addEmployeeError 
    } = useSupabaseUpsertEntity('employees')
    const { 
        deleteEntity: deleteEmployee, 
        loading: deleteEmployeeLoading, 
        error: deleteEmployeeError 
    } = useSupabaseDeleteEntity('employees')

    // TODO: add deleteEmployeeModal for confirmation
    async function deleteEmployeeAndReload(id: number) {
        await deleteEmployee(id)
        router.reload()
    }

    if (!mounted || employeesLoading || employeeRolesLoading || addEmployeeLoading || deleteEmployeeLoading) {
        return <Loader />
    }

    if (employeesError || employeeRolesError || addEmployeeError || deleteEmployeeError) {
        return <ErrorMessage message={employeesError || employeeRolesError || addEmployeeError || deleteEmployeeError} />
    }

    const employeesActions: Array<IActionsList> = [
        { label: content.general.edit, action: () => setShowEditEmployeeModal(true) },
        { label: content.general.delete, action: deleteEmployeeAndReload, textColor: 'error' }
    ]

    const updateEmployees = async (newEmployee: Partial<definitions['employees']>) => {
        await revalidateEmployees([...employees, newEmployee])
        await addEmployee(newEmployee)
        await revalidateEmployees()
    }

    return (
        <div className='flex flex-col items-center py-2 lg:mr-20 mr-10'>
            {showAddEmployeeModal &&
                <AddEmployeeModal
                    onAddEmployee={updateEmployees}
                    toggleModal={setShowAddEmployeeModal}
                    toggleConfirmationModal={setShowAddConfirmationModal}
                    employeeRoles={employeeRoles}
                />}
            {showAddConfirmationModal && !addEmployeeError &&
                <ConfirmationModal
                    header='Employee was added'
                    toggleModal={setShowAddConfirmationModal}
                    message='New employee is successfully added to the system, now you can track his/her salary and work shifts.'
                />
            }
            <div className='w-full flex justify-between mb-8'>
                <h3>{content.employees.index.header}</h3>
                <div className='space-x-8'>
                    <Button label={content.general.export} variant='secondary' buttonClass='w-56' />
                    <Button
                        label={content.employees.index.add_employee}
                        buttonClass='w-56'
                        onClick={() => setShowAddEmployeeModal(prevState => !prevState)}
                    />
                </div>
            </div>
            <Table
                headers={content.employees.index.table_headers}
                data={employees}
                actionsList={employeesActions}
            />
        </div>
    )
}

export default Employees
