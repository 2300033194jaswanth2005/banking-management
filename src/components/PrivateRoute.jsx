import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children, role }) {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/" replace />
  if (role && currentUser.role !== role) return <Navigate to="/" replace />
  return children
}
