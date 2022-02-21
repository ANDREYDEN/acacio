import { definitions } from '@types'

export interface IActionsList {
    label: string
    action: (() => void) | ((entityId: number) => Promise<void>)
    textColor?: string
}

export interface ITable {
    headers: string[]
    data: definitions['employees'][]
    actionsList?: Array<IActionsList>
}