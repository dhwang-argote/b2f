import { Link, useLocation } from 'wouter';
import Layout from '@/components/layout/layout';
import RegisterForm from '@/components/auth/register-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';


const Register = () => {
  const [, navigate] = useLocation();

  return (
    <Layout>
      <div className="min-h-screen py-12 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/95 to-[#0039B3]/10"></div>
          <div className="absolute inset-0 bg-[url('../assets/b2f/bg_image2.jpg')] bg-cover bg-center opacity-10"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl z-10"
        >
          <Card className="border border-primary/30 bg-[#121212]/70 backdrop-blur-sm shadow-[0_0_15px_rgba(0,178,255,0.3)]">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-white">Create Your Account</CardTitle>
              <CardDescription className="text-center text-white/70">
                Register to start your journey as a funded trader. Note: registration requires a purchase token or transaction hash from a successful challenge purchase.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <RegisterForm />
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-white/70">
                Already have an account?{' '}
                <Link href="/login">
                  <span className="text-primary hover:underline cursor-pointer">Login</span>
                </Link>
              </div>

              <Button
                variant="outline"
                className="w-full border-primary/30 text-white/80 hover:bg-primary/10"
                onClick={() => navigate('/')}
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

export default Register;
