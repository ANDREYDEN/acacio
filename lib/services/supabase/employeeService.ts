import axios from 'axios'
import useSWR from 'swr'
import { definitions } from '../../../types/database'

async function apiGet(url: string) {
  const { data } = await axios.get(url)
  return data
}

export const useSupabaseGetEmployees = () => {
  const { data, error } = useSWR('/api/employees', apiGet)

  return { data: data as definitions['employees'][] , loading: !data, error }
}