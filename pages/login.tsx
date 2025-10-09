import { Link, useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import LoginForm from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/supabase";
import { useState, useEffect } from "react";
import bgImage from "../../assets/b2f/4.jpg";

const Login = () => {
  const [, navigate] = useLocation();
  const [loginAttempted, setLoginAttempted] = useState(false);


  // Check if user is already logged in
  const { data: authData, refetch } = useQuery({
    queryKey: ["/api/auth/session"],
    queryFn: async () => {
      const res = await getSession();
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          // User is already logged in, redirect based on role
          redirectBasedOnRole(data.user);
        }
        return data;
      }
      return { authenticated: false };
    },
    retry: false,
    enabled: !loginAttempted, // Only run initially if no login attempt
  });

  // Function to redirect based on user role
  const redirectBasedOnRole = (user: any) => {
    if (user?.role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      // Default post-login landing should go to dashboard
      navigate("/", { replace: true });
    }
  };

  // Handle successful login from LoginForm
  const handleLoginSuccess = (userData: any) => {
    setLoginAttempted(true);
    redirectBasedOnRole(userData);
  };

  // Refetch session after login attempt
  useEffect(() => {
    if (loginAttempted) {
      refetch();
    }
  }, [loginAttempted, refetch]);

  return (
    <Layout>
      <div className="min-h-screen py-12 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/95 to-[#0039B3]/10"></div>
          <div className="absolute inset-0 bg-[url('../assets/b2f/bg_image1.jpg')] bg-cover bg-center opacity-10"></div>
        </div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md z-10"
        >
          <Card className="border border-primary/30 bg-[#121212]/70 backdrop-blur-sm shadow-[0_0_15px_rgba(0,178,255,0.3)]">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-white">
                Login to Your Account
              </CardTitle>
              <CardDescription className="text-center text-white/70">
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>


            <CardContent>
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            </CardContent>


            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-white/70">
                Don't have an account?{" "}
                <Link href="/register">
                  <span className="text-primary hover:underline cursor-pointer">Purchase a challenge.</span>
                </Link>
              </div>

              <Button
                variant="outline"
                className="w-full border-primary/30 text-white/80 hover:bg-primary/10"
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
