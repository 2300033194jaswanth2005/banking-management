import { useAuth } from '../../context/AuthContext'

export default function History() {
  const { currentUser, getMyTransactions } = useAuth()
  const txns = getMyTransactions(currentUser.accNo)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Transaction History</h2>
      <div className="bg-white rounded-xl shadow p-5">
        {txns.length === 0 ? (
          <p className="text-gray-400 text-sm">No transactions found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-500 border-b">
              <th className="pb-2">#</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Note</th>
              <th className="pb-2">Date</th>
            </tr></thead>
            <tbody>
              {txns.map((t, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-2 text-gray-400">{txns.length - i}</td>
                  <td className={`py-2 font-semibold ${t.type.includes('OUT') || t.type === 'WITHDRAW' ? 'text-red-500' : 'text-green-600'}`}>{t.type}</td>
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
