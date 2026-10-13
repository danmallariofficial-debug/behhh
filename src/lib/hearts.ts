// Tiny celebratory hearts that float up the screen.
export function burstHearts(count = 18) {
  if (typeof document === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const glyphs = ['💜', '🤍', '🩶', '✨', '💜']
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span')
    el.className = 'heart-float'
    el.textContent = glyphs[i % glyphs.length]
    el.style.left = `${Math.random() * 100}vw`
    el.style.fontSize = `${18 + Math.random() * 22}px`
    el.style.animationDelay = `${Math.random() * 0.8}s`
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 4800)
  }
}
