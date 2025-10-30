import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { userLoginSchema } from '@shared/schema';

type FormData = z.infer<typeof userLoginSchema>;

interface LoginFormProps {
  onLoginSuccess: (userData: any) => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      try {
        console.log('Attempting login with backend API:', { email: data.email });
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important for sessions
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to login');
        }

        return await response.json();
      } catch (error) {
        console.error('Login API error:', error);
        throw error;
      }
    },
    onSuccess: async (authData) => {
      console.log("Backend login successful, full response:", authData);

      try {
        // Save whole object instead of assuming `authData.user` exists
        localStorage.setItem("b2f_user", JSON.stringify(authData));
        console.log("User data saved to localStorage:", authData);
      } catch (err) {
        console.error("Error saving user to localStorage:", err);
      }

      // Set Supabase session if tokens exist
      if (authData?.access_token && authData?.refresh_token) {
        try {
          await supabase.auth.setSession({
            access_token: authData.access_token,
            refresh_token: authData.refresh_token,
          });
          console.log("Supabase Auth session set from backend tokens");
        } catch (err) {
          console.error("Error setting Supabase Auth session:", err);
        }
      }

      // Invalidate any cached queries
      queryClient.invalidateQueries();

      // Show success toast
      toast({
        title: "Login successful",
        description: "Welcome back! Redirecting to your dashboard...",
        variant: "default",
      });

      // Call the onLoginSuccess callback with user data
      if (onLoginSuccess) {
        onLoginSuccess(authData);
      }
    },
    onError: (error: Error) => {
      console.error('Login mutation error:', error);
      setServerError(error.message);
    },
  });

  const onSubmit = (data: FormData) => {
    setServerError(null);
    loginMutation.mutate(data);
  };

  return (
    <div>
      {serverError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    {...field}
                    type="email"
                    autoComplete="email"
                    maxLength={50}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    {...field}
                    type="password"
                    autoComplete="current-password"
                    maxLength={50}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;