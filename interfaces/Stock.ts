import { IRowInput } from './RowActions'

export type StockTableRow = {
  ingredientId: string
  ingredientName: string
  category: string
  supplier: string
  initialBalance: string
  initialAvgCost: number
  sold: string
  soldCost: number
  writeOff: string
  writeOffCost: number
  lastSupply: string
  finalBalance: string
  finalBalanceCost: number
  finalAverageCost: number
  reorder: string
  toOrder: IRowInput
  totalCost: number
}