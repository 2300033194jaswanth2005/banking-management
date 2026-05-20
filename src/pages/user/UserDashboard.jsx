import { useAuth } from '../../context/AuthContext'
import Card from '../../components/Card'

export default function UserDashboard() {
  const { currentUser, getMyTransactions, getAllUsers } = useAuth()

  // Always read fresh balance from storage
  const freshUser = getAllUsers().find(u => u.accNo === currentUser.accNo) || currentUser
  const txns  = getMyTransactions(currentUser.accNo)
  const recent = txns.slice(0, 5)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome, {currentUser.name} 👋</h2>
      <p className="text-gray-500 text-sm mb-6">
        Account No: <span className="font-semibold text-blue-700">{currentUser.accNo}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card title="Current Balance"    value={`₹ ${Number(freshUser.balance).toFixed(2)}`} color="blue" />
        <Card title="Total Transactions" value={txns.length}                                  color="green" />
        <Card title="Account Status"     value="Active ✅"                                    color="yellow" />
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold text-gray-700 mb-3">Recent Transactions</h3>
        {recent.length === 0 ? (
          <p className="text-gray-400 text-sm">No transactions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Type</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Note</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((t, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                  <td className={`py-2 font-semibold ${t.type.includes('OUT') || t.type === 'WITHDRAW' ? 'text-red-500' : 'text-green-600'}`}>
                    {t.type}
                  </td>
                  <td className="py-2">₹ {Number(t.amount).toFixed(2)}</td>
                  <td className="py-2 text-gray-400">{t.note || '—'}</td>
                  <td className="py-2 text-gray-400">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
