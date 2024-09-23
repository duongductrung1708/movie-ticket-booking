import "@fontsource/akaya-telivigala";
import "@fontsource/sora";

import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import {
  Breadcrumbs,
  Typography,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import YouTube from "react-youtube";
import Logo from "../components/Logo";
import Button from "../components/Button";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 85%;
  height: ${(props) => props.theme.navHeight};
  margin: 0 auto;

  .mobile {
    display: none;
  }

  @media (max-width: 64em) {
    .desktop {
      display: none;
    }
    .mobile {
      display: inline-block;
    }
  }
`;

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
`;

const AdditionalInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 0.5fr 2fr;
  grid-gap: 2rem;
  margin-top: 1.5rem;
  font-family: "Sora", sans-serif;
  font-size: 1.2rem;

  @media (max-width: 48em) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  margin-bottom: 0.5rem;
  font-family: "Sora", sans-serif;
  justify-content: space-between;
  display: flex;
  line-height: 2;
`;

const CastList = styled.div`
  margin-top: 2rem;
`;

const CastMember = styled.div`
  font-family: "Sora", sans-serif;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const Heading = styled.div`
  font-family: "Akaya Telivigala", cursive;
  color: orange;
  border-left: 2px solid orange;
  font-size: 1.3rem;
  padding-left: 0.5rem;
  margin-bottom: 0.5rem;
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

const BookingOptions = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5rem;
`;

const movies = [
  {
    title: "The Matrix",
    rating: "8.7",
    image:
      "https://play-lh.googleusercontent.com/zL8ya3uEa7Q-oDqc7McTIAaRvwKZNN4HMICMwHHL2eKsbE9Hms_2Dj6SWwNGI555CyauvPVjCPUzYBm2TJ8",
    trailer: "https://www.youtube.com/watch?v=xG0iRA37IjA",
    synopsis:
      "The Matrix official 25th anniversary trailer has finally been released! The iconic sci-fi movie, directed by the Wachowskis, originally premiered on March 31, 1999. To celebrate this milestone, Warner Bros. has unveiled a new trailer that takes a look back at the groundbreaking film's impact on popular culture. The trailer also nods to the franchise's enduring influence, highlighting key scenes and quotes from the original movie. Fans of the series can relive the nostalgia and excitement as they prepare for the next installment in the franchise.",
    director: "The Wachowskis",
    country: "USA",
    genre: "Action/Sci-Fi",
    releaseDate: "03/31/2024",
    duration: "136 minutes",
    ageRating: "R",
    cast: [
      "Keanu Reeves",
      "Carrie-Anne Moss",
      "Laurence Fishburne",
      "Hugo Weaving",
      "Gloria Foster",
    ],
  },
];

const MovieDetail = () => {
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

  const { title } = useParams();
  const movie = movies.find((m) => m.title === title);

  const filterTheatersByLogo = (theaterLogo) => {
    setSelectedTheaterLogo(theaterLogo.name);
    setFilteredTheaters(theaterLogo.theaters);
    setSelectedTheater("");
  };

  const opts = {
    height: "490",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <Section>
      <NavBar>
        <Logo />
        <div className="desktop">
          <Button text="My Account" link="https://google.com" />
        </div>
      </NavBar>
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
              <MoviePoster src={movie.image} alt={movie.title} />
              <VideoWrapper>
                <StyledYouTube
                  videoId={movie.trailer.split("v=")[1]}
                  opts={opts}
                />
              </VideoWrapper>
            </MovieInfoGrid>
            <AdditionalInfoGrid>
              <div>
                <MovieSynopsis>
                  <Heading>Content</Heading>
                  {movie.synopsis}
                </MovieSynopsis>
                <CastList>
                  <Heading>Cast</Heading>
                  {movie.cast.map((actor, index) => (
                    <CastMember key={index} variant="body1">
                      {actor}
                    </CastMember>
                  ))}
                </CastList>
              </div>
              <div></div>
              <div>
                <Heading>Details</Heading>
                <DetailItem variant="body1">
                  <strong>Director:</strong> {movie.director}
                </DetailItem>
                <DetailItem variant="body1">
                  <strong>Country:</strong> {movie.country}
                </DetailItem>
                <DetailItem variant="body1">
                  <strong>Genre:</strong> {movie.genre}
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
              </div>
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
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      setFilteredTheaters([]);
                      setSelectedTheaterLogo("");
                    }}
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
            </BookingOptions>
          </>
        ) : (
          <Typography variant="h5">Movie not found</Typography>
        )}
      </Container>
    </Section>
  );
};

export default MovieDetail;
