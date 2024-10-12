import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { getMovies } from "../../services/api"; // Import the getMovies function

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

  @media (max-width: 40em) {
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
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 48em) {
    width: 90%;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 30em) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const MovieItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  color: ${(props) => props.theme.body};
  position: relative;
  z-index: 5;
  backdrop-filter: blur(4px);
  border: 2px solid ${(props) => props.theme.text};
  border-radius: 20px;
  overflow: hidden;
  text-align: center;

  @media (max-width: 30em) {
    width: 70vw;
  }
`;

const MovieImage = styled.img`
  width: 150px;
  height: 225px;
  object-fit: cover;
  border-radius: 15px;
`;

const MovieInfo = styled.div`
  margin-top: 1rem;
  text-align: center;
`;

const MovieTitle = styled.h2`
  font-size: ${(props) => props.theme.fontmd};
  text-transform: uppercase;
  color: ${(props) => props.theme.text};
`;

const MovieRating = styled.span`
  display: block;
  margin-top: 0.5rem;
  font-size: ${(props) => props.theme.fontsm};
  color: ${(props) => props.theme.text};
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.text};
  color: ${(props) => props.theme.body};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.3s ease;

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

const MovieListItem = React.forwardRef(({ movie }, ref) => {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate(`/movie/${movie._id}`);
  };

  return (
    <MovieItem ref={ref}>
      <MovieImage src={movie.image} alt={movie.title} />
      <MovieInfo>
        <MovieTitle>{movie.title}</MovieTitle>
        <MovieRating>Rating: {movie.rating} / 10</MovieRating>
        <MovieRating>
          {movie.duration} | {movie.releaseDate}
        </MovieRating>
        <Button onClick={handleBooking}>Book Now</Button>
      </MovieInfo>
    </MovieItem>
  );
});

const MovieList = () => {
  const [visibleMovies, setVisibleMovies] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const revealRefs = useRef([]);
  revealRefs.current = [];
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movieData = await getMovies();
        setMovies(movieData);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMovies = () => {
    if (visibleMovies < filteredMovies.length) {
      setVisibleMovies((prevValue) => prevValue + 10);
    } else {
      setVisibleMovies(10);
    }
  };

  return (
    <Section id="movie-list">
      <Title>Now Showing</Title>
      <SearchBar
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Container>
        {filteredMovies.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          filteredMovies
            .slice(0, visibleMovies)
            .map((movie, index) => (
              <MovieListItem
                key={index}
                movie={movie}
              />
            ))
        )}
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

export default MovieList;
