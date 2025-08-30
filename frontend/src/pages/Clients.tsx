import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Clients() {
  const [data, setData] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    api.clients.list().then(setData).catch(e => setErr(e.message));
  }, []);
  if (err) return <div style={{ padding: 16 }}>Error: {err}</div>;
  return (
    <div style={{ padding: 16 }}>
      <h2>Clients</h2>
      <ul>
        {data.map((c: any) => (
          <li key={c.id}>{c.name} — {c.email}</li>
        ))}
      </ul>
    </div>
  );
}
