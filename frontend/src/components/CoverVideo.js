import React from "react";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const movieImages = [
  {
    img: "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg",
    title: "The Avengers",
  },
  {
    img: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    title: "Pulp Fiction",
  },
  {
    img: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg",
    title: "Forrest Gump",
  },
  {
    img: "https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_.jpg",
    title: "Fight Club",
  },
  {
    img: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
    title: "The Shawshank Redemption",
  },
  {
    img: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
    title: "Parasite",
  },
];

const CarouselContainer = styled.div`
  width: 100%;
  max-width: 600px; /* Restrict the overall width of the container */
  margin: 0 auto; /* Center the container */

  .slick-slider {
    width: 100%;
    height: auto;
  }

  img {
    width: 80%; /* Make the images smaller */
    height: auto;
    border-radius: 10px;
    margin: 0 auto; /* Center the images */
  }

  @media (max-width: 64em) {
    min-width: 40vh;
  }
`;

const CoverVideo = () => {
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
        {movieImages.map((movie, index) => (
          <div key={index}>
            <img src={movie.img} alt={movie.title} />
          </div>
        ))}
      </Slider>
    </CarouselContainer>
  );
};

export default CoverVideo;
