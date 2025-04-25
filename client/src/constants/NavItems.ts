import { Calendar, Home, FileText, Mail, UserPen } from "lucide-react";

export const navItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/",
  },
  {
    title: "Applications",
    icon: FileText,
    path: "/applications",
    badge: "3",
    subitems: [
      { title: "Upload Applications", path: "/application-upload" },
      { title: "Track Applications", path: "/application-tracking" },
    ],
  },

  {
    title: "Interview",
    icon: Calendar,
    path: "/events/create-event",
    subitems: [
      { title: "Interview Scheduling", path: "/events/create-event" },
      { title: "Interview Review", path: "/events/review-event" },
      { title: "Manage Interviewer", path: "/assessment/interviewer" },
    ],
  },

  {
    title: "Assessment",
    icon: UserPen,
    path: "/assessment/review",
    subitems: [
      { title: "Assessment Uploader", path: "/events/assessment-uploader" },
      { title: "Review Assessment", path: "/assessment/review" },
    ],
  },

  {
    title: "Draft",
    icon: Mail,
    path: "/mail",
    // subitems: [
    //   {
    //     title: "Create Draft",
    //     path: "/mail/template",
    //   },
    // ],
  },
];
