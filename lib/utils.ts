import dayjs from 'dayjs'

export function snakeCaseToPascalCase(input: string): string {
  return input
    .split('_')
    .map(word => word[0].toUpperCase() + word.substring(1))
    .join(' ')
}

export function getMonthDays(month: number): dayjs.Dayjs[] {
  const currentMonth = dayjs().month(month).startOf('month')
  const dateRange = []
  for (let date = 1; date <= currentMonth.daysInMonth(); date++) {
    dateRange.push(currentMonth.date(date))
  }
  return dateRange
}