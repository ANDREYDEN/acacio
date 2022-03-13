import React, { useState } from 'react'

interface INumberInputCell {
  value: number
  onBlur: (newValue: number) => void
}

const NumberInputCell: React.FC<INumberInputCell> = ({ value, onBlur }) => {
    const [cellValue, setCellValue] = useState<number>(value)

    return <input 
        className='w-6 h-10 text-center border border-table-grey rounded'
        type='number'
        value={cellValue} 
        onChange={(e) => setCellValue(+e.target.value)}
        onBlur={() => onBlur(cellValue)}
    />
}

export default NumberInputCell