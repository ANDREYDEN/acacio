import { Table } from '@components'
import { StockTableRow } from '@interfaces'
import { useTranslation } from 'next-i18next'
import React, { useMemo } from 'react'
import { Column } from 'react-table'
import NumberInputCell from './NumberInputCell'

interface IStockTable {
    data: StockTableRow[]
    selectedColumns: string[]
}

const StockTable: React.FC<IStockTable> = ({ data, selectedColumns }: IStockTable) => {
    const { t } = useTranslation('stock')

    const readonlyAccessors: (keyof StockTableRow)[] = useMemo(() => [
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

    const columns: Column<StockTableRow>[] = useMemo<Column<StockTableRow>[]>(
        () => readonlyAccessors.map((accessor) => ({
            Header: <h1>{t(`table_headers.${accessor}`).toString()}</h1>,
            accessor: accessor,
            Cell: accessor === 'toOrder' 
                ? ({ value }: { value: number}) => <NumberInputCell value={value} onBlur={() => {}} /> 
                : ({ value }: { value: any}) => value,
        })),
        [readonlyAccessors, t]
    )

    const filteredColumns = useMemo(() => {
        return columns.filter(c => c.accessor && selectedColumns.includes(c.accessor as string))
    }, [columns, selectedColumns])

    return <Table columns={filteredColumns} data={data} tableSpacing='px-2' />
}

export default StockTable