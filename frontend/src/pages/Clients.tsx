import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Clients() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const load = () => api.clients.list().then(setData).catch(e => setErr(e.message));
  useEffect(() => { load(); }, []);

  const canWrite = !!(user && (user.is_staff || user.is_superuser));

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.clients.create({ name, email });
      setName(''); setEmail('');
      await load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  if (err) return <div style={{ padding: 16 }}>Error: {err}</div>;
  return (
    <div style={{ padding: 16 }}>
      <h2>Clients</h2>
      {canWrite ? (
        <form onSubmit={onCreate} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <button disabled={!name}>Add</button>
        </form>
      ) : (
        <div style={{ color: '#666', marginBottom: 12 }}>Read-only</div>
      )}
      <ul>
        {data.map((c: any) => (
          <li key={c.id}>{c.name} — {c.email}</li>
        ))}
      </ul>
    </div>
  );
}
