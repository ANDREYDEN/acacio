import dayjs from 'dayjs'
import { NextPage } from 'next'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ScheduleTable from '../../components/employees/schedule/ScheduleTable'
import { ScheduleTableRow } from '../../interfaces'
import { useUser } from '../../lib/hooks'
import { useSupabaseDeleteEntity, useSupabaseGetEmployees, useSupabaseGetShifts, useSupabaseUpsertEntity } from '../../lib/services/supabase'
import { getMonthDays } from '../../lib/utils'
import { definitions } from '../../types/database'

const Shifts: NextPage = () => {
  useEffect(() => setMounted(true), [])
  const [mounted, setMounted] = useState(false)
  const user = useUser()

  const [month, setMonth] = useState(dayjs().month())

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
      upsertEntity: addShift, 
      loading: addShiftLoading, 
      error: addShiftError 
  } = useSupabaseUpsertEntity('shifts')
  const { 
    deleteEntity: deleteShift, 
    loading: deleteShiftLoading, 
    error: deleteShiftError 
  } = useSupabaseDeleteEntity('shifts')

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

  async function modifyShiftAndReload(shift: Partial<definitions['shifts']>) {
    // if we already have a shift for the same employee on the same date - update that
    // otherwise - insert (without an id)
    const existingShift = matchingShift(shift.date, shift.employee_id)
    
    if (existingShift) {
        if (existingShift.duration === shift.duration) return

        shift.id = existingShift.id
        if (shift.duration === 0) {
            revalidateShifts(shifts.filter((s) => s.id !== shift.id))
            await deleteShift(shift.id)
        } else {
            revalidateShifts([...shifts, shift])
            await addShift(shift)    
        }
    } else {
        delete shift['id']
        revalidateShifts([...shifts, shift])
        await addShift(shift)
    }
    revalidateShifts()
  }

  const monthDays = getMonthDays(month)
  const firstHalfOfMonth = monthDays.slice(0, 15)
  const secondHalfOfMonth = monthDays.slice(15)
  
  const getTableData = useCallback(
    (dateRange: dayjs.Dayjs[]): ScheduleTableRow[] => 
      employees.map((employee) => ({
        employee,
        total: monthTotalByEmployee[employee.id.toString()],
        ...dateRange.reduce((acc, date) => {
          const shift = matchingShift(date, employee.id)
          return {
            ...acc,
            [date.unix().toString()]: shift ? (shift.duration ?? 0) : 0
          }
        }, {})
      })), 
    [employees, matchingShift, monthTotalByEmployee]
  )
  

  if (!mounted) return (<div></div>)

  if (!user || employeesLoading) {
      return (
          <div id="loader" className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mt-3"></div>
          </div>
      )
  }

  return (
      <div className="flex flex-col items-center justify-center py-2">
        {shiftsError && (<div>Error fetching shifts: {shiftsError}</div>)}
        {employeesError && (<div>Error fetching employees: {employeesError}</div>)}
        {addShiftError && (<div>Error adding shift: {addShiftError}</div>)}
        {deleteShiftError && (<div>Error deleting shift: {deleteShiftError}</div>)}
        <div>
            <div className="flex flex-col flex-wrap items-center justify-around mt-6">
                {(shiftsLoading || addShiftLoading || deleteShiftLoading) && 'Loading...'}

                <div>
                    <button className='border-2 p-1' onClick={() => setMonth((month - 1) % 12)}>{'<'}</button>
                    <span className='w-32'>{dayjs().month(month).format('MMMM')}</span>
                    <button className='border-2 p-1' onClick={() => setMonth((month + 1) % 12)}>{'>'}</button>
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
