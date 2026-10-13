import { useMemo, useState } from 'react'
import { CalendarHeart, RefreshCw } from 'lucide-react'
import { IDEAS, MOODS, moodOf, type Idea, type Mood } from '@/lib/us'
import { WhoPicks } from './WhoPicks'

const MAX_SLICES = 10
const SIZE = 320
const R = SIZE / 2
const SLICE_COLORS = ['#c6b3e6', '#ececee', '#ad93d8', '#d9d9dd', '#ddd1f1', '#b9b9c0']

function point(angleDeg: number, radius: number) {
  const a = (angleDeg * Math.PI) / 180
  return [R + radius * Math.sin(a), R - radius * Math.cos(a)]
}

function slicePath(start: number, end: number) {
  const [x0, y0] = point(start, R - 4)
  const [x1, y1] = point(end, R - 4)
  const large = end - start > 180 ? 1 : 0
  return `M ${R} ${R} L ${x0} ${y0} A ${R - 4} ${R - 4} 0 ${large} 1 ${x1} ${y1} Z`
}

function shuffle<T>(arr: T[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function SpinWheel({ onBook }: { onBook: (idea: Idea) => void }) {
  const [mood, setMood] = useState<Mood | 'all'>('all')
  const [order, setOrder] = useState<Idea[]>(IDEAS)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<Idea | null>(null)

  const slices = useMemo(
    () => order.filter((i) => mood === 'all' || i.mood === mood).slice(0, MAX_SLICES),
    [order, mood],
  )
  const seg = 360 / slices.length

  function changeMood(m: Mood | 'all') {
    if (spinning) return
    setMood(m)
    setResult(null)
    setRotation((r) => r - (r % 360))
  }

  function spin() {
    if (spinning || slices.length === 0) return
    const target = Math.floor(Math.random() * slices.length)
    const jitter = (Math.random() - 0.5) * seg * 0.6
    const landAt = 360 - (target * seg + seg / 2) + jitter
    const base = rotation - (rotation % 360)
    setResult(null)
    setSpinning(true)
    setRotation(base + 360 * 5 + landAt)
    window.setTimeout(() => {
      setSpinning(false)
      setResult(slices[target])
    }, 4200)
  }

  return (
    <section id="spin" className="mx-auto max-w-5xl px-5 py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-hand text-2xl text-lav-600">can’t decide?</p>
          <h2 className="font-display text-4xl text-ash-900">Spin for a Davao date</h2>
        </div>
        <button
          onClick={() => !spinning && (setOrder(shuffle(IDEAS)), setResult(null))}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ash-500 hover:text-lav-600"
        >
          <RefreshCw className="h-4 w-4" /> Shuffle ideas
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[{ id: 'all' as const, label: 'Surprise me', emoji: '🎲' }, ...MOODS].map((m) => (
          <button
            key={m.id}
            onClick={() => changeMood(m.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              mood === m.id
                ? 'border-lav-600 bg-lav-600 text-white'
                : 'border-ash-200 bg-white text-ash-600 hover:border-lav-300'
            }`}
          >
            {m.emoji} {m.label}
          </button>
        ))}
      </div>

      <div className="card grid items-center gap-8 p-6 md:grid-cols-[auto_1fr] md:p-10">
        <div className="relative mx-auto w-[min(320px,80vw)]">
          <div className="absolute left-1/2 top-[-10px] z-10 -translate-x-1/2 text-3xl drop-shadow">▼</div>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full drop-shadow-xl">
            <g
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: '50% 50%',
                transition: spinning ? 'transform 4.2s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              }}
            >
              {slices.map((idea, i) => {
                const mid = i * seg + seg / 2
                const [tx, ty] = point(mid, R * 0.6)
                return (
                  <g key={idea.title}>
                    <path
                      d={slices.length === 1 ? `M ${R} 4 A ${R - 4} ${R - 4} 0 1 1 ${R - 0.01} 4 Z` : slicePath(i * seg, (i + 1) * seg)}
                      fill={SLICE_COLORS[i % SLICE_COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                    />
                    <text
                      x={tx}
                      y={ty}
                      transform={`rotate(${mid > 180 ? mid + 90 : mid - 90} ${tx} ${ty})`}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#2f2f35"
                      style={{ fontSize: slices.length > 6 ? 11 : 13, fontWeight: 700 }}
                    >
                      {moodOf(idea.mood).emoji} {idea.short}
                    </text>
                  </g>
                )
              })}
            </g>
            <circle cx={R} cy={R} r={30} fill="white" stroke="#ddd1f1" strokeWidth={4} />
            <text x={R} y={R + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 22 }}>
              💜
            </text>
          </svg>
          <button
            onClick={spin}
            disabled={spinning}
            className="mt-6 w-full rounded-full bg-ash-800 py-3 font-bold text-white transition hover:bg-lav-600 disabled:opacity-60"
          >
            {spinning ? 'Spinning…' : 'Spin, Beh!'}
          </button>
        </div>

        <div className="min-h-[220px]">
          {result ? (
            <div className="pop-in">
              <span className="rounded-full bg-lav-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lav-700">
                {moodOf(result.mood).emoji} {moodOf(result.mood).label}
              </span>
              <h3 className="mt-3 font-display text-3xl text-ash-900">{result.title}</h3>
              <p className="mt-1 text-ash-500">📍 {result.place}</p>
              <p className="mt-5 font-hand text-2xl leading-snug text-lav-700">the twist: {result.twist}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => onBook(result)}
                  className="inline-flex items-center gap-2 rounded-full bg-lav-600 px-5 py-2.5 font-bold text-white hover:bg-lav-700"
                >
                  <CalendarHeart className="h-4 w-4" /> Book this date
                </button>
                <button
                  onClick={spin}
                  className="rounded-full border border-ash-200 px-5 py-2.5 font-semibold text-ash-600 hover:bg-ash-50"
                >
                  Spin again
                </button>
              </div>
            </div>
          ) : (
            <div className="text-ash-500">
              <p className="font-display text-2xl text-ash-800">
                {spinning ? 'Where are we going…' : 'Pick a mood, then spin.'}
              </p>
              <p className="mt-2 max-w-sm">
                Every idea comes with a small twist, so even our usual spots feel a little new. Quiet days count too.
              </p>
            </div>
          )}
        </div>
      </div>

      <WhoPicks />
    </section>
  )
}
