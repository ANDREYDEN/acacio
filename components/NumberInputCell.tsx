import React, { useState } from 'react'

interface INumberInputCell {
  value: number
  onBlur: (newValue: number) => void
  additionalStyle?: string
}

const NumberInputCell: React.FC<INumberInputCell> = ({ value, onBlur, additionalStyle = 'w-6' }) => {
    const [cellValue, setCellValue] = useState<number>(value)

    return <input
        className={`${additionalStyle} h-10 text-center border border-grey rounded`}
        type='number'
        value={cellValue}
        onChange={(e) => setCellValue(+e.target.value)}
        onBlur={() => onBlur(cellValue)}
        onFocus={(e) => e.target.select()}
    />
}

export default NumberInputCell
