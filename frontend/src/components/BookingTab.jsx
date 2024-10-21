import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";
import { getAllTheater, getShowtimesByTheater } from "../services/api";
import dayjs from "dayjs";
import "../styles/BookingTabStyle.css";

const Title = styled.h2`
  font-family: "Arial", sans-serif;
  font-size: 2.4rem;
  color: #fff;
  margin-bottom: 1.5rem;
  margin-top: 1.5rem;
  padding-left: 1.5rem;
  text-transform: uppercase;
  border-left: 5px solid #fff;

  @media (max-width: 1024px) {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
`;

const Subtitle = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 1.6rem;
  color: #fff;
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
  font-family: "Arial", sans-serif;
  font-size: 1.4rem;
  color: ${(props) => (props.selected ? "#000" : "#fff")};
  background-color: ${(props) => (props.selected ? "white" : "transparent")};
  border: 1px solid #fff;
  border-radius: 15px;
  padding: 0.8rem 1.5rem;
  margin: 0.5rem 1rem 1rem;
  cursor: pointer;
  display: block;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: gray;
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

const Showtime = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? "block" : "none")};
  z-index: 998;

  @media (max-width: 1024px) {
    height: 100%;
  }
`;

const BookingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 70%;
  height: 100vh;
  background: url("https://t3.ftcdn.net/jpg/04/15/87/76/360_F_415877698_c1VY6BMnUbNxh7Or80VDZAWng4UoGfWi.jpg");
  background-size: cover;
  background-position: center;
  padding: 20px;
  transform: ${(props) =>
    props.isOpen ? "translateX(0)" : "translateX(-100%)"};
  transition: transform 0.4s ease;
  z-index: 999;
  color: white;
  clip-path: polygon(0 0, 100% 0, 0% 400%);
  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    width: 80%;
    height: 100%;
    clip-path: polygon(0 0, 88% 0, 0% 400%);
  }

  @media (max-width: 768px) {
    width: 100%;
    clip-path: polygon(0 0, 80% 0, 0% 400%);
  }

  @media (max-width: 480px) {
    width: 100%;
    clip-path: polygon(-1% -1%, 80% 0%, -1% 400%);
  }
`;

const ScrollableContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  max-height: 60vh;
  padding-right: 1.5rem;

  @media (max-width: 768px) {
    max-height: 100vh;
    padding-right: 1rem;
  }

  @media (max-width: 480px) {
    max-height: 100vh;
    padding-right: 0.5rem;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: white;
  position: absolute;
  top: 10px;
  right: 10px;

  @media (max-width: 1024px) {
    right: 100px;
  }

  @media (max-width: 768px) {
    right: 130px;
  }

  @media (max-width: 480px) {
    right: 180px;
  }
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

const BookingTab = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const cities = ["HCMC", "Hanoi", "Da Nang"];
  const [selectedCity, setSelectedCity] = useState("");
  const [filteredTheaters, setFilteredTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedShowtimes, setSelectedShowtimes] = useState({});
  const [movies, setMovies] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

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

            const groupedMovies = {};

            showtimesData.forEach((showtime) => {
              const movieId = showtime.movie_id._id;
              const movieTitle = showtime.movie_id.title;
              const movieImage = showtime.movie_id.image;
              const movieLanguage = showtime.movie_id.language;
              const movieDuration = showtime.movie_id.duration;
              const showtimeLayout = showtime.seatLayout;

              const movieGenres = showtime.movie_id.genre
                .map((genre) => genre.name)
                .join(", ");
              const showtimeDate = dayjs(showtime.date).format("MM/DD/YYYY");

              const room = showtime.room_id.name

              const uniqueKey = `${movieId}-${showtimeDate}`;

              if (!groupedMovies[uniqueKey]) {
                groupedMovies[uniqueKey] = {
                  title: movieTitle,
                  showtimes: [],
                  date: showtimeDate,
                  movieId: movieId,
                  image: movieImage,
                  language: movieLanguage,
                  duration: movieDuration,
                  genres: movieGenres,
                  seatLayout: showtimeLayout,
                  room: room,
                };
              }

              groupedMovies[uniqueKey].showtimes.push(showtime.start_time);
            });

            const formattedMovies = Object.values(groupedMovies);
            setMovies(formattedMovies);
          } catch (error) {
            console.error("Error fetching showtimes:", error);
          }
        } else {
          console.error("Theater not found in filtered theaters");
        }
      }
    };

    fetchShowtimes();
  }, [selectedTheater, filteredTheaters]);

  const handleOutsideClick = (e) => {
    if (e.target.id === "overlay") {
      onClose();
    }
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setFilteredTheaters([]);
    setSelectedTheater("");
  };  

  const handleShowtimeSelect = (movieTitle, time) => {
    const selectedMovie = movies.find((movie) => movie.title === movieTitle);
  
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
      const movieImage = selectedMovie.image;
      const seatLayout = selectedMovie.seatLayout;
      const selectedTheaterDetails = filteredTheaters.find(
        (theater) => theater.name === selectedTheater
      );

      const selectedRoom = selectedMovie.room;
  
      const theaterAddress = selectedTheaterDetails?.address;
  
      navigate("/seat-reservation", {
        state: {
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

  const filteredMovies = selectedDate
    ? movies.filter((movie) => movie.date === selectedDate.format("MM/DD/YYYY"))
    : movies;

  return (
    <>
      <Overlay isOpen={isOpen} id="overlay" onClick={handleOutsideClick} />
      <BookingWrapper isOpen={isOpen}>
        <CloseButton onClick={onClose}>
          <HighlightOffIcon fontSize="large" />
        </CloseButton>

        <Title>Book a ticket</Title>

        <SelectWrapper>
          <FormControl
            style={{ width: "40%" }}
            variant="filled"
            color="warning"
          >
            <InputLabel
              id="city-select-label"
              sx={{ color: "orange", "&.Mui-focused": { color: "#ffcc00" } }}
            >
              Select a city
            </InputLabel>
            <Select
              labelId="city-select-label"
              id="city-select-label"
              label="City"
              onChange={handleCityChange}
              value={selectedCity}
              sx={{
                color: "white",
                ".MuiSelect-icon": { color: "white" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ffcc00",
                },
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              {cities.map((city, index) => (
                <MenuItem key={index} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </SelectWrapper>

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
                sx={{ color: "white" }}
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
                sx={{
                  width: "40%",
                  ".MuiInputBase-input": { color: "white" },
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

            <ScrollableContent>
              <Title>{selectedTheater}</Title>
              {Array.isArray(filteredMovies) && filteredMovies.length > 0 ? (
                filteredMovies.map((movie, movieIndex) => (
                  <div key={movie.movieId}>
                    <Title>{movie.title}</Title>
                    <Subtitle>
                      {movie.genres || "No genres available"} -{" "}
                      {movie.language || "Language not specified"} -{" "}
                      {movie.duration || "Duration not specified"}
                    </Subtitle>
                    <Subtitle>
                      {dayjs(movie.date).format("MM/DD/YYYY")}
                    </Subtitle>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {movie.showtimes.map((time, timeIndex) => (
                        <Showtime key={timeIndex}>
                          <ShowtimeButton
                            selected={selectedShowtimes[movie.title] === time}
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
                <Subtitle>No movies found for the selected date.</Subtitle>
              )}
            </ScrollableContent>
          </>
        )}
      </BookingWrapper>
    </>
  );
};

export default BookingTab;
