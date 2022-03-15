import { IAction } from './Action'

export interface IEmployeesTableRow {
    name: string
    roleName: string
    birthDate: string
    salary: number
    revenuePercentage: number
    editEmployee: IAction
    deleteEmployee: IAction
}