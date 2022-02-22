import useSWR from 'swr'
import { definitions } from '@types'
import { apiGet } from './common'

export const useSupabaseGetEmployeeRoles = () => {
    const { data, error } = useSWR('/api/employee-roles', apiGet)

    const definedData = data ? data as definitions['employee_roles'][] : []
    return { data: definedData, loading: !data, error }
}
