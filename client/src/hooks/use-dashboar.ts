import { supabase } from '@/utils/supabaseClient';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Applicant,
  InterviewEvent,
  AssessmentEvent,
  DashboardMetrics,
  TechStackChartData,
  StatusChartData,
  TimelineEvent,
  DashboardData,
} from '@/types/ApplicantDashboard';

export const useDashboardData = (): DashboardData => {
  const [applicantData, setApplicantData] = useState<Applicant[]>([]);
  const [interviewData, setInterviewData] = useState<InterviewEvent[]>([]);
  const [assessmentData, setAssessmentData] = useState<AssessmentEvent[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalApplicants: 0,
    hiredApplicants: 0,
    rejectedApplicants: 0,
    pendingOfferApplicants: 0,
    openPositions: 0,
    hireRate: 0,
    rejectionRate: 0,
  });

  // Process the data after fetching
  const processData = (data: Applicant[]): void => {
    if (!data || data.length === 0) return;

    // Calculate metrics
    const total = data.length;
    const hired = data.filter((app) => app.applicant_status === 'Hired').length;
    const rejected = data.filter(
      (app) =>
        app.applicant_verdict === 'Fail' || app.applicant_verdict === 'Failed'
    ).length;
    const pendingOffer = data.filter(
      (app) =>
        app.applicant_status === 'Applicant Eligble for Offer' ||
        app.applicant_status === 'Assessment 2 Passed' ||
        app.applicant_verdict === 'Offer'
    ).length;
    const openPositions = [...new Set(data.map((app) => app.applied_position))]
      .length;

    setMetrics({
      totalApplicants: total,
      hiredApplicants: hired,
      rejectedApplicants: rejected,
      pendingOfferApplicants: pendingOffer,
      openPositions,
      hireRate: total > 0 ? Math.round((hired / total) * 100) : 0,
      rejectionRate: total > 0 ? Math.round((rejected / total) * 100) : 0,
    });
  };

  // Fetch all data needed for the dashboard
  useEffect(() => {
    const fetchDashboardData = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const { data: applicants, error: applicantsError } = await supabase
          .from('applicant_details')
          .select('*');

        if (applicantsError) throw applicantsError;
        setApplicantData((applicants as Applicant[]) || []);
        processData((applicants as Applicant[]) || []);
        console.log('applicants', applicants);

        const { data: interviews, error: interviewsError } = await supabase
          .from('events')
          .select('*');
        console.log('interviews', interviews);
        if (interviewsError) throw interviewsError;
        setInterviewData((interviews as InterviewEvent[]) || []);

        const { data: assessments, error: assessmentsError } = await supabase
          .from('assessment_event')
          .select('*');

        console.log('assessments', assessments);
        if (assessmentsError) throw assessmentsError;
        setAssessmentData((assessments as AssessmentEvent[]) || []);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message || 'Failed to fetch dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getChartData = (): TechStackChartData[] => {
    if (!applicantData.length) return [];

    const techStackData: Record<string, TechStackChartData> = {};
    applicantData.forEach((app) => {
      if (!techStackData[app.tech_stack]) {
        techStackData[app.tech_stack] = {
          name: app.tech_stack,
          count: 0,
          hired: 0,
          rejected: 0,
        };
      }

      techStackData[app.tech_stack].count++;

      if (app.applicant_status === 'Hired') {
        techStackData[app.tech_stack].hired++;
      }

      if (
        app.applicant_verdict === 'Fail' ||
        app.applicant_verdict === 'Failed'
      ) {
        techStackData[app.tech_stack].rejected++;
      }
    });

    return Object.values(techStackData);
  };

  // Process applicant data for status chart
  const getStatusData = (): StatusChartData[] => {
    if (!applicantData.length) return [];

    const statusCounts: Record<string, number> = {};
    applicantData.forEach((app) => {
      if (!statusCounts[app.applicant_status]) {
        statusCounts[app.applicant_status] = 0;
      }
      statusCounts[app.applicant_status]++;
    });

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Process timeline data by combining interviews and assessments
  const getTimelineData = (): TimelineEvent[] => {
    const timelineEvents: TimelineEvent[] = [];

    // Process interview events
    interviewData.forEach((event) => {
      timelineEvents.push({
        id: `interview-${event.id}`,
        type: 'interview',
        eventName: event.event_name,
        date: new Date(event.event_date_time),
        candidateName: event.applicant_email.split('@')[0], // Simple name extraction
        candidateEmail: event.applicant_email,
        result: event.interview_result,
        interviewer: event.interviewer_name,
        remarks: event.interview_remarks,
        rating: event.interview_rating,
      });
    });

    // Process assessment events
    assessmentData.forEach((event) => {
      timelineEvents.push({
        id: `assessment-${event.id}`,
        type: 'assessment',
        eventName: event.assessment_title,
        date: new Date(event.assigned_date),
        candidateName: event.candidate_email.split('@')[0], // Simple name extraction
        candidateEmail: event.candidate_email,
        result: event.assessment_result,
        dueDate: new Date(event.due_date),
        remarks: event.assessment_remarks,
        rating: event.assessment_rating,
      });
    });

    // Sort by date (newest first)
    return timelineEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  return {
    // Raw data
    applicantData,
    interviewData,
    assessmentData,

    // Processed data for components
    metrics,
    chartData: getChartData(),
    statusData: getStatusData(),
    timelineData: getTimelineData(),

    // UI states
    loading,
    error,

    // Helper to refresh data if needed
    refreshData: () => {
      setLoading(true);
      // This will trigger the useEffect to run again
      setApplicantData([]);
    },
  };
};
