import Table from '@components/Table'
import NumberInputCell from '@components/NumberInputCell'
import { SalaryTableRow } from '@interfaces'
import { useTranslation } from 'next-i18next'
import React, { useMemo } from 'react'
import { Column } from 'react-table'
import NumericCell from '@components/NumericCell'

interface ISalaryTable {
  data: SalaryTableRow[]
}

const SalaryTable: React.FC<ISalaryTable> = ({ data }: ISalaryTable) => {
    // TODO: internationalize this page
    const { t } = useTranslation('schedule')

    const columns: Column<SalaryTableRow>[] = useMemo(
        () => [
            { 
                Header: <h1>Employee</h1>,
                accessor: 'employeeName'
            },
            { 
                Header: <h1>Hourly Wage(₴/hr)</h1>,
                accessor: 'hourlySalary',
            },
            { 
                Header: <h1>Total Hours</h1>,
                accessor: 'hoursTotal',
            },
            { 
                Header: <h1>Total Salary(₴)</h1>,
                accessor: 'salaryTotal',
                Cell: NumericCell
            },
            { 
                Header: <h1>Sales Income(₴)</h1>,
                accessor: 'salesIncomeTotal',
                Cell: NumericCell
            },
            { 
                Header: <h1>Deductions(₴)</h1>,
                accessor: 'deductionsTotal',
                Cell: NumericCell
            },
            { 
                Header: <h1>Bonus(₴)</h1>,
                accessor: 'bonusDto',
                Cell: ({ value: bonusDto }) => <NumberInputCell value={bonusDto.initialValue} onBlur={bonusDto.onChange} widthStyle='w-20'/>
            },
            { 
                Header: <h1>Total Income(₴)</h1>,
                accessor: 'incomeTotal',
                Cell: NumericCell
            },
        ],
        []
    )

    return <Table columns={columns} data={data} tableSpacing='px-2' />
}

export default SalaryTable