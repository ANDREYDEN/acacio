export interface IDropdownOption {
    value: any
    label: string
}

export interface IDropdown {
    label: string
    name: string
    data: IDropdownOption[]
    defaultOption: string
    dropdownClass?: string
}

export interface IValidatedDropdown extends IDropdown{
    control: any
}
