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
    const { t } = useTranslation('salary')

    const columns: Column<SalaryTableRow>[] = useMemo(
        () => [
            { 
                Header: <h1>{t('table.employee')}</h1>,
                accessor: 'employeeName'
            },
            { 
                Header: <h1>{t('table.hourlyWage')}</h1>,
                accessor: 'hourlySalary',
            },
            { 
                Header: <h1>{t('table.hoursTotal')}</h1>,
                accessor: 'hoursTotal',
            },
            { 
                Header: <h1>{t('table.salaryTotal')}</h1>,
                accessor: 'salaryTotal',
                Cell: NumericCell
            },
            { 
                Header: <h1>{t('table.salesIncomeTotal')}</h1>,
                accessor: 'salesIncomeTotal',
                Cell: NumericCell
            },
            { 
                Header: <h1>{t('table.deductionsTotal')}</h1>,
                accessor: 'deductionsTotal',
                Cell: NumericCell
            },
            { 
                Header: <h1>{t('table.bonus')}</h1>,
                accessor: 'bonusDto',
                Cell: ({ value: bonusDto }) => <NumberInputCell value={bonusDto.initialValue} onBlur={bonusDto.onChange} widthStyle='w-20'/>
            },
            { 
                Header: <h1>{t('table.incomeTotal')}</h1>,
                accessor: 'incomeTotal',
                Cell: NumericCell
            },
        ],
        [t]
    )

    return <Table columns={columns} data={data} tableSpacing='px-2' />
}

export default SalaryTable