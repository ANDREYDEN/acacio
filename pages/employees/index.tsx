import Button from '@components/Button'
import ConfirmationModal from '@components/ConfirmationModal'
import DeletionModal from '@components/DeletionModal'
import EmployeeModal from '@components/employees/index/EmployeeModal'
import ErrorMessage from '@components/ErrorMessage'
import Loader from '@components/Loader'
import EmployeesTable from '@components/employees/index/EmployeesTable'
import { IEmployeesTableRow } from '@interfaces'
import { useMounted } from '@lib/hooks'
import {
    useSupabaseDeleteEntity,
    useSupabaseGetEmployeeRoles,
    useSupabaseGetEmployees,
    useSupabaseUpsertEntity
} from '@services/supabase'
import { definitions } from '@types'
import type { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useMemo, useState } from 'react'
import exportToXLSX from '@lib/services/exportService'
import { Column } from 'exceljs'
import { enforceAuthenticated } from '@lib/utils'

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['employees', 'common']),
    },
}))

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

    const tableData: IEmployeesTableRow[] = useMemo(() =>
        employees.map((employee) => {
            const row = {
                name: `${employee.first_name} ${employee.last_name}`,
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
        }),
    [employeeRoles, employees, t]
    )

    if (!mounted || employeesLoading || employeeRolesLoading || upsertEmployeeLoading || deleteEmployeeLoading) {
        return <Loader />
    }

    if (employeesError || employeeRolesError || upsertEmployeeError || deleteEmployeeError) {
        return <ErrorMessage message={employeesError || employeeRolesError || upsertEmployeeError || deleteEmployeeError} />
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
            { key: 'name', header: t('table_headers.name').toString() },
            { key: 'roleName', header: t('table_headers.role').toString() },
            { key: 'birthDate', header: t('table_headers.birth_date').toString() },
            { key: 'salary', header: t('table_headers.salary').toString() },
            { key: 'revenuePercentage', header: t('table_headers.revenue_percentage').toString() },
        ]
        await exportToXLSX(tableData, columns, 'Employees')
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
                    <Button 
                        label={t('export', { ns: 'common' })} 
                        variant='secondary' 
                        buttonClass='w-56'
                        onClick={handleExport}
                    />
                    <Button
                        label={t('add_employee')}
                        buttonClass='w-56'
                        onClick={() => setShowEmployeeModal(prevState => !prevState)}
                    />
                </div>
            </div>

            <EmployeesTable data={tableData} />
        </div>
    )
}

export default Employees
