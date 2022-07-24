import { NextApiRequest, NextApiResponse } from 'next'
import { posterInstance } from '@services/poster'
import dayjs from 'dayjs'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { route, dateFrom, dateTo, type, waste_id, supply_id } = req.query

    try {
        const { data } = await posterInstance.get(route as string, {
            params: {
                dateFrom: dateFrom ?? dayjs().startOf('month').format('YYYYMMDD'),
                dateTo: dateTo ?? dayjs().format('YYYYMMDD'),
                type,
                waste_id,
                supply_id
            }
        })
        if (data.error) throw data.error
        res.status(200).json(data.response)
    } catch(e: any) {
        res.status(400).json(e)
    }
}