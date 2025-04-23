import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  SelectTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { PopoverContent, Popover, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/utils/supabaseClient";
import { toast } from "sonner";

const assessmentSchema = z.object({
  title: z
    .string()
    .nonempty({ message: "Title is required" })
    .min(4, { message: "Title must be at least 4 characters long" }),

  type: z.enum(["Full Stack", "Frontend", "Backend", "Devops", "UI/UX"], {
    required_error: "Please select the assessment type",
  }),

  level: z.enum(["Intern", "Junior", "Intermediate", "Senior"], {
    required_error: "Please select the assessment level",
  }),

  formLink: z.string().min(1, {
    message: "Assessment Link is required",
  }),

  submissionDate: z.date({
    required_error: "Please specify the submission deadline",
  }),

  requirements: z
    .string()
    .nonempty({ message: "Requirements cannot be empty" }),
});

const assessmentType = ["Full Stack", "Frontend", "Backend", "Devops", "UI/UX"];
const assessmentLevel = ["Intern", "Junior", "Intermediate", "Senior"];

type AssessmentProps = z.infer<typeof assessmentSchema>;

const CreateAssessmentForm = () => {
  const form = useForm<AssessmentProps>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: "",
      formLink: "",
      requirements: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: AssessmentProps) => {
    try {
      const { error: assessmentError } = await supabase
        .from("assessment_table")
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

      toast.success("Assessment created successfully");
      form.reset();
    } catch (error: any) {
      console.error(error);
      toast.error(error);
    }
  };

  return (
    <div className="my-10 max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-primary">
        Create Custom Assessment
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
                    <FormControl>
                      <Input
                        placeholder="Enter title for assessment"
                        {...field}
                      />
                    </FormControl>
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
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
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
              <Button type="submit">Submit</Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateAssessmentForm;
