import { IRowAction } from './RowActions'

export interface IEmployeesTableRow {
    name: string
    roleName: string
    birthDate: string
    salary: number
    revenuePercentage: number
    editEmployee: IRowAction
    deleteEmployee: IRowAction
}