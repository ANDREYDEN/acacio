import { definitions } from '../types/database'

export type ScheduleTableRow = Record<string, definitions['employees'] | number> & {
  employee: definitions['employees']
  total: number
}