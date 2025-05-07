'use client';

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LockIcon, MailIcon } from 'lucide-react';
import Seperator from './Seperator';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { AuthService } from '@/services/auth';
import { toast } from 'sonner';
import { signinSchema, type SigninSchemaProps } from '@/schemas/authSchema';
import { bgauth } from '@/assets/images';

const Signin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninSchemaProps>({
    resolver: zodResolver(signinSchema),
  });

  const handleLogin = async (data: SigninSchemaProps) => {
    try {
      setError(null);
      setIsLoggingIn(true);
      await AuthService.signInWithEmail(data.email, data.password);
      toast.success('Logged in successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await AuthService.signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  return (
    <>
      <section className="relative flex h-screen w-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={bgauth || '/placeholder.svg'}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <Card className="relative z-10 m-3 w-full max-w-md shadow-[0_0_15px_rgba(128,0,255,0.5),0_0_25px_rgba(0,128,255,0.3)]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-semibold">
              Sign in
            </CardTitle>
            <p className="text-muted-foreground text-center text-sm">
              Enter your credentials to access your account
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
                {error}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <MailIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder="johndoe@gmail.com"
                    className="pl-10"
                  />
                </div>
                {errors && errors.email && (
                  <span className="text-sm text-red-600">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link to={'/auth/forgot-password'}>
                    <span className="text-primary text-sm hover:underline">
                      Forgot password?
                    </span>
                  </Link>
                </div>
                <div className="relative">
                  <LockIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    {...register('password')}
                    id="password"
                    type="password"
                    placeholder="********"
                    className="pl-10"
                  />
                </div>
                {errors && errors.password && (
                  <span className="text-sm text-red-600">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>

          <Seperator />

          <CardFooter>
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={handleGoogleSignIn}
            >
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Sign in with Google
            </Button>
          </CardFooter>

          <div className="p-4 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </Card>
      </section>
    </>
  );
};

export default Signin;
