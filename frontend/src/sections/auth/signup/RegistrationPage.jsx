import React from "react";
import { Button, TextField, Typography, Container, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/registrationPage.css";
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

const RegistrationPage = () => {
  const navigate = useNavigate();

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
        <div></div>
        <Button
          variant="contained"
          color="error"
          className="sign-in-btn"
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
            variant="outlined"
            className="input-field"
            margin="normal"
            color="secondary"
            InputLabelProps={{
              style: { color: "violet" },
            }}
          />
          <TextField
            fullWidth
            id="name"
            label="Username"
            variant="outlined"
            className="input-field"
            margin="normal"
            color="secondary"
            InputLabelProps={{
              style: { color: "violet" },
            }}
          />
          <TextField
            fullWidth
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            className="input-field"
            margin="normal"
            color="secondary"
            InputLabelProps={{
              style: { color: "violet" },
            }}
          />
          <TextField
            fullWidth
            id="confirm-password"
            label="Confirm password"
            type="password"
            variant="outlined"
            className="input-field"
            margin="normal"
            color="secondary"
            InputLabelProps={{
              style: { color: "violet" },
            }}
          />
          <Button
            fullWidth
            variant="contained"
            color="error"
            className="register-btn"
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegistrationPage;
