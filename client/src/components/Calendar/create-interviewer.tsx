'use client';

import { UserPlus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/utils/supabaseClient';
import { toast } from 'sonner';
import {
  interviewerSchema,
  InterviewerFormValues,
  RoleFilter,
} from '@/schemas/interviewEventSchema';

const CreateInterviewer = () => {
  const form = useForm<InterviewerFormValues>({
    resolver: zodResolver(interviewerSchema),
    defaultValues: {
      interviewer_name: '',
      email: '',
      role: undefined,
      phone_number: '',
    },
  });

  const handleSubmit = async (data: InterviewerFormValues) => {
    try {
      const { error } = await supabase.from('Interviewer_table').insert({
        interviewer_name: data.interviewer_name,
        email: data.email,
        phone_number: data.phone_number,
        role: data.role,
      });

      if (error) {
        throw error;
      }

      toast.success('Interviewer Created Successfully');
      form.reset();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create interviewer');
    }
  };

  return (
    <section className="my-10">
      <h2 className="text-primary mb-4 flex items-center gap-2 text-xl font-semibold">
        <UserPlus className="h-5 w-5" />
        Create Interviewer
      </h2>
      <Card className="border-2">
        <CardHeader className="border-b">
          <CardTitle>Manage Interviewers</CardTitle>
          <CardDescription>
            Create and manage interviewers for scheduled events.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="interviewer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interviewer Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {RoleFilter.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="mt-5 border-t">
              <Button type="submit" className="cursor-pointer">
                Create Interviewer
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </section>
  );
};

export default CreateInterviewer;
