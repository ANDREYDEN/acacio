import dayjs from 'dayjs'
import { NextPage } from 'next'
import { useEffect, useMemo, useState } from 'react'
import ScheduleTable from '../../components/employees/schedule/ScheduleTable'
import { ScheduleTableRow } from '../../interfaces'
import { useUser } from '../../lib/hooks'
import { useSupabaseDeleteEntity, useSupabaseGetEmployees, useSupabaseGetShifts, useSupabaseUpsertEntity } from '../../lib/services/supabase'
import { nextTwoWeeks } from '../../lib/utils'
import { definitions } from '../../types/database'

const Shifts: NextPage = () => {
  useEffect(() => setMounted(true), [])
  const [mounted, setMounted] = useState(false)

  const user = useUser()
  const { 
      data: shifts, 
      loading: shiftsLoading, 
      error: shiftsError,
      mutate: revalidateShifts
  } = useSupabaseGetShifts()
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

  function matchingShift(date?: string | dayjs.Dayjs, employee_id?: number) {
      return shifts.find((otherShift) => employee_id === otherShift.employee_id && dayjs(date).isSame(dayjs(otherShift.date), 'date'))
  }

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

  const dateRange = nextTwoWeeks()
  
  const tableData: ScheduleTableRow[] = employees.map((employee) => ({
      employee,
      total: monthTotalByEmployee[employee.id.toString()],
      ...dateRange.reduce((acc, date) => {
        const shift = matchingShift(date, employee.id)
        return {
            ...acc,
            [date.unix().toString()]: shift ? (shift.duration ?? 0) : 0
        }
    }, {})
  }))
  

  if (!mounted) return (<div></div>)

  if (!user || shiftsLoading || employeesLoading) {
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
                {(addShiftLoading || deleteShiftLoading) && 'Loading...'}

                <ScheduleTable 
                    dateColumns={dateRange} 
                    data={tableData} 
                    onCellSubmit={modifyShiftAndReload}
                />
            </div>
        </div>
    </div>
  )
}

export default Shifts
