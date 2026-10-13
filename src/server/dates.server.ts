// Server-only database helpers. Never import from client code.
import { asc, eq, sql } from 'drizzle-orm'
import { purgeCache } from '@netlify/functions'
import { db } from '../../db/index.js'
import { bucketItems, dates, settings, specialDays } from '../../db/schema.js'
import { LOVE_CACHE_TAG } from '../lib/cache'

export type DateInput = {
  title: string
  place: string
  category: string
  day: string
  time: string
  note: string
  bookedBy: string
}

// Every date plus the anniversary setting in one query (starting from a one-row
// SELECT keeps `officialSince` even when no dates are booked yet), with the
// bucket list and our own special days fetched alongside it.
export async function loadLoveData() {
  const [rows, bucket, days] = await Promise.all([
    loadDates(),
    db.select().from(bucketItems).orderBy(asc(bucketItems.position)),
    db.select().from(specialDays).orderBy(asc(specialDays.id)),
  ])
  return {
    days,
    dates: rows.flatMap((r) => (r.date ? [r.date] : [])),
    officialSince: rows[0]?.officialSince ?? null,
    bucket,
  }
}

function loadDates() {
  return db
    .select({ date: dates, officialSince: settings.value })
    .from(sql`(select 1) as one`)
    .leftJoin(dates, sql`true`)
    .leftJoin(settings, eq(settings.key, 'official_since'))
    .orderBy(asc(dates.day), asc(dates.time))
}

// Drops the CDN copy of the page and data after a write, so the next visit is fresh.
export async function purgeLoveCache() {
  try {
    await purgeCache({ tags: [LOVE_CACHE_TAG] })
  } catch (err) {
    // Not available in local dev; the cached copy still expires at Manila midnight.
    console.warn('Cache purge skipped:', (err as Error).message)
  }
}

export async function insertDate(input: DateInput) {
  const [row] = await db.insert(dates).values(input).returning()
  return row
}

export async function updateDate(
  id: number,
  patch: Partial<
    DateInput & { status: string; memory: string; rating: number; jordanNote: string; rizzaNote: string }
  >,
) {
  const [row] = await db.update(dates).set(patch).where(eq(dates.id, id)).returning()
  return row
}

export async function removeDate(id: number) {
  await db.delete(dates).where(eq(dates.id, id))
}

export async function setSetting(key: string, value: string | null) {
  if (value === null) {
    await db.delete(settings).where(eq(settings.key, key))
    return
  }
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } })
}

export type BucketInput = { id: string; emoji: string; title: string; hint: string }

// Adding an id that already exists does nothing, so restoring an idea twice is safe.
export async function insertBucketItem(input: BucketInput) {
  const [row] = await db.insert(bucketItems).values(input).onConflictDoNothing().returning()
  return row ?? null
}

export async function setBucketDone(id: string, done: boolean) {
  await db.update(bucketItems).set({ done }).where(eq(bucketItems.id, id))
}

export async function removeBucketItem(id: string) {
  await db.delete(bucketItems).where(eq(bucketItems.id, id))
}

export type SpecialDayInput = { emoji: string; label: string; day: string; yearly: boolean }

export async function insertSpecialDay(input: SpecialDayInput) {
  const [row] = await db.insert(specialDays).values(input).returning()
  return row
}

export async function removeSpecialDay(id: number) {
  await db.delete(specialDays).where(eq(specialDays.id, id))
}
