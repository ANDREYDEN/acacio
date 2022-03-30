import { roundValue } from '@lib/utils'
import React from 'react'

interface INumberCell {
  value: number
}

const NumberCell: React.FC<INumberCell> = ({ value }) => {
    return <span>{roundValue(value)}</span>
}

export default NumberCell