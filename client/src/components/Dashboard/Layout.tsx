'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Calendar,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  User,
  Users,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="bg-background flex min-h-screen">
      {/* Desktop Sidebar */}
      <div
        className={`bg-muted/40 hidden border-r lg:block ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <BriefcaseBusiness className="h-6 w-6" />
              {isSidebarOpen && <span>HR Portal</span>}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium">
              <Link
                href="/dashboard"
                className="bg-primary/10 text-primary hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
              >
                <LayoutDashboard className="h-4 w-4" />
                {isSidebarOpen && <span>Dashboard</span>}
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
              >
                <Users className="h-4 w-4" />
                {isSidebarOpen && <span>Applicants</span>}
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
              >
                <BriefcaseBusiness className="h-4 w-4" />
                {isSidebarOpen && <span>Jobs</span>}
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
              >
                <Calendar className="h-4 w-4" />
                {isSidebarOpen && <span>Interviews</span>}
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
              >
                <BarChart3 className="h-4 w-4" />
                {isSidebarOpen && <span>Analytics</span>}
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
              >
                <Building2 className="h-4 w-4" />
                {isSidebarOpen && <span>Departments</span>}
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
              >
                <MessageSquare className="h-4 w-4" />
                {isSidebarOpen && <span>Messages</span>}
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
              >
                <Settings className="h-4 w-4" />
                {isSidebarOpen && <span>Settings</span>}
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 font-semibold"
              >
                <BriefcaseBusiness className="h-6 w-6" />
                <span>HR Portal</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                <Link
                  href="/dashboard"
                  className="bg-primary/10 text-primary hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
                >
                  <Users className="h-4 w-4" />
                  <span>Applicants</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
                >
                  <BriefcaseBusiness className="h-4 w-4" />
                  <span>Jobs</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Interviews</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
                >
                  <Building2 className="h-4 w-4" />
                  <span>Departments</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Messages</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="bg-background sticky top-0 z-10 flex h-14 items-center gap-4 border-b px-4 sm:px-6 lg:px-8">
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search applicants..."
                  className="bg-background w-full appearance-none pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                  <AvatarFallback>HR</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
