import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import UserDashboard from './pages/user/UserDashboard'
import Deposit from './pages/user/Deposit'
import Withdraw from './pages/user/Withdraw'
import Transfer from './pages/user/Transfer'
import History from './pages/user/History'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTransactions from './pages/admin/AdminTransactions'

function Layout({ children }) {
  const { currentUser } = useAuth()
  return (
    <div className="min-h-screen bg-gray-100">
      {currentUser && <Navbar />}
      <main className="py-6">{children}</main>
    </div>
  )
}

function AppRoutes() {
  const { currentUser } = useAuth()
  return (
    <Layout>
      <Routes>
        <Route path="/" element={
          currentUser
            ? <Navigate to={currentUser.role === 'admin' ? '/admin' : '/user'} replace />
            : <Login />
        } />

        {/* User Routes */}
        <Route path="/user"          element={<PrivateRoute role="user"><UserDashboard /></PrivateRoute>} />
        <Route path="/user/deposit"  element={<PrivateRoute role="user"><Deposit /></PrivateRoute>} />
        <Route path="/user/withdraw" element={<PrivateRoute role="user"><Withdraw /></PrivateRoute>} />
        <Route path="/user/transfer" element={<PrivateRoute role="user"><Transfer /></PrivateRoute>} />
        <Route path="/user/history"  element={<PrivateRoute role="user"><History /></PrivateRoute>} />

        {/* Admin Routes */}
        <Route path="/admin"               element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/users"         element={<PrivateRoute role="admin"><AdminUsers /></PrivateRoute>} />
        <Route path="/admin/transactions"  element={<PrivateRoute role="admin"><AdminTransactions /></PrivateRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
