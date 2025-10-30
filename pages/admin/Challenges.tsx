import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

interface ChallengeRow {
  id: string;
  user_id?: string | null;
  new_user_id?: string | null;
  plan_id?: number | null;
  current_drawdown?: number | null;
  trading_days?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  current_profit?: number | null;
  progress?: number | null;
  updated_at?: string | null;
  completed_at?: string | null;
  profit_earned?: number | null;
  created_at?: string | null;
  activated_at?: string | null;
  fee?: number | null;
  steps?: any;
  current_step?: number | null;
  status?: string | null;
  payment_status?: string | null;
  transaction_id?: string | null;
  account_size?: string | null;
  challenge_type?: string | null;
}

const Challenges = () => {
  const [rows, setRows] = useState<ChallengeRow[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, { username?: string | null; email?: string | null }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_challenges')
        .select('id, user_id, new_user_id, plan_id, account_size, challenge_type, current_drawdown, trading_days, start_date, end_date, current_profit, progress, current_step, steps, status, payment_status, transaction_id, fee, profit_earned, activated_at, updated_at, completed_at, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading challenges:', error);
        setRows([]);
        return;
      }

      const challengeRows = (data || []) as unknown as ChallengeRow[];
      setRows(challengeRows);

      // collect unique user ids from the rows (use user_id first, fallback to new_user_id)
      const ids = Array.from(new Set(challengeRows
        .map(r => r.user_id ?? r.new_user_id)
        .filter(Boolean) as string[]));

      if (ids.length > 0) {
        const { data: usersData, error: usersErr } = await supabase
          .from('users')
          .select('id, username, email')
          .in('id', ids);

        if (usersErr) {
          console.error('Error loading users for challenges:', usersErr);
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
      console.error('Unexpected error fetching challenges:', err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4">User Challenges</h2>

        <Card className="bg-gray-900 border-gray-800 p-4 overflow-x-auto">
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : (
            <div className="w-full overflow-auto scrollbar-hide">
              <table className="min-w-full table-fixed text-sm text-left text-gray-200">
                <colgroup>
                  <col className="w-56" />
                  <col className="w-72" />
                  <col className="w-28" />
                  <col className="w-28" />
                  <col className="w-36" />
                  <col className="w-24" />
                  <col className="w-32" />
                  <col className="w-32" />
                  <col className="w-28" />
                  <col className="w-24" />
                  <col className="w-32" />
                  <col className="w-32" />
                  <col className="w-36" />
                  <col className="w-36" />
                  <col className="w-36" />
                </colgroup>
                <thead>
                  <tr className="text-gray-300">
                    <th className="px-3 py-2 whitespace-nowrap">Username</th>
                    <th className="px-3 py-2 whitespace-nowrap">Email</th>
                    <th className="px-3 py-2 whitespace-nowrap">Plan</th>
                    <th className="px-3 py-2 whitespace-nowrap">Type</th>
                    <th className="px-3 py-2 whitespace-nowrap">Account Size</th>
                    <th className="px-3 py-2 whitespace-nowrap">Progress</th>
                    <th className="px-3 py-2 whitespace-nowrap">Current Profit</th>
                    <th className="px-3 py-2 whitespace-nowrap">Profit Earned</th>
                    <th className="px-3 py-2 whitespace-nowrap">Drawdown</th>
                    <th className="px-3 py-2 whitespace-nowrap">Trading Days</th>
                    <th className="px-3 py-2 whitespace-nowrap">Status</th>
                    <th className="px-3 py-2 whitespace-nowrap">Payment</th>
                    <th className="px-3 py-2 whitespace-nowrap">Start</th>
                    <th className="px-3 py-2 whitespace-nowrap">Activated</th>
                    <th className="px-3 py-2 whitespace-nowrap">Updated</th>
                    <th className="px-3 py-2 whitespace-nowrap">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.id} className="border-t border-gray-800 align-top hover:bg-white/2">
                      {(() => {
                        const uid = r.user_id ?? r.new_user_id;
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
                      <td className="px-3 py-2 whitespace-nowrap">{r.plan_id ?? '—'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.challenge_type ?? '—'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.account_size ?? '—'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.progress ?? '—'}</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">{r.current_profit != null ? Number(r.current_profit).toFixed(2) : '—'}</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">{r.profit_earned != null ? Number(r.profit_earned).toFixed(2) : '—'}</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">{r.current_drawdown != null ? Number(r.current_drawdown).toFixed(2) : '—'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.trading_days ?? '—'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.status ?? '—'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.payment_status ?? '—'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.start_date ? format(new Date(r.start_date), 'MMM d, yyyy') : '—'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.activated_at ? format(new Date(r.activated_at), 'MMM d, yyyy') : '—'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.updated_at ? format(new Date(r.updated_at), 'MMM d, yyyy') : '—'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.created_at ? format(new Date(r.created_at), 'MMM d, yyyy') : '—'}</td>
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

export default Challenges;
