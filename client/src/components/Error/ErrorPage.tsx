'use client';

import { useState } from 'react';
import { AlertCircle, ArrowLeft, HomeIcon, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ErrorPageProps {
  code?: number;
  title?: string;
  message?: string;
  showRefresh?: boolean;
}

export default function ErrorPage({
  code = 404,
  title = 'Page Not Found',
  message = "Sorry, we couldn't find the page you're looking for.",
  showRefresh = true,
}: ErrorPageProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRefresh = () => {
    setIsAnimating(true);
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="from-primary/10 to-accent/5 absolute inset-0 -z-10 animate-pulse rounded-2xl bg-gradient-to-br opacity-70 blur-xl" />

        <div className="bg-card border-border relative overflow-hidden rounded-xl border p-8 shadow-lg">
          <div className="bg-primary/10 absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full" />
          <div className="bg-primary/5 absolute bottom-0 left-0 h-24 w-24 -translate-x-1/2 translate-y-1/2 rounded-full" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="text-primary/10 absolute -top-6 -right-6 text-[120px] font-bold select-none">
              {code}
            </div>

            <div className="bg-primary/10 relative mb-6 flex h-20 w-20 items-center justify-center rounded-full">
              <AlertCircle className="text-primary h-10 w-10" />
              <span className="border-primary/20 absolute h-full w-full animate-ping rounded-full border-4 opacity-75" />
            </div>

            <h1 className="text-foreground mb-2 text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground mb-8">{message}</p>

            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <button
                className={cn(
                  'cursor-pointer',
                  'flex items-center justify-center gap-2 rounded-lg px-4 py-2.5',
                  'bg-primary text-secondary-foreground hover:bg-primary/90',
                  'border-border border',
                  'font-medium transition-all duration-200',
                  'w-full'
                )}
              >
                <Link to={'/'}>
                  <span className="flex gap-2">
                    <HomeIcon />
                    Go Home
                  </span>
                </Link>
              </button>

              <button
                onClick={() => window.history.back()}
                className={cn(
                  'cursor-pointer',
                  'flex items-center justify-center gap-2 rounded-lg px-4 py-2.5',
                  'bg-secondary text-secondary-foreground hover:bg-secondary/90',
                  'border-border border',
                  'font-medium transition-all duration-200',
                  'w-full'
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Go Back</span>
              </button>
            </div>

            {showRefresh && (
              <button
                onClick={handleRefresh}
                className={cn(
                  'text-muted-foreground hover:text-foreground mt-4 text-sm',
                  'flex items-center gap-1.5 transition-all duration-200'
                )}
              >
                <RefreshCw
                  className={cn('h-3.5 w-3.5', isAnimating && 'animate-spin')}
                />
                <span>Refresh the page</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-muted-foreground mt-4 text-center text-xs">
          If this problem persists, please contact our support team.
        </p>
      </div>
    </div>
  );
}
