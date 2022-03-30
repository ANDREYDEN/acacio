import { Button, ErrorMessage, Loader, Multiselect, StockTable, TimeframeDropdown } from '@components'
import { Ingredient } from '@lib/posterTypes'
import { enforceAuthenticated } from '@lib/utils'
import { posterInstance } from '@services/poster'
import { IDropdownItem } from '@interfaces'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useCallback, useMemo, useState } from 'react'
import { Document } from 'react-iconly'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(weekday)

export const getServerSideProps = enforceAuthenticated(async (context: any) => {
    try {
        const { data } = await posterInstance.get('storage.getReportMovement')
        if (data.error) throw data.error
        const ingredients = data.response
        return {
            props: {
                ingredients,
                ...await serverSideTranslations(context.locale, ['stock', 'common', 'timeframe']),
            }
        }
    } catch(e: any) {
        return { 
            props:
            {
                ingredients: [],
                error: e.message,
                ...await serverSideTranslations(context.locale, ['stock', 'common', 'timeframe']),
            }
        }
    }  
})

type StockProps = {
  ingredients: Ingredient[],
  error: string | null
}

const Stock: NextPage<StockProps> = ({ ingredients, error }) => {
    const defaultDateFrom = dayjs().subtract(2, 'week').weekday(4)
    const defaultDateTo = dayjs().weekday(0)
    // TODO: when retrieving needed data, take dateFrom and dateTo into the account
    const [dateFrom, setDateFrom] = useState(defaultDateFrom)
    const [dateTo, setDateTo] = useState(defaultDateTo)
    const { t } = useTranslation('stock')
    const { t: timeframeTranslation } = useTranslation('timeframe')

    const timeframeOptions: IDropdownItem[] = [
        { label: timeframeTranslation('1_week'), value: dayjs().subtract(1, 'week') },
        { label: timeframeTranslation('1_and_half_weeks'), value: dayjs().subtract(7, 'day') },
        { label: timeframeTranslation('2_weeks'), value: dayjs().subtract(2, 'week') },
        { label: timeframeTranslation('1_month'), value: dayjs().subtract(1, 'month') },
    ]

    const columnSelectorOptions: (keyof Ingredient)[] = useMemo(() => [
        'ingredient_id',
        'ingredient_name',
        'start',
        'end'
    ], [])

    const defaultColumns: (keyof Ingredient)[] = [
        'ingredient_id'
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

    const data = useMemo(
        () => ingredients, 
        [ingredients]
    )
    const loading = !data

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
                : loading ? <Loader /> : <StockTable data={data} selectedColumns={selectedColumns} />
            }
        </div>
    )
}

export default Stock