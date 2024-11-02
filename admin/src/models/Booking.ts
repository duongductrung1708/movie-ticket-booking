type BookingStatus = "processing" | "canceled" | "done";

export interface Booking {
  _id: string;                               // Unique identifier for the booking
  user: string;                              // User's email
  showtime: string;                          // Formatted date of the showtime (YYYY-MM-DD)
  start_time: string;                         // Format HH:mm
  end_time: string;                           // Format HH:mm
  seats: string;                           // seats
  room: string;                              // Room name
  amount: string;                              // amount
  movie: string;                             // Movie title
  theater: string;                           // Theater name
  timestamp: string;                         // Formatted timestamp (YYYY-MM-DD)
  status: BookingStatus; // Booking status
}
