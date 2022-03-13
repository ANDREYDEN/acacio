export interface IAction {
    label: string
    action: () => void | Promise<void>
    textColor?: string
}
