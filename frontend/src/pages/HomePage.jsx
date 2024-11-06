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
  width: 90px;
  height: 70px;
  padding: 0.5rem;
  background-color: red;
  color: white;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  display: ${(props) => (props.show ? "block" : "none")};
  justify-content: center;
  align-items: center;
  transition: opacity 0.5s ease, width 0.4s ease, height 0.4s ease;
  opacity: ${(props) => (props.show ? 1 : 0)};
  clip-path: polygon(0 0, 100% 0, 0% 200%);

  &:hover {
    width: 190px;
    height: 70px;
  }

  &:hover .text {
    opacity: 1;
    transition: opacity 0.4s ease;
  }

  @media (max-width: 1024px) {
    width: 60px;
    height: 70px;
    font-size: 1rem;
    clip-path: polygon(0 0, 100% 0, 0% 200%);

    &:hover {
      width: 170px;
    }
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 70px;
    font-size: 0.8rem;

    &:hover {
      width: 120px;
    }
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 70px;
    font-size: 0.7rem;

    &:hover {
      width: 100px;
    }
  }
`;

const Icon = styled.div`
  font-size: 1rem;
  color: white;
  padding: 0;
  position: absolute;
  top: 1rem;
`;

const Text = styled.div`
  color: white;
  font-size: 1.1rem;
  opacity: 0;
  transition: opacity 0.4s ease;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
`;

const ChatBotIframe = styled.iframe`
  position: fixed;
  bottom: 1rem;
  right: 5rem;
  border: none;
  z-index: 100;
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

        setShowButton(
          scrollPosition >= movieListPosition &&
            scrollPosition <=
              document.documentElement.scrollHeight - window.innerHeight
        );
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
          <Text className="text">Book Here</Text>
          <Icon>
            <TouchAppIcon />
          </Icon>
        </BookTicketButton>
        <BookingTab
          isOpen={isBookingTabOpen}
          onClose={() => setIsBookingTabOpen(false)}
        />
        <ChatBotIframe
          className="chat-bot-iframe"
          title="chatbot"
          width="350"
          height="430"
          allow="microphone;"
          src="https://console.dialogflow.com/api-client/demo/embedded/6271bc8f-8a5c-4b54-924a-b87deb806d41"
        ></ChatBotIframe>
      </ThemeProvider>
    </>
  );
};

export default HomePage;
