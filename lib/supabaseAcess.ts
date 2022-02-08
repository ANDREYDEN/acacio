import { useEffect, useState } from 'react'
import { supabase } from '../client'
import { definitions } from '../types/database'

export const useGetSupabaseEntities = (entityType: 'employees') => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<definitions[typeof entityType][] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getEntities = async () => {
    setLoading(true)
    const { data: entityList, error: entityError } = await supabase.from<definitions[typeof entityType]>(entityType).select()
    setLoading(false)


    if (entityList) {
      setData(entityList)
    }

    if (entityError?.message) {
      setError(entityError?.message)
    }
  }

  return { data, loading, error, getEntities } 
}

export const useSupabaseAddEntity = (entityType: 'employees') => {
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

export const useSupabaseDeleteEntity = (entityType: 'employees') => {
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