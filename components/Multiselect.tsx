import { Popover } from '@headlessui/react'
import React, { ReactElement } from 'react'
import { ChevronDown, ChevronUp, IconProps } from 'react-iconly'

export interface IMultiselect {
    label: string
    icon?: ReactElement<IconProps>
    items: string[]
    selectedItems?: string[]
    disabledItems?: string[]
    onSelectionChanged: (selectedItems: string[]) => void
}

const Multiselect: React.FC<IMultiselect> = ({ label, items, onSelectionChanged, icon, selectedItems = [], disabledItems = [] }: IMultiselect) => {
    const handleItemSelected = (item: string) => {
        const itemSelected = selectedItems.includes(item)
        onSelectionChanged(itemSelected ? selectedItems.filter(i => i !== item) : [...selectedItems, item])
    }

    return (
        <Popover className='relative'>
            {({ open }) => (
                <>
                    <Popover.Button>
                        <div className={`flex items-center justify-center space-x-2 p-2 rounded-lg font-body-bold 
                                         text-sm border border-table-grey text-dark-grey ${open ? 'bg-secondary-background' : ''}`}>
                            {icon}
                            <span>{label}</span>
                            {open ? <ChevronUp primaryColor='grey' /> : <ChevronDown primaryColor='grey' />}
                        </div>
                    </Popover.Button>
                    <Popover.Panel>
                        {() => (
                            <div className='flex flex-col min-w-52 items-start bg-white absolute
                                 z-0 mt-4 shadow-filter rounded-lg py-2'>
                                {items.map(item => {
                                    return (
                                        <button
                                            key={item}
                                            onClick={() => handleItemSelected(item)}
                                            className='w-full text-left hover:bg-blue hover:text-secondary-background px-4 py-1'
                                        >
                                            <input 
                                                type='checkbox' 
                                                checked={selectedItems.includes(item)} 
                                                disabled={disabledItems.includes(item)} 
                                                className='mr-1' />
                                            {item}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </Popover.Panel>
                </>
            )}
        </Popover>
    )
}

export default Multiselect