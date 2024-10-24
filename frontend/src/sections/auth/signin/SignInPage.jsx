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
import { loginUser, loginWithGoogle } from "../../../services/api";
import { useAuth } from "../../../hooks/AuthProvider";
import "../../../styles/signInPage.css";
import backgroundImage from "../../../assets/netflix-junio.jpg";
import styled from "styled-components";
import { GoogleLogin } from "@react-oauth/google";

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

const StyledGoogleButton = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  .google-btn {
    background-color: #4285f4;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #357ae8;
    }

    img {
      width: 24px;
      height: 24px;
    }
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

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const userData = await loginWithGoogle(token);

      console.log("User Data from Google:", userData);

      if (!userData) {
        throw new Error("No user data received from Google login");
      }

      const { accessToken } = userData;

      if (accessToken) {
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        throw new Error("Access token is missing");
      }

      toast.success("Google Login successful!");
      login(userData);
      navigate("/home");
    } catch (error) {
      console.error("Google Login error:", error);
      toast.error("Google login failed. Please try again.");
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
            <Button className="signup-btn" onClick={() => navigate("/signup")}>
              Sign up
            </Button>
          </Typography>
          <Box>
            <Typography
              variant="body2"
              color="white"
              align="center"
              style={{ fontWeight: "bold" }}
            >
              Or
            </Typography>
          </Box>
          <Box mt={2}>
            <StyledGoogleButton>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.log("Google Login Failed")}
                render={(renderProps) => (
                  <Button
                    className="google-btn"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <img
                      src="https://www.gstatic.com/images/branding/product/1x/gsa_ios_48dp.png"
                      alt="Google logo"
                    />
                    Continue with Google
                  </Button>
                )}
              />
            </StyledGoogleButton>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default SignInPage;
