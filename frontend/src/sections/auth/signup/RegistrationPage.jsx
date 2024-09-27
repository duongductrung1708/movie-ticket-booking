import React, { useState } from "react";
import { Button, TextField, Typography, Container, Box, InputAdornment, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/registrationPage.css";
import styled from "styled-components";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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

const RegistrationPage = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmPasswordVisibility);
  };

  const handleSignUp = () => {

    toast.success("Registration successful!");
    navigate("/signin");
  };

  return (
    <Container maxWidth="lg" className="registration-container">
      <Box className="app-nav">
        <div></div>
        <LogoText>
          <Link style={{ textDecoration: "none", color: "black" }} to="/">
            K. Cinema
          </Link>
        </LogoText>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate("/signin")}
        >
          Sign In
        </Button>
        <div></div>
      </Box>

      <Box className="right-section">
        <Typography variant="h4" className="main-title1" gutterBottom>
          Sign up to start growing with us.
        </Typography>
        <Typography variant="subtitle1" className="subtitle1" gutterBottom>
          Please fill in the information below
        </Typography>

        <Box component="form" noValidate className="form">
          <TextField
            fullWidth
            id="email"
            label="Email"
            variant="filled"
            margin="normal"
            InputLabelProps={{
              style: { color: "violet" },
            }}
          />
          <TextField
            fullWidth
            id="name"
            label="Username"
            variant="filled"
            margin="normal"
            InputLabelProps={{
              style: { color: "violet" },
            }}
          />
          <TextField
            fullWidth
            id="password"
            label="Password"
            type={passwordVisibility ? "text" : "password"}
            variant="filled"
            margin="normal"
            InputLabelProps={{
              style: { color: "violet" },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {passwordVisibility ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            id="confirm-password"
            label="Confirm password"
            type={confirmPasswordVisibility ? "text" : "password"}
            variant="filled"
            margin="normal"
            InputLabelProps={{
              style: { color: "violet" },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {confirmPasswordVisibility ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegistrationPage;
