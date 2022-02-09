import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../client'
import { useUser } from '../lib/hooks'
import { usePosterGetEmployees } from '../lib/posterService'

const PosterEmployees: NextPage = () => {
    const router = useRouter()
    const user = useUser()

    const { employees, employeesLoading, employeesError } = usePosterGetEmployees()

    const handleLogOut = async () => {
        await supabase.auth.signOut()
        router.replace('/')
    }

    if (employeesLoading || !employees) {
        return (
            <div id="loader" className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mt-3"></div>
            </div>
        )
    }

    if (employeesError) return (<div>Error: {employeesError}</div>)

    return (
        <div id="asd" className="flex flex-col items-center justify-center py-2">
            <div>
                <Head>
                    <title>Acacio</title>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>

                <div>User Email: {user?.email}</div>
                <button onClick={handleLogOut}>Log Out</button>

                <div className="flex flex-wrap items-center justify-around mt-6">
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
                            </tr>
                            {employees.map((employee, index) => (
                                    <tr key={employee.id}>
                                        <td className="border px-4 py-4">{index + 1}</td>
                                        <td className="border px-4 py-4">{employee.first_name}</td>
                                        <td className="border px-8 py-4">{employee.last_name}</td>
                                        <td className="border px-8 py-4">{employee.date_of_birth}</td>
                                        <td className="border px-8 py-4">{employee.salary}</td>
                                        <td className="border px-8 py-4">{employee.coefficient}</td>
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

export default PosterEmployees
