import { useState } from 'react'
import { Lock } from 'lucide-react'
import { US } from '@/lib/us'

// A little lock on the door, not real security: the code lives in the page.
// Once it's entered, this device remembers it (see src/lib/look.ts).
const PASSCODE = '0831'
export const PASS_KEY = 'beh-pass'

export function PasscodeGate() {
  const [code, setCode] = useState('')
  const [wrong, setWrong] = useState(false)

  function unlock(e: React.FormEvent) {
    e.preventDefault()
    if (code !== PASSCODE) {
      setWrong(true)
      setCode('')
      return
    }
    localStorage.setItem(PASS_KEY, 'ok')
    document.documentElement.classList.remove('locked')
  }

  return (
    <div className="gate fixed inset-0 z-50 place-items-center bg-lav-50 px-5">
      <form onSubmit={unlock} className="card pop-in w-full max-w-sm p-8 text-center">
        <Lock className="mx-auto h-8 w-8 text-lav-500" />
        <p className="mt-3 font-display text-3xl text-ash-900">
          {US.callsign}
          <span className="text-lav-500">.</span>
        </p>
        <p className="mt-1 font-hand text-2xl text-lav-600">just for the two of us</p>
        <input
          autoFocus
          inputMode="numeric"
          maxLength={4}
          aria-label="Passcode"
          className="field mt-6 text-center text-2xl tracking-[0.5em]"
          placeholder="••••"
          value={code}
          onChange={(e) => {
            setWrong(false)
            setCode(e.target.value.replace(/\D/g, ''))
          }}
        />
        {wrong && <p className="mt-2 text-sm text-ash-500">Not quite. You know the day 💜</p>}
        <button className="mt-4 w-full rounded-full bg-lav-600 px-6 py-3 font-bold text-white transition hover:bg-lav-700">
          Come in
        </button>
      </form>
    </div>
  )
}
