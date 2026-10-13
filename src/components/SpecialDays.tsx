import { useState } from 'react'
import { Images, Plus, X } from 'lucide-react'
import { US, addDays, daysBetween, nextYearly, prettyDate, relativeDays, todayISO } from '@/lib/us'
import { addSpecialDay, deleteSpecialDay } from '@/server/dates.functions'

type Day = { key: string; emoji: string; label: string; sub: string; date: string; tint: string; own?: OurDay }

export type OurDay = { id: number; emoji: string; label: string; day: string; yearly: boolean }

type Props = {
  officialSince: string | null
  ours: OurDay[]
  setOurs: React.Dispatch<React.SetStateAction<OurDay[]>>
}

const emptyDraft = { emoji: '', label: '', day: '', yearly: true }

export function SpecialDays({ officialSince, ours, setOurs }: Props) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState(emptyDraft)
  const [saving, setSaving] = useState(false)
  const today = todayISO()
  const year = Number(today.slice(0, 4))

  const rizzaNext = nextYearly(US.rizza.birthday, today)
  const jordanNext = nextYearly(US.jordan.birthday, today)
  const days: Day[] = [
    {
      key: 'rizza-birthday',
      emoji: '🎂',
      label: 'Rizza’s birthday',
      sub: `turning ${Number(rizzaNext.slice(0, 4)) - 2002} · lavender everything`,
      date: rizzaNext,
      tint: 'bg-lav-100 text-lav-800',
    },
    {
      key: 'jordan-birthday',
      emoji: '🎁',
      label: 'Jordan’s birthday',
      sub: `turning ${Number(jordanNext.slice(0, 4)) - 2002} · gray is fine, he says`,
      date: jordanNext,
      tint: 'bg-ash-100 text-ash-800',
    },
  ]

  // Small milestones since the day Jordan told Rizza.
  const milestone = [100, 200, 365, 500, 730, 1000]
    .map((n) => ({ n, date: addDays(US.since, n) }))
    .find((m) => m.date >= today)
  if (milestone) {
    days.push({
      key: 'milestone',
      emoji: '🌙',
      label: `${milestone.n} days since I told you`,
      sub: 'a quiet little milestone',
      date: milestone.date,
      tint: 'bg-lav-50 text-lav-700',
    })
  }

  if (officialSince) {
    days.push({
      key: 'anniversary',
      emoji: '💍',
      label: 'Our anniversary',
      sub: `official since ${prettyDate(officialSince, { year: 'numeric', weekday: undefined })}`,
      date: nextYearly(officialSince, addDays(today, 1)),
      tint: 'bg-lav-200 text-lav-800',
    })
  }

  for (const d of ours) {
    days.push({
      key: `own-${d.id}`,
      emoji: d.emoji,
      label: d.label,
      sub: d.yearly ? 'every year' : 'just this once',
      // A yearly day added for the future starts on its first date.
      date: d.yearly && d.day < today ? nextYearly(d.day, today) : d.day,
      tint: 'bg-lav-100 text-lav-800',
      own: d,
    })
  }

  // Upcoming first, soonest at the top; one-time days that already passed go last.
  days.sort((a, b) => Number(a.date < today) - Number(b.date < today) || a.date.localeCompare(b.date))

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const row = await addSpecialDay({ data: { ...draft, emoji: draft.emoji.trim() || '💜' } })
      setOurs((xs) => [...xs, row])
      setDraft(emptyDraft)
      setAdding(false)
    } catch {
      alert('Hmm, that didn’t save. Try again?')
    } finally {
      setSaving(false)
    }
  }

  async function remove(d: OurDay) {
    if (!confirm(`Remove “${d.label}” from our days?`)) return
    const before = ours
    setOurs((xs) => xs.filter((x) => x.id !== d.id))
    try {
      await deleteSpecialDay({ data: { id: d.id } })
    } catch {
      setOurs(before)
      alert('Hmm, that didn’t go through. Try again?')
    }
  }

  return (
    <section id="days" className="mx-auto max-w-5xl px-5 py-12">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-hand text-2xl text-lav-600">don’t forget</p>
              <h2 className="font-display text-4xl text-ash-900">Days that matter</h2>
            </div>
            <button
              onClick={() => setAdding((a) => !a)}
              className="inline-flex items-center gap-1.5 rounded-full bg-lav-600 px-4 py-2 text-sm font-bold text-white hover:bg-lav-700"
            >
              <Plus className="h-4 w-4" /> Add a day
            </button>
          </div>

          {adding && (
            <form onSubmit={add} className="card pop-in mt-6 grid gap-3 p-5 sm:grid-cols-[4.5rem_1fr_10rem]">
              <input
                className="field text-center"
                placeholder="🌸"
                maxLength={4}
                aria-label="Emoji"
                value={draft.emoji}
                onChange={(e) => setDraft({ ...draft, emoji: e.target.value })}
              />
              <input
                autoFocus
                required
                maxLength={60}
                className="field"
                placeholder="First coffee together"
                aria-label="What’s the day?"
                value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              />
              <input
                required
                type="date"
                className="field"
                aria-label="Date"
                value={draft.day}
                onChange={(e) => setDraft({ ...draft, day: e.target.value })}
              />
              <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-ash-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-lav-600"
                    checked={draft.yearly}
                    onChange={(e) => setDraft({ ...draft, yearly: e.target.checked })}
                  />
                  Comes back every year
                </label>
                <button
                  disabled={saving}
                  className="rounded-full bg-ash-800 px-5 py-2.5 font-bold text-white transition hover:bg-lav-600 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Add it'}
                </button>
              </div>
            </form>
          )}

          <ul className="mt-6 space-y-3">
            {days.map((d) => {
              const diff = daysBetween(today, d.date)
              return (
                <li key={d.key} className="card group flex items-center gap-4 p-4">
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${d.tint}`}>{d.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-ash-900">{d.label}</p>
                    <p className="text-sm text-ash-500">{d.sub}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg text-ash-900">{relativeDays(diff)}</p>
                    <p className="text-xs text-ash-400">
                      {prettyDate(d.date, { year: Number(d.date.slice(0, 4)) !== year ? 'numeric' : undefined })}
                    </p>
                  </div>
                  {d.own && (
                    <button
                      onClick={() => remove(d.own!)}
                      aria-label={`Remove ${d.label}`}
                      className="-mr-1 rounded-full p-1.5 text-ash-400 transition hover:bg-ash-100 hover:text-ash-700 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <div id="album" className="card relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-lav-100 via-white to-ash-100 p-7">
          <div className="pointer-events-none absolute -bottom-8 -right-6 rotate-12 select-none text-[9rem] opacity-20">
            📸
          </div>
          <div>
            <p className="font-hand text-2xl text-lav-600">our photos</p>
            <h2 className="font-display text-3xl text-ash-900">The Beh album</h2>
            <p className="mt-2 text-ash-600">
              Every blurry selfie, every coffee cup, every pet we met. Upload them here so we never lose them.
            </p>
          </div>
          <a
            href={US.albumUrl}
            target="_blank"
            rel="noreferrer"
            className="relative mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-ash-800 px-5 py-3 font-bold text-white transition hover:bg-lav-600"
          >
            <Images className="h-4 w-4" /> Open our album
          </a>
        </div>
      </div>
    </section>
  )
}
