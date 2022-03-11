import axios from 'axios'
import useSWR from 'swr'
import { definitions } from '@types'
import { MonthlyDeductionsDto } from '@interfaces'

export const posterInstance = axios.create({
    baseURL: 'https://joinposter.com/api/',
    params: {
        token: process.env.NEXT_POSTER_ACCESS_TOKEN ?? ''
    }
})

async function apiGet(url: string) {
    const response = await axios.get(`/api/poster/${url}`)
    if (response.status === 400) {
        throw response.data.message
    }
    return response.data
}

export function usePosterGetEmployees() {
    const { data, error } = useSWR('access.getEmployees', apiGet)

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

type deductionHookState = {
    deductionsTotals: MonthlyDeductionsDto,
    deductionsTotalsLoading: boolean,
    deductionsTotalsError: any
}

export function usePosterGetDeductionsForEmployees(employees: definitions['employees'][]): deductionHookState {
    const { data: wastes, error } = useSWR('storage.getWastes', apiGet)

    const deductionsTotalsError = error?.toString()

    if (!wastes) {
        return { deductionsTotals: {}, deductionsTotalsLoading: !deductionsTotalsError, deductionsTotalsError }
    }

    const deductionsTotals: MonthlyDeductionsDto = wastes.reduce((acc: MonthlyDeductionsDto, deduction: any) => {
        const employee = employees.find(employee => 
            deduction.reason_name.toLowerCase().includes(employee.first_name.toLowerCase()) || 
            deduction.reason_name.toLowerCase().includes(employee.last_name?.toLowerCase()))
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