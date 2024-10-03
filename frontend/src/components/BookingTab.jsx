import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import klogo from "../assets/kcinema.png";
import { useNavigate } from "react-router-dom";

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

const TheaterLogos = styled.div`
  display: flex;
  gap: 5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    gap: 3rem;
  }

  @media (max-width: 480px) {
    gap: 2rem;
  }
`;

const TheaterLogo = styled.img`
  width: 70px;
  height: 70px;
  cursor: pointer;
  border-radius: 50%;
  filter: ${(props) => (props.selected ? "brightness(1)" : "brightness(0.5)")};
  transition: filter 0.3s ease;

  &:hover {
    filter: brightness(1);
  }

  @media (max-width: 1024px) {
    width: 60px;
    height: 60px;
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
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

const movies = [
  {
    title: "The Matrix",
    image:
      "https://play-lh.googleusercontent.com/zL8ya3uEa7Q-oDqc7McTIAaRvwKZNN4HMICMwHHL2eKsbE9Hms_2Dj6SWwNGI555CyauvPVjCPUzYBm2TJ8",
    duration: "136 minutes",
    showtimes: {
      "2024-09-23": ["10:00", "12:00", "14:00"],
      "2024-09-24": ["11:00", "13:00", "15:00"],
    },
  },
  {
    title: "Inception",
    image: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    duration: "148 minutes",
    showtimes: {
      "2024-09-23": ["10:30", "12:30", "14:30"],
      "2024-09-24": ["11:30", "13:30", "15:30"],
    },
  },
];

const BookingTab = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const cities = ["HCMC", "Hanoi", "Da Nang"];
  const theaters = {
    HCMC: ["K.CINEMA Star Cineplex - 3/2 HCMC", "K.CINEMA Hai Ba Trung HCMC"],
    Hanoi: [
      "K.CINEMA Ba Dinh Ha Noi",
      "K.CINEMA Royal City Ha Noi",
      "K.CINEMA - Cao Thang Ha Noi",
    ],
    "Da Nang": ["K.CINEMA Vincom Plaza Da Nang", "K.CINEMA Da Nang"],
  };

  const theaterLogos = [
    {
      name: "K.CINEMA",
      logo: klogo,
    },
  ];

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("");
  const [filteredTheaters, setFilteredTheaters] = useState([]);
  const [selectedTheaterLogo, setSelectedTheaterLogo] = useState({});
  const [selectedShowtimes, setSelectedShowtimes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  const handleOutsideClick = (e) => {
    if (e.target.id === "overlay") {
      onClose();
    }
  };

  const filterTheatersByLogo = (theater) => {
    setSelectedTheaterLogo(theater.name);
  };

  const handleShowtimeSelect = (movieTitle, time) => {
    setSelectedShowtimes((prevShowtimes) => ({
      ...prevShowtimes,
      [movieTitle]: time,
    }));
  
    const selectedMovie = movies.find(movie => movie.title === movieTitle);
  
    if (selectedMovie) {
      const movieImage = selectedMovie.image;
      const movieDuration = selectedMovie.duration;
  
      navigate("/seat-reservation", {
        state: {
          movieTitle: selectedMovie.title,
          movieImage: movieImage,
          selectedTime: time,
          selectedDate: selectedDate.format("YYYY-MM-DD"),
          selectedTheater: selectedTheater,
          duration: movieDuration,
        },
      });
    }
  };  

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
              onChange={(e) => {
                const selectedCity = e.target.value;
                setSelectedCity(selectedCity);

                const filteredTheaters = theaters[selectedCity] || [];
                setFilteredTheaters(filteredTheaters);
                setSelectedTheaterLogo("");
                setSelectedTheater("");
              }}
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
          <>
            <TheaterLogos>
              {theaterLogos.map((theater, index) => (
                <TheaterLogo
                  key={index}
                  src={theater.logo}
                  alt={theater.name}
                  selected={selectedTheaterLogo === theater.name}
                  onClick={() => filterTheatersByLogo(theater)}
                />
              ))}
            </TheaterLogos>

            {selectedTheaterLogo && (
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
                    id="theater-select-label"
                    value={selectedTheater}
                    label="Theater"
                    onChange={(e) => setSelectedTheater(e.target.value)}
                    sx={{
                      color: "white",
                      ".MuiSelect-icon": { color: "white" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ffcc00",
                      },
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {filteredTheaters.map((theater, index) => (
                      <MenuItem key={index} value={theater}>
                        {theater}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Address>
                  <LocationOnIcon /> 19 Cao Thang, Q.3
                </Address>
              </SelectWrapper>
            )}
          </>
        )}

        {selectedTheater && (
          <ScrollableContent>
            <Title>{selectedTheater}</Title>
            <Subtitle>R12 Horror - English - 0h 37m</Subtitle>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select a date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
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
              />
            </LocalizationProvider>
            {selectedDate && (
              <>
                {movies.map((movie, movieIndex) => (
                  <div key={movieIndex}>
                    <Title>{movie.title}</Title>
                    <div style={{ display: "flex" }}>
                      {movie.showtimes[selectedDate.format("YYYY-MM-DD")]?.map(
                        (time, timeIndex) => (
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
                        )
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </ScrollableContent>
        )}
      </BookingWrapper>
    </>
  );
};

export default BookingTab;
