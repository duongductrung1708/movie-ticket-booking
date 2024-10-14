import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Home from "./pages/home/Home";
import Services from "./pages/services/Services";
import Users from "./pages/users/Users";
import Theaters from "./pages/theaters/Theaters";
import Movies from "./pages/movies/Movies";
import Bookings from "./pages/bookings/Bookings";
import Payments from "./pages/payments/Payments";
import Login from "./pages/signin/signIn";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Showtimes from "./pages/Showtimes/Showtimes";
import Genres from "./pages/genres/Genres";
import ProtectedRoute from "./routers/ProtectedRouter"; // Adjust the import path

const queryClient = new QueryClient();

function App() {
  const Layout = () => {
    return (
      <div className="main">
        <Navbar />
        <div className="container">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
            <QueryClientProvider client={queryClient}>
              <Outlet />
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </QueryClientProvider>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "/users",
          element: (
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          ),
        },
        {
          path: "/services",
          element: (
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          ),
        },
        {
          path: "/theaters",
          element: (
            <ProtectedRoute>
              <Theaters />
            </ProtectedRoute>
          ),
        },
        {
          path: "/movies",
          element: (
            <ProtectedRoute>
              <Movies />
            </ProtectedRoute>
          ),
        },
        {
          path: "/bookings",
          element: (
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          ),
        },
        {
          path: "/payments",
          element: (
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          ),
        },
        {
          path: "/showtimes",
          element: (
            <ProtectedRoute>
              <Showtimes />
            </ProtectedRoute>
          ),
        },
        {
          path: "/genres",
          element: (
            <ProtectedRoute>
              <Genres />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
