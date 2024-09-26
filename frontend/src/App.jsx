import { Route, Routes } from "react-router-dom";
import StarterPage from "./pages/StarterPage";
import RegistrationPage from "./sections/auth/signup/RegistrationPage";
import SignInPage from "./sections/auth/signin/SignInPage";
import HomePage from "./pages/HomePage";
import MovieDetail from "./pages/MovieDetail";
import SeatReservation from "./pages/SeatReservation";
import UserProfile from "./pages/UserProfile";
import BookHistory from "./pages/BookHistory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StarterPage />} />
      <Route path="/signup" element={<RegistrationPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/movie/:title" element={<MovieDetail />} />
      <Route path="/seat-reservation" element={<SeatReservation />} />
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/booking-history" element={<BookHistory />} />
    </Routes>
  );
}

export default App;
