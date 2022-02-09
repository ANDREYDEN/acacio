import axios from 'axios'
import { useState } from 'react'
import useSWR from 'swr'
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

async function fetcher(url: string) {
  const { data } = await posterInstance.get('access.getEmployees')
  return data
}

export function useGetPosterEmployeesSWR() {
  const { data, error } = useSWR('access.getEmployees', fetcher)

  function toSupabaseSchema(data: any) {
    if (!data) return null

    const posterEmployees = data.response
    const supabaseEmployees: Partial<definitions['employees']>[] = posterEmployees.map((e: any, i: number) => ({
      id: i,
      first_name: e.name,
      last_name: e.name
    }))
    return supabaseEmployees
  }

  return { employees: toSupabaseSchema(data), employeesError: error }
}