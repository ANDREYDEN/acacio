import Table from '@components/Table'
import { SalesPerDay } from '@interfaces'
import { useTranslation } from 'next-i18next'
import React, { useMemo } from 'react'
import { Column } from 'react-table'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import NumberInputCell from '@components/NumberInputCell'
import NumericCell from '@components/NumericCell'

interface ISalesTable {
    data: SalesPerDay[]
}

const SalesTable: React.FC<ISalesTable> = ({ data }: ISalesTable) => {
    const { t } = useTranslation('sales')
    const router = useRouter()

    const columns: Column<SalesPerDay>[] = useMemo(
        () => [
            {
                Header: <h1>{t('table_headers.date').toString()}</h1>,
                accessor: 'date',
                Cell: ({ value: date }: { value: dayjs.Dayjs }) => <span>{date.format('DD.MM')}</span>
            },
            {
                Header: <h1>{t('table_headers.dayOfWeek').toString()}</h1>,
                accessor: 'dayOfWeek',
                Cell: ({ value: dayOfWeek }: { value: dayjs.Dayjs }) => {
                    const dayOfWeekInNeededLanguage = dayOfWeek.locale(router.locale?.split('-')[0] ?? 'en').format('dd')
                    const formattedDay = `${dayOfWeekInNeededLanguage[0]?.toUpperCase()}${dayOfWeekInNeededLanguage.slice(1)}`

                    return <span>{formattedDay}</span>
                }
            },
            {
                Header: <h1>{t('table_headers.customers').toString()}</h1>,
                accessor: 'customers',
            },
            {
                Header: <h1>{t('table_headers.averageBill').toString()}</h1>,
                accessor: 'averageBill',
                Cell: ({ value }) => <NumericCell value={value} />
            },
            {
                Header: <h1>{t('table_headers.kitchenRevenue').toString()}</h1>,
                accessor: 'kitchenRevenue',
                Cell: ({ value }) => <NumericCell value={value} />
            },
            {
                Header: <h1>{t('table_headers.kitchenProfit').toString()}</h1>,
                accessor: 'kitchenProfit',
                Cell: ({ value }) => <NumericCell value={value} />
            },
            {
                Header: <h1>{t('table_headers.barRevenue').toString()}</h1>,
                accessor: 'barRevenue',
                Cell: ({ value }) => <NumericCell value={value} />
            },
            {
                Header: <h1>{t('table_headers.barProfit').toString()}</h1>,
                accessor: 'barProfit',
                Cell: ({ value }) => <NumericCell value={value} />
            },
            {
                Header: <h1>{t('table_headers.totalRevenue').toString()}</h1>,
                accessor: 'totalRevenue',
                Cell: ({ value }) => <NumericCell value={value} />
            },
            {
                Header: <h1>{t('table_headers.totalProfit').toString()}</h1>,
                accessor: 'totalProfit',
                Cell: ({ value }) => <NumericCell value={value} />
            },
        ],
        [router.locale, t]
    )

    return <Table columns={columns} data={data} tableSpacing='px-2' />
}

export default SalesTable