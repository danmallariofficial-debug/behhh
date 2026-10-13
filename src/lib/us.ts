// Everything personal about Jordan & Rizza lives here, so it's easy to tweak.

export const US = {
  callsign: 'Beh',
  jordan: { name: 'Jordan', email: 'danmallariofficial@gmail.com', birthday: '2002-12-18', color: 'gray' },
  rizza: { name: 'Rizza', email: 'rizzamaengojo@gmail.com', birthday: '2002-04-03', color: 'lavender' },
  // The day Jordan told Rizza how he feels.
  since: '2026-08-31',
  albumUrl: 'https://drive.google.com/drive/folders/1a0XSdSt0wlRYMu40vNhaHaIVAy6z1fjI?usp=sharing',
  usualSpot: 'Green Coffee, Marfori',
}

// The bucket list we started with. They're seeded into the database; this copy
// lets us bring back any we removed.
export const BUCKET: { id: string; emoji: string; title: string; hint: string }[] = [
  { id: 'coastal-road', emoji: '🌊', title: 'Coastal Road walk', hint: 'Sunset breeze, no destination.' },
  { id: 'coffee-talks', emoji: '☕', title: 'Coffee & long talks', hint: 'Stay until they stack the chairs.' },
  { id: 'samal-sunrise', emoji: '🌅', title: 'Sunrise on Samal', hint: 'Early ferry, sleepy smiles.' },
  { id: 'mt-apo-view', emoji: '⛰️', title: 'See Mt. Apo up close', hint: 'Even just from a viewpoint.' },
  { id: 'kadayawan', emoji: '🎉', title: 'Kadayawan together', hint: 'Street dancing, fruit everywhere.' },
  { id: 'cook-dinner', emoji: '🍳', title: 'Cook a full dinner', hint: 'Starter, main, and a dessert attempt.' },
  { id: 'stargazing', emoji: '✨', title: 'Stargazing night', hint: 'Somewhere dark, up in the hills.' },
  { id: 'rain-walk', emoji: '☔', title: 'Walk in the rain', hint: 'One umbrella, on purpose.' },
  { id: 'polaroids', emoji: '📸', title: 'Fill a page of photos', hint: 'Then add them to our album.' },
  { id: 'adopt-day', emoji: '🐶', title: 'A day with shelter dogs', hint: 'Walks, belly rubs, silly names.' },
  { id: 'letters', emoji: '💌', title: 'Write each other letters', hint: 'Open them on a date, read out loud.' },
  { id: 'road-trip', emoji: '🚗', title: 'Little road trip', hint: 'Pick a town we’ve never been to.' },
]

export type Mood = 'cozy' | 'food' | 'pets' | 'outdoors' | 'adventure'

export const MOODS: { id: Mood; label: string; emoji: string }[] = [
  { id: 'cozy', label: 'Cozy & quiet', emoji: '🕯️' },
  { id: 'food', label: 'Food trip', emoji: '🍜' },
  { id: 'pets', label: 'Animals & pets', emoji: '🐾' },
  { id: 'outdoors', label: 'Fresh air', emoji: '🌿' },
  { id: 'adventure', label: 'Little adventure', emoji: '🧭' },
]

export const moodOf = (id: string) => MOODS.find((m) => m.id === id) ?? MOODS[0]

export type Idea = {
  short: string // fits on a wheel slice
  title: string
  place: string
  mood: Mood
  twist: string
}

// Davao-first date ideas. Each has a small twist so even the usual spots feel new.
export const IDEAS: Idea[] = [
  {
    short: 'Green Coffee',
    title: 'Coffee at our spot',
    place: 'Green Coffee, Marfori',
    mood: 'cozy',
    twist: 'Order for each other without asking. Then bring three questions you’ve never asked.',
  },
  {
    short: 'Roxas Night Mkt',
    title: 'Night market food crawl',
    place: 'Roxas Night Market',
    mood: 'food',
    twist: 'Each of us picks one stall blind, and the other has to rate it out of 10.',
  },
  {
    short: 'People’s Park',
    title: 'Evening walk at People’s Park',
    place: 'People’s Park, Davao City',
    mood: 'outdoors',
    twist: 'Pick a sculpture each and make up its life story.',
  },
  {
    short: 'Eagle Center',
    title: 'Meet the Philippine Eagles',
    place: 'Philippine Eagle Center, Malagos',
    mood: 'pets',
    twist: 'Name one eagle after each other. Then grab chocolate nearby.',
  },
  {
    short: 'Malagos Choco',
    title: 'Chocolate tasting',
    place: 'Malagos Garden Resort, Calinan',
    mood: 'food',
    twist: 'Rank every sample together and keep the list in your notes app.',
  },
  {
    short: 'Eden Nature',
    title: 'Day up in the cool air',
    place: 'Eden Nature Park, Toril',
    mood: 'adventure',
    twist: 'Phones in the bag for the first hour. Just us and the pine trees.',
  },
  {
    short: 'Samal Island',
    title: 'Quick island escape',
    place: 'Island Garden City of Samal',
    mood: 'adventure',
    twist: 'Find the quietest stretch of beach we can, then just sit.',
  },
  {
    short: 'Shrine Hills',
    title: 'Sunset at Shrine Hills',
    place: 'Shrine Hills, Matina',
    mood: 'outdoors',
    twist: 'Bring takeout and stay until the city lights come on.',
  },
  {
    short: 'Jack’s Ridge',
    title: 'Dinner with the city lights',
    place: 'Jack’s Ridge, Shrine Hills',
    mood: 'food',
    twist: 'Dress up a little, just because.',
  },
  {
    short: 'Pet café',
    title: 'Afternoon with fluffy friends',
    place: 'A pet café around Davao',
    mood: 'pets',
    twist: 'Whoever gets picked first by a pet chooses dessert.',
  },
  {
    short: 'Shelter visit',
    title: 'Volunteer at an animal shelter',
    place: 'An animal rescue around Davao',
    mood: 'pets',
    twist: 'Bring treats, walk a dog together, and give them silly temporary names.',
  },
  {
    short: 'Croc Park',
    title: 'Crocodile Park & friends',
    place: 'Davao Crocodile Park, Riverfront',
    mood: 'pets',
    twist: 'Try to spot every animal on the map. Loser buys the halo-halo.',
  },
  {
    short: 'Bone Museum',
    title: 'Quiet museum afternoon',
    place: 'D’ Bone Collector Museum',
    mood: 'cozy',
    twist: 'Each find the strangest exhibit and explain it like a tour guide.',
  },
  {
    short: 'Museo Dabawenyo',
    title: 'Learn a bit of Davao history',
    place: 'Museo Dabawenyo, San Pedro St.',
    mood: 'cozy',
    twist: 'Then go for merienda and share one family story each.',
  },
  {
    short: 'Fruit stalls',
    title: 'Durian & pomelo tasting',
    place: 'Magsaysay Park fruit stalls',
    mood: 'food',
    twist: 'Rizza picks the durian, Jordan picks the pomelo, and we judge each other.',
  },
  {
    short: 'Japanese Tunnel',
    title: 'Explore the Japanese Tunnel',
    place: 'Japanese Tunnel, Matina',
    mood: 'adventure',
    twist: 'Hold hands in the dark parts. Purely for safety, of course.',
  },
  {
    short: 'Movie night',
    title: 'Movie & late snack',
    place: 'SM Lanang or Abreeza',
    mood: 'cozy',
    twist: 'Trade popcorn flavors halfway through.',
  },
  {
    short: 'Cook together',
    title: 'Cook kinilaw together',
    place: 'Home kitchen + a quick market run',
    mood: 'cozy',
    twist: 'Low-key, no crowds. Playlist DJ swaps every song.',
  },
  {
    short: 'Bookstore date',
    title: 'Bookstore + quiet café',
    place: 'A bookstore in the mall, then a café',
    mood: 'cozy',
    twist: 'Pick a book you think the other would love. No explanations until coffee.',
  },
  {
    short: 'Seafood paluto',
    title: 'Seafood paluto by the sea',
    place: 'A paluto spot along the Davao coast',
    mood: 'food',
    twist: 'Choose the fish together at the counter and guess the price.',
  },
]

// ---- date helpers (Asia/Manila, day-level) ----

export function todayISO() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila' }).format(new Date())
}

const toUTC = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

export function daysBetween(fromISO: string, toISO: string) {
  return Math.round((toUTC(toISO) - toUTC(fromISO)) / 86_400_000)
}

export function addDays(iso: string, n: number) {
  return new Date(toUTC(iso) + n * 86_400_000).toISOString().slice(0, 10)
}

export function prettyDate(iso: string, opts: Intl.DateTimeFormatOptions = {}) {
  return new Date(toUTC(iso)).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...opts,
  })
}

export function prettyTime(hhmm: string) {
  if (!hhmm) return ''
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`
}

/** Next occurrence (today or later) of a yearly date like a birthday. */
export function nextYearly(iso: string, today = todayISO()) {
  const [, m, d] = iso.split('-')
  const year = Number(today.slice(0, 4))
  let next = `${year}-${m}-${d}`
  if (next < today) next = `${year + 1}-${m}-${d}`
  return next
}

export function relativeDays(n: number) {
  if (n === 0) return 'today'
  if (n === 1) return 'tomorrow'
  if (n === -1) return 'yesterday'
  return n > 0 ? `in ${n} days` : `${-n} days ago`
}

export function calendarLink(d: {
  title: string
  place: string
  day: string
  time: string
  note: string
}) {
  const compact = (iso: string) => iso.replaceAll('-', '')
  let dates: string
  if (d.time) {
    const [h, m] = d.time.split(':').map(Number)
    const start = `${compact(d.day)}T${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`
    const endH = Math.min(h + 3, 23)
    const end = `${compact(d.day)}T${String(endH).padStart(2, '0')}${String(m).padStart(2, '0')}00`
    dates = `${start}/${end}`
  } else {
    dates = `${compact(d.day)}/${compact(addDays(d.day, 1))}`
  }
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${US.callsign} date: ${d.title}`,
    dates,
    ctz: 'Asia/Manila',
    location: d.place,
    details: d.note || `Booked on our little date site 💜`,
    add: `${US.jordan.email},${US.rizza.email}`,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
