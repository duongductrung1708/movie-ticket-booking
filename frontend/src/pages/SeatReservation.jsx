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
import { createBooking, getAllServices } from "../services/api";
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
  font-size: 1.0rem;
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
const Reserved = styled.div`
  color: yellow;
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
    selectedRoom,
    showtime,
  } = location.state || {};

  const steps = ["Select Seats"];
  const totalRows = seatLayout ? seatLayout.length : 0;
  const totalColumns = seatLayout ? seatLayout[0].length : 0;
  const [total, setTotal] = useState(location.state.total || 0);

  const [seats, setSeats] = useState(seatLayout || []);
  const [selectedSeats, setSelectedSeats] = useState(location.state.selectedSeats || []);

  const [selectedServices, setSelectedService] = useState(location.state.selectedServices || [])

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
      setTotal(prev => prev + seat.price)
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
      setTotal(prev => prev - seat.price)
    }
  };
  console.log(seats);
  

  const handleSelectSeatButton = async () => {
    if (selectedSeats.length === 0) {
      setSnackbarMessage("Please select at least one seat before proceeding.");
      setOpenSnackbar(true);
      return;
    }
    
    const userId = JSON.parse(localStorage.getItem("user"))?._id;
    const seatIds = selectedSeats.map(seat => seatLayout[seat.row][seat.col]._id);
    const serviceIds = selectedServices.map(service => service._id + "*" + service.number)
    const orderInfo = userId + "-" + showtime + "-" + seatIds + "-" + serviceIds;
    
    // console.log(orderInfo);

    const booking =  await createBooking(userId, showtime, seatIds, serviceIds, "processing")
    console.log(booking);
    

    // navigate("/payment", {
    //   state: {
    //     movieTitle,
    //     movieImage,
    //     selectedSeats,
    //     selectedDate,
    //     selectedTime,
    //     selectedTheater,
    //     selectedRoom,
    //     seats,
    //     seatLayout,
    //     selectedTheaterAddress,
    //     duration,
    //     selectedServices,
    //     showtime,
    //   },
    // });
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

  const handleSelectedService = (service) => {
    const existedService = selectedServices.find((sv) => sv._id === service._id);
    if (!existedService) {
      service.number = 1;
      setSelectedService((prev) => [...prev, service]);
    } else {
      setSelectedService((prev) =>
        prev.map((s) =>
          s.id === service.id ? { ...s, number: s.number + 1 } : s
        )
      );
    }

    setTotal(prev => prev + service.price)
  }

  const handleDecreaseQuantity = (service) => {
    setSelectedService((prev) =>
      prev
        .map((s) =>
          s._id === service._id ? { ...s, number: s.number - 1 } : s
        )
        .filter(s => s.number > 0) // Remove the service if the number reaches 0
    );

    // Update the total price by subtracting the service's price
    setTotal(prev => prev - service.price);
  };

  const handleIncreaseQuantity = (service) => {
    setSelectedService((prev) =>
      prev.map((s) =>
        s._id === service._id ? { ...s, number: s.number + 1 } :
          s
      )
    );
    setTotal(prev => prev + service.price)
  }


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
                <Grid container item justifyContent="center" spacing={0}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    marginRight="10px"
                    height="100%" // Adjust this to the specific height you need
                  >
                    <Typography variant="h6" color="white">
                      <strong>A</strong> {/* Row letters (A, B, C, ...) */}
                    </Typography>
                  </Box>
                  {seats[0].map((_, colIndex) => (
                    <Grid key={`colLabel-${colIndex}`} containeritem justifyContent="center">
                      <Typography variant="h6" width="50px" textAlign="center"><strong>{colIndex + 1}</strong></Typography> {/* Column numbers (1, 2, 3, ...) */}
                    </Grid>
                  ))}
                </Grid>
                {seats.map((row, rowIndex) => (
                  <Grid container item key={rowIndex} justifyContent="center">
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      marginRight="10px"
                      height="100%" // Adjust this to the specific height you need
                    >
                      <Typography variant="h6">
                        <strong>{String.fromCharCode(65 + rowIndex)}</strong> {/* Row letters (A, B, C, ...) */}
                      </Typography>
                    </Box>
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
                          {seat?.status === "reserved" && (seat?.type === "vip" || seat?.type === "standard") && (
                            <Reserved>
                              <ChairIcon />
                            </Reserved>
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
                <Reserved>
                  <ChairIcon />
                  <div>Reserved</div>
                </Reserved>
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

              <Slider {...settings} style={{ marginTop: "3rem" }}>
                {services.map((service) => {
                  // Find if the service is already in the selectedService array
                  const selected = selectedServices.find((s) => s._id === service._id);

                  return (
                    <Box key={service.id} style={{ padding: "1rem" }}>
                      <img
                        src={service.image}
                        alt={service.name}
                        style={{ width: "80%", borderRadius: "8px" }}
                      />
                      <Heading>{service.name}</Heading>
                      <Content variant="body1">{service.description}</Content>
                      <Price>
                        <strong>Price:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price * 1000)}
                      </Price>
                      {selected && selected.number > 0 ? (
                        // If the service is selected, display the decrement button, the number, and the increment button
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDecreaseQuantity(service)}
                          >
                            -
                          </Button>
                          <span style={{ margin: "0 1rem" }}>{selected.number}</span>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleIncreaseQuantity(service)}
                          >
                            +
                          </Button>
                        </div>
                      ) : (
                        // If the service is not selected yet, show the "Add to Cart" button
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSelectedService(service)}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </Box>
                  );
                })}
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
              <Content variant="body1">{selectedRoom}</Content>
              <Heading>Time :</Heading>
              <Content variant="body1">
                {selectedTime} on {selectedDate}
              </Content>
              <div>
                <Heading>Selected Seats :</Heading>
                <Content variant="body1">
                  {selectedSeats.length > 0
                    ? selectedSeats
                      .map((seat) => {
                        const rowLetter = String.fromCharCode(65 + seat.row); // Converts row index to a letter (A, B, C, etc.)
                        return `${rowLetter}${seat.col + 1}`; // Combines row letter with column number
                      })
                      .join(", ")
                    : ""}
                </Content>
              </div>
              <Heading>Total Price :</Heading>
              <Price>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                  .format(total * 1000)}
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
    </Section >
  );
};

export default SeatReservation;
