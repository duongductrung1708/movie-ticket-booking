import React, { useState, useRef } from "react";
import styled from "styled-components";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

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
  }
  @media (max-width: 48em) {
    width: 90%;
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 30em) {
    grid-template-columns: repeat(2, 1fr);
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

const MovieListItem = React.forwardRef(({ image, title, rating }, ref) => {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate(`/movie/${encodeURIComponent(title)}`);
  };
  return (
    <MovieItem ref={ref}>
      <MovieImage src={image} alt={title} />
      <MovieInfo>
        <MovieTitle>{title}</MovieTitle>
        <MovieRating>Rating: {rating} / 10</MovieRating>
        z<Button onClick={handleBooking}>Book Now</Button>
      </MovieInfo>
    </MovieItem>
  );
});

const MovieList = () => {
  const [visibleMovies, setVisibleMovies] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const revealRefs = useRef([]);
  revealRefs.current = [];
  gsap.registerPlugin(ScrollTrigger);

  const movies = [
    {
      title: "The Matrix",
      rating: "8.7",
      image:
        "https://play-lh.googleusercontent.com/zL8ya3uEa7Q-oDqc7McTIAaRvwKZNN4HMICMwHHL2eKsbE9Hms_2Dj6SWwNGI555CyauvPVjCPUzYBm2TJ8",
    },
    {
      title: "Inception",
      rating: "8.8",
      image:
        "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    },
    {
      title: "Interstellar",
      rating: "8.6",
      image:
        "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    },
    {
      title: "Avatar",
      rating: "7.8",
      image:
        "https://play-lh.googleusercontent.com/jA5PwYqtmoFS7StajBe2EawN4C8WDdltO68JcsrvYKSuhjcTap5QMETkloXSq5soqRBqFjuTAhh28AYrA6A",
    },
    {
      title: "The Dark Knight",
      rating: "9.0",
      image:
        "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    },
    {
      title: "Joker",
      rating: "8.5",
      image:
        "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    },
    {
      title: "Titanic",
      rating: "7.8",
      image:
        "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_FMjpg_UX1000_.jpg",
    },
    {
      title: "Gladiator",
      rating: "8.5",
      image:
        "https://m.media-amazon.com/images/M/MV5BODVlNzZmOWUtNTNhNC00YzczLTg5NzAtOThlZjViZDkwYTIzXkEyXkFqcGc@._V1_.jpg",
    },
    {
      title: "The Godfather",
      rating: "9.2",
      image:
        "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg",
    },
    {
      title: "Schindler's List",
      rating: "9.0",
      image:
        "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    },
    {
      title: "The Avengers",
      rating: "8.0",
      image: "https://via.placeholder.com/150x225",
    },
    {
      title: "Pulp Fiction",
      rating: "8.9",
      image: "https://via.placeholder.com/150x225",
    },
    {
      title: "Forrest Gump",
      rating: "8.8",
      image: "https://via.placeholder.com/150x225",
    },
    {
      title: "Fight Club",
      rating: "8.8",
      image: "https://via.placeholder.com/150x225",
    },
    {
      title: "The Shawshank Redemption",
      rating: "9.3",
      image: "https://via.placeholder.com/150x225",
    },
    {
      title: "Parasite",
      rating: "8.6",
      image: "https://via.placeholder.com/150x225",
    },
    {
      title: "The Lion King",
      rating: "8.5",
      image: "https://via.placeholder.com/150x225",
    },
    {
      title: "The Lord of the Rings",
      rating: "8.9",
      image: "https://via.placeholder.com/150x225",
    },
    {
      title: "Harry Potter",
      rating: "7.6",
      image: "https://via.placeholder.com/150x225",
    },
    {
      title: "Star Wars",
      rating: "8.6",
      image: "https://via.placeholder.com/150x225",
    },
  ];

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
        {filteredMovies.slice(0, visibleMovies).map((movie, index) => (
          <MovieListItem
            key={index}
            image={movie.image}
            title={movie.title}
            rating={movie.rating}
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

export default MovieList;
