// CDN caching for the page and its data. Netlify serves the cached copy until a
// write purges the tag, so most visits never wake a function or the database.
export const LOVE_CACHE_TAG = 'love-data'

// Day counters are computed for "today" in Manila, so a cached copy must not
// outlive Manila midnight.
function secondsUntilManilaMidnight(now = Date.now()) {
  const manila = now + 8 * 3600_000 // Manila is UTC+8 all year
  const day = 86_400_000
  return Math.max(60, Math.floor((day - (manila % day)) / 1000))
}

export function loveCacheHeaders(): Record<string, string> {
  return {
    // Browsers always revalidate, so both of us see changes right away.
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'Netlify-CDN-Cache-Control': `public, durable, s-maxage=${secondsUntilManilaMidnight()}, stale-while-revalidate=60`,
    'Netlify-Cache-Tag': LOVE_CACHE_TAG,
  }
}
