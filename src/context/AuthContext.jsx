import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

const ADMIN = { username: 'admin', password: 'admin123', role: 'admin' }

function loadUsers() {
  return JSON.parse(localStorage.getItem('bms_users') || '[]')
}
function saveUsers(users) {
  localStorage.setItem('bms_users', JSON.stringify(users))
}
function loadTransactions() {
  return JSON.parse(localStorage.getItem('bms_transactions') || '[]')
}
function saveTransactions(txns) {
  localStorage.setItem('bms_transactions', JSON.stringify(txns))
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    () => JSON.parse(sessionStorage.getItem('bms_session') || 'null')
  )

  function register({ name, email, password, initialDeposit }) {
    const users = loadUsers()
    if (users.find(u => u.email === email)) return { ok: false, msg: 'Email already registered.' }
    const accNo = 1000 + users.length + 1
    const user = { accNo, name, email, password, balance: Number(initialDeposit) || 0, pin: null }
    users.push(user)
    saveUsers(users)
    if (user.balance > 0) {
      const txns = loadTransactions()
      txns.push({ accNo, type: 'DEPOSIT', amount: user.balance, date: new Date().toLocaleString(), note: 'Initial deposit' })
      saveTransactions(txns)
    }
    return { ok: true }
  }

  function loginUser({ email, password }) {
    const users = loadUsers()
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) return { ok: false, msg: 'Invalid email or password.' }
    const session = { ...user, role: 'user' }
    sessionStorage.setItem('bms_session', JSON.stringify(session))
    setCurrentUser(session)
    return { ok: true }
  }

  function loginAdmin({ username, password }) {
    if (username === ADMIN.username && password === ADMIN.password) {
      sessionStorage.setItem('bms_session', JSON.stringify(ADMIN))
      setCurrentUser(ADMIN)
      return { ok: true }
    }
    return { ok: false, msg: 'Invalid admin credentials.' }
  }

  function logout() {
    sessionStorage.removeItem('bms_session')
    setCurrentUser(null)
  }

  function updateSession(user) {
    const updated = { ...currentUser, balance: user.balance }
    sessionStorage.setItem('bms_session', JSON.stringify(updated))
    setCurrentUser(updated)
  }

  function deposit(accNo, amount) {
    const users = loadUsers()
    const idx = users.findIndex(u => u.accNo === accNo)
    if (idx === -1 || Number(amount) <= 0) return { ok: false, msg: 'Invalid amount.' }
    users[idx].balance = Number((users[idx].balance + Number(amount)).toFixed(2))
    saveUsers(users)
    loadTransactions(), saveTransactions([...loadTransactions(), { accNo, type: 'DEPOSIT', amount: Number(amount), date: new Date().toLocaleString(), note: '' }])
    updateSession(users[idx])
    return { ok: true }
  }

  function withdraw(accNo, amount) {
    const users = loadUsers()
    const idx = users.findIndex(u => u.accNo === accNo)
    if (idx === -1 || Number(amount) <= 0) return { ok: false, msg: 'Invalid amount.' }
    if (users[idx].balance < Number(amount)) return { ok: false, msg: 'Insufficient balance.' }
    users[idx].balance = Number((users[idx].balance - Number(amount)).toFixed(2))
    saveUsers(users)
    saveTransactions([...loadTransactions(), { accNo, type: 'WITHDRAW', amount: Number(amount), date: new Date().toLocaleString(), note: '' }])
    updateSession(users[idx])
    return { ok: true }
  }

  function transfer(fromAccNo, toAccNo, amount) {
    const users = loadUsers()
    const fromIdx = users.findIndex(u => u.accNo === fromAccNo)
    const toIdx   = users.findIndex(u => u.accNo === Number(toAccNo))
    if (toIdx === -1) return { ok: false, msg: 'Recipient account not found.' }
    if (fromIdx === toIdx) return { ok: false, msg: 'Cannot transfer to same account.' }
    if (users[fromIdx].balance < Number(amount)) return { ok: false, msg: 'Insufficient balance.' }
    users[fromIdx].balance = Number((users[fromIdx].balance - Number(amount)).toFixed(2))
    users[toIdx].balance   = Number((users[toIdx].balance   + Number(amount)).toFixed(2))
    saveUsers(users)
    const date = new Date().toLocaleString()
    saveTransactions([...loadTransactions(),
      { accNo: fromAccNo,       type: 'TRANSFER OUT', amount: Number(amount), date, note: `To A/C ${toAccNo}` },
      { accNo: Number(toAccNo), type: 'TRANSFER IN',  amount: Number(amount), date, note: `From A/C ${fromAccNo}` }
    ])
    updateSession(users[fromIdx])
    return { ok: true }
  }

  function getMyTransactions(accNo) {
    return loadTransactions().filter(t => t.accNo === accNo).reverse()
  }

  function getAllUsers()         { return loadUsers() }
  function getAllTransactions()  { return loadTransactions().reverse() }

  function deleteUser(accNo) {
    saveUsers(loadUsers().filter(u => u.accNo !== accNo))
  }

  return (
    <AuthContext.Provider value={{
      currentUser, register, loginUser, loginAdmin, logout,
      deposit, withdraw, transfer, getMyTransactions,
      getAllUsers, getAllTransactions, deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
