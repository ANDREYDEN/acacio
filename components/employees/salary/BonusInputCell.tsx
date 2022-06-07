import React, { useState } from 'react'
import { Chat } from 'react-iconly'
import { IBonusInput } from '@interfaces'

interface IBonusInputCell {
    bonus: IBonusInput
    toggleModalForBonus: () => void
}

const BonusInputCell: React.FC<IBonusInputCell> = ({ bonus, toggleModalForBonus }) => {
    const [cellValue, setCellValue] = useState<number>(bonus.value?.amount ?? 0)

    return (
        <div className='flex h-10 w-24 border border-grey rounded'>
            <input
                className='w-16 px-2 rounded text-center outline-none'
                type='number'
                value={cellValue}
                onChange={(e) => setCellValue(+e.target.value)}
                onBlur={() => bonus.onAmountChange(cellValue)}
                onFocus={(e) => e.target.select()}
            />
            <button
                className={`flex-1 flex justify-center items-center h-full border-l border-grey
                    ${bonus.value.reason ? 'bg-blue' : ''}`}
                onClick={toggleModalForBonus}
            >
                <Chat filled={true} primaryColor={bonus.value.reason ? 'white' : '#649CD3'} />
            </button>
        </div>
    )
}

export default BonusInputCell