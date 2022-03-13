import { EmployeesMonthlyStatDto } from '@interfaces'
import { definitions } from '@types'
import axios from 'axios'
import dayjs from 'dayjs'
import { Deduction, SalesData } from 'interfaces/Poster'
import useSWR from 'swr'

export const posterInstance = axios.create({
    // baseURL: 'https://joinposter.com/api/',
    baseURL: 'https://401524cc-8270-41bd-9bab-118833a6d3cd.mock.pstmn.io',
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
                    console.log({ e: employee.first_name, date: date + 1, shifts: shifts.filter(shift => employee.id === shift.employee_id) })
                    
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