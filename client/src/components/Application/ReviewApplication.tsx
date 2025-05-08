'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/utils/supabaseClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { toast } from 'sonner';
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
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import HorizontalTimeline from '../horizontal-timeline';
import { ApplicantProfileCard } from './ApplicationProfileCard';
import { EventCard } from './event-card';
import ApplicantRejected from './ApplicantRejected';
import {
  fallbackDescriptions,
  defaultDescriptions,
  labels,
} from '@/constants/ApplicationReviewPage';
import { reload } from '@/utils/reload';

export default function ReviewApplicationForm() {
  const { id } = useParams();
  const [userData, setUserData] = useState<any>();
  const [eventData, setEventData] = useState<any>([]);
  const [assignmentData, setAssignmentData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applicantStatus, setApplicantStatus] = useState(
    userData?.applicant_status
  );

  const isHired =
    applicantStatus === 'Hired' ||
    applicantStatus === 'Applicant Eligble for Offer';
  const isRejected =
    applicantStatus === 'rejected' ||
    applicantStatus === 'Pending Email Rejection';
  const disableButtons = isHired || isRejected;

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
          timeline: userData.applicant_timeline,
          applicant_status: userData.applicant_status,
          timeline_description: userData.timeline_status,
        });

        setApplicantStatus(userData.applicant_status);
        console.log('Here', userData.applicant_status);

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
        .update({
          applicant_status: 'Applicant Eligble for Offer',
          applicant_verdict: 'Offer',
          applicant_timeline: 7,
          timeline_status: 'accepted',
        })
        .eq('applicant_email', userData?.email);

      if (error) throw error;

      toast.success('Applicant moved to onboarding');
      reload();
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
          applicant_status: 'Pending Email Rejection',
          applicant_verdict: 'Fail',
          timeline_status: 'rejected',
        })
        .eq('applicant_email', userData?.email);

      if (error) throw error;

      toast.error('Applicant has been rejected');
      reload();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const currentTimeline = userData?.timeline || 1;

  const timelineSteps = labels.map((label, index) => {
    const id = index + 1;

    return {
      id,
      label,
      description:
        currentTimeline === id && userData?.timeline_description
          ? userData.timeline_description
          : currentTimeline >= id
            ? fallbackDescriptions[index]
            : defaultDescriptions[index],
    };
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-12 w-12 animate-spin" />
          <p className="text-muted-foreground text-lg">
            Loading applicant data...
          </p>
        </div>
      </div>
    );
  }

  if (!Object.keys(userData).length) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-muted-foreground text-2xl font-bold">
            No user data found
          </h1>
          <p className="text-muted-foreground mt-2">
            The applicant you're looking for doesn't exist
          </p>
        </div>
      </div>
    );
  }

  const getStatusMessage = () => {
    if (isHired) return 'Applicant has been accepted';
    if (isRejected) return 'Applicant has been rejected';
    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <section className="container mx-auto py-6">
      <div className="grid gap-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ApplicantProfileCard
              name={userData?.name || 'N/A'}
              email={userData?.email || 'N/A'}
              phone={userData?.phoneNo || 'N/A'}
              position={userData?.appliedPosition || 'N/A'}
              timeline={userData?.timeline || 1}
            />
          </div>

          <div className="flex flex-col gap-4 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Manage this application</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {statusMessage && (
                  <div
                    className={`mb-2 rounded p-2 text-sm font-medium ${isHired ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {statusMessage}
                  </div>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full cursor-pointer gap-2"
                      variant="default"
                      disabled={disableButtons}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Accept Applicant
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Accept this applicant?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will move the applicant to the onboarding process.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleAccept}>
                        Accept
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full cursor-pointer gap-2"
                      variant="outline"
                      disabled={disableButtons}
                    >
                      <XCircle className="h-4 w-4" /> Reject Applicant
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Reject this applicant?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The applicant will be
                        notified.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReject}>
                        Reject
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Application Timeline</CardTitle>
            <CardDescription>Current progress</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <HorizontalTimeline
              steps={timelineSteps}
              currentStep={userData?.timeline || 1}
              status={applicantStatus} // Pass the applicant status to the component
            />
          </CardContent>
        </Card>

        {applicantStatus === 'rejected' ||
        applicantStatus === 'Pending Email Rejection' ? (
          <ApplicantRejected applicantName={userData?.name} />
        ) : (
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="bg-background w-full justify-start rounded-lg border p-1">
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
              >
                Events & Assessments
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
              >
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="events" asChild>
              <motion.div
                variants={motionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="mt-6 grid gap-8"
              >
                {/* Interview Events */}
                <div>
                  <h2 className="mb-4 text-xl font-semibold">
                    Interview Events
                  </h2>
                  {eventData.length > 0 ? (
                    <div className="grid gap-4">
                      {eventData.map((event: any, index: any) => (
                        <EventCard
                          key={index}
                          title={event.title}
                          date={event.interviewDate}
                          status={event.status}
                          type="interview"
                        />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-8">
                        <p className="text-muted-foreground">
                          No interview events found
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div>
                  <h2 className="mb-4 text-xl font-semibold">
                    Assessment Events
                  </h2>
                  {assignmentData.length > 0 ? (
                    <div className="grid gap-4">
                      {assignmentData.map((assessment: any) => (
                        <EventCard
                          key={assessment.id}
                          title={assessment.assessment_title}
                          date={`Due: ${new Date(
                            assessment.due_date
                          ).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}`}
                          status={assessment.assessment_result || 'Pending'}
                          remarks={assessment.assessment_remarks}
                          type="assessment"
                        />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-8">
                        <p className="text-muted-foreground">
                          No assessment events found
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="documents" asChild>
              <motion.div
                variants={motionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <h2 className="mb-4 text-xl font-semibold">
                  Applicant Documents
                </h2>
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>Curriculum Vitae</CardTitle>
                    <CardDescription>
                      Applicant's resume and qualifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userData?.cvPath ? (
                      <div className="overflow-hidden rounded-lg border">
                        <iframe
                          src={`${import.meta.env.VITE_SUPABASE_BUCKET_URL}/${userData.cvPath}`}
                          className="h-[700px] w-full"
                          title="Applicant CV"
                        ></iframe>
                      </div>
                    ) : (
                      <div className="flex h-40 items-center justify-center">
                        <p className="text-muted-foreground">No CV uploaded</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </section>
  );
}
