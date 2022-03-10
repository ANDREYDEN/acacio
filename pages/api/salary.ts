import { supabase } from '@client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { data, error } = await supabase.rpc('monthly_work_hour_totals')

        if (error?.message) {
            res.status(400).send(error.message)
        }
        res.status(200).json(data)
    } catch(e: any) {
        res.status(400).send('Error: ' + e.toString())
    }
}
