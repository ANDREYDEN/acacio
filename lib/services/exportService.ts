import { Column, Workbook } from 'exceljs'
import { saveAs } from 'file-saver'

export default async function exportToXLSX(data: any[], columns: Partial<Column>[], name: string) {
    const capitalizedName = name[0].toUpperCase() + name.slice(1)
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet(capitalizedName)

    if (data.length > 0) {
        worksheet.columns = columns
    
        data.forEach(row => worksheet.addRow(row))
    }

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    
    saveAs(blob, `${name}.xlsx`)
}