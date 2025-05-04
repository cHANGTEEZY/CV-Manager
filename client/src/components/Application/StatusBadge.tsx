import { cn } from '@/lib/utils';

type StatusType =
  | 'Passed'
  | 'Failed'
  | 'Scheduled'
  | 'Pending'
  | 'In Progress'
  | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusLower = status.toLowerCase();

  const getStatusStyles = () => {
    if (statusLower.includes('pass') || statusLower === 'passed') {
      return 'bg-green-100 text-green-700 border-green-200';
    }
    if (
      statusLower.includes('fail') ||
      statusLower === 'failed' ||
      statusLower.includes('reject')
    ) {
      return 'bg-red-100 text-red-700 border-red-200';
    }
    if (
      statusLower.includes('schedule') ||
      statusLower === 'scheduled' ||
      statusLower.includes('pending')
    ) {
      return 'bg-amber-100 text-amber-700 border-amber-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <span
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-medium',
        getStatusStyles(),
        className
      )}
    >
      {status}
    </span>
  );
}
