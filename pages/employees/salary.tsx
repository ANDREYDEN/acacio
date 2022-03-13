import SalaryTable from '@components/employees/salary/SalaryTable'
import ErrorMessage from '@components/ErrorMessage'
import Loader from '@components/Loader'
import { SalaryTableRow } from '@interfaces'
import { useMounted } from '@lib/hooks'
import { usePosterGetDeductionsForEmployees, usePosterGetSalesIncomeForEmployees } from '@lib/services/poster'
import { useSupabaseDeleteEntity, useSupabaseGetBonuses, useSupabaseGetEmployees, useSupabaseGetShifts, useSupabaseUpsertEntity } from '@lib/services/supabase'
import { definitions } from '@types'
import dayjs from 'dayjs'
import { NextPage } from 'next'
import { useCallback, useMemo } from 'react'

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
        mutate: revalidateBonuses
    } = useSupabaseGetBonuses()

    const {
        upsertEntity: upsertBonus,
        loading: upsertBonusLoading,
        error: upsertBonusError
    } = useSupabaseUpsertEntity('bonuses')

    const {
        deleteEntity: deleteBonus,
        loading: deleteBonusLoading,
        error: deleteBonusError
    } = useSupabaseDeleteEntity('bonuses')

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
    
    const matchingBonus = useCallback((employeeId) => {
        return bonuses.find(bonus => bonus.employee_id === employeeId)
    }, [bonuses])

    const modifyBonusAndReload = async (bonus: Partial<definitions['bonuses']>) => {
        if (bonus.id) {
            if (bonus.amount === 0) {
                await revalidateBonuses(bonuses.filter(b => b.id !== bonus.id))
                await deleteBonus(bonus.id)
            } else {
                await revalidateBonuses(bonuses.map(b => b.id === bonus.id ? bonus : b))
                await upsertBonus(bonus)
            }
        } else {
            await revalidateBonuses([...bonuses, bonus])
            await upsertBonus(bonus)
        }
        await revalidateBonuses()
    }

    const tableData: SalaryTableRow[] = useMemo(() => {
        return employees.map(employee => {
            const hoursTotal = shifts.reduce(
                (acc, shift) => acc + (shift.employee_id === employee.id ? shift.duration : 0),
                0
            )
            const salaryTotal = hoursTotal * employee.salary
            const salesIncomeTotal = salesIncomeTotals[employee.id] ?? 0
            const deductionsTotal = deductionsTotals[employee.id] ?? 0
            const bonus = matchingBonus(employee.id)
            const bonusAmount = bonus?.amount ?? 0
            return {
                employeeName: `${employee.first_name} ${employee.last_name}`,
                hourlySalary: employee.salary,
                hoursTotal,
                salaryTotal,
                salesIncomeTotal,
                deductionsTotal,
                bonusAmount,
                incomeTotal: salaryTotal + salesIncomeTotal + bonusAmount - deductionsTotal,
            }
        })
    }, [employees, shifts, salesIncomeTotals, deductionsTotals, matchingBonus])
    
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
        {upsertBonusLoading || deleteBonusLoading && <Loader />}
        {upsertBonusError || deleteBonusError && <ErrorMessage message={upsertBonusError || deleteBonusError} />}
        <SalaryTable data={tableData} onBonusChange={modifyBonusAndReload} />
    </>
}

export default Salary