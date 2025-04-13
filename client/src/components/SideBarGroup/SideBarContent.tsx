import {
  Calendar,
  Home,
  Settings,
  User,
  Users,
  FileText,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/utils/supabaseClient";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navItems = [
  {
    title: "Home",
    icon: Home,
    path: "/",
  },
  {
    title: "Resumes",
    icon: FileText,
    path: "/resumes",
    badge: "3",
    subitems: [
      { title: "All Resumes", path: "/resumes" },
      { title: "Templates", path: "/resumes/templates" },
      { title: "Builder", path: "/resumes/builder" },
    ],
  },
  {
    title: "Job Applications",
    icon: Briefcase,
    path: "/applications",
    badge: "5",
  },
  {
    title: "Education",
    icon: GraduationCap,
    path: "/education",
    subitems: [
      { title: "Degrees", path: "/education/degrees" },
      { title: "Certifications", path: "/education/certifications" },
      { title: "Courses", path: "/education/courses" },
    ],
  },
  {
    title: "Network",
    icon: Users,
    path: "/network",
  },
  {
    title: "Calendar",
    icon: Calendar,
    path: "/calendar-events",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export function AppSidebar() {
  const signout = async () => {
    await supabase.auth.signOut({ scope: "local" });
    toast.success("Signed out successfully!");
  };

  const { user } = useAuth();
  console.log(user);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-purple-600 text-white">
                  <FileText className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">CV Manager</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>

                  {item.badge && (
                    <SidebarMenuBadge className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}

                  {item.subitems && (
                    <SidebarMenuSub>
                      {item.subitems.map((subitem) => (
                        <SidebarMenuSubItem key={subitem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link to={subitem.path}>{subitem.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    className="flex py-3 items-center cursor-pointer w-full "
                    variant={"ghost"}
                  >
                    <Avatar>
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p>{user?.user_metadata?.full_name}</p>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Button variant={"ghost"} className="w-full cursor-pointer">
                      <Link to={"/profile"}>Profile</Link>
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="bg-destructive">
                    <Button
                      variant={"ghost"}
                      onClick={signout}
                      className="text-center w-full bg-destructive cursor-pointer"
                    >
                      Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem></SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
