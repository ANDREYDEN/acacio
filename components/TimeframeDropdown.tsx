import React, { useState } from 'react'
import { Calendar } from 'react-iconly'
import { Button, Dropdown, TextInput } from '@components/index'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { Popover } from '@headlessui/react'
import { useTranslation } from 'next-i18next'

interface ITimeframeDropdown {
    setDateFrom: any
    setDateTo: any
    defaultDateFrom: dayjs.Dayjs
    defaultDateTo: dayjs.Dayjs
    timeframeOptions: Record<string, dayjs.Dayjs>
}

const TimeframeDropdown: React.FC<ITimeframeDropdown> = ({ setDateFrom, setDateTo, defaultDateFrom, defaultDateTo, timeframeOptions }) => {
    const [selectedTimeframe, setSelectedTimeframe] = useState('')
    const { t } = useTranslation('timeframe')

    const defaultValues = {
        startDate: '',
        endDate: '',
    }
    const { register, handleSubmit, trigger, control, reset } = useForm({ defaultValues })
    register('startDate', { required: t('start_date_required').toString() })
    register('endDate', { required: t('end_date_required').toString() })

    const timeframeFilter = () => {
        setSelectedTimeframe('')
        setDateFrom(defaultDateFrom)
        setDateTo(defaultDateTo)
    }

    const onItemSelected = (item: string) => {
        setSelectedTimeframe(item)
        setDateFrom(timeframeOptions[item])
        setDateTo(dayjs())
    }

    const handleCustomTimeframe = async (data: any) => {
        const dateFrom = dayjs(data.startDate)
        const dateTo = dayjs(data.endDate)

        setDateFrom(dateFrom)
        setDateTo(dateTo)
        setSelectedTimeframe(`${dateFrom.format('DD/MM/YYYY')}-${dateTo.format('DD/MM/YYYY')}`)
    }

    const customFilter = {
        label: t('custom_timeframe'),
        popoverPanel: <Popover.Panel>
            {({ close }) => (
                <form className='flex flex-col items-center bg-white absolute left-64 top-0 z-0 shadow-filter rounded-lg p-6 space-y-6'>
                    <TextInput
                        type='date'
                        name='startDate'
                        label={t('start_date')}
                        control={control}
                        trigger={trigger}
                        textInputClass='w-full'
                    />
                    <TextInput
                        type='date'
                        name='endDate'
                        label={t('end_date')}
                        control={control}
                        trigger={trigger}
                        textInputClass='w-full'
                    />
                    <div className='flex w-full space-x-4'>
                        <Button
                            label={t('clear', { ns: 'common' })}
                            variant='secondary'
                            buttonClass='w-full'
                            onClick={() => reset(defaultValues)}
                        />
                        <Button
                            label={t('done', { ns: 'common' })}
                            buttonClass='w-full'
                            onClick={() => {
                                handleSubmit(handleCustomTimeframe)()
                                close()
                            }}
                        />
                    </div>
                </form>
            )}
        </Popover.Panel>
    }
    
    return (
        <Dropdown
            label={t('label')}
            items={Object.keys(timeframeOptions)}
            onItemSelected={onItemSelected}
            icon={<Calendar primaryColor={selectedTimeframe ? 'white' : 'grey'} />}
            filter={timeframeFilter}
            selectedOption={selectedTimeframe}
            customFilter={customFilter}
        />
    )
}

export default TimeframeDropdown
