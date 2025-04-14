import { Calendar, Home, Settings, FileText, Mail } from "lucide-react";

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
    ],
  },

  {
    title: "Draft",
    icon: Mail,
    path: "/Draft",
  },
  {
    title: "Events",
    icon: Calendar,
    path: "/calendar-events",
    subitems: [{ title: "Create Event", path: "/events/create-event" }],
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];
