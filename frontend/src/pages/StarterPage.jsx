import React from "react";
import { Button, Container, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "../styles/starterstyle.css";
import backgroundImage from "../assets/netflix-junio.jpg";
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

const StarterPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="bg"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <header className="app-header">
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
        <Button
          variant="contained"
          color="error"
          className="sign-in-btn"
          onClick={() => navigate("/signin")}
        >
          Sign In
        </Button>
        <div></div>
      </header>

      <div className="app-content">
        <Typography variant="h1" gutterBottom className="main-title">
          Movie ticket booking website
        </Typography>
        <Typography variant="h4" gutterBottom className="sub-title">
          Get the most complete and fastest updates on movies, ticket prices,
          theaters and promotions for you
        </Typography>

        <Typography variant="h6" className="email-prompt">
          Follow us for daily deals.
        </Typography>

        <Container className="email-form">
          <TextField
            id="filled-basic"
            variant="outlined"
            label="Your email"
            className="email-input"
            color="secondary"
            fullWidth
            focused
            InputLabelProps={{
              style: { color: "#fff", fontSize: "1.3rem" },
            }}
            InputProps={{
              style: { color: "#fff", fontSize: "1.5rem" },
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
          <Button
            variant="contained"
            color="error"
            className="try-now-btn"
            style={{ fontSize: "1rem" }}
            onClick={() => navigate("/signup")}
          >
            Get Started ⮞
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default StarterPage;
