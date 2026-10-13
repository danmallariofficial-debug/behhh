import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

// Soft dark mode for late-night browsing. The choice is saved on this device only;
// a tiny script in __root applies it before the page paints.
export function ThemeToggle({ className = '' }: { className?: string }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('beh-theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Lights on' : 'Late-night mode'}
      className={`rounded-full p-2 text-ash-500 transition hover:bg-ash-100 hover:text-lav-600 ${className}`}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
