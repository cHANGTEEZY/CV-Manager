"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Check,
  Clock,
  Filter,
  MessageSquare,
  Star,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/use-event-data";
import { supabase } from "@/utils/supabaseClient";
import { cn } from "@/lib/utils";

export default function PendingInterviews() {
  const [date, setDate] = useState<Date>(new Date());
  const {
    events: allEvents,
    isLoading,
    formatEventTime,
    formatEventDate,
  } = useEvents(date);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [candidateReview, setCandidateReview] = useState("");
  const [rating, setRating] = useState(0);

  console.log(pendingEvents);

  useEffect(() => {
    if (allEvents && allEvents.length > 0) {
      const filtered = allEvents.filter(
        (event) => event.interview_result === "pending"
      );
      setPendingEvents(filtered);
    } else {
      setPendingEvents([]);
    }
  }, [allEvents]);

  const openReviewDialog = (event) => {
    setSelectedEvent(event);
    setCandidateReview("");
    setRating(0);
    setReviewDialogOpen(true);
  };

  const handleCompleteInterview = async () => {
    if (!selectedEvent) return;

    try {
      const { error } = await supabase
        .from("events")
        .update({
          interview_result: "completed",
          interview_remarks: candidateReview,
          interview_rating: rating,
          completed_at: new Date().toISOString(),
        })
        .eq("id", selectedEvent.id);

      if (error) throw error;

      setPendingEvents(
        pendingEvents.filter((event) => event.id !== selectedEvent.id)
      );

      toast.success("Interview state updated successfully");

      setReviewDialogOpen(false);
    } catch (error) {
      console.error("Error updating interview:", error);
      toast.error("There was an error");
    }
  };

  const renderRatingStars = () => {
    return (
      <div className="flex items-center space-x-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            className={`cursor-pointer ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">
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
              <Button variant="outline" size="sm" className="h-9 flex gap-1">
                <CalendarIcon className="h-4 w-4" />
                {format(date, "MMM d, yyyy")}
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
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading interviews...</p>
          </div>
        </div>
      ) : pendingEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingEvents.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden border-l-4 border-l-yellow-400"
            >
              <CardHeader className="bg-muted/30 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {event.event_name}
                    </CardTitle>
                    <CardDescription>
                      {formatEventDate(event.event_date_time)} •{" "}
                      {formatEventTime(event.event_date_time)}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                  >
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Candidate
                      </p>
                      <p className="font-semibold">
                        {event.applicant_details?.applicant_name || "N/A"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.applicant_details?.applied_position || ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Interviewer
                      </p>
                      <p className="font-semibold">{event.interviewer_name}</p>
                    </div>
                  </div>

                  {event.event_description && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Interview Notes
                      </p>
                      <p className="text-sm">{event.event_description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="pt-4 pb-4 flex justify-end">
                <Button
                  variant="default"
                  className={
                    (cn("flex items-center gap-2"),
                    new Date(event.event_date_time) > new Date())
                      ? "hover:cursor-not-allowed"
                      : "hover:cursor-pointer"
                  }
                  onClick={() => openReviewDialog(event)}
                  disabled={new Date(event.event_date_time) > new Date()}
                >
                  <ThumbsUp size={16} />
                  Complete Interview
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-muted/20">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-3 inline-flex mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                There are no pending interviews for the selected date. Try
                selecting a different date or check back later.
              </p>
            </div>
          </CardContent>
        </Card>
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

          <div className="space-y-4 py-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-sm">Candidate Rating</p>
                <span className="text-xs text-muted-foreground">
                  {rating > 0 ? `${rating} of 5 stars` : "Not rated yet"}
                </span>
              </div>
              {renderRatingStars()}
            </div>

            <div>
              <div className="flex items-center mb-2">
                <MessageSquare className="mr-2 h-4 w-4" />
                <p className="font-medium text-sm">Review Comments</p>
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
              disabled={!candidateReview.trim() || rating === 0}
            >
              Complete & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
