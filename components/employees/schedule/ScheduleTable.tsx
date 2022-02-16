import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Column, useTable } from 'react-table'
import { ScheduleTableRow } from '../../../interfaces'


interface IScheduleTable {
  dateColumns: dayjs.Dayjs[]
  data: ScheduleTableRow[]
}

const ScheduleTable: React.FC<IScheduleTable> = ({ dateColumns, data }: IScheduleTable) => {
  const columns: Column<ScheduleTableRow>[] = useMemo<Column<ScheduleTableRow>[]>(
    () => [
      {
        Header: 'Name',
        accessor: 'name'
      },
        ...dateColumns.map((date) => ({
        Header: date.format('dd, MMM D'),
        accessor: date.unix().toString()
      })),
      {
        Header: 'Month Total',
        accessor: 'total'
      }
    ],
    [dateColumns]
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
      const { key: rowKey, role: rowRole, ...getRowProps } = row.getRowProps()
      return (
        <tr key={rowKey} {...getRowProps}>
          {row.cells.map((cell) => {
            const { key: cellKey, role: cellRole, ...getCellProps } = cell.getCellProps()
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