import ErrorMessage from '@components/ErrorMessage'
import Loader from '@components/Loader'
import NumberInputCell from '@components/NumberInputCell'
import { useMounted } from '@lib/hooks'
import { usePosterGetDeductionsForEmployees, usePosterGetSalesIncomeForEmployees } from '@lib/services/poster'
import { useSupabaseDeleteEntity, useSupabaseGetBonuses, useSupabaseGetEmployees, useSupabaseGetShifts, useSupabaseUpsertEntity } from '@lib/services/supabase'
import { definitions } from '@types'
import dayjs from 'dayjs'
import { NextPage } from 'next'
import { useCallback } from 'react'

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
        {employees.map(employee => {
            const workHoursTotal = shifts.reduce(
                (acc, shift) => acc + (shift.employee_id === employee.id ? shift.duration : 0),
                0
            )
            const salaryTotal = workHoursTotal * employee.salary
            const deductionsTotal = deductionsTotals[employee.id] ?? 0
            const salesIncomeTotal = salesIncomeTotals[employee.id] ?? 0
            const bonus = matchingBonus(employee.id)
            const bonusAmount = bonus?.amount ?? 0
            const incomeTotal = salaryTotal + salesIncomeTotal + bonusAmount - deductionsTotal

            return <>
                <h4>Name: {employee.first_name}</h4>
                <div>Salary: {employee.salary}UAH</div>
                <div>Hours Worked: {workHoursTotal}h</div>
                <div>Total Salary: {salaryTotal}UAH</div>
                <div>Deductions: {deductionsTotal}</div>
                <div>
                    Bonus: 
                    <NumberInputCell 
                        value={bonusAmount} 
                        onBlur={amount => modifyBonusAndReload({ ...bonus, amount, employee_id: employee.id })} />
                </div>
                <div>Sales Income: {salesIncomeTotal.toFixed(2)}</div>
                <div>Total Income: {incomeTotal.toFixed(2)}</div>
            </>
        })}
    </>
}

export default Salary