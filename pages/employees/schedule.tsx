import React, { useCallback, useMemo, useState } from 'react'
import { NextPage } from 'next'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { useTranslation } from 'next-i18next'
import { Column } from 'exceljs'
import { ChevronLeft, ChevronRight } from 'react-iconly'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { ScheduleTableRow } from '@interfaces'
import { fullName, getMonthDays, modifyEntityAndReload } from '@lib/utils'
import { definitions } from '@types'
import exportToXLSX from '@services/exportService'
import { ScheduleTable, Loader, ErrorMessage, Button } from '@components'
import { enforceAuthenticated } from '@lib/utils'
import {
    useSupabaseDeleteEntity,
    useSupabaseGetEntity,
    useSupabaseGetShifts,
    useSupabaseUpsertEntity
} from '@services/supabase'

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['schedule', 'common']),
    },
}))

const Shifts: NextPage = () => {
    const { t } = useTranslation('schedule')
    const router = useRouter()

    // a dayjs object that represents the current month and year
    const [month, setMonth] = useState(dayjs().locale(router.locale?.split('-')[0] ?? 'en'))

    const { 
        data: shifts, 
        loading: shiftsLoading, 
        error: shiftsError,
        mutate: revalidateShifts
    } = useSupabaseGetShifts(month)    
    const { 
        data: employees, 
        loading: employeesLoading, 
        error: employeesError
    } = useSupabaseGetEntity<definitions['employees']>('employees')
    const { 
        upsertEntity: upsertShift, 
        error: upsertShiftError 
    } = useSupabaseUpsertEntity('shifts')
    const { 
        deleteEntity: deleteShift, 
        error: deleteShiftError 
    } = useSupabaseDeleteEntity('shifts')

    // a map of employee_id => total work hours for this month
    const monthTotalByEmployee: Record<string, number> = useMemo(() => {
        return employees.reduce((res, employee) => ({
            ...res,
            [employee.id]: shifts
                .filter((shift) => shift.employee_id === employee.id)
                .reduce((acc, shift) => acc + (shift.duration ?? 0), 0)
        }), {})
    }, [employees, shifts])

    const matchingShift = useCallback((date?: string | dayjs.Dayjs, employee_id?: number) => {
        return shifts.find((otherShift) => employee_id === otherShift.employee_id && dayjs(date).isSame(dayjs(otherShift.date), 'date'))
    }, [shifts])

    const modifyShiftAndReload = useCallback((shift: Partial<definitions['shifts']>) =>
        modifyEntityAndReload(shift, shifts, revalidateShifts, upsertShift, deleteShift, shift.duration === 0),
    [deleteShift, revalidateShifts, shifts, upsertShift]
    )

    const monthDays = getMonthDays(month)
  
    const tableData: ScheduleTableRow[] = useMemo(() => 
        employees.map((employee) => {
            const shiftsDurationForEmployeeByDate = monthDays.reduce((acc, date) => {
                const shift = matchingShift(date, employee.id)
                return {
                    ...acc,
                    [date.unix().toString()]: {
                        duration: shift?.duration ?? 0,
                        onChange: (cellValue: number) => modifyShiftAndReload({
                            id: shift?.id ?? undefined,
                            employee_id: employee.id,
                            duration: cellValue,
                            date: date.startOf('date').toString()
                        })
                    }
                }
            }, {})
            const row = {
                employeeName: fullName(employee),
                total: monthTotalByEmployee[employee.id.toString()],
                ...shiftsDurationForEmployeeByDate
            }
            return row
        }), 
    [employees, matchingShift, modifyShiftAndReload, monthDays, monthTotalByEmployee])

    const handleExport = async () => {
        const exportData = tableData.map(row => Object.entries(row).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: typeof value === 'object' ? value.duration : value
        }), []))
        const datesHeaders: Partial<Column>[] = monthDays.map(date => ({
            key: date.unix().toString(),
            header: date.format('dd DD'),
            width: 7
        }))
        const columns: Partial<Column>[] = [
            { key: 'employeeName', header: t('table.name').toString(), width: 20 },
            { key: 'total', header: t('table.total').toString(), width: 15 },
            ...datesHeaders
        ]
        await exportToXLSX(exportData, columns, `Schedule ${month.format('MMM YYYY')}`)
    }

    const loading = employeesLoading || shiftsLoading

    const loadingError = shiftsError || employeesError
    const updatingError = upsertShiftError || deleteShiftError
    if (loadingError) return <ErrorMessage message={loadingError} />

    return (
        <div className='flex flex-col'>
            <div className='w-full flex justify-between items-center mb-6'>
                <div>
                    <h3>{t('header')}</h3>
                    <span className='font-bold'>
                        {month.format('MMMM')[0]?.toUpperCase()}
                        {month.format('MMMM').slice(1)}, {month.format('YYYY')}
                    </span>
                </div>

                <div className='flex items-center'>
                    <button
                        className='w-14 h-11 border border-r-0 border-grey rounded-bl-md rounded-tl-md'
                        onClick={() => setMonth(month.subtract(1, 'month'))}
                    >
                        {<ChevronLeft style={{ marginLeft: 15 }} />}
                    </button>
                    <button
                        className='w-14 h-11 border border-grey rounded-br-md rounded-tr-md'
                        onClick={() => setMonth(month.add(1, 'month'))}
                    >
                        {<ChevronRight style={{ marginLeft: 15 }} />}
                    </button>
                    <Button
                        label={t('export', { ns: 'common' })}
                        variant='secondary'
                        buttonClass='w-52 ml-8'
                        onClick={handleExport}
                    />
                </div>
            </div>

            {updatingError && <ErrorMessage message={`Error updating shifts: ${updatingError}`} errorMessageClass='mb-8' />}

            {loading 
                ? <Loader />
                : <ScheduleTable dateColumns={monthDays} data={tableData} />
            }
        </div>
    )
}

export default Shifts
