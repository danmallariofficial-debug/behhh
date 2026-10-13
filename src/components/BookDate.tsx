import { useEffect, useRef, useState } from 'react'
import { CalendarPlus } from 'lucide-react'
import { MOODS, US, todayISO, type Mood } from '@/lib/us'
import type { Who } from '@/lib/who'

export type Draft = { title: string; place: string; category: Mood; note: string }
// A draft from the wheel, or an existing date being edited (has an id).
export type FormDraft = Draft & { id?: number; day?: string; time?: string }

type Props = {
  who: Who
  draft: FormDraft | null
  onSubmit: (data: Draft & { day: string; time: string; bookedBy: Who }, id?: number) => Promise<void>
  onStopEditing: () => void
}

const empty: Draft = { title: '', place: '', category: 'food', note: '' }

export function BookDate({ who, draft, onSubmit, onStopEditing }: Props) {
  const [form, setForm] = useState<Draft>(empty)
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const editingId = draft?.id
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!draft) return
    setForm({ title: draft.title, place: draft.place, category: draft.category, note: draft.note })
    if (draft.day !== undefined) setDay(draft.day)
    if (draft.time !== undefined) setTime(draft.time)
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }, [draft])

  function reset() {
    setForm(empty)
    setDay('')
    setTime('')
  }

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setForm((f) => ({ ...f, [k]: v }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSubmit({ ...form, day, time, bookedBy: who }, editingId)
      reset()
      if (editingId) onStopEditing()
      setDone(true)
      setTimeout(() => setDone(false), 3500)
    } catch {
      setError('Hmm, that didn’t save. Try again?')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section ref={ref} id="book" className="mx-auto max-w-5xl scroll-mt-20 px-5 py-12">
      <p className="font-hand text-2xl text-lav-600">it’s a date</p>
      <h2 className="font-display text-4xl text-ash-900">{editingId ? 'Change of plans' : 'Book our next one'}</h2>
      <p className="mt-2 max-w-xl text-ash-600">
        {editingId ? (
          <>Editing “{draft?.title}”. Save and it updates for both of us.</>
        ) : (
          <>
            Booking as <b>{who}</b>. It shows up for both of us right away, and you can drop it into Google Calendar
            with both our emails invited.
          </>
        )}
      </p>

      <form onSubmit={submit} className="card mt-6 grid gap-4 p-6 sm:grid-cols-2 md:p-8">
        <label className="block text-sm font-semibold text-ash-600 sm:col-span-2">
          What are we doing?
          <input
            required
            maxLength={120}
            className="field mt-1"
            placeholder="Coffee and long talks"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
          />
        </label>

        <label className="block text-sm font-semibold text-ash-600">
          Where?
          <input
            maxLength={160}
            className="field mt-1"
            placeholder={US.usualSpot}
            value={form.place}
            onChange={(e) => set('place', e.target.value)}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-semibold text-ash-600">
            Day
            <input
              required
              type="date"
              min={editingId ? undefined : todayISO()}
              className="field mt-1"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </label>
          <label className="block text-sm font-semibold text-ash-600">
            Time <span className="font-normal text-ash-400">(optional)</span>
            <input type="time" className="field mt-1" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
        </div>

        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-semibold text-ash-600">The vibe</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => set('category', m.id)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                  form.category === m.id
                    ? 'border-lav-500 bg-lav-100 text-lav-800'
                    : 'border-ash-200 bg-white text-ash-500 hover:border-lav-300'
                }`}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block text-sm font-semibold text-ash-600 sm:col-span-2">
          A little note for {who === 'Jordan' ? 'Rizza' : 'Jordan'}
          <textarea
            rows={3}
            maxLength={600}
            className="field mt-1 resize-none"
            placeholder={
              who === 'Jordan'
                ? 'We can leave whenever you feel tired, okay?'
                : 'Bring a jacket, it gets cold up there.'
            }
            value={form.note}
            onChange={(e) => set('note', e.target.value)}
          />
        </label>

        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <button
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-lav-600 px-6 py-3 font-bold text-white transition hover:bg-lav-700 disabled:opacity-60"
          >
            <CalendarPlus className="h-4 w-4" />{' '}
            {saving ? 'Saving…' : editingId ? 'Save changes' : 'Book it'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                reset()
                onStopEditing()
              }}
              className="text-sm font-semibold text-ash-500 hover:text-ash-700"
            >
              Never mind
            </button>
          )}
          {done && <span className="pop-in font-hand text-2xl text-lav-600">saved! can’t wait 💜</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </form>
    </section>
  )
}
