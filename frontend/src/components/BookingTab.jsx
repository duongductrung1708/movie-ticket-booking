import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Title = styled.h2`
  font-family: "Arial", sans-serif;
  font-size: 2.4rem;
  color: #fff;
  margin-bottom: 1.5rem;
  margin-top: 1.5rem;
  padding-left: 1.5rem;
  text-transform: uppercase;
  border-left: 5px solid #fff;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }
`;

const Subtitle = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 1.6rem;
  color: #fff;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
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

  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 0.7rem 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.5rem 1rem;
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
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ScrollableContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  max-height: 60vh;
  padding-right: 1.5rem;

  @media (max-width: 768px) {
    max-height: 50vh;
    padding-right: 1rem;
  }

  @media (max-width: 480px) {
    max-height: 40vh;
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

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
  }
`;

const Address = styled.div`
  margin-left: 20rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    margin-left: 10rem;
  }

  @media (max-width: 480px) {
    margin-left: 5rem;
  }
`;

const BookingTab = ({ isOpen, onClose }) => {
  const cities = ["HCMC", "Hanoi", "Da Nang"];
  const theaters = {
    HCMC: ["BHD Star Cineplex - 3/2", "CineStar Hai Ba Trung"],
    Hanoi: ["Lotte Cinema Ba Dinh", "CGV Royal City", "MegaGS - Cao Thang"],
    DaNang: ["CGV Vincom Plaza", "Galaxy Da Nang"],
  };

  const theaterLogos = [
    {
      name: "BHD",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/57/Logo_BHD_Star_Cineplex.png",
      theaters: [
        ...theaters.HCMC.filter((t) => t.includes("BHD")),
        ...theaters.Hanoi.filter((t) => t.includes("BHD")),
        ...theaters.DaNang.filter((t) => t.includes("BHD")),
      ],
    },
    {
      name: "CGV",
      logo: "https://banner2.cleanpng.com/20181203/orv/kisspng-cj-cgv-vietnam-cinema-cj-group-film-1713914319903.webp",
      theaters: [
        ...theaters.HCMC.filter((t) => t.includes("CGV")),
        ...theaters.Hanoi.filter((t) => t.includes("CGV")),
        ...theaters.DaNang.filter((t) => t.includes("CGV")),
      ],
    },
    {
      name: "Galaxy",
      logo: "https://static.ybox.vn/2020/12/3/1608715814588-15.png",
      theaters: [
        ...theaters.HCMC.filter((t) => t.includes("Galaxy")),
        ...theaters.Hanoi.filter((t) => t.includes("Galaxy")),
        ...theaters.DaNang.filter((t) => t.includes("Galaxy")),
      ],
    },
    {
      name: "Lotte",
      logo: "https://play-lh.googleusercontent.com/XfF2Hv8BIuX8h60TG_MI7xUbsIfofLSP98TeJK1YMQ-O3UeHp1S-JBOpj7UngiQZvg",
      theaters: [
        ...theaters.HCMC.filter((t) => t.includes("Lotte")),
        ...theaters.Hanoi.filter((t) => t.includes("Lotte")),
        ...theaters.DaNang.filter((t) => t.includes("Lotte")),
      ],
    },
    {
      name: "CNS",
      logo: "https://cinestar.com.vn/assets/images/logo-meta.png",
      theaters: [
        ...theaters.HCMC.filter((t) => t.includes("CineStar")),
        ...theaters.Hanoi.filter((t) => t.includes("CineStar")),
        ...theaters.DaNang.filter((t) => t.includes("CineStar")),
      ],
    },
    {
      name: "MegaGS",
      logo: "https://yt3.googleusercontent.com/ytc/AIdro_kAogUzys6HT78bL9_vITcF9xNdzolVER0Rb-D8s1kxmQ=s900-c-k-c0x00ffffff-no-rj",
      theaters: [
        ...theaters.HCMC.filter((t) => t.includes("MegaGS")),
        ...theaters.Hanoi.filter((t) => t.includes("MegaGS")),
        ...theaters.DaNang.filter((t) => t.includes("MegaGS")),
      ],
    },
  ];

  const movieShowtimes = {
    "John Wick II": ["10:10", "12:10", "14:10"],
    "Avengers: Endgame": ["16:10", "18:10", "20:10"],
    "Spider-Man: No Way Home": ["10:10", "12:10", "16:10", "20:10"],
  };

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("");
  const [filteredTheaters, setFilteredTheaters] = useState([]);
  const [selectedTheaterLogo, setSelectedTheaterLogo] = useState({});
  const [selectedShowtimes, setSelectedShowtimes] = useState({});

  const handleOutsideClick = (e) => {
    if (e.target.id === "overlay") {
      onClose();
    }
  };

  const filterTheatersByLogo = (theaterLogo) => {
    setSelectedTheaterLogo(theaterLogo.name);
    setFilteredTheaters(theaterLogo.theaters);
    setSelectedTheater("");
  };

  const handleShowtimeSelect = (movie, time) => {
    setSelectedShowtimes((prev) => ({
      ...prev,
      [movie]: time,
    }));
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
                setSelectedCity(e.target.value);
                setFilteredTheaters([]);
                setSelectedTheaterLogo("");
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
                <Address><LocationOnIcon/> 19 Cao Thang, Q.3</Address>
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
            {Object.keys(movieShowtimes).map((movie, index) => (
              <div key={index}>
                <Title>{movie}</Title>
                <Showtime>
                  {movieShowtimes[movie].map((time, timeIndex) => (
                    <ShowtimeButton
                      key={timeIndex}
                      selected={selectedShowtimes[movie] === time}
                      onClick={() => handleShowtimeSelect(movie, time)}
                    >
                      {time}
                    </ShowtimeButton>
                  ))}
                </Showtime>
              </div>
            ))}
          </ScrollableContent>
        )}
      </BookingWrapper>
    </>
  );
};

export default BookingTab;
