import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/registrationPage.css";
import styled from "styled-components";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { registerUser } from "../../../services/api";

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
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    dob: "",
  });

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmPasswordVisibility);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const { username, email, phoneNumber, password, confirmPassword, dob } =
      userData;

    if (
      !username ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword ||
      !dob
    ) {
      toast.error("Please fill in all fields!");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email format!");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Phone number must be 10 digits!");
      return;
    }

    if (!validatePassword(password)) {
      toast.error(
        "Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character!"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const dataToSend = {
        username,
        email,
        phoneNumber,
        password,
        confirmPassword,
        dob,
      };
      console.log("User data being sent:", dataToSend);
      await registerUser(dataToSend);
      toast.success("Registration successful! Please verify your email.");
      navigate("/signin");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
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

        <Box
          component="form"
          noValidate
          className="form"
          onSubmit={handleSignUp}
        >
          <TextField
            fullWidth
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            variant="filled"
            margin="normal"
            InputLabelProps={{
              style: { color: "red" },
            }}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            variant="filled"
            margin="normal"
            InputLabelProps={{
              style: { color: "red" },
            }}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            id="name"
            name="username"
            label="Username"
            variant="filled"
            margin="normal"
            InputLabelProps={{
              style: { color: "red" },
            }}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            id="dob"
            name="dob"
            label="Date of Birth"
            type="date"
            variant="filled"
            margin="normal"
            focused
            InputLabelProps={{
              style: { color: "red" },
            }}
            onChange={handleChange}
            InputProps={{
              inputProps: {
                max: new Date().toISOString().split("T")[0],
              },
            }}
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type={passwordVisibility ? "text" : "password"}
            variant="filled"
            margin="normal"
            InputLabelProps={{
              style: { color: "red" },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {passwordVisibility ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            id="confirm-password"
            name="confirmPassword"
            label="Confirm Password"
            type={confirmPasswordVisibility ? "text" : "password"}
            variant="filled"
            margin="normal"
            InputLabelProps={{
              style: { color: "red" },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {confirmPasswordVisibility ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={handleChange}
          />
          <Button fullWidth variant="contained" color="error" type="submit">
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegistrationPage;
