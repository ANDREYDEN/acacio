import dayjs from 'dayjs'
import { NextPage } from 'next'
import React, { useCallback, useMemo, useState } from 'react'
import ScheduleTable from '@components/employees/schedule/ScheduleTable'
import Loader from '@components/Loader'
import { ScheduleTableRow } from '@interfaces'
import { useMounted } from '@lib/hooks'
import {
    useSupabaseDeleteEntity,
    useSupabaseGetEmployees,
    useSupabaseGetShifts,
    useSupabaseUpsertEntity
} from '@services/supabase'
import { fullName, getMonthDays } from '@lib/utils'
import { definitions } from '@types'
import ErrorMessage from '@components/ErrorMessage'
import { useTranslation } from 'next-i18next'
import Button from '@components/Button'
import { Column } from 'exceljs'
import exportToXLSX from '@services/exportService'
import { ChevronLeft, ChevronRight } from 'react-iconly'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import 'dayjs/locale/ru'
import { enforceAuthenticated } from '@lib/utils'

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['schedule', 'common']),
    },
}))

const Shifts: NextPage = () => {
    const { mounted } = useMounted()
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
    } = useSupabaseGetEmployees()
    const { 
        upsertEntity: upsertShift, 
        loading: upsertShiftLoading, 
        error: upsertShiftError 
    } = useSupabaseUpsertEntity('shifts')
    const { 
        deleteEntity: deleteShift, 
        loading: deleteShiftLoading, 
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

    /**
   * Inserts/Updates/Deletes the provided shift
   * - if a `shift` already exists
   *   - if the `duration` is 0 - DELETE
   *   - otherwise - UPDATE
   * - otherwise INSERT
   * @param shift the shift to manipualte
   */
    const modifyShiftAndReload = useCallback(async (shift: Partial<definitions['shifts']>) => {
        const existingShift = matchingShift(shift.date, shift.employee_id)
    
        if (existingShift) {
            if (existingShift.duration === shift.duration) return

            shift.id = existingShift.id
            if (shift.duration === 0) {
                await revalidateShifts(shifts.filter((s) => s.id !== shift.id))
                await deleteShift(shift.id)
            } else {
                await revalidateShifts(shifts.map((s) => s.id === shift.id ? shift : s))
                await upsertShift(shift)    
            }
        } else {
            delete shift['id']
            await revalidateShifts([...shifts, shift])
            await upsertShift(shift)
        }
        await revalidateShifts()
    }, [deleteShift, matchingShift, revalidateShifts, shifts, upsertShift])

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
                            id: 0,
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

    if (!mounted || employeesLoading) {
        return <Loader />
    }

    return (
        <div className='flex flex-col items-center py-2 lg:mr-20 mr-10 mb-8'>
            {shiftsError && (<ErrorMessage message={`Error fetching shifts: ${shiftsError}`} />)}
            {employeesError && (<ErrorMessage message={`Error fetching employees: ${employeesError}`} />)}
            {upsertShiftError && (<ErrorMessage message={`Error adding shift: ${upsertShiftError}`} />)}
            {deleteShiftError && (<ErrorMessage message={`Error deleting shift: ${deleteShiftError}`} />)}
            {(shiftsLoading || upsertShiftLoading || deleteShiftLoading) && 'Loading...'}

            <div className='w-full flex justify-between mb-8'>
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
                    >{<ChevronLeft style={{ marginLeft: 15 }} />}</button>
                    <button
                        className='w-14 h-11 border border-grey rounded-br-md rounded-tr-md'
                        onClick={() => setMonth(month.add(1, 'month'))}
                    >{<ChevronRight style={{ marginLeft: 15 }} />}</button>
                    <Button
                        label={t('export', { ns: 'common' })}
                        variant='secondary'
                        buttonClass='w-52 ml-8'
                        onClick={handleExport}
                    />
                </div>
            </div>

            <ScheduleTable
                dateColumns={monthDays}
                data={tableData}
            />
        </div>
    )
}

export default Shifts
