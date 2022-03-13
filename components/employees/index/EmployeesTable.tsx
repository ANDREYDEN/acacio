import React, { useMemo } from 'react'
import { definitions } from '@types'
import { IAction, IEmployeesTableRow } from '@interfaces'
import { Column } from 'react-table'
import { useTranslation } from 'next-i18next'
import Table from '@components/Table'

interface IEmployeeTable {
    data: IEmployeesTableRow[]
    roles: definitions['employee_roles'][]
}

const EmployeesTable: React.FC<IEmployeeTable> = ({ data, roles }: IEmployeeTable) => {
    const { t } = useTranslation('employees')

    const columns: Column<IEmployeesTableRow>[] = useMemo(
        () => [
            {
                Header: <h6>{t('table_headers.name').toString()}</h6>,
                accessor: 'name',
            },
            {
                Header: <h6>{t('table_headers.role').toString()}</h6>,
                accessor: 'roleId',
                Cell: ({ value: roleId }: { value: number }) => <span>{roles.find(role => role.id === roleId)?.name}</span>
            },
            {
                Header: <h6>{t('table_headers.birth_date').toString()}</h6>,
                accessor: 'birthDate',
                Cell: ({ value: birthDate }: { value: string }) => <span>{birthDate}</span>
            },
            {
                Header: <h6>{t('table_headers.salary').toString()}</h6>,
                accessor: 'salary',
                Cell: ({ value: salary }: { value: number }) => <span>{salary}</span>
            },
            {
                Header: <h6>{t('table_headers.revenue_percentage').toString()}</h6>,
                accessor: 'revenuePercentage',
                Cell: ({ value: revenuePercentage }: { value: number }) => <span>{revenuePercentage}%</span>
            },
            {
                Header: '',
                accessor: 'editEmployee',
                Cell: ({ value: editEmployee }: { value: IAction }) => (
                    <button
                        className={`text-${editEmployee.textColor ?? 'black'} underline`}
                        type='button'
                        onClick={editEmployee.action}
                    >
                        {editEmployee.label}
                    </button>
                )
            },
            {
                Header: '',
                accessor: 'deleteEmployee',
                Cell: ({ value: deleteEmployee }: { value: IAction }) => (
                    <button
                        className={`text-${deleteEmployee.textColor ?? 'black'} underline`}
                        type='button'
                        onClick={deleteEmployee.action}
                    >
                        {deleteEmployee.label}
                    </button>
                )
            },
        ],
        [roles, t]
    )

    return <Table columns={columns} data={data} tableSpacing='px-8' />
}

export default EmployeesTable