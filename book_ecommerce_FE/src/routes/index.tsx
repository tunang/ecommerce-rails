import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "@/layout/main";
import AdminLayout from "@/layout/admin";
import HomePage from "@/pages/home";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Confirm from "@/pages/auth/confirm";
import Books from "@/pages/admin/books";
import Categories from "@/pages/admin/categories";
import Authors from "@/pages/admin/authors";
import Orders from "@/pages/admin/orders";
import CategoryPage from "@/pages/category";
import CategoryProductPage from "@/pages/category/CategoryProducts";
import BookDetail from "@/pages/books/BookDetail";
import Cart from "@/pages/cart";
import Address from "@/pages/address";
import Checkout from "@/pages/checkout";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'category',
        element: <CategoryPage  />,
      },
      {
        path: 'category/:id',
        element: <CategoryProductPage />,
      },
      {
        path: 'books/:id',
        element: <BookDetail />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'address',
        element: <Address />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
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
    path: "/confirm",
    element: <Confirm />,
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
            {
        path: 'categories',
        element: <Categories />
      },
      {
        path: 'authors',
        element: <Authors />
      },
      {
        path: 'orders',
        element: <Orders />
      }
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
