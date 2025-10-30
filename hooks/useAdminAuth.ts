import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';

export const useAdminAuth = () => {
  const [, navigate] = useLocation();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return { adminUser, loading };
};