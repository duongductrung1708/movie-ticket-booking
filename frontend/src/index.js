import ReactDOM from "react-dom/client";
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import theme from './styles/Themes';
import GlobalStyles from "./styles/GlobalStyles";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
      <GlobalStyles />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </HelmetProvider>
);
