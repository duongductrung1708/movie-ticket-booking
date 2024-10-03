import React, { useState } from "react";
import { Button, TextField, Typography, Box, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  sendForgotPasswordOTP,
  resetPasswordWithOTP,
} from "../../../services/api";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      toast.error("Please enter a valid email address.", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      setLoading(true);
      try {
        await sendForgotPasswordOTP(email);
        toast.success(`OTP sent to ${email}`, {
          position: "top-right",
          autoClose: 3000,
        });
        setStep(2);
        setOtpSent(true);
        setResendCooldown(true);
        // Start a 30-second cooldown
        setTimeout(() => setResendCooldown(false), 30000);
      } catch (error) {
        toast.error(error.message, {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendOTP = async () => {
    if (!otpSent || resendCooldown) return; // Only allow resend if OTP was sent and cooldown has passed
    setLoading(true);
    try {
      await sendForgotPasswordOTP(email);
      toast.success(`OTP resent to ${email}`, {
        position: "top-right",
        autoClose: 3000,
      });
      setResendCooldown(true);
      // Reset cooldown after 30 seconds
      setTimeout(() => setResendCooldown(false), 30000);
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (otp.trim() === "" || newPassword.trim() === "") {
      toast.error("Please enter OTP and new password.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!validatePassword(newPassword)) {
      toast.error(
        "Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }
    try {
      await resetPasswordWithOTP(email, otp, newPassword);
      toast.success("Password reset successful.", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/signin");
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
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
          {step === 1
            ? "Enter your email to receive an OTP."
            : "Enter the OTP and your new password."}
        </StyledTypography>

        {step === 1 ? (
          <Box component="form" onSubmit={handleEmailSubmit} noValidate>
            <TextField
              fullWidth
              id="email"
              label="Email"
              variant="filled"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: "red" } }}
              InputProps={{
                sx: {
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#444",
                    "&:hover": { backgroundColor: "#555" },
                  },
                  "& .Mui-focused": { color: "#fff" },
                },
              }}
              sx={{ marginBottom: 2 }}
            />
            <StyledButton
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </StyledButton>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleResetSubmit} noValidate>
            <TextField
              fullWidth
              id="otp"
              label="OTP"
              variant="filled"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              InputLabelProps={{ style: { color: "violet" } }}
              InputProps={{
                sx: {
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#444",
                    "&:hover": { backgroundColor: "#555" },
                  },
                  "& .Mui-focused": { color: "#fff" },
                },
              }}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              id="newPassword"
              label="New Password"
              variant="filled"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputLabelProps={{ style: { color: "violet" } }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
                sx: {
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#444",
                    "&:hover": { backgroundColor: "#555" },
                  },
                  "& .Mui-focused": { color: "#fff" },
                },
              }}
              sx={{ marginBottom: 2 }}
            />
            <StyledButton fullWidth variant="contained" type="submit">
              Reset Password
            </StyledButton>
            {otpSent && (
              <Button
                fullWidth
                color="secondary"
                sx={{ marginTop: 2 }}
                onClick={handleResendOTP}
                disabled={loading || resendCooldown}
              >
                {loading
                  ? "Resending..."
                  : resendCooldown
                  ? "Wait 30s"
                  : "Resend OTP"}
              </Button>
            )}
          </Box>
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
