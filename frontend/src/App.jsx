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
import { AuthProvider } from './hooks/AuthProvider';

import { RedirectRoute, ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<RedirectRoute element={<StarterPage />} />} />
        <Route path="/signup" element={<RedirectRoute element={<RegistrationPage />} />} />
        <Route path="/signin" element={<RedirectRoute element={<SignInPage />} />} />
        <Route path="/change-password" element={<ProtectedRoute element={<ChangePassword />} />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/movie/:title" element={<ProtectedRoute element={<MovieDetail />} />} />
        <Route path="/seat-reservation" element={<ProtectedRoute element={<SeatReservation />} />} />
        <Route path="/user-profile" element={<ProtectedRoute element={<UserProfile />} />} />
        <Route path="/booking-history" element={<ProtectedRoute element={<BookHistory />} />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseDelay={300}
        theme="colored"
      />
    </AuthProvider>
  );
}

export default App;
