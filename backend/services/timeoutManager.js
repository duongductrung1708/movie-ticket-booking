// timeoutManager.js
const bookingTimeouts = {}; // Object to store timeouts

// Set a timeout for a booking
const setBookingTimeout = (bookingId, timeoutCallback, delay) => {
  const timeoutId = setTimeout(timeoutCallback, delay);
  bookingTimeouts[bookingId] = timeoutId;
};

// Clear the timeout when the booking is confirmed
const clearBookingTimeout = (bookingId) => {
  if (bookingTimeouts[bookingId]) {
    clearTimeout(bookingTimeouts[bookingId]);
    delete bookingTimeouts[bookingId]; // Remove it from the object
  }
};

module.exports = {
  setBookingTimeout,
  clearBookingTimeout,
};
