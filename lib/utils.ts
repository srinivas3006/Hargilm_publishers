import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Guards against open-redirect attacks: only allows same-origin, relative
 * paths (a single leading "/"). Rejects protocol-relative ("//host") and
 * absolute (http(s)://, javascript:, etc.) values.
 */
export function getSafeRedirect(target: string | null | undefined, fallback = '/'): string {
  if (!target) return fallback
  if (!target.startsWith('/') || target.startsWith('//')) return fallback
  try {
    // Reject anything that resolves to a different origin once parsed.
    const url = new URL(target, 'http://localhost')
    if (url.origin !== 'http://localhost') return fallback
    return `${url.pathname}${url.search}${url.hash}` || fallback
  } catch {
    return fallback
  }
}
