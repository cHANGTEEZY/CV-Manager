'use client';

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { AuthService } from '@/services/auth';
import { toast } from 'sonner';
import {
  resetPasswordSchema,
  type resetPasswordProps,
} from '@/schemas/authSchema';
import { bgauth } from '@/assets/images';
import { supabase } from '@/utils/supabaseClient';
import UseRedirect from '@/hooks/use-redirect';

const ResetPassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordProps>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          setError(
            'Invalid or expired password reset link. Please request a new one.'
          );
        }
      } catch (err) {
        setError('Failed to verify password reset session.');
      } finally {
        setIsVerifying(false);
      }
    };

    checkSession();
  }, []);

  const handleResetPassword = async (data: resetPasswordProps) => {
    try {
      setError(null);
      setIsSubmitting(true);
      await AuthService.resetPassword(data.password);
      toast.success('Password successfully reset. Logging in.');
      UseRedirect('/');
    } catch (err: any) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            Reset Password
          </CardTitle>
          <p className="text-muted-foreground text-center text-sm">
            Enter your new password to reset your account.
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
            onSubmit={handleSubmit(handleResetPassword)}
          >
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                New Password
              </label>
              <Input
                {...register('password')}
                id="password"
                type="password"
                placeholder="Enter new password"
              />
              {errors.password && (
                <span className="text-sm text-red-600">
                  {errors.password.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isSubmitting || isVerifying || error !== null}
            >
              {isSubmitting
                ? 'Resetting...'
                : isVerifying
                  ? 'Verifying...'
                  : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default ResetPassword;
