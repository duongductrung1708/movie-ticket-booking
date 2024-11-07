import React, { useState } from "react";
import "@fontsource/akaya-telivigala";
import "@fontsource/sora";
import {
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Breadcrumbs,
  Link as MuiLink,
  Grid,
} from "@mui/material";
import { styled } from "styled-components";
import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { createContact, getAllTheater } from "../services/api";

const Section = styled.section`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  width: 100vw;
  position: relative;
  background-color: ${(props) => props.theme.body};
`;

const Container = styled.div`
  width: 50%;
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

const Title = styled.div`
  font-family: "Akaya Telivigala", cursive;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const SubContent = styled(Box)`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;

const ServiceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 50%;
`;

const ServiceItem = styled.li`
  font-family: "Sora", sans-serif;
  text-transform: uppercase;
  margin-bottom: 10px;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) => (props.active ? "#f5f5f5" : "transparent")};
`;

const ServiceContent = styled(Box)`
  font-family: "Sora", sans-serif;
  width: 50%;
  padding-left: 20px;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: opacity 0.5s ease-in-out, max-height 0.5s ease-in-out;

  &.active {
    opacity: 1;
    max-height: 100vh;
  }
`;

const ContactForm = styled(Box)`
  font-family: "Sora", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 30px;
  width: 100%;
`;

const StyledButton = styled.button`
  display: inline-block;
  background-color: ${(props) => props.theme.text};
  color: ${(props) => props.theme.body};
  outline: none;
  border: none;
  margin: 1rem;
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

const ContactPage = () => {
  const [selectedService, setSelectedService] = useState("");
  const [area, setSelectedArea] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [theaters, setTheaters] = useState([]);

  const handleServiceChange = (event) => setSelectedService(event.target.value);
  const handleAreaChange = (event) => {
    setSelectedArea(event.target.value);
    fetchTheatersByArea(event.target.value);
  };
  const handleTheaterChange = (event) => setSelectedTheater(event.target.value);

  const fetchTheatersByArea = async (area) => {
    if (area) {
      try {
        const theatersData = await getAllTheater();
        const filtered = theatersData.filter(
          (theater) => theater.city === area
        );
        setTheaters(filtered);
      } catch (error) {
        console.error("Error fetching theaters:", error);
      }
    } else {
      setTheaters([]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const contactData = {
      fullName,
      phoneNumber,
      email,
      service: selectedService,
      area,
      theater: selectedTheater,
      details,
    };

    try {
      const response = await createContact(contactData);
      alert("Your message has been sent successfully!");
      console.log(response);
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("There was an error sending your message. Please try again later.");
    }
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
            <Typography color="textPrimary">Contact</Typography>
          </StyledBreadcrumbs>
        </BreadcrumbContainer>
        <Title>
          CONTACT FOR ADVERTISING AT THEATRE / BUY GROUP TICKETS / RENT THEATRE
          FOR EVENTS
        </Title>
        <SubContent>
          <ServiceList>
            {[
              "buy group tickets",
              "rent theaters for events",
              "advertise at theaters",
            ].map((service, index) => (
              <ServiceItem
                key={index}
                active={selectedService === service}
                onClick={() => setSelectedService(service)}
              >
                {service}
              </ServiceItem>
            ))}
          </ServiceList>
          <ServiceContent className={selectedService ? "active" : ""}>
            <Typography>
              {selectedService === "buy group tickets" &&
                "Applicable for groups of 20 or more, high discounts apply for long-term contracts of the enterprise. Activities to strengthen the collective spirit, helping members get closer together. Contact K.Cinema immediately to experience the service: booking as desired, group discounts, support in arranging movies and showtimes to suit your needs and schedule. Apply incentives for groups of students. For advice, please leave your information below or inbox fanpage K.Cinema. We will contact you as soon as possible."}
              {selectedService === "rent theaters for events" &&
                "Luxurious space, separate screening room, superior image and sound, LOTTE Cinema provides a classy location to organize product launch events, company meetings, customer conferences ... Support the theater lobby to welcome guests, take red carpet photos, interact with the media on site. With a lot of experience in organizing press conferences to launch movies, launch MVs ... K.Cinema will help you bring your products closer to the public. Contact for consultation, please leave your information below or inbox Lotte Cinema fanpage. We will contact you as soon as possible."}
              {selectedService === "advertise at theaters" &&
                "Reach a large number of moviegoers at the cinema through multi-channel advertising marketing at the cinema. K.Cinema provides on-site communication solutions, online advertising to help brands get closer to viewers. Advertising on huge screens, vivid sound in the cinema before each movie show. Advertising on large to very large LED screens in the cinema lobby, with dozens of cinema locations nationwide and hundreds of display screens. Advertising on printed products, displayed at the cinema to reach potential customers. Advertising directly to each moviegoer at the cinema with sms, service messages, hand-delivered gift vouchers ...Advertising on the cinema's online information channels with millions of visits to book movie tickets every month. Contact directly Hotline: 0334230359 or email to trungyna2003@gmail.com"}
            </Typography>
          </ServiceContent>
        </SubContent>
        <ContactForm>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Full Name"
                placeholder="Enter full name"
                variant="outlined"
                fullWidth
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                placeholder="Enter phone number"
                variant="outlined"
                fullWidth
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                placeholder="Enter email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select service</InputLabel>
                <Select value={selectedService} onChange={handleServiceChange}>
                  <MenuItem value="buy group tickets">
                    Buy Group Tickets
                  </MenuItem>
                  <MenuItem value="rent theaters for events">
                    Rent Theaters for Events
                  </MenuItem>
                  <MenuItem value="advertise at theaters">
                    Advertise at Theaters
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select Area</InputLabel>
                <Select value={area} onChange={handleAreaChange}>
                  <MenuItem value="Hanoi">Hanoi</MenuItem>
                  <MenuItem value="HCMC">HCMC</MenuItem>
                  <MenuItem value="Da Nang">Da Nang</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select Theater</InputLabel>
                <Select value={selectedTheater} onChange={handleTheaterChange}>
                  {theaters.map((theater) => (
                    <MenuItem key={theater._id} value={theater._id}>
                      {theater.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Details"
                placeholder="Enter any additional details"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </Grid>
          </Grid>
          <StyledButton onClick={handleSubmit}>Submit</StyledButton>
        </ContactForm>
      </Container>
      <Footer />
    </Section>
  );
};

export default ContactPage;
