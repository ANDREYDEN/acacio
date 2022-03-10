import ErrorMessage from '@components/ErrorMessage'
import Loader from '@components/Loader'
import { useMounted } from '@lib/hooks'
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
    
    if (!mounted || employeesLoading || workHoursTotalsLoading) {
        return <Loader />
    }

    if (employeesError || workHoursTotalsError) {
        return <ErrorMessage message={employeesError || workHoursTotalsError} />
    }

    return <>
        <h3>Salary</h3>
        {employees.map(employee => {
            const workHoursTotal = workHoursTotals.find(st => st.employee_id === employee.id)?.total_work_hours ?? 0
            const salaryTotal = workHoursTotal * employee.salary
            return <>
                <h4>Name: {employee.first_name}</h4>
                <div>Salary: {employee.salary}UAH</div>
                <div>Hours Worked: {workHoursTotal}h</div>
                <div>Total Salary: {salaryTotal}UAH</div>
            </>
        })}
    </>
}

export default Salary