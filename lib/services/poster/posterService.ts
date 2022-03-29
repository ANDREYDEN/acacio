import { EmployeesMonthlyStatDto, SalesPerDay } from '@interfaces'
import { IngredientMovementVM } from '@lib/posterTypes'
import { definitions } from '@types'
import axios from 'axios'
import dayjs from 'dayjs'
import { Deduction, SalesData } from 'interfaces/Poster'
import useSWR from 'swr'

export const posterInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_POSTER_URL,
    params: {
        token: process.env.NEXT_POSTER_ACCESS_TOKEN ?? ''
    }
})

async function posterGet(url: string, params?: Record<string, any>) {
    const response = await axios.get(`/api/poster/${url}`, { params: params ?? {} })
    if (response.status === 400) {
        throw response.data.message
    }
    return response.data
}

export function usePosterGetDeductionsForEmployees(employees: definitions['employees'][]) {
    const { data: wastes, error } = useSWR<Deduction[]>('storage.getWastes', posterGet)

    const deductionsTotalsError = error?.toString()

    if (!wastes) {
        return { 
            deductionsTotals: {} as EmployeesMonthlyStatDto, 
            deductionsTotalsLoading: !deductionsTotalsError, 
            deductionsTotalsError 
        }
    }

    const deductionsTotals: EmployeesMonthlyStatDto = wastes.reduce((acc: EmployeesMonthlyStatDto, deduction) => {
        const employee = employees.find(employee => 
            deduction.reason_name.toLowerCase().includes(employee.first_name.toLowerCase()) || 
            deduction.reason_name.toLowerCase().includes(employee.last_name?.toLowerCase() ?? ''))
        if (!employee) return acc
        
        return {
            ...acc,
            [employee.id]: (acc[employee.id] ?? 0) + (+deduction.total_sum / 100),
        }
    }, {})

    return { 
        deductionsTotals, 
        deductionsTotalsLoading: !deductionsTotalsError && !deductionsTotals, 
        deductionsTotalsError
    }
}

export function usePosterGetSalesIncomeForEmployees(
    employees: definitions['employees'][], 
    shifts: definitions['shifts'][]
) {
    const { data: sales, error } = useSWR<SalesData>('dash.getAnalytics', posterGet)

    const salesIncomeTotalsError = error?.toString()

    if (!sales) {
        return { 
            salesIncomeTotals: {} as EmployeesMonthlyStatDto, 
            salesIncomeTotalsLoading: !salesIncomeTotalsError, 
            salesIncomeTotalsError 
        }
    }

    const salesIncomeTotals: EmployeesMonthlyStatDto = {}

    for (const employee of employees) {
        salesIncomeTotals[employee.id] = sales.data
            .reduce(
                (total, dateSales, date) => {
                    const currentDay = dayjs().set('date', date + 1)
                    
                    const workHours = shifts
                        .find(shift => employee.id === shift.employee_id && dayjs(shift.date).isSame(currentDay, 'date'))
                        ?.duration ?? 0
                    return total + workHours * (employee.income_percentage / 100) * (+dateSales)
                }, 
                0
            )
    }

    return { 
        salesIncomeTotals, 
        salesIncomeTotalsLoading: !salesIncomeTotalsError && !salesIncomeTotals, 
        salesIncomeTotalsError
    }
}

export async function posterGetSales(dateFrom: dayjs.Dayjs, dateTo: dayjs.Dayjs) {
    const salesFinal: SalesPerDay[] = []
    const numberOfDays = dateTo.diff(dateFrom, 'day')

    await Promise.all([...Array(numberOfDays)].map((_, i) => {
        return (async () => {
            const currentDate = dateFrom.add(i, 'day')
            const sales = await getSalesForDay(currentDate)
            const salesWorkshops = await getSalesForDay(currentDate, 'workshops')

            const kitchenSales = salesWorkshops.find((sw: any) => sw.workshop_name.toLowerCase().trim() === 'кухня')
            const barSales = salesWorkshops.find((sw: any) => sw.workshop_name.toLowerCase().trim() === 'бар')

            salesFinal.push({
                date: currentDate,
                dayOfWeek: currentDate,
                customers: sales.counters.visitors,
                averageBill: sales.counters.average_receipt,
                kitchenRevenue: kitchenSales?.revenue ?? 0,
                kitchenProfit: kitchenSales?.prod_profit ?? 0,
                barRevenue: barSales?.revenue ?? 0,
                barProfit: barSales?.prod_profit ?? 0,
                totalRevenue: sales.counters.revenue,
                totalProfit: sales.counters.profit
            })
        })()
    }))
    salesFinal.sort((s1, s2) => s1.date.diff(s2.date))

    return salesFinal
}

async function getSalesForDay(day: dayjs.Dayjs, type?: string) {
    const sales = await posterGet(
        'dash.getAnalytics',
        {
            dateFrom: day.format('YYYYMMDD'),
            dateTo: day.format('YYYYMMDD'),
            type
        }
    )

    return sales
}

export async function posterGetIngredientMovement(dateFrom: dayjs.Dayjs, dateTo: dayjs.Dayjs) {
    const ingredients = await posterGet(
        'storage.getReportMovement',
        {
            dateFrom: dateFrom.format('YYYYMMDD'),
            dateTo: dateTo.format('YYYYMMDD'),
        }
    )

    return ingredients as IngredientMovementVM[]
}