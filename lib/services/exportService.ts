import { Column, Workbook } from 'exceljs'
import { saveAs } from 'file-saver'
import { capitalizeWord } from '@lib/utils'

export default async function exportToXLSX(data: any[], columns: Partial<Column>[], name: string) {
    const capitalizedName = capitalizeWord(name)
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet(capitalizedName)

    if (data.length > 0) {
        worksheet.columns = columns
    
        data.forEach(row => worksheet.addRow(row))
        worksheet.getRow(1).font = { ...worksheet.getRow(1).font, bold: true }
    }

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    
    saveAs(blob, `${name}.xlsx`)
}