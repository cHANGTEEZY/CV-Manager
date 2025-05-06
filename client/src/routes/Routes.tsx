import { createBrowserRouter } from 'react-router-dom';

import Signin from '@/components/auth/Signin';
import Signup from '@/components/auth/Signup';
import AuthCallback from '@/components/auth/AuthCallback';
import ErrorPage from '@/components/Error/ErrorPage';
import AuthenticationLayout from '@/layouts/AuthenticationLayout';
import RootLayout from '@/layouts/RootLayout';
import HomePage from '@/pages/HomePage';
import SettingPage from '@/pages/SettingPage';
import EventPage from '@/pages/Events/EventPage';
import PublicRoute from '@/routes/PublicRoute';
import ProtectedRoute from '@/routes/ProtectedRoute';
import ProfilePage from '@/pages/ProfilePage';
import ApplicationUpload from '@/pages/Application/ApplicationUpload';
import TrackApplications from '@/pages/Application/TrackApplications';
import ReviewApplications from '@/pages/Application/ReviewApplications';
import Email from '@/pages/Email/Email';
import LandingPage from '@/pages/LandinPage';
import AssessmentPage from '@/pages/Events/AssessmentPage';
import ReviewEvent from '@/pages/Events/ReviewEvent';
import AssessmentReview from '@/pages/Events/AssessmentReview';
import FinalReview from '@/pages/Application/FinalReview';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/dashboard',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <SettingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'events/create-event',
        element: (
          <ProtectedRoute>
            <EventPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'events/assessment-uploader',
        element: (
          <ProtectedRoute>
            <AssessmentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'events/assessment-review',
        element: (
          <ProtectedRoute>
            <AssessmentReview />
          </ProtectedRoute>
        ),
      },
      {
        path: 'events/review-event',
        element: (
          <ProtectedRoute>
            <ReviewEvent />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'applications',
        element: (
          <ProtectedRoute>
            {/* <Applications /> */}
            <ApplicationUpload />
          </ProtectedRoute>
        ),
      },
      {
        path: 'application-tracking',
        element: (
          <ProtectedRoute>
            <TrackApplications />
          </ProtectedRoute>
        ),
      },
      {
        path: 'application-review/:id',
        element: (
          <ProtectedRoute>
            <ReviewApplications />
          </ProtectedRoute>
        ),
      },
      {
        path: 'applications-final-review',
        element: (
          <ProtectedRoute>
            <FinalReview />
          </ProtectedRoute>
        ),
      },

      {
        path: 'mail',
        element: (
          <ProtectedRoute>
            <Email />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthenticationLayout />,
    children: [
      {
        path: 'signin',
        element: (
          <PublicRoute>
            <Signin />
          </PublicRoute>
        ),
      },
      {
        path: 'signup',
        element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        ),
      },
      {
        path: 'callback',
        element: <AuthCallback />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);
