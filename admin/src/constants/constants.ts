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

const constants = {
  url,
  PAGE_SIZE,
  ROLE,
  GENDER,
  SHOWTIME_STATUS,
};

export default constants;
