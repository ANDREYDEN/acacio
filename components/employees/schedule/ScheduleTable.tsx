import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { Column } from 'react-table'
import { ScheduleTableRow } from '@interfaces'
import { definitions } from '@types'
import ScheduleTableCell from './ScheduleTableCell'
import Table from '@components/Table'

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
            {
                Header: 'Month Total',
                accessor: 'total'
            },
            ...dateColumns.map((date) => ({
                accessor: date.unix().toString(),
                Header: date.format('dd, D'),
                Cell: (cellState: any) => {
                    const matchingEmployee = cellState.cell.row.cells[0].value
          
                    return <ScheduleTableCell value={cellState.value} onBlur={(cellValue: number) => onCellSubmit({
                        id: 0,
                        employee_id: matchingEmployee.id,
                        duration: cellValue,
                        date: date.toString()
                    })}/>
                }
            }))
        ],
        [dateColumns, onCellSubmit]
    )

    return (
        <Table columns={columns} data={data} tableSpacing='px-1' />
    )
}

export default ScheduleTable