import useSWR from 'swr'
import { definitions } from '../../../types/database'
import { apiGet } from './common'

export const useSupabaseGetEmployees = () => {
  const { data, error } = useSWR('/api/employees', apiGet)

  const definedData = data ? data as definitions['employees'][] : []
  return { data: definedData, loading: !data, error }
}