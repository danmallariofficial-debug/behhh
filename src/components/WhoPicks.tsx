import { useState } from 'react'
import type { Who } from '@/lib/who'

// A coin toss for who gets to choose the spot. Lavender side is Rizza, gray is Jordan.
export function WhoPicks() {
  const [turns, setTurns] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [winner, setWinner] = useState<Who | null>(null)

  function flip() {
    if (flipping) return
    const next: Who = Math.random() < 0.5 ? 'Rizza' : 'Jordan'
    // Always spin forward a few times, landing on the winner's face.
    const base = turns - (turns % 360) + 360 * 4
    setWinner(null)
    setFlipping(true)
    setTurns(base + (next === 'Jordan' ? 180 : 0))
    window.setTimeout(() => {
      setFlipping(false)
      setWinner(next)
    }, 1300)
  }

  return (
    <div className="card mt-6 flex flex-col items-center gap-5 p-6 sm:flex-row md:px-10">
      <button
        onClick={flip}
        disabled={flipping}
        aria-label="Flip the coin"
        className="coin h-24 w-24 shrink-0"
        style={{ transform: `rotateY(${turns}deg)`, transition: flipping ? 'transform 1.3s cubic-bezier(0.3, 0.8, 0.3, 1)' : 'none' }}
      >
        <span className="coin-face bg-lav-500 text-white">R</span>
        <span className="coin-face coin-back bg-ash-600 text-white">J</span>
      </button>
      <div className="flex-1 text-center sm:text-left">
        <p className="font-hand text-2xl text-lav-600">who picks the spot?</p>
        <p className="font-display text-2xl text-ash-900" aria-live="polite">
          {flipping ? 'Flipping…' : winner ? `${winner} picks this time!` : 'Toss the coin to guide us, wherever it lands is a fun date either way!'}
        </p>
        {winner && !flipping && (
          <p className="pop-in mt-1 text-sm text-ash-500">
            {winner === 'Rizza' ? 'Anywhere you like, Beh. Jordan’s just happy to come along.' : 'Jordan chooses. Rizza gets veto power, as always.'}
          </p>
        )}
      </div>
      <button
        onClick={flip}
        disabled={flipping}
        className="rounded-full bg-ash-800 px-5 py-2.5 font-bold text-white transition hover:bg-lav-600 disabled:opacity-60"
      >
        {winner ? 'Best of three?' : 'Flip it'}
      </button>
    </div>
  )
}
