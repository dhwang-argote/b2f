import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

interface TransactionRow {
  id: string;
  user_id?: string | null;
  amount: number | string;
  related_entity_id?: string | null;
  created_at?: string | null;
  related_entity?: string | null;
  type?: string | null;
  status?: string | null;
  description?: string | null;
}

const Transactions = () => {
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, { username?: string | null; email?: string | null }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('id, user_id, amount, related_entity_id, related_entity, type, status, description, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading transactions:', error);
        setRows([]);
        return;
      }

      const trs = (data || []) as unknown as TransactionRow[];
      setRows(trs);

      const ids = Array.from(new Set(trs.map(t => t.user_id).filter(Boolean) as string[]));

      if (ids.length > 0) {
        const { data: usersData, error: usersErr } = await supabase
          .from('users')
          .select('id, username, email')
          .in('id', ids);

        if (usersErr) {
          console.error('Error loading users for transactions:', usersErr);
          setUsersMap({});
        } else {
          const map: Record<string, { username?: string | null; email?: string | null }> = {};
          (usersData || []).forEach((u: any) => {
            if (u && u.id) map[u.id] = { username: u.username, email: u.email };
          });
          setUsersMap(map);
        }
      } else {
        setUsersMap({});
      }
    } catch (err) {
      console.error('Unexpected error fetching transactions:', err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Transactions</h2>
        <p className="text-gray-400 mb-4">Listing rows from the <code>transactions</code> table.</p>

        <Card className="bg-gray-900 border-gray-800 p-4 overflow-x-auto">
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : (
            <div className="w-full overflow-auto scrollbar-hide">
              <table className="min-w-full table-fixed text-sm text-left text-gray-200">
                <colgroup>
                  <col className="w-40" />
                  <col className="w-56" />
                  <col className="w-24" />
                  <col className="w-36" />
                  <col className="w-40" />
                  <col className="w-28" />
                  <col className="w-24" />
                  <col className="w-48" />
                </colgroup>
                <thead>
                  <tr className="text-gray-300">
                    <th className="px-3 py-2 whitespace-nowrap">Username</th>
                    <th className="px-3 py-2 whitespace-nowrap">Email</th>
                    <th className="px-3 py-2 whitespace-nowrap">Amount</th>
                    <th className="px-3 py-2 whitespace-nowrap">Related Entity</th>
                    <th className="px-3 py-2 whitespace-nowrap">Related ID</th>
                    <th className="px-3 py-2 whitespace-nowrap">Type</th>
                    <th className="px-3 py-2 whitespace-nowrap">Status</th>
                    <th className="px-3 py-2 whitespace-nowrap">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.id} className="border-t border-gray-800 align-top hover:bg-white/2">
                      {(() => {
                        const uid = r.user_id;
                        const u = uid ? usersMap[uid] : undefined;
                        return (
                          <>
                            <td className="px-3 py-2 max-w-[160px] truncate whitespace-nowrap">
                              {u?.username ? (
                                <span className="font-medium text-gray-100">{u.username}</span>
                              ) : uid ? (
                                <span className="text-gray-100">{uid}</span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-3 py-2 max-w-[220px] truncate text-gray-400 whitespace-nowrap">
                              {u?.email ? u.email : <span className="text-gray-400">—</span>}
                            </td>
                          </>
                        );
                      })()}

                      <td className="px-3 py-2 text-right whitespace-nowrap">{r.amount != null ? Number(r.amount).toFixed(2) : '—'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.related_entity ?? '—'}</td>
                      <td className="px-3 py-2 whitespace-nowrap truncate">{r.related_entity_id ?? '—'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.type ?? '—'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.status ?? '—'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.created_at ? format(new Date(r.created_at), 'MMM d, yyyy HH:mm') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Transactions;
