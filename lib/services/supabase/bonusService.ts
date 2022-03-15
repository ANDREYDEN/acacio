import useSWR from 'swr'
import { definitions } from '@types'
import { apiGet } from './common'

export const useSupabaseGetBonuses = () => {
    const { data, error, mutate } = useSWR('/api/bonuses', apiGet)

    const definedData = data ? data as definitions['bonuses'][] : []
    return { data: definedData, loading: !data, error: error?.toString(), mutate }
}