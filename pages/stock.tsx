import { Button, ErrorMessage, Loader, Multiselect, StockTable, TimeframeDropdown } from '@components'
import { StockTableRow } from '@interfaces'
import { posterGetIngredientMovement } from '@lib/services/poster'
import { enforceAuthenticated } from '@lib/utils'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useCallback, useMemo, useState } from 'react'
import { Document } from 'react-iconly'
import useSWR from 'swr'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(weekday)

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['stock', 'common', 'timeframe']),
    }
}))

const Stock: NextPage = () => {
    const defaultDateFrom = dayjs().subtract(2, 'week').weekday(4)
    const defaultDateTo = dayjs().weekday(0)
    const [dateFrom, setDateFrom] = useState(defaultDateFrom)
    const [dateTo, setDateTo] = useState(defaultDateTo)
    const { t: timeframeTranslation } = useTranslation('timeframe')
    const { t } = useTranslation('stock')

    const timeframeOptions: Record<string, dayjs.Dayjs> = {
        [timeframeTranslation('1_week')]: dayjs().subtract(1, 'week'),
        [timeframeTranslation('1_and_half_weeks')]: dayjs().subtract(7, 'day'),
        [timeframeTranslation('2_weeks')]: dayjs().subtract(2, 'week'),
        [timeframeTranslation('1_month')]: dayjs().subtract(1, 'month'),
    }

    const { data: rows, error } = useSWR(
        ['getIngredients', dateFrom, dateTo], 
        () => posterGetIngredientMovement(dateFrom, dateTo)
    )
    const loading = !rows

    const columnSelectorOptions: (keyof StockTableRow)[] = useMemo(() => [
        'ingredientName',
        'category',
        'supplier',
        'initialBalance',
        'initialAvgCost',
        'sold',
        'soldCost',
        'writeOff',
        'writeOffCost',
        'lastSupply',
        'finalBalance',
        'finalBalanceCost',
        'finalAverageCost',
        'reorder',
        'toOrder',
        'totalCost',
    ], [])

    const defaultColumns: (keyof StockTableRow)[] = [
        'ingredientName',
        'category',
        'supplier',
        'toOrder',
        'totalCost'
    ]

    const [selectedColumns, setSelectedColumns] = useState<string[]>(columnSelectorOptions)

    const toLabel = useCallback((accessor: string) => t(`table_headers.${accessor}`).toString(), [t])
    const fromLabel = useCallback(
        (label: string) => columnSelectorOptions.find(c => label === toLabel(c)) ?? label,
        [columnSelectorOptions, toLabel]
    )

    const handleSelectionChanged = (items: string[]) => {
        setSelectedColumns(items.map(fromLabel))
    }

    const handleExport = () => {
        // TODO: add export
    }

    // const data: StockTableRow[] = useMemo(
    //     () => (rows ?? []).map(ingredient => ({
    //         ingredientName: ingredient.ingredient_name,
    //         category: '',
    //         supplier: '',
    //         initialBalance: ingredient.start.toString(),
    //         initialAvgCost: ingredient.cost_start,
    //         sold: '', // possibly calculated
    //         soldCost: 0, // possibly calculated
    //         writeOff: ingredient.write_offs.toString(),
    //         writeOffCost: 0,
    //         lastSupply: '', // derived from supplies
    //         finalBalance: ingredient.end.toString(),
    //         finalAverageCost: ingredient.cost_end,
    //         finalBalanceCost: 0, // 
    //         reorder: '',
    //         toOrder: '', // custom input
    //         totalCost: 0, // possibly calculated
    //     })), 
    //     [rows]
    // )

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
            <div className='w-full flex justify-between mb-6'>
                <TimeframeDropdown
                    setDateFrom={setDateFrom}
                    setDateTo={setDateTo}
                    defaultDateFrom={defaultDateFrom}
                    defaultDateTo={defaultDateTo}
                    timeframeOptions={timeframeOptions}
                    defaultTimeframe={timeframeTranslation('1_and_half_weeks')}
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
                ? <ErrorMessage message={error} errorMessageClass='max-h-32 mt-6 flex flex-col justify-center' />
                : loading 
                    ? <Loader /> 
                    : <StockTable selectedColumns={selectedColumns} data={rows} />
            }
        </div>
    )
}

export default Stock