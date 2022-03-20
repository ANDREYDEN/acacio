import Table from '@components/Table'
import { SalesTableRow } from '@interfaces'
import { useTranslation } from 'next-i18next'
import React, { useMemo } from 'react'
import { Column } from 'react-table'

interface ISalesTable {
    data: SalesTableRow[]
}

const SalesTable: React.FC<ISalesTable> = ({ data }: ISalesTable) => {
    const { t } = useTranslation('sales')

    const columns: Column<SalesTableRow>[] = useMemo(
        () => [
            {
                Header: <h6>{t('table_headers.date').toString()}</h6>,
                accessor: 'date',
            },
            {
                Header: <h6>{t('table_headers.dayOfWeek').toString()}</h6>,
                accessor: 'dayOfWeek',
            },
            {
                Header: <h6>{t('table_headers.customers').toString()}</h6>,
                accessor: 'customers',
            },
        ],
        [t]
    )

    return <Table columns={columns} data={data} tableSpacing='px-8' />
}

export default SalesTable