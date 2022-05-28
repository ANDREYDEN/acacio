import React, { useCallback, useMemo, useState } from 'react'
import { Column } from 'exceljs'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { Button, SalaryTable, ErrorMessage, Loader, BonusCommentModal } from '@components'
import { IBonusInput, SalaryTableRow } from '@interfaces'
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
    useSupabaseUpsertEntity,
    useSupabaseGetPrepaidExpenses
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
    const [bonusForBonusModal, setBonusForBonusModal] = useState<IBonusInput>()

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
        error: upsertBonusError
    } = useSupabaseUpsertEntity('bonuses')
    const {
        deleteEntity: deleteBonus,
        error: deleteBonusError
    } = useSupabaseDeleteEntity('bonuses')
    const {
        data: prepaidExpenses,
        loading: prepaidExpensesLoading,
        error: prepaidExpensesError,
        mutate: revalidatePrepaidExpenses
    } = useSupabaseGetPrepaidExpenses()
    const {
        upsertEntity: upsertPrepaidExpense,
        error: upsertPrepaidExpenseError
    } = useSupabaseUpsertEntity('prepaid_expenses')
    const {
        deleteEntity: deletePrepaidExpense,
        error: deletePrepaidExpenseError
    } = useSupabaseDeleteEntity('prepaid_expenses')
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
    const matchingPrepaidExpense = useCallback((employeeId) => {
        return prepaidExpenses.find(prepaidExpense => prepaidExpense.employee_id === employeeId)
    }, [prepaidExpenses])

    const modifyBonusAndReload = useCallback(async (bonus: Partial<definitions['bonuses']>) => {
        // add
        if (!bonus.id) {
            return await revalidateBonuses(async () => {
                await upsertBonus(bonus)
                return [...bonuses, bonus]
            })
        }

        // delete
        if (bonus.amount === 0) {
            return await revalidateBonuses(async () => {
                await deleteBonus(bonus.id!)
                return bonuses.filter(b => b.id !== bonus.id)
            })
        }

        // update
        return await revalidateBonuses(async () => {
            await upsertBonus(bonus)
            return bonuses.map(b => b.id === bonus.id ? bonus : b)
        })
    }, [bonuses, deleteBonus, revalidateBonuses, upsertBonus])
    const modifyPrepaidExpenseAndReload = useCallback(async (prepaidExpense: Partial<definitions['prepaid_expenses']>) => {
        // add
        if (!prepaidExpense.id) {
            return await revalidatePrepaidExpenses(async () => {
                await upsertPrepaidExpense(prepaidExpense)
                return [...prepaidExpenses, prepaidExpense]
            })
        }

        // delete
        if (prepaidExpense.amount === 0) {
            return await revalidatePrepaidExpenses(async () => {
                await deletePrepaidExpense(prepaidExpense.id!)
                return prepaidExpenses.filter(b => b.id !== prepaidExpense.id)
            })
        }

        // update
        return await revalidatePrepaidExpenses(async () => {
            await upsertPrepaidExpense(prepaidExpense)
            return prepaidExpenses.map(b => b.id === prepaidExpense.id ? prepaidExpense : b)
        })
    }, [prepaidExpenses, deletePrepaidExpense, revalidatePrepaidExpenses, upsertPrepaidExpense])

    const tableData: SalaryTableRow[] = useMemo(() =>
        employees.map(employee => {
            const hoursTotal = shifts.reduce(
                (acc, shift) => acc + (shift.employee_id === employee.id ? shift.duration : 0),
                0
            )
            const salaryTotal = hoursTotal * employee.salary
            const salesIncomeTotal = salesIncomeTotals[employee.id] ?? 0
            const deductionsTotal = deductionsTotals[employee.id] ?? 0
            const bonus = matchingBonus(employee.id)
            const bonusAmount = matchingBonus(employee.id)?.amount ?? 0
            const prepaidExpense = matchingPrepaidExpense(employee.id)
            const prepaidExpenseAmount = prepaidExpense?.amount ?? 0

            return {
                employeeName: fullName(employee),
                hourlySalary: employee.salary,
                hoursTotal,
                salaryTotal,
                salesIncomeTotal,
                deductionsTotal,
                prepaidExpenseDto: {
                    value: prepaidExpense ?? {},
                    onAmountChange: newAmount => modifyPrepaidExpenseAndReload({
                        ...prepaidExpense, employee_id: employee.id, amount: newAmount
                    }),
                },
                bonusDto: {
                    value: bonus ?? {},
                    onAmountChange: newAmount => modifyBonusAndReload({
                        ...bonus, employee_id: employee.id, amount: newAmount
                    }),
                    onReasonChange: comment => modifyBonusAndReload({
                        ...bonus, employee_id: employee.id, amount: bonus?.amount ?? 0, reason: comment
                    })
                },
                incomeTotal: salaryTotal + salesIncomeTotal + bonusAmount - deductionsTotal - prepaidExpenseAmount,
            }
        }),
    [employees, shifts, salesIncomeTotals, deductionsTotals, matchingBonus, matchingPrepaidExpense, modifyPrepaidExpenseAndReload, modifyBonusAndReload])

    const handleExport = async () => {
        const exportData = tableData.map(row => ({ 
            ...row, 
            bonusDto: row.bonusDto.value.amount
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
    
    if (!mounted) return <Loader />

    const error =
        employeesError ||
        shiftsError ||
        bonusesError ||
        prepaidExpensesError ||
        deductionsTotalsError ||
        salesIncomeTotalsError
    if (error) return <ErrorMessage message={`Error fetching information: ${error}`} />

    const loading =
        employeesLoading ||
        shiftsLoading ||
        bonusesLoading ||
        prepaidExpensesLoading ||
        deductionsTotalsLoading ||
        salesIncomeTotalsLoading

    const currentMonth = dayjs().locale(router.locale?.split('-')[0] ?? 'en').format('MMMM, YYYY')

    return (
        <div className='flex flex-col items-center'>
            {bonusForBonusModal && !upsertBonusError &&
                <BonusCommentModal
                    onCloseModal={() => setBonusForBonusModal(undefined)}
                    bonus={bonusForBonusModal}
                />
            }

            <div className='w-full flex justify-between items-center mb-6'>
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

            {upsertBonusError || deleteBonusError &&
                <ErrorMessage message={upsertBonusError || deleteBonusError} />}
            {upsertPrepaidExpenseError || deletePrepaidExpenseError &&
                <ErrorMessage message={upsertPrepaidExpenseError || deletePrepaidExpenseError} />}
            {loading
                ? <Loader/>
                : <SalaryTable data={tableData} toggleModalForBonus={setBonusForBonusModal}/>
            }
        </div>
    )
}

export default Salary