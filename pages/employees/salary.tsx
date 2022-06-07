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
import { capitalizeWord, enforceAuthenticated, fullName, modifyEntityAndReload } from '@lib/utils'
import { definitions } from '@types'
import { useSupabaseDeleteEntity, useSupabaseGetShifts, useSupabaseUpsertEntity, useSupabaseGetEntity } from '@lib/services/supabase'

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
    } = useSupabaseGetEntity<definitions['employees']>('employees')
    const {
        data: bonuses,
        loading: bonusesLoading,
        error: bonusesError,
        mutate: revalidateBonuses
    } = useSupabaseGetEntity<definitions['bonuses']>('bonuses')
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
    } = useSupabaseGetEntity<definitions['prepaid_expenses']>('prepaid_expenses')
    const {
        upsertEntity: upsertPrepaidExpense,
        error: upsertPrepaidExpenseError
    } = useSupabaseUpsertEntity('prepaid_expenses')
    const {
        deleteEntity: deletePrepaidExpense,
        error: deletePrepaidExpenseError
    } = useSupabaseDeleteEntity('prepaid_expenses')
    const {
        data: retentions,
        loading: retentionsLoading,
        error: retentionsError,
        mutate: revalidateRetentions
    } = useSupabaseGetEntity<definitions['retentions']>('retentions')
    const {
        upsertEntity: upsertRetention,
        error: upsertRetentionError
    } = useSupabaseUpsertEntity('retentions')
    const {
        deleteEntity: deleteRetention,
        error: deleteRetentionError
    } = useSupabaseDeleteEntity('retentions')
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
    const matchingRetention = useCallback((employeeId) => {
        return retentions.find(retention => retention.employee_id === employeeId)
    }, [retentions])

    const modifyBonusAndReload = useCallback((bonus: Partial<definitions['bonuses']>) =>
        modifyEntityAndReload(bonus, bonuses, revalidateBonuses, upsertBonus, deleteBonus, bonus.amount === 0),
    [bonuses, deleteBonus, revalidateBonuses, upsertBonus]
    )
    const modifyPrepaidExpenseAndReload = useCallback((prepaidExpense: Partial<definitions['prepaid_expenses']>) =>
        modifyEntityAndReload(prepaidExpense, prepaidExpenses, revalidatePrepaidExpenses, upsertPrepaidExpense, deletePrepaidExpense, prepaidExpense.amount === 0),
    [deletePrepaidExpense, prepaidExpenses, revalidatePrepaidExpenses, upsertPrepaidExpense]
    )
    const modifyRetentionAndReload = useCallback((retention: Partial<definitions['retentions']>) =>
        modifyEntityAndReload(retention, retentions, revalidateRetentions, upsertRetention, deleteRetention, retention.amount === 0),
    [deleteRetention, retentions, revalidateRetentions, upsertRetention]
    )

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
            const retention = matchingRetention(employee.id)
            const retentionAmount = retention?.amount ?? 0

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
                retentionDto: {
                    value: retention ?? {},
                    onAmountChange: newAmount => modifyRetentionAndReload({
                        ...retention, employee_id: employee.id, amount: newAmount
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
                incomeTotal: salaryTotal + salesIncomeTotal + bonusAmount - deductionsTotal - prepaidExpenseAmount - retentionAmount,
            }
        }),
    [employees, shifts, salesIncomeTotals, deductionsTotals, matchingBonus, matchingPrepaidExpense,
        matchingRetention, modifyPrepaidExpenseAndReload, modifyRetentionAndReload, modifyBonusAndReload])

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

    const error = employeesError || shiftsError || bonusesError || prepaidExpensesError ||
                    retentionsError || deductionsTotalsError || salesIncomeTotalsError
    if (error) return <ErrorMessage message={`Error fetching information: ${error}`} />

    const updateError = upsertBonusError || deleteBonusError || upsertPrepaidExpenseError ||
                        deletePrepaidExpenseError || upsertRetentionError || deleteRetentionError

    const loading =
        employeesLoading ||
        shiftsLoading ||
        bonusesLoading ||
        prepaidExpensesLoading ||
        retentionsLoading ||
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

            {updateError && <ErrorMessage message={updateError} />}
            {loading
                ? <Loader/>
                : <SalaryTable data={tableData} toggleModalForBonus={setBonusForBonusModal}/>
            }
        </div>
    )
}

export default Salary