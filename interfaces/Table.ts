import { definitions } from '@types'

export interface IActionsList {
    label: string
    action: (() => void) | ((entityId: number) => Promise<void>)
    textColor?: string
}

export interface ITable {
    headers: string[]
    // TODO: make table more generic
    data: definitions['employees'][]
    actionsList?: Array<IActionsList>
}