import { useEffect, useState } from 'react'
import { supabase } from '../client'
import { definitions } from '../types/database'

export const useSupabaseEntity = (entityType: 'employees') => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<definitions[typeof entityType][] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const { data: entityList, error: entityError } = await supabase.from<definitions[typeof entityType]>(entityType).select()

      setLoading(false)
      if (entityList) {
        setData(entityList)
      }

      if (entityError?.message) {
        setError(entityError?.message)
      }
    })()
  },
  [setData, setError, entityType])

  return { data, loading, error } 
}

export const useAddEntity = (entityType: 'employees', ) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<definitions[typeof entityType][] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const { data: entityList, error: entityError } = await supabase.from<definitions[typeof entityType]>(entityType).select()

      setLoading(false)
      if (entityList) {
        setData(entityList)
      }

      if (entityError?.message) {
        setError(entityError?.message)
      }
    })()
  },
  [setData, setError, entityType])

  return { data, loading, error } 
}