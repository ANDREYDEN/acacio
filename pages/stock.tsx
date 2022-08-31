import {
    Button,
    ConfirmationModal,
    Dropdown,
    ErrorMessage,
    Loader,
    Multiselect,
    SearchBar,
    StockTable,
    TimeframeDropdown
} from '@components'
import { StockTableRow } from '@interfaces'
import { posterGetIngredientMovement } from '@lib/services/poster'
import { capitalizeWord, enforceAuthenticated } from '@lib/utils'
import { IDropdownItem } from '@interfaces'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useCallback, useMemo, useState } from 'react'
import { Document, Filter2 } from 'react-iconly'
import useSWR from 'swr'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import exportToXLSX from '@lib/services/exportService'
import { Column } from 'exceljs'
import SupplyModal from '@components/SupplyModal'
dayjs.extend(weekday)

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['stock', 'common', 'timeframe']),
    }
}))

const Stock: NextPage = () => {
    const defaultDateFrom = dayjs().subtract(2, 'week').weekday(4)
    const defaultDateTo = dayjs().weekday(0)
    const [selectedTimeframe, setSelectedTimeframe] = useState('')
    const [dateFrom, setDateFrom] = useState(defaultDateFrom)
    const [dateTo, setDateTo] = useState(defaultDateTo)
    const [searchValue, setSearchValue] = useState('')
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [supplierFilter, setSupplierFilter] = useState<IDropdownItem | undefined>(undefined)
    const [showSupplyModal, setShowSupplyModal] = useState(false)
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const { t } = useTranslation('stock')
    const { t: timeframeTranslation } = useTranslation('timeframe')

    const timeframeOptions: IDropdownItem[] = [
        { label: timeframeTranslation('1_week'), value: dayjs().subtract(1, 'week') },
        { label: timeframeTranslation('1_and_half_weeks'), value: dayjs().subtract(7, 'day') },
        { label: timeframeTranslation('2_weeks'), value: dayjs().subtract(2, 'week') },
        { label: timeframeTranslation('1_month'), value: dayjs().subtract(1, 'month') },
    ]

    const handleSuppliersUpdateSuccess = () => {
        setShowSupplyModal(false)
        setShowConfirmationModal(true)
    }

    const { data: rows, error } = useSWR(
        ['getIngredients', dateFrom.format('YYYYMMDD'), dateTo.format('YYYYMMDD')],
        () => posterGetIngredientMovement(dateFrom, dateTo)
    )
    const loading = !rows

    const [orders, setOrders] = useState<Record<string, number>>({}) // TODO: use this to persist orders

    const tableData: StockTableRow[] = (rows ?? [])
        .map(row => ({
            ...row,
            toOrder: {
                id: row.ingredientId,
                initialValue: orders[row.ingredientId] ?? row.toOrder.initialValue,
                onChange: (newValue: number) => {
                    setOrders({ ...orders, [row.ingredientId]: newValue })
                }
            }
        }))
        .filter(row => row.ingredientName.toLowerCase().includes(searchValue.toLowerCase()))
        .filter(row => {
            return selectedCategories.length === 0 ? true : selectedCategories.some(category => {
                return row.category.toLowerCase() === category.toLowerCase()
            })
        })
        .filter(row => row.supplier.toLowerCase().includes(supplierFilter?.label.toLowerCase() ?? ''))

    const categoriesList = useMemo(
        () => rows?.map(row => row.category).filter(category => category !== '-') ?? [],
        [rows]
    )

    const categoryOptions: string[] = categoriesList
        .filter((item, index) => categoriesList.indexOf(item) === index)

    const suppliersList = useMemo(
        () => tableData.map(td => td.supplier).filter(supplier => supplier !== '-'),
        [tableData]
    )
    const supplierOptions: IDropdownItem[] = suppliersList
        .filter((item, index) => suppliersList.indexOf(item) === index)
        .map(supplier => ({ label: capitalizeWord(supplier), value: supplier }))

    const columnSelectorOptions: (keyof StockTableRow)[] = useMemo(() => [
        'ingredientName',
        'category',
        'supplier',
        'initialBalance',
        'initialAvgCost',
        'sold',
        'soldCost',
        'writeOff',
        'writeOffCost',
        'lastSupply',
        'finalBalance',
        'finalBalanceCost',
        'finalAverageCost',
        'reorder',
        'toOrder',
        'totalCost',
    ], [])

    const defaultColumns: (keyof StockTableRow)[] = [
        'ingredientName',
        'category',
        'supplier',
        'toOrder',
        'totalCost'
    ]

    const [selectedColumns, setSelectedColumns] = useState<string[]>(columnSelectorOptions)

    const toLabel = useCallback((accessor: string) => t(`table_headers.${accessor}`).toString(), [t])
    const fromLabel = useCallback(
        (label: string) => columnSelectorOptions.find(c => label === toLabel(c)) ?? label,
        [columnSelectorOptions, toLabel]
    )

    const handleSelectionChanged = (items: string[]) => {
        setSelectedColumns(items.map(fromLabel))
    }

    const handleExport = () => {
        const exportData = tableData.map(row => ({
            ...row,
            toOrder: orders[row.ingredientId] ?? row.toOrder.initialValue
        }))

        const columnWidths: Record<string, number> = {
            ingredientName: 20,
            category: 10,
            supplier: 10,
            initialBalance: 10,
            initialAvgCost: 20,
            sold: 10,
            soldCost: 10,
            writeOff: 10,
            writeOffCost: 15,
            lastSupply: 15,
            finalBalance: 10,
            finalBalanceCost: 15,
            finalAverageCost: 20,
            reorder: 10,
            toOrder: 10,
            totalCost: 15,
        }

        const columns: Partial<Column>[] = selectedColumns.map(accessor => ({
            key: accessor,
            header: t(`table_headers.${accessor}`).toString(),
            width: columnWidths[accessor]
        }))

        exportToXLSX(exportData, columns, `Stock ${dateFrom.format('DD MMM')} - ${dateTo.format('DD MMM')}`)
    }

    return (
        <div className='flex flex-col'>
            {showSupplyModal &&
                <SupplyModal
                    toggleModal={setShowSupplyModal}
                    onSuccess={handleSuppliersUpdateSuccess}
                />
            }
            {showConfirmationModal &&
                <ConfirmationModal
                    header={t('confirmation_modal.header')}
                    toggleModal={setShowConfirmationModal}
                    message={t('confirmation_modal.message')}
                />
            }

            <div className='w-full flex justify-between items-center mb-6'>
                <h3>{t('header')}</h3>
                <Button
                    label={t('export', { ns: 'common' })}
                    variant='secondary'
                    buttonClass='w-56'
                    onClick={handleExport}
                />
            </div>
            {error
                ? <ErrorMessage message={error} errorMessageClass='max-h-32 mt-6 flex flex-col justify-center' />
                : loading
                    ? <Loader />
                    : <>
                        <div className='w-full flex justify-between mb-6'>
                            <div className='flex flex-wrap mr-4 gap-4'>
                                <SearchBar searchValue={searchValue} onValueChange={setSearchValue} />
                                <TimeframeDropdown
                                    setDateFrom={setDateFrom}
                                    setDateTo={setDateTo}
                                    defaultDateFrom={defaultDateFrom}
                                    defaultDateTo={defaultDateTo}
                                    timeframeOptions={timeframeOptions}
                                    defaultTimeframe={timeframeTranslation('1_and_half_weeks')}
                                    selectedTimeframe={selectedTimeframe}
                                    setSelectedTimeframe={setSelectedTimeframe}
                                />
                                <Multiselect
                                    label={t('category_label')}
                                    icon={<Filter2 primaryColor={selectedCategories.length !== 0 ? 'white' : '#B3B3B3'} />}
                                    canHaveEmptySelection={true}
                                    items={categoryOptions}
                                    onSelectionChanged={setSelectedCategories}
                                    selectedItems={selectedCategories}
                                />
                                <Dropdown
                                    label={t('supplier_label')}
                                    items={supplierOptions}
                                    onItemSelected={setSupplierFilter}
                                    icon={<Filter2 primaryColor={supplierFilter ? 'white' : '#B3B3B3'} />}
                                    withClearFilter={true}
                                    selectedOption={supplierFilter?.label}
                                />
                                <Button
                                    label={t('suppliers_refresh')}
                                    onClick={() => setShowSupplyModal(true)}
                                />
                            </div>
                            <Multiselect
                                label={t('display', { ns: 'common' })}
                                icon={<Document primaryColor='#B3B3B3' />}
                                buttonClass='w-32'
                                items={columnSelectorOptions}
                                selectedItems={selectedColumns}
                                disabledItems={defaultColumns}
                                onSelectionChanged={handleSelectionChanged}
                                itemFormatter={toLabel}
                            />
                        </div>
                        <StockTable selectedColumns={selectedColumns} data={tableData} />
                    </>
            }
        </div>
    )
}

export default Stock
