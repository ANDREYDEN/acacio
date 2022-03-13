import { IAction } from './Action'

export interface IEmployeesTableRow {
    name: string
    roleId: number
    birthDate: string
    salary: number
    revenuePercentage: number
    editEmployee: IAction
    deleteEmployee: IAction
}