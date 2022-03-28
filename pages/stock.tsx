import React, { useMemo, useState } from 'react'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { posterInstance } from '@services/poster'
import { enforceAuthenticated } from '@lib/utils'
import { Ingredient } from '@lib/posterTypes'
import { Button, ErrorMessage, StockTable } from '@components'
import ColumnSelector from '@components/ColumnSelector'

export const getServerSideProps = enforceAuthenticated(async (context: any) => {
    try {
        const { data } = await posterInstance.get('storage.getReportMovement')
        if (data.error) throw data.error
        const ingredients = data.response
        return {
            props: {
                ingredients,
                ...await serverSideTranslations(context.locale, ['stock', 'common']),
            }
        }
    } catch(e: any) {
        return { 
            props:
            {
                ingredients: [],
                error: e.message,
                ...await serverSideTranslations(context.locale, ['stock', 'common']),
            }
        }
    }  
})

type StockProps = {
  ingredients: Ingredient[],
  error: string | null
}

const Stock: NextPage<StockProps> = ({ ingredients, error }) => {
    const { t } = useTranslation('stock')

    const columnSelectorOptions: (keyof Ingredient)[] = [
        'ingredient_id',
        'ingredient_name',
        'start',
        'end'
    ]

    const defaultColumns: (keyof Ingredient)[] = [
        'ingredient_id'
    ]

    const [selectedColumns, setSelectedColumns] = useState<string[]>(columnSelectorOptions)

    const handleSelectionChanged = (items: string[]) => {
        setSelectedColumns(items)
    }

    const columnAccessorToLabel = (accessor: string) => t(`table_headers.${accessor}`).toString()

    const handleExport = () => {
        // TODO: add export
    }

    const data = useMemo(
        () => ingredients, 
        [ingredients]
    )

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
                {/* TODO: Add timeframe picker */}
                {/* <TimeframeDropdown
                    setDateFrom={setDateFrom}
                    setDateTo={setDateTo}
                    defaultDateFrom={defaultDateFrom}
                    defaultDateTo={defaultDateTo}
                    timeframeOptions={timeframeOptions}
                /> */}
                <ColumnSelector
                    columns={columnSelectorOptions}
                    onSelectionChanged={handleSelectionChanged}
                    defaultColumns={defaultColumns}
                    toLabel={columnAccessorToLabel}
                />
            </div>
            {error && <ErrorMessage message={error} errorMessageClass='max-h-32 mt-6 flex flex-col justify-center' />}
            <StockTable selectedColumns={selectedColumns} data={data} />
        </div>
    )
}

export default Stock