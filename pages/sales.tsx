import { NextPage } from 'next'
import React from 'react'
import { enforceAuthenticated } from '@lib/utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

export const getServerSideProps = enforceAuthenticated(async (context: any) => ({
    props: {
        ...await serverSideTranslations(context.locale, ['sales']),
    },
}))

const Sales: NextPage = () => {
    const { t } = useTranslation('sales')

    return (
        <div className='flex flex-col py-2 lg:mr-20 mr-10'>
            <h3 className='mb-8'>{t('header').toString()}</h3>
        </div>
    )
}

export default Sales