import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AdminTransactions() {
  const { getAllTransactions } = useAuth()
  const [search, setSearch] = useState('')
  const txns = getAllTransactions()

  const filtered = txns.filter(t =>
    String(t.accNo).includes(search) ||
    t.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 All Transactions</h2>
      <input placeholder="Search by account no or type..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">A/C No</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Note</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-6 text-gray-400">No transactions found.</td></tr>
            ) : filtered.map((t, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{filtered.length - i}</td>
                <td className="px-4 py-3 font-semibold text-blue-700">{t.accNo}</td>
                <td className={`px-4 py-3 font-semibold ${t.type.includes('OUT') || t.type === 'WITHDRAW' ? 'text-red-500' : 'text-green-600'}`}>{t.type}</td>
                <td className="px-4 py-3">₹ {Number(t.amount).toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-400">{t.note || '—'}</td>
                <td className="px-4 py-3 text-gray-400">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
