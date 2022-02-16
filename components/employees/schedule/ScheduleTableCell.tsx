import { useState } from 'react'

interface IScheduleTableCell {
  value: number
  onBlur: (newValue: number) => void
}

const ScheduleTableCell: React.FC<IScheduleTableCell> = ({ value, onBlur }) => {
  const [cellValue, setCellValue] = useState<number>(value)

  return <input 
    className='w-10 border-2'
    type="number" 
    value={cellValue} 
    onChange={(e) => setCellValue(+e.target.value)}
    onBlur={() => onBlur(cellValue)}
  />
}

export default ScheduleTableCell