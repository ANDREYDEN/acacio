import useSWR from 'swr'
import { definitions } from '@types'
import { apiGet } from './common'

export const useSupabaseGetRetentions = () => {
    const { data, error, mutate } = useSWR('/api/retentions', apiGet)

    const definedData = data ? data as definitions['retentions'][] : []
    return { data: definedData, loading: !data, error: error?.toString(), mutate }
}