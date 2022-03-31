export interface IRowAction {
    label: string
    action: () => void | Promise<void>
    textColor?: string
}

export interface IRowInput {
    onChange: (newValue: number) => void
    initialValue: number
}
