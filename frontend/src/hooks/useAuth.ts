// C:\Users\Melody\Documents\haliberrycake\frontend\src\hooks\useAuth.ts

/**
 * Lightweight client-side auth state.
 * The token is validated by the backend on every protected API call.
 * This hook just controls whether the admin UI is shown.
 */
export function useAuth() {
  const token = localStorage.getItem('haliberry_admin_token')

  const isAuthenticated = !!token && !isTokenExpired(token)

  function logout() {
    localStorage.removeItem('haliberry_admin_token')
    window.location.href = '/admin/login'
  }

  return { isAuthenticated, token, logout }
}

/** Decode JWT payload and check exp without a library dependency */
function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split('.')
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    if (!decoded.exp) return false
    return Date.now() / 1000 > decoded.exp
  } catch {
    return true // treat malformed tokens as expired
  }
}