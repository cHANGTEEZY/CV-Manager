import Signin from "@/components/auth/Signin";
import Signup from "@/components/auth/Signup";
import AuthCallback from "@/components/auth/AuthCallback";
import ErrorPage from "@/components/Error/ErrorPage";
import AuthenticationLayout from "@/layouts/AuthenticationLayout";
import RootLayout from "@/layouts/RootLayout";
import HomePage from "@/pages/HomePage";
import SettingPage from "@/pages/SettingPage";
import EventPage from "@/pages/EventPage";
import { createBrowserRouter } from "react-router-dom";
import PublicRoute from "@/routes/PublicRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";
import ProfilePage from "@/pages/ProfilePage";
import ApplicationUpload from "@/pages/Application/ApplicationUpload";
import TrackApplications from "@/pages/Application/TrackApplications";

export const router = createBrowserRouter([
  //* main routes
  {
    path: "/",
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
        path: "settings",
        element: (
          <ProtectedRoute>
            <SettingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "calendar-events",
        element: (
          <ProtectedRoute>
            <EventPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },

      {
        path: "application-upload",
        element: (
          <ProtectedRoute>
            <ApplicationUpload />
          </ProtectedRoute>
        ),
      },
      {
        path: "application-tracking",
        element: (
          <ProtectedRoute>
            <TrackApplications />
          </ProtectedRoute>
        ),
      },
    ],
  },
  //* auth routes
  {
    path: "/auth",
    element: <AuthenticationLayout />,
    children: [
      {
        path: "signin",
        element: (
          <PublicRoute>
            <Signin />
          </PublicRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        ),
      },
      {
        path: "callback",
        element: <AuthCallback />,
      },
    ],
  },
  //* error routes
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
