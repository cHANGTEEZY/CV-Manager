'use client';

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MailIcon } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { AuthService } from '@/services/auth';
import { toast } from 'sonner';
import {
  forgotPasswordSchema,
  type forgotPasswordProps,
} from '@/schemas/authSchema';
import { bgauth } from '@/assets/images';
import Seperator from './Seperator';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<forgotPasswordProps>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleSendLink = async (data: forgotPasswordProps) => {
    try {
      console.log('clicked');
      console.log(data);
      setError(null);
      setIsSending(true);
      await AuthService.forgotPassword(data.email);
      toast.success('Password reset email sent to you');
      reset({
        email: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsSending(false);
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
              Forgot Password
            </CardTitle>
            <p className="text-muted-foreground text-center text-sm">
              We'll send you a link to reset your password.
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
                {error}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit(handleSendLink)}>
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

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
            <Seperator />
            <div className="text-center text-sm">
              <Link to="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default ForgotPassword;
