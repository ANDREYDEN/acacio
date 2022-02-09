import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const posterInstance = axios.create({
    baseURL: 'https://joinposter.com/api/',
    params: {
      token: process.env.NEXT_POSTER_ACCESS_TOKEN
    }
  })
  
  try {
    const { data: rawEmployees } = await posterInstance.get('access.getEmployees')
    res.status(200).json(rawEmployees)
  } catch(e: any) {
    res.status(400).send('Error: ' + e.toString())
  }
}
