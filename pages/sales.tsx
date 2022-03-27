import React, { useMemo, useState } from 'react'
import { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import useSWR from 'swr'
import { posterGetSales } from '@services/poster'
import { SalesPerDay } from '@interfaces'
import { ErrorMessage, Loader, SalesTable, TimeframeDropdown } from '@components'
import { enforceAuthenticated } from '@lib/utils'
import { useMounted } from '@lib/hooks'

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['sales', 'timeframe', 'common']),
    },
}))


const Sales: NextPage = () => {
    const defaultDateFrom = dayjs().subtract(7, 'day')
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

    if (!mounted) {
        return <Loader />
    }

    return (
        <div className='flex flex-col'>
            <div className='w-full flex items-center mb-6'>
                <h3>{t('header')}</h3>
            </div>
            <div className='w-full flex items-center mb-6'>
                <TimeframeDropdown
                    setDateFrom={setDateFrom}
                    setDateTo={setDateTo}
                    defaultDateFrom={defaultDateFrom}
                    defaultDateTo={defaultDateTo}
                    timeframeOptions={timeframeOptions}
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