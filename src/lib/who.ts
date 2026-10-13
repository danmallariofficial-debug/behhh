import { useEffect, useState } from 'react'

export type Who = 'Jordan' | 'Rizza'

// Remembers which of us is using this device. Defaults to Rizza: the site is for her.
export function useWho() {
  const [who, setWhoState] = useState<Who>('Rizza')
  useEffect(() => {
    const saved = localStorage.getItem('beh-who')
    if (saved === 'Jordan' || saved === 'Rizza') setWhoState(saved)
  }, [])
  const setWho = (w: Who) => {
    setWhoState(w)
    localStorage.setItem('beh-who', w)
  }
  return [who, setWho] as const
}
