import { NextApiRequest, NextApiResponse } from 'next'
import { posterInstance } from '@services/poster/posterService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data } = await posterInstance.get('access.getEmployees')
    if (data.error) throw data.error
    const rawEmployees = data.response
    res.status(200).json(rawEmployees)
  } catch(e: any) {
    res.status(400).json(e)
  }
}