import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useEvents } from '@/hooks/use-event-data';
import { supabase } from '@/utils/supabaseClient';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { InterviewTypeResults } from '@/constants/EventData';
import PendingCard from '../Pending';
import StarRating from '../Rating';

interface EventType {
  id: string;
  interview_type: string;
  interview_result: string;
  event_date_time: string;
  event_name: string;
  event_description?: string;
  interviewer_name: string;
  applicant_details?: {
    id: string;
    applicant_name?: string;
    applied_position?: string;
  };
}

export default function PendingInterviews() {
  const [date, setDate] = useState<Date>(new Date());
  const {
    events: allEvents,
    isLoading,
    formatEventTime,
    formatEventDate,
  } = useEvents(date);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [interviewResult, setInterviewResult] = useState('');
  const [candidateReview, setCandidateReview] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (allEvents && allEvents.length > 0) {
      const filtered = allEvents.filter(
        (event) => event.interview_result === 'pending'
      );
      setPendingEvents(filtered);
    } else {
      setPendingEvents([]);
    }
  }, [allEvents]);

  const openReviewDialog = (event: EventType) => {
    setSelectedEvent(event);
    setCandidateReview('');
    setRating(0);
    setInterviewResult('');
    setReviewDialogOpen(true);
  };

  const handleCompleteInterview = async () => {
    if (!selectedEvent) return;

    try {
      const { error } = await supabase
        .from('events')
        .update({
          interview_result: interviewResult,
          interview_remarks: candidateReview,
          interview_rating: rating,
        })
        .eq('id', selectedEvent.id);

      if (error) throw error;

      if (selectedEvent.applicant_details?.id) {
        const { error: applicantTableError } = await supabase
          .from('applicant_details')
          .update({
            applicant_status: interviewResult.toLowerCase().includes('fail')
              ? 'Rejected'
              : interviewResult,
            applicant_verdict: interviewResult.includes('Failed') ? 'Fail' : '',
            timeline_status: interviewResult,
          })
          .eq('id', selectedEvent.applicant_details.id);

        if (applicantTableError) {
          throw applicantTableError;
        }
      }

      setPendingEvents(
        pendingEvents.filter((event) => event.id !== selectedEvent.id)
      );

      toast.success('Interview state updated successfully');
      setReviewDialogOpen(false);
    } catch (error) {
      console.error('Error updating interview:', error);
      toast.error('There was an error');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-primary text-2xl font-bold">
            Pending Interviews
          </h1>
          <p className="text-muted-foreground">
            Review and complete candidate interviews
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock size={14} />
            <span>Pending: {pendingEvents.length}</span>
          </Badge>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex h-9 gap-1">
                <CalendarIcon className="h-4 w-4" />
                {format(date, 'MMM d, yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
            <p className="text-muted-foreground">Loading interviews...</p>
          </div>
        </div>
      ) : pendingEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {pendingEvents.map((event: any) => (
            <Card
              key={event.id}
              className={cn(
                'overflow-hidden border-l-4',
                new Date(event.event_date_time) > new Date()
                  ? 'border-l-yellow-400'
                  : 'border-l-green-400'
              )}
            >
              <CardHeader className="bg-muted/30 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {event.event_name}
                    </CardTitle>
                    <CardDescription>
                      {formatEventDate(event.event_date_time)} •{' '}
                      {formatEventTime(event.event_date_time)}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      new Date(event.event_date_time) > new Date()
                        ? 'bg-yellow-200 text-slate-600'
                        : 'bg-green-200 text-slate-600'
                    )}
                  >
                    {new Date(event.event_date_time) > new Date()
                      ? 'Event Scheduled'
                      : 'Event Completed'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">
                        Candidate
                      </p>
                      <p className="font-semibold">
                        {event.applicant_details?.applicant_name || 'N/A'}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {event.applicant_details?.applied_position || ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">
                        Interviewer
                      </p>
                      <p className="font-semibold">{event.interviewer_name}</p>
                    </div>
                  </div>

                  {event.event_description && (
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">
                        Interview Notes
                      </p>
                      <p className="text-sm">{event.event_description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="flex justify-end pt-4 pb-4">
                <Button
                  variant="default"
                  className={cn(
                    'flex items-center gap-2',
                    new Date(event.event_date_time) > new Date()
                      ? 'cursor-not-allowed bg-yellow-400 opacity-50 hover:bg-yellow-400'
                      : 'cursor-pointer bg-green-400 hover:bg-green-400'
                  )}
                  onClick={() => openReviewDialog(event)}
                  disabled={new Date(event.event_date_time) > new Date()}
                >
                  {new Date(event.event_date_time) > new Date() ? (
                    <span className="flex items-center gap-2">
                      <Clock size={16} /> Event Pending
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ThumbsUp size={16} /> Complete Interview
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <PendingCard />
      )}

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Interview & Submit Review</DialogTitle>
            <DialogDescription>
              Provide feedback about the candidate and mark this interview as
              completed.
            </DialogDescription>
          </DialogHeader>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Interview Result
            </label>
            <Select value={interviewResult} onValueChange={setInterviewResult}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Interview Result" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {selectedEvent &&
                    InterviewTypeResults.map((interviewType) => {
                      if (
                        interviewType.title === selectedEvent.interview_type
                      ) {
                        return interviewType.status.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ));
                      }
                      return null;
                    })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 py-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">Candidate Rating</p>
                <span className="text-muted-foreground text-xs">
                  {rating > 0 ? `${rating} of 5 stars` : 'Not rated yet'}
                </span>
              </div>
              <div className="mt-2">
                <StarRating rating={rating} onRatingChange={setRating} />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                <p className="text-sm font-medium">Review Comments</p>
              </div>
              <Textarea
                value={candidateReview}
                onChange={(e) => setCandidateReview(e.target.value)}
                placeholder="Share your thoughts about the candidate's performance, skills, and fit for the role..."
                className="h-32"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteInterview}
              disabled={
                !candidateReview.trim() ||
                rating === 0 ||
                !interviewResult.trim()
              }
            >
              Complete & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
