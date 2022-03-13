import Table from '@components/Table'
import { SalaryTableRow, ScheduleTableRow } from '@interfaces'
import { definitions } from '@types'
import { useTranslation } from 'next-i18next'
import React, { useMemo } from 'react'
import { Column } from 'react-table'

interface ISalaryTable {
  data: SalaryTableRow[]
  onBonusChange: (bonus: definitions['bonuses']) => void
}

const SalaryTable: React.FC<ISalaryTable> = ({ data, onBonusChange }: ISalaryTable) => {
    const { t } = useTranslation('schedule')

    const columns: Column<SalaryTableRow>[] = useMemo(
        () => [
            { 
                Header: 'Employee',
                accessor: 'employeeName'
            },
            { 
                Header: 'Hourly Wage',
                accessor: 'hourlySalary'
            },
            { 
                Header: 'Total Hours',
                accessor: 'hoursTotal'
            },
            { 
                Header: 'Total Salary',
                accessor: 'salaryTotal'
            },
            { 
                Header: 'Sales Income',
                accessor: 'salesIncomeTotal'
            },
            { 
                Header: 'Deductions',
                accessor: 'deductionsTotal'
            },
            { 
                Header: 'Bonus',
                accessor: 'bonusAmount'
            },
            { 
                Header: 'Total Income',
                accessor: 'incomeTotal'
            },
        ],
        []
    )

    return <Table columns={columns} data={data} tableSpacing='px-1' />
}

export default SalaryTable