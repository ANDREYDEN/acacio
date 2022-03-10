import { MonthlyWorkHoursDto } from '@interfaces'
import useSWR from 'swr'
import { apiGet } from './common'

export const useGetEmployeesMonthlyWorkHours = () => {
    const { data, error, mutate } = useSWR('/api/salary', apiGet)

    const definedData = data ? data as MonthlyWorkHoursDto[] : []
    return { data: definedData, loading: !data, error: error?.toString(), mutate }
}