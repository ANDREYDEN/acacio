import React, { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { Column } from 'react-table'
import { Table } from '@components'
import { Ingredient } from '@lib/posterTypes'
import { snakeCaseToPascalCase } from '@lib/utils'

interface IStockTable {
    data: Ingredient[]
    selectedColumns: string[]
}

const StockTable: React.FC<IStockTable> = ({ data, selectedColumns }: IStockTable) => {
    // TODO: implement translation
    const { t } = useTranslation('stock')

    const columns: Column<Ingredient>[] = useMemo<Column<Ingredient>[]>(
        () => {
            const columnAccessors: (keyof Ingredient)[] = ['ingredient_id', 'ingredient_name', 'start', 'end']
            return columnAccessors.map((accessor) => ({
                Header: <h1>{snakeCaseToPascalCase(accessor)}</h1>,
                accessor: accessor
            }))
        },
        []
    )

    const filteredColumns = useMemo(() => {
        return columns.filter(c => c.accessor && selectedColumns.includes(c.accessor as string))
    }, [columns, selectedColumns])

    return <Table columns={filteredColumns} data={data} tableSpacing='px-2' />
}

export default StockTable