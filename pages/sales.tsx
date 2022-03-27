import React, { useMemo, useState } from 'react'
import { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import useSWR from 'swr'
import { Calendar } from 'react-iconly'
import { posterGetSales } from '@services/poster'
import { SalesPerDay } from '@interfaces'
import { Button, Dropdown, ErrorMessage, Loader, SalesTable, TextInput } from '@components'
import { enforceAuthenticated } from '@lib/utils'
import { useMounted } from '@lib/hooks'
import { Popover } from '@headlessui/react'
import { useForm } from 'react-hook-form'

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['sales']),
    },
}))

const TimeframeOptions: Record<string, dayjs.Dayjs> = {
    'Last Day': dayjs().subtract(1, 'day'),
    'Last 7 days': dayjs().subtract(7, 'day'),
    'Last 14 days': dayjs().subtract(14, 'day'),
    'Last 30 days': dayjs().subtract(30, 'day'),
    'Last quarter': dayjs().subtract(3, 'month')
}

const Sales: NextPage = () => {
    const defaultDateFrom = dayjs().subtract(7, 'day')
    const defaultDateTo = dayjs()
    const { mounted } = useMounted()
    const [dateFrom, setDateFrom] = useState(defaultDateFrom)
    const [dateTo, setDateTo] = useState(defaultDateTo)
    const [selectedTimeframe, setSelectedTimeframe] = useState('')
    const { t } = useTranslation('sales')

    const { data: sales, error } = useSWR(['getSales', dateFrom, dateTo], () => posterGetSales(dateFrom, dateTo))
    const loading = !sales

    const tableData: SalesPerDay[] = useMemo(() =>
        (sales ?? []).map((salePerDay) => {
            const row = {
                date: salePerDay.date,
                dayOfWeek: salePerDay.dayOfWeek,
                customers: salePerDay.customers,
                averageBill: salePerDay.averageBill,
                kitchenRevenue: salePerDay.kitchenRevenue,
                kitchenProfit: salePerDay.kitchenProfit,
                barRevenue: salePerDay.barRevenue,
                barProfit: salePerDay.barProfit,
                totalRevenue: salePerDay.totalRevenue,
                totalProfit: salePerDay.totalProfit,
            }

            return row
        }),
    [sales]
    )

    const timeframeFilter = () => {
        setSelectedTimeframe('')
        setDateFrom(defaultDateFrom)
        setDateTo(defaultDateTo)
    }

    const onItemSelected = (item: string) => {
        setSelectedTimeframe(item)
        setDateFrom(TimeframeOptions[item])
        setDateTo(dayjs())
    }

    const defaultValues = {
        startDate: '',
        endDate: '',
    }
    const { register, handleSubmit, trigger, control, reset } = useForm({ defaultValues })
    register('startDate', { required: 'Enter start date' })
    register('endDate', { required: 'Enter start date' })
    const handleCustomTimeframe = async (data: any) => {
        setDateFrom(dayjs(data.startDate))
        setDateTo(dayjs(data.endDate))
        // TODO: closePopover()
    }

    const customFilter = { label: 'Custom timeframe', popoverPanel: <Popover.Panel>
        {({ close }) => (
            <form
                className='flex flex-col items-center bg-white absolute left-56 top-0 z-0 shadow-filter rounded-lg p-6 space-y-6'
                onSubmit={handleSubmit(handleCustomTimeframe)}
            >
                <TextInput
                    type='date'
                    name='startDate'
                    label='Start Date'
                    control={control}
                    trigger={trigger}
                />
                <TextInput
                    type='date'
                    name='endDate'
                    label='End Date'
                    control={control}
                    trigger={trigger}
                />
                <div className='flex w-full space-x-4'>
                    <Button label='Clear' variant='secondary' buttonClass='w-full' onClick={() => reset(defaultValues)} />
                    <Button label='Done' buttonClass='w-full' />
                </div>
            </form>
        )}
    </Popover.Panel> }

    if (!mounted) {
        return <Loader />
    }

    return (
        <div className='flex flex-col'>
            <div className='w-full flex items-center mb-6'>
                <h3>{t('header').toString()}</h3>
            </div>
            <div className='w-full flex items-center mb-6'>
                <Dropdown
                    label='Timeframe'
                    items={Object.keys(TimeframeOptions)}
                    onItemSelected={onItemSelected}
                    icon={<Calendar primaryColor={selectedTimeframe ? 'white' : 'grey'} />}
                    filter={timeframeFilter}
                    selectedOption={selectedTimeframe}
                    customFilter={customFilter}
                />
            </div>

            {error
                ? <ErrorMessage message={`Error fetching sales: ${error}`} errorMessageClass='mb-8 w-full' />
                : loading ? <Loader /> : <SalesTable data={tableData} />
            }
        </div>
    )
}

export default Sales