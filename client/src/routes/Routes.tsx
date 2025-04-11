import Signin from "@/components/auth/Signin";
import Signup from "@/components/auth/Signup";
import ErrorPage from "@/components/Error/ErrorPage";
import AuthenticationLayout from "@/layouts/AuthenticationLayout";
import RootLayout from "@/layouts/RootLayout";
import HomePage from "@/pages/HomePage";
import SettingPage from "@/pages/SettingPage";
import { createBrowserRouter } from "react-router-dom";

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
    ],
  },

  //* error routes
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
