import React from 'react'
import { ITable } from '@interfaces'

const Table: React.FC<ITable> = ({ headers, data, actionsList }: ITable) => {
    return (
        <div className='border rounded-lg w-full'>
            <table className='w-full'>
                <thead>
                    <tr>
                        {headers.map((header, index) =>
                            <th key={index} className='py-6 px-8 text-left border-b'>
                                <h6>{header}</h6>
                            </th>)}
                    </tr>
                </thead>
                <tbody>
                    {/*TODO: make table more generic*/}
                    {data?.map((entity, index) => (
                        <tr key={entity.id} className={index === data.length - 1 ? '' : 'border-b'}>
                            <td className='px-8 py-5'>{entity.first_name} {entity.last_name}</td>
                            {/*TODO: fetch roles*/}
                            {/*<td className='px-8 py-5'>{entity.role_id}</td>*/}
                            <td className='px-8 py-5'>{entity.birth_date}</td>
                            <td className='px-8 py-5'>{entity.salary}</td>
                            <td className='px-8 py-5'>{entity.income_percentage}%</td>
                            {actionsList && actionsList.map(actionItem =>
                                <td key={actionItem.label} className='px-8 py-5'>
                                    <button
                                        className={`text-${actionItem.textColor ?? 'black'} underline`}
                                        type='button'
                                        onClick={() => actionItem.action(entity.id)}
                                    >
                                        {actionItem.label}
                                    </button>
                                </td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table