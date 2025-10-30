import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check Supabase auth state on mount and auth state changes
  useEffect(() => {
    // Get the current session
    const fetchSession = async () => {
      try {
        setIsLoading(true);

        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Supabase auth error:', error);
          setUser(null);
        } else if (session) {
          setUser(session.user);
        } else {
          // If no supabase session is available yet, try hydrating from localStorage
          // where our backend login stores a `b2f_user` object. This prevents
          // premature redirects while the client-auth state initializes.
          try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem('b2f_user') : null;
            if (raw) {
              const parsed = JSON.parse(raw);
              // Minimal shape check
              if (parsed && (parsed.id || parsed.uuid || parsed.email)) {
                setUser(parsed as unknown as User);
              } else {
                setUser(null);
              }
            } else {
              setUser(null);
            }
          } catch (err) {
            console.error('LocalStorage hydrate error:', err);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Session fetch error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch the session immediately
    fetchSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Supabase auth event:', event);
        setUser(session?.user || null);
      }
    );

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user
  };
}