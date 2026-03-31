import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [tab, setTab] = useState('user')
  const [form, setForm] = useState({ name: '', email: '', password: '', initialDeposit: '', username: '' })
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const { loginUser, loginAdmin, register } = useAuth()
  const navigate = useNavigate()

  function set(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (tab === 'admin') {
      const res = loginAdmin({ username: form.username, password: form.password })
      if (!res.ok) return setError(res.msg)
      navigate('/admin')
    } else if (isRegister) {
      const res = register(form)
      if (!res.ok) return setError(res.msg)
      setIsRegister(false)
      setError('')
      alert('Account created! Please login.')
    } else {
      const res = loginUser({ email: form.email, password: form.password })
      if (!res.ok) return setError(res.msg)
      navigate('/user')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">🏦 BankMS</h1>
        <p className="text-center text-gray-500 text-sm mb-6">Banking Management System</p>

        {/* Tabs */}
        <div className="flex rounded-lg overflow-hidden border border-blue-200 mb-6">
          {['user', 'admin'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); setIsRegister(false) }}
              className={`flex-1 py-2 text-sm font-semibold capitalize transition ${tab === t ? 'bg-blue-700 text-white' : 'text-blue-700 hover:bg-blue-50'}`}>
              {t === 'user' ? '👤 User' : '🔐 Admin'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'admin' ? (
            <>
              <input name="username" placeholder="Admin Username" value={form.username} onChange={set}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              <input name="password" type="password" placeholder="Password" value={form.password} onChange={set}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            </>
          ) : (
            <>
              {isRegister && (
                <>
                  <input name="name" placeholder="Full Name" value={form.name} onChange={set}
                    className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                  <input name="initialDeposit" type="number" placeholder="Initial Deposit (₹)" value={form.initialDeposit} onChange={set}
                    className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" min="0" />
                </>
              )}
              <input name="email" type="email" placeholder="Email" value={form.email} onChange={set}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              <input name="password" type="password" placeholder="Password" value={form.password} onChange={set}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition">
            {tab === 'admin' ? 'Login as Admin' : isRegister ? 'Create Account' : 'Login'}
          </button>
        </form>

        {tab === 'user' && (
          <p className="text-center text-sm text-gray-500 mt-4">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => { setIsRegister(r => !r); setError('') }}
              className="text-blue-600 font-semibold ml-1 hover:underline">
              {isRegister ? 'Login' : 'Register'}
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
