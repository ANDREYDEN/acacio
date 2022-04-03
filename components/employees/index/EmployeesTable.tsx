import React, { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { Column } from 'react-table'
import { Table, CurrencyCell } from '@components'
import { IRowAction, IEmployeesTableRow } from '@interfaces'

interface IEmployeeTable {
    data: IEmployeesTableRow[]
}

const EmployeesTable: React.FC<IEmployeeTable> = ({ data }: IEmployeeTable) => {
    const { t } = useTranslation('employees')

    const columns: Column<IEmployeesTableRow>[] = useMemo(
        () => [
            {
                Header: <h1>{t('table_headers.name').toString()}</h1>,
                accessor: 'name',
            },
            {
                Header: <h1>{t('table_headers.role').toString()}</h1>,
                accessor: 'roleName',
            },
            {
                Header: <h1>{t('table_headers.birth_date').toString()}</h1>,
                accessor: 'birthDate',
                Cell: ({ value: birthDate }: { value: string }) => <span>{birthDate}</span>
            },
            {
                Header: <h1>{t('table_headers.salary').toString()}</h1>,
                accessor: 'salary',
                Cell: CurrencyCell
            },
            {
                Header: <h1>{t('table_headers.revenue_percentage').toString()}</h1>,
                accessor: 'revenuePercentage',
                Cell: ({ value: revenuePercentage }: { value: number }) => <span>{revenuePercentage}%</span>
            },
            {
                Header: '',
                accessor: 'editEmployee',
                Cell: ({ value: editEmployee }: { value: IRowAction }) => (
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
                Cell: ({ value: deleteEmployee }: { value: IRowAction }) => (
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
        [t]
    )

    return <Table columns={columns} data={data} tableSpacing='px-2' />
}

export default EmployeesTable