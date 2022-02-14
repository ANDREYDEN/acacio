import { useState } from 'react'
import { supabase } from '../../../client'
import { definitions } from '../../../types/database'

export const useSupabaseUpsertEntity = (entityType: keyof definitions) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upsertEntity = async (entity: Partial<definitions[typeof entityType]>) => {
    setLoading(true)
    const { error: entityError } = await supabase.from<definitions[typeof entityType]>(entityType).upsert(entity)
    setLoading(false)

    if (entityError?.message) {
      setError(entityError?.message)
    }
  }

  return { upsertEntity, loading, error } 
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