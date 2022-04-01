import React, { useState } from 'react'
import { Chat } from 'react-iconly'

interface IBonusInputCell {
    value: number
    onBlur: (newValue: number) => void
    toggleModal: (toggle: boolean) => void
}

const BonusInputCell: React.FC<IBonusInputCell> = ({ value, onBlur, toggleModal }) => {
    const [cellValue, setCellValue] = useState<number>(value)

    return (
        <div className='flex h-10 w-24 border border-grey rounded'>
            <input
                className='w-16 px-2 rounded text-center outline-none'
                type='number'
                value={cellValue}
                onChange={(e) => setCellValue(+e.target.value)}
                onBlur={() => onBlur(cellValue)}
            />
            <button
                className='flex-1 flex justify-center items-center h-full border-l border-grey'
                onClick={() => toggleModal(true)}
            >
                <Chat filled={true} primaryColor='#649CD3' />
            </button>
        </div>
    )
}

export default BonusInputCell