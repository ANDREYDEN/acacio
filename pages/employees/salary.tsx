import Button from '@components/Button'
import SalaryTable from '@components/employees/salary/SalaryTable'
import ErrorMessage from '@components/ErrorMessage'
import Loader from '@components/Loader'
import { SalaryTableRow } from '@interfaces'
import { useMounted } from '@lib/hooks'
import exportToXLSX from '@lib/services/exportService'
import { usePosterGetDeductionsForEmployees, usePosterGetSalesIncomeForEmployees } from '@lib/services/poster'
import { useSupabaseDeleteEntity, useSupabaseGetBonuses, useSupabaseGetEmployees, useSupabaseGetShifts, useSupabaseUpsertEntity } from '@lib/services/supabase'
import { definitions } from '@types'
import dayjs from 'dayjs'
import { Column } from 'exceljs'
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

    const modifyBonusAndReload = useCallback(async (bonus: Partial<definitions['bonuses']>) => {
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
    }, [bonuses, deleteBonus, revalidateBonuses, upsertBonus])

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
                bonusDto: { 
                    initialValue: bonusAmount, 
                    onChange: newAmount => modifyBonusAndReload({
                        ...bonus, employee_id: employee.id, amount: newAmount
                    })
                },
                incomeTotal: salaryTotal + salesIncomeTotal + bonusAmount - deductionsTotal,
            }
        })
    }, [employees, shifts, salesIncomeTotals, deductionsTotals, matchingBonus, modifyBonusAndReload])

    const handleExport = async () => {
        const exportData = tableData.map(row => ({ 
            ...row, 
            bonusDto: row.bonusDto.initialValue 
        }))
        const columns: Partial<Column>[] = [
            { key: 'employeeName', header: 'Name', width: 20 },
            { key: 'hourlySalary', header: 'Hourly Wage', width: 15 },
            { key: 'hoursTotal', header: 'Total Hours', width: 15 },
            { key: 'salaryTotal', header: 'Total Salary', width: 15 },
            { key: 'salesIncomeTotal', header: 'Sales Income', width: 15 },
            { key: 'deductionsTotal', header: 'Deductions', width: 15 },
            { key: 'bonusDto', header: 'Bonus', },
            { key: 'incomeTotal', header: 'Income Total', width: 15 }
        ]
        await exportToXLSX(exportData, columns, `Salary ${dayjs().format('MMM YYYY')}`)
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

    return <div className='flex flex-col items-center py-2 lg:mr-20 mr-10 mb-8'>
        <div className='w-full flex justify-between mb-8'>
            <div>
                <h3>Salary</h3>
                {dayjs().format('MMMM, YYYY')}
            </div>
            <div className='space-x-8'>
                <Button 
                    // label={t('export', { ns: 'common' })} 
                    label='Export'
                    variant='secondary' 
                    buttonClass='w-56'
                    onClick={handleExport}
                />
            </div>
        </div>
        {upsertBonusLoading || deleteBonusLoading && <Loader />}
        {upsertBonusError || deleteBonusError && <ErrorMessage message={upsertBonusError || deleteBonusError} />}
        <SalaryTable data={tableData} />
    </div>
}

export default Salary