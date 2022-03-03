import { Workbook } from 'exceljs'
import { saveAs } from 'file-saver'

export default async function exportToXLSX(data: any[], columns: any[], name: string) {
    const capitalizedName = name[0].toUpperCase() + name.slice(1)
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet(capitalizedName)

    worksheet.columns = [
        { header: 'Test', key: 'test', width: 100 }
    ]

    worksheet.addRow({ test: 'asd' })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    
    saveAs(blob, `${name}.xlsx`) 
}