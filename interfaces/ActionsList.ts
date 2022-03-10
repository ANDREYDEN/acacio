export interface IActionsList {
    label: string
    action: (() => void) | ((entityId: number) => void | Promise<void>)
    textColor?: string
}
