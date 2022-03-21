import Table from '@components/Table'
import { useTranslation } from 'next-i18next'
import React, { useMemo } from 'react'
import { Column } from 'react-table'
import { Ingredient } from '@lib/posterTypes'
import { snakeCaseToPascalCase } from '@lib/utils'

interface IStockTable {
    data: Ingredient[]
}

const StockTable: React.FC<IStockTable> = ({ data }: IStockTable) => {
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

    return <Table columns={columns} data={data} tableSpacing='px-2' />
}

export default StockTable