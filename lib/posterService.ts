import axios from 'axios'
import { useState } from 'react'
import { definitions } from '../types/database'

export const posterInstance = axios.create({
  baseURL: 'https://joinposter.com/api/',
  params: {
    token: process.env.NEXT_POSTER_ACCESS_TOKEN
  }
})

export function useGetPosterEmployees() {
  const [employees, setEmployees] = useState<definitions['employees'][] | null>(null)
  const [employeesLoading, setLoading] = useState(false)
  const [employeesError, setError] = useState<string | null>(null)

  const getEmployees = async () => {
    setLoading(true)
    try {
      const { data: rawEmployees } = await posterInstance.get('access.getEmployees')
      if (rawEmployees) {
        setEmployees(rawEmployees)
      }
    } catch (e: any) {
      setError(e.toString())
    } finally {
      setLoading(false)
    }
  }

  return { getEmployees, employees, employeesLoading, employeesError } 
}