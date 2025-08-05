import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "@/layout/main";
import AdminLayout from "@/layout/admin";
import HomePage from "@/pages/home";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Books from "@/pages/admin/books";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register", 
    element: <Register />,
  },
  {
    path: 'admin',
    // element: (
    //   <ProtectedRoute allowedRoles={[Role.ADMIN]}>
    //     <AdminLayout />
    //   </ProtectedRoute>
    // ),
    element: (
        <AdminLayout />
    ),
    children: [
      {
        path: 'books',
        element: <Books />
      },
 
    ]
  }
]);

const AppRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default AppRoutes;
