import React, { useMemo, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Loader from '@components/Loader'
import { useSupabaseDeleteEntity, useSupabaseGetEmployees, useSupabaseUpsertEntity } from '@services/supabase'
import Button from '@components/Button'
import AddEmployeeModal from '@components/employees/index/AddEmployeeModal'
import ErrorMessage from '@components/ErrorMessage'
import Table from '@components/Table'
import { IActionsList } from '@interfaces'
import { useTranslation } from '@lib/hooks'

// TODO: add internalization
const Employees: NextPage = () => {
    useEffect(() => setMounted(true), [])
    const [mounted, setMounted] = useState(false)
    const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false)
    // TODO: add editEmployeeModal
    const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false)
    const router = useRouter()
    const content = useTranslation()

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

    // TODO: add deleteEmployeeModal for confirmation
    async function deleteEmployeeAndReload(id: number) {
        await deleteEmployee(id)
        router.reload()
    }

    if (!mounted || employeesLoading || addEmployeeLoading || deleteEmployeeLoading) {
        return <Loader />
    }

    if (employeesError || addEmployeeError || deleteEmployeeError) {
        return <ErrorMessage message={employeesError || addEmployeeError || deleteEmployeeError} />
    }

    const employeesActions: Array<IActionsList> = [
        { label: 'Edit', action: () => setShowEditEmployeeModal(true) },
        { label: 'Delete', action: deleteEmployeeAndReload, textColor: 'error' }
    ]

    return (
        <div className='flex flex-col items-center py-2 lg:mr-20 mr-10'>
            {showAddEmployeeModal && <AddEmployeeModal addEmployee={addEmployee} toggleModal={setShowAddEmployeeModal} />}
            <div className='w-full flex justify-between'>
                <h3>{content.employees.index.header}</h3>
                <div className='space-x-8'>
                    <Button label='Export' variant='secondary' buttonClass='w-40' />
                    <Button
                        label='Add employee'
                        buttonClass='w-40'
                        onClick={() => setShowAddEmployeeModal(prevState => !prevState)}
                    />
                </div>
            </div>
            <Table
                headers={['Name', 'Birth date', 'Salary', 'Income Percentage', '', '']}
                data={employees}
                actionsList={employeesActions}
            />
        </div>
    )
}

export default Employees
