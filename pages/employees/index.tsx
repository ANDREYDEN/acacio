import Button from '@components/Button'
import ConfirmationModal from '@components/ConfirmationModal'
import DeletionModal from '@components/DeletionModal'
import EmployeeModal from '@components/employees/index/EmployeeModal'
import ErrorMessage from '@components/ErrorMessage'
import Loader from '@components/Loader'
import Table from '@components/Table'
import { IActionsList } from '@interfaces'
import { useMounted } from '@lib/hooks'
import {
    useSupabaseDeleteEntity, useSupabaseGetEmployeeRoles, useSupabaseGetEmployees, useSupabaseUpsertEntity
} from '@services/supabase'
import { definitions } from '@types'
import type { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useState } from 'react'

export const getServerSideProps = async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['employees', 'common']),
    },
})

const Employees: NextPage = () => {
    const { mounted } = useMounted()
    const [showEmployeeModal, setShowEmployeeModal] = useState(false)
    const [showAddConfirmationModal, setShowAddConfirmationModal] = useState(false)
    const [employeeIdToEdit, setEmployeeIdToEdit] = useState<number | undefined>(undefined)
    const [employeeIdToDelete, setEmployeeIdToDelete] = useState<number | undefined>(undefined)
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)
    const { t } = useTranslation('employees')

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

    if (!mounted || employeesLoading || employeeRolesLoading || upsertEmployeeLoading || deleteEmployeeLoading) {
        return <Loader />
    }

    if (employeesError || employeeRolesError || upsertEmployeeError || deleteEmployeeError) {
        return <ErrorMessage message={employeesError || employeeRolesError || upsertEmployeeError || deleteEmployeeError} />
    }

    const employeesActions: Array<IActionsList> = [
        { label: t('edit', { ns: 'common' }), action: (id) => {
            setEmployeeIdToEdit(id)
            setShowEmployeeModal(true)
        } },
        { label: t('delete', { ns: 'common' }), action: (id) => { setEmployeeIdToDelete(id) }, textColor: 'error' }
    ]

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
                    header={t('add_confirmation_modal.header')}
                    toggleModal={setShowAddConfirmationModal}
                    message={t('add_confirmation_modal.message')}
                />
            }
            {employeeIdToDelete &&
                <DeletionModal
                    header={t('deletion_modal.header')}
                    onClose={() => setEmployeeIdToDelete(undefined)}
                    action={onDeleteEmployee}
                    message={confirmationMessage()}
                />
            }
            {showDeleteConfirmationModal && !deleteEmployeeError &&
                <ConfirmationModal
                    header={t('deletion_modal.confirmation_header')}
                    toggleModal={setShowDeleteConfirmationModal}
                    message={t('deletion_modal.confirmation_message')}
                />
            }
            <div className='w-full flex justify-between mb-8'>
                <h3>{t('header')}</h3>
                <div className='space-x-8'>
                    <Button label={t('export', { ns: 'common' })} variant='secondary' buttonClass='w-56' />
                    <Button
                        label={t('add_employee')}
                        buttonClass='w-56'
                        onClick={() => setShowEmployeeModal(prevState => !prevState)}
                    />
                </div>
            </div>
            <Table
                headers={t('table_headers', { returnObjects: true })}
                data={employees}
                actionsList={employeesActions}
            />
        </div>
    )
}

export default Employees
