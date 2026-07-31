import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './auth-context'

/**
 * Guards a subtree of routes.
 * - Redirects unauthenticated users to /login (preserving intended destination).
 * - If `allowedRoles` is passed, users with a different role are redirected
 *   to their own home rather than shown a blank/broken page.
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isLoading, role } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void text-muted font-mono text-sm">
        Verifying session…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
   const home = role === 'RECRUITER'
  ? '/recruiter/dashboard'
  : '/candidate/dashboard'
    return <Navigate to={home} replace />
  }

  return <Outlet />
}
