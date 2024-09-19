import { Route, Routes } from "react-router-dom";
import StarterPage from "./pages/StarterPage";
import RegistrationPage from "./sections/auth/signup/RegistrationPage";
import SignInPage from "./sections/auth/signin/SignInPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
      <Routes>
      <Route path="/" element={<StarterPage />} />
      <Route path="/signup" element={<RegistrationPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/home" element={<HomePage />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resetpass" element={<ResetPass />} />
        <Route path="/changepass/:email" element={<ChangePass />} />
        <Route path="/" element={<Home />} />
        <Route path="/home/:id/details" element={<Detail />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/admin/*" element={<AdminRoute element={<Admin />} />} />
        <Route path="/admin/user/*" element={<UserPage />} />
        <Route path="/admin/ad/*" element={<AdPage />}></Route>
        <Route path="/admin/contact/*" element={<ContactPage />}></Route>
        <Route path="/admin/profile/*" element={<ProfilePage />}></Route> */}
      </Routes>
  );
}

export default App;
