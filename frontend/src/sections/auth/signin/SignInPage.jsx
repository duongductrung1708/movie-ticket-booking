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
import { loginUser } from "../../../services/api";
import { useAuth } from "../../../hooks/AuthProvider";
import "../../../styles/signInPage.css";
import backgroundImage from "../../../assets/netflix-junio.jpg";
import styled from "styled-components";

const LogoText = styled.h1`
  font-family: "Akaya Telivigala", cursive;
  font-size: ${(props) => props.theme.fontxxx1};
  color: ${(props) => props.theme.text};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 64em) {
    font-size: ${(props) => props.theme.fontxx1};
  }
`;

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      const userData = await loginUser({ email, password });

      if (userData?.token) {
        localStorage.setItem("user", userData.token);
      }

      toast.success("Login successful!");
      login(userData);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
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
              color="red"
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
            <Typography variant="body2" color="secondary" align="right">
              <Link
                to="/forgot-password"
                style={{ textDecoration: "none", color: "orange" }}
              >
                Forgot Password?
              </Link>
            </Typography>
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

          <Typography variant="body1" className="signup-link">
            Don't have an account?{" "}
            <Button
              className="signup-btn"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Button>
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default SignInPage;
