import dayjs from 'dayjs'
import useSWR from 'swr'
import { definitions } from '../../../types/database'
import { apiGet } from './common'

export const useSupabaseGetShifts = (date: dayjs.Dayjs) => {
  const { data, error, mutate } = useSWR(`/api/shifts?month=${date.month()}&year=${date.year()}`, apiGet)

  const definedData = data ? data as definitions['shifts'][] : []
  return { data: definedData, loading: !data, error: error?.toString(), mutate }
}