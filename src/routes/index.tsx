import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '@/components/Hero'
import { SpinWheel } from '@/components/SpinWheel'
import { BookDate, type FormDraft } from '@/components/BookDate'
import { Memories, OurDates, type DatePatch } from '@/components/OurDates'
import { SpecialDays, type OurDay } from '@/components/SpecialDays'
import { BucketList, type BucketRow } from '@/components/BucketList'
import { PasscodeGate } from '@/components/PasscodeGate'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { DateRow } from '@/components/OurDates'
import { bookDate, cancelDate, editDate, getLoveData, setOfficial } from '@/server/dates.functions'
import { US, moodOf } from '@/lib/us'
import { useWho } from '@/lib/who'
import { burstHearts } from '@/lib/hearts'

export const Route = createFileRoute('/')({
  loader: () => getLoveData(),
  // Loaded once with the page; after that the page keeps its own copy up to date.
  staleTime: Infinity,
  component: Home,
})

const byWhen = (a: DateRow, b: DateRow) => a.day.localeCompare(b.day) || a.time.localeCompare(b.time)

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'dates', label: 'Our dates' },
  { id: 'memories', label: 'Little memories' },
  { id: 'bucket', label: 'Bucket list' },
] as const
type Tab = (typeof TABS)[number]['id']

const tabFromHash = (): Tab => {
  const h = window.location.hash.slice(1)
  return TABS.some((t) => t.id === h) ? (h as Tab) : 'home'
}

// How often an open page quietly checks for the other person's changes. Most
// checks are answered by the CDN cache, so they cost next to nothing.
const SYNC_MS = 60_000

function Home() {
  const initial = Route.useLoaderData()
  const [dates, setDates] = useState<DateRow[]>(initial.dates)
  const [officialSince, setOfficialSince] = useState(initial.officialSince)
  const [bucket, setBucket] = useState<BucketRow[]>(initial.bucket)
  const [ourDays, setOurDays] = useState<OurDay[]>(initial.days)
  const [who, setWho] = useWho()
  const [draft, setDraft] = useState<FormDraft | null>(null)
  const [reviewing, setReviewing] = useState<number | null>(null)
  const [tab, setTabState] = useState<Tab>('home')

  useEffect(() => {
    const sync = () => setTabState(tabFromHash())
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  function setTab(t: Tab) {
    setTabState(t)
    history.pushState(null, '', t === 'home' ? window.location.pathname : `#${t}`)
    window.scrollTo({ top: 0 })
  }

  // Picks up what the other one changed on their phone: when this tab comes
  // back into view, and every so often while it stays open.
  useEffect(() => {
    async function refresh() {
      if (document.visibilityState !== 'visible') return
      try {
        const fresh = await getLoveData()
        setDates(fresh.dates)
        setOfficialSince(fresh.officialSince)
        setBucket(fresh.bucket)
        setOurDays(fresh.days)
      } catch {
        // Offline for a moment; the next check will catch up.
      }
    }
    const timer = setInterval(refresh, SYNC_MS)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  async function update(id: number, patch: DatePatch) {
    // Show the change right away, and put it back if the save fails.
    const before = dates
    setDates((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)))
    if (patch.status === 'done') burstHearts(10)
    try {
      await editDate({ data: { id, ...patch } })
    } catch {
      setDates(before)
      alert('Hmm, that didn’t save. Try again?')
    }
  }

  async function remove(id: number) {
    const before = dates
    setDates((ds) => ds.filter((d) => d.id !== id))
    try {
      await cancelDate({ data: { id } })
    } catch {
      setDates(before)
      alert('Hmm, that didn’t go through. Try again?')
    }
  }

  return (
    <>
      <PasscodeGate />
      <div id="app" className="min-h-screen">
        <nav className="sticky top-0 z-40 border-b border-ash-100/80 bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 pt-3">
            <button onClick={() => setTab('home')} className="font-display text-xl text-ash-900">
              {US.callsign}
              <span className="text-lav-500">.</span>
            </button>
            <ThemeToggle className="ml-auto" />
            <div className="flex items-center gap-1 rounded-full bg-ash-100 p-1 text-sm font-bold">
              <span className="hidden pl-2 pr-1 font-semibold text-ash-400 md:inline">I’m</span>
              {(['Rizza', 'Jordan'] as const).map((name) => (
                <button
                  key={name}
                  onClick={() => setWho(name)}
                  className={`rounded-full px-3 py-1 transition ${
                    who === name
                      ? name === 'Rizza'
                        ? 'bg-lav-500 text-white'
                        : 'bg-ash-600 text-white'
                      : 'text-ash-500 hover:text-ash-800'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-3 text-sm font-semibold">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? 'page' : undefined}
                className={`shrink-0 border-b-2 px-3 py-2.5 transition ${
                  tab === t.id ? 'border-lav-500 text-lav-700' : 'border-transparent text-ash-500 hover:text-lav-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </nav>

        {tab === 'home' && (
          <>
            <Hero
              who={who}
              officialSince={officialSince}
              onSetOfficial={async (since) => {
                await setOfficial({ data: { since } })
                setOfficialSince(since)
              }}
            />
            <SpinWheel
              onBook={(idea) => {
                setDraft({ title: idea.title, place: idea.place, category: idea.mood, note: `Twist: ${idea.twist}` })
                setTab('dates')
              }}
            />
            <SpecialDays officialSince={officialSince} ours={ourDays} setOurs={setOurDays} />
          </>
        )}

        {tab === 'dates' && (
          <>
            <BookDate
              who={who}
              draft={draft}
              onStopEditing={() => setDraft(null)}
              onSubmit={async (data, id) => {
                if (id) {
                  const { bookedBy: _, ...details } = data
                  const row = await editDate({ data: { id, ...details } })
                  if (row) setDates((ds) => ds.map((d) => (d.id === id ? row : d)).sort(byWhen))
                  return
                }
                const row = await bookDate({ data })
                burstHearts(14)
                setDates((ds) => [...ds, row].sort(byWhen))
              }}
            />
            <OurDates
              dates={dates}
              onEdit={(d) =>
                setDraft({
                  id: d.id,
                  title: d.title,
                  place: d.place,
                  category: moodOf(d.category).id,
                  note: d.note,
                  day: d.day,
                  time: d.time,
                })
              }
              onDone={(id) => {
                setReviewing(id)
                update(id, { status: 'done' })
                setTab('memories')
              }}
              onCancel={remove}
            />
          </>
        )}

        {tab === 'memories' && (
          <Memories
            dates={dates}
            who={who}
            reviewing={reviewing}
            setReviewing={setReviewing}
            onUpdate={update}
            onDelete={remove}
          />
        )}

        {tab === 'bucket' && <BucketList items={bucket} setItems={setBucket} />}

        <footer className="mx-auto max-w-5xl px-5 pb-14 pt-6 text-center">
          <p className="font-hand text-2xl text-ash-500">
            made by Jordan, for Rizza. take all the time you need, {US.callsign}. 💜🩶
          </p>
        </footer>
      </div>
    </>
  )
}
