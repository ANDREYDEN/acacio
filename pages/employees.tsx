import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../client'
import { useUser } from '../lib/hooks'
import { useSupabaseEntity } from '../lib/supabaseAcess'
import { definitions } from '../types/database'

const Employees: NextPage = () => {
    const { data: employees, loading: employeesLoading, error: employeesError } = useSupabaseEntity('employees')
    const router = useRouter()
    const [employee, setEmployee] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        salary: 0,
        coefficient: 0,
    })
    const user = useUser()

    const { firstName, lastName, dateOfBirth, salary, coefficient } = employee

    const handleLogOut = async () => {
        await supabase.auth.signOut()
        router.replace('/')
    }

    async function addEmployee() {
        await supabase
            .from<definitions['employees']>('employees')
            .insert([
                {
                    first_name: firstName,
                    last_name: lastName,
                    date_of_birth: dateOfBirth,
                    salary,
                    coefficient,
                },
            ])
            .single()

        setEmployee({
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            salary: 0,
            coefficient: 0,
        })
        // getEmployees() //TODO: implement re-fetch
    }

    async function deleteEmployee(id: number) {
        await supabase.from('employees').delete().eq('id', id)
        // getEmployees() //TODO: implement re-fetch
    }

    if (!user || employeesLoading) {
        return (
            <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mt-3"/>
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
                <Head>
                    <title>Acacio</title>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>

                <div>User Email: {user.email}</div>
                <button onClick={handleLogOut}>Log Out</button>

                <div className="flex flex-wrap items-center justify-around mt-6">
                    <div className="p-8 mt-6 border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
                        <div className="w-full max-w-sm">
                            <form className="bg-white rounded px-8 pt-6 pb-8 mb-4">
                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="firstName"
                                    >
                                        First Name
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="firstName"
                                        type="text"
                                        value={firstName.toString()}
                                        onChange={(e) =>
                                            setEmployee({ ...employee, firstName: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="lastName"
                                    >
                                        Last Name
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="lastName"
                                        type="text"
                                        value={lastName.toString()}
                                        onChange={(e) =>
                                            setEmployee({ ...employee, lastName: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="dateOfBirth"
                                    >
                                        BirthDate
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="dateOfBirth"
                                        type="date"
                                        value={dateOfBirth.toString()}
                                        onChange={(e) =>
                                            setEmployee({ ...employee, dateOfBirth: e.target.value })
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
                                        value={coefficient.toString()}
                                        onChange={(e) =>
                                            setEmployee({ ...employee, coefficient: +e.target.value })
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="button"
                                        onClick={addEmployee}
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
                                                onClick={() => deleteEmployee(employee.id)}
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
