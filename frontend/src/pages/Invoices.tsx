import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Invoices() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [number, setNumber] = useState('');
  const [clientId, setClientId] = useState<number | ''>('');
  const [total, setTotal] = useState<number | ''>('');

  const load = () => api.invoices.list().then(setData).catch(e => setErr(e.message));
  useEffect(() => { load(); }, []);

  const canWrite = !!(user && (user.is_staff || user.is_superuser));

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.invoices.create({
        number,
        client: clientId,
        status: 'draft',
        items: [],
        subtotal: total || 0,
        tax_total: 0,
        total: total || 0,
      });
      setNumber(''); setClientId(''); setTotal('');
      await load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  if (err) return <div style={{ padding: 16 }}>Error: {err}</div>;
  return (
    <div style={{ padding: 16 }}>
      <h2>Invoices</h2>
      {canWrite ? (
        <form onSubmit={onCreate} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input placeholder="Number" value={number} onChange={e => setNumber(e.target.value)} />
          <input placeholder="Client ID" value={clientId} onChange={e => setClientId(e.target.value ? Number(e.target.value) : '')} />
          <input placeholder="Total" value={total} onChange={e => setTotal(e.target.value ? Number(e.target.value) : '')} />
          <button disabled={!number || !clientId}>Add</button>
        </form>
      ) : (
        <div style={{ color: '#666', marginBottom: 12 }}>Read-only</div>
      )}
      <ul>
        {data.map((inv: any) => (
          <li key={inv.id}>{inv.number} — {inv.status} — {inv.client?.name || inv.client}</li>
        ))}
      </ul>
    </div>
  );
}
