import {
  Activity,
  BarChart2,
  Bell,
  CalendarCheck,
  ClipboardList,
  FileText,
  GitBranch,
  ShieldCheck,
  UserCircle,
  Users,
} from 'lucide-react';

export const features = [
  {
    title: 'CV Management',
    description:
      'Framer makes it easy to upload, organize, and access candidate CVs in one centralized place.',
    icon: FileText,
  },
  {
    title: 'Applicant Profiles',
    description:
      'Framer helps you maintain detailed applicant records, including personal information, experience, skills, and status updates.',
    icon: UserCircle,
  },
  {
    title: 'Streamlined Hiring Workflow',
    description:
      'Framer lets you design and customize hiring stages to create a smooth and efficient recruitment process.',
    icon: GitBranch,
  },
  {
    title: 'Event Scheduling',
    description:
      'Framer allows you to create and manage interviews, assessments, and other hiring-related events effortlessly.',
    icon: CalendarCheck,
  },
  {
    title: 'Assignment Management',
    description:
      'Framer enables you to assign tasks, assessments, and tests to applicants directly through the platform.',
    icon: ClipboardList,
  },
  {
    title: 'Applicant Tracking',
    description:
      'Framer helps you track every applicant’s journey from application to onboarding with real-time updates.',
    icon: Activity,
  },
  {
    title: 'Performance Analytics',
    description:
      'Framer lets you monitor key hiring metrics and gain valuable insights into your recruitment process.',
    icon: BarChart2,
  },
  {
    title: 'Collaborative Hiring',
    description:
      'Framer allows HR teams and hiring managers to collaborate seamlessly on candidate evaluations and decisions.',
    icon: Users,
  },
  {
    title: 'Custom Notifications',
    description:
      'Framer keeps you updated with smart notifications for interview schedules, task deadlines, and applicant movements.',
    icon: Bell,
  },
  {
    title: 'Secure Data Handling',
    description:
      'Framer protects sensitive applicant information with robust data security and privacy measures.',
    icon: ShieldCheck,
  },
];

export const pricingPlans = [
  {
    title: 'Starter',
    price: 'Free',
    description: 'Perfect for small teams just getting started.',
    features: [
      'Upload up to 30 CVs',
      'Basic applicant tracking',
      'Schedule up to 10 events',
      'Assignment management (limited)',
      'Email notifications',
      'Community support',
    ],
    buttonText: 'Get Started',
  },
  {
    title: 'Pro',
    price: '$29.99',
    description: 'Advanced features for growing hiring teams.',
    features: [
      'Upload up to 1000 CVs',
      'Full applicant profiles and tracking',
      'Unlimited event scheduling',
      'Assignment management',
      'Performance analytics dashboard',
      'Collaborative hiring tools',
      'Priority email support',
    ],
    buttonText: 'Upgrade Now',
  },
  {
    title: 'Enterprise',
    price: 'Contact Sales',
    description: 'Tailored solutions for scaling organizations.',
    features: [
      'Unlimited CV uploads',
      'Unlimited applicant tracking and events',
      'Custom hiring workflows',
      'Role-based access control',
      'Advanced analytics & reporting',
      'Dedicated account manager',
      'Premium onboarding & support',
      'Custom integrations (API access)',
    ],
    buttonText: 'Request a Demo',
  },
];

export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: 'What is Framer?',
    answer:
      'Framer is a comprehensive CV management and recruitment platform that streamlines the hiring process, from application tracking to offer letter generation.',
  },
  {
    question: 'How can I add a new candidate to the platform?',
    answer:
      "You can easily add a new candidate by navigating to the Candidate Management section and clicking 'Add Candidate.' Fill out the required details and upload the candidate's resume.",
  },
  {
    question: 'Can I schedule interviews directly through the platform?',
    answer:
      'Yes! Framer allows you to schedule interviews, send calendar invites, and manage schedules seamlessly through the Interview Scheduling section.',
  },
  {
    question: 'How do I assign assessments to candidates?',
    answer:
      "Go to the Assessment Management section, select the candidate, and click 'Assign Assessment.' You can choose from pre-configured templates or upload custom assessments.",
  },
  {
    question:
      'Is it possible to generate and send offer letters through the app?',
    answer:
      'Absolutely! In the Offer Letter Generation tab, you can create, customize, and send digital offer letters with options for electronic signing.',
  },
  {
    question: 'Can I manage different HR and team member access levels?',
    answer:
      'Yes, User Management allows you to configure roles and permissions for HR staff, team leaders, and recruiters.',
  },
  {
    question: 'Does the platform support automated email notifications?',
    answer:
      'Yes, you can configure automated email templates in the Settings & Configuration section for interview invites, assessment reminders, and more.',
  },
  {
    question: 'How secure is candidate data in Framer?',
    answer:
      'Framer ensures data security with role-based access control, encrypted storage, and audit logging for complete transparency.',
  },
  {
    question: 'Can I customize the application settings and branding?',
    answer:
      'Definitely! You can access Settings & Configuration to adjust application preferences, notification settings, and brand logos.',
  },
  {
    question: 'Is there support for audit logs to track user activities?',
    answer:
      'Yes, every action taken within the app is logged in the Audit Logs section for security and compliance.',
  },
];
