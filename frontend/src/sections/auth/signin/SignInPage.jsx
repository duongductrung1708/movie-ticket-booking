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
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
            Sign In
          </Typography>

          <Box component="form" noValidate className="signin-form">
            <TextField
              fullWidth
              id="email"
              label="Email"
              variant="filled"
              className="input-field"
              margin="normal"
              color="secondary"
              InputLabelProps={{
                style: { color: "violet" },
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
              color="secondary"
              InputLabelProps={{
                style: { color: "violet" },
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
              fullWidth
              variant="contained"
              color="error"
              className="signin-btn"
            >
              Sign In
            </Button>
          </Box>

          <Typography variant="body1" className="signup-link">
            First time here?{" "}
            <Button
              color="secondary"
              className="signup-btn"
              onClick={() => navigate("/signup")}
            >
              Sign up now!
            </Button>
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default SignInPage;
