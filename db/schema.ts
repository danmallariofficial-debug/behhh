import { pgTable, serial, text, timestamp, integer, boolean, index } from 'drizzle-orm/pg-core'

export const dates = pgTable('dates', {
  id: serial().primaryKey(),
  title: text().notNull(),
  place: text().notNull().default(''),
  category: text().notNull().default('food'),
  day: text().notNull(), // YYYY-MM-DD (Asia/Manila)
  time: text().notNull().default(''), // HH:MM
  note: text().notNull().default(''),
  bookedBy: text('booked_by').notNull(),
  status: text().notNull().default('planned'), // planned | done
  memory: text().notNull().default(''),
  rating: integer().notNull().default(0),
  // Each of us writes a private note; both show only once both are written.
  jordanNote: text('jordan_note').notNull().default(''),
  rizzaNote: text('rizza_note').notNull().default(''),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => [
  // Dates are always loaded in this order.
  index('dates_day_time_idx').on(t.day, t.time),
])

export const settings = pgTable('settings', {
  key: text().primaryKey(),
  value: text().notNull(),
})

// Shared bucket list, so ticks show up on both our phones.
export const bucketItems = pgTable('bucket_items', {
  id: text().primaryKey(), // original idea slug, or own-<timestamp>
  emoji: text().notNull().default('💜'),
  title: text().notNull(),
  hint: text().notNull().default(''),
  done: boolean().notNull().default(false),
  position: serial(),
}, (t) => [index('bucket_items_position_idx').on(t.position)])

// Our own days that matter, added from the site.
export const specialDays = pgTable('special_days', {
  id: serial().primaryKey(),
  emoji: text().notNull().default('💜'),
  label: text().notNull(),
  day: text().notNull(), // YYYY-MM-DD (Asia/Manila)
  yearly: boolean().notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
})
