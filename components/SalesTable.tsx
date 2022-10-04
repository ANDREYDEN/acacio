import { CurrencyCell, Table } from '@components'
import { SalesPerDay } from '@interfaces'
import dayjs from 'dayjs'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { Column } from 'react-table'
import { capitalizeWord } from '@lib/utils'

interface ISalesTable {
    data: SalesPerDay[]
    selectedColumns: string[]
}

const SalesTable: React.FC<ISalesTable> = ({ data, selectedColumns }: ISalesTable) => {
    const { t } = useTranslation('sales')
    const router = useRouter()

    const columns: Column<SalesPerDay>[] = useMemo(
        () => [
            {
                Header: <h1>{t('table_headers.date').toString()}</h1>,
                accessor: 'date',
                Cell: ({ value: date }: { value: dayjs.Dayjs }) => <span>{date.format('DD.MM')}</span>,
                Footer: <h1>Total:</h1>
            },
            {
                Header: <h1>{t('table_headers.dayOfWeek').toString()}</h1>,
                accessor: 'dayOfWeek',
                Cell: ({ value: dayOfWeek }: { value: dayjs.Dayjs }) => {
                    const dayOfWeekInNeededLanguage = dayOfWeek.locale(router.locale?.split('-')[0] ?? 'en').format('dd')
                    const formattedDay = capitalizeWord(dayOfWeekInNeededLanguage)

                    return <span>{formattedDay}</span>
                }
            },
            {
                Header: <h1>{t('table_headers.customers').toString()}</h1>,
                accessor: 'customers',
                Footer: <h1>Popular</h1>
            },
            {
                Header: <h1>{t('table_headers.averageBill').toString()}</h1>,
                accessor: 'averageBill',
                Cell: CurrencyCell,
                Footer: <h1>Popular</h1>
            },
            {
                Header: <h1>{t('table_headers.kitchenRevenue').toString()}</h1>,
                accessor: 'kitchenRevenue',
                Cell: CurrencyCell,
                Footer: <h1>Popular</h1>
            },
            {
                Header: <h1>{t('table_headers.kitchenProfit').toString()}</h1>,
                accessor: 'kitchenProfit',
                Cell: CurrencyCell,
                Footer: <h1>Popular</h1>
            },
            {
                Header: <h1>{t('table_headers.barRevenue').toString()}</h1>,
                accessor: 'barRevenue',
                Cell: CurrencyCell,
                Footer: <h1>Popular</h1>
            },
            {
                Header: <h1>{t('table_headers.barProfit').toString()}</h1>,
                accessor: 'barProfit',
                Cell: CurrencyCell,
                Footer: <h1>Popular</h1>
            },
            {
                Header: <h1>{t('table_headers.totalRevenue').toString()}</h1>,
                accessor: 'totalRevenue',
                Cell: CurrencyCell,
                Footer: <h1>Popular</h1>
            },
            {
                Header: <h1>{t('table_headers.totalProfit').toString()}</h1>,
                accessor: 'totalProfit',
                Cell: CurrencyCell,
                Footer: <h1>Popular</h1>
            },
        ],
        [router.locale, t]
    )

    const filteredColumns = useMemo(() => {
        return columns.filter(c => c.accessor && selectedColumns.includes(c.accessor as string))
    }, [columns, selectedColumns])

    return <Table columns={filteredColumns} data={data} tableSpacing='px-2' footer={true} />
}

export default SalesTable