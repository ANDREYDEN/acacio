import { MonthlySalaryDto } from '@interfaces'
import useSWR from 'swr'
import { apiGet } from './common'

export const useGetEmployeesMonthlySalary = () => {
    const { data, error, mutate } = useSWR('/api/salary', apiGet)

    const definedData = data ? data as MonthlySalaryDto[] : []
    return { data: definedData, loading: !data, error: error?.toString(), mutate }
}