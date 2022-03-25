import React, { ReactElement } from 'react'
import { Popover } from '@headlessui/react'
import { ChevronDown, ChevronUp, IconProps } from 'react-iconly'
import { IDropdownItem } from '@interfaces'

export interface IDropdown {
    label: string
    items: IDropdownItem[]
    icon?: ReactElement<IconProps>
    filter?: () => void,
    selectedOption?: string
}

const Dropdown: React.FC<IDropdown> = ({ label, items, icon, filter, selectedOption }: IDropdown) => {
    const chevronColor = selectedOption ? 'white' : 'grey'

    return (
        <Popover className='relative'>
            {({ open }) => (
                <>
                    <Popover.Button>
                        <div className={`flex items-center justify-center space-x-2 p-2 rounded-lg font-body-bold text-sm w-36
                                ${open ? 'bg-secondary-background' : ''}
                                ${selectedOption ? 'bg-blue text-white' : 'border border-table-grey text-dark-grey'}`}>
                            {icon}
                            <span>{selectedOption ? selectedOption : label}</span>
                            {open ? <ChevronUp primaryColor={chevronColor} /> : <ChevronDown primaryColor={chevronColor} />}
                        </div>
                    </Popover.Button>
                    <Popover.Panel>
                        {({ close }) => (
                            <div className='flex flex-col w-44 items-start bg-white absolute
                                space-y-2 left-0 z-0 mt-4 shadow-filter rounded-lg py-2'>
                                {filter &&
                                    <button
                                        onClick={() => {
                                            filter()
                                            close()
                                        }}
                                        className='underline mb-2 px-4 w-full text-left hover:bg-blue hover:text-secondary-background'
                                    >
                                        Clear filter
                                    </button>
                                }

                                {items.map(item => {
                                    return (
                                        <button
                                            key={item.label}
                                            onClick={() => {
                                                item.action()
                                                close()
                                            }}
                                            className={`w-full text-left px-4 hover:bg-blue hover:text-secondary-background
                                            ${item.selected && 'bg-blue text-white'}`}
                                        >
                                            {item.label}
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

export default Dropdown