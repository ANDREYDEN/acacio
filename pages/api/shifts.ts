import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@client'
import { definitions } from '@types'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        let { month, year } = req.query
        const date = dayjs()
            .month(month ? +month : dayjs().month())
            .year(year ? +year : dayjs().year())
        const firstDayOfMonth = date.startOf('month')
        const firstDayOfNextMonth = firstDayOfMonth.add(1, 'month')

        const { data, error } = await supabase
            .from<definitions['shifts']>('shifts')
            .select()
            .filter('date', 'gte', firstDayOfMonth.toISOString())
            .filter('date', 'lte', firstDayOfNextMonth.toISOString())
        if (error?.message) {
            res.status(400).send(error.message)
        }
        res.status(200).json(data)
    } catch(e: any) {
        res.status(400).send('Error: ' + e.toString())
    }
}
