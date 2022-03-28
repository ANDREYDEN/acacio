import { ErrorMessage, Loader, Multiselect, SalesTable, TimeframeDropdown } from '@components'
import Button from '@components/Button'
import { SalesPerDay } from '@interfaces'
import { useMounted } from '@lib/hooks'
import { enforceAuthenticated } from '@lib/utils'
import { posterGetSales } from '@services/poster'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useCallback, useMemo, useState } from 'react'
import { Document } from 'react-iconly'
import useSWR from 'swr'

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['sales', 'timeframe', 'common']),
    },
}))


const Sales: NextPage = () => {
    const { t } = useTranslation('sales')
    const defaultDateFrom = dayjs().subtract(7, 'day')
    const defaultDateTo = dayjs()
    const { mounted } = useMounted()
    const [dateFrom, setDateFrom] = useState(defaultDateFrom)
    const [dateTo, setDateTo] = useState(defaultDateTo)

    const columnSelectorOptions: (keyof SalesPerDay)[] = useMemo(() => [
        'date',
        'dayOfWeek',
        'customers',
        'averageBill',
        'kitchenRevenue',
        'kitchenProfit',
        'barRevenue',
        'barProfit',
        'totalRevenue',
        'totalProfit',
    ], [])

    const defaultColumns: (keyof SalesPerDay)[] = useMemo(() => [
        'date'
    ], [])

    const [selectedColumns, setSelectedColumns] = useState<string[]>(columnSelectorOptions)

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

    const toLabel = useCallback((accessor: string) => t(`table_headers.${accessor}`).toString(), [t])
    const fromLabel = useCallback(
        (label: string) => columnSelectorOptions.find(c => label === toLabel(c)) ?? label, 
        [columnSelectorOptions, toLabel]
    )

    const handleSelectionChanged = (columns: string[]) => {
        setSelectedColumns(columns.map(fromLabel))
    }

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
                <Multiselect
                    label={t('display', { ns: 'common' })}
                    icon={<Document primaryColor='grey' />}
                    buttonClass='w-32'
                    items={columnSelectorOptions}
                    selectedItems={selectedColumns}
                    disabledItems={defaultColumns}
                    onSelectionChanged={handleSelectionChanged}
                    itemFormatter={toLabel}
                />
            </div>

            {error
                ? <ErrorMessage message={`Error fetching sales: ${error}`} errorMessageClass='mb-8 w-full' />
                : loading ? <Loader /> : <SalesTable data={tableData} selectedColumns={selectedColumns} />
            }
        </div>
    )
}

export default Sales