import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { Column, useTable } from 'react-table'
import { ScheduleTableRow } from '@interfaces'
import { definitions } from '@types'
import ScheduleTableCell from './ScheduleTableCell'

interface IScheduleTable {
  dateColumns: dayjs.Dayjs[]
  data: ScheduleTableRow[]
  onCellSubmit: (shift: definitions['shifts']) => void
}

const ScheduleTable: React.FC<IScheduleTable> = ({ dateColumns, data, onCellSubmit }: IScheduleTable) => {
    const columns: Column<ScheduleTableRow>[] = useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'employee',
                Cell: ({ value: employee }: { value: definitions['employees'] }) => <b>{employee?.first_name ?? 'Some Employee'}</b>
            },
            ...dateColumns.map((date) => ({
                accessor: date.unix().toString(),
                Header: date.format('dd, MMM D'),
                Cell: (cellState: any) => {
                    const matchingEmployee = cellState.cell.row.cells[0].value
          
                    return <ScheduleTableCell value={cellState.value} onBlur={(cellValue: number) => onCellSubmit({
                        id: 0,
                        employee_id: matchingEmployee.id,
                        duration: cellValue,
                        date: date.toString()
                    })}/>
                }
            })),
            {
                Header: 'Month Total',
                accessor: 'total'
            }
        ],
        [dateColumns, onCellSubmit]
    )

    const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable<ScheduleTableRow>({
        columns,
        data
    })

    return <table {...getTableProps()} className='table-auto'>
        <thead>
            <tr>
                {headers.map((header) => {
                    const { key: headerKey, ...getHeaderProps } = header.getHeaderProps()
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
}

export default ScheduleTable