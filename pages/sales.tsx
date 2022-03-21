import { NextPage } from 'next'
import React, { useMemo, useState } from 'react'
import { enforceAuthenticated } from '@lib/utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { posterGetSales } from '@services/poster'
import { SalesPerDay } from '@interfaces'
import SalesTable from '@components/SalesTable'
import 'dayjs/locale/ru'
import Loader from '@components/Loader'
import { useMounted } from '@lib/hooks'
import dayjs from 'dayjs'
import ErrorMessage from '@components/ErrorMessage'
import useSWR from 'swr'
import Button from '@components/Button'
import ValidatedDropdown from '@components/ValidatedDropdown'
import { useForm } from 'react-hook-form'

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['sales']),
    },
}))

const Sales: NextPage = () => {
    const { mounted } = useMounted()
    const [dateFrom, setDateFrom] = useState(dayjs().subtract(3, 'day'))
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

    const handleExport = () => {
        // TODO: implement export
    }

    const { control } = useForm()

    if (!mounted || loading) {
        return <Loader />
    }

    return (
        <div className='flex flex-col'>
            <div className='w-full flex justify-between mb-8'>
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
                <div className='space-x-8'>
                    <ValidatedDropdown
                        label={t('display', { ns: 'common' })}
                        name='role_id'
                        data={Object.keys(tableData).map(key => ({ label: key, value: key }))}
                        defaultOption={t('modal.role_placeholder')}
                        dropdownClass='mb-6' 
                        control={control} 
                    />
                </div>
            </div>
            {error && (<ErrorMessage message={`Error fetching sales: ${error}`} errorMessageClass='mb-8 w-full' />)}
            <SalesTable data={tableData} />
        </div>
    )
}

export default Sales