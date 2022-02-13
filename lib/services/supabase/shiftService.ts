import axios from 'axios'
import useSWR from 'swr'
import { definitions } from '../../../types/database'

async function apiGet(url: string) {
  const { data } = await axios.get(url)
  return data
}

export const useSupabaseGetShifts = () => {
  const { data, error, mutate } = useSWR('/api/shifts', apiGet)

  return { data: data as definitions['shifts'][], loading: !data, error, mutate }
}