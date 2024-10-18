import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  Breadcrumbs,
  Link as MuiLink,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
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
  background-color: gray;
  color: #fff;
  margin-top: 1rem;
  font-size: 1rem;
  padding: 0.9rem 2.3rem;
  border-radius: 50px;
  cursor: pointer;
  &:hover {
    transform: scale(0.9);
  }
`;

const PayBankBtn = styled.button`
  background-color: orange;
  color: #fff;
  margin-top: 1rem;
  font-size: 1rem;
  padding: 0.9rem 2.3rem;
  border-radius: 50px;
  cursor: pointer;
  &:hover {
    transform: scale(0.9);
  }
`;

const BankImg = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
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

const Complete = styled.div`
  margin-top: 75rem;
`;

const PaymentPage = () => {
  const location = useLocation();
  const {
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
    selectedServices,
    selectedRoom,
  } = location.state || {};
  console.log(selectedSeats);

  const navigate = useNavigate();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const paymentSectionRef = useRef(null);
  const completeSectionRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Payment", "Complete"];
  const [total, setTotal] = useState(0);

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setShowQRCode(method === "bank");
  };

  const handleBackToSeatReservation = () => {
    navigate("/seat-reservation", {
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
        total,
        selectedServices,
        selectedRoom,
      },
    });
  };

  const handleConfirmPayment = () => {
    if (!agreeTerms || !selectedPaymentMethod) {
      toast.warning("Please agree to the terms and select a payment method.");
      return;
    }

    setActiveStep(1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleBookingHistoryClick = () => {
    navigate("/booking-history");
  };

  useEffect(() => {
    if (activeStep === 0 && paymentSectionRef.current) {
      paymentSectionRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (activeStep === 1 && completeSectionRef.current) {
      completeSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeStep]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const totalService = selectedServices.reduce((total, service) => total + service.price * service.number, 0);
    const totalSeat = selectedSeats
      .reduce(
        (total, seat) =>
          total + seats[seat.row][seat.col].price,
        0
      )
    setTotal(prev => prev + totalService + totalSeat)
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
            <BreadcrumbLink component={Link} to="/seat-reservation">
              Booking
            </BreadcrumbLink>
            <Typography color="textPrimary">Payment</Typography>
          </StyledBreadcrumbs>
        </BreadcrumbContainer>
        <Box>
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
                              <Button
                                onClick={handleReset}
                                sx={{ mt: 1, mr: 1 }}
                              >
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
            <Grid item xs={11}>
              {activeStep === 0 && (
                <Paper
                  style={{ padding: "2rem", marginTop: "1rem" }}
                  ref={paymentSectionRef}
                >
                  <Grid container spacing={4}>
                    <Grid item xs={2}>
                      <img
                        src={movieImage}
                        alt={movieTitle}
                        style={{
                          width: "100%",
                          height: "12rem",
                          borderRadius: "8px",
                          marginBottom: "1rem",
                        }}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="h3" fontWeight="bold">
                        {movieTitle}
                      </Typography>
                      <Typography>
                        <strong>Show date:</strong> {selectedDate}
                      </Typography>
                      <Typography>
                        <strong>Showtime:</strong> {selectedTime}
                      </Typography>
                      <Typography>
                        <strong>Theater:</strong> {selectedTheater}
                      </Typography>
                      <Typography>
                        <strong>Room:</strong> {selectedRoom}
                      </Typography>
                      <Typography>
                        <strong>Selected Seats:</strong>{" "}
                        {selectedSeats.length > 0
                          ? selectedSeats
                            .map((seat) => `R${seat.row + 1}C${seat.col + 1}`)
                            .join(", ")
                          : ""}
                      </Typography>
                      <Typography>
                        {selectedServices.length > 0
                          ? <>
                            <strong>Selected Service:</strong>
                            {" "}
                            {selectedServices
                              .map((service) => {
                                return service.name + " x " + service.number; // Combines row letter with column number
                              })
                              .join(", ")
                            }
                          </>
                          : ""}
                      </Typography>
                      <Typography>
                        <strong>Payment Method:{" "}</strong>
                        {selectedPaymentMethod || "None selected"}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} style={{ paddingLeft: "2rem" }}>
                      <Typography fontWeight="bold" color="red" fontSize="2rem">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total * 1000)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {activeStep === 0 && (
                <PaymentMethod>
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
                  {showQRCode && (
                    <div>
                      <Typography variant="h6">Scan QR Code</Typography>
                      <QRCodeSVG value="YourPaymentURL" />
                    </div>
                  )}
                </PaymentMethod>
              )}

              {activeStep === 0 && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                  }
                  label={
                    <span>
                      I agree to the{" "}
                      <Link
                        to="#"
                        style={{ color: "orange", textDecoration: "none" }}
                      >
                        terms and conditions
                      </Link>
                    </span>
                  }
                />
              )}

              {activeStep === 0 && (
                <Btn onClick={handleConfirmPayment}>Confirm Payment</Btn>
              )}

              <Btn onClick={handleBackToSeatReservation}>Back to Booking</Btn>

              {activeStep === 1 && (
                <Complete ref={completeSectionRef}>
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
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
      <ToastContainer />
    </Section>
  );
};

export default PaymentPage;
