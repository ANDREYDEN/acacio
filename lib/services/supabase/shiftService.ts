import useSWR from 'swr'
import { definitions } from '../../../types/database'
import { apiGet } from './common'

export const useSupabaseGetShifts = () => {
  const { data, error, mutate } = useSWR('/api/shifts', apiGet)

  const definedData = data ? data as definitions['shifts'][] : []
  return { data: definedData, loading: !data, error, mutate }
}