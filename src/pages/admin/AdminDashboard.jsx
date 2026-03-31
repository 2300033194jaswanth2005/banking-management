import { useAuth } from '../../context/AuthContext'
import Card from '../../components/Card'

export default function AdminDashboard() {
  const { getAllUsers, getAllTransactions } = useAuth()
  const users = getAllUsers()
  const txns  = getAllTransactions()
  const totalBalance = users.reduce((s, u) => s + Number(u.balance), 0)
  const deposits  = txns.filter(t => t.type === 'DEPOSIT').reduce((s, t) => s + t.amount, 0)
  const withdraws = txns.filter(t => t.type === 'WITHDRAW').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🔐 Admin Dashboard</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card title="Total Users"        value={users.length}                          color="blue" />
        <Card title="Total Balance"      value={`₹ ${totalBalance.toFixed(2)}`}        color="green" />
        <Card title="Total Deposits"     value={`₹ ${deposits.toFixed(2)}`}            color="yellow" />
        <Card title="Total Withdrawals"  value={`₹ ${withdraws.toFixed(2)}`}           color="red" />
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold text-gray-700 mb-3">Recent Transactions</h3>
        {txns.length === 0 ? <p className="text-gray-400 text-sm">No transactions yet.</p> : (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-500 border-b">
              <th className="pb-2">A/C No</th><th className="pb-2">Type</th><th className="pb-2">Amount</th><th className="pb-2">Date</th>
            </tr></thead>
            <tbody>
              {txns.slice(0, 8).map((t, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-2">{t.accNo}</td>
                  <td className={`py-2 font-semibold ${t.type.includes('OUT') || t.type === 'WITHDRAW' ? 'text-red-500' : 'text-green-600'}`}>{t.type}</td>
                  <td className="py-2">₹ {Number(t.amount).toFixed(2)}</td>
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
