import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getMovies } from "../services/api";

const CarouselContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  .slick-slider {
    width: 100%;
    height: auto;
  }

  img {
    width: 80%;
    height: auto;
    border-radius: 10px;
    margin: 0 auto;
  }

  @media (max-width: 64em) {
    min-width: 40vh;
  }
`;

const CoverVideo = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
  };

  return (
    <CarouselContainer>
      <Slider {...settings}>
        {movies.map((movie, index) => (
          <div key={index}>
            <img src={movie.image} alt={movie.title} />
          </div>
        ))}
      </Slider>
    </CarouselContainer>
  );
};

export default CoverVideo;
