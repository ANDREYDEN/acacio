import dayjs from 'dayjs'
import { NextPage } from 'next'
import React, { useCallback, useMemo, useState } from 'react'
import ScheduleTable from '@components/employees/schedule/ScheduleTable'
import Loader from '@components/Loader'
import { ScheduleTableRow } from '@interfaces'
import { useMounted, useUser } from '@lib/hooks'
import {
    useSupabaseDeleteEntity,
    useSupabaseGetEmployees,
    useSupabaseGetShifts,
    useSupabaseUpsertEntity
} from '@services/supabase'
import { getMonthDays } from '@lib/utils'
import { definitions } from '@types'
import ErrorMessage from '@components/ErrorMessage'
import { useTranslation } from 'next-i18next'
import Button from '@components/Button'
import { Column } from 'exceljs'
import exportToXLSX from '@services/exportService'
import { ChevronLeft, ChevronRight } from 'react-iconly'

const Shifts: NextPage = () => {
    const { mounted } = useMounted()
    const user = useUser()
    const { t } = useTranslation('schedule')

    // a dayjs object that represents the current month and year
    const [month, setMonth] = useState(dayjs())

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
    async function modifyShiftAndReload(shift: Partial<definitions['shifts']>) {
        const existingShift = matchingShift(shift.date, shift.employee_id)
    
        if (existingShift) {
            if (existingShift.duration === shift.duration) return

            shift.id = existingShift.id
            if (shift.duration === 0) {
                revalidateShifts(shifts.filter((s) => s.id !== shift.id))
                await deleteShift(shift.id)
            } else {
                revalidateShifts([...shifts, shift])
                await upsertShift(shift)    
            }
        } else {
            delete shift['id']
            revalidateShifts([...shifts, shift])
            await upsertShift(shift)
        }
        revalidateShifts()
    }

    const monthDays = getMonthDays(month)
  
    const getTableData = useCallback((dateRange: dayjs.Dayjs[]): ScheduleTableRow[] => 
        employees.map((employee) => {
            const shiftsDurationForEmployeeByDate = dateRange.reduce((acc, date) => {
                const shift = matchingShift(date, employee.id)
                return {
                    ...acc,
                    [date.unix().toString()]: shift ? (shift.duration ?? 0) : 0
                }
            }, {})
            const row = {
                employee,
                total: monthTotalByEmployee[employee.id.toString()],
                ...shiftsDurationForEmployeeByDate
            }
            return row
        }), 
    [employees, matchingShift, monthTotalByEmployee])

    const handleExport = async () => {
        const columns: Partial<Column>[] = [
            // TODO: define columns
        ]
        await exportToXLSX(shifts, columns, 'Shifts')
    }
    
    if (!mounted || !user || employeesLoading) {
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
                    <span className='font-bold'>{month.format('MMMM, YYYY')}</span>
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
                data={getTableData(monthDays)}
                onCellSubmit={modifyShiftAndReload}
            />
        </div>
    )
}

export default Shifts
