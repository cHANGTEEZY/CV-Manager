import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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

const eventsData = {
  "2025-04-13": [
    {
      id: 1,
      title: "Team Meeting",
      time: "09:00 AM",
      location: "Conference Room A",
    },
    {
      id: 2,
      title: "Lunch with Client",
      time: "12:30 PM",
      location: "Downtown Cafe",
    },
  ],
  "2025-04-14": [
    { id: 3, title: "Project Deadline", time: "05:00 PM", location: "Office" },
  ],
  "2025-04-15": [
    {
      id: 4,
      title: "Birthday Party",
      time: "07:00 PM",
      location: "Rooftop Bar",
    },
    {
      id: 5,
      title: "Doctor Appointment",
      time: "10:30 AM",
      location: "Medical Center",
    },
  ],
};

type EventProps = {
  id: number;
  title: string;
  time: string;
  location: string;
};

export function DateEvents() {
  const [date, setDate] = useState<Date>(new Date());
  const formattedDate = format(date, "yyyy-MM-dd");
  const events = eventsData[formattedDate] || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{format(date, "EEEE, MMMM d, yyyy")}</CardTitle>
            <CardDescription>View and manage your events</CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 w-10 p-0">
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
      <CardContent>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event: EventProps) => (
              <div key={event.id} className="border rounded-lg p-4">
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {event.time} • {event.location}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No events scheduled for this day
          </div>
        )}
      </CardContent>
    </Card>
  );
}
