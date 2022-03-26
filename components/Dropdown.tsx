import React, { ReactElement } from 'react'
import { Popover } from '@headlessui/react'
import { ChevronDown, ChevronUp, IconProps } from 'react-iconly'

export interface IDropdown {
    label: string
    items: string[]
    onItemSelected: (item: string) => void
    icon?: ReactElement<IconProps>
    filter?: () => void,
    selectedOption?: string
}

const Dropdown: React.FC<IDropdown> = ({ label, items, onItemSelected, icon, filter, selectedOption }: IDropdown) => {
    const chevronColor = selectedOption ? 'white' : 'grey'

    return (
        <Popover className='relative'>
            {({ open }) => (
                <>
                    <Popover.Button>
                        <div className={`flex items-center justify-center space-x-2 p-2 rounded-lg font-body-bold text-sm
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
                                left-0 z-0 mt-4 shadow-filter rounded-lg py-2'>
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
                                            key={item}
                                            onClick={() => {
                                                onItemSelected(item)
                                                close()
                                            }}
                                            className={`w-full text-left hover:bg-blue hover:text-secondary-background
                                            ${item === selectedOption && 'bg-blue text-white'} px-4 py-1`}
                                        >
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

export default Dropdown