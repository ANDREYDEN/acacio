import { EmployeesMonthlyStatDto } from '@interfaces'
import { definitions } from '@types'
import axios from 'axios'
import dayjs from 'dayjs'
import { Deduction, SalePerDayDto, SalesData } from 'interfaces/Poster'
import useSWR from 'swr'

export const posterInstance = axios.create({
    baseURL: 'https://joinposter.com/api/',
    params: {
        token: process.env.NEXT_POSTER_ACCESS_TOKEN ?? ''
    }
})

async function posterGet(url: string, params?: Record<string, any>) {
    const response = await axios.get(`/api/poster/${url}`, params ?? {})
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

export function usePosterGetSales(dateFrom?: dayjs.Dayjs, dateTo?: dayjs.Dayjs) {
    const { data: sales, error, mutate } = useSWR<SalesData>(
        'dash.getAnalytics',
        (url: string) => posterGet(
            url,
            {
                dateFrom: dateFrom?.format('YYYYMMDD'),
                dateTo: dateTo?.format('YYYYMMDD')
            })
    )
    console.log(sales)

    const salesError = error?.toString()

    // if (!sales) {
    //     return {
    //         sales: [{}] as SalePerDayDto[],
    //         salesLoading: !salesError,
    //         salesError
    //     }
    // }
    //
    // const salesData = sales.data

    return {
        sales: [{ date: dayjs().startOf('week') }] as SalePerDayDto[],
        salesLoading: !salesError && !sales,
        salesError,
        revalidateSales: mutate
    }
}