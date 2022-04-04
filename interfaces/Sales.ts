import dayjs from 'dayjs'

export interface SalesPerDay {
    date: dayjs.Dayjs
    dayOfWeek: dayjs.Dayjs
    customers: number
    averageBill: number
    kitchenRevenue: number
    kitchenProfit: number
    barRevenue: number
    barProfit: number
    totalRevenue: number
    totalProfit: number
}