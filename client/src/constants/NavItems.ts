import { Calendar, Home, Settings, FileText, Mail, Eye } from "lucide-react";

export const navItems = [
  {
    title: "Home",
    icon: Home,
    path: "/",
  },
  {
    title: "Applications",
    icon: FileText,
    path: "/resumes",
    badge: "3",
    subitems: [
      { title: "Upload Applications", path: "/application-upload" },
      { title: "Review Applications", path: "/application-review" },
      { title: "Track Applications", path: "/application-tracking" },
    ],
  },

  {
    title: "Draft",
    icon: Mail,
    path: "/Draft",
    subitems: [
      {
        title: "Create Draft",
        path: "/draft/create-draft",
      },
    ],
  },
  {
    title: "Events",
    icon: Calendar,
    path: "/calendar-events",
    subitems: [
      { title: "Interview Scheduling", path: "/events/create-event" },
      { title: "Assessment Uploader", path: "/events/assessment-uploader" },
    ],
  },
  {
    title: "Results",
    icon: Eye,
    path: "/results",
    subitems: [{ title: "Update Result", path: "/events/update-result" }],
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];
