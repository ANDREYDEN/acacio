import { roundValue } from '@lib/utils'
import { Column, Workbook } from 'exceljs'
import { saveAs } from 'file-saver'

export default async function exportToXLSX(data: any[], columns: Partial<Column>[], name: string) {
    if (data.length === 0) return

    const capitalizedName = name[0].toUpperCase() + name.slice(1)
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet(capitalizedName)
    worksheet.columns = columns

    data.forEach(row => worksheet.addRow(sanitize(row)))
    worksheet.getRow(1).font = { ...worksheet.getRow(1).font, bold: true }

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    
    saveAs(blob, `${name}.xlsx`)
}

function sanitize(data: Record<string, any>) {
    const newRow: Record<string, any> = { ...data }
    for (const [key, value] of Object.entries(newRow)) {
        if (typeof value !== 'number') continue
        newRow[key] = roundValue(value)
    }
    return newRow
}