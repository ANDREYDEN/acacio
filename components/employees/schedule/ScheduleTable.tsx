import Table from '@components/Table'
import { ScheduleTableRow, ShiftDto } from '@interfaces'
import dayjs from 'dayjs'
import { useTranslation } from 'next-i18next'
import React, { useMemo } from 'react'
import { Column } from 'react-table'
import NumberInputCell from '../../NumberInputCell'

interface IScheduleTable {
  dateColumns: dayjs.Dayjs[]
  data: ScheduleTableRow[]
}

const ScheduleTable: React.FC<IScheduleTable> = ({ dateColumns, data }: IScheduleTable) => {
    const { t } = useTranslation('schedule')

    const columns: Column<ScheduleTableRow>[] = useMemo(
        () => [
            {
                Header: <h6>{t('table.name').toString()}</h6>,
                accessor: 'employeeName',
                Cell: ({ value: employeeName }: { value: string }) => <b>{employeeName}</b>
            },
            {
                Header: <h6 className='mx-1'>{t('table.total').toString()}</h6>,
                accessor: 'total',
                Cell: ({ value: total }: {value: number}) => <p className='text-center'>{total}</p>
            },
            ...dateColumns.map((date) => ({
                Header: <div className='flex flex-col items-center'>
                    <p className='font-light'>
                        {date.format('dd')[0]?.toUpperCase()}{date.format('dd').slice(1)}
                    </p>
                    <h6>{date.format('DD')}</h6>
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