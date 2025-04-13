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
      { title: "All Resumes", path: "/resumes" },
      { title: "Application Status", path: "/resumes/application-status" },
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
    subitems: [
      { title: "All Events", path: "/events/all-events" },
      { title: "Create Event", path: "/events/create-event" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];
