import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Loader from '@components/Loader'
import { useSupabaseDeleteEntity, useSupabaseGetEmployees, useSupabaseUpsertEntity } from '@services/supabase'
import Button from '@components/Button'
import AddEmployeeModal from '@components/employees/index/AddEmployeeModal'
import ErrorMessage from '@components/ErrorMessage'
import Table from '@components/Table'

const Employees: NextPage = () => {
    useEffect(() => setMounted(true), [])
    const [mounted, setMounted] = useState(false)
    const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false)
    const router = useRouter()

    const {
        data: employees, 
        loading: employeesLoading, 
        error: employeesError
    } = useSupabaseGetEmployees()
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

    return (
        <div className='flex flex-col items-center py-2 lg:mr-20 mr-10'>
            {showAddEmployeeModal && <AddEmployeeModal addEmployee={addEmployee} toggleModal={setShowAddEmployeeModal} />}
            <div className='w-full flex justify-between'>
                <h3>Employees</h3>
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
                headers={['Full Name', 'Role', 'Birth date', 'Salary', 'Income Percentage', '', '']}
                data={employees}
                action={deleteEmployeeAndReload}
            />
        </div>
    )
}

export default Employees
