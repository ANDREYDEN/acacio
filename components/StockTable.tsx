import React, { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { Column } from 'react-table'
import { Table } from '@components'
import { snakeCaseToPascalCase } from '@lib/utils'
import { StockTableRow } from '@interfaces'
import NumberInputCell from './NumberInputCell'

interface IStockTable {
    data: StockTableRow[]
    selectedColumns: string[]
}

const StockTable: React.FC<IStockTable> = ({ data, selectedColumns }: IStockTable) => {
    // TODO: implement translation
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
            Header: <h1>{snakeCaseToPascalCase(accessor)}</h1>,
            accessor: accessor,
            Cell: accessor === 'toOrder' 
                ? ({ value }: { value: number}) => <NumberInputCell value={value} onBlur={() => {}} /> 
                : ({ value }: { value: any}) => value,
        })),
        [readonlyAccessors]
    )

    const filteredColumns = useMemo(() => {
        return columns.filter(c => c.accessor && selectedColumns.includes(c.accessor as string))
    }, [columns, selectedColumns])

    return <Table columns={filteredColumns} data={data} tableSpacing='px-2' />
}

export default StockTable