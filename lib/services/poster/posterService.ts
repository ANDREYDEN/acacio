import axios from 'axios'
import useSWR from 'swr'
import { definitions } from '@types'
import { EmployeesMonthlyStatDto, MonthlyWorkHoursDto2 } from '@interfaces'
import { Deduction, SalesData } from 'interfaces/Poster'

export const posterInstance = axios.create({
    baseURL: 'https://joinposter.com/api/',
    params: {
        token: process.env.NEXT_POSTER_ACCESS_TOKEN ?? ''
    }
})

async function posterGet(url: string) {
    const response = await axios.get(`/api/poster/${url}`)
    if (response.status === 400) {
        throw response.data.message
    }
    return response.data
}

export function usePosterGetEmployees() {
    const { data, error } = useSWR('access.getEmployees', posterGet)

    const employeesError = error?.toString()

    if (!data) {
        return { employees: [], employeesLoading: !employeesError, employeesError }
    }

    const employees: Partial<definitions['employees']>[] = data.map((e: any, i: number) => ({
        id: i,
        first_name: e.name,
        last_name: e.name
    }))

    return { employees, employeesLoading: !employeesError && !employees, employeesError }
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

export function usePosterGetSalesIncomeForEmployees(employees: definitions['employees'][], shiftDurations: MonthlyWorkHoursDto2) {
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
        salesIncomeTotals[employee.id] = (shiftDurations[employee.id] ?? [])
            .reduce(
                (total, duration, day) => total + duration * employee.income_percentage * (+sales.data[day]), 
                0
            )
    }

    return { 
        salesIncomeTotals, 
        salesIncomeTotalsLoading: !salesIncomeTotalsError && !salesIncomeTotals, 
        salesIncomeTotalsError
    }
}