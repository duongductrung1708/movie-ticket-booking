import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import theme from "./styles/Themes";
import GlobalStyles from "./styles/GlobalStyles";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <GoogleOAuthProvider clientId="1006459107667-to4b8vr8fi14ik4ghhvo7hh484gk3eja.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
        ;
      </ThemeProvider>
    </BrowserRouter>
  </HelmetProvider>
);
