import { ScheduleTableRow } from '@interfaces'
import { useMounted } from '@lib/hooks'
import { enforceAuthenticated, getMonthDays } from '@lib/utils'
import { useSupabaseDeleteEntity, useSupabaseGetEmployees, useSupabaseGetShifts, useSupabaseUpsertEntity } from '@services/supabase'
import { definitions } from '@types'
import dayjs from 'dayjs'
import { NextPage } from 'next'
import { useCallback, useMemo, useState } from 'react'
import ScheduleTable from '../../components/employees/schedule/ScheduleTable'
import Loader from '../../components/Loader'

export const getServerSideProps = enforceAuthenticated()

const Shifts: NextPage = () => {
    const { mounted } = useMounted()

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

    // TODO: fetch appropriate data based on updated designs (rn it's showing 2 tables)
    const monthDays = getMonthDays(month)
    const firstHalfOfMonth = monthDays.slice(0, 15)
    const secondHalfOfMonth = monthDays.slice(15)
  
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
  
    if (!mounted || employeesLoading) {
        return <Loader />
    }

    return (
        <div className="flex flex-col items-center justify-center py-2">
            {shiftsError && (<div>Error fetching shifts: {shiftsError}</div>)}
            {employeesError && (<div>Error fetching employees: {employeesError}</div>)}
            {upsertShiftError && (<div>Error adding shift: {upsertShiftError}</div>)}
            {deleteShiftError && (<div>Error deleting shift: {deleteShiftError}</div>)}
            <div>
                <div className="flex flex-col flex-wrap items-center justify-around mt-6">
                    {(shiftsLoading || upsertShiftLoading || deleteShiftLoading) && 'Loading...'}

                    <div>
                        <button className='border-2 p-1' onClick={() => setMonth(month.subtract(1, 'month'))}>{'<'}</button>
                        <span className='w-32'>{month.format('MMMM YYYY')}</span>
                        <button className='border-2 p-1' onClick={() => setMonth(month.add(1, 'month'))}>{'>'}</button>
                    </div>

                    <ScheduleTable 
                        dateColumns={firstHalfOfMonth} 
                        data={getTableData(firstHalfOfMonth)} 
                        onCellSubmit={modifyShiftAndReload}
                    />

                    <ScheduleTable 
                        dateColumns={secondHalfOfMonth} 
                        data={getTableData(secondHalfOfMonth)} 
                        onCellSubmit={modifyShiftAndReload}
                    />
                </div>
            </div>
        </div>
    )
}

export default Shifts
