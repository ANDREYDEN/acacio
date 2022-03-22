import React, { useMemo, useState } from 'react'
import { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import useSWR from 'swr'
import { posterGetSales } from '@services/poster'
import { SalesPerDay } from '@interfaces'
import { ErrorMessage, Loader, SalesTable } from '@components'
import { enforceAuthenticated } from '@lib/utils'
import { useMounted } from '@lib/hooks'

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['sales']),
    },
}))

const Sales: NextPage = () => {
    const { mounted } = useMounted()
    const [dateFrom, setDateFrom] = useState(dayjs().subtract(7, 'day'))
    const [dateTo, setDateTo] = useState(dayjs())
    const { t } = useTranslation('sales')

    const { data: sales, error } = useSWR('getSales', () => posterGetSales(dateFrom, dateTo))
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

    if (!mounted || loading) {
        return <Loader />
    }

    return (
        <div className='flex flex-col'>
            <h3 className='mb-8'>{t('header').toString()}</h3>
            {error && (<ErrorMessage message={`Error fetching sales: ${error}`} errorMessageClass='mb-8 w-full' />)}
            <SalesTable data={tableData} />
        </div>
    )
}

export default Sales