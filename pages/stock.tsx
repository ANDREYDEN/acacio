import { NextPage } from 'next'
import React, { useMemo } from 'react'
import { posterInstance } from '@services/poster'
import { Column, useSortBy, useTable } from 'react-table'
import { enforceAuthenticated, snakeCaseToPascalCase } from '@lib/utils'
import { Ingredient } from '@lib/posterTypes'
import ErrorMessage from '@components/ErrorMessage'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

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

    const columns: Column<Ingredient>[] = useMemo<Column<Ingredient>[]>(
        () => {
            const columnAccessors: (keyof Ingredient)[] = ['ingredient_id', 'ingredient_name', 'start', 'end']
            return columnAccessors.map((accessor) => ({
                Header: snakeCaseToPascalCase(accessor),
                accessor: accessor
            }))
        },
        []
    )

    const data = useMemo(
        () => ingredients, 
        [ingredients]
    )

    const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable<Ingredient>(
        {
            columns,
            data
        },
        useSortBy
    )

    if (error) {
        return <ErrorMessage message={error} errorMessageClass='max-h-32 mt-6 flex flex-col justify-center' />
    }

    return (
        <div className='flex flex-col'>
            <h3 className='mb-8'>{t('header').toString()}</h3>
            <table {...getTableProps()} className='table-auto'>
                <thead>
                    <tr>
                        {headers.map((header) => {
                            const {
                                key: headerKey,
                                ...getHeaderProps
                            } = header.getHeaderProps((header as any).getSortByToggleProps())
                            return <th key={headerKey} {...getHeaderProps}>
                                {header.render('Header')}
                            </th>
                        })}
                    </tr>
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row)
                        const { key: rowKey, ...getRowProps } = row.getRowProps()
                        return (
                            <tr key={rowKey} {...getRowProps}>
                                {row.cells.map((cell) => {
                                    const { key: cellKey, ...getCellProps } = cell.getCellProps()
                                    return (
                                        <td key={cellKey} {...getCellProps}>
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Stock