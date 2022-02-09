import { NextApiRequest, NextApiResponse } from 'next'
import { posterInstance } from '../../../lib/posterService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data } = await posterInstance.get('access.getEmployees')
    const rawEmployees = data.response
    res.status(200).json(rawEmployees)
  } catch(e: any) {
    res.status(400).send(e.toString())
  }
}