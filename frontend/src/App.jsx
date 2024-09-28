import { Route, Routes } from "react-router-dom";
import StarterPage from "./pages/StarterPage";
import RegistrationPage from "./sections/auth/signup/RegistrationPage";
import SignInPage from "./sections/auth/signin/SignInPage";
import HomePage from "./pages/HomePage";
import MovieDetail from "./pages/MovieDetail";
import SeatReservation from "./pages/SeatReservation";
import UserProfile from "./pages/UserProfile";
import BookHistory from "./pages/BookHistory";
import ChangePassword from "./sections/auth/signin/ChangePassword";
import ForgetPassword from "./sections/auth/signin/ForgetPassword";
import "./index.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<StarterPage />} />
        <Route path="/signup" element={<RegistrationPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/movie/:title" element={<MovieDetail />} />
        <Route path="/seat-reservation" element={<SeatReservation />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/booking-history" element={<BookHistory />} />
      </Routes>
      <ToastContainer
        position="top-right" // You can change the position
        autoClose={5000} // Auto close after 5 seconds
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseDelay={300}
        theme="colored" // You can set the theme here
      />
    </>
  );
}

export default App;
