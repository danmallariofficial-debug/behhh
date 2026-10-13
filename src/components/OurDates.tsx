import { useEffect, useRef, useState } from 'react'
import { CalendarDays, Check, Heart, MapPin, Pencil, Trash2 } from 'lucide-react'
import { US, calendarLink, daysBetween, moodOf, prettyDate, prettyTime, relativeDays, todayISO } from '@/lib/us'
import type { Who } from '@/lib/who'

export type DateRow = {
  id: number
  title: string
  place: string
  category: string
  day: string
  time: string
  note: string
  bookedBy: string
  status: string
  memory: string
  rating: number
  jordanNote: string
  rizzaNote: string
}

export type DatePatch = {
  status?: 'planned' | 'done'
  memory?: string
  rating?: number
  jordanNote?: string
  rizzaNote?: string
}

type Props = {
  dates: DateRow[]
  onDone: (id: number) => void
  onEdit: (d: DateRow) => void
  onCancel: (id: number) => Promise<void>
}

export function OurDates({ dates, onDone, onEdit, onCancel }: Props) {
  const today = todayISO()
  const planned = dates.filter((d) => d.status !== 'done')

  return (
    <section id="dates" className="mx-auto max-w-5xl px-5 py-12">
      <p className="font-hand text-2xl text-lav-600">coming up</p>
      <h2 className="font-display text-4xl text-ash-900">Our dates</h2>

      {planned.length === 0 ? (
        <div className="card mt-6 p-8 text-center text-ash-500">
          <p className="font-display text-2xl text-ash-800">Nothing booked yet.</p>
          <p className="mt-1">
            Coffee at {US.usualSpot} is always a good place to start. Or{' '}
            <a href="#home" className="font-semibold text-lav-600 underline-offset-4 hover:underline">
              spin the wheel
            </a>
            .
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {planned.map((d) => (
            <PlannedCard key={d.id} d={d} today={today} onDone={onDone} onEdit={onEdit} onCancel={onCancel} />
          ))}
        </ul>
      )}
    </section>
  )
}

type MemoriesProps = {
  dates: DateRow[]
  who: Who
  reviewing: number | null
  setReviewing: (id: number | null) => void
  onUpdate: (id: number, patch: DatePatch) => void
  onDelete: (id: number) => Promise<void>
}

export function Memories({ dates, who, reviewing, setReviewing, onUpdate, onDelete }: MemoriesProps) {
  const memories = dates.filter((d) => d.status === 'done').reverse()

  function remove(d: DateRow) {
    if (!confirm(`Delete the memory of “${d.title}”? This can’t be undone.`)) return
    onDelete(d.id)
  }

  return (
    <section id="memories" className="mx-auto max-w-5xl px-5 py-12">
      <p className="font-hand text-2xl text-lav-600">kept forever</p>
      <h2 className="font-display text-4xl text-ash-900">Little memories</h2>
      {memories.length === 0 ? (
        <p className="card mt-6 p-8 text-center text-ash-500">
          No memories yet. Once a date is done, tap “We did it” and it lands here.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {memories.map((d) => (
            <li key={d.id} className="card pop-in p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-ash-400">
                {prettyDate(d.day, { year: 'numeric' })}
              </p>
              <p className="mt-1 font-display text-xl text-ash-900">{d.title}</p>
              {d.place && <p className="text-sm text-ash-500">📍 {d.place}</p>}
              {reviewing === d.id ? (
                <ReviewCard
                  d={d}
                  onSave={(patch) => {
                    setReviewing(null)
                    onUpdate(d.id, patch)
                  }}
                  onClose={() => setReviewing(null)}
                />
              ) : (
                <>
                  <Hearts value={d.rating} />
                  {d.memory && (
                    <p className="mt-3 whitespace-pre-wrap font-hand text-xl leading-snug text-lav-700">“{d.memory}”</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <button onClick={() => setReviewing(d.id)} className="font-semibold text-lav-600 hover:text-lav-700">
                      {d.memory || d.rating ? 'edit memory' : 'how was the date?'}
                    </button>
                    <button
                      onClick={() => onUpdate(d.id, { status: 'planned' })}
                      className="text-ash-400 hover:text-ash-600"
                    >
                      move back to upcoming
                    </button>
                    <button onClick={() => remove(d)} className="ml-auto text-ash-400 hover:text-red-600">
                      delete
                    </button>
                  </div>
                </>
              )}
              <SealedNotes d={d} who={who} onSave={(patch) => onUpdate(d.id, patch)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

// Each of us writes a note for the date. Neither is shown until both are written.
function SealedNotes({ d, who, onSave }: { d: DateRow; who: Who; onSave: (patch: DatePatch) => void }) {
  const other: Who = who === 'Jordan' ? 'Rizza' : 'Jordan'
  const notes = { Jordan: d.jordanNote, Rizza: d.rizzaNote }
  const [writing, setWriting] = useState(false)
  const [text, setText] = useState('')

  if (notes.Jordan && notes.Rizza && !writing) {
    return (
      <div className="mt-4 space-y-2 border-t border-ash-100 pt-3">
        {(['Rizza', 'Jordan'] as const).map((name) => (
          <div key={name} className={`rounded-xl px-3 py-2 ${name === 'Rizza' ? 'bg-lav-50' : 'bg-ash-50'}`}>
            <p className="text-xs font-bold text-ash-400">{name}’s note</p>
            <p className="whitespace-pre-wrap font-hand text-lg leading-snug text-ash-700">{notes[name]}</p>
          </div>
        ))}
        <button
          onClick={() => {
            setText(notes[who])
            setWriting(true)
          }}
          className="text-xs font-semibold text-lav-600 hover:text-lav-700"
        >
          edit my note
        </button>
      </div>
    )
  }

  if (writing) {
    return (
      <div className="pop-in mt-4 space-y-2 border-t border-ash-100 pt-3">
        <p className="text-sm font-semibold text-ash-600">My note, {who}</p>
        <textarea
          autoFocus
          rows={4}
          maxLength={4000}
          className="field resize-y"
          placeholder={`Stays sealed until ${other} writes theirs too.`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={() => {
              setWriting(false)
              onSave(who === 'Jordan' ? { jordanNote: text.trim() } : { rizzaNote: text.trim() })
            }}
            className="rounded-full bg-lav-600 px-4 py-2 text-sm font-bold text-white hover:bg-lav-700"
          >
            Seal it
          </button>
          <button onClick={() => setWriting(false)} className="px-3 text-sm text-ash-500 hover:text-ash-700">
            Later
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-1 border-t border-ash-100 pt-3 text-xs text-ash-500">
      <p>
        🔒 {notes[who] ? 'Your note is sealed.' : 'You haven’t written yours yet.'}{' '}
        {notes[other] ? `${other} wrote theirs.` : `Waiting on ${other}.`} Both open once you’ve both written.
      </p>
      <button
        onClick={() => {
          setText(notes[who])
          setWriting(true)
        }}
        className="font-semibold text-lav-600 hover:text-lav-700"
      >
        {notes[who] ? 'edit my note' : 'write my note'}
      </button>
    </div>
  )
}

function PlannedCard({
  d,
  today,
  onDone,
  onEdit,
  onCancel,
}: {
  d: DateRow
  today: string
  onDone: (id: number) => void
  onEdit: Props['onEdit']
  onCancel: Props['onCancel']
}) {
  const diff = daysBetween(today, d.day)
  const mood = moodOf(d.category)
  const isPast = diff < 0

  function cancel() {
    if (!confirm(`Cancel “${d.title}”? We can always book it again.`)) return
    onCancel(d.id)
  }

  return (
    <li className="card pop-in flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-2xl bg-lav-100 px-3 py-2 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-lav-700">
            {prettyDate(d.day, { weekday: undefined, day: undefined, month: 'short' })}
          </p>
          <p className="font-display text-2xl leading-none text-lav-800">{Number(d.day.slice(8))}</p>
        </div>
        <div className="flex-1">
          <p className="font-display text-xl leading-tight text-ash-900">{d.title}</p>
          <p className="mt-0.5 text-sm text-ash-500">
            {prettyDate(d.day)}
            {d.time && ` · ${prettyTime(d.time)}`} ·{' '}
            <span className={diff <= 1 && diff >= 0 ? 'font-bold text-lav-600' : ''}>{relativeDays(diff)}</span>
          </p>
        </div>
        <span title={mood.label} className="text-2xl">
          {mood.emoji}
        </span>
      </div>

      {d.place && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-ash-600">
          <MapPin className="h-4 w-4 text-lav-500" /> {d.place}
        </p>
      )}
      {d.note && (
        <p className="mt-3 whitespace-pre-wrap rounded-xl bg-ash-50 px-3 py-2 font-hand text-xl leading-snug text-ash-700">
          {d.note} <span className="text-base text-ash-400">— {d.bookedBy}</span>
        </p>
      )}
      {!d.note && <p className="mt-3 text-xs text-ash-400">booked by {d.bookedBy}</p>}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        <button
          onClick={() => onDone(d.id)}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition ${
            isPast ? 'bg-lav-600 text-white hover:bg-lav-700' : 'border border-ash-200 text-ash-700 hover:bg-ash-50'
          }`}
        >
          <Check className="h-4 w-4" /> {isPast ? 'How did it go?' : 'We did it'}
        </button>
        <a
          href={calendarLink(d)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-ash-200 px-4 py-2 text-sm font-semibold text-ash-700 hover:bg-ash-50"
        >
          <CalendarDays className="h-4 w-4" /> Google Calendar
        </a>
        <button
          onClick={() => onEdit(d)}
          className="inline-flex items-center gap-1.5 rounded-full border border-ash-200 px-4 py-2 text-sm font-semibold text-ash-700 hover:bg-ash-50"
        >
          <Pencil className="h-4 w-4" /> Edit
        </button>
        <button
          onClick={cancel}
          aria-label="Cancel date"
          className="ml-auto rounded-full p-2 text-ash-400 hover:bg-ash-50 hover:text-ash-700"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  )
}

const VIBES = ['🥰 kilig', '😂 laughed a lot', '🕯️ so cozy', '🍜 so full', '🧭 little adventure', '😌 peaceful']

// Small inline card that opens right after a date is marked done.
function ReviewCard({
  d,
  onSave,
  onClose,
}: {
  d: DateRow
  onSave: (patch: { memory: string; rating: number }) => void
  onClose: () => void
}) {
  const [rating, setRating] = useState(d.rating || 5)
  const [vibe, setVibe] = useState('')
  const [memory, setMemory] = useState(d.memory)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  function save() {
    const text = memory.trim()
    onSave({ memory: vibe ? (text ? `${vibe} — ${text}` : vibe) : text, rating })
  }

  return (
    <div ref={ref} className="pop-in mt-3 space-y-3 rounded-2xl bg-lav-50 p-4">
      <p className="text-sm font-semibold text-ash-600">How was the date?</p>
      <Hearts value={rating} onChange={setRating} />
      <div className="flex flex-wrap gap-1.5">
        {VIBES.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVibe(vibe === v ? '' : v)}
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
              vibe === v ? 'border-lav-500 bg-lav-500 text-white' : 'border-ash-200 text-ash-600 hover:border-lav-300'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      <textarea
        rows={4}
        maxLength={3900}
        className="field resize-y"
        placeholder="The part I want to remember…"
        value={memory}
        onChange={(e) => setMemory(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          onClick={save}
          className="rounded-full bg-lav-600 px-4 py-2 text-sm font-bold text-white hover:bg-lav-700"
        >
          Save memory
        </button>
        <button onClick={onClose} className="px-3 text-sm text-ash-500 hover:text-ash-700">
          Later
        </button>
      </div>
    </div>
  )
}

function Hearts({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <div className="mt-2 flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          aria-label={`${n} hearts`}
          className={onChange ? 'transition hover:scale-110' : 'cursor-default'}
        >
          <Heart className={`h-5 w-5 ${n <= value ? 'fill-lav-500 text-lav-500' : 'text-ash-300'}`} />
        </button>
      ))}
    </div>
  )
}
