import { NextPage } from 'next'
import React, { useEffect, useMemo, useState } from 'react'
import { enforceAuthenticated } from '@lib/utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { posterGetSales } from '@services/poster'
import { SalesTableRow } from '@interfaces'
import SalesTable from '@components/SalesTable'
import { useRouter } from 'next/router'
import 'dayjs/locale/ru'
import Loader from '@components/Loader'
import { useMounted } from '@lib/hooks'
import dayjs from 'dayjs'
import { SalePerDayDto } from '../interfaces/Poster'
import ErrorMessage from '@components/ErrorMessage'

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['sales']),
    },
}))

const Sales: NextPage = () => {
    const { mounted } = useMounted()
    const router = useRouter()
    const [dateFrom, setDateFrom] = useState(dayjs().subtract(2, 'month'))
    const [dateTo, setDateTo] = useState(dateFrom.add(3, 'day'))
    const { t } = useTranslation('sales')
    const [sales, setSales] = useState<SalePerDayDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        (async () => {
            try {
                const sales = await posterGetSales(dateFrom, dateTo)
                setSales(sales)
            } catch (e: any) {
                setError(e.toString())
            } finally {
                setLoading(false)
            }
        })()
    }, [dateFrom, dateTo])

    const tableData: SalesTableRow[] = useMemo(() =>
        sales.map((salePerDay) => {
            const dayOfWeekInNeededLanguage = salePerDay.date.locale(router.locale?.split('-')[0] ?? 'en').format('dd')
            const dayOfWeek = `${dayOfWeekInNeededLanguage[0]?.toUpperCase()}${dayOfWeekInNeededLanguage.slice(1)}`

            const row = {
                date: salePerDay.date.format('DD.MM'),
                dayOfWeek,
                customers: salePerDay.customers
            }

            return row
        }),
    [router.locale, sales]
    )

    if (!mounted || loading) {
        return <Loader />
    }

    return (
        <div className='flex flex-col py-2 lg:mr-20 mr-10'>
            <h3 className='mb-8'>{t('header').toString()}</h3>
            {error && (<ErrorMessage message={`Error fetching sales: ${error}`} errorMessageClass='mb-8 w-full' />)}
            <SalesTable data={tableData} />
        </div>
    )
}

export default Sales