import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/utils/supabaseClient';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, UserRound, Trash2, Edit, Users } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  interviewerSchema,
  InterviewerFormValues,
  Interviewer,
  RoleFilter,
} from '@/schemas/interviewEventSchema';

const ManageInterviewerList = () => {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedInterviewer, setSelectedInterviewer] = useState<string | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editingInterviewer, setEditingInterviewer] =
    useState<Interviewer | null>(null);

  const form = useForm<InterviewerFormValues>({
    resolver: zodResolver(interviewerSchema),
    defaultValues: {
      interviewer_name: '',
      email: '',
      role: 'Full Stack Engineer',
      phone_number: '',
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const fetchInterviewers = async (): Promise<void> => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('Interviewer_table')
          .select('*');

        if (error) {
          throw error;
        }

        setInterviewers(data as Interviewer[]);
      } catch (error: any) {
        console.error('Error fetching interviewers:', error);
        toast.error('Failed to fetch interviewers');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewers();

    const subscription = supabase
      .channel('Interviewer_table-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Interviewer_table',
        },
        (payload) => {
          console.log('Change received!', payload);
          if (payload.eventType === 'INSERT') {
            setInterviewers((prev) => [...prev, payload.new as Interviewer]);
          } else if (payload.eventType === 'UPDATE') {
            setInterviewers((prev) =>
              prev.map((interviewer) =>
                interviewer.id === payload.new.id
                  ? (payload.new as Interviewer)
                  : interviewer
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setInterviewers((prev) =>
              prev.filter((interviewer) => interviewer.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (editingInterviewer) {
      form.reset({
        interviewer_name: editingInterviewer.interviewer_name,
        email: editingInterviewer.email,
        role: editingInterviewer.role as any,
        phone_number: editingInterviewer.phone_number,
      });
    }
  }, [editingInterviewer, form]);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('Interviewer_table')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Interviewer deleted successfully');
    } catch (error: any) {
      console.error('Error deleting interviewer:', error);
      toast.error(error.message || 'Failed to delete interviewer');
    }
  };

  const handleEdit = (interviewer: Interviewer): void => {
    setEditingInterviewer(interviewer);
    setIsEditDialogOpen(true);
  };

  const onSubmit = async (data: InterviewerFormValues): Promise<void> => {
    if (!editingInterviewer) return;

    try {
      const { error } = await supabase
        .from('Interviewer_table')
        .update({
          interviewer_name: data.interviewer_name,
          email: data.email,
          role: data.role,
          phone_number: data.phone_number,
        })
        .eq('id', editingInterviewer.id);

      if (error) {
        throw error;
      }

      toast.success('Interviewer updated successfully');
      setIsEditDialogOpen(false);
      setEditingInterviewer(null);
    } catch (error: any) {
      console.error('Error updating interviewer:', error);
      toast.error(error.message || 'Failed to update interviewer');
    }
  };

  return (
    <section className="my-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Manage Interviewers
          </h2>
          <p className="text-muted-foreground mt-1">
            View, edit, and manage your interviewer roster
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : interviewers.length === 0 ? (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Users size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No interviewers found</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              You haven't added any interviewers yet. Add your first interviewer
              to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {interviewers.map((interviewer) => (
            <Card
              key={interviewer.id}
              className="border transition-all hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="line-clamp-1">
                    {interviewer.interviewer_name}
                  </CardTitle>
                  <Badge variant="outline">{interviewer.role}</Badge>
                </div>
                {/* <CardDescription>
                  Interviewer ID: {interviewer.id.substring(0, 8)}
                </CardDescription> */}
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-muted-foreground" />
                    <span className="line-clamp-1">{interviewer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-muted-foreground" />
                    <span>{interviewer.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserRound size={16} className="text-muted-foreground" />
                    <span>{interviewer.role}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setSelectedInterviewer(interviewer.id)}
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the interviewer and remove their data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          selectedInterviewer &&
                          handleDelete(selectedInterviewer)
                        }
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleEdit(interviewer)}
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Interviewer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Interviewer</DialogTitle>
            <DialogDescription>
              Make changes to the interviewer details below.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-4"
            >
              <FormField
                control={form.control}
                name="interviewer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter interviewer name" {...field} />
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
                      <Input
                        placeholder="Enter email address"
                        type="email"
                        {...field}
                      />
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
                      <Input placeholder="Enter phone number" {...field} />
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RoleFilter.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ManageInterviewerList;
