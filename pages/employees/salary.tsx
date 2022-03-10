import ErrorMessage from '@components/ErrorMessage'
import Loader from '@components/Loader'
import { useMounted } from '@lib/hooks'
import { useSupabaseGetEmployees } from '@lib/services/supabase'
import { useGetEmployeesMonthlySalary } from '@lib/services/supabase/salaryService'
import { NextPage } from 'next'

const Salary: NextPage = () => {
    const { mounted } = useMounted()

    const {
        data: employees, 
        loading: employeesLoading, 
        error: employeesError,
    } = useSupabaseGetEmployees()

    const {
        data: salaryTotals,
        loading: salaryTotalsLoading,
        error: salaryTotalsError,
    } = useGetEmployeesMonthlySalary()
    
    if (!mounted || employeesLoading || salaryTotalsLoading) {
        return <Loader />
    }

    if (employeesError || salaryTotalsError) {
        return <ErrorMessage message={employeesError || salaryTotalsError} />
    }

    return <>
        <h3>Salary</h3>
        {employees.map(employee => (
            <>
                <h4>{employee.first_name}</h4>
                <span>{(salaryTotals.find(st => st.employee_id === employee.id)?.total_salary ?? 0) * employee.salary}UAH</span>
            </>
        ))}
    </>
}

export default Salary