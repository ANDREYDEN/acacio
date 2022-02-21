import { definitions } from '@types'

export type ScheduleTableRow = Record<string, definitions['employees'] | number> & {
  employee: definitions['employees']
  total: number
}