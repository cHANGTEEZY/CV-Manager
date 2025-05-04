import { CalendarDays, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';

interface EventCardProps {
  title: string;
  date: string;
  status: string;
  remarks?: string;
  type?: 'interview' | 'assessment';
}

export function EventCard({
  title,
  date,
  status,
  remarks,
  type = 'interview',
}: EventCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex items-start">
          <div
            className={cn(
              'w-2 self-stretch',
              status.toLowerCase().includes('pass')
                ? 'bg-green-500'
                : status.toLowerCase().includes('fail')
                  ? 'bg-red-500'
                  : 'bg-amber-500'
            )}
          />
          <div className="flex flex-1 items-start justify-between p-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {type === 'interview' ? (
                  <CalendarDays className="text-muted-foreground h-4 w-4" />
                ) : (
                  <FileText className="text-muted-foreground h-4 w-4" />
                )}
                <h4 className="font-semibold">{title}</h4>
              </div>
              <p className="text-muted-foreground text-sm">{date}</p>
              {remarks && (
                <p className="text-sm text-slate-600">Remarks: {remarks}</p>
              )}
            </div>
            <StatusBadge status={status} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function for className conditionals
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
