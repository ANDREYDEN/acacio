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
import EmployeeModal from '@components/employees/index/EmployeeModal'
import ErrorMessage from '@components/ErrorMessage'
import Table from '@components/Table'
import { IActionsList } from '@interfaces'
import { useTranslation } from '@lib/hooks'
import { definitions } from '@types'
import ConfirmationModal from '@components/ConfirmationModal'

const Employees: NextPage = () => {
    useEffect(() => setMounted(true), [])
    const [mounted, setMounted] = useState(false)
    const [showEmployeeModal, setShowEmployeeModal] = useState(false)
    const [showAddConfirmationModal, setShowAddConfirmationModal] = useState(false)
    const [employeeIdToEdit, setEmployeeIdToEdit] = useState<number | undefined>(undefined)
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
        upsertEntity: upsertEmployee,
        loading: upsertEmployeeLoading,
        error: upsertEmployeeError
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

    if (!mounted || employeesLoading || employeeRolesLoading || upsertEmployeeLoading || deleteEmployeeLoading) {
        return <Loader />
    }

    if (employeesError || employeeRolesError || upsertEmployeeError || deleteEmployeeError) {
        return <ErrorMessage message={employeesError || employeeRolesError || upsertEmployeeError || deleteEmployeeError} />
    }

    const employeesActions: Array<IActionsList> = [
        { label: content.general.edit, action: (id) => {
            setEmployeeIdToEdit(id)
            setShowEmployeeModal(true)
        } },
        { label: content.general.delete, action: deleteEmployeeAndReload, textColor: 'error' }
    ]

    const updateEmployees = async (newEmployee: Partial<definitions['employees']>) => {
        await revalidateEmployees([...employees, newEmployee])
        await upsertEmployee(newEmployee)
        await revalidateEmployees()
    }

    const toggleModal = () => {
        setShowEmployeeModal(false)
        if (!employeeIdToEdit) setShowAddConfirmationModal(true)
        setEmployeeIdToEdit(undefined)
    }

    const employeeForModal = () => {
        return employeeIdToEdit ? employees.find((employee) => employee.id === employeeIdToEdit) : undefined
    }

    return (
        <div className='flex flex-col items-center py-2 lg:mr-20 mr-10'>
            {showEmployeeModal &&
                <EmployeeModal
                    employee={employeeForModal()}
                    onUpsertEmployee={updateEmployees}
                    onSuccess={toggleModal}
                    onClose={() => setShowEmployeeModal(false)}
                    employeeRoles={employeeRoles}
                />}
            {showAddConfirmationModal && !upsertEmployeeError &&
                <ConfirmationModal
                    header={content.employees.index.confirmation_modal.header}
                    toggleModal={setShowAddConfirmationModal}
                    message={content.employees.index.confirmation_modal.message}
                />
            }
            <div className='w-full flex justify-between mb-8'>
                <h3>{content.employees.index.header}</h3>
                <div className='space-x-8'>
                    <Button label={content.general.export} variant='secondary' buttonClass='w-56' />
                    <Button
                        label={content.employees.index.add_employee}
                        buttonClass='w-56'
                        onClick={() => setShowEmployeeModal(prevState => !prevState)}
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
