import { ErrorMessage, Loader, SalesTable, TimeframeDropdown } from '@components'
import Button from '@components/Button'
import ColumnSelectorDropdown from '@components/ColumnSelectorDropdown'
import { SalesPerDay } from '@interfaces'
import { useMounted } from '@lib/hooks'
import { enforceAuthenticated } from '@lib/utils'
import { posterGetSales } from '@services/poster'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useMemo, useState } from 'react'
import useSWR from 'swr'

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['sales', 'timeframe', 'common']),
    },
}))


const Sales: NextPage = () => {
    const defaultDateFrom = dayjs().subtract(1, 'day')
    const defaultDateTo = dayjs()
    const { mounted } = useMounted()
    const [dateFrom, setDateFrom] = useState(defaultDateFrom)
    const [dateTo, setDateTo] = useState(defaultDateTo)
    const { t } = useTranslation('sales')

    const timeframeOptions: Record<string, dayjs.Dayjs> = {
        [t('last_day', { ns: 'timeframe' })]: dayjs().subtract(1, 'day'),
        [t('last_7_days', { ns: 'timeframe' })]: dayjs().subtract(7, 'day'),
        [t('last_14_days', { ns: 'timeframe' })]: dayjs().subtract(14, 'day'),
        [t('last_30_days', { ns: 'timeframe' })]: dayjs().subtract(30, 'day'),
        [t('last_quarter', { ns: 'timeframe' })]: dayjs().subtract(3, 'month')
    }
    const { data: sales, error } = useSWR(['getSales', dateFrom, dateTo], () => posterGetSales(dateFrom, dateTo))
    const loading = !sales

    const tableData: SalesPerDay[] = useMemo(() =>
        (sales ?? []).map((salePerDay) => {
            const row = {
                date: salePerDay.date,
                dayOfWeek: salePerDay.dayOfWeek,
                customers: salePerDay.customers,
                averageBill: salePerDay.averageBill,
                kitchenRevenue: salePerDay.kitchenRevenue,
                kitchenProfit: salePerDay.kitchenProfit,
                barRevenue: salePerDay.barRevenue,
                barProfit: salePerDay.barProfit,
                totalRevenue: salePerDay.totalRevenue,
                totalProfit: salePerDay.totalProfit,
            }

            return row
        }),
    [sales]
    )

    const columnSelectorOptions = [
        t('table_headers.date').toString(),
        t('table_headers.dayOfWeek').toString(),
        t('table_headers.customers').toString(),
        t('table_headers.averageBill').toString(),
        t('table_headers.kitchenRevenue').toString(),
        t('table_headers.kitchenProfit').toString(),
        t('table_headers.barRevenue').toString(),
        t('table_headers.barProfit').toString(),
        t('table_headers.totalRevenue').toString(),
        t('table_headers.totalProfit').toString(),
    ]

    const handleExport = () => {
        // TODO: implement export
    }

    if (!mounted) {
        return <Loader />
    }

    return (
        <div className='flex flex-col'>
            <div className='w-full flex justify-between mb-6'>
                <div>
                    <h3>{t('header').toString()}</h3>
                    {dayjs().format('MMMM, YYYY')}
                </div>
                <div className='space-x-8'>
                    <Button 
                        label={t('export', { ns: 'common' })} 
                        variant='secondary' 
                        buttonClass='w-56'
                        onClick={handleExport}
                    />
                </div>
            </div>
            <div className='w-full flex justify-between mb-8'>
                <TimeframeDropdown
                    setDateFrom={setDateFrom}
                    setDateTo={setDateTo}
                    defaultDateFrom={defaultDateFrom}
                    defaultDateTo={defaultDateTo}
                    timeframeOptions={timeframeOptions}
                />
                <ColumnSelectorDropdown
                    columns={columnSelectorOptions}
                />
            </div>

            {error
                ? <ErrorMessage message={`Error fetching sales: ${error}`} errorMessageClass='mb-8 w-full' />
                : loading ? <Loader /> : <SalesTable data={tableData} />
            }
        </div>
    )
}

export default Sales