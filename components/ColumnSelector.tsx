import { Dropdown, Multiselect } from '@components/index'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { Document } from 'react-iconly'

interface IColumnSelectorDropdown {
  columns: string[]
}

const ColumnSelector: React.FC<IColumnSelectorDropdown> = ({ columns }) => {
    const { t } = useTranslation()

    const [selectedColumns, setSelectedColumns] = useState<string[]>([])
    
    const onItemSelected = (items: string[]) => {
        setSelectedColumns(items)
    }
    
    return (
        <Multiselect
            label={t('display')}
            items={columns}
            onSelectionChanged={onItemSelected}
            icon={<Document primaryColor='grey' />}
            selectedItems={selectedColumns}
        />
    )
}

export default ColumnSelector
