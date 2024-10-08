// GlobalStyles.js
import { createGlobalStyle } from "styled-components";
import "@fontsource/akaya-telivigala";
import "@fontsource/sora";

const GlobalStyles = createGlobalStyle`

  // *{
  //   outline: 1px solid red !important;
  // }

  *, *::before, *::after {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'sora', sans-serif !important;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

//   input:-webkit-autofill {
//   -webkit-box-shadow: 0 0 0 100px transparent inset !important; /* Change to your desired background */
//   -webkit-text-fill-color: #fff !important; /* Text color */
// }

// input:-webkit-autofill:hover, 
// input:-webkit-autofill:focus, 
// input:-webkit-autofill:active {
//   -webkit-box-shadow: 0 0 0 100px transparent inset !important; /* Same color for consistency */
//   -webkit-text-fill-color: #fff !important;
// }

`;

export default GlobalStyles;
