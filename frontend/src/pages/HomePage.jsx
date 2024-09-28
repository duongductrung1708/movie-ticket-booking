import React, { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { light } from "../styles/Themes";
import GlobalStyles from "../styles/GlobalStyles";
import TouchAppIcon from "@mui/icons-material/TouchApp";

import Navigation from "../components/Navigation";
import Home from "../components/sections/Home";
import About from "../components/sections/About";
import Showcase from "../components/sections/Showcase";
import Faq from "../components/sections/Faq";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import MovieList from "../components/sections/MovieList";
import UpcomingMovies from "../components/sections/UpcomingMovies";
import styled from "styled-components";
import BookingTab from "../components/BookingTab";

const BookTicketButton = styled.button`
  position: fixed;
  top: 0;
  z-index: 100;
  width: 60px; /* Smaller default size */
  height: 60px; /* Smaller default size */
  padding: 0.5rem;
  background-color: black;
  color: white;
  border: none;
  font-size: 1rem; /* Adjusted for better responsiveness */
  cursor: pointer;
  display: ${(props) => (props.show ? "block" : "none")};
  justify-content: center;
  align-items: center;
  transition: opacity 0.5s ease, width 0.4s ease, height 0.4s ease;
  opacity: ${(props) => (props.show ? 1 : 0)};
  clip-path: polygon(0 0, 100% 0, 0% 200%);

  &:hover {
    width: 150px; /* Adjusted size for hover */
    height: 60px; /* Adjusted size for hover */
  }

  &:hover .text {
    opacity: 1;
    transition: opacity 0.4s ease;
  }

  @media (max-width: 768px) {
    width: 50px; /* Responsive adjustments */
    height: 50px;
    font-size: 0.8rem; /* Smaller text */
    
    &:hover {
      width: 120px; /* Responsive hover size */
    }
  }

  @media (max-width: 480px) {
    width: 40px; /* Smaller for mobile */
    height: 40px;
    font-size: 0.7rem;
    
    &:hover {
      width: 100px; /* Adjusted size for mobile hover */
    }
  }
`;

const Icon = styled.div`
  font-size: 1rem;
  color: white;
  padding: 0;
  position: absolute;
  top: 1rem; /* Adjusted for responsiveness */
`;

const Text = styled.div`
  color: white;
  font-size: 1rem; /* Adjusted for better responsiveness */
  opacity: 0;
  transition: opacity 0.4s ease;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 0.8rem; /* Responsive text size */
  }

  @media (max-width: 480px) {
    font-size: 0.6rem; /* Smaller text for mobile */
  }
`;

const HomePage = () => {
  const [showButton, setShowButton] = useState(false);
  const [isBookingTabOpen, setIsBookingTabOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const movieListSection = document.getElementById("movie-list");

      if (movieListSection) {
        const { top } = movieListSection.getBoundingClientRect();
        const scrollPosition = window.scrollY;
        const movieListPosition = top + window.scrollY;

        if (
          scrollPosition >= movieListPosition &&
          scrollPosition <=
            document.documentElement.scrollHeight - window.innerHeight
        ) {
          setShowButton(true);
        } else {
          setShowButton(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={light}>
        <Navigation />
        <Home />
        <About />
        <MovieList id="movie-list" />
        <Showcase />
        <UpcomingMovies />
        <Faq />
        <Footer />
        <ScrollToTop />
        <BookTicketButton
          show={showButton && !isBookingTabOpen}
          onClick={() => setIsBookingTabOpen(true)}
        >
          <Text className="text">Cinema</Text>
          <Icon>
            <TouchAppIcon />
          </Icon>
        </BookTicketButton>
        <BookingTab
          isOpen={isBookingTabOpen}
          onClose={() => setIsBookingTabOpen(false)}
        />
      </ThemeProvider>
    </>
  );
};

export default HomePage;
