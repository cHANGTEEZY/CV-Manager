'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  CalendarDays,
  CalendarIcon,
  Check,
  FilterIcon,
  Smile,
  Timer,
  User,
  UserPen,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventType } from '@/hooks/use-event-data';

interface DateEventsProps {
  date: Date;
  setDate: (date: Date) => void;
  events: EventType[];
  isLoading: boolean;
  formatEventTime: (dateTimeString: string) => string;
}

const generateIcon = (status: string) => {
  const statusCheck = status.toLowerCase();

  if (status === 'pending') {
    return <Timer />;
  } else if (statusCheck.includes('passed')) {
    return <Check className="text-green-500" />;
  } else if (statusCheck.includes('failed')) {
    return <X className="text-red-500" />;
  }
};

export function DateEvents({
  date,
  setDate,
  events,
  isLoading,
  formatEventTime,
}: DateEventsProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredEvents = events.filter((event) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending')
      return event.interview_result.toLowerCase() === 'pending';
    if (statusFilter === 'passed')
      return event.interview_result.toLowerCase().includes('passed');
    if (statusFilter === 'failed')
      return event.interview_result.toLowerCase().includes('failed');
    return true;
  });

  return (
    <div className="my-10">
      <h2 className="text-primary mb-4 flex items-center gap-2 text-xl font-semibold">
        <CalendarDays className="h-5 w-5" />
        View Events
      </h2>
      <div className="m-auto w-full">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{format(date, 'EEEE, MMMM d, yyyy')}</CardTitle>
                <CardDescription>View and manage your events</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <FilterIcon className="text-primary h-4 w-4" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="passed">Completed</SelectItem>
                      <SelectItem value="failed">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="h-10 w-10 p-0">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="sr-only">Open calendar</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate: Date | undefined) => {
                        if (newDate) {
                          setDate(newDate);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="text-muted-foreground py-6 text-center">
                Loading events...
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="hover:border-primary cursor-pointer rounded-lg border p-4 transition-all duration-200 ease-in-out"
                  >
                    <Link
                      to={`/dashboard/application-review/${event?.applicant_details?.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-gradient-chart-1 text-lg font-medium">
                          {event.event_name}
                        </div>
                        <div className="rounded-full bg-pink-400/20 px-2 py-1 text-sm">
                          {formatEventTime(event.event_date_time)}
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="text-muted-foreground text-sm">
                          {event.event_description}
                        </p>
                      </div>

                      <div className="mt-3 border-t pt-3">
                        <div className="flex justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <User />
                            <div>
                              <p className="text-muted-foreground text-xs">
                                Candidate
                              </p>
                              <p className="text-sm font-medium">
                                {event.applicant_details?.applicant_name ||
                                  'N/A'}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {event.applicant_details?.applied_position ||
                                  ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <UserPen />
                            <div>
                              <p className="text-muted-foreground text-xs">
                                Interviewer
                              </p>
                              <p className="text-sm font-medium">
                                {event.interviewer_name}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">
                              Status
                            </p>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'flex items-center gap-1',
                                event.interview_result
                                  .toLowerCase()
                                  .includes('passed')
                                  ? 'cursor-pointer text-green-500 hover:text-green-500'
                                  : event.interview_result
                                        .toLowerCase()
                                        .includes('pending')
                                    ? 'cursor-pointer text-yellow-500 hover:text-yellow-500'
                                    : 'text-red-500 hover:text-red-500'
                              )}
                            >
                              {event.interview_result}
                              {generateIcon(event.interview_result)}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center gap-3 rounded-2xl border py-15">
                  <Smile className="text-green-400" size={30} />
                  <p className="font-bold text-green-400">
                    {statusFilter === 'all'
                      ? 'No events scheduled for this day'
                      : `No ${statusFilter} events for this day`}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
