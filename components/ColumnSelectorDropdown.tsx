import { Dropdown } from '@components/index'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { Document } from 'react-iconly'

interface IColumnSelectorDropdown {
  columns: string[]
}

const ColumnSelectorDropdown: React.FC<IColumnSelectorDropdown> = ({ columns }) => {
    const { t } = useTranslation()

    const [selectedColumn, setSelectedColumn] = useState('')
    
    const onItemSelected = (item: string) => {
        setSelectedColumn(item)
    }
    
    return (
        <Dropdown
            label={t('display')}
            items={columns}
            onItemSelected={onItemSelected}
            icon={<Document primaryColor={selectedColumn ? 'white' : 'grey'} />}
            selectedOption={selectedColumn}
        />
    )
}

export default ColumnSelectorDropdown
