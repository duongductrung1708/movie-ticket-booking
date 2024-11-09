import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../styles/signIn.css";
import backgroundImage from "../../assets/netflix-junio.jpg";
import styled from "styled-components";
import { useAuth } from "../../context/AuthProvider";
import { handleLogin } from "../../services/authService";
import { ToastContainer } from "react-toastify";

const LogoText = styled.h1`
  font-family: "Akaya Telivigala", cursive;
  font-size: 4em;
  color: #202020;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 64em) {
    font-size: 3em;
  }
`;

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleClickShowPassword = (): void => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      const userData: AuthData = await handleLogin({
        email,
        password,
        isAdmin: true,
      });
      toast.success("Login successful!");
      login(userData);
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.msg || "Login failed. Please try again."
      );
    }
  };

  return (
    <div
      className="signin-bg"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg" className="signin-container">
        <Box className="app-nav1">
          <div></div>
          <LogoText>
            <Link style={{ textDecoration: "none", color: "white" }} to="/">
              K. Cinema
            </Link>
          </LogoText>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </Box>

        <Box className="signin-content">
          <Typography variant="h3" className="signin-title" gutterBottom>
            Sign in
          </Typography>

          <Box
            component="form"
            noValidate
            className="signin-form"
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              id="email"
              label="Email"
              variant="filled"
              className="input-field"
              margin="normal"
              color="error"
              InputLabelProps={{
                style: { color: "red" },
              }}
              InputProps={{
                style: { color: "#fff" },
                sx: {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#fff",
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                    },
                  },
                },
                onChange: (e) => setEmail(e.target.value),
              }}
            />
            <TextField
              fullWidth
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="filled"
              className="input-field"
              margin="normal"
              color="error" // Change "red" to "error"
              InputLabelProps={{
                style: { color: "red" }, // You can still manually set the label color if needed
              }}
              InputProps={{
                style: { color: "#fff" },
                sx: {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#fff",
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                    },
                  },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      style={{ color: "white" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                onChange: (e) => setPassword(e.target.value),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="error"
              className="signin-btn"
            >
              Sign In
            </Button>
          </Box>
        </Box>
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
      </Container>
    </div>
  );
};

export default SignInPage;
