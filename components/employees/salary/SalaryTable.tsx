import Table from '@components/Table'
import NumberInputCell from '@components/NumberInputCell'
import { SalaryTableRow } from '@interfaces'
import { useTranslation } from 'next-i18next'
import React, { useMemo } from 'react'
import { Column } from 'react-table'

interface ISalaryTable {
  data: SalaryTableRow[]
}

const SalaryTable: React.FC<ISalaryTable> = ({ data }: ISalaryTable) => {
    const { t } = useTranslation('schedule')

    const columns: Column<SalaryTableRow>[] = useMemo(
        () => [
            { 
                Header: 'Employee',
                accessor: 'employeeName'
            },
            { 
                Header: 'Hourly Wage',
                accessor: 'hourlySalary',
                Cell: ({ value }) => <>{value} UAH/hr</>
            },
            { 
                Header: 'Total Hours',
                accessor: 'hoursTotal',
                Cell: ({ value }) => <>{value} hrs</>
            },
            { 
                Header: 'Total Salary',
                accessor: 'salaryTotal',
                Cell: ({ value }) => <>{value} UAH</>
            },
            { 
                Header: 'Sales Income',
                accessor: 'salesIncomeTotal',
                Cell: ({ value }) => <>{value} UAH</>
            },
            { 
                Header: 'Deductions',
                accessor: 'deductionsTotal',
                Cell: ({ value }) => <>{value} UAH</>
            },
            { 
                Header: 'Bonus',
                accessor: 'bonusDto',
                Cell: ({ value: bonusDto }) => <NumberInputCell value={bonusDto.initialValue} onBlur={bonusDto.onChange} widthStyle='w-20'/>
            },
            { 
                Header: 'Total Income',
                accessor: 'incomeTotal',
                Cell: ({ value }) => <>{value} UAH</>
            },
        ],
        []
    )

    return <Table columns={columns} data={data} tableSpacing='px-1' />
}

export default SalaryTable