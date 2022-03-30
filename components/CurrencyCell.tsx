import { roundValue } from '@lib/utils'
import React from 'react'

interface ICurrencyCell {
  value: number
}

const CurrencyCell: React.FC<ICurrencyCell> = ({ value }) => {
    return <span>
        {roundValue(value).toLocaleString('ru-UA', { style: 'currency', currency: 'UAH' }).slice(0, -5)}
    </span>
}

export default CurrencyCell