import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Transfer() {
  const { currentUser, transfer } = useAuth()
  const [form, setForm] = useState({ toAccNo: '', amount: '' })
  const [msg, setMsg] = useState(null)

  function set(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  function handleSubmit(e) {
    e.preventDefault()
    const res = transfer(currentUser.accNo, Number(form.toAccNo), Number(form.amount))
    setMsg(res)
    if (res.ok) setForm({ toAccNo: '', amount: '' })
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🔄 Transfer Money</h2>
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-sm text-gray-500 mb-4">Current Balance: <span className="font-bold text-blue-700">₹ {Number(currentUser.balance).toFixed(2)}</span></p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="toAccNo" type="number" placeholder="Recipient Account No" value={form.toAccNo} onChange={set}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          <input name="amount" type="number" placeholder="Amount (₹)" value={form.amount} onChange={set}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" min="1" required />
          {msg && <p className={`text-sm ${msg.ok ? 'text-green-600' : 'text-red-500'}`}>{msg.ok ? '✅ Transfer successful!' : msg.msg}</p>}
          <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition">Transfer</button>
        </form>
      </div>
    </div>
  )
}
