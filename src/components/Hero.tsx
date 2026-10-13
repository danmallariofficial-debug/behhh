import { useState } from 'react'
import { Heart, Sparkles, Undo2 } from 'lucide-react'
import { US, daysBetween, ordinal, prettyDate, todayISO } from '@/lib/us'
import { burstHearts } from '@/lib/hearts'
import type { Who } from '@/lib/who'

type Props = {
  who: Who
  officialSince: string | null
  onSetOfficial: (since: string | null) => Promise<void>
}

export function Hero({ who, officialSince, onSetOfficial }: Props) {
  const today = todayISO()
  const daysSince = Math.max(0, daysBetween(US.since, today))
  const [asking, setAsking] = useState(false)
  const [pick, setPick] = useState(today)
  const [saving, setSaving] = useState(false)

  const other = who === 'Jordan' ? 'Rizza' : 'Jordan'
  const greeting =
    who === 'Rizza'
      ? 'Jordan made this little place for us. No pressure, just dates.'
      : 'Our little place for planning dates. Take your time, Rizza.'

  async function confirmOfficial() {
    setSaving(true)
    await onSetOfficial(pick)
    setSaving(false)
    setAsking(false)
    burstHearts(32)
  }

  return (
    <header className="relative mx-auto max-w-5xl px-5 pb-10 pt-10 sm:pt-16">
      <p className="font-hand text-2xl text-lav-600">hi, {US.callsign} ✿</p>
      <h1 className="mt-1 font-display text-5xl leading-[1.05] text-ash-900 sm:text-7xl">
        Jordan <span className="beat text-lav-500">&amp;</span> Rizza
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ash-600">{greeting}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-[1.2fr_1fr]">
        <div className="card relative overflow-hidden p-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-lav-200/60 blur-2xl" />
          {officialSince ? (
            <>
              <p className="text-sm font-bold uppercase tracking-widest text-lav-600">Officially us</p>
              <p className="mt-2 font-display text-6xl text-ash-900">
                {Math.max(0, daysBetween(officialSince, today))}
                <span className="ml-2 text-2xl text-ash-500">days</span>
              </p>
              <p className="mt-2 text-ash-600">
                since {prettyDate(officialSince, { year: 'numeric' })}, and {daysSince} days since the day Jordan
                told you.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold uppercase tracking-widest text-lav-600">Since the day I told you</p>
              <p className="mt-2 font-display text-6xl text-ash-900">
                {daysSince}
                <span className="ml-2 text-2xl text-ash-500">days</span>
              </p>
              <p className="mt-2 text-ash-600">
                {prettyDate(US.since, { year: 'numeric', weekday: 'long' })}. Still here, still happy to wait. 🩶
              </p>
            </>
          )}
        </div>

        <div className="card flex flex-col justify-between gap-4 p-6">
          {officialSince ? (
            <>
              <div>
                <p className="flex items-center gap-2 font-display text-2xl text-ash-900">
                  <Sparkles className="h-5 w-5 text-lav-500" /> It’s official
                </p>
                <p className="mt-1 text-ash-600">
                  Every month on the {ordinal(Number(officialSince.slice(8)))} is ours now.
                </p>
              </div>
              <button
                onClick={() => onSetOfficial(null)}
                className="inline-flex items-center gap-1 self-start text-xs text-ash-400 hover:text-ash-600"
              >
                <Undo2 className="h-3 w-3" /> pressed this by mistake
              </button>
            </>
          ) : asking ? (
            <div className="pop-in space-y-3">
              <p className="font-display text-xl text-ash-900">Did {who === 'Jordan' ? 'she' : 'you'} say yes? 🥹</p>
              <label className="block text-sm text-ash-600">
                The day we became official
                <input
                  type="date"
                  className="field mt-1"
                  value={pick}
                  min={US.since}
                  max={today}
                  onChange={(e) => setPick(e.target.value)}
                />
              </label>
              <div className="flex gap-2">
                <button
                  disabled={saving || !pick}
                  onClick={confirmOfficial}
                  className="flex-1 rounded-full bg-lav-600 px-4 py-2.5 font-bold text-white transition hover:bg-lav-700 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Yes, we’re official'}
                </button>
                <button
                  onClick={() => setAsking(false)}
                  className="rounded-full border border-ash-200 px-4 py-2.5 text-ash-600 hover:bg-ash-50"
                >
                  Not yet
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <p className="font-display text-2xl text-ash-900">Our anniversary</p>
                <p className="mt-1 text-ash-600">
                  For the day {other === 'Rizza' ? 'Rizza is' : 'you’re'} ready. This button will wait as long as it
                  takes.
                </p>
              </div>
              <button
                onClick={() => setAsking(true)}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-ash-800 px-5 py-3 font-bold text-white transition hover:bg-lav-600"
              >
                <Heart className="h-4 w-4 transition group-hover:fill-white" /> We’re official
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
