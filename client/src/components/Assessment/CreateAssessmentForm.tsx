import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  SelectTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../ui/select';
import { PopoverContent, Popover, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { CalendarIcon, FilePlus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/utils/supabaseClient';
import { toast } from 'sonner';
import { useState } from 'react';
import { AssessmentProps } from '@/schemas/assessmentSchema';
import { assessmentSchema } from '@/schemas/assessmentSchema';

const assessmentTitle = [
  'Full Stack Assessment Round 1',
  'Full Stack Assessment Round 2',
  'Frontend Assessment Round 1',
  'Frontend Assessment Round 2',
  'Backend Assessment Round 1',
  'Backend Assessment Round 2',
  'Devops Assessment Round 1',
  'Devops Assessment Round 2',
  'UI/UX Assessment Round 1',
  'UI/UX Assessment Round 2',
];
const assessmentType = ['Full Stack', 'Frontend', 'Backend', 'Devops', 'UI/UX'];
const assessmentLevel = ['Intern', 'Junior', 'Intermediate', 'Senior'];

const CreateAssessmentForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AssessmentProps>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: '',
      formLink: '',
      requirements: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: AssessmentProps) => {
    try {
      setIsLoading(true);
      const { error: assessmentError } = await supabase
        .from('assessment_table')
        .insert({
          title: data.title,
          type: data.type,
          level: data.level,
          formLink: data.formLink,
          submissionDate: new Date(data.submissionDate),
          requirements: data.requirements,
        });

      if (assessmentError) {
        throw assessmentError;
      }

      toast.success('Assessment created successfully');
      form.reset();
      setIsLoading(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error);
    }
  };

  return (
    <div className="my-10 max-w-md">
      <h2 className="text-primary mb-4 flex items-center gap-2 text-xl font-semibold">
        <FilePlus className="h-5 w-5" /> Create Custom Assessment
      </h2>
      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle>Assessment Details</CardTitle>
          <CardDescription>
            Provide the title, category, difficulty level, and other basic
            settings for your custom assessment.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent className="space-y-6">
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assessment Title</FormLabel>
                    <Select>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select The Assessment Round" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assessmentTitle.map((title) => (
                          <SelectItem value={title}>{title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="type"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assessment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the Assessment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assessmentType.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="level"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Assessment Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assessmentLevel.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="formLink"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assessment Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Google Form Link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="submissionDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assessment Deadline</FormLabel>
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
                          onSelect={field.onChange}
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
                name="requirements"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assessment Requirements</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter assessment requirements"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                Submit
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateAssessmentForm;
