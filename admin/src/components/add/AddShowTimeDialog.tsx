import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import DatePicker from "react-multi-date-picker";
import { getMovies } from "../../services/movieService";
import { getTheaters, getSchedule } from "../../services/theaterService";
import { getRoomByTheaterId } from "../../services/roomService";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box, Grid } from "@mui/material";
import { toast } from "react-toastify";
import "react-multi-date-picker/styles/layouts/mobile.css";
import ReactTooltip from "react-tooltip"; // Import react-tooltip
import { saveMultipleShowtimes } from "../../services/showtimeService";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const localizer = momentLocalizer(moment); // Calendar localizer

interface Movie {
  id: string;
  title: string;
}

interface Theater {
  id: string;
  name: string;
  rooms: Room[];
}

interface Room {
  _id: string;
  name: string;
  seatLayout: number[][];
  showtimes: string[];
}

interface Showtime {
  id: string;
  start_time: string;
  end_time: string;
}

interface AddShowtimeDialogProps {
  setShowtimesList: (showtimes: any) => void;
}

const AddShowtimeDialog: React.FC<AddShowtimeDialogProps> = ({
  setShowtimesList,
}) => {
  const [open, setOpen] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [rooms, setRooms] = useState<Room[] | null>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [events, setEvents] = useState([]); // State to store calendar events
  const [startHour, setStartHour] = useState<string>(""); // Start hour
  const [startMinute, setStartMinute] = useState<string>(""); // Start minute
  const [endHour, setEndHour] = useState<string>(""); // End hour
  const [endMinute, setEndMinute] = useState<string>(""); // End minute
  const [values, setValues] = useState([]); // Selected date ranges
  const [dateDisplay, setDateDisplay] = useState([]); // Display date ranges

  // Load movies and theaters when the dialog opens
  useEffect(() => {
    const fetchData = async () => {
      const moviesResponse = await getMovies();
      const theatersResponse = await getTheaters();

      const formattedMovies = moviesResponse.data.map((mv: any) => ({
        id: mv._id,
        title: mv.title,
      }));

      const formattedTheaters = theatersResponse.data.map((th: any) => ({
        id: th._id,
        name: th.name,
        rooms: th.rooms.map((roomId: string) => ({
          id: roomId,
        })),
      }));

      setMovies(formattedMovies);
      setTheaters(formattedTheaters);
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  // Fetch rooms when a theater is selected
  useEffect(() => {
    const fetchRoomsByTheaterId = async () => {
      if (selectedTheater) {
        const roomResponse = await getRoomByTheaterId(selectedTheater.id);
        setRooms(roomResponse);
      } else {
        setRooms([]);
      }
    };
    fetchRoomsByTheaterId();
  }, [selectedTheater]);

  // Fetch and display showtimes when a theater is selected
  useEffect(() => {
    const fetchShowtimes = async () => {
      if (selectedTheater) {
        const response = await getSchedule(selectedTheater.id);
        const showtimes = response.data.showtimes;

        // Format showtimes for the calendar
        const formattedEvents = showtimes.map((showtime) => {
          // Convert the date string and combine it with the startTime and endTime
          const startDateTime = moment(showtime.date)
            .set({
              hour: parseInt(showtime.startTime.split(":")[0]),
              minute: parseInt(showtime.startTime.split(":")[1]),
            })
            .toDate(); // Convert to JavaScript Date object

          const endDateTime = moment(showtime.date)
            .set({
              hour: parseInt(showtime.endTime.split(":")[0]),
              minute: parseInt(showtime.endTime.split(":")[1]),
            })
            .toDate(); // Convert to JavaScript Date object

          return {
            title: `${showtime.roomName} - ${showtime.movieTitle}`,
            start: startDateTime, // Combined start date and time
            end: endDateTime, // Combined end date and time
          };
        });

        setEvents(formattedEvents); // Update events for the calendar
      }
    };

    fetchShowtimes();
  }, [selectedTheater]);

  const handleDateChange = (newDates: any[]) => {
    setValues(newDates); // Update the state with the new dates
    let dateData = newDates.map((range) => {
      let startDate = new Date(range[0]).toLocaleDateString(); // Convert start timestamp to date
      let endDate = new Date(range[1]).toLocaleDateString(); // Convert end timestamp to date
      return `From ${startDate} to ${endDate}`; // Format the date range
    });
    setDateDisplay(dateData);
  };

  useEffect(()=>{
    
  },[values])

  const handleClose = () => {
    setSelectedMovie(null);
    setSelectedTheater(null);
    setSelectedRoom(null);
    setStartHour("");
    setStartMinute("");
    setEndHour("");
    setEndMinute("");
    setOpen(false);
    setEvents([]); // Clear calendar events on close
    setValues([]); // Clear selected dates
    setDateDisplay([]);
  };
  // Function to get all dates within a range
  function getAllDatesInRange(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates = [];

    while (startDate <= endDate) {
      dates.push(new Date(startDate).toISOString().split("T")[0]); // Format as 'YYYY-MM-DD'
      startDate.setDate(startDate.getDate() + 1); // Move to the next day
    }

    return dates;
  }
  const handleAddShowtime = async () => {
    const startTime = `${startHour}:${startMinute}`;
    const endTime = `${endHour}:${endMinute}`;
    const allDatesRanges = values.flatMap(([start, end]) => getAllDatesInRange(start, end));
    
    const data = {
      movieId: selectedMovie?.id,
      roomId: selectedRoom?._id,
      startTime,
      endTime,
      dates: allDatesRanges,
    };
    try {
      const response = await saveMultipleShowtimes(data);
      console.log(response);
      
    } catch (error) {
      console.error(error);

    }
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        style={{ fontWeight: "bold" }}
        color="primary"
        onClick={() => setOpen(true)}
      >
        Add Showtime
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
          variant="h6"
          style={{ fontWeight: "bold" }}
        >
          Add New Showtime
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography gutterBottom>
            Enter the details of the new showtime.
          </Typography>

          {/* Movie selection */}
          <Autocomplete
            options={movies}
            getOptionLabel={(option) => option.title}
            value={selectedMovie}
            onChange={(e, newValue) => setSelectedMovie(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Movie" margin="dense" />
            )}
          />

          {/* Theater selection */}
          <Autocomplete
            options={theaters}
            getOptionLabel={(option) => option.name}
            value={selectedTheater}
            onChange={(e, newValue) => {
              setSelectedTheater(newValue);
              setSelectedRoom(null); // Reset room selection when theater changes
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select Theater" margin="dense" />
            )}
          />

          {/* Room selection */}
          {rooms && rooms?.length > 0 && (
            <Autocomplete
              options={rooms}
              getOptionLabel={(option) => option.name}
              value={selectedRoom}
              onChange={(e, newValue) => setSelectedRoom(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Select Room" margin="dense" />
              )}
            />
          )}

          {/* DatePicker to select range of dates */}
          <DialogContent dividers>
            <Typography gutterBottom>Select Dates:</Typography>
            <DatePicker
              multiple
              range
              numberOfMonths={3}
              value={values}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              calendarPosition="bottom"
              className="rmdp-mobile"
              minDate={new Date()}
            />
            {/* Display the selected date ranges */}
            <Box sx={{ marginTop: "20px" }}>
              <Typography variant="h6" style={{ marginBottom: "10px" }}>
                Selected Date Ranges:
              </Typography>
              {dateDisplay ? (
                dateDisplay.map((range, index) => (
                  <Typography
                    key={index}
                    variant="body1"
                    color="textPrimary"
                    gutterBottom
                  >
                    {range}
                  </Typography>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No date ranges selected.
                </Typography>
              )}
            </Box>
          </DialogContent>

          {/* Time Input */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                Start Time:
              </Typography>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    label="HH"
                    type="number"
                    inputProps={{ min: 0, max: 23, maxLength: 2 }}
                    value={startHour}
                    onChange={(e: any) => setStartHour(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="h6">:</Typography>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="MM"
                    type="number"
                    inputProps={{ min: 0, max: 59, maxLength: 2 }}
                    value={startMinute}
                    onChange={(e: any) => setStartMinute(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                End Time:
              </Typography>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    label="HH"
                    type="number"
                    inputProps={{ min: 0, max: 23, maxLength: 2 }}
                    value={endHour}
                    onChange={(e: any) => setEndHour(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="h6">:</Typography>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="MM"
                    type="number"
                    inputProps={{ min: 0, max: 59, maxLength: 2 }}
                    value={endMinute}
                    onChange={(e: any) => setEndMinute(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Calendar will display only if a theater is selected */}
          {selectedTheater && (
            <div style={{ height: 500, marginTop: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Showtime Schedule for {selectedTheater?.name}
              </Typography>
              <Calendar
                localizer={localizer}
                events={events} // Pass showtimes as calendar events
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%", width: "100%" }}
                formats={{
                  timeGutterFormat: "h:mm A",
                  eventTimeRangeFormat: ({ start, end }) =>
                    `${moment(start).format("h:mm A")} - ${moment(end).format(
                      "h:mm A"
                    )}`,
                }}
                eventPropGetter={(event) => ({
                  "data-tip": `${event.title} from ${moment(event.start).format(
                    "h:mm A"
                  )} to ${moment(event.end).format("h:mm A")}`,
                  style: {
                    whiteSpace: "normal", // Allow text wrapping
                    fontSize: "12px", // Adjust font size for readability
                  },
                })}
              />
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" autoFocus onClick={handleAddShowtime}>
            Add Showtime
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default AddShowtimeDialog;
