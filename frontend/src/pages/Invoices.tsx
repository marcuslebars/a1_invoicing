import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Invoices() {
  const [data, setData] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    api.invoices.list().then(setData).catch(e => setErr(e.message));
  }, []);
  if (err) return <div style={{ padding: 16 }}>Error: {err}</div>;
  return (
    <div style={{ padding: 16 }}>
      <h2>Invoices</h2>
      <ul>
        {data.map((inv: any) => (
          <li key={inv.id}>{inv.number} — {inv.status} — {inv.client?.name}</li>
        ))}
      </ul>
    </div>
  );
}
