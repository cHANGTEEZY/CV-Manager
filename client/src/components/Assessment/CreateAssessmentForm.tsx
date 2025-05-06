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
import { CalendarIcon, FilePlus, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/utils/supabaseClient';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { AssessmentProps } from '@/schemas/assessmentSchema';
import {
  assessmentTitle,
  assessmentType,
  assessmentLevel,
} from '@/constants/Assessments';
import { Alert, AlertDescription } from '../ui/alert';

// Enhanced schema with cross-field validation
const enhancedAssessmentSchema = z
  .object({
    title: z.enum(
      [
        'Full Stack Assessment Round 1',
        'Full Stack Assessment Round 2',
        'Frontend Assessment Round 1',
        'Frontend Assessment Round 2',
        'Backend Assessment Round 1',
        'Backend Assessment Round 2',
        'AI/ML Assessment Round 1',
        'AI/ML Assessment Round 2',
        'Devops Assessment Round 1',
        'Devops Assessment Round 2',
        'UI/UX Assessment Round 1',
        'UI/UX Assessment Round 2',
      ],
      {
        required_error: 'Please select the assessment title',
      }
    ),
    type: z.enum(
      [
        'Full Stack Engineer',
        'Frontend Engineer',
        'Backend Engineer',
        'AI/ML Engineer',
        'Devops Engineer',
        'UI/UX Designer',
      ],
      {
        required_error: 'Please select the assessment type',
      }
    ),
    level: z.enum(['Intern', 'Junior', 'Intermediate', 'Senior'], {
      required_error: 'Please select the assessment level',
    }),
    formLink: z.string().min(1, {
      message: 'Assessment Link is required',
    }),
    submissionDate: z.date({
      required_error: 'Please specify the submission deadline',
    }),
    requirements: z
      .string()
      .nonempty({ message: 'Requirements cannot be empty' }),
  })
  .refine(
    (data) => {
      // Check if title and type are compatible
      const titlePrefix = data.title.split(' ')[0]; // Get "Full Stack", "Frontend", etc.
      const typePrefix = data.type.split(' ')[0]; // Get "Full", "Frontend", etc.

      // Special case for "Full Stack" title and "Full Stack Engineer" type
      if (titlePrefix === 'Full' && typePrefix === 'Full') {
        return true;
      }

      // For all other cases, title prefix should match type prefix
      return titlePrefix === typePrefix;
    },
    {
      message: 'Assessment title and type must match',
      path: ['type'], // Show error on the type field
    }
  );

const CreateAssessmentForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const form = useForm<AssessmentProps>({
    resolver: zodResolver(enhancedAssessmentSchema),
    defaultValues: {
      formLink: '',
      requirements: '',
    },
    mode: 'onBlur',
  });

  // Watch for changes in title and type to provide real-time validation feedback
  const selectedTitle = form.watch('title');
  const selectedType = form.watch('type');

  useEffect(() => {
    if (selectedTitle && selectedType) {
      const titlePrefix = selectedTitle.split(' ')[0]; // "Full Stack", "Frontend", etc.
      const typePrefix = selectedType.split(' ')[0]; // "Full", "Frontend", etc.

      // Check if title and type match
      let hasError = false;

      // Special case for "Full Stack" title and "Full Stack Engineer" type
      if (titlePrefix === 'Full' && typePrefix === 'Full') {
        hasError = false;
      } else if (titlePrefix !== typePrefix) {
        hasError = true;
      }

      if (hasError) {
        setValidationError(
          `${selectedTitle} cannot be used with ${selectedType}`
        );
      } else {
        setValidationError(null);
      }
    }
  }, [selectedTitle, selectedType]);

  const onSubmit = async (data: AssessmentProps) => {
    try {
      setIsLoading(true);

      // Check for title and type compatibility again before submission
      const titlePrefix = data.title.split(' ')[0];
      const typePrefix = data.type.split(' ')[0];

      const isValid =
        (titlePrefix === 'Full' && typePrefix === 'Full') ||
        titlePrefix === typePrefix;

      if (!isValid) {
        setValidationError(`${data.title} cannot be used with ${data.type}`);
        setIsLoading(false);
        return;
      }

      // Fix for timezone issue: ensure the date is stored correctly by formatting it to ISO
      // and setting the time to noon to avoid any timezone-related shifts
      const selectedDate = new Date(data.submissionDate);
      // Set the time to 12:00:00 to avoid timezone shifts
      selectedDate.setHours(12, 0, 0, 0);

      const { error: assessmentError } = await supabase
        .from('assessment_table')
        .insert({
          title: data.title,
          type: data.type,
          level: data.level,
          formLink: data.formLink,
          submissionDate: selectedDate.toISOString(),
          requirements: data.requirements,
        });

      if (assessmentError) {
        throw assessmentError;
      }

      toast.success('Assessment created successfully');

      // Reset form completely
      form.reset({
        title: undefined,
        type: undefined,
        level: undefined,
        formLink: '',
        submissionDate: undefined,
        requirements: '',
      });

      setValidationError(null);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error creating assessment:', error);
      toast.error(error.message || 'Failed to create assessment');
      setIsLoading(false);
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
              {validationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assessment Title</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Clear validation error when changing selection
                        if (validationError) setValidationError(null);
                      }}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select The Assessment Round" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assessmentTitle.map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}
                          </SelectItem>
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
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Clear validation error when changing selection
                        if (validationError) setValidationError(null);
                      }}
                      defaultValue={field.value}
                      value={field.value}
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
                      value={field.value}
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
              <Button
                type="submit"
                disabled={isLoading || !!validationError}
                className={cn(
                  validationError && 'cursor-not-allowed opacity-50'
                )}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateAssessmentForm;
