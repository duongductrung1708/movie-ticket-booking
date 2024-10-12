import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Home from "./pages/home/Home";
import Products from "./pages/services/Services";
import Users from "./pages/users/Users";
import Theaters from "./pages/theaters/Theaters";
import Movies from "./pages/movies/Movies";
import Bookings from "./pages/bookings/Bookings";
import Payments from "./pages/payments/Payments";
import Login from "./pages/login/Login";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toast CSS
import "./styles/global.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
              {/* Add ToastContainer here */}
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
          element: <Home />,
        },
        {
          path: "/users",
          element: <Users />,
        },
        {
          path: "/services",
          element: <Products />,
        },
        {
          path: "/theaters",
          element: <Theaters />,
        },
        {
          path: "/movies",
          element: <Movies />,
        },
        {
          path: "/bookings",
          element: <Bookings />,
        },
        {
          path: "/payments",
          element: <Payments />,
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
