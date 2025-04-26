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
} from "lucide-react";

export const features = [
  {
    title: "CV Management",
    description:
      "Framer makes it easy to upload, organize, and access candidate CVs in one centralized place.",
    icon: FileText,
  },
  {
    title: "Applicant Profiles",
    description:
      "Framer helps you maintain detailed applicant records, including personal information, experience, skills, and status updates.",
    icon: UserCircle,
  },
  {
    title: "Streamlined Hiring Workflow",
    description:
      "Framer lets you design and customize hiring stages to create a smooth and efficient recruitment process.",
    icon: GitBranch,
  },
  {
    title: "Event Scheduling",
    description:
      "Framer allows you to create and manage interviews, assessments, and other hiring-related events effortlessly.",
    icon: CalendarCheck,
  },
  {
    title: "Assignment Management",
    description:
      "Framer enables you to assign tasks, assessments, and tests to applicants directly through the platform.",
    icon: ClipboardList,
  },
  {
    title: "Applicant Tracking",
    description:
      "Framer helps you track every applicant’s journey from application to onboarding with real-time updates.",
    icon: Activity,
  },
  {
    title: "Performance Analytics",
    description:
      "Framer lets you monitor key hiring metrics and gain valuable insights into your recruitment process.",
    icon: BarChart2,
  },
  {
    title: "Collaborative Hiring",
    description:
      "Framer allows HR teams and hiring managers to collaborate seamlessly on candidate evaluations and decisions.",
    icon: Users,
  },
  {
    title: "Custom Notifications",
    description:
      "Framer keeps you updated with smart notifications for interview schedules, task deadlines, and applicant movements.",
    icon: Bell,
  },
  {
    title: "Secure Data Handling",
    description:
      "Framer protects sensitive applicant information with robust data security and privacy measures.",
    icon: ShieldCheck,
  },
];

export const pricingPlans = [
  {
    title: "Starter",
    price: "Free",
    description: "Perfect for small teams just getting started.",
    features: [
      "Upload up to 30 CVs",
      "Basic applicant tracking",
      "Schedule up to 10 events",
      "Assignment management (limited)",
      "Email notifications",
      "Community support",
    ],
    buttonText: "Get Started",
  },
  {
    title: "Pro",
    price: "$29.99",
    description: "Advanced features for growing hiring teams.",
    features: [
      "Upload up to 1000 CVs",
      "Full applicant profiles and tracking",
      "Unlimited event scheduling",
      "Assignment management",
      "Performance analytics dashboard",
      "Collaborative hiring tools",
      "Priority email support",
    ],
    buttonText: "Upgrade Now",
  },
  {
    title: "Enterprise",
    price: "Contact Sales",
    description: "Tailored solutions for scaling organizations.",
    features: [
      "Unlimited CV uploads",
      "Unlimited applicant tracking and events",
      "Custom hiring workflows",
      "Role-based access control",
      "Advanced analytics & reporting",
      "Dedicated account manager",
      "Premium onboarding & support",
      "Custom integrations (API access)",
    ],
    buttonText: "Request a Demo",
  },
];
