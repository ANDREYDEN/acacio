import { NextApiRequest, NextApiResponse } from 'next'
import { posterInstance } from '../../../lib/posterService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data } = await posterInstance.get('storage.getReportMovement')
    if (data.error) throw data.error
    const ingredients = data.response
    res.status(200).json(ingredients)
  } catch(e: any) {
    res.status(400).json(e)
  }
}