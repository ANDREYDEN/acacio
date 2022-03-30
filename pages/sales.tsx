import { ErrorMessage, Loader, Multiselect, SalesTable, TimeframeDropdown } from '@components'
import Button from '@components/Button'
import { SalesPerDay } from '@interfaces'
import { useMounted } from '@lib/hooks'
import exportToXLSX from '@lib/services/exportService'
import { enforceAuthenticated } from '@lib/utils'
import { posterGetSales } from '@services/poster'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { Column } from 'exceljs'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo, useState } from 'react'
import { Document } from 'react-iconly'
import useSWR from 'swr'

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['sales', 'common', 'timeframe']),
    },
}))


const Sales: NextPage = () => {
    const defaultDateFrom = dayjs().subtract(7, 'day')
    const defaultDateTo = dayjs()
    const { mounted } = useMounted()
    const [dateFrom, setDateFrom] = useState(defaultDateFrom)
    const [dateTo, setDateTo] = useState(defaultDateTo)
    const { t: timeframeTranslation } = useTranslation('timeframe')
    const { t } = useTranslation('sales')
    const router = useRouter()

    const timeframeOptions: Record<string, dayjs.Dayjs> = {
        [timeframeTranslation('last_day')]: dayjs().subtract(1, 'day'),
        [timeframeTranslation('last_7_days')]: dayjs().subtract(7, 'day'),
        [timeframeTranslation('last_14_days')]: dayjs().subtract(14, 'day'),
        [timeframeTranslation('last_30_days')]: dayjs().subtract(30, 'day'),
        [timeframeTranslation('last_quarter')]: dayjs().subtract(3, 'month')
    }
    const { data: sales, error } = useSWR(['getSales', dateFrom, dateTo], () => posterGetSales(dateFrom, dateTo))
    const loading = !sales

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

    const defaultColumns: (keyof SalesPerDay)[] = useMemo(() => ['date'], [])
    const [selectedColumns, setSelectedColumns] = useState<string[]>(columnSelectorOptions)

    const tableData: SalesPerDay[] = useMemo(() => sales ?? [], [sales])

    const toLabel = useCallback((accessor: string) => t(`table_headers.${accessor}`).toString(), [t])
    const fromLabel = useCallback(
        (label: string) => columnSelectorOptions.find(c => label === toLabel(c)) ?? label,
        [columnSelectorOptions, toLabel]
    )

    const handleSelectionChanged = (columns: string[]) => {
        setSelectedColumns(columns.map(fromLabel))
    }

    const handleExport = () => {
        const exportData = tableData.map(row => ({ 
            ...row, 
            date: row.date.format('DD.MM'),
            dayOfWeek: row.dayOfWeek.locale(router.locale?.split('-')[0] ?? 'en').format('dd'),
        }))

        const columns: Partial<Column>[] = [
            { key: 'date', header: t('table_headers.date').toString() },
            { key: 'dayOfWeek', header: t('table_headers.dayOfWeek').toString(), width: 15 },
            { key: 'customers', header: t('table_headers.customers').toString(), width: 15 },
            { key: 'averageBill', header: t('table_headers.averageBill').toString(), width: 15 },
            { key: 'kitchenRevenue', header: t('table_headers.kitchenRevenue').toString(), width: 20 },
            { key: 'kitchenProfit', header: t('table_headers.kitchenProfit').toString(), width: 20 },
            { key: 'barRevenue', header: t('table_headers.barRevenue').toString(), width: 20 },
            { key: 'barProfit', header: t('table_headers.barProfit').toString(), width: 20 },
            { key: 'totalRevenue', header: t('table_headers.totalRevenue').toString(), width: 20 },
            { key: 'totalProfit', header: t('table_headers.totalProfit').toString(), width: 15 }
        ]
        exportToXLSX(exportData, columns, `Sales ${dateFrom.format('DD MMM')} - ${dateTo.format('DD MMM')}`)
    }

    if (!mounted) {
        return <Loader />
    }

    return (
        <div className='flex flex-col'>
            <div className='w-full flex justify-between mb-6'>
                <div>
                    <h3>{t('header')}</h3>
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