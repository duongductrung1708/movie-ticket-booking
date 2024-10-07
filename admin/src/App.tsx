import Home from "./pages/home/Home";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Products from "./pages/services/Services";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";
import "./styles/global.scss";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Bookings from "./pages/bookings/Bookings";
import Movies from "./pages/movies/Movies";
import Theaters from "./pages/theaters/Theaters";
import Users from "./pages/users/Users";
import Payments from "./pages/payments/Payments";


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
