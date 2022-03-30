import { IRowInput } from './RowActions'

// employee_id -> statistic
export type EmployeesMonthlyStatDto = Record<number, number>

export interface SalaryTableRow {
    employeeName: string
    hourlySalary: number
    hoursTotal: number
    salaryTotal: number
    salesIncomeTotal: number
    deductionsTotal: number
    bonusDto: IRowInput
    incomeTotal: number
}