import React, { useMemo, useState } from 'react'
import { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import useSWR from 'swr'
import { Calendar } from 'react-iconly'
import { posterGetSales } from '@services/poster'
import { IDropdownItem, SalesPerDay } from '@interfaces'
import { Dropdown, ErrorMessage, Loader, SalesTable } from '@components'
import { enforceAuthenticated } from '@lib/utils'
import { useMounted } from '@lib/hooks'

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['sales']),
    },
}))

const Sales: NextPage = () => {
    const defaultDateFrom = dayjs().subtract(7, 'day')
    const defaultDateTo = dayjs()
    const { mounted } = useMounted()
    const [dateFrom, setDateFrom] = useState(defaultDateFrom)
    const [dateTo, setDateTo] = useState(defaultDateTo)
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

    const timeframeFilter = () => {
        setDateFrom(defaultDateFrom)
        setDateTo(defaultDateTo)
    }
    const timeFrameOptions: IDropdownItem[] = [
        {
            label: 'Last Day',
            action: () => {
                setDateFrom(dayjs().subtract(1, 'day'))
                setDateTo(dayjs())
            }
        },
        {
            label: 'Last 14 days',
            action: () => {
                setDateFrom(dayjs().subtract(14, 'day'))
                setDateTo(dayjs())
            }
        }
    ]

    if (!mounted || loading) {
        return <Loader />
    }

    return (
        <div className='flex flex-col'>
            <div className='w-full flex items-center mb-6'>
                <h3>{t('header').toString()}</h3>
            </div>
            <div className='w-full flex items-center mb-6'>
                <Dropdown
                    label='Timeframe'
                    items={timeFrameOptions}
                    icon={<Calendar primaryColor='grey' />}
                    filter={timeframeFilter}
                />
            </div>

            {error && (<ErrorMessage message={`Error fetching sales: ${error}`} errorMessageClass='mb-8 w-full' />)}
            <SalesTable data={tableData} />
        </div>
    )
}

export default Sales