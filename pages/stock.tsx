import { NextPage } from 'next'
import React, { useMemo } from 'react'
import { posterInstance } from '@services/poster'
import { enforceAuthenticated } from '@lib/utils'
import { Ingredient } from '@lib/posterTypes'
import ErrorMessage from '@components/ErrorMessage'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import StockTable from '@components/StockTable'

export const getServerSideProps = enforceAuthenticated(async (context: any) => {
    try {
        const { data } = await posterInstance.get('storage.getReportMovement')
        if (data.error) throw data.error
        const ingredients = data.response
        return {
            props: {
                ingredients,
                ...await serverSideTranslations(context.locale, ['stock', 'common']),
            }
        }
    } catch(e: any) {
        return { 
            props:
            {
                ingredients: [],
                error: e.message,
                ...await serverSideTranslations(context.locale, ['stock', 'common']),
            }
        }
    }  
})

type StockProps = {
  ingredients: Ingredient[],
  error: string | null
}

const Stock: NextPage<StockProps> = ({ ingredients, error }) => {
    const { t } = useTranslation('stock')

    const data = useMemo(
        () => ingredients, 
        [ingredients]
    )

    return (
        <div className='flex flex-col'>
            <h3 className='mb-8'>{t('header').toString()}</h3>
            {error && <ErrorMessage message={error} errorMessageClass='max-h-32 mt-6 flex flex-col justify-center' />}
            <StockTable data={data} />
        </div>
    )
}

export default Stock