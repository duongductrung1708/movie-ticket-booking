import React, { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Container = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const FormWrapper = styled(Box)`
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
`;

const StyledButton = styled(Button)`
  margin-top: 1.5rem !important;
  background-color: red !important;
  &:hover {
    background-color: red !important;
  }
`;

const StyledTypography = styled(Typography)`
  text-align: center;
`;

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

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      toast.error("Please enter a valid email address.", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      toast.success(`Password reset link sent to ${email}`, {
        position: "top-right",
        autoClose: 3000,
      });
      setSubmitted(true);
    }
  };

  return (
    <Container>
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
      <FormWrapper>
        <StyledTypography variant="h4" gutterBottom>
          Forgot Password?
        </StyledTypography>
        <StyledTypography variant="body1" gutterBottom>
          Enter your email to receive a password reset link.
        </StyledTypography>

        {!submitted ? (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              id="email"
              label="Email"
              variant="filled"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{
                style: { color: "violet" },
              }}
              InputProps={{
                sx: {
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#444",
                    "&:hover": {
                      backgroundColor: "#555",
                    },
                  },
                  "& .Mui-focused": {
                    color: "#fff",
                  },
                },
              }}
              sx={{ marginBottom: 2 }}
            />

            <StyledButton fullWidth variant="contained" type="submit">
              Send Reset Link
            </StyledButton>
          </Box>
        ) : (
          <StyledTypography variant="body1" sx={{ mt: 2 }}>
            A password reset link has been sent to {email}.
          </StyledTypography>
        )}

        <Button
          fullWidth
          color="secondary"
          sx={{ marginTop: 2 }}
          onClick={() => navigate("/signin")}
        >
          Back to Sign In
        </Button>
      </FormWrapper>

      <ToastContainer />
    </Container>
  );
};

export default ForgotPasswordPage;
