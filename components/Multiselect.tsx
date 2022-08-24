import { Popover } from '@headlessui/react'
import React, { ReactElement } from 'react'
import { ChevronDown, ChevronUp, IconProps } from 'react-iconly'

export interface IMultiselect {
    label: string
    items: string[]
    onSelectionChanged: (selectedItems: string[]) => void
    icon?: ReactElement<IconProps>
    buttonClass?: string
    selectedItems?: string[]
    disabledItems?: string[]
    itemFormatter?: (item: string) => string
    canHaveEmptySelection?: boolean
}

const Multiselect: React.FC<IMultiselect> = ({ 
    label, 
    icon, 
    buttonClass, 
    items, 
    onSelectionChanged, 
    selectedItems = [], 
    disabledItems = [], 
    itemFormatter = i => i,
    canHaveEmptySelection = false
}: IMultiselect) => {
    const handleItemSelected = (item: string) => {
        if (disabledItems.includes(item)) return
        const itemSelected = selectedItems.includes(item)
        onSelectionChanged(itemSelected ? selectedItems.filter(i => i !== item) : [...selectedItems, item])
    }

    const selectAll = () => {
        onSelectionChanged([...items])
    }

    const isSomethingSelected = canHaveEmptySelection && selectedItems?.length !== 0
    const chevronColor = isSomethingSelected ? 'white' : 'grey'

    return (
        <Popover className='relative'>
            {({ open }) => (
                <>
                    <Popover.Button>
                        <div className={`flex items-center justify-center w-44 space-x-2 p-2 rounded-lg
                                 text-sm border border-grey text-dark-grey font-body-bold
                                 ${isSomethingSelected ? 'bg-blue' : (open ? 'bg-secondary-background' : '')}`}>
                            {icon}
                            <span className={`text-left ${buttonClass} ${isSomethingSelected ? 'text-white' : ''}`}>
                                {label}
                            </span>
                            {open ? <ChevronUp primaryColor={chevronColor} /> : <ChevronDown primaryColor={chevronColor} />}
                        </div>
                    </Popover.Button>
                    <Popover.Panel>
                        <div className='flex flex-col min-w-full items-start bg-white absolute right-0
                                 z-10 mt-4 shadow-filter rounded-lg py-2 max-h-96 overflow-y-scroll'>
                            <button
                                onClick={() => selectAll()}
                                className='w-full text-left hover:bg-blue hover:text-secondary-background px-4 py-1 whitespace-nowrap'
                            >
                                <span className='underline'><b>Select all</b></span>
                            </button>

                            {items.map(item => {
                                return (
                                    <button
                                        key={item}
                                        onClick={() => handleItemSelected(item)}
                                        className='w-full text-left hover:bg-blue hover:text-secondary-background px-4 py-1 whitespace-nowrap'
                                    >
                                        <input 
                                            type='checkbox' 
                                            checked={selectedItems.includes(item)} 
                                            disabled={disabledItems.includes(item)} 
                                            className='mr-1 checked:bg-blue disabled:bg-secondary-background'
                                            readOnly
                                        />
                                        {itemFormatter(item)}
                                    </button>
                                )
                            })}
                        </div>
                    </Popover.Panel>
                </>
            )}
        </Popover>
    )
}

export default Multiselect