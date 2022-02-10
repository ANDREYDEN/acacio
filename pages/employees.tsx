import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../client'
import { useUser } from '../lib/hooks'
import { useSupabaseGetEmployees, useSupabaseAddEntity, useSupabaseDeleteEntity } from '../lib/supabaseService'
import { definitions } from '../types/database'

const Employees: NextPage = () => {
    useEffect(() => setMounted(true), [])
    const [mounted, setMounted] = useState(false)

    const router = useRouter()
    const user = useUser()
    const { 
        data: employees, 
        loading: employeesLoading, 
        error: employeesError
    } = useSupabaseGetEmployees()
    
    const { 
        addEntity: addEmployee, 
        loading: addEmployeeLoading, 
        error: addEmployeeError 
    } = useSupabaseAddEntity('employees')
    const { 
        deleteEntity: deleteEmployee, 
        loading: deleteEmployeeLoading, 
        error: deleteEmployeeError 
    } = useSupabaseDeleteEntity('employees')

    const emptyEmployee = {
        first_name: '',
        last_name: '',
        date_of_birth: '',
        salary: 0,
        coefficient: 0,
    }
    const [employee, setEmployee] = useState<Partial<definitions['employees']>>(emptyEmployee)

    const { first_name, last_name, date_of_birth, salary, coefficient } = employee

    const handleLogOut = async () => {
        await supabase.auth.signOut()
        router.replace('/')
    }

    async function addEmployeeAndReload() {
        await addEmployee(employee)
        router.reload()
    }

    async function deleteEmployeeAndReload(id: number) {
        await deleteEmployee(id)
        router.reload()
    }

    if (!mounted) return (<div></div>)

    if (!user || employeesLoading || addEmployeeLoading || deleteEmployeeLoading) {
        return (
            <div id="loader" className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mt-3"></div>
            </div>
        )
    }

    if (employeesError) {
        return (
            <div>Error while fetching employees: {employeesError}</div>
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
                                        htmlFor="first_name"
                                    >
                                        First Name
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="first_name"
                                        type="text"
                                        value={first_name?.toString()}
                                        onChange={(e) =>
                                            setEmployee({ ...employee, first_name: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="last_name"
                                    >
                                        Last Name
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="last_name"
                                        type="text"
                                        value={last_name?.toString()}
                                        onChange={(e) =>
                                            setEmployee({ ...employee, last_name: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="date_of_birth"
                                    >
                                        BirthDate
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="date_of_birth"
                                        type="date"
                                        value={date_of_birth?.toString()}
                                        onChange={(e) =>
                                            setEmployee({ ...employee, date_of_birth: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="Salary"
                                    >
                                        Salary
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="salary"
                                        type="number"
                                        value={salary}
                                        onChange={(e) =>
                                            setEmployee({ ...employee, salary: +e.target.value })
                                        }
                                    />
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="Coefficient"
                                    >
                                        Coefficient
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="coefficient"
                                        type="number"
                                        value={coefficient?.toString()}
                                        onChange={(e) =>
                                            setEmployee({ ...employee, coefficient: +e.target.value })
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="button"
                                        onClick={addEmployeeAndReload}
                                    >
                                        Add Employee
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
                                    Id
                                </th>
                                <th className="bg-blue-400 border text-left px-4 py-4">
                                    First Name
                                </th>
                                <th className="bg-blue-400 border text-left px-8 py-4">
                                    Last Name
                                </th>
                                <th className="bg-blue-400 border text-left px-8 py-4">
                                    BirthDate
                                </th>
                                <th className="bg-blue-400 border text-left px-14 py-4">
                                    Salary
                                </th>
                                <th className="bg-blue-400 border text-left px-16 py-4">
                                    Coefficient
                                </th>

                                <th className="bg-blue-400 border text-left px-4 py-4">
                                    Action
                                </th>
                            </tr>
                            {employees?.map((employee, index) => (
                                    <tr key={employee.id}>
                                        <td className="border px-4 py-4">{index + 1}</td>
                                        <td className="border px-4 py-4">{employee.first_name}</td>
                                        <td className="border px-8 py-4">{employee.last_name}</td>
                                        <td className="border px-8 py-4">{employee.date_of_birth}</td>
                                        <td className="border px-8 py-4">{employee.salary}</td>
                                        <td className="border px-8 py-4">{employee.coefficient}</td>
                                        <td className="border px-8 py-4">
                                            {' '}
                                            <button
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                type="button"
                                                onClick={() => deleteEmployeeAndReload(employee.id)}
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

export default Employees
