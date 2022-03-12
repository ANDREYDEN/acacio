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
                Header: <h6>Name</h6>,
                accessor: 'employee',
                Cell: ({ value: employee }: { value: definitions['employees'] }) => <b>{employee?.first_name ?? 'Some Employee'}</b>
            },
            {
                Header: <h6>Month Total</h6>,
                accessor: 'total'
            },
            ...dateColumns.map((date) => ({
                Header: <div className='flex flex-col items-center'>
                    <p className='font-light'>{date.format('dd')}</p>
                    <h6>{date.format('DD')}</h6>
                </div>,
                accessor: date.unix().toString(),
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

    return <Table columns={columns} data={data} tableSpacing='px-1' />
}

export default ScheduleTable