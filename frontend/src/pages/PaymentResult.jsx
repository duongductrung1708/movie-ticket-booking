import { useLocation } from "react-router-dom";
import styled from "styled-components";
import GlobalStyles from "../styles/GlobalStyles";
import light from "../styles/Themes";
import { ThemeProvider } from "styled-components";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const StyledBookingResult = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 50px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;

  h1 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    font-size: 28px;
  }

  p {
    margin: 10px 0;
    font-size: 18px;
    line-height: 1.6;
    color: #555;

    strong {
      color: #333;
    }
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

export default function BookingResult() {
    const location = useLocation();

    // Extract query parameters from URL
    const queryParams = new URLSearchParams(location.search);

    // Get individual parameters
    const partnerCode = queryParams.get("partnerCode");
    const orderId = queryParams.get("orderId");
    const requestId = queryParams.get("requestId");
    const amount = queryParams.get("amount");
    const transId = queryParams.get("transId");
    const message = queryParams.get("message");
    const payType = queryParams.get("payType");
    const handleBookingHistory = ()=>{
        window.location.href = "/booking-history";
    }

    return (
        <>
            <GlobalStyles />
            <ThemeProvider theme={light}>
                <Navigation />
                <StyledBookingResult>
                    <h1>Booking Result</h1>
                    <p><strong>Partner Code:</strong> {partnerCode}</p>
                    <p><strong>Order ID:</strong> {orderId}</p>
                    <p><strong>Request ID:</strong> {requestId}</p>
                    <p><strong>Transaction ID:</strong> {transId}</p>
                    <p><strong>Amount: </strong>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                            .format(amount)}</p>
                    <p><strong>Message:</strong> {message}</p>
                    <p><strong>Payment Type:</strong> {payType}</p>
                    <Btn onClick={handleBookingHistory}>Booking History</Btn>
                    <p>Your order is ready check your mail and booking history</p>
                </StyledBookingResult>
                <Footer />
            </ThemeProvider>
        </>
    )
};
