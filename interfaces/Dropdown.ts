import dayjs from 'dayjs'

export type DropdownItemValue = string | number | dayjs.Dayjs

export interface IDropdownItem {
    label: string
    value: DropdownItemValue
}

export interface IValidatedDropdownItem {
    label: string
    value: string | number
}
