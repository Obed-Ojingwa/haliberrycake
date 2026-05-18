// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\admin\ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  children: React.ReactNode
}

/**
 * Wrap any admin route with this to enforce authentication.
 * Unauthenticated visitors are redirected to /admin/login,
 * with the original URL preserved in `state.from` so we can
 * redirect back after login.
 */
export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location }}
        replace
      />
    )
  }

  return <>{children}</>
}