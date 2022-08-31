import { definitions } from '@types'

export interface IRowAction {
    label: string
    action: () => void | Promise<void>
    textColor?: string
}

export interface IRowInput {
    id: string
    onChange: (newValue: number) => void
    initialValue: number
}

export interface IBonusInput {
    value: Partial<definitions['bonuses']>
    onAmountChange: (newValue: number) => void
    onReasonChange: (comment: string) => void
}
