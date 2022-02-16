import dayjs from 'dayjs'

export function snakeCaseToPascalCase(input: string): string {
  return input
    .split('_')
    .map(word => word[0].toUpperCase() + word.substring(1))
    .join(' ')
}

/**
 * Returns a list of days in a month
 * @param month a dayjs date representing the current month
 * @returns a list of dayjs dates - days in the provided month
 */
export function getMonthDays(month: dayjs.Dayjs): dayjs.Dayjs[] {
  const dateRange = []
  for (let date = 1; date <= month.daysInMonth(); date++) {
    dateRange.push(month.date(date))
  }
  return dateRange
}