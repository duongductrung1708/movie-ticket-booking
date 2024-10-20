const url = "http://localhost:8080/api/";
const PAGE_SIZE = 10;
const ROLE = {
  CUSTOMER: "customer",
  STAFF: "staff",
};
const GENDER = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
};
const SHOWTIME_STATUS = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  OCCUPIED: "Occupied",
};

const MONTHS = [
  "January",   // Index 0
  "February",  // Index 1
  "March",     // Index 2
  "April",     // Index 3
  "May",       // Index 4
  "June",      // Index 5
  "July",      // Index 6
  "August",    // Index 7
  "September", // Index 8
  "October",   // Index 9
  "November",  // Index 10
  "December",  // Index 11
];


const constants = {
  url,
  PAGE_SIZE,
  ROLE,
  GENDER,
  MONTHS,
  SHOWTIME_STATUS,
};

export default constants;
