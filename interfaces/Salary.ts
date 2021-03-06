import { IBonusInput } from './RowActions'
import { definitions } from '@types'

// employee_id -> statistic
export type EmployeesMonthlyStatDto = Record<number, number>

export interface IPrepaidExpense {
    value: Partial<definitions['prepaid_expenses']>
    onAmountChange: (newValue: number) => void
}

export interface IRetention {
    value: Partial<definitions['retentions']>
    onAmountChange: (newValue: number) => void
}

export interface SalaryTableRow {
    employeeName: string
    hourlySalary: number
    hoursTotal: number
    salaryTotal: number
    salesIncomeTotal: number
    deductionsTotal: number
    prepaidExpenseDto: IPrepaidExpense
    retentionDto: IRetention
    bonusDto: IBonusInput
    incomeTotal: number
}