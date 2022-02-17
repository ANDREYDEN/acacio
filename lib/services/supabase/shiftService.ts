import useSWR from 'swr'
import { definitions } from '../../../types/database'
import { apiGet } from './common'

export const useSupabaseGetShifts = () => {
    const { data, error, mutate } = useSWR('/api/shifts', apiGet)

    return { data: data as definitions['shifts'][], loading: !data, error, mutate }
}