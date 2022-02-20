import React from 'react'
import { definitions } from '@types'

interface ITable {
    headers: string[]
    data: definitions['employees'][]
    action?: (entityId: number) => Promise<void>
}

const Table: React.FC<ITable> = ({ headers, data, action }: ITable) => {
    return (
        <table>
            <thead>
                <tr>
                    {headers.map(header =>
                        <th key='header' className='bg-blue-400 border text-left px-4 py-4'>
                            {header}
                        </th>)}
                </tr>
            </thead>
            <tbody>
                {data?.map((employee, index) => (
                    <tr key={employee.id}>
                        <td className='border px-4 py-4'>{index + 1}</td>
                        <td className='border px-4 py-4'>{employee.first_name}</td>
                        <td className='border px-8 py-4'>{employee.last_name}</td>
                        <td className='border px-8 py-4'>{employee.date_of_birth}</td>
                        <td className='border px-8 py-4'>{employee.salary}</td>
                        <td className='border px-8 py-4'>{employee.coefficient}</td>
                        {action && <td className='border px-8 py-4'>
                            {' '}
                            <button
                                className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                                type='button'
                                onClick={() => action(employee.id)}
                            >
                            Delete
                            </button>
                        </td>}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Table