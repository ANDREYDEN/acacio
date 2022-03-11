export interface MonthlyWorkHoursDto {
  employee_id: number
  total_work_hours: number
}

// employee_id -> list of workhours per day
export type MonthlyWorkHoursDto2 = Record<number, number[]>

// employee_id -> statistic
export type EmployeesMonthlyStatDto = Record<number, number>