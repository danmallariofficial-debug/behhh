import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { z } from 'zod'
import { loveCacheHeaders } from '@/lib/cache'
import {
  insertBucketItem,
  insertDate,
  insertSpecialDay,
  loadLoveData,
  purgeLoveCache,
  removeBucketItem,
  removeDate,
  removeSpecialDay,
  setBucketDone,
  setSetting,
  updateDate,
} from './dates.server'

const dayRe = /^\d{4}-\d{2}-\d{2}$/

const dateInput = z.object({
  title: z.string().trim().min(1).max(120),
  place: z.string().trim().max(160).default(''),
  category: z.string().max(30).default('food'),
  day: z.string().regex(dayRe),
  time: z.string().max(5).default(''),
  note: z.string().trim().max(600).default(''),
  bookedBy: z.enum(['Jordan', 'Rizza']),
})

export const getLoveData = createServerFn({ method: 'GET' }).handler(async () => {
  const { dates, officialSince, bucket, days } = await loadLoveData()
  // Only successful loads are cached. During SSR this also caches the page itself.
  for (const [k, v] of Object.entries(loveCacheHeaders())) setResponseHeader(k, v)
  return { dates: dates.map(serialize), officialSince, bucket, days: days.map(serialize) }
})

const serialize = <T extends { createdAt: Date | null }>(d: T) => ({
  ...d,
  createdAt: d.createdAt?.toISOString() ?? null,
})

// Writes return the saved row so the page can update in place instead of refetching.
export const bookDate = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => dateInput.parse(data))
  .handler(async ({ data }) => {
    const row = await insertDate(data)
    await purgeLoveCache()
    return serialize(row)
  })

export const editDate = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.number().int(),
        status: z.enum(['planned', 'done']).optional(),
        memory: z.string().trim().max(4000).optional(),
        rating: z.number().int().min(0).max(5).optional(),
        jordanNote: z.string().trim().max(4000).optional(),
        rizzaNote: z.string().trim().max(4000).optional(),
        // Editing a booked date can change any of its details.
        title: z.string().trim().min(1).max(120).optional(),
        place: z.string().trim().max(160).optional(),
        category: z.string().max(30).optional(),
        day: z.string().regex(dayRe).optional(),
        time: z.string().max(5).optional(),
        note: z.string().trim().max(600).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { id, ...patch } = data
    const row = await updateDate(id, patch)
    await purgeLoveCache()
    return row ? serialize(row) : null
  })

export const cancelDate = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => z.object({ id: z.number().int() }).parse(data))
  .handler(async ({ data }) => {
    await removeDate(data.id)
    await purgeLoveCache()
    return { ok: true }
  })

export const setOfficial = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    z.object({ since: z.string().regex(dayRe).nullable() }).parse(data),
  )
  .handler(async ({ data }) => {
    await setSetting('official_since', data.since)
    await purgeLoveCache()
    return { ok: true }
  })

export const addBucketItem = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().min(1).max(60),
        emoji: z.string().trim().max(8).default('💜'),
        title: z.string().trim().min(1).max(60),
        hint: z.string().trim().max(80).default(''),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const row = await insertBucketItem(data)
    await purgeLoveCache()
    return row
  })

export const tickBucketItem = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => z.object({ id: z.string(), done: z.boolean() }).parse(data))
  .handler(async ({ data }) => {
    await setBucketDone(data.id, data.done)
    await purgeLoveCache()
    return { ok: true }
  })

export const deleteBucketItem = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    await removeBucketItem(data.id)
    await purgeLoveCache()
    return { ok: true }
  })

export const addSpecialDay = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    z
      .object({
        emoji: z.string().trim().max(8).default('💜'),
        label: z.string().trim().min(1).max(60),
        day: z.string().regex(dayRe),
        yearly: z.boolean().default(true),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const row = await insertSpecialDay(data)
    await purgeLoveCache()
    return serialize(row)
  })

export const deleteSpecialDay = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => z.object({ id: z.number().int() }).parse(data))
  .handler(async ({ data }) => {
    await removeSpecialDay(data.id)
    await purgeLoveCache()
    return { ok: true }
  })
