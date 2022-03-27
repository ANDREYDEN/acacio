import React, { useState } from 'react'
import { Calendar } from 'react-iconly'
import { Button, Dropdown, TextInput } from '@components/index'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { Popover } from '@headlessui/react'

interface ITimeframeDropdown {
    setDateFrom: any
    setDateTo: any
    defaultDateFrom: dayjs.Dayjs
    defaultDateTo: dayjs.Dayjs
    timeframeOptions: Record<string, dayjs.Dayjs>
}

const TimeframeDropdown: React.FC<ITimeframeDropdown> = ({ setDateFrom, setDateTo, defaultDateFrom, defaultDateTo, timeframeOptions }) => {
    const [selectedTimeframe, setSelectedTimeframe] = useState('')

    const defaultValues = {
        startDate: '',
        endDate: '',
    }
    const { register, handleSubmit, trigger, control, reset } = useForm({ defaultValues })
    register('startDate', { required: 'Enter start date' })
    register('endDate', { required: 'Enter start date' })

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
        setDateFrom(dayjs(data.startDate))
        setDateTo(dayjs(data.endDate))
        // TODO: closePopover()
    }

    const customFilter = {
        label: 'Custom timeframe',
        popoverPanel: <Popover.Panel>
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
        </Popover.Panel>
    }
    
    return (
        <Dropdown
            label='Timeframe'
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
