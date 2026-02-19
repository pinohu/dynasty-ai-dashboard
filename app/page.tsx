'use client';

import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const sess = await getSession();
      if (!sess) {
        window.location.href = '/auth/signin';
        return;
      }
      setSession(sess);

      try {
        const res = await fetch('/api/dashboard');
        const dashData = await res.json();
        setData(dashData);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (!session) return <div className="text-center mt-8">Authenticating...</div>;
  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Dynasty AI Stack Dashboard</h1>

        {/* Service Status */}
        {data?.services && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <h2 className="col-span-full text-2xl font-bold text-green-400">Service Status</h2>
            {data.services.map((s: any) => (
              <div key={s.name} className="bg-gray-800 p-4 rounded border border-gray-700">
                <div className="font-semibold">{s.name}</div>
                <div className={s.status === 'online' ? 'text-green-400' : 'text-red-400'}>
                  {s.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                </div>
                {s.latency && <div className="text-sm text-gray-400">{s.latency}ms</div>}
              </div>
            ))}
          </div>
        )}

        {/* Cost Tracking */}
        {data?.costs && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <h2 className="col-span-full text-2xl font-bold text-blue-400">Cost Tracking</h2>
            <div className="bg-gray-800 p-6 rounded border border-gray-700">
              <div className="text-gray-400">Today</div>
              <div className="text-3xl font-bold">${data.costs.today}</div>
            </div>
            <div className="bg-gray-800 p-6 rounded border border-gray-700">
              <div className="text-gray-400">This Month</div>
              <div className="text-3xl font-bold">${data.costs.thisMonth}</div>
            </div>
            <div className="bg-green-900 p-6 rounded border border-green-700">
              <div className="text-gray-400">Monthly Savings</div>
              <div className="text-3xl font-bold text-green-400">${data.costs.savings}</div>
            </div>
          </div>
        )}

        {/* Agent Activity */}
        {data?.agents && (
          <div className="bg-gray-800 p-6 rounded border border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Agent Activity</h2>
            <div className="space-y-2">
              {data.agents.slice(0, 10).map((a: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <div>
                    <div className="font-semibold">{a.name}</div>
                    <div className="text-sm text-gray-400">Last active: {a.lastActive}</div>
                  </div>
                  <div className="text-right">
                    <div className={a.status === 'active' ? 'text-green-400' : 'text-gray-500'}>
                      {a.status === 'active' ? '✓ Active' : 'Idle'}
                    </div>
                    <div className="text-sm text-gray-400">{a.tasksToday} tasks</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
