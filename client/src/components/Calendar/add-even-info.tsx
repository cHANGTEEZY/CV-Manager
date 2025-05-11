'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, FilePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/utils/supabaseClient';
import {
  formSchema,
  Applicant,
  interviewTypes,
  Interviewer,
} from '@/schemas/interviewEventSchema';

type FormValues = z.infer<typeof formSchema>;

interface CreateEventProps {
  setDate?: (date: Date) => void;
}

const CreateEvent = ({ setDate }: CreateEventProps) => {
  const [_date, setLocalDate] = useState<Date>();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [selectedInterviewType, setSelectedInterviewType] = useState<
    string | null
  >(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interview_type: '',
      event_name: '',
      event_description: '',
      event_date: undefined,
      event_time: '',
      applicant_email: '',
      interviewer_name: '',
    },
  });

  const fetchApplicants = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('applicant_details')
        .select('*');

      if (error) {
        throw error;
      }

      setApplicants(data || []);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      toast.error('Failed to load applicants');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    if (!selectedInterviewType || !applicants.length) {
      setFilteredApplicants([]);
      return;
    }

    const interviewType = interviewTypes.find(
      (type) => type.id === selectedInterviewType
    );

    if (!interviewType) {
      setFilteredApplicants([]);
      return;
    }

    const filtered = applicants.filter(
      (applicant) => applicant.applicant_status === interviewType.requiredStatus
    );

    setFilteredApplicants(filtered);

    form.setValue('applicant_email', '');
  }, [selectedInterviewType, applicants, form]);

  const interviewTypeWatch = form.watch('interview_type');

  useEffect(() => {
    setSelectedInterviewType(interviewTypeWatch);

    if (interviewTypeWatch) {
      const selectedType = interviewTypes.find(
        (type) => type.id === interviewTypeWatch
      );
      if (selectedType) {
        form.setValue(
          'event_name',
          `${selectedType.name} - Candidate Assessment`
        );
        form.setValue(
          'event_description',
          `${selectedType.name} for candidate assessment and evaluation`
        );
      }
    }
  }, [interviewTypeWatch, form]);

  //geting interviewers
  useEffect(() => {
    const getInterviewers = async () => {
      try {
        const { data: interviewersData, error: interviewerTableError } =
          await supabase.from('Interviewer_table').select('*');
        if (interviewerTableError) throw interviewerTableError;
        setInterviewers(interviewersData as Interviewer[]);
      } catch (error: any) {
        toast.error(error);
      }
    };

    getInterviewers();
  }, []);

  const onSubmit = async (data: FormValues) => {
    const eventDateTime = new Date(data.event_date);
    const [hours, minutes] = data.event_time.split(':').map(Number);
    eventDateTime.setHours(hours, minutes);

    const selectedApplicant = applicants.find(
      (a) => a.applicant_email === data.applicant_email
    );

    const interviewType = interviewTypes.find(
      (type) => type.id === data.interview_type
    );

    if (!interviewType || !selectedApplicant) {
      toast.error('Invalid interview type or applicant');
      return;
    }

    try {
      const { error: eventError } = await supabase.from('events').insert({
        event_name: data.event_name,
        event_description: data.event_description,
        event_date_time: eventDateTime.toISOString(),
        applicant_email: data.applicant_email,
        interviewer_name: data.interviewer_name,
        interview_type: data.interview_type,
        interview_result: 'pending',
      });

      if (eventError) {
        throw eventError;
      }

      const { error: updateError } = await supabase
        .from('applicant_details')
        .update({
          applicant_status: interviewType.newStatus,
          applicant_timeline: 3,
          timeline_status: interviewType.newStatus,
        })
        .eq('id', selectedApplicant.id);

      if (updateError) {
        throw updateError;
      }

      toast.success(`${interviewType.name} scheduled successfully`);
      form.reset();
      setLocalDate(undefined);
      // Update the selected date in DateEvents
      if (setDate) {
        setDate(new Date(data.event_date));
      }
      // Refresh applicants list
      await fetchApplicants();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create event');
    }
  };

  return (
    <div className="mt-10 max-w-md">
      <h3 className="text-primary mb-4 flex items-center gap-2 text-xl font-semibold">
        <FilePlus className="h-5 w-5" />
        Create Event
      </h3>
      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle>New Event Details</CardTitle>
          <CardDescription>Create custom events for applicants</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="interview_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-accent-foreground text-sm font-normal">
                      Interview Type *
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select interview type" />
                        </SelectTrigger>
                        <SelectContent>
                          {interviewTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select the type of interview to schedule
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-accent-foreground text-sm font-normal">
                      Event Title *
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
                    <FormLabel className="text-accent-foreground text-sm font-normal">
                      Event Description *
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
                    <FormLabel className="text-accent-foreground text-sm font-normal">
                      Event Date *
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
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
                            setLocalDate(date || undefined);
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
                    <FormLabel className="text-accent-foreground text-sm font-normal">
                      Event Time *
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).flatMap((_, hour) => [
                            <SelectItem
                              key={`${hour}:00`}
                              value={`${hour.toString().padStart(2, '0')}:00`}
                            >
                              {hour.toString().padStart(2, '0')}:00
                            </SelectItem>,
                            <SelectItem
                              key={`${hour}:30`}
                              value={`${hour.toString().padStart(2, '0')}:30`}
                            >
                              {hour.toString().padStart(2, '0')}:30
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
                    <FormLabel className="text-accent-foreground text-sm font-normal">
                      Candidate *
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={
                          isLoading ||
                          !selectedInterviewType ||
                          filteredApplicants.length === 0
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              isLoading
                                ? 'Loading candidates...'
                                : !selectedInterviewType
                                  ? 'Select interview type first'
                                  : filteredApplicants.length === 0
                                    ? 'No eligible candidates'
                                    : 'Select candidate'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredApplicants.map((applicant) => (
                            <SelectItem
                              key={applicant.id.toString()}
                              value={applicant.applicant_email}
                            >
                              {applicant.applicant_name} -{' '}
                              {applicant.applied_position} (
                              {applicant.tech_stack})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      {selectedInterviewType
                        ? `Select a candidate eligible for ${
                            interviewTypes.find(
                              (t) => t.id === selectedInterviewType
                            )?.name
                          }`
                        : 'Please select an interview type first'}
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
                    <FormLabel className="text-accent-foreground text-sm font-normal">
                      Interviewer *
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select interviewer" />
                        </SelectTrigger>
                        <SelectContent>
                          {interviewers.map((interviewer) => (
                            <SelectItem
                              key={interviewer.id}
                              value={interviewer.interviewer_name}
                              className="capitalize"
                            >
                              {interviewer.interviewer_name}
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
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={
                  isLoading ||
                  !selectedInterviewType ||
                  filteredApplicants.length === 0
                }
              >
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
