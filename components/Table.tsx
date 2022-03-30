import React from 'react'
import { Column, useTable } from 'react-table'

interface ITable<T extends Object> {
    columns: Column<T>[]
    data: T[]
    tableSpacing: string
}

const Table = <T extends Object>({ columns, data, tableSpacing }: ITable<T>) => {
    const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable<T>({
        columns,
        data
    })

    return (
        <div className='border border-table-grey rounded-lg w-full overflow-scroll max-h-[calc(100vh-225px)]'>
            <table {...getTableProps()} className='w-full'>
                <thead>
                    <tr>
                        {headers.map((header, index) => {
                            const { key: headerKey, ...getHeaderProps } = header.getHeaderProps()

                            return (
                                <th
                                    key={headerKey}
                                    {...getHeaderProps}
                                    className={`py-6 text-left border-b border-table-grey ${tableSpacing}
                                        ${index === 0 ? 'pl-6' : ''}
                                        ${index === headers.length - 1 ? 'pr-6' : ''}`}
                                >
                                    {header.render('Header')}
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, index) => {
                        prepareRow(row)
                        const { key: rowKey, ...getRowProps } = row.getRowProps()

                        return (
                            <tr
                                key={rowKey}
                                {...getRowProps}
                                className={index === data.length - 1 ? '' : 'border-b border-table-grey'}
                            >
                                {row.cells.map((cell, index) => {
                                    const { key: cellKey, ...getCellProps } = cell.getCellProps()
                                    return (
                                        <td
                                            key={cellKey}
                                            {...getCellProps}
                                            className={`py-5 ${tableSpacing}
                                                ${index === 0 ? 'pl-6' : ''}
                                                ${index === headers.length - 1 ? 'pr-6' : ''}`}
                                        >
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

export default Table