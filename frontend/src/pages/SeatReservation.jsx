import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Typography,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  Snackbar,
  SnackbarContent,
  Box,
  Button,
} from "@mui/material";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ChairIcon from "@mui/icons-material/Chair";
import "@fontsource/akaya-telivigala";
import "@fontsource/sora";
import "../styles/StepperStyles.css";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { getAllServices } from "../services/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

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

const StepContainer = styled.div`
  margin-bottom: 2rem;
  height: 100%;
`;

const SeatGrid = styled(Grid)`
  margin-bottom: 2rem;
`;

const SeatButton = styled(IconButton)`
  color: ${(props) =>
    props.type === "empty"
      ? "#45444433 !important"
      : props.type === "vip"
        ? "blue !important"
        : props.type === "selected"
          ? "orange !important"
          : props.status === "available"
            ? "#45444433 !important"
            : props.status === "reserved"
              ? "orange !important"
              : props.status === "occupied"
                ? "red !important"
                : "gray !important"};
  border-radius: 5px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${(props) =>
    props.type === "empty"
      ? "#d0d0d0 !important"
      : props.type === "vip"
        ? "#ffb300 !important"
        : props.type === "selected"
          ? "#45444433 !important"
          : props.status === "available"
            ? "#d0d0d0 !important"
            : props.status === "reserved"
              ? "#ffb300 !important"
              : props.status === "occupied"
                ? "#ff8a8a !important"
                : "#ff8a8a !important"};
  }
`;

const MovieInfo = styled(Paper)`
  padding: 1rem;
  margin-left: 2rem;
`;

const Section = styled.section`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  width: 100vw;
  position: relative;
  background-color: ${(props) => props.theme.body};
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

const Heading = styled.div`
  font-family: "Akaya Telivigala", cursive;
  color: gray;
  font-size: 1.3rem;
  margin-top: 1.5rem;
`;

const Content = styled.div`
  font-family: "Sora", sans-serif;
  font-weight: bold;
  font-size: 1rem;
`;

const Price = styled.div`
  font-family: "Sora", sans-serif;
  font-weight: bold;
  font-size: 1.5rem;
  color: red;
`;

const SeatType = styled.div`
  font-family: "Sora", sans-serif;
  font-weight: bold;
  font-size: 1rem;
  display: flex;
  align-items: center;
  text-align: center;
  margin-top: 3rem;
  justify-content: space-around;
`;

const Empty = styled.div`
  color: #45444433;
`;

const Vip = styled.div`
  color: blue;
`;

const Selecting = styled.div`
  color: orange;
`;

const Occupied = styled.div`
  color: gray;
`;

const Btn = styled.button`
  display: inline-block;
  background-color: ${(props) => props.theme.text};
  color: ${(props) => props.theme.body};
  outline: none;
  border: none;
  margin-top: 3rem;
  margin-right: 2rem;
  font-size: ${(props) => props.theme.fontsm};
  padding: 0.9rem 2.3rem;
  border-radius: 50px;
  cursor: pointer;
  float: right;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(0.9);
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    border: 2px solid ${(props) => props.theme.text};
    width: 100%;
    height: 100%;
    border-radius: 50px;
    transition: all 0.2s ease;
  }

  &:hover::after {
    transform: translate(-50%, -50%) scale(1);
    padding: 0.3rem;
  }
`;

const ArcScreen = styled.svg`
  width: 100%;
  height: 100px;
  z-index: -1;
  margin-top: 1.5rem;
  margin-bottom: 4rem;
`;

const Timer = styled.div`
  text-align: center;
  align-items: center;
`;

const SeatReservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const seatSectionRef = useRef(null);

  const {
    movieTitle,
    movieImage,
    selectedTime,
    selectedDate,
    selectedTheater,
    selectedTheaterAddress,
    duration,
    seatLayout,
  } = location.state || {};
  console.log(seatLayout);

  const steps = ["Select Seats"];
  const totalRows = seatLayout ? seatLayout.length : 0;
  const totalColumns = seatLayout ? seatLayout[0].length : 0;

  const [seats, setSeats] = useState(seatLayout || []);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [timer, setTimer] = useState(600);
  const [timerActive, setTimerActive] = useState(false);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleTimeOut = useCallback(() => {
    setSeats(
      Array.from({ length: totalRows }, () =>
        Array.from({ length: totalColumns }, () => "empty")
      )
    );
    setSelectedSeats([]);
    setSnackbarMessage("Time is up! Your selected seats have been released.");
    setOpenSnackbar(true);
    setTimerActive(false);
  }, [totalRows, totalColumns]);

  useEffect(() => {
    if (timerActive && timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0) {
      handleTimeOut();
    }
  }, [timer, timerActive, handleTimeOut]);

  const handleSeatSelect = (rowIndex, colIndex) => {
    const seat = seats[rowIndex][colIndex];
  
    if (!seat) {
      console.error(`Seat at row ${rowIndex} and column ${colIndex} is undefined or null.`);
      return;
    }
  
    if (seat.status === "available") {
      if (selectedSeats.length >= 8) {
        setSnackbarMessage("You can select a maximum of 8 seats.");
        setOpenSnackbar(true);
        return;
      }
  
      const newSeats = [...seats];
      newSeats[rowIndex][colIndex] = {
        ...seat,
        status: "selected",
      };
      setSeats(newSeats);
      setSelectedSeats([...selectedSeats, { row: rowIndex, col: colIndex }]);
    } else if (seat.status === "selected") {
      const newSeats = [...seats];
      newSeats[rowIndex][colIndex] = {
        ...seat,
        status: "available",
      };
      setSeats(newSeats);
      setSelectedSeats(
        selectedSeats.filter(
          (selectedSeat) =>
            selectedSeat.row !== rowIndex || selectedSeat.col !== colIndex
        )
      );
    }
  };  

  const handleSelectSeatButton = () => {
    if (selectedSeats.length === 0) {
      setSnackbarMessage("Please select at least one seat before proceeding.");
      setOpenSnackbar(true);
      return;
    }

    navigate("/payment", {
      state: {
        movieTitle,
        movieImage,
        selectedSeats,
        selectedDate,
        selectedTime,
        selectedTheater,
        seats,
        seatLayout,
        selectedTheaterAddress,
        duration,
      },
    });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Section>
      <Navigation />
      <Container>
        <BreadcrumbContainer>
          <StyledBreadcrumbs aria-label="breadcrumb">
            <BreadcrumbLink component={Link} to="/home">
              Home
            </BreadcrumbLink>
            <Typography color="textPrimary">Booking</Typography>
          </StyledBreadcrumbs>
        </BreadcrumbContainer>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <StepContainer>
              <Stepper orientation="vertical">
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </StepContainer>
          </Grid>
          <Grid item xs={8}>
            <Box ref={seatSectionRef}>
              <Timer>
                {timerActive && (
                  <Typography color="orange" fontSize="1.5rem">
                    <Typography variant="h6" color="gray">
                      Seat holding time
                    </Typography>
                    {formatTime(timer)}
                  </Typography>
                )}
              </Timer>
              <Heading>Max seat: 8</Heading>
              <ArcScreen viewBox="0 0 800 100">
                <path
                  d="M 100,100 Q 400,0 700,100"
                  fill="none"
                  stroke="gray"
                  strokeWidth="4"
                  filter="url(#shadow)"
                />
                <text
                  x="400"
                  y="90"
                  textAnchor="middle"
                  fontFamily="Sora, sans-serif"
                  fontSize="24"
                  fill="black"
                  fontWeight="bold"
                >
                  Screen
                </text>
              </ArcScreen>
              <SeatGrid container spacing={0}>
                {seats.map((row, rowIndex) => (
                  <Grid container item key={rowIndex} justifyContent="center">
                    {row.map((seat, colIndex) => (
                      <Grid item key={`${rowIndex}-${colIndex}`}>
                        <SeatButton
                          type={seat?.status}
                          onClick={() => handleSeatSelect(rowIndex, colIndex)}
                          disabled={
                            seat?.status === "unavailable"
                          }
                        >
                          {seat?.status === "available" && seat?.type === "standard" && (
                            <Empty>
                              <ChairIcon />
                            </Empty>
                          )}
                          {seat?.status === "available" && seat?.type === "vip" && (
                            <Vip>
                              <ChairIcon />
                            </Vip>
                          )}
                          {seat?.status === "selected" && (seat?.type === "vip" || seat?.type === "standard") && (
                            <Selecting>
                              <ChairIcon />
                            </Selecting>
                          )}
                          {seat?.status === "occupied" && (seat?.type === "vip" || seat?.type === "standard") && (
                            <Selecting>
                              <ChairIcon />
                            </Selecting>
                          )}

                        </SeatButton>
                      </Grid>
                    ))}
                  </Grid>
                ))}
              </SeatGrid>

              <SeatType>
                <Empty>
                  <ChairIcon />
                  <div>Empty</div>
                </Empty>
                <Vip>
                  <ChairIcon />
                  <div>Vip</div>
                </Vip>
                <Selecting>
                  <ChairIcon />
                  <div>Selecting</div>
                </Selecting>
                <Occupied>
                  <ChairIcon />
                  <div>Occupied</div>
                </Occupied>
              </SeatType>

              <Slider {...settings} style={{marginTop: "3rem"}}>
                {services.map((service, index) => (
                  <Box key={index} style={{ padding: "1rem" }}>
                    <img
                      src={service.image}
                      alt={service.name}
                      style={{ width: "80%", borderRadius: "8px" }}
                    />
                    <Heading>{service.name}</Heading>
                    <Content variant="body1">{service.description}</Content>
                    <Price>
                      <strong>Price:</strong> {service.price}đ
                    </Price>
                    <Button variant="contained" color="primary">
                      Add to Cart
                    </Button>
                  </Box>
                ))}
              </Slider>

              <Btn onClick={handleSelectSeatButton}>Confirm Selection</Btn>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <MovieInfo>
              <div>
                <img
                  src={movieImage}
                  alt={`${movieTitle} poster`}
                  style={{
                    width: "100%",
                    height: "20rem",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                  }}
                />
              </div>
              <div>
                <Heading>Title :</Heading>
                <Content variant="body1">{movieTitle}</Content>
              </div>
              <div>
                <Heading>Duration :</Heading>
                <Content variant="body1">{duration}</Content>
              </div>
              <div>
                <Heading>Theater :</Heading>
                <Content variant="body1">{selectedTheater}</Content>
              </div>
              <div>
                <Heading>Address :</Heading>
                <Content variant="body1">{selectedTheaterAddress}</Content>
              </div>
              <Heading>Screening Room :</Heading>
              <Content variant="body1">Room 1</Content>
              <Heading>Time :</Heading>
              <Content variant="body1">
                {selectedTime} on {selectedDate}
              </Content>
              <div>
                <Heading>Selected Seats :</Heading>
                <Content variant="body1">
                  {selectedSeats.length > 0
                    ? selectedSeats
                        .map((seat) => `R${seat.row + 1}C${seat.col + 1}`)
                        .join(", ")
                    : ""}
                </Content>
              </div>
              <Heading>Total Price :</Heading>
              <Price>
                {selectedSeats
                  .reduce((total, seat) => {
                    const { row, col } = seat;
                    return total + seats[row][col].price;
                  }, 0)
                  .toFixed(3)}
                đ
              </Price>
            </MovieInfo>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <SnackbarContent
          message={snackbarMessage}
          onClose={() => setOpenSnackbar(false)}
          style={{ backgroundColor: "orange" }}
        />
      </Snackbar>
      <Footer />
    </Section>
  );
};

export default SeatReservation;
