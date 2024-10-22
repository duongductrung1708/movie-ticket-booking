import "@fontsource/akaya-telivigala";
import "@fontsource/sora";
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Breadcrumbs,
  Typography,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import YouTube from "react-youtube";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Footer from "../components/Footer";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Navigation from "../components/Navigation";
import {
  getMovieById,
  getAllTheater,
  getShowtimesByTheater,
} from "../services/api";
import dayjs from "dayjs";
import "../styles/MovieDetailsStyle.css";

const Section = styled.section`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  width: 100vw;
  position: relative;
  background-color: ${(props) => props.theme.body};
`;

const Container = styled.div`
  width: 75%;
  min-height: 80vh;
  margin: 0 auto;
  margin-bottom: 10rem;

  @media (max-width: 64em) {
    width: 85%;
  }
  @media (max-width: 48em) {
    width: 100%;
  }
`;

const BreadcrumbContainer = styled.div`
  margin-bottom: 1rem;
  margin-top: 5rem;
`;

const StyledBreadcrumbs = styled(Breadcrumbs)`
  background-color: ${(props) => props.theme.body};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const BreadcrumbLink = styled(MuiLink)`
  font-family: "Sora", sans-serif !important;
  color: orange !important;
  text-decoration: none !important;

  &:hover {
    text-decoration: underline;
  }
`;

const MovieInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 2rem;
  align-items: start;
  margin-top: 1rem;

  @media (max-width: 48em) {
    grid-template-columns: 1fr;
  }
`;

const MoviePoster = styled.img`
  width: 100%;
  height: auto;
  max-width: 350px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const MovieSynopsis = styled.p`
  font-family: "Sora", sans-serif;
  font-size: 1.2rem;
  margin-top: 1rem;
  line-height: 1.6;

  @media (max-width: 64em) {
    font-size: 1rem;
  }

  @media (max-width: 48em) {
    font-size: 0.8rem;
    padding: 0.5rem;
  }

  @media (max-width: 30em) {
    font-size: 0.6rem;
  }
`;

const AdditionalInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 0.5fr 2fr;
  grid-gap: 2rem;
  font-family: "Sora", sans-serif;
  font-size: 1.2rem;

  @media (max-width: 48em) {
    grid-template-columns: 1fr;
  }
`;

const Details = styled.div`
  @media (max-width: 48em) {
    padding: 0.5rem;
  }
`;

const DetailItem = styled.div`
  margin-bottom: 0.5rem;
  font-family: "Sora", sans-serif;
  justify-content: space-between;
  display: flex;
  line-height: 2;

  @media (max-width: 64em) {
    font-size: 1rem;
  }

  @media (max-width: 48em) {
    font-size: 0.8rem;
    padding: 0.5rem;
  }

  @media (max-width: 30em) {
    font-size: 0.6rem;
  }
`;

const CastList = styled.div`
  margin-top: 2rem;

  @media (max-width: 48em) {
    display: flex;
    padding: 0.5rem;
  }
`;

const CastMember = styled.div`
  font-family: "Sora", sans-serif;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;

  @media (max-width: 64em) {
    font-size: 1rem;
  }

  @media (max-width: 48em) {
    font-size: 0.8rem;
    padding: 0.5rem;
  }

  @media (max-width: 30em) {
    font-size: 0.6rem;
  }
`;

const Heading = styled.div`
  font-family: "Akaya Telivigala", cursive;
  color: orange;
  border-left: 2px solid orange;
  font-size: 1.3rem;
  padding-left: 0.5rem;
  margin-bottom: 0.5rem;
  margin-top: 2.5rem;

  @media (max-width: 48em) {
    margin-top: 0;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;
`;

const StyledYouTube = styled(YouTube)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const SelectWrapper = styled.div`
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Address = styled.div`
  margin-left: 20rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;

  @media (max-width: 1024px) {
    font-size: 1rem;
    margin-left: 5rem;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-left: 0;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const BookingOptions = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5rem;

  @media (max-width: 48em) {
    font-size: 0.8rem;
    padding: 0.5rem;
  }

  @media (max-width: 30em) {
    font-size: 0.6rem;
  }
`;

const Showtime = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  font-family: "Sora", sans-serif;
  font-size: 1rem;
  color: gray;
  margin-bottom: 1.5rem;
  margin-top: 1.5rem;
  text-transform: uppercase;
  border-left: 5px solid #fff;

  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
  }
`;

const Subtitle = styled.p`
  font-family: "Sora", sans-serif;
  font-size: 1rem;
  color: #000;
  margin-bottom: 1rem;

  @media (max-width: 1024px) {
    font-size: 1.4rem;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ShowtimeButton = styled.button`
  font-family: "Sora", sans-serif;
  font-size: 0.8rem;
  color: ${(props) => (props.selected ? "#fff" : "#000")};
  background-color: ${(props) => (props.selected ? "orange" : "transparent")};
  border: 1px solid orange;
  border-radius: 15px;
  padding: 0.8rem 1.5rem;
  margin: 0 1rem 1rem 0;
  cursor: pointer;
  display: block;
  transition: background-color 0.3s ease, color 0.3s ease;

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

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();
  const cities = ["HCMC", "Hanoi", "Da Nang"];
  const [selectedCity, setSelectedCity] = useState("");
  const [filteredTheaters, setFilteredTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedShowtimes, setSelectedShowtimes] = useState({});
  const [movies, setMovies] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const bookingRef = useRef(null);

  const resetSelection = () => {
    setSelectedCity("");
    setFilteredTheaters([]);
    setSelectedTheater("");
    setSelectedDate(null);
    setSelectedShowtimes({});
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieData = await getMovieById(id);
        setMovie(movieData);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    const fetchTheaters = async () => {
      if (selectedCity) {
        try {
          const theatersData = await getAllTheater();
          const filtered = theatersData.filter(
            (theater) => theater.city === selectedCity
          );
          setFilteredTheaters(filtered);
        } catch (error) {
          console.error("Error fetching theaters:", error);
        }
      } else {
        setFilteredTheaters([]);
      }
    };

    fetchTheaters();
  }, [selectedCity]);

  useEffect(() => {
    const fetchShowtimes = async () => {
      if (selectedTheater) {
        const selectedTheaterDetails = filteredTheaters.find(
          (theater) => theater.name === selectedTheater
        );
    
        if (selectedTheaterDetails) {
          const theaterId = selectedTheaterDetails._id;
    
          try {
            const showtimesData = await getShowtimesByTheater(theaterId);
    
            console.log("Showtimes Data: ", showtimesData);
    
            const filteredShowtimes = showtimesData.filter((showtime) => {
              const showtimeDate = dayjs(showtime.date);
              const currentDate = dayjs();
    
              if (selectedDate) {
                return (
                  showtimeDate.isSame(selectedDate, "day") &&
                  showtime.movie_id._id === movie._id
                );
              }
    
              return (
                (showtimeDate.isAfter(currentDate, "day") || 
                 showtimeDate.isSame(currentDate, "day")) &&
                showtime.movie_id._id === movie._id
              );
            });
    
            console.log("Filtered Showtimes: ", filteredShowtimes);
    
            const uniqueMovies = {};
    
            filteredShowtimes.forEach((showtime) => {
              const movieId = showtime.movie_id._id;
              const movieTitle = showtime.movie_id.title;
              const movieLanguage = showtime.movie_id.language;
              const movieDuration = showtime.movie_id.duration;
              const showtimeLayout = showtime.seatLayout;
    
              const movieGenres = showtime.movie_id.genre
                .map((genre) => genre.name)
                .join(", ");
    
              const showtimeDate = dayjs(showtime.date).format("MM/DD/YYYY");
    
              const room = showtime.room_id.name;
              const showtimeId = showtime._id;
    
              if (!uniqueMovies[movieId]) {
                uniqueMovies[movieId] = {
                  title: movieTitle,
                  showtimes: [],
                  date: showtimeDate,
                  movieId: movieId,
                  language: movieLanguage,
                  duration: movieDuration,
                  genres: movieGenres,
                  seatLayout: showtimeLayout,
                  room: room,
                  showtimeId: showtimeId,
                };
              }
    
              uniqueMovies[movieId].showtimes.push(showtime.start_time);
            });
    
            const formattedMovies = Object.values(uniqueMovies);
    
            console.log("Formatted Movies: ", formattedMovies);
    
            setMovies(formattedMovies);
          } catch (error) {
            console.error("Error fetching showtimes:", error);
          }
        } else {
          setMovies([]);
        }
      }
    };

    fetchShowtimes();
  }, [selectedTheater, selectedDate, filteredTheaters, movie]);

  const handleShowtimeSelect = (movieTitle, time) => {
    const selectedMovie = movies.find((movie) => movie.title === movieTitle);
    console.log(selectedMovie);

    if (selectedMovie) {
      const showtimeDate = selectedMovie.date;

      if (!selectedDate) {
        setSelectedDate(dayjs(showtimeDate, "MM/DD/YYYY"));
      }

      setSelectedShowtimes((prevShowtimes) => ({
        ...prevShowtimes,
        [movieTitle]: time,
      }));

      const movieDuration = selectedMovie.duration;
      const movieImage = movie.image || selectedMovie.image;

      const selectedRoom = selectedMovie.room;
      const showtimeId = selectedMovie.showtimeId;

      const seatLayout = selectedMovie.seatLayout;
      const selectedTheaterDetails = filteredTheaters.find(
        (theater) => theater.name === selectedTheater
      );

      const theaterAddress = selectedTheaterDetails?.address;

      navigate("/seat-reservation", {
        state: {
          showtime: showtimeId,
          movieTitle: selectedMovie.title,
          movieImage: movieImage,
          selectedTime: time,
          selectedDate: dayjs(showtimeDate, "MM/DD/YYYY").format("MM/DD/YYYY"),
          selectedTheater: selectedTheater,
          selectedTheaterAddress: theaterAddress,
          duration: movieDuration,
          seatLayout: seatLayout,
          selectedRoom: selectedRoom,
        },
      });
    }
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setFilteredTheaters([]);
    setSelectedTheater("");
  };

  const opts = {
    height: "490",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToBooking = () => {
    if (bookingRef.current) {
      bookingRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredMovies = selectedDate
    ? movies.filter((movie) => movie.showtimes.length > 0)
    : movies;

  return (
    <Section>
      <Navigation />
      <Container>
        <BreadcrumbContainer>
          <StyledBreadcrumbs aria-label="breadcrumb">
            <BreadcrumbLink component={Link} to="/home">
              Home
            </BreadcrumbLink>
            <Typography color="textPrimary">{movie?.title}</Typography>
          </StyledBreadcrumbs>
        </BreadcrumbContainer>
        {movie ? (
          <>
            <MovieInfoGrid>
              <MoviePoster src={`http://localhost:8080/api/images/${movie.image}`} alt={movie.title} />
              <VideoWrapper>
                <StyledYouTube
                  videoId={movie.trailer.split("v=")[1]}
                  opts={opts}
                />
              </VideoWrapper>
            </MovieInfoGrid>
            <div>
              <Button
                variant="contained"
                color="warning"
                onClick={scrollToBooking}
              >
                Book Now
              </Button>
            </div>
            <AdditionalInfoGrid>
              <div>
                <MovieSynopsis>
                  <Heading>Content</Heading>
                  {movie.synopsis}
                </MovieSynopsis>
                <CastList ref={bookingRef}>
                  <Heading>Cast</Heading>
                  {movie.cast.map((actor, index) => (
                    <CastMember key={index} variant="body1">
                      {actor}
                    </CastMember>
                  ))}
                </CastList>
              </div>
              <div></div>
              <Details>
                <Heading>Details</Heading>
                <DetailItem variant="body1">
                  <strong>Director:</strong> {movie.director}
                </DetailItem>
                <DetailItem variant="body1">
                  <strong>Language:</strong> {movie.language}
                </DetailItem>
                <DetailItem variant="body1">
                  <strong>Country:</strong> {movie.country}
                </DetailItem>
                <DetailItem variant="body1">
                  <strong>Genre:</strong>{" "}
                  {movie.genre.map((g) => g.name).join(", ")}
                </DetailItem>
                <DetailItem variant="body1">
                  <strong>Release Date:</strong> {movie.releaseDate}
                </DetailItem>
                <DetailItem variant="body1">
                  <strong>Duration:</strong> {movie.duration}
                </DetailItem>
                <DetailItem variant="body1">
                  <strong>Age Rating:</strong> {movie.ageRating}
                </DetailItem>
                <DetailItem variant="body1">
                  <strong>Rating:</strong> {movie.rating} / 10
                </DetailItem>
              </Details>
            </AdditionalInfoGrid>
            <BookingOptions>
              <Heading>Booking</Heading>
              <SelectWrapper>
                <FormControl
                  style={{ width: "40%" }}
                  variant="filled"
                  color="warning"
                >
                  <InputLabel
                    id="city-select-label"
                    sx={{
                      color: "orange",
                      "&.Mui-focused": { color: "#ffcc00" },
                    }}
                  >
                    Select a city
                  </InputLabel>
                  <Select
                    labelId="city-select-label"
                    id="city-select-label"
                    label="City"
                    onChange={handleCityChange}
                    value={selectedCity}
                  >
                    {cities.map((city, index) => (
                      <MenuItem key={index} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </SelectWrapper>
              <Heading>Select Theater</Heading>
              {selectedCity && (
                <SelectWrapper>
                  <FormControl
                    style={{ width: "40%" }}
                    variant="filled"
                    color="warning"
                  >
                    <InputLabel
                      id="theater-select-label"
                      sx={{
                        color: "orange",
                        "&.Mui-focused": { color: "#ffcc00" },
                      }}
                    >
                      Select a theater
                    </InputLabel>
                    <Select
                      labelId="theater-select-label"
                      id="theater-select"
                      value={selectedTheater}
                      onChange={(e) => setSelectedTheater(e.target.value)}
                    >
                      {filteredTheaters.map((theater, index) => (
                        <MenuItem key={index} value={theater.name}>
                          {theater.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Address>
                    <LocationOnIcon />
                    {
                      filteredTheaters.find((t) => t.name === selectedTheater)
                        ?.address
                    }
                  </Address>
                </SelectWrapper>
              )}

              {selectedTheater && (
                <>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Select a date"
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                      format="MM/DD/YYYY"
                      minDate={dayjs()}
                      sx={{
                        width: "40%",
                        ".MuiInputBase-input": { color: "orange" },
                        svg: { color: "white" },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ffcc00",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ffcc00",
                        },
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      }}
                      renderInput={(params) => (
                        <FormControl>
                          <InputLabel
                            sx={{
                              color: "orange",
                              "&.Mui-focused": { color: "#ffcc00" },
                            }}
                          >
                            {params.label}
                          </InputLabel>
                          <input {...params.inputProps} />
                        </FormControl>
                      )}
                    />
                  </LocalizationProvider>

                  <Button
                    style={{ width: "15%", marginTop: "1rem" }}
                    variant="contained"
                    color="warning"
                    onClick={resetSelection}
                  >
                    Reset Selections
                  </Button>

                  <Title>{selectedTheater}</Title>
                  {Array.isArray(filteredMovies) &&
                  filteredMovies.length > 0 ? (
                    filteredMovies.map((movie, movieIndex) => (
                      <div key={movie.movieId}>
                        <Subtitle>
                          {dayjs(movie.date).format("MM/DD/YYYY")}
                        </Subtitle>
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                          {movie.showtimes.map((time, timeIndex) => (
                            <Showtime key={timeIndex}>
                              <ShowtimeButton
                                selected={
                                  selectedShowtimes[movie.title] === time
                                }
                                onClick={() =>
                                  handleShowtimeSelect(movie.title, time)
                                }
                              >
                                {time}
                              </ShowtimeButton>
                            </Showtime>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <Subtitle>No showtime found.</Subtitle>
                  )}
                </>
              )}
            </BookingOptions>
          </>
        ) : (
          <Typography variant="h5">Movie not found</Typography>
        )}
      </Container>
      <Footer />
    </Section>
  );
};

export default MovieDetail;
