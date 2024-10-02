import React, { useState } from "react";
import styled from "styled-components";
import ConfettiComponent from "../Confetti";

const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.body};
  position: relative;
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontxx1};
  text-transform: capitalize;
  color: ${(props) => props.theme.text};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
  border-bottom: 2px solid ${(props) => props.theme.text};
  width: fit-content;

  @media (max-width: 64em) {
    font-size: ${(props) => props.theme.fontx1};
  }
`;

const SearchBar = styled.input`
  width: 30%;
  padding: 0.5rem;
  margin: 1rem auto;
  border: 2px solid ${(props) => props.theme.text};
  border-radius: 10px;
  text-align: center;
  font-size: ${(props) => props.theme.fontmd};
  display: block;

  @media (max-width: 48em) {
    width: 50%;
  }

  @media (max-width: 30em) {
    width: 60%;
  }
`;

const Container = styled.div`
  width: 75%;
  margin: 2rem auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2rem;

  @media (max-width: 64em) {
    width: 80%;
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 48em) {
    width: 90%;
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 30em) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  color: ${(props) => props.theme.body};
  position: relative;
  z-index: 5;
  backdrop-filter: blur(4px);
  border: 2px solid ${(props) => props.theme.text};
  border-radius: 20px;
  overflow: hidden;
  text-align: center;
  height: 90%;

  @media (max-width: 30em) {
    width: 70vw;
  }
`;

const MovieImage = styled.img`
  width: 100%;
  max-width: 150px;
  height: auto;
  border-radius: 15px;
  margin-bottom: 1rem;
`;

const Name = styled.h2`
  font-size: ${(props) => props.theme.fontmd};
  text-transform: uppercase;
  color: ${(props) => props.theme.text};
  margin-top: 1rem;
  min-height: 3rem;
`;

const ReleaseDate = styled.h3`
  font-size: ${(props) => props.theme.fontmd};
  color: ${(props) => `rgba(${props.theme.textRgba}, 0.9)`};
  font-weight: 400;
  margin-bottom: 1rem;
  min-height: 2rem;
`;

const Button = styled.button`
  display: block;
  margin-top: auto;
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.text};
  color: ${(props) => props.theme.body};
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: gray;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 2rem;
`;

const ShowMoreButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.text};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: ${(props) => props.theme.fontmd};
`;

const Movie = ({ img, name = "", releaseDate = "" }) => {
  return (
    <Item>
      <MovieImage src={img} alt={name} />
      <Name>{name}</Name>
      <ReleaseDate>{releaseDate}</ReleaseDate>
      <Button>Watch Trailer</Button>
    </Item>
  );
};

const UpcomingMovies = () => {
  const [visibleMovies, setVisibleMovies] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const movies = [
    {
      img: "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg",
      name: "The Avengers",
      releaseDate: "December 2024",
    },
    {
      img: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
      name: "Pulp Fiction",
      releaseDate: "January 2025",
    },
    {
      img: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg",
      name: "Forrest Gump",
      releaseDate: "February 2025",
    },
    {
      img: "https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_.jpg",
      name: "Fight Club",
      releaseDate: "March 2025",
    },
    {
      img: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
      name: "The Shawshank Redemption",
      releaseDate: "April 2025",
    },
    {
      img: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
      name: "Parasite",
      releaseDate: "May 2025",
    },
    {
      img: "https://m.media-amazon.com/images/M/MV5BMjIwMjE1Nzc4NV5BMl5BanBnXkFtZTgwNDg4OTA1NzM@._V1_FMjpg_UX1000_.jpg",
      name: "The Lion King",
      releaseDate: "June 2025",
    },
    {
      img: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg",
      name: "The Lord of the Rings",
      releaseDate: "July 2025",
    },
    {
      img: "https://m.media-amazon.com/images/M/MV5BNmQ0ODBhMjUtNDRhOC00MGQzLTk5MTAtZDliODg5NmU5MjZhXkEyXkFqcGdeQXVyNDUyOTg3Njg@._V1_.jpg",
      name: "Harry Potter",
      releaseDate: "August 2025",
    },
  ];

  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMovies = () => {
    if (visibleMovies < filteredMovies.length) {
      setVisibleMovies((prevValue) => prevValue + 5);
    } else {
      setVisibleMovies(5);
    }
  };

  return (
    <Section id="upcoming-movies">
      <ConfettiComponent />
      <Title>Upcoming Movies</Title>
      <SearchBar
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Container>
        {filteredMovies.slice(0, visibleMovies).map((movie, index) => (
          <Movie
            key={index}
            img={movie.img}
            name={movie.name}
            releaseDate={movie.releaseDate}
          />
        ))}
      </Container>
      <ButtonWrapper>
        <ShowMoreButton onClick={toggleMovies}>
          {visibleMovies < filteredMovies.length
            ? "Show More →"
            : "Show Less ←"}
        </ShowMoreButton>
      </ButtonWrapper>
    </Section>
  );
};

export default UpcomingMovies;
