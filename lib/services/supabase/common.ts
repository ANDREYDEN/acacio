import { useState } from 'react'
import { supabase } from '../../../client'
import { definitions } from '../../../types/database'

export const useSupabaseAddEntity = (entityType: keyof definitions) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addEntity = async (entity: Partial<definitions[typeof entityType]>) => {
    setLoading(true)
    if (entity.id === 0) {
      delete entity.id
    }
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