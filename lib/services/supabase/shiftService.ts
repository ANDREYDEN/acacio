import dayjs from 'dayjs'
import useSWR from 'swr'
import { definitions } from '../../../types/database'
import { apiGet } from './common'

export const useSupabaseGetShifts = (month?: number) => {
  month ??= dayjs().month()
  const { data, error, mutate } = useSWR(`/api/shifts?month=${month}`, apiGet)

  const definedData = data ? data as definitions['shifts'][] : []
  return { data: definedData, loading: !data, error, mutate }
}