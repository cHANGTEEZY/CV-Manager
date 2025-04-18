"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Check, User } from "lucide-react";
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
import { supabase } from "@/utils/supabaseClient";
import { toast } from "sonner";
import { IconRight } from "react-day-picker";
import { Link } from "react-router-dom";

type EventProps = {
  id: number;
  event_name: string;
  event_date_time: string;
  event_description: string;
  applicant_email: string;
  interviewer_name: string;
  applicant_details?: {
    applicant_name: string;
    applied_position: string;
  };
};

export function DateEvents() {
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const formattedDate = format(date, "yyyy-MM-dd");

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("events")
          .select(
            `
            id,
            event_name,
            event_date_time,
            event_description,
            applicant_email,
            interviewer_name,
            applicant_details:applicant_email(applicant_name, applied_position)
          `,
          )
          .filter("event_date_time", "gte", `${formattedDate}T00:00:00`)
          .filter("event_date_time", "lte", `${formattedDate}T23:59:59`)
          .order("event_date_time", { ascending: true });

        if (error) {
          throw error;
        }

        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [formattedDate]);

  const formatEventTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return format(date, "h:mm a");
  };

  return (
    <div className="my-10">
      <h2 className="text-xl font-semibold mb-4 text-primary">View Events</h2>
      <div className="w-full m-auto ">
        <Card>
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
              <div className="space-y-4">
                {events.map((event) => (
                  <Link to={`/event/${event.id}/mange-event`}>
                  <div
                    key={event.id}
                    className="border cursor-pointer rounded-lg p-4 transition-all duration-200 ease-in-out hover:border-primary"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-lg">
                        {event.event_name}
                      </div>
                      <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {formatEventTime(event.event_date_time)}
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        {event.event_description}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Candidate
                          </p>
                          <p className="text-sm f`ont-medium">
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
                          <p className="text-xs text-muted-foreground">Status</p>
                          <Button variant={"outline"} className="flex items-center gap-1">
                            Completed
                          <Check/>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div>
                <div className="text-center py-6 text-muted-foreground">
                  No events scheduled for this day
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
