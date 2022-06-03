import { supabase } from '@client'
import { definitions } from '@types'
import dayjs from 'dayjs'
import { GetServerSideProps } from 'next'
import { KeyedMutator } from 'swr'

export function enforceAuthenticated(inner?: GetServerSideProps): GetServerSideProps {
    return async context => {
        const { req } = context
        const { user } = await supabase.auth.api.getUserByCookie(req)

        if (!user) {
            return { props: {}, redirect: { destination: '/' } }
        }

        if (inner) return inner(context)

        return { props: {} }
    }
}

export function roundValue(value: number) {
    return Math.round(value * 100) / 100
}

/**
 * Returns a list of days in a month
 * @param month a dayjs date representing the current month
 * @returns a list of dayjs dates - days in the provided month
 */
export function getMonthDays(month: dayjs.Dayjs): dayjs.Dayjs[] {
    const dateRange = []
    for (let date = 1; date <= month.daysInMonth(); date++) {
        dateRange.push(month.date(date))
    }
    return dateRange
}

export function fullName(employee: definitions['employees']): string {
    if (!employee.last_name) return employee.first_name

    return `${employee.first_name} ${employee.last_name}`
}

export function capitalizeWord(word: string): string {
    return `${word[0]?.toUpperCase()}${word.slice(1)}`
}

type UpdatableEntity = Partial<{ id: number }>

export async function modifyEntityAndReload(
    entity: UpdatableEntity, entities: UpdatableEntity[], revalidateEntities: KeyedMutator<any>,
    upsertEntity: KeyedMutator<any>, deleteEntities: KeyedMutator<any>, toBeDeleted: boolean) {
    // add
    if (!entity.id) {
        return await revalidateEntities(async () => {
            await upsertEntity(entity)
            return [...entities, entity]
        })
    }

    // delete
    if (toBeDeleted) {
        return await revalidateEntities(async () => {
            await deleteEntities(entity.id!)
            return entities.filter(e => e.id !== entity.id)
        })
    }

    // update
    return await revalidateEntities(async () => {
        await upsertEntity(entity)
        return entities.map(e => e.id === entity.id ? entity : e)
    })
}