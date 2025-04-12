import Signin from "@/components/auth/Signin";
import Signup from "@/components/auth/Signup";
import AuthCallback from "@/components/auth/AuthCallback";
import ErrorPage from "@/components/Error/ErrorPage";
import AuthenticationLayout from "@/layouts/AuthenticationLayout";
import RootLayout from "@/layouts/RootLayout";
import HomePage from "@/pages/HomePage";
import SettingPage from "@/pages/SettingPage";
import { createBrowserRouter, Navigate } from "react-router-dom";

const isAuthenticated = false;

const ProtectedRoute = ({ childred }) => {};

export const router = createBrowserRouter([
  //* main routes
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "settings",
        element: <SettingPage />,
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
        element: <Signin />,
      },
      {
        path: "signup",
        element: <Signup />,
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
