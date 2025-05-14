import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  CalendarDays,
  Briefcase,
  Users,
  FileText,
  User,
  Settings,
  Bell,
  X,
  Plus,
  Save,
} from 'lucide-react';

import { supabase } from '@/utils/supabaseClient';
import { MetricsCards } from '@/components/Dashboard/MetricsCard';
import { useDashboardData } from '@/hooks/use-dashboar';

interface Note {
  id: number;
  content: string;
  color: string;
}

interface Activity {
  id: number;
  type: 'review' | 'interview' | 'hire';
  title: string;
  description: string;
  created_at: string;
}

interface UserMetadata {
  avatar_url?: string;
  full_name?: string;
}

interface User {
  email?: string;
  user_metadata?: UserMetadata;
  created_at?: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { metrics } = useDashboardData();

  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      content: 'Review applications for Senior Developer position',
      color: 'bg-yellow-100',
    },
    {
      id: 2,
      content: 'Prepare interview questions for marketing team',
      color: 'bg-blue-100',
    },
    {
      id: 3,
      content: 'Follow up with John regarding his onboarding process',
      color: 'bg-green-100',
    },
  ]);
  const [newNote, setNewNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  // Mock activity data
  const [recentActivity, _setRecentActivity] = useState<Activity[]>([
    {
      id: 1,
      type: 'review',
      title: 'Application Reviewed',
      description:
        "You reviewed Michael Chen's application for Full Stack Developer",
      created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      id: 2,
      type: 'interview',
      title: 'Interview Scheduled',
      description:
        'You scheduled an interview with Sarah Johnson for UX Designer position',
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: 3,
      type: 'hire',
      title: 'Candidate Hired',
      description: 'You approved hiring Alex Rodriguez as Marketing Specialist',
      created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
    {
      id: 4,
      type: 'review',
      title: 'Application Rejected',
      description: "You rejected David Kim's application for Senior Developer",
      created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    },
  ]);

  useEffect(() => {
    const getUserProfile = async () => {
      setLoading(true);

      try {
        // Get user from current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session?.user) {
          setUser(session.user as User);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, []);

  // Note colors
  const noteColors = [
    'bg-yellow-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-purple-100',
    'bg-pink-100',
  ];

  // Handle adding new note
  const handleAddNote = () => {
    if (newNote.trim() !== '') {
      const randomColor =
        noteColors[Math.floor(Math.random() * noteColors.length)];
      const newId =
        notes.length > 0 ? Math.max(...notes.map((note) => note.id)) + 1 : 1;

      setNotes([
        ...notes,
        {
          id: newId,
          content: newNote,
          color: randomColor,
        },
      ]);

      setNewNote('');
      setShowNoteInput(false);
    }
  };

  // Handle deleting a note
  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.section
      className="mx-auto max-w-7xl px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Profile Header */}
      <motion.div variants={itemVariants}>
        <Card className="mb-8 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <CardContent className="relative pt-0">
            <div className="-mt-12 flex flex-col gap-6 md:flex-row md:items-end">
              <Avatar className="h-24 w-24 border-4 border-white bg-white">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-blue-100 text-xl text-blue-800">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 pt-4 md:pt-0">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h1 className="mb-1 text-2xl font-bold">
                      {user?.user_metadata?.full_name ||
                        user?.email?.split('@')[0] ||
                        'HR Manager'}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      <User size={16} />
                      <span>{user?.email}</span>
                      <span className="mx-2">•</span>
                      <Briefcase size={16} />
                      <span>HR Manager</span>
                      <span className="mx-2">•</span>
                      <Badge variant="outline" className="bg-blue-50">
                        Talent Acquisition
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-gray-50"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-gray-50"
                    >
                      <Bell size={16} />
                      <span>Notifications</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dashboard Stats */}
      <motion.div className="mb-8" variants={itemVariants}>
        <MetricsCards metrics={metrics} />
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        variants={itemVariants}
      >
        <div className="col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="notes">Sticky Notes</TabsTrigger>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-10">
                      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    </div>
                  ) : recentActivity.length === 0 ? (
                    <p className="py-6 text-center text-gray-500">
                      No recent activity found
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {recentActivity.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex gap-4"
                        >
                          <div className="flex-shrink-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                              {activity.type === 'review' && (
                                <FileText className="h-5 w-5 text-blue-600" />
                              )}
                              {activity.type === 'interview' && (
                                <Users className="h-5 w-5 text-blue-600" />
                              )}
                              {activity.type === 'hire' && (
                                <Briefcase className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-gray-500">
                              {activity.description}
                            </p>
                            <div className="mt-1 flex items-center text-xs text-gray-500">
                              <CalendarDays className="mr-1 h-3 w-3" />
                              <span>
                                {new Date(
                                  activity.created_at
                                ).toLocaleDateString('en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="candidates">
              <Card>
                <CardHeader>
                  <CardTitle>Candidate Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="py-6 text-center text-gray-500">
                    Switch to the Candidates tab to manage your applicants.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Sticky Notes</CardTitle>
                    <Button
                      size="sm"
                      onClick={() => setShowNoteInput(true)}
                      className="flex items-center gap-1"
                      disabled={showNoteInput}
                    >
                      <Plus size={16} />
                      <span>Add Note</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showNoteInput && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6"
                    >
                      <Card className="border-yellow-200 bg-yellow-50">
                        <CardContent className="p-4">
                          <Textarea
                            placeholder="Write your note here..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="mb-3 border-yellow-200 bg-yellow-50"
                            rows={3}
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setShowNoteInput(false);
                                setNewNote('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleAddNote}
                              disabled={newNote.trim() === ''}
                            >
                              <Save size={16} className="mr-1" />
                              Save
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {notes.length === 0 ? (
                      <p className="col-span-2 py-6 text-center text-gray-500">
                        No sticky notes yet. Add one to get started!
                      </p>
                    ) : (
                      notes.map((note) => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.03, rotate: 1 }}
                          className={`${note.color} relative overflow-hidden rounded-md p-4 shadow`}
                          style={{ minHeight: '120px' }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-60 hover:opacity-100"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            <X size={14} />
                          </Button>
                          <p className="pt-2 break-words whitespace-pre-wrap">
                            {note.content}
                          </p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interviews">
              <Card>
                <CardHeader>
                  <CardTitle>Interview Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="py-6 text-center text-gray-500">
                    Switch to the Interviews tab to manage your interview
                    schedule.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Personal Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p>{user?.user_metadata?.full_name || 'Not available'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{user?.email || 'Not available'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Department
                  </p>
                  <p>Human Resources</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p>HR Manager - Talent Acquisition</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Joined</p>
                  <p>
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'Not available'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm">Efficiency</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <motion.div
                        className="h-2 rounded-full bg-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                      ></motion.div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm">Quality of Hire</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <motion.div
                        className="h-2 rounded-full bg-green-600"
                        initial={{ width: 0 }}
                        animate={{ width: '92%' }}
                        transition={{ duration: 1, delay: 0.7 }}
                      ></motion.div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm">Time to Hire</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <motion.div
                        className="h-2 rounded-full bg-amber-600"
                        initial={{ width: 0 }}
                        animate={{ width: '78%' }}
                        transition={{ duration: 1, delay: 0.9 }}
                      ></motion.div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center rounded-lg bg-gray-50 p-3">
                    <div className="mr-4">
                      <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                        <span className="text-sm font-bold">15</span>
                        <span className="text-xs">May</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Sarah Johnson - UX Designer</p>
                      <p className="text-sm text-gray-500">
                        10:00 AM - 11:00 AM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center rounded-lg bg-gray-50 p-3">
                    <div className="mr-4">
                      <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                        <span className="text-sm font-bold">15</span>
                        <span className="text-xs">May</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">
                        Michael Davis - Full Stack Developer
                      </p>
                      <p className="text-sm text-gray-500">2:30 PM - 3:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center rounded-lg bg-gray-50 p-3">
                    <div className="mr-4">
                      <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                        <span className="text-sm font-bold">16</span>
                        <span className="text-xs">May</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">
                        Emily Wilson - Marketing Manager
                      </p>
                      <p className="text-sm text-gray-500">
                        11:15 AM - 12:15 PM
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default ProfilePage;
