export interface MonthlyWorkHoursDto {
  employee_id: number
  total_work_hours: number
}

// employee_id -> total_deductions
export type MonthlyDeductionsDto = Record<number, number>