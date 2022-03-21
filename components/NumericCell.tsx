import React from 'react'

interface INumericCell {
  value: number
}

const NumericCell: React.FC<INumericCell> = ({ value }) => {
    return <span>
        {value.toLocaleString('ru-UA', { style: 'currency', currency: 'UAH' }).slice(0, -5)}
    </span>
}

export default NumericCell