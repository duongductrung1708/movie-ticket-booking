import React from "react";
import { ThemeProvider } from "styled-components";
import { light } from "../styles/Themes";
import GlobalStyles from "../styles/GlobalStyles";

import Navigation from "../components/Navigation";
import Home from "../components/sections/Home";
import About from "../components/sections/About";
import Showcase from "../components/sections/Showcase";
import Faq from "../components/sections/Faq";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import MovieList from "../components/sections/MovieList";
import UpcomingMovies from "../components/sections/UpcomingMovies";

const HomePage = () => {
  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={light}>
        <Navigation />
        <Home />
        <About />
        <MovieList />
        <Showcase />
        <UpcomingMovies />
        <Faq />
        <Footer />
        <ScrollToTop />
      </ThemeProvider>
    </>
  );
};

export default HomePage;
