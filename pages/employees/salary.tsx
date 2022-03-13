import ErrorMessage from '@components/ErrorMessage'
import Loader from '@components/Loader'
import { useMounted } from '@lib/hooks'
import { usePosterGetDeductionsForEmployees, usePosterGetSalesIncomeForEmployees } from '@lib/services/poster'
import { useSupabaseGetBonuses, useSupabaseGetEmployees, useSupabaseGetShifts } from '@lib/services/supabase'
import dayjs from 'dayjs'
import { NextPage } from 'next'

const Salary: NextPage = () => {
    const { mounted } = useMounted()

    const {
        data: employees, 
        loading: employeesLoading, 
        error: employeesError,
    } = useSupabaseGetEmployees()

    const {
        data: bonuses, 
        loading: bonusesLoading, 
        error: bonusesError,
    } = useSupabaseGetBonuses()

    const {
        data: shifts, 
        loading: shiftsLoading, 
        error: shiftsError,
    } = useSupabaseGetShifts(dayjs())

    const {
        deductionsTotals,
        deductionsTotalsLoading,
        deductionsTotalsError,
    } = usePosterGetDeductionsForEmployees(employees)

    const {
        salesIncomeTotals,
        salesIncomeTotalsLoading,
        salesIncomeTotalsError,
    } = usePosterGetSalesIncomeForEmployees(employees, shifts)
    
    
    const loading = 
        employeesLoading || 
        shiftsLoading || 
        bonusesLoading || 
        deductionsTotalsLoading || 
        salesIncomeTotalsLoading
    if (!mounted || loading) return <Loader />
    
    const error = 
        employeesError ||
        shiftsError ||
        bonusesError || 
        deductionsTotalsError || 
        salesIncomeTotalsError
    if (error) return <ErrorMessage message={error} />

    return <>
        <h3>Salary</h3>
        {employees.map(employee => {
            const workHoursTotal = shifts.reduce(
                (acc, shift) => acc + (shift.employee_id === employee.id ? shift.duration : 0),
                0
            )
            const salaryTotal = workHoursTotal * employee.salary
            const deductionsTotal = deductionsTotals[employee.id] ?? 0
            const salesIncomeTotal = salesIncomeTotals[employee.id] ?? 0
            const bonusesTotal = bonuses.reduce(
                (acc, bonus) => acc + (bonus.employee_id === employee.id ? bonus.amount : 0), 
                0
            )
            const incomeTotal = salaryTotal + salesIncomeTotal + bonusesTotal - deductionsTotal
            return <>
                <h4>Name: {employee.first_name}</h4>
                <div>Salary: {employee.salary}UAH</div>
                <div>Hours Worked: {workHoursTotal}h</div>
                <div>Total Salary: {salaryTotal}UAH</div>
                <div>Deductions: {deductionsTotal}</div>
                <div>Bonus: {bonusesTotal}</div>
                <div>Sales Income: {salesIncomeTotal.toFixed(2)}</div>
                <div>Total Income: {incomeTotal.toFixed(2)}</div>
            </>
        })}
    </>
}

export default Salary