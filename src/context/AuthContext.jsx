import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

const ADMIN = { username: 'admin', password: 'admin123', role: 'admin' }

const loadUsers        = () => JSON.parse(localStorage.getItem('bms_users')        || '[]')
const loadTransactions = () => JSON.parse(localStorage.getItem('bms_transactions') || '[]')
const saveUsers        = (u) => localStorage.setItem('bms_users',        JSON.stringify(u))
const saveTransactions = (t) => localStorage.setItem('bms_transactions', JSON.stringify(t))
const addTxn = (txn) => saveTransactions([...loadTransactions(), txn])
const toFixed2 = (n) => Number(Number(n).toFixed(2))

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    () => JSON.parse(sessionStorage.getItem('bms_session') || 'null')
  )

  function syncSession(updatedUser) {
    sessionStorage.setItem('bms_session', JSON.stringify(updatedUser))
    setCurrentUser(updatedUser)
  }

  function register({ name, email, password, initialDeposit }) {
    const users = loadUsers()
    if (users.find(u => u.email === email)) return { ok: false, msg: 'Email already registered.' }
    const accNo = 1000 + users.length + 1
    const balance = toFixed2(initialDeposit) || 0
    const user = { accNo, name, email, password, balance }
    saveUsers([...users, user])
    if (balance > 0)
      addTxn({ accNo, type: 'DEPOSIT', amount: balance, date: new Date().toLocaleString(), note: 'Initial deposit' })
    return { ok: true }
  }

  function loginUser({ email, password }) {
    const user = loadUsers().find(u => u.email === email && u.password === password)
    if (!user) return { ok: false, msg: 'Invalid email or password.' }
    syncSession({ ...user, role: 'user' })
    return { ok: true }
  }

  function loginAdmin({ username, password }) {
    if (username === ADMIN.username && password === ADMIN.password) {
      syncSession(ADMIN)
      return { ok: true }
    }
    return { ok: false, msg: 'Invalid admin credentials.' }
  }

  function logout() {
    sessionStorage.removeItem('bms_session')
    setCurrentUser(null)
  }

  function deposit(accNo, amount) {
    const amt = toFixed2(amount)
    if (amt <= 0) return { ok: false, msg: 'Amount must be greater than 0.' }
    const users = loadUsers()
    const idx = users.findIndex(u => u.accNo === accNo)
    if (idx === -1) return { ok: false, msg: 'Account not found.' }
    users[idx].balance = toFixed2(users[idx].balance + amt)
    saveUsers(users)
    addTxn({ accNo, type: 'DEPOSIT', amount: amt, date: new Date().toLocaleString(), note: '' })
    syncSession({ ...currentUser, balance: users[idx].balance })
    return { ok: true }
  }

  function withdraw(accNo, amount) {
    const amt = toFixed2(amount)
    if (amt <= 0) return { ok: false, msg: 'Amount must be greater than 0.' }
    const users = loadUsers()
    const idx = users.findIndex(u => u.accNo === accNo)
    if (idx === -1) return { ok: false, msg: 'Account not found.' }
    if (users[idx].balance < amt) return { ok: false, msg: 'Insufficient balance.' }
    users[idx].balance = toFixed2(users[idx].balance - amt)
    saveUsers(users)
    addTxn({ accNo, type: 'WITHDRAW', amount: amt, date: new Date().toLocaleString(), note: '' })
    syncSession({ ...currentUser, balance: users[idx].balance })
    return { ok: true }
  }

  function transfer(fromAccNo, toAccNo, amount) {
    const amt = toFixed2(amount)
    if (amt <= 0) return { ok: false, msg: 'Amount must be greater than 0.' }
    const users = loadUsers()
    const fromIdx = users.findIndex(u => u.accNo === fromAccNo)
    const toIdx   = users.findIndex(u => u.accNo === Number(toAccNo))
    if (toIdx === -1)          return { ok: false, msg: 'Recipient account not found.' }
    if (fromIdx === toIdx)     return { ok: false, msg: 'Cannot transfer to same account.' }
    if (users[fromIdx].balance < amt) return { ok: false, msg: 'Insufficient balance.' }
    users[fromIdx].balance = toFixed2(users[fromIdx].balance - amt)
    users[toIdx].balance   = toFixed2(users[toIdx].balance   + amt)
    saveUsers(users)
    const date = new Date().toLocaleString()
    addTxn({ accNo: fromAccNo,       type: 'TRANSFER OUT', amount: amt, date, note: `To A/C ${toAccNo}` })
    addTxn({ accNo: Number(toAccNo), type: 'TRANSFER IN',  amount: amt, date, note: `From A/C ${fromAccNo}` })
    syncSession({ ...currentUser, balance: users[fromIdx].balance })
    return { ok: true }
  }

  function getMyTransactions(accNo) {
    return loadTransactions().filter(t => t.accNo === accNo).reverse()
  }

  function getAllUsers()        { return loadUsers() }
  function getAllTransactions() { return loadTransactions().reverse() }

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
