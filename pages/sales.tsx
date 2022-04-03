import { Dropdown, ErrorMessage, Loader, Multiselect, SalesTable, TimeframeDropdown } from '@components'
import Button from '@components/Button'
import { IDropdownItem, SalesPerDay } from '@interfaces'
import { useMounted } from '@lib/hooks'
import exportToXLSX from '@lib/services/exportService'
import { capitalizeWord, enforceAuthenticated } from '@lib/utils'
import { posterGetSales } from '@services/poster'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import localeData from 'dayjs/plugin/localeData'
import { Column } from 'exceljs'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo, useState } from 'react'
import { Calendar, Document } from 'react-iconly'
import useSWR from 'swr'
dayjs.extend(localeData)

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
    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<IDropdownItem | undefined>()
    const { t: timeframeTranslation } = useTranslation('timeframe')
    const { t } = useTranslation('sales')
    const router = useRouter()

    const timeframeOptions: IDropdownItem[] = [
        { label: timeframeTranslation('last_day'), value: dayjs().subtract(1, 'day') },
        { label: timeframeTranslation('last_7_days'), value: dayjs().subtract(7, 'day') },
        { label: timeframeTranslation('last_14_days'), value: dayjs().subtract(14, 'day') },
        { label: timeframeTranslation('last_30_days'), value: dayjs().subtract(30, 'day') },
        { label: timeframeTranslation('last_quarter'), value: dayjs().subtract(3, 'month' ) }
    ]

    const { data: sales, error } = useSWR(
        ['getSales', dateFrom, dateTo, selectedDayOfWeek],
        () => posterGetSales(dateFrom, dateTo, selectedDayOfWeek?.value as number)
    )
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

    const weekDays = dayjs().locale(router.locale?.split('-')[0] ?? 'en').localeData().weekdays()
    const weekDaysDropdownItems: IDropdownItem[] = weekDays.map((day, index) => {
        return { label: capitalizeWord(day), value: index }
    })

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

        const columnWidths: Record<string, number> = {
            date: 10,
            dayOfWeek: 15,
            customers: 15,
            averageBill: 15,
            kitchenRevenue: 20,
            kitchenProfit: 20,
            barRevenue: 20,
            barProfit: 20,
            totalRevenue: 20,
            totalProfit: 15,
        }

        const columns: Partial<Column>[] = selectedColumns.map(accessor => ({
            key: accessor, 
            header: t(`table_headers.${accessor}`).toString(), 
            width: columnWidths[accessor]
        }))
        
        exportToXLSX(exportData, columns, `Sales ${dateFrom.format('DD MMM')} - ${dateTo.format('DD MMM')}`)
    }

    if (!mounted) {
        return <Loader />
    }

    return (
        <div className='flex flex-col'>
            <div className='w-full flex justify-between mb-6'>
                <h3>{t('header')}</h3>
                <Button
                    label={t('export', { ns: 'common' })}
                    variant='secondary'
                    buttonClass='w-56'
                    onClick={handleExport}
                />
            </div>
            {error
                ? <ErrorMessage message={`Error fetching sales: ${error}`} errorMessageClass='mb-8 w-full' />
                : loading ? <Loader /> : <>
                    <div className='w-full flex justify-between mb-8'>
                        <div className='flex space-x-4'>
                            <TimeframeDropdown
                                setDateFrom={setDateFrom}
                                setDateTo={setDateTo}
                                defaultDateFrom={defaultDateFrom}
                                defaultDateTo={defaultDateTo}
                                timeframeOptions={timeframeOptions}
                            />
                            <Dropdown
                                label={t('day_of_week_filter')}
                                items={weekDaysDropdownItems}
                                onItemSelected={item => setSelectedDayOfWeek(item)}
                                icon={<Calendar primaryColor={selectedDayOfWeek ? 'white' : '#B3B3B3'} />}
                                withClearFilter={true}
                                selectedOption={selectedDayOfWeek?.label}
                            />
                        </div>
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
                    <SalesTable data={tableData} selectedColumns={selectedColumns} />
                </>
            }
        </div>
    )
}

export default Sales