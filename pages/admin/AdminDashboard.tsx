import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCards from '@/components/admin/dashboard/StatsCards';
import Charts from '@/components/admin/dashboard/Charts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

const AdminDashboard = () => {
  const [, navigate] = useLocation();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeChallenges: 0,
    totalWinnings: 0,
    successRate: 72,
  });

  useEffect(() => {
    checkAdminAccess();
    fetchDashboardStats();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const storedUser = localStorage.getItem('b2f_user');
      const userObj = storedUser ? JSON.parse(storedUser) : null;
      
      if (!userObj) {
        navigate('/login');
        return;
      }

      const { data: userData, error: userErr } = await supabase
        .from('users')
        .select('id, email, role, created_at')
        .eq('id', userObj.id)
        .single();

      if (userErr || !userData) {
        console.error('Error fetching user for admin check:', userErr);
        navigate('/login');
        return;
      }

      if (userData?.role !== 'admin') {
        navigate('/');
        return;
      }

      // fetch profile data (profiles holds richer fields)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, phone, status, tier')
        .eq('id', userObj.id)
        .single();

      setAdminUser({ ...userData, ...(profileData || {}) });
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/login');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Fetch real data from your database
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact' });

      // Mock data for demonstration - replace with actual queries
      setStats({
        totalUsers: userCount || 1248,
        activeChallenges: 342,
        totalWinnings: 125430,
        successRate: 72,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (!adminUser) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-white">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, {adminUser.username}! Here's what's happening with your platform.
          </p>
        </div>
        <Badge className="bg-red-500 text-white px-4 py-2">
          Admin Access
        </Badge>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts */}
      <Charts />

      {/* Recent Activity */}
      <Card className="bg-gray-900 border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { user: 'JohnDoe', action: 'placed a bet', time: '2 minutes ago', amount: '$50' },
            { user: 'JaneSmith', action: 'won a challenge', time: '5 minutes ago', amount: '$120' },
            { user: 'MikeJohnson', action: 'created a challenge', time: '15 minutes ago', amount: '$75' },
            { user: 'SarahWilson', action: 'withdrew funds', time: '1 hour ago', amount: '$200' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div>
                <span className="text-white font-medium">{activity.user}</span>
                <span className="text-gray-400"> {activity.action}</span>
                <span className="text-green-400 ml-2">{activity.amount}</span>
              </div>
              <span className="text-gray-500 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;