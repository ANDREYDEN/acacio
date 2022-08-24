import { CurrencyCell, NumberCell, NumberInputCell, Table } from '@components'
import { IRowInput, StockTableRow } from '@interfaces'
import { roundValue } from '@lib/utils'
import { useTranslation } from 'next-i18next'
import React, { useMemo } from 'react'
import { Column } from 'react-table'

interface IStockTable {
    data: StockTableRow[]
    selectedColumns: string[]
}

const StockTable: React.FC<IStockTable> = ({ data, selectedColumns }: IStockTable) => {
    const { t } = useTranslation('stock')

    const columns: Column<StockTableRow>[] = useMemo<Column<StockTableRow>[]>(
        () => [
            {
                Header: <h1>{t('table_headers.ingredientName').toString()}</h1>,
                accessor: 'ingredientName',
            },
            {
                Header: <h1>{t('table_headers.category').toString()}</h1>,
                accessor: 'category',
            },
            {
                Header: <h1>{t('table_headers.supplier').toString()}</h1>,
                accessor: 'supplier',
            },
            {
                Header: <h1>{t('table_headers.initialBalance').toString()}</h1>,
                accessor: 'initialBalance',
                Cell: NumberCell
            },
            {
                Header: <h1>{t('table_headers.initialAvgCost').toString()}</h1>,
                accessor: 'initialAvgCost',
                Cell: CurrencyCell
            },
            {
                Header: <h1>{t('table_headers.sold').toString()}</h1>,
                accessor: 'sold',
                Cell: NumberCell
            },
            {
                Header: <h1>{t('table_headers.soldCost').toString()}</h1>,
                accessor: 'soldCost',
                Cell: CurrencyCell
            },
            {
                Header: <h1>{t('table_headers.writeOff').toString()}</h1>,
                accessor: 'writeOff',
                Cell: NumberCell
            },
            {
                Header: <h1>{t('table_headers.writeOffCost').toString()}</h1>,
                accessor: 'writeOffCost',
                Cell: CurrencyCell
            },
            {
                Header: <h1>{t('table_headers.lastSupply').toString()}</h1>,
                accessor: 'lastSupply',
                Cell: NumberCell
            },
            {
                Header: <h1>{t('table_headers.finalBalance').toString()}</h1>,
                accessor: 'finalBalance',
                Cell: NumberCell
            },
            {
                Header: <h1>{t('table_headers.finalBalanceCost').toString()}</h1>,
                accessor: 'finalBalanceCost',
                Cell: CurrencyCell
            },
            {
                Header: <h1>{t('table_headers.finalAverageCost').toString()}</h1>,
                accessor: 'finalAverageCost',
                Cell: CurrencyCell
            },
            {
                Header: <h1>{t('table_headers.reorder').toString()}</h1>,
                accessor: 'reorder',
                Cell: NumberCell
            },
            {
                Header: <h1>{t('table_headers.toOrder').toString()}</h1>,
                accessor: 'toOrder',
                Cell: ({ value }: { value: IRowInput }) =>
                    <NumberInputCell key={value.id} value={roundValue(value.initialValue)} onBlur={value.onChange} additionalStyle='w-16'/>
            },
            {
                Header: <h1>{t('table_headers.totalCost').toString()}</h1>,
                accessor: 'totalCost',
                Cell: CurrencyCell
            },
        ],
        [t]
    )

    const filteredColumns = useMemo(() => {
        return columns.filter(c => c.accessor && selectedColumns.includes(c.accessor as string))
    }, [columns, selectedColumns])

    return <Table columns={filteredColumns} data={data} tableSpacing='px-2' />
}

export default StockTable
