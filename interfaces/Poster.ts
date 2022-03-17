import dayjs from 'dayjs'

export interface Deduction {
  reason_name: string
  total_sum: string
}

export interface SalesData {
  data: string[]
}

export interface SalePerDayDto {
  date: dayjs.Dayjs
}