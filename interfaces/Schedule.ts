export type ScheduleTableRow = Record<string, ShiftDto | string | number> & {
  employeeName: string
  total: number
}

export interface ShiftDto {
  duration: number
  onChange: (newDuration: number) => void
}