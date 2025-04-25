"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  CalendarDays,
  CalendarIcon,
  Check,
  SearchCheck,
  Smile,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/use-event-data";

const generateIcon = (status: string) => {
  if (status === "pending") {
    return <Timer />;
  } else if (status === "in review") {
    return <SearchCheck />;
  } else {
    return <Check className="text-green-500" />;
  }
};

export function DateEvents() {
  const [date, setDate] = useState<Date>(new Date());
  const { events, isLoading, formatEventTime } = useEvents(date);
  console.log(events);

  return (
    <div className="my-10">
      <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
        <CalendarDays className="h-5 w-5" />
        View Events
      </h2>
      <div className="w-full m-auto ">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{format(date, "EEEE, MMMM d, yyyy")}</CardTitle>
                <CardDescription>View and manage your events</CardDescription>
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
                    onSelect={(newDate: Date) => newDate && setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="text-center py-6 text-muted-foreground">
                Loading events...
              </div>
            ) : events.length > 0 ? (
              <div className="space-y-4 ">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="border cursor-pointer rounded-lg p-4 transition-all duration-200 ease-in-out hover:border-primary"
                  >
                    <Link to={`/application-review/${event?.id}`}>
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-lg">
                          {event.event_name}
                        </div>
                        <div className="text-sm bg-pink-400/20 px-2 py-1 rounded-full">
                          {formatEventTime(event.event_date_time)}
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          {event.event_description}
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t bg">
                        <div className="flex justify-between gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Candidate
                            </p>
                            <p className="text-sm font-medium">
                              {event.applicant_details?.applicant_name || "N/A"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {event.applicant_details?.applied_position || ""}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Interviewer
                            </p>
                            <p className="text-sm font-medium">
                              {event.interviewer_name}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Status
                            </p>
                            <Button
                              variant={"outline"}
                              className="flex items-center gap-1"
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
                <div className="rounded-2xl flex items-center justify-center gap-3 py-15 border ">
                  <Smile className="text-green-400" size={30} />
                  <p className="text-green-400 font-bold">
                    No events scheduled for this day
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
