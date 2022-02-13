import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../client'
import { useUser } from '../lib/hooks'
import { useSupabaseAddEntity, useSupabaseDeleteEntity, useSupabaseGetShifts } from '../lib/services/supabase'
import { definitions } from '../types/database'

const Shifts: NextPage = () => {
  useEffect(() => setMounted(true), [])
  const [mounted, setMounted] = useState(false)

  const router = useRouter()
  const user = useUser()
  const { 
      data: shifts, 
      loading: shiftsLoading, 
      error: shiftsError
  } = useSupabaseGetShifts()
  
  const { 
      addEntity: addShift, 
      loading: addShiftLoading, 
      error: addShiftError 
  } = useSupabaseAddEntity('shifts')
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

  const { employee_id, duration, date } = shift

  const handleLogOut = async () => {
      await supabase.auth.signOut()
      router.replace('/')
  }

  async function addShiftAndReload() {
      await addShift(shift)
      router.reload()
  }

  async function deleteShiftAndReload(id: number) {
      await deleteShift(id)
      router.reload()
  }

  if (!mounted) return (<div></div>)

  if (!user || shiftsLoading || addShiftLoading || deleteShiftLoading) {
      return (
          <div id="loader" className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mt-3"></div>
          </div>
      )
  }

  if (shiftsError) {
      return (
          <div>Error while fetching shifts: {shiftsError}</div>
      )
  }

  return (
      <div className="flex flex-col items-center justify-center py-2">
          <div>
              <div>User Email: {user.email}</div>
              <button onClick={handleLogOut}>Log Out</button>

              <div className="flex flex-wrap items-center justify-around mt-6">
                  <div className="p-8 mt-6 border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
                      <div className="w-full max-w-sm">
                          <form className="bg-white rounded px-8 pt-6 pb-8 mb-4">
                              <div className="mb-4">
                                  <label
                                      className="block text-gray-700 text-sm font-bold mb-2"
                                      htmlFor="employee_id"
                                  >
                                      First Name
                                  </label>
                                  <input
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      id="employee_id"
                                      type="number"
                                      value={employee_id?.toString()}
                                      onChange={(e) =>
                                          setShift({ ...shift, employee_id: +e.target.value })
                                      }
                                  />
                              </div>
                              <div className="mb-4">
                                  <label
                                      className="block text-gray-700 text-sm font-bold mb-2"
                                      htmlFor="duration"
                                  >
                                      Last Name
                                  </label>
                                  <input
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      id="duration"
                                      type="number"
                                      value={duration?.toString()}
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
                                      BirthDate
                                  </label>
                                  <input
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      id="date"
                                      type="date"
                                      value={date?.toString()}
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

                  <div className="p-2 mt-6 w-96 rounded-xl focus:text-blue-600">
                      <table className="shadow-lg bg-white">
                          <tbody>
                          <tr>
                              <th className="bg-blue-400 border text-left px-4 py-4">
                                  Employee Id
                              </th>
                              <th className="bg-blue-400 border text-left px-4 py-4">
                                  Duration
                              </th>
                              <th className="bg-blue-400 border text-left px-8 py-4">
                                  Date
                              </th>

                              <th className="bg-blue-400 border text-left px-4 py-4">
                                  Action
                              </th>
                          </tr>
                          {shifts?.map((shift, index) => (
                                  <tr key={shift.id}>
                                      <td className="border px-4 py-4">{index + 1}</td>
                                      <td className="border px-4 py-4">{shift.employee_id}</td>
                                      <td className="border px-8 py-4">{shift.duration}</td>
                                      <td className="border px-8 py-4">{shift.date}</td>
                                      <td className="border px-8 py-4">
                                          {' '}
                                          <button
                                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                              type="button"
                                              onClick={() => deleteShiftAndReload(shift.id)}
                                          >
                                              Delete
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default Shifts
