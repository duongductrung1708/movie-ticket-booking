import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import {
  getMovies,
  getShowtimesByMovieId,
  getTheaterByRoomId,
} from "../../services/api"; // Import the getMovies function
import dayjs from "dayjs";

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

  @media (max-width: 1024px) {
    font-size: 1rem;
    padding: 0.7rem 1.2rem;
    margin: 0.5rem 1rem 1rem;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
    margin: 0.5rem 0.8rem 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    margin: 0.5rem 1rem 1rem;
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

const ShowtimeButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: transition;
  color: ${(props) => props.theme.text};
  border: 1px solid orange;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f8ca7f;
    color: white;
  }

  @media (max-width: 1024px) {
    font-size: 1rem;
    padding: 0.7rem 1.2rem;
    margin: 0.5rem 1rem 1rem;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
    margin: 0.5rem 0.8rem 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    margin: 0.5rem 1rem 1rem;
  }
`;

const ShowtimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const ShowtimeCard = styled.div`
  margin: 10px 0;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const MovieListItem = React.forwardRef(({ movie, onShowtimeClick }, ref) => {
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button onClick={handleBooking}>Details</Button>
          <ShowtimeButton onClick={() => onShowtimeClick(movie)}>
            Showtimes
          </ShowtimeButton>
        </div>
      </MovieInfo>
    </MovieItem>
  );
});

const MovieList = () => {
  const navigate = useNavigate();
  const [visibleMovies, setVisibleMovies] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
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
    setVisibleMovies((prev) =>
      prev === filteredMovies.length ? 10 : filteredMovies.length
    );
  };

  const handleShowtimeClick = async (movie) => {
    try {
      const fetchedShowtimes = await getShowtimesByMovieId(movie._id);
      console.log(fetchedShowtimes);

      setShowtimes(fetchedShowtimes);
      setSelectedMovie(movie);
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch showtimes:", error);
    }
  };

  const handlSelectShowtime = async (showtime) => {
    const selectedMovie = movies.find(
      (movie) => movie._id === showtime.movie_id._id
    );
    console.log(selectedMovie);

    if (selectedMovie) {
      const showtimeDate = showtime.date;

      const movieDuration = selectedMovie.duration;
      const movieImage = selectedMovie.image;
      const seatLayout = showtime.seatLayout;
      const time = showtime.start_time;
      const theaterResponse = await getTheaterByRoomId(showtime.room_id);
      console.log(theaterResponse);

      navigate("/seat-reservation", {
        state: {
          showtime: showtime._id,
          movieTitle: selectedMovie.title,
          movieImage: movieImage,
          selectedTime: time,
          selectedDate: showtimeDate,
          selectedTheater: theaterResponse.name,
          selectedRoom: showtime.room_name,
          selectedTheaterAddress:
            theaterResponse.address + ", " + theaterResponse.city,
          duration: movieDuration,
          seatLayout: seatLayout,
        },
      });
    }
  };

  console.log(showtimes);

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
                onShowtimeClick={handleShowtimeClick}
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
      <ModalOverlay isOpen={modalOpen} onClick={() => setModalOpen(false)} />
      <Modal isOpen={modalOpen}>
        <h2>{selectedMovie?.title} Showtimes</h2>
        <ShowtimeContainer>
          {showtimes.map((showtime, index) => (
            <ShowtimeCard key={index}>
              {dayjs(showtime.date).format("MM/DD/YYYY")} at{" "}
              <ShowtimeButton
                onClick={() => {
                  handlSelectShowtime(showtime);
                }}
              >
                {showtime.start_time}
              </ShowtimeButton>
            </ShowtimeCard>
          ))}
        </ShowtimeContainer>
        <Button onClick={() => setModalOpen(false)}>Close</Button>
      </Modal>
    </Section>
  );
};

export default MovieList;
