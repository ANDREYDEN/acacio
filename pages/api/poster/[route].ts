import { NextApiRequest, NextApiResponse } from 'next'
import { posterInstance } from '@services/poster'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { route } = req.query
    try {
        const { data } = await posterInstance.get(route as string)
        if (data.error) throw data.error
        res.status(200).json(data.response)
    } catch(e: any) {
        res.status(400).json(e)
    }
}