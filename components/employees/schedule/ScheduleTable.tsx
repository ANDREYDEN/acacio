import React, { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { Column } from 'react-table'
import dayjs from 'dayjs'
import { Table,NumberInputCell } from '@components'
import { ScheduleTableRow, ShiftDto } from '@interfaces'

interface IScheduleTable {
  dateColumns: dayjs.Dayjs[]
  data: ScheduleTableRow[]
}

const ScheduleTable: React.FC<IScheduleTable> = ({ dateColumns, data }: IScheduleTable) => {
    const { t } = useTranslation('schedule')

    const columns: Column<ScheduleTableRow>[] = useMemo(
        () => [
            {
                Header: <h1>{t('table.name').toString()}</h1>,
                accessor: 'employeeName',
                Cell: ({ value: employeeName }: { value: string }) => <b>{employeeName}</b>
            },
            {
                Header: <h1 className='mx-1'>{t('table.total').toString()}</h1>,
                accessor: 'total',
                Cell: ({ value: total }: {value: number}) => <p className='text-center'>{total}</p>
            },
            ...dateColumns.map((date) => ({
                Header: <div className='flex flex-col items-center'>
                    <p className='font-light'>
                        {date.format('dd')[0]?.toUpperCase()}{date.format('dd').slice(1)}
                    </p>
                    <h1>{date.format('DD')}</h1>
                </div>,
                accessor: date.unix().toString(),
                Cell: ({ value } : { value: ShiftDto }) => {
                    return <NumberInputCell value={value.duration} onBlur={value.onChange}/>
                }
            }))
        ],
        [dateColumns, t]
    )

    return <Table columns={columns} data={data} tableSpacing='px-1' />
}

export default ScheduleTable