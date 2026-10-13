import { useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { addBucketItem, deleteBucketItem, tickBucketItem } from '@/server/dates.functions'
import { BUCKET } from '@/lib/us'

export type BucketRow = { id: string; emoji: string; title: string; hint: string; done: boolean; position: number }

type Props = {
  items: BucketRow[]
  setItems: React.Dispatch<React.SetStateAction<BucketRow[]>>
}

// Saved in the database, so a tick on one phone shows up on the other.
export function BucketList({ items, setItems }: Props) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ emoji: '', title: '', hint: '' })

  // Show the change right away, and put it back if the save fails.
  async function save(next: (items: BucketRow[]) => BucketRow[], write: () => Promise<unknown>) {
    const before = items
    setItems(next)
    try {
      await write()
    } catch {
      setItems(before)
      alert('Hmm, that didn’t save. Try again?')
    }
  }

  function toggle(b: BucketRow) {
    save(
      (xs) => xs.map((x) => (x.id === b.id ? { ...x, done: !b.done } : x)),
      () => tickBucketItem({ data: { id: b.id, done: !b.done } }),
    )
  }

  function remove(item: BucketRow) {
    if (!confirm(`Take “${item.title}” off the list?`)) return
    save(
      (xs) => xs.filter((i) => i.id !== item.id),
      () => deleteBucketItem({ data: { id: item.id } }),
    )
  }

  async function addAll(news: Omit<BucketRow, 'done' | 'position'>[]) {
    try {
      const rows = await Promise.all(news.map((data) => addBucketItem({ data })))
      const added = rows.filter((r) => r !== null)
      setItems((xs) => [...xs, ...added.filter((r) => !xs.some((x) => x.id === r.id))])
    } catch {
      alert('Hmm, that didn’t save. Try again?')
    }
  }

  function add(e: React.FormEvent) {
    e.preventDefault()
    const title = draft.title.trim()
    if (!title) return
    addAll([{ id: `own-${Date.now()}`, emoji: draft.emoji.trim() || '💜', title, hint: draft.hint.trim() }])
    setDraft({ emoji: '', title: '', hint: '' })
    setAdding(false)
  }

  const missing = BUCKET.filter((b) => !items.some((i) => i.id === b.id))
  const count = items.filter((b) => b.done).length

  return (
    <section id="bucket" className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-hand text-2xl text-lav-600">someday, together</p>
          <h2 className="font-display text-4xl text-ash-900">Our bucket list</h2>
        </div>
        <div className="flex items-center gap-4">
          {items.length > 0 && (
            <p className="text-sm font-semibold text-ash-500">
              {count} of {items.length} done {count === items.length && '💜'}
            </p>
          )}
          <button
            onClick={() => setAdding((a) => !a)}
            className="inline-flex items-center gap-1.5 rounded-full bg-lav-600 px-4 py-2 text-sm font-bold text-white hover:bg-lav-700"
          >
            <Plus className="h-4 w-4" /> Add our own
          </button>
        </div>
      </div>

      {adding && (
        <form onSubmit={add} className="card pop-in mt-6 grid gap-3 p-5 sm:grid-cols-[5rem_1fr_1fr_auto]">
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
            className="field"
            placeholder="Something we want to do"
            maxLength={60}
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
          <input
            className="field"
            placeholder="A little note (optional)"
            maxLength={80}
            value={draft.hint}
            onChange={(e) => setDraft({ ...draft, hint: e.target.value })}
          />
          <button className="rounded-full bg-ash-800 px-5 py-2.5 font-bold text-white transition hover:bg-lav-600">
            Add it
          </button>
        </form>
      )}

      {items.length === 0 ? (
        <p className="card mt-6 p-8 text-center text-ash-500">The list is empty. Add something we both want to do someday.</p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => {
            const isDone = b.done
            return (
              <li key={b.id} className="group relative">
                <button
                  onClick={() => toggle(b)}
                  aria-pressed={isDone}
                  className={`card flex h-full w-full items-start gap-3 p-4 pr-10 text-left transition hover:-translate-y-0.5 ${
                    isDone ? 'border-lav-300! bg-lav-50!' : ''
                  }`}
                >
                  <span className="text-2xl">{b.emoji}</span>
                  <span className="flex-1">
                    <span className={`block font-display text-lg ${isDone ? 'text-lav-700 line-through decoration-lav-400' : 'text-ash-900'}`}>
                      {b.title}
                    </span>
                    {b.hint && <span className="block text-sm text-ash-500">{b.hint}</span>}
                  </span>
                  <span
                    className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
                      isDone ? 'border-lav-500 bg-lav-500 text-white' : 'border-ash-300'
                    }`}
                  >
                    {isDone && <Check className="h-3.5 w-3.5" />}
                  </span>
                </button>
                <button
                  onClick={() => remove(b)}
                  aria-label={`Remove ${b.title}`}
                  className="absolute bottom-2 right-2 rounded-full p-1.5 text-ash-400 transition hover:bg-ash-100 hover:text-ash-700 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {missing.length > 0 && (
        <button
          onClick={() => addAll(missing)}
          className="mt-4 text-xs text-ash-400 hover:text-ash-600"
        >
          bring back the {missing.length} original idea{missing.length > 1 && 's'} we removed
        </button>
      )}
    </section>
  )
}
