"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/utils/supabaseClient";

const interviewers = [
  { id: "1", name: "Sarah Johnson" },
  { id: "2", name: "Michael Chen" },
  { id: "3", name: "Priya Patel" },
  { id: "4", name: "David Kim" },
  { id: "5", name: "Lisa Wong" },
];

interface Applicant {
  id: number;
  applicant_name: string;
  applicant_email: string;
  applied_position: string;
  applicant_status: string;
  tech_stack: string;
}

const formSchema = z.object({
  event_name: z
    .string()
    .min(3, { message: "Event title must be at least 3 characters" }),
  event_description: z
    .string()
    .min(1, { message: "Event description is required" }),
  event_date: z.date({
    required_error: "Event date is required",
  }),
  event_time: z.string({
    required_error: "Event time is required",
  }),
  applicant_email: z.string({
    required_error: "Please select a candidate",
  }),
  interviewer_name: z.string({
    required_error: "Please select an interviewer",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const CreateEvent = () => {
  const [date, setDate] = useState<Date>();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("applicant_details")
          .select("*")
          .not("applicant_status", "eq", "Interview Scheduled");

        if (error) {
          throw error;
        }

        setApplicants(data || []);
      } catch (error) {
        console.error("Error fetching applicants:", error);
        toast.error("Failed to load applicants");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_name: "",
      event_description: "",
      event_date: undefined,
      event_time: "",
      applicant_email: "",
      interviewer_name: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const eventDateTime = new Date(data.event_date);
    const [hours, minutes] = data.event_time.split(":").map(Number);
    eventDateTime.setHours(hours, minutes);

    const selectedApplicant = applicants.find(
      (a) => a.applicant_email === data.applicant_email,
    );

    try {
      const { error: eventError } = await supabase.from("events").insert({
        event_name: data.event_name,
        event_description: data.event_description,
        event_date_time: eventDateTime.toISOString(),
        applicant_email: data.applicant_email,
        interviewer_name: data.interviewer_name,
      });

      if (eventError) {
        throw eventError;
      }

      if (selectedApplicant) {
        const { error: updateError } = await supabase
          .from("applicant_details")
          .update({ applicant_status: "Interview Scheduled" })
          .eq("id", selectedApplicant.id);

        if (updateError) {
          throw updateError;
        }
      }

      toast.success("Event created successfully");
      form.reset();
      setDate(undefined);

      const { data: refreshedData } = await supabase
        .from("applicant_details")
        .select("*")
        .not("applicant_status", "eq", "Interview Scheduled");

      setApplicants(refreshedData || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create event");
    }
  };

  return (
    <div className="max-w-md mt-10">
      <h3 className="text-xl font-semibold mb-4 text-primary">Create Event</h3>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>New Event Details</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="event_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-accent-foreground font-normal text-sm">
                      Event Title
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-accent-foreground font-normal text-sm">
                      Event Description
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-accent-foreground font-normal text-sm">
                      Event Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setDate(date || undefined);
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-accent-foreground font-normal text-sm">
                      Event Time
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).flatMap((_, hour) => [
                            <SelectItem
                              key={`${hour}:00`}
                              value={`${hour.toString().padStart(2, "0")}:00`}
                            >
                              {hour.toString().padStart(2, "0")}:00
                            </SelectItem>,
                            <SelectItem
                              key={`${hour}:30`}
                              value={`${hour.toString().padStart(2, "0")}:30`}
                            >
                              {hour.toString().padStart(2, "0")}:30
                            </SelectItem>,
                          ])}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicant_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-accent-foreground font-normal text-sm">
                      Candidate
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        disabled={isLoading || applicants.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoading
                                ? "Loading candidates..."
                                : "Select candidate"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {applicants.map((applicant) => (
                            <SelectItem
                              key={applicant.id.toString()}
                              value={applicant.applicant_email}
                            >
                              {applicant.applicant_name} -{" "}
                              {applicant.applied_position} (
                              {applicant.tech_stack})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select the candidate for this interview
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interviewer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-accent-foreground font-normal text-sm">
                      Interviewer
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select interviewer" />
                        </SelectTrigger>
                        <SelectContent>
                          {interviewers.map((interviewer) => (
                            <SelectItem
                              key={interviewer.id}
                              value={interviewer.name}
                            >
                              {interviewer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select the interviewer for this event
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-between pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => form.reset()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                Create Event
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateEvent;
