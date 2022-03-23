import React, { ReactElement } from 'react'
import { Popover } from '@headlessui/react'
import { ChevronDown, ChevronUp, IconProps } from 'react-iconly'
import { IDropdownItem } from '@interfaces'

export interface IDropdown {
    label: string
    items: IDropdownItem[]
    icon?: ReactElement<IconProps>
    filter?: () => void
}

const Dropdown: React.FC<IDropdown> = ({ label, items, icon, filter }: IDropdown) => {
    return (
        <Popover className='relative'>
            {({ open }) => (
                <>
                    <Popover.Button>
                        <div className={`flex items-center space-x-2 p-2 border border-table-grey rounded-lg
                                ${open ? 'bg-secondary-background' : ''}`}>
                            {icon}
                            <p className='text-dark-grey font-body-bold text-sm'>{label}</p>
                            {open ? <ChevronUp primaryColor='grey' /> : <ChevronDown primaryColor='grey' />}
                        </div>
                    </Popover.Button>
                    <Popover.Panel>
                        <div className='flex flex-col w-44 items-start bg-white absolute
                                space-y-2 left-0 z-0 mt-4 shadow-filter rounded-lg py-2'>
                            {filter &&
                        <button
                            onClick={filter}
                            className='underline mb-2 px-4 w-full text-left hover:bg-blue hover:text-secondary-background'
                        >
                            Clear filter
                        </button>
                            }

                            {items.map(item => {
                                return (
                                    <button
                                        key={item.label}
                                        onClick={item.action}
                                        className={`w-full text-left px-4 hover:bg-blue hover:text-secondary-background
                                            ${item.selected && 'bg-blue text-white'}`}
                                    >
                                        {item.label}
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

export default Dropdown