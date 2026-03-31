import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const isAdmin = currentUser?.role === 'admin'

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <span className="text-xl font-bold tracking-wide">🏦 BankMS</span>
      <div className="flex items-center gap-6 text-sm font-medium">
        {isAdmin ? (
          <>
            <Link to="/admin" className="hover:text-blue-200">Dashboard</Link>
            <Link to="/admin/users" className="hover:text-blue-200">Users</Link>
            <Link to="/admin/transactions" className="hover:text-blue-200">Transactions</Link>
          </>
        ) : (
          <>
            <Link to="/user" className="hover:text-blue-200">Dashboard</Link>
            <Link to="/user/deposit" className="hover:text-blue-200">Deposit</Link>
            <Link to="/user/withdraw" className="hover:text-blue-200">Withdraw</Link>
            <Link to="/user/transfer" className="hover:text-blue-200">Transfer</Link>
            <Link to="/user/history" className="hover:text-blue-200">History</Link>
          </>
        )}
        <button onClick={handleLogout} className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-blue-100">
          Logout
        </button>
      </div>
    </nav>
  )
}
