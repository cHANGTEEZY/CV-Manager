import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Send } from 'lucide-react';
import { Separator } from '../ui/separator';
import ApplicantTimeLine from './ApplicantTimeLine';
import ApplicantRejected from './ApplicantRejected';
import { useParams } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { motion } from 'framer-motion';
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
} from '../ui/alert-dialog';
import { toast } from 'sonner';

const ReviewApplicationForm = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState<any>({});
  const [eventData, setEventData] = useState([]);
  const [assignmentData, setAssignmentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applicantStatus, setApplicantStatus] = useState('in-progress');

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const { data: userData, error: userError } = await supabase
          .from('applicant_details')
          .select('*')
          .eq('id', id)
          .single();
        if (userError) throw userError;

        const { data: allEvents, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('applicant_email', userData.applicant_email);
        if (eventsError) throw eventsError;

        const { data: assessmentData, error: assessmentError } = await supabase
          .from('assessment_event')
          .select('*')
          .eq('candidate_email', userData.applicant_email);
        if (assessmentError) throw assessmentError;

        setUserData({
          name: userData.applicant_name,
          email: userData.applicant_email,
          phoneNo: userData.applicant_phone_number,
          appliedPosition: userData.applied_position,
          cvPath: userData.applicant_file_path,
        });

        const sortedEvents = [...allEvents].sort((a, b) => {
          const dateA = new Date(a.event_date_time);
          const dateB = new Date(b.event_date_time);
          return dateA.getTime() - dateB.getTime();
        });

        const formattedEventData = sortedEvents.map((event) => {
          const eventDate = new Date(event.event_date_time);
          const formattedDate = eventDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
          const formattedTime = eventDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

          let status = 'Scheduled';
          if (event.interview_result && event.interview_result !== 'pending') {
            const eventStatus = event.interview_result.toLowerCase();
            if (eventStatus.includes('passed')) {
              status = 'Passed';
            } else if (
              eventStatus.includes('fail') ||
              eventStatus.includes('rejected')
            ) {
              status = 'Failed';
            }
          }

          return {
            title: event.event_name,
            interviewDate: `${formattedDate} - ${formattedTime}`,
            status,
          };
        });

        setEventData(formattedEventData);
        setAssignmentData(assessmentData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    if (id) {
      getData();
    }
  }, [id]);

  const motionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const handleAccept = async () => {
    try {
      const { error } = await supabase
        .from('applicant_details')
        .update({ applicant_status: 'onboarding' })
        .eq('applicant_email', userData.email);

      if (error) throw error;

      setApplicantStatus('onboarding');
      toast.success('Applicant moved to onboarding');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleReject = async () => {
    try {
      const { error } = await supabase
        .from('applicant_details')
        .update({
          applicant_status: 'rejected',
          applicant_verdict: 'Failed',
        })
        .eq('applicant_email', userData.email);

      if (error) throw error;

      setApplicantStatus('rejected');
      toast.error('Applicant has been rejected');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const applicantActions = [
    {
      title: 'Offer',
      description: 'This action will accept the applicant',
      action: handleAccept,
    },
    {
      title: 'Reject',
      description: 'This action will reject the applicant',
      action: handleReject,
    },
  ];

  return (
    <section>
      {isLoading ? (
        <div className="text-muted-foreground mt-50 flex w-full items-center justify-center">
          <h1 className="animate-pulse text-2xl">Loading user data...</h1>
        </div>
      ) : Object.keys(userData).length > 0 ? (
        <div>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-17 w-17">
                    <AvatarFallback>
                      {userData.name
                        ?.split(' ')
                        .map((n: string) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {userData.name || 'NA'}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {userData.email || 'NA'}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {userData.phoneNo || 'NA'}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {userData.appliedPosition || 'NA'}
                    </p>
                  </div>
                </div>
                <div>
                  {applicantActions.map((action) => (
                    <AlertDialog key={action.title}>
                      <AlertDialogTrigger>
                        <Button
                          variant="outline"
                          className="flex cursor-pointer items-center gap-2 text-red-400 hover:text-red-500"
                        >
                          <Send size={16} /> {action.title}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {action.description}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={action.action}>
                            {action.title}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="mt-7" />

          {applicantStatus === 'rejected' ? (
            <ApplicantRejected applicantName={userData.name} />
          ) : (
            <Tabs defaultValue="timeline" className="mt-5 w-full">
              <TabsList className="bg-muted rounded-full p-1">
                <TabsTrigger
                  value="timeline"
                  className="data-[state=active]:bg-primary cursor-pointer rounded-full transition data-[state=active]:text-white"
                >
                  Applicant's Timeline
                </TabsTrigger>
                <TabsTrigger
                  value="info"
                  className="data-[state=active]:bg-primary cursor-pointer rounded-full transition data-[state=active]:text-white"
                >
                  Applicant's Info
                </TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" asChild>
                <motion.div
                  variants={motionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <ApplicantTimeLine timeline={2} />
                  <Separator className="mt-7" />
                  {eventData.length > 0 ? (
                    <div className="mt-5">
                      <h2 className="text-primary mb-4 text-xl font-semibold">
                        View Applicant's Events
                      </h2>
                      <Card className="mb-10">
                        <CardHeader className="border-b">
                          <CardTitle>Interview Events</CardTitle>
                          <CardDescription>
                            Monitor applicant events
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {eventData.map((event, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between rounded-2xl border p-5"
                              >
                                <div>
                                  <h4 className="text-gradient-destructive font-extrabold">
                                    {event.title}
                                  </h4>
                                  <p className="text-sm text-slate-500">
                                    {event.interviewDate}
                                  </p>
                                </div>
                                <span
                                  className={`rounded-sm px-3 py-1 text-sm ${
                                    event.status === 'Passed'
                                      ? 'bg-green-300 text-green-600'
                                      : event.status === 'Scheduled'
                                        ? 'bg-amber-200 text-amber-600'
                                        : 'bg-red-300 text-red-500'
                                  }`}
                                >
                                  {event.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center">
                      No Interview data found
                    </div>
                  )}
                  <div>
                    <Card className="mb-10">
                      <CardHeader className="border-b">
                        <CardTitle>Assessment Events</CardTitle>
                        <CardDescription>
                          Monitor applicant assessments
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {assignmentData.length > 0 ? (
                          <div className="space-y-4">
                            {assignmentData.map((assessment) => (
                              <div
                                key={assessment.id}
                                className="flex items-center justify-between rounded-2xl border p-5"
                              >
                                <div>
                                  <h4 className="text-gradient-destructive font-extrabold">
                                    {assessment.assessment_title}
                                  </h4>
                                  <div className="space-y-1">
                                    <p className="text-sm text-slate-500">
                                      Due Date:{' '}
                                      {new Date(
                                        assessment.due_date
                                      ).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                      })}
                                    </p>
                                    {assessment.assessment_remarks && (
                                      <p className="text-sm text-slate-600">
                                        Remarks: {assessment.assessment_remarks}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <span
                                  className={`rounded-sm px-3 py-1 text-sm ${
                                    assessment.assessment_result === 'Passed'
                                      ? 'bg-green-300 text-green-600'
                                      : assessment.assessment_remarks ===
                                          'Failed'
                                        ? 'bg-red-300 text-red-600'
                                        : 'bg-slate-300 text-slate-600'
                                  }`}
                                >
                                  {assessment.assessment_result
                                    ? assessment.assessment_result
                                    : 'Pending'}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-center">
                            No Assessment data found
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="info" asChild>
                <motion.div
                  variants={motionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <h2 className="text-primary mb-4 text-xl font-semibold">
                    View Applicant's CV
                  </h2>
                  {userData.cvPath ? (
                    <div className="overflow-hidden rounded-lg border">
                      <iframe
                        src={`${import.meta.env.VITE_SUPABASE_BUCKET_URL}/${userData.cvPath}`}
                        className="h-[700px] w-full"
                        title="Applicant CV"
                      ></iframe>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center">
                      CV Not uploaded
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      ) : (
        <div className="text-muted-foreground mt-50 flex w-full items-center justify-center">
          <h1 className="text-2xl">No user data found for the given user</h1>
        </div>
      )}
    </section>
  );
};

export default ReviewApplicationForm;
