import { Multiselect } from '@components/index'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { Document } from 'react-iconly'

interface IColumnSelectorDropdown {
  columns: string[]
  defaultColumns: string[]
  onSelectionChanged: (items: string[]) => void
  toLabel: (accessor: string) => string
}

const ColumnSelector: React.FC<IColumnSelectorDropdown> = ({
    columns,
    defaultColumns,
    onSelectionChanged,
    toLabel 
}) => {
    const { t } = useTranslation()
    const [selectedColumns, setSelectedColumns] = useState<string[]>(columns)
    
    const fromLabel = (label: string) => columns.find(c => label === toLabel(c)) ?? label

    const handleSelectionChanged = (items: string[]) => {
        setSelectedColumns(items.map(fromLabel))
        onSelectionChanged(items.map(fromLabel))
    }
    
    return (
        <Multiselect
            label={t('display')}
            icon={<Document primaryColor='grey' />}
            buttonClass='w-32'
            items={columns.map(toLabel)}
            selectedItems={selectedColumns.map(toLabel)}
            disabledItems={defaultColumns.map(toLabel)}
            onSelectionChanged={handleSelectionChanged}
        />
    )
}

export default ColumnSelector
