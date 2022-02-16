import dayjs from 'dayjs'
import { NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react'
import ScheduleTable from '../../components/employees/schedule/ScheduleTable'
import { ScheduleTableRow } from '../../interfaces'
import { useUser } from '../../lib/hooks'
import { useSupabaseUpsertEntity, useSupabaseDeleteEntity, useSupabaseGetEmployees, useSupabaseGetShifts } from '../../lib/services/supabase'
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

  const emptyShift: definitions['shifts'] = {
      id: 0,
      employee_id: 0,
      duration: 0,
      date: new Date().toDateString()
  }
  const [shift, setShift] = useState<Partial<definitions['shifts']>>(emptyShift)

  const employeeName = useCallback(
    (employeeId: number | undefined) => {
      if (!employeeId) return 'Employee not found'
      return employees.find((e) => e.id === employeeId)?.first_name
    },
    [employees]
  )

  async function addShiftAndReload() {
    const { id, ...shiftProperties } = shift
    revalidateShifts([...shifts, shift])
    await addShift(shiftProperties)
    revalidateShifts()
  }

  async function deleteShiftAndReload(id: number) {
    revalidateShifts(shifts.filter(shift => shift.id !== id))
    await deleteShift(id)
    revalidateShifts()
  }

  const dateRange = nextTwoWeeks()
  
  const tableData: ScheduleTableRow[] = employees.map((employee) => ({
      name: employee.first_name ?? 'Some employee',
      total: 0,
      ...dateRange.reduce((acc, date) => {
        const shift = shifts.find((shift) => shift.employee_id === employee.id && dayjs(shift.date).diff(date, 'day') === 0)
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
                <div className="p-8 mt-6 border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
                    <div className="w-full max-w-sm">
                        <form className="bg-white rounded px-8 pt-6 pb-8 mb-4">
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="employee_id"
                                >
                                    Employee
                                </label>
                                <select onChange={(e) => setShift({ ...shift, employee_id: +e.target.value })} value={shift.employee_id}>
                                <option value="0">Select Employee</option>
                                {employees.map((employee) => (
                                    <option key={employee.id} value={employee.id}>{employee.first_name} {employee.last_name}</option>
                                ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="duration"
                                >
                                    Shift Duration
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="duration"
                                    type="number"
                                    value={shift.duration?.toString()}
                                    onChange={(e) =>
                                        setShift({ ...shift, duration: +e.target.value })
                                    }
                                />
                            </div>

                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="date"
                                >
                                    Shift Date
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="date"
                                    type="date"
                                    value={shift.date?.toString()}
                                    onChange={(e) =>
                                        setShift({ ...shift, date: e.target.value })
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={addShiftAndReload}
                                >
                                    Add Shift
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                {(addShiftLoading || deleteShiftLoading) && 'Loading...'}

                <ScheduleTable dateColumns={dateRange} data={tableData} />
            </div>
        </div>
    </div>
  )
}

export default Shifts
