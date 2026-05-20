import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Deposit() {
  const { currentUser, deposit, getAllUsers } = useAuth()
  const [amount, setAmount] = useState('')
  const [msg, setMsg]       = useState(null)

  const freshBalance = getAllUsers().find(u => u.accNo === currentUser.accNo)?.balance ?? currentUser.balance

  function handleSubmit(e) {
    e.preventDefault()
    const res = deposit(currentUser.accNo, Number(amount))
    setMsg(res)
    if (res.ok) setAmount('')
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">💰 Deposit Money</h2>
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-sm text-gray-500 mb-4">
          Current Balance: <span className="font-bold text-blue-700">₹ {Number(freshBalance).toFixed(2)}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number" placeholder="Enter amount (₹)" value={amount}
            onChange={e => { setAmount(e.target.value); setMsg(null) }}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            min="1" step="0.01" required
          />
          {msg && (
            <p className={`text-sm px-3 py-2 rounded-lg ${msg.ok ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
              {msg.ok ? '✅ Deposit successful!' : msg.msg}
            </p>
          )}
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
            Deposit
          </button>
        </form>
      </div>
    </div>
  )
}
