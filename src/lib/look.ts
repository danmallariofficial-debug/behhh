// Puts the saved theme and the passcode lock on <html>. It runs once as an
// inline script before first paint, and again once React has taken over the
// page: if hydration ever falls back to a client render (for example when
// something injects extra tags into <head>), React resets <html>'s attributes
// and both classes would otherwise be lost.
export function applySavedLook() {
  try {
    const c = document.documentElement.classList
    const t = localStorage.getItem('beh-theme')
    if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) c.add('dark')
    if (localStorage.getItem('beh-pass') !== 'ok') c.add('locked')
  } catch {}
}

export const applySavedLookScript = `(${applySavedLook.toString()})()`
