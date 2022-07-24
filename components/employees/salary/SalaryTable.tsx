import React, { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { Column } from 'react-table'
import { BonusInputCell, CurrencyCell, NumberInputCell, Table } from '@components'
import { IBonusInput, IPrepaidExpense, IRetention, SalaryTableRow } from '@interfaces'

interface ISalaryTable {
    data: SalaryTableRow[],
    toggleModalForBonus: (bonus: IBonusInput) => void
}

const SalaryTable: React.FC<ISalaryTable> = ({ data, toggleModalForBonus }: ISalaryTable) => {
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
                Header: <h1>{t('table.prepaidExpense')}</h1>,
                accessor: 'prepaidExpenseDto',
                Cell: ({ value }: { value: IPrepaidExpense }) =>
                    <NumberInputCell
                        value={value.value.amount ?? 0}
                        onBlur={value.onAmountChange}
                        additionalStyle='w-16'
                    />
            },
            {
                Header: <h1>{t('table.retention')}</h1>,
                accessor: 'retentionDto',
                Cell: ({ value }: { value: IRetention }) =>
                    <NumberInputCell
                        value={value.value.amount ?? 0}
                        onBlur={value.onAmountChange}
                        additionalStyle='w-16'
                    />
            },
            {
                Header: <h1>{t('table.bonus')}</h1>,
                accessor: 'bonusDto',
                Cell: ({ value: bonusDto }) =>
                    <BonusInputCell
                        bonus={bonusDto}
                        toggleModalForBonus={() => toggleModalForBonus(bonusDto)}
                    />
            },
            {
                Header: <h1>{t('table.incomeTotal')}</h1>,
                accessor: 'incomeTotal',
                Cell: CurrencyCell
            },
        ],
        [t, toggleModalForBonus]
    )

    return <Table columns={columns} data={data} tableSpacing='px-2' />
}

export default SalaryTable
