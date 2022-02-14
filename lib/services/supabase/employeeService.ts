import useSWR from 'swr'
import { definitions } from '../../../types/database'
import { apiGet } from './common'

export const useSupabaseGetEmployees = () => {
  const { data, error } = useSWR('/api/employees', apiGet)

  return { data: data as definitions['employees'][] , loading: !data, error }
}