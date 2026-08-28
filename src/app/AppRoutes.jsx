import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { Layout } from "../layout/Layout";
import { isAuthenticated } from "../utils/auth";

const LoginForm = lazy(() =>
  import("../components/auth/LoginForm").then((module) => ({
    default: module.LoginForm,
  })),
);

const RegisterForm = lazy(() =>
  import("../components/auth/RegisterForm").then((module) => ({
    default: module.RegisterForm,
  })),
);

const BoardPage = lazy(() =>
  import("../pages/BoardPage").then((module) => ({
    default: module.BoardPage,
  })),
);

const NotFoundPage = lazy(() =>
  import("../pages/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  })),
);

const PageLoader = () => {
  return <div>Загрузка...</div>;
};

const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/board" replace /> : children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/board" replace />,
      },
      {
        path: "board",
        element: <BoardPage />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginForm />
      </PublicRoute>
    ),
  },
  {
    path: "/registration",
    element: (
      <PublicRoute>
        <RegisterForm />
      </PublicRoute>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};
