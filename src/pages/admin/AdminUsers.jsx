import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AdminUsers() {
  const { getAllUsers, deleteUser } = useAuth()
  const [users, setUsers]   = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    setUsers(getAllUsers())
  }, [])

  function handleDelete(accNo) {
    if (!window.confirm(`Delete account ${accNo}? This cannot be undone.`)) return
    deleteUser(accNo)
    setUsers(getAllUsers())
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    String(u.accNo).includes(search) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">👥 Manage Users</h2>
      <input
        placeholder="Search by name, email or account no..." value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">A/C No</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Balance</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-6 text-gray-400">No users found.</td></tr>
            ) : filtered.map(u => (
              <tr key={u.accNo} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-blue-700">{u.accNo}</td>
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3 text-green-700 font-semibold">₹ {Number(u.balance).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(u.accNo)}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold border border-red-300 px-2 py-1 rounded hover:bg-red-50 transition">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
