import ErrorMessage from '@components/ErrorMessage'
import Loader from '@components/Loader'
import { useMounted } from '@lib/hooks'
import { usePosterGetDeductionsForEmployees, usePosterGetSalesIncomeForEmployees } from '@lib/services/poster'
import { useSupabaseGetEmployees } from '@lib/services/supabase'
import { useGetEmployeesMonthlyWorkHours } from '@lib/services/supabase/salaryService'
import { NextPage } from 'next'

const Salary: NextPage = () => {
    const { mounted } = useMounted()

    const {
        data: employees, 
        loading: employeesLoading, 
        error: employeesError,
    } = useSupabaseGetEmployees()

    const {
        data: workHoursTotals,
        loading: workHoursTotalsLoading,
        error: workHoursTotalsError,
    } = useGetEmployeesMonthlyWorkHours()

    const {
        deductionsTotals,
        deductionsTotalsLoading,
        deductionsTotalsError,
    } = usePosterGetDeductionsForEmployees(employees)

    const {
        salesIncomeTotals,
        salesIncomeTotalsLoading,
        salesIncomeTotalsError,
    } = usePosterGetSalesIncomeForEmployees(employees, []) // TODO: get shifts hours
    
    
    const loading = employeesLoading || workHoursTotalsLoading || deductionsTotalsLoading || salesIncomeTotalsLoading
    if (!mounted || loading) return <Loader />
    
    const error = employeesError || workHoursTotalsError || deductionsTotalsError || salesIncomeTotalsError
    if (error) return <ErrorMessage message={error} />

    return <>
        <h3>Salary</h3>
        {employees.map(employee => {
            const workHoursTotal = workHoursTotals.find(st => st.employee_id === employee.id)?.total_work_hours ?? 0
            const salaryTotal = workHoursTotal * employee.salary
            const deductionsTotal = deductionsTotals[employee.id] ?? 0
            const salesIncomeTotal = salesIncomeTotals[employee.id] ?? 0
            const incomeTotal = salaryTotal + salesIncomeTotal - deductionsTotal
            return <>
                <h4>Name: {employee.first_name}</h4>
                <div>Salary: {employee.salary}UAH</div>
                <div>Hours Worked: {workHoursTotal}h</div>
                <div>Total Salary: {salaryTotal}UAH</div>
                <div>Deductions: {deductionsTotal}</div>
                <div>Sales Income: {salesIncomeTotal}</div>
                <div>Total Income: {incomeTotal}</div>
            </>
        })}
    </>
}

export default Salary