import "@fontsource/akaya-telivigala";
import "@fontsource/sora";
import React, { useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import styled from "styled-components";
import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

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

const BookHistory = () => {
  const [bookings, setBookings] = useState([
    {
      serialNumber: 1,
      ticketCode: "ABC1234567",
      movieName: "Movie Title 1",
      showtime: "2024-09-30T19:00:00",
      theater: "Theater 1",
      price: 100,
      paymentStatus: "Paid",
    },
    {
      serialNumber: 2,
      ticketCode: "XYZ9876543",
      movieName: "Movie Title 2",
      showtime: "2024-10-01T20:00:00",
      theater: "Theater 2",
      price: 200,
      paymentStatus: "Counter",
    },
  ]);

  const handleRefresh = () => {
    setBookings((prevBookings) => [
      ...prevBookings,
      {
        serialNumber: prevBookings.length + 1,
        ticketCode: `NEWCODE${prevBookings.length + 1}`,
        movieName: `New Movie ${prevBookings.length + 1}`,
        showtime: new Date().toISOString(),
        theater: `New Theater ${prevBookings.length + 1}`,
        price: (Math.random() * 100 + 50).toFixed(2),
        paymentStatus: "Paid",
      },
    ]);
  };

  return (
    <Section>
      <Navigation />
      <Container>
        <BreadcrumbContainer>
          <StyledBreadcrumbs aria-label="breadcrumb">
            <BreadcrumbLink component={Link} to="/home">
              Home
            </BreadcrumbLink>
            <Typography color="textPrimary">Booking History</Typography>
          </StyledBreadcrumbs>
        </BreadcrumbContainer>
        <Typography variant="h4" align="center" gutterBottom>
          Booking History
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Serial Number</TableCell>
                <TableCell>Ticket Code</TableCell>
                <TableCell>Movie Name</TableCell>
                <TableCell>Showtime</TableCell>
                <TableCell>Theater</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Payment Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.serialNumber}>
                  <TableCell>{booking.serialNumber}</TableCell>
                  <TableCell>{booking.ticketCode}</TableCell>
                  <TableCell>{booking.movieName}</TableCell>
                  <TableCell>
                    {new Date(booking.showtime).toLocaleString()}
                  </TableCell>
                  <TableCell>{booking.theater}</TableCell>
                  <TableCell>{booking.price.toFixed(3)}đ</TableCell>
                  <TableCell>{booking.paymentStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container justifyContent="flex-end" marginTop={2}>
          <Btn variant="outlined" color="primary" onClick={handleRefresh}>
            Refresh
          </Btn>
        </Grid>
      </Container>
      <Footer />
    </Section>
  );
};

export default BookHistory;
