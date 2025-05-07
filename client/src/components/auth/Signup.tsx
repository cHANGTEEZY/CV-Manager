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
import { LockIcon, MailIcon, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Seperator from './Seperator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { AuthService } from '@/services/auth';
import { toast } from 'sonner';
import { type SignUpSchemaProps, signUpSchema } from '@/schemas/authSchema';
import { bgauth } from '@/assets/images';

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaProps>({
    resolver: zodResolver(signUpSchema),
  });

  const handleSubmitData = async (data: SignUpSchemaProps) => {
    try {
      setError(null);
      setIsRegistering(true);
      await AuthService.signUpWithEmail(
        data.email,
        data.password,
        data.username
      );
      toast.success(
        'Account created successfully. Click the link in your email to verify your account.'
      );
      navigate('/auth/signin');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setError(null);
      await AuthService.signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google');
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
              Sign up
            </CardTitle>
            <p className="text-muted-foreground text-center text-sm">
              Enter credentials to create your account
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
                {error}
              </div>
            )}
            <form
              className="space-y-4"
              onSubmit={handleSubmit(handleSubmitData)}
            >
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className={`text-sm font-medium ${errors && errors.username ? 'text-red-500' : ''}`}
                >
                  Username
                </label>
                <div className="relative">
                  <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    {...register('username')}
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    className={`pl-10 ${
                      errors && errors.username
                        ? 'focus-visible:border-red-500 focus-visible:ring-[3px] focus-visible:ring-red-500/50'
                        : ''
                    }`}
                  />
                </div>

                {errors && errors.username && (
                  <span className={`${errors ? 'text-red-600' : ''} text-sm`}>
                    {errors.username.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className={`text-sm font-medium ${errors && errors.email ? 'text-red-500' : ''}`}
                >
                  Email
                </label>
                <div className="relative">
                  <MailIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder="johndoe@gmail.com"
                    className={`pl-10 ${
                      errors && errors.email
                        ? 'focus-visible:border-red-500 focus-visible:ring-[3px] focus-visible:ring-red-500/50'
                        : ''
                    }`}
                  />
                </div>
                {errors && errors.email && (
                  <span className={`${errors ? 'text-red-600' : ''} text-sm`}>
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className={`text-sm font-medium ${errors && errors.password ? 'text-red-500' : ''}`}
                >
                  Password
                </label>
                <div className="relative">
                  <LockIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    {...register('password')}
                    id="password"
                    type="password"
                    placeholder="********"
                    className={`pl-10 ${
                      errors && errors.password
                        ? 'focus-visible:border-red-500 focus-visible:ring-[3px] focus-visible:ring-red-500/50'
                        : ''
                    }`}
                  />
                </div>
                {errors && errors.password && (
                  <span className={`${errors ? 'text-red-600' : ''} text-sm`}>
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className={`text-sm font-medium ${errors && errors.confirmPassword ? 'text-red-500' : ''}`}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <LockIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    {...register('confirmPassword')}
                    id="confirmPassword"
                    type="password"
                    placeholder="********"
                    className={`pl-10 ${
                      errors && errors.confirmPassword
                        ? 'focus-visible:border-red-500 focus-visible:ring-[3px] focus-visible:ring-red-500/50'
                        : ''
                    }`}
                  />
                </div>
                {errors && errors.confirmPassword && (
                  <span className={`${errors ? 'text-red-600' : ''} text-sm`}>
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isRegistering}
              >
                {isRegistering ? 'Creating...' : 'Sign up'}
              </Button>
            </form>
          </CardContent>

          <Seperator />

          <CardFooter>
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={handleGoogleSignUp}
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
              Sign up with Google
            </Button>
          </CardFooter>

          <div className="p-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/auth/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </section>
    </>
  );
};

export default Signup;
