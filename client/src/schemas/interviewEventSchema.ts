import { z } from 'zod';

export const interviewers = [
  { id: '1', name: 'Sarah Johnson' },
  { id: '2', name: 'Michael Chen' },
  { id: '3', name: 'Priya Patel' },
  { id: '4', name: 'David Kim' },
  { id: '5', name: 'Lisa Wong' },
];

export const interviewTypes = [
  {
    id: 'interview1',
    name: 'Interview 1',
    requiredStatus: 'filled',
    newStatus: 'Interview 1 Scheduled',
  },
  {
    id: 'interview2',
    name: 'Interview 2',
    requiredStatus: 'Interview 1 Passed',
    newStatus: 'Interview 2 Scheduled',
  },
  {
    id: 'interview3',
    name: 'Interview 3',
    requiredStatus: 'Interview 2 Passed',
    newStatus: 'Interview 3 Scheduled',
  },
];

export interface Applicant {
  id: number;
  applicant_name: string;
  applicant_email: string;
  applied_position: string;
  applicant_status: string;
  tech_stack: string;
}

export const formSchema = z.object({
  interview_type: z.string({
    required_error: 'Please select an interview type',
  }),
  event_name: z
    .string()
    .min(3, { message: 'Event title must be at least 3 characters' }),
  event_description: z
    .string()
    .min(1, { message: 'Event description is required' }),
  event_date: z.date({
    required_error: 'Event date is required',
  }),
  event_time: z.string({
    required_error: 'Event time is required',
  }),
  applicant_email: z.string({
    required_error: 'Please select a candidate',
  }),
  interviewer_name: z.string({
    required_error: 'Please select an interviewer',
  }),
});

export const interviewerSchema = z.object({
  interviewer_name: z.string().min(1, {
    message: 'Interviewer name is required',
  }),
  email: z.string().email({ message: 'Invalid email address' }),
  role: z.enum([
    'Full Stack Engineer',
    'Frontend Engineer',
    'Backend Engineer',
    'Devops Engineer',
    'UI/UX Designer',
    'AI/ML Engineer',
    'Data Scientist',
  ]),
  phone_number: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' }),
});

export type InterviewerFormValues = z.infer<typeof interviewerSchema>;

export const RoleFilter = [
  'Full Stack Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'Devops Engineer',
  'UI/UX Designer',
  'AI/ML Engineer',
  'Data Scientist',
] as const;

export interface Interviewer {
  id: string;
  interviewer_name: string;
  email: string;
  phone_number: string;
  role: string;
  created_at?: string;
}
