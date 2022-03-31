import { 
    Waste, 
    EmployeesMonthlyStatDto, 
    Ingredient, 
    IngredientCategory, 
    IngredientMovementVM, 
    SalesData, 
    SalesPerDay, 
    StockTableRow, 
    Supply, 
    SupplyIngredient, 
    WriteOff, 
    WriteOffIngredient 
} from '@interfaces'
import { definitions } from '@types'
import axios from 'axios'
import dayjs from 'dayjs'
import useSWR from 'swr'

export const posterInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_POSTER_URL,
    params: {
        token: process.env.NEXT_POSTER_ACCESS_TOKEN ?? ''
    }
})

async function posterGet(url: string, params?: Record<string, any>) {
    const response = await axios.get(`/api/poster/${url}`, { params: params ?? {} })
    if (response.status === 400) {
        throw response.data.message
    }
    return response.data
}

export function usePosterGetDeductionsForEmployees(employees: definitions['employees'][]) {
    const { data: wastes, error } = useSWR<Waste[]>('storage.getWastes', posterGet)

    const deductionsTotalsError = error?.toString()

    if (!wastes) {
        return { 
            deductionsTotals: {} as EmployeesMonthlyStatDto, 
            deductionsTotalsLoading: !deductionsTotalsError, 
            deductionsTotalsError 
        }
    }

    const deductionsTotals: EmployeesMonthlyStatDto = wastes.reduce((acc: EmployeesMonthlyStatDto, deduction) => {
        const employee = employees.find(employee => 
            deduction.reason_name.toLowerCase().includes(employee.first_name.toLowerCase()) || 
            deduction.reason_name.toLowerCase().includes(employee.last_name?.toLowerCase() ?? ''))
        if (!employee) return acc
        
        return {
            ...acc,
            [employee.id]: (acc[employee.id] ?? 0) + (+deduction.total_sum / 100),
        }
    }, {})

    return { 
        deductionsTotals, 
        deductionsTotalsLoading: !deductionsTotalsError && !deductionsTotals, 
        deductionsTotalsError
    }
}

export function usePosterGetSalesIncomeForEmployees(
    employees: definitions['employees'][], 
    shifts: definitions['shifts'][]
) {
    const { data: sales, error } = useSWR<SalesData>('dash.getAnalytics', posterGet)

    const salesIncomeTotalsError = error?.toString()

    if (!sales) {
        return { 
            salesIncomeTotals: {} as EmployeesMonthlyStatDto, 
            salesIncomeTotalsLoading: !salesIncomeTotalsError, 
            salesIncomeTotalsError 
        }
    }

    const salesIncomeTotals: EmployeesMonthlyStatDto = {}

    for (const employee of employees) {
        salesIncomeTotals[employee.id] = sales.data
            .reduce(
                (total, dateSales, date) => {
                    const currentDay = dayjs().set('date', date + 1)
                    
                    const workHours = shifts
                        .find(shift => employee.id === shift.employee_id && dayjs(shift.date).isSame(currentDay, 'date'))
                        ?.duration ?? 0
                    return total + workHours * (employee.income_percentage / 100) * (+dateSales)
                }, 
                0
            )
    }

    return { 
        salesIncomeTotals, 
        salesIncomeTotalsLoading: !salesIncomeTotalsError && !salesIncomeTotals, 
        salesIncomeTotalsError
    }
}

export async function posterGetSales(dateFrom: dayjs.Dayjs, dateTo: dayjs.Dayjs, weekDay?: number) {
    const salesFinal: SalesPerDay[] = []
    const numberOfDays = dateTo.diff(dateFrom, 'day')

    await Promise.all([...Array(numberOfDays)].map((_, i) => {
        return (async () => {
            const currentDate = dateFrom.add(i, 'day')

            if (weekDay !== undefined && weekDay !== currentDate.day()) {
                return
            }

            const sales = await getSalesForDay(currentDate)
            const salesWorkshops = await getSalesForDay(currentDate, 'workshops')

            const kitchenSales = salesWorkshops.find((sw: any) => sw.workshop_name.toLowerCase().trim() === 'кухня')
            const barSales = salesWorkshops.find((sw: any) => sw.workshop_name.toLowerCase().trim() === 'бар')

            salesFinal.push({
                date: currentDate,
                dayOfWeek: currentDate,
                customers: sales.counters.visitors,
                averageBill: sales.counters.average_receipt,
                kitchenRevenue: kitchenSales?.revenue ?? 0,
                kitchenProfit: kitchenSales?.prod_profit ?? 0,
                barRevenue: barSales?.revenue ?? 0,
                barProfit: barSales?.prod_profit ?? 0,
                totalRevenue: sales.counters.revenue,
                totalProfit: sales.counters.profit
            })
        })()
    }))
    salesFinal.sort((s1, s2) => s1.date.diff(s2.date))

    return salesFinal
}

async function getSalesForDay(day: dayjs.Dayjs, type?: string) {
    const sales = await posterGet(
        'dash.getAnalytics',
        {
            dateFrom: day.format('YYYYMMDD'),
            dateTo: day.format('YYYYMMDD'),
            type
        }
    )

    return sales
}

export async function posterGetIngredientMovement(
    dateFrom: dayjs.Dayjs, 
    dateTo: dayjs.Dayjs
): Promise<StockTableRow[]> {
    const params = {
        dateFrom: dateFrom.format('YYYYMMDD'),
        dateTo: dateTo.format('YYYYMMDD'),
    }

    const ingredientMovements: IngredientMovementVM[] = await posterGet('storage.getReportMovement', params)
    const categories: IngredientCategory[] = await posterGet('menu.getCategoriesIngredients')
    const ingredients: Ingredient[] = await posterGet('menu.getIngredients')

    await addLastSupplyInfo(params, ingredients)
    const writeOffs = await getIngredientWriteOffs(params)

    return (ingredientMovements ?? []).map(ingredientMovement => {
        // TODO: optimize
        const ingredient = ingredients.find(i => i.ingredient_id === +ingredientMovement.ingredient_id)
        const category = categories.find(c => +c.category_id === ingredient?.category_id)

        const ingredientWriteOffs = writeOffs.filter(wo => wo.ingredient_id === ingredientMovement.ingredient_id)
        const writeOff = ingredientWriteOffs.reduce((acc, writeOff) => acc + writeOff.weight, 0)
        const writeOffCost = ingredientWriteOffs.reduce((acc, writeOff) => acc + +writeOff.cost, 0) / 100
        const sold = ingredientMovement.write_offs // TODO: doublecheck as this might also include wastes
        const finalBalance = ingredientMovement.end
        const reorder = Math.max(0, sold + writeOff - finalBalance)

        return {
            ingredientId: ingredientMovement.ingredient_id,
            ingredientName: ingredientMovement.ingredient_name,
            category: category?.name ?? '-',
            supplier: ingredient?.supplier ?? '-',
            initialBalance: ingredientMovement.start.toString(),
            initialAvgCost: ingredientMovement.cost_start,
            sold: sold.toString(),
            soldCost: 0, // TODO
            writeOff: writeOff.toString() ?? '',
            writeOffCost,
            lastSupply: ingredient?.last_supply ?? '',
            finalBalance: finalBalance.toString(),
            finalAverageCost: ingredientMovement.cost_end,
            finalBalanceCost: 0, // TODO: ask client if this is the same as totalCost
            reorder: reorder.toString(),
            toOrder: {
                initialValue: reorder,
                onChange: () => {} // gets reassigned later
            }, 
            totalCost: finalBalance * ingredientMovement.cost_end,
        }
    })
}

async function addLastSupplyInfo(params: { dateFrom: string; dateTo: string }, ingredients: Ingredient[]) {
    const supplies: Supply[] = await posterGet('storage.getSupplies', params)

    await Promise.all(supplies.map(async (supply) => {
        try {
            const supplyIngredients: SupplyIngredient[] = await posterGet(
                'storage.getSupplyIngredients',
                { supply_id: supply.supply_id }
            )
            if (supplyIngredients.length === 0)
                return

            const lastSupply = supplyIngredients[0]
            const ingredientId = lastSupply.ingredient_id
            const ingredient = ingredients.find(i => i.ingredient_id === ingredientId)
            if (!ingredient)
                return

            ingredient.supplier = supply.supplier_name
            ingredient.last_supply = lastSupply.supply_ingredient_num.toString()
        } catch (e: any) {
            console.error(`Failed to fetch supply ingredients for supply ${supply.supply_id}`)
        }
    }))
}

async function getIngredientWriteOffs(params: { dateFrom: string; dateTo: string }) {
    const wastes: Waste[] = await posterGet('storage.getWastes', params)
    const writeOffs: WriteOffIngredient[] = []
    await Promise.all(wastes.map(async (waste) => {
        const writeOff: WriteOff = await posterGet('storage.getWaste', { waste_id: waste.waste_id })
        for (const element of writeOff.elements) {
            for (const ingredient of element.ingredients) {
                writeOffs.push(ingredient)
            }
        }
    }))
    return writeOffs
}
