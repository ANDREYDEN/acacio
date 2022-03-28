import React, { useMemo, useState } from 'react'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { posterInstance } from '@services/poster'
import { enforceAuthenticated } from '@lib/utils'
import { Ingredient } from '@lib/posterTypes'
import { Button, ErrorMessage, Loader, StockTable, TimeframeDropdown } from '@components'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(weekday)

export const getServerSideProps = enforceAuthenticated(async (context: any) => {
    try {
        const { data } = await posterInstance.get('storage.getReportMovement')
        if (data.error) throw data.error
        const ingredients = data.response
        return {
            props: {
                ingredients,
                ...await serverSideTranslations(context.locale, ['stock', 'common', 'timeframe']),
            }
        }
    } catch(e: any) {
        return { 
            props:
            {
                ingredients: [],
                error: e.message,
                ...await serverSideTranslations(context.locale, ['stock', 'common', 'timeframe']),
            }
        }
    }  
})

type StockProps = {
  ingredients: Ingredient[],
  error: string | null
}

const Stock: NextPage<StockProps> = ({ ingredients, error }) => {
    const defaultDateFrom = dayjs().subtract(2, 'week').weekday(4)
    const defaultDateTo = dayjs().weekday(0)
    // TODO: when retrieving needed data, take dateFrom and dateTo into the account
    const [dateFrom, setDateFrom] = useState(defaultDateFrom)
    const [dateTo, setDateTo] = useState(defaultDateTo)
    const { t } = useTranslation('stock')
    const { t: timeframeTranslation } = useTranslation('timeframe')

    const timeframeOptions: Record<string, dayjs.Dayjs> = {
        [timeframeTranslation('1_week')]: dayjs().subtract(1, 'week'),
        [timeframeTranslation('1_and_half_weeks')]: dayjs().subtract(7, 'day'),
        [timeframeTranslation('2_weeks')]: dayjs().subtract(2, 'week'),
        [timeframeTranslation('1_month')]: dayjs().subtract(1, 'month'),
    }

    const data = useMemo(
        () => ingredients, 
        [ingredients]
    )
    const loading = !data

    return (
        <div className='flex flex-col'>
            <div className='w-full flex items-center mb-6'>
                <h3>{t('header')}</h3>
            </div>
            <div className='w-full flex items-center mb-6'>
                <TimeframeDropdown
                    setDateFrom={setDateFrom}
                    setDateTo={setDateTo}
                    defaultDateFrom={defaultDateFrom}
                    defaultDateTo={defaultDateTo}
                    timeframeOptions={timeframeOptions}
                    defaultTimeframe={timeframeTranslation('1_and_half_weeks')}
                />
            </div>
            {error
                ? <ErrorMessage message={error} errorMessageClass='max-h-32 mt-6 flex flex-col justify-center' />
                : loading ? <Loader /> : <StockTable data={data} />
            }
        </div>
    )
}

export default Stock