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
        <LogoText>
          <Link style={{ textDecoration: "none", color: "white" }} to="/">
            K. Cinema
          </Link>
        </LogoText>
        <div className="app-header-btns">
          <Button
            variant="contained"
            color="error"
            className="sign-in-btn"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            color="error"
            className="sign-up-btn"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
        </div>
      </header>

      <div className="app-content">
        <Typography
          variant="h1"
          gutterBottom
          className="main-title"
          sx={{
            fontSize: {
              xs: "2rem",
              sm: "3rem",
              md: "4rem",
              lg: "5rem",
            },
            fontWeight: "bold",
            textAlign: "center",
            color: "white",
          }}
        >
          Movie ticket booking website
        </Typography>

        <Typography
          variant="h4"
          gutterBottom
          className="sub-title"
          sx={{
            fontSize: {
              xs: "1.2rem",
              sm: "1.5rem",
              md: "2rem",
              lg: "2.5rem",
            },
            textAlign: "center",
            color: "white",
          }}
        >
          Get the most complete and fastest updates on movies, ticket prices,
          theaters and promotions for you
        </Typography>

        <Typography
          variant="h6"
          className="email-prompt"
          sx={{
            fontSize: {
              xs: "1rem",
              sm: "1.2rem",
              md: "1.5rem",
            },
            textAlign: "center",
            color: "white",
            marginBottom: "1rem",
          }}
        >
          Follow us for daily deals.
        </Typography>

        <Container className="email-form" sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="error"
            className="try-now-btn"
            sx={{
              fontSize: {
                xs: "0.5rem",
                sm: "0.7rem",
                md: "1.2rem",
              },
            }}
            onClick={() => navigate("/home")}
          >
            Get Started ⮞
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default StarterPage;
