export interface IDropdownOption {
    value: any
    label: string
}

export interface IDropdownItem {
    label: string
    action: () => void
    selected?: boolean
}
