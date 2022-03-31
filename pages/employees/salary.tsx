import { useCallback, useMemo } from 'react'
import { Column } from 'exceljs'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { Button, SalaryTable, ErrorMessage, Loader } from '@components'
import { SalaryTableRow } from '@interfaces'
import { useMounted } from '@lib/hooks'
import exportToXLSX from '@lib/services/exportService'
import { usePosterGetDeductionsForEmployees, usePosterGetSalesIncomeForEmployees } from '@lib/services/poster'
import { capitalizeWord, enforceAuthenticated, fullName } from '@lib/utils'
import { definitions } from '@types'
import {
    useSupabaseDeleteEntity,
    useSupabaseGetBonuses,
    useSupabaseGetEmployees,
    useSupabaseGetShifts,
    useSupabaseUpsertEntity
} from '@lib/services/supabase'

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['salary', 'common']),
    },
}))

const Salary: NextPage = () => {
    const { mounted } = useMounted()
    const { t } = useTranslation('salary')
    const router = useRouter()

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
                employeeName: fullName(employee),
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
            { key: 'employeeName', header: t('table.employee').toString(), width: 20 },
            { key: 'hourlySalary', header: t('table.hourlyWage').toString(), width: 15 },
            { key: 'hoursTotal', header: t('table.hoursTotal').toString(), width: 15 },
            { key: 'salaryTotal', header: t('table.salaryTotal').toString(), width: 15 },
            { key: 'salesIncomeTotal', header: t('table.salesIncomeTotal').toString(), width: 20 },
            { key: 'deductionsTotal', header: t('table.deductionsTotal').toString(), width: 15 },
            { key: 'bonusDto', header: t('table.bonus').toString(), },
            { key: 'incomeTotal', header: t('table.incomeTotal').toString(), width: 15 }
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

    const currentMonth = dayjs().locale(router.locale?.split('-')[0] ?? 'en').format('MMMM, YYYY')

    return (
        <div className='flex flex-col items-center'>
            <div className='w-full flex justify-between mb-8'>
                <div>
                    <h3>{t('header')}</h3>
                    {capitalizeWord(currentMonth)}
                </div>
                <div className='space-x-8'>
                    <Button 
                        label={t('export', { ns: 'common' })} 
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
    )
}

export default Salary