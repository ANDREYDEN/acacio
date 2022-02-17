import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../client'
import { definitions } from '../../types/database'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { data, error } = await supabase.from<definitions['shifts']>('shifts').select()
        if (error?.message) {
            res.status(400).send(error.message)
        }
        res.status(200).json(data)
    } catch(e: any) {
        res.status(400).send('Error: ' + e.toString())
    }
}
