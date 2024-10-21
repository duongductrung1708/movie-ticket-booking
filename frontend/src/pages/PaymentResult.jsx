import { Breadcrumbs, Paper, Typography, Link as MuiLink } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

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

const Complete = styled.div`
  margin-top: 10rem;
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

export default function BookingResult() {
  const navigate = useNavigate();

  const handleBookingHistoryClick = () => {
    navigate("/booking-history");
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
            <Typography color="textPrimary">Succeed</Typography>
          </StyledBreadcrumbs>
        </BreadcrumbContainer>
        <Complete>
          <Paper square elevation={0} sx={{ p: 3, textAlign: "center" }}>
            <Typography
              fontFamily="Akaya Telivigala, cursive"
              fontWeight="bold"
              fontSize="2rem"
            >
              <div>Thank you for using our service.</div>
              <div>Please check your email for the transaction results.</div>
              <div>Have a nice day, see you at the theater.</div>
              <div>
                If you want to check your transaction history, click the button
                below.
              </div>
            </Typography>
            <Btn
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={handleBookingHistoryClick}
            >
              Booking History
            </Btn>
          </Paper>
        </Complete>
      </Container>
      <Footer />
    </Section>
  );
}
