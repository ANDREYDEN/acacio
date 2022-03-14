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
    // TODO: internationalize this page
    const { t } = useTranslation('schedule')

    const columns: Column<SalaryTableRow>[] = useMemo(
        () => [
            { 
                Header: <h6>Employee</h6>,
                accessor: 'employeeName'
            },
            { 
                Header: <h6>Hourly Wage</h6>,
                accessor: 'hourlySalary',
                Cell: ({ value }) => <>{value} UAH/hr</>
            },
            { 
                Header: <h6>Total Hours</h6>,
                accessor: 'hoursTotal',
                Cell: ({ value }) => <>{value} hrs</>
            },
            { 
                Header: <h6>Total Salary</h6>,
                accessor: 'salaryTotal',
                Cell: ({ value }) => <>{value} UAH</>
            },
            { 
                Header: <h6>Sales Income</h6>,
                accessor: 'salesIncomeTotal',
                Cell: ({ value }) => <>{value} UAH</>
            },
            { 
                Header: <h6>Deductions</h6>,
                accessor: 'deductionsTotal',
                Cell: ({ value }) => <>{value} UAH</>
            },
            { 
                Header: <h6>Bonus</h6>,
                accessor: 'bonusDto',
                Cell: ({ value: bonusDto }) => <NumberInputCell value={bonusDto.initialValue} onBlur={bonusDto.onChange} widthStyle='w-20'/>
            },
            { 
                Header: <h6>Total Income</h6>,
                accessor: 'incomeTotal',
                Cell: ({ value }) => <>{value} UAH</>
            },
        ],
        []
    )

    return <Table columns={columns} data={data} tableSpacing='px-1' />
}

export default SalaryTable