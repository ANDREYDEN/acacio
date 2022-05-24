import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@client'
import { definitions } from '@types'
import dayjs from 'dayjs'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const firstDayOfMonth = dayjs().startOf('month')
        const lastDayOfMonth = dayjs().endOf('month')
        
        const { data, error } = await supabase
            .from<definitions['prepaid_expenses']>('prepaid_expenses')
            .select()
            .filter('created_at', 'gte', firstDayOfMonth.toISOString())
            .filter('created_at', 'lte', lastDayOfMonth.toISOString())
        if (error?.message) {
            res.status(400).send(error.message)
        }
        res.status(200).json(data)
    } catch(e: any) {
        res.status(400).send('Error: ' + e.toString())
    }
}
