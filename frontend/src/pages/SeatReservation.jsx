import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Typography,
  Grid,
  Button,
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
  StepContent,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import ChairIcon from "@mui/icons-material/Chair";
import "@fontsource/akaya-telivigala";
import "@fontsource/sora";
import "../styles/StepperStyles.css";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

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
          // : "gray !important"
          : props.status === "available"
            ? "#45444433 !important" // Empty seat
            : props.status === "reserved"
              ? "orange !important" // Reserved seat
              : props.status === "occupied"
                ? "red !important" // Occupied seat
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
          // : "#ff8a8a !important"
          : props.status === "available"
            ? "#d0d0d0 !important" // Hover for available
            : props.status === "reserved"
              ? "#ffb300 !important" // Hover for reserved
              : props.status === "occupied"
                ? "#ff8a8a !important" // Occupied seats do not change much on hover
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

const Payment = styled.div`
  margin-top: 20rem;
`;

const Complete = styled.div`
  margin-top: 75rem;
`;

const Timer = styled.div`
  text-align: center;
  align-items: center;
`;

const PaymentMethod = styled.div`
  font-family: "Sora", sans-serif;
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const PayCounterBtn = styled.button`
  display: inline-block;
  background-color: gray;
  color: ${(props) => props.theme.body};
  outline: none;
  border: none;
  margin-top: 1rem;
  font-size: ${(props) => props.theme.fontlg};
  padding: 0.9rem 2.3rem;
  border-radius: 50px;
  cursor: pointer;
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
    border: 2px solid gray;
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

const PayBankBtn = styled.button`
  display: inline-block;
  background-color: orange;
  color: ${(props) => props.theme.body};
  outline: none;
  border: none;
  margin-top: 1rem;
  font-size: ${(props) => props.theme.fontlg};
  padding: 0.9rem 2.3rem;
  border-radius: 50px;
  cursor: pointer;
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
    border: 2px solid orange;
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

const BankImg = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const SeatReservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const seatSectionRef = useRef(null);
  const paymentSectionRef = useRef(null);
  const completeSectionRef = useRef(null);

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

  const steps = ["Select Seats", "Confirm Payment", "Complete"];
  const totalRows = seatLayout ? seatLayout.length : 0;
  const totalColumns = seatLayout ? seatLayout[0].length : 0;

  const [seats, setSeats] = useState(seatLayout || []);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const [timer, setTimer] = useState(600);
  const [timerActive, setTimerActive] = useState(false);

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
    if (activeStep === 0) {
      setSnackbarMessage("Please select your seats.");
      setOpenSnackbar(true);
    }
    if (timerActive && timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0) {
      handleTimeOut();
    }
  }, [activeStep, timer, timerActive, handleTimeOut]);

  const handleSeatSelect = (rowIndex, colIndex) => {
    if (activeStep !== 0 || !seats.length) return;

    const seat = seats[rowIndex][colIndex];
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

    if (activeStep === 0) {
      setActiveStep(activeStep + 1);
      paymentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimerActive(true);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setShowQRCode(method === "bank");

    setSnackbarMessage(
      `Payment method changed to ${method === "counter" ? "Pay at Counter" : "Pay with Bank Transfer"
      }`
    );
    setOpenSnackbar(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedPaymentMethod) {
      setSnackbarMessage("Please select a payment method.");
      setOpenSnackbar(true);
      return;
    }

    if (!agreeTerms) {
      setSnackbarMessage("You must agree to the terms of use.");
      setOpenSnackbar(true);
      return;
    }

    if (activeStep === 1) {
      setActiveStep(activeStep + 1);
      completeSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimerActive(true);
    }

    setActiveStep(activeStep + 1);
    setTimerActive(false);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setTimer(600);
    setTimerActive(false);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleBookingHistoryClick = () => {
    navigate("/booking-history");
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      <Box sx={{ mb: 2 }}>
                        <Button
                          disabled={
                            index === 0 || activeStep === steps.length - 1
                          }
                          onClick={handleBack}
                          color="warning"
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                        {activeStep === steps.length - 1 && (
                          <Paper square elevation={0} sx={{ p: 3 }}>
                            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                              Reset
                            </Button>
                          </Paper>
                        )}
                      </Box>
                    </StepContent>
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
                            activeStep !== 0 || seat?.status === "unavailable"
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

              <Btn
                onClick={handleSelectSeatButton}
                disabled={activeStep !== 0 && selectedSeats.length === 0}
              >
                Confirm Selection
              </Btn>
            </Box>
            <Box ref={paymentSectionRef}>
              {activeStep === 1 && (
                <Payment>
                  <Paper style={{ padding: "2rem", marginTop: "1rem" }}>
                    <Grid container spacing={4}>
                      <Grid item xs={2}>
                        <img
                          src={movieImage}
                          alt={movieTitle}
                          style={{
                            width: "100%",
                            height: "8rem",
                            borderRadius: "8px",
                            marginBottom: "1rem",
                          }}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="h5" fontWeight="bold">
                          {movieTitle}
                        </Typography>
                        <Typography>
                          Show date {selectedDate} | Showtime {selectedTime} |
                          Theater {selectedTheater} | Screening Room Room1 |
                          Selected Seats:{" "}
                          {selectedSeats.length > 0
                            ? selectedSeats
                                .map(
                                  (seat) => `R${seat.row + 1}C${seat.col + 1}`
                                )
                                .join(", ")
                            : ""}
                        </Typography>
                        <Typography>
                          Payment Method: {selectedPaymentMethod}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} style={{ paddingLeft: "2rem" }}>
                        <Typography
                          fontWeight="bold"
                          color="red"
                          fontSize="2rem"
                        >
                          {(selectedSeats.length * 100).toFixed(3)}đ
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                  <PaymentMethod
                    value={selectedPaymentMethod}
                    onChange={handlePaymentMethodChange}
                  >
                    <PayCounterBtn
                      variant={
                        selectedPaymentMethod === "counter"
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handlePaymentMethodChange("counter")}
                    >
                      Pay at Counter
                    </PayCounterBtn>
                    <PayBankBtn
                      variant={
                        selectedPaymentMethod === "bank"
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handlePaymentMethodChange("bank")}
                    >
                      Pay with Momo Transfer
                    </PayBankBtn>
                    <BankImg>
                      <img
                        width="5%"
                        src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Circle.png"
                        alt="momo"
                      />
                    </BankImg>
                  </PaymentMethod>
                  {showQRCode && (
                    <div>
                      <Typography variant="h6">Scan QR Code</Typography>
                      <QRCodeSVG value="YourPaymentURL" />
                    </div>
                  )}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                    }
                    label="I agree to the terms of use and tickets purchased are non-refundable."
                  />
                  <Btn onClick={handleConfirmPayment}>Confirm Payment</Btn>
                </Payment>
              )}
            </Box>
            <Box ref={completeSectionRef}>
              {activeStep === steps.length - 1 && (
                <Complete>
                  <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography
                      fontFamily="Akaya Telivigala, cursive"
                      fontWeight="bold"
                      fontSize="2rem"
                    >
                      <div>Thank you for using our service.</div>{" "}
                      <div>
                        Please check your email for the transaction results.
                      </div>{" "}
                      <div>Have a nice day, see you at the theater.</div>{" "}
                      <div>
                        If you want to check your transaction history, click the
                        button below.
                      </div>
                    </Typography>
                    <Btn onClick={handleBookingHistoryClick}>
                      Booking History
                    </Btn>
                  </Paper>
                </Complete>
              )}
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
