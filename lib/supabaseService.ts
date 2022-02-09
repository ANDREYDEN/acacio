import axios from 'axios'
import { useState } from 'react'
import useSWR from 'swr'
import { supabase } from '../client'
import { definitions } from '../types/database'

async function apiGet(url: string) {
  const { data } = await axios.get(url)
  return data
}

export const useSupabaseGetEmployees = () => {
  const { data, error } = useSWR('/api/employees', apiGet)

  return { data: data as definitions['employees'][] , loading: !data, error }
}

export const useSupabaseAddEntity = (entityType: keyof definitions) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addEntity = async (entity: Partial<definitions[typeof entityType]>) => {
    setLoading(true)
    const { error: entityError } = await supabase.from<definitions[typeof entityType]>(entityType).insert(entity)
    setLoading(false)

    if (entityError?.message) {
      setError(entityError?.message)
    }
  }

  return { addEntity, loading, error } 
}

export const useSupabaseDeleteEntity = (entityType: keyof definitions) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteEntity = async (id: definitions[typeof entityType]['id']) => {
    setLoading(true)
    const { error: entityError } = await supabase.from<definitions[typeof entityType]>(entityType).delete().match({ id })
    setLoading(false)

    if (entityError?.message) {
      setError(entityError?.message)
    }
  }

  return { deleteEntity, loading, error } 
}