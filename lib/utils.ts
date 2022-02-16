import dayjs from 'dayjs'

export function snakeCaseToPascalCase(input: string): string {
  return input
    .split('_')
    .map(word => word[0].toUpperCase() + word.substring(1))
    .join(' ')
}

export function nextTwoWeeks() {
  let runningDay = dayjs().startOf('week')
  const dateRange: dayjs.Dayjs[] = []
  for (let i = 0; i < 14; i++) {
    dateRange.push(runningDay)
    runningDay = runningDay.add(1, 'day')
  }
  return dateRange
}