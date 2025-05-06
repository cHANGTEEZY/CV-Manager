import { format } from 'date-fns';
import {
  ClipboardCheck,
  FileCheck,
  FileX,
  PersonStanding,
  Star,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function ApplicationTimeline({ timelineData }: { timelineData: any }) {
  const formatEventDate = (date: Date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM dd, yyyy h:mm a');
  };

  const getEventIcon = (event: any) => {
    if (event.type === 'interview') {
      return event.result?.toLowerCase().includes('pass') ? (
        <PersonStanding className="h-5 w-5 text-green-500" />
      ) : (
        <PersonStanding className="h-5 w-5 text-amber-500" />
      );
    } else if (event.type === 'assessment') {
      return event.result?.toLowerCase().includes('pass') ? (
        <FileCheck className="h-5 w-5 text-green-500" />
      ) : (
        <FileX className="h-5 w-5 text-amber-500" />
      );
    }
    return <ClipboardCheck className="h-5 w-5 text-blue-500" />;
  };

  const renderRating = (rating: number) => {
    if (!rating) return null;

    return (
      <div className="mt-1 flex items-center">
        {Array(rating)
          .fill(null)
          .map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-current text-yellow-400" />
          ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Application Events</CardTitle>
        <CardDescription>
          Latest interviews and assessments for applicants
        </CardDescription>
      </CardHeader>
      <CardContent>
        {timelineData && timelineData.length > 0 ? (
          <div className="space-y-8">
            {timelineData.slice(0, 10).map((event: any) => (
              <div
                key={event.id}
                className="flex items-start gap-4 rounded-lg border p-4"
              >
                <div className="mt-1">{getEventIcon(event)}</div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">
                    {event.eventName}
                    {event.result && (
                      <span
                        className={`ml-2 text-xs ${
                          event.result?.toLowerCase().includes('pass')
                            ? 'text-green-500'
                            : 'text-amber-500'
                        }`}
                      >
                        ({event.result})
                      </span>
                    )}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {event.candidateName} &lt;{event.candidateEmail}&gt;
                  </p>
                  <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <span>{formatEventDate(event.date)}</span>
                    {event.interviewer && (
                      <span>Interviewer: {event.interviewer}</span>
                    )}
                    {event.dueDate && (
                      <span>
                        Due: {format(new Date(event.dueDate), 'MMM dd, yyyy')}
                      </span>
                    )}
                  </div>
                  {event.remarks && (
                    <p className="mt-2 text-xs italic">"{event.remarks}"</p>
                  )}
                  {renderRating(event.rating)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground py-8 text-center">
            No recent events to display
          </div>
        )}
      </CardContent>
    </Card>
  );
}
