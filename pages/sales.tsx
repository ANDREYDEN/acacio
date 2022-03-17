import { NextPage } from 'next'
import React, { useMemo, useState } from 'react'
import { enforceAuthenticated } from '@lib/utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { usePosterGetSales } from '@services/poster'
import { SalesTableRow } from '@interfaces'
import SalesTable from '@components/SalesTable'
import { useRouter } from 'next/router'
import 'dayjs/locale/ru'
import Loader from '@components/Loader'
import { useMounted } from '@lib/hooks'

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['sales']),
    },
}))

const Sales: NextPage = () => {
    const { mounted } = useMounted()
    const router = useRouter()
    const { t } = useTranslation('sales')
    const { sales, salesLoading, salesError, revalidateSales } = usePosterGetSales()

    const tableData: SalesTableRow[] = useMemo(() =>
        sales.map((salePerDay) => {
            const dayOfWeekInNeededLanguage = salePerDay.date.locale(router.locale?.split('-')[0] ?? 'en').format('dd')
            const dayOfWeek = `${dayOfWeekInNeededLanguage[0]?.toUpperCase()}${dayOfWeekInNeededLanguage.slice(1)}`

            const row = {
                date: salePerDay.date.format('DD.MM'),
                dayOfWeek,
            }

            return row
        }),
    [router.locale, sales]
    )

    if (!mounted || salesLoading) {
        return <Loader />
    }

    return (
        <div className='flex flex-col py-2 lg:mr-20 mr-10'>
            <h3 className='mb-8'>{t('header').toString()}</h3>
            <SalesTable data={tableData} />
        </div>
    )
}

export default Sales