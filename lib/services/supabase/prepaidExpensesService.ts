import useSWR from 'swr'
import { definitions } from '@types'
import { apiGet } from './common'

export const useSupabaseGetPrepaidExpenses = () => {
    const { data, error, mutate } = useSWR('/api/prepaid-expenses', apiGet)

    const definedData = data ? data as definitions['prepaid_expenses'][] : []
    return { data: definedData, loading: !data, error: error?.toString(), mutate }
}