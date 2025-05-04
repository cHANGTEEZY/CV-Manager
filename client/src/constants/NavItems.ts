import { Calendar, Home, FileText, Mail, UserPen } from 'lucide-react';

export const navItems = [
  {
    title: 'Dashboard',
    icon: Home,
    path: '/dashboard',
  },
  {
    title: 'Applications',
    icon: FileText,
    path: '/dashboard/applications',
    badge: '3',
    subitems: [
      { title: 'Upload Applications', path: '/dashboard/application-upload' },
      { title: 'Track Applications', path: '/dashboard/application-tracking' },
      { title: 'Final Review', path: '/dashboard/applications-final-review' },
    ],
  },
  {
    title: 'Interview',
    icon: Calendar,
    path: '/dashboard/events/create-event',
    subitems: [
      { title: 'Interview Scheduling', path: '/dashboard/events/create-event' },
      { title: 'Interview Review', path: '/dashboard/events/review-event' },
      {
        title: 'Manage Interviewer',
        path: '/dashboard/assessment/interviewer',
      },
    ],
  },
  {
    title: 'Assessment',
    icon: UserPen,
    path: '/dashboard/events/assessment-uploader',
    subitems: [
      {
        title: 'Assessment Uploader',
        path: '/dashboard/events/assessment-uploader',
      },
      {
        title: 'Review Assessment',
        path: '/dashboard/events/assessment-review',
      },
    ],
  },
  {
    title: 'Draft',
    icon: Mail,
    path: '/dashboard/mail',
    // subitems: [
    //   {
    //     title: "Create Draft",
    //     path: "/dashboard/mail/template",
    //   },
    // ],
  },
];
