import React, { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { Column } from 'react-table'
import { Table, NumberInputCell, CurrencyCell } from '@components'
import { SalaryTableRow } from '@interfaces'

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
                Cell: CurrencyCell
            },
            { 
                Header: <h1>{t('table.salesIncomeTotal')}</h1>,
                accessor: 'salesIncomeTotal',
                Cell: CurrencyCell
            },
            { 
                Header: <h1>{t('table.deductionsTotal')}</h1>,
                accessor: 'deductionsTotal',
                Cell: CurrencyCell
            },
            { 
                Header: <h1>{t('table.bonus')}</h1>,
                accessor: 'bonusDto',
                Cell: ({ value: bonusDto }) => <NumberInputCell value={bonusDto.initialValue} onBlur={bonusDto.onChange} widthStyle='w-20'/>
            },
            { 
                Header: <h1>{t('table.incomeTotal')}</h1>,
                accessor: 'incomeTotal',
                Cell: CurrencyCell
            },
        ],
        [t]
    )

    return <Table columns={columns} data={data} tableSpacing='px-2' />
}

export default SalaryTable