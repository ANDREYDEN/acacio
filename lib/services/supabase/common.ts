import axios from 'axios'
import { useState } from 'react'
import { supabase } from '@client'
import { definitions } from '@types'
import useSWR from 'swr'
import { convertToKebabCase } from '@lib/utils'

export async function apiGet(url: string) {
    const { data } = await axios.get(url)
    return data
}

export const useSupabaseGetEntity = <T>(entityType: keyof definitions) => {
    const { data, error, mutate } = useSWR(`/api/${convertToKebabCase(entityType)}`, apiGet)

    const definedData = data ? data as T[] : []
    return { data: definedData, loading: !data, error: error?.toString(), mutate }
}

export const supabaseGetEntity = async <T>(entityType: keyof definitions): Promise<T[]> => {
    const data = await apiGet(`/api/${convertToKebabCase(entityType)}`)
    return data ? data as T[] : []
}

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

export const supabaseUpsertEntity = async (
    entityType: keyof definitions, 
    entity: Partial<definitions[typeof entityType]>
) => {
    const { error } = await supabase.from<definitions[typeof entityType]>(entityType).upsert(entity)
    return error?.message
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