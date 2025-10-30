import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import AdminLayout from '@/components/admin/AdminLayout';
import UsersList from '@/components/admin/users/UsersList';
import { supabase } from '@/lib/supabase';

const UsersManagement = () => {
  const [, navigate] = useLocation();
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    checkAdminAccess();
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

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .eq('id', userObj.id)
        .single();

      setAdminUser({ ...userData, ...(profileData || {}) });
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/login');
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
      <UsersList />
    </AdminLayout>
  );
};

export default UsersManagement;