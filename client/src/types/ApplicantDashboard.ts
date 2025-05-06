// Applicant Data Types
export interface Applicant {
  id: number;
  created_at: string;
  applicant_name: string;
  applied_position: string;
  applicant_status: string;
  tech_stack: string;
  applicant_email: string;
  applicant_phone_number: string;
  applicant_experience: string;
  applicant_experience_level: string;
  expected_salary: string;
  references: string;
  applicant_file_path: string;
  applicant_verdict: string;
  timeline_status: string;
  applicant_timeline: number;
}

// Interview Event Types
export interface InterviewEvent {
  id: number;
  created_at: string;
  event_name: string;
  event_date_time: string;
  event_description: string;
  applicant_email: string;
  interviewer_name: string;
  interview_result: string;
  interview_type: string;
  interview_remarks: string;
  interview_rating: number;
}

// Assessment Event Types
export interface AssessmentEvent {
  id: number;
  created_at: string;
  assessment_id: number;
  candidate_email: string;
  assigned_date: string;
  status: string;
  due_date: string;
  assessment_remarks: string;
  assessment_title: string;
  assessment_result: string;
  assessment_rating: number;
}

// Types for processed metrics data
export interface DashboardMetrics {
  totalApplicants: number;
  hiredApplicants: number;
  rejectedApplicants: number;
  pendingOfferApplicants: number;
  openPositions: number;
  hireRate: number;
  rejectionRate: number;
}

// Types for chart data processing
export interface TechStackChartData {
  name: string;
  count: number;
  hired: number;
  rejected: number;
}

export interface StatusChartData {
  name: string;
  value: number;
}

// Combined timeline event type
export interface TimelineEvent {
  id: string;
  type: 'interview' | 'assessment';
  eventName: string;
  date: Date;
  candidateName: string;
  candidateEmail: string;
  result: string;
  interviewer?: string; // Only for interviews
  dueDate?: Date; // Only for assessments
  remarks: string;
  rating: number;
}

// Return type of the hook
export interface DashboardData {
  // Raw data
  applicantData: Applicant[];
  interviewData: InterviewEvent[];
  assessmentData: AssessmentEvent[];

  // Processed data
  metrics: DashboardMetrics;
  chartData: TechStackChartData[];
  statusData: StatusChartData[];
  timelineData: TimelineEvent[];

  // UI states
  loading: boolean;
  error: string | null;

  // Functions
  refreshData: () => void;
}
