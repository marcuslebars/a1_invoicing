import './App.css'
import { useAuth } from './context/AuthContext'
import Login from './components/Login'
import Clients from './pages/Clients'
import Invoices from './pages/Invoices'

function App() {
  const { user, loading, logout } = useAuth()

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>
  if (!user) return <Login />

  return (
    <div>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, borderBottom: '1px solid #eee' }}>
        <strong style={{ flex: 1 }}>A1 Invoicing</strong>
        <span>Signed in as {user.username} {user.is_staff || user.is_superuser ? '(staff)' : '(client)'}</span>
        <button onClick={() => logout()}>Logout</button>
      </header>
      <main style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: 16 }}>
        <section>
          <Clients />
        </section>
        <section>
          <Invoices />
        </section>
      </main>
    </div>
  )
}

export default App
