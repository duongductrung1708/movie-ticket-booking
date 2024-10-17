import * as React from "react";
import { useState, useEffect, useRef } from "react";
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
import Grid from "@mui/material/Grid";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getMovies } from "../../services/movieService";
import { getTheaters } from "../../services/theaterService";
import { getRoomByTheaterId } from "../../services/roomService";
import {
  getShowtimesByRoom,
  saveShowtime,
} from "../../services/showtimeService";
import { Box, Grid2 } from "@mui/material";
import { toast } from "react-toastify";
import { dateFormat } from "../../services/formatService";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

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
  showtimes: string[]; // Array of existing showtimes for this room
}
interface Showtime {
  id: string;
  start_time: string;
  end_time: string;
}

interface AddShowtimeDialogProps {
  //set showtimes
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
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // Date state
  const [showtimes, setShowtimes] = useState<Showtime[] | null>(null);
  const [startHour, setStartHour] = useState<string>(""); // Start hour
  const [startMinute, setStartMinute] = useState<string>(""); // Start minute
  const [endHour, setEndHour] = useState<string>(""); // End hour
  const [endMinute, setEndMinute] = useState<string>(""); // End minute

  // Refs for input fields to control focus
  const startMinuteRef = useRef<HTMLInputElement>(null);
  const endHourRef = useRef<HTMLInputElement>(null);
  const endMinuteRef = useRef<HTMLInputElement>(null);

  // Load movies and theaters when the dialog opens
  useEffect(() => {
    const fetchData = async () => {
      const moviesResponse = await getMovies();
      const theatersResponse = await getTheaters();

      const formattedMovie = moviesResponse.data.map((mv: any) => {
        return {
          id: mv._id,
          title: mv.title,
        };
      });

      // Formatting theaters
      const formattedTheaters = theatersResponse.data.map((th: any) => {
        return {
          id: th._id,
          name: th.name,
          rooms: th.rooms.map((roomId: string) => ({
            id: roomId, // If room details are provided later, adjust accordingly
          })),
        };
      });

      setMovies(formattedMovie);
      setTheaters(formattedTheaters);
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    const fetchRoomsByTheaterId = async () => {
      console.log(selectedTheater);

      if (selectedTheater) {
        const roomResponse = await getRoomByTheaterId(selectedTheater.id);
        setRooms(roomResponse);
      } else {
        setRooms([]);
      }
    };
    fetchRoomsByTheaterId();
  }, [selectedTheater]);

  useEffect(() => {
    setShowtimes([]);
    const fetchShowtimeByRoom = async () => {
      if (selectedDate && selectedRoom) {
        const response = await getShowtimesByRoom(
          { date: selectedDate },
          selectedRoom._id
        );
        setShowtimes(response.data);
      }
    };
    fetchShowtimeByRoom();
  }, [selectedDate, selectedRoom]);

  const handleClose = () => {
    setSelectedMovie(null);
    setSelectedTheater(null);
    setSelectedRoom(null);
    setStartHour("");
    setStartMinute("");
    setEndHour("");
    setEndMinute("");
    setSelectedDate(null); // Reset the date
    setOpen(false);
  };

  const handleSave = async () => {
    const startTime = `${startHour}:${startMinute}`;
    const endTime = `${endHour}:${endMinute}`;

    const requestData = {
      movieId: selectedMovie?.id,
      roomId: selectedRoom?._id,
      date: selectedDate,
      startTime,
      endTime,
    };

    try {
      const response = await saveShowtime(requestData);
      toast.success(response.data.message);
      console.log(response.data); // Successfully added showtime
      const updateData ={
        _id: response.data.showtime._id,
        date: dateFormat( response.data.showtime.date),
        time: response.data.showtime.start_time + " - "+ response.data.showtime.end_time,
        room: response.data.showtime.room,
        theater:response.data.showtime.theater,
        movie:response.data.showtime.movie,
      }
      setShowtimesList((prev: any) => [...prev, updateData]);
      setOpen(false); // Close the dialog on success
    } catch (error: any) {
      console.error("Error saving showtime:", error);
      toast.error(error.response.data.message);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    max: number, // max value (23 for hours, 59 for minutes)
    nextFieldRef?: React.RefObject<HTMLInputElement>
  ) => {
    let value = e.target.value;

    // If the value exceeds the max, set it to the max
    if (parseInt(value) > max) {
      value = max.toString();
    }

    // If the input reaches 2 characters, move to the next field
    if (value.length === 2 && nextFieldRef?.current) {
      nextFieldRef.current.focus();
    }

    setValue(value);
  };

  const handleEndMinuteBlur = () => {
    if (parseInt(endMinute) > 59) {
      setEndMinute("59"); // Automatically set minute to 59 if it exceeds
    }
  };

  const handleSelectDate = (date: any) => {
    let formattedDate = new Date(date).toLocaleDateString();
    setSelectedDate(formattedDate);
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        style={{ fontWeight: "bold" }}
        color="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        Add Showtime
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="sm"
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
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
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
            )} // Add key based on unique movie IDs
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
          {rooms?.length > 0 && (
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

          {/* Date Picker */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Select Date"
                onChange={(date) => handleSelectDate(date)} // Set the selected date
                renderInput={(params) => (
                  <TextField {...params} margin="dense" fullWidth />
                )}
              />
            </DemoContainer>
          </LocalizationProvider>
          <Box gap="2px">
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              Existing Showtimes
            </Typography>
            {selectedDate && selectedRoom ? (
              showtimes && showtimes.length > 0 ? (
                <Box display="flex" gap="10px">
                  {showtimes.map((st) => (
                    <Button
                      variant="contained"
                      key={st.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {`${st.start_time} - ${st.end_time}`}
                    </Button>
                  ))}
                </Box>
              ) : (
                <Typography>
                  No showtimes available for the selected date and room.
                </Typography>
              )
            ) : (
              <Typography>Please select a date and a room.</Typography>
            )}
          </Box>

          {/* Start and End Time input in one line */}
          <Grid2 container spacing={2}>
            <Grid2 item xs={6}>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                Start Time:
              </Typography>
              <Grid2 container spacing={1} alignItems="center">
                <Grid2 item xs={5}>
                  <TextField
                    label="HH"
                    type="number"
                    inputProps={{ min: 0, max: 23, maxLength: 2 }}
                    value={startHour}
                    onChange={(e: any) =>
                      handleInputChange(e, setStartHour, 23, startMinuteRef)
                    }
                    fullWidth
                  />
                </Grid2>
                <Grid2 item xs={1}>
                  <Typography variant="h6">:</Typography>
                </Grid2>
                <Grid2 item xs={5}>
                  <TextField
                    label="MM"
                    type="number"
                    inputProps={{ min: 0, max: 59, maxLength: 2 }}
                    value={startMinute}
                    onChange={(e: any) =>
                      handleInputChange(e, setStartMinute, 59, endHourRef)
                    }
                    inputRef={startMinuteRef}
                    fullWidth
                  />
                </Grid2>
              </Grid2>
            </Grid2>

            <Grid2 item xs={6}>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                End Time:
              </Typography>
              <Grid2 container spacing={1} alignItems="center">
                <Grid2 item xs={5}>
                  <TextField
                    label="HH"
                    type="number"
                    inputProps={{ min: 0, max: 23, maxLength: 2 }}
                    value={endHour}
                    onChange={(e: any) =>
                      handleInputChange(e, setEndHour, 23, endMinuteRef)
                    }
                    inputRef={endHourRef}
                    fullWidth
                  />
                </Grid2>
                <Grid2 item xs={1}>
                  <Typography variant="h6">:</Typography>
                </Grid2>
                <Grid2 item xs={5}>
                  <TextField
                    label="MM"
                    type="number"
                    inputProps={{ min: 0, max: 59, maxLength: 2 }}
                    value={endMinute}
                    onChange={(e: any) =>
                      handleInputChange(e, setEndMinute, 59)
                    }
                    inputRef={endMinuteRef}
                    onBlur={handleEndMinuteBlur}
                    fullWidth
                  />
                </Grid2>
              </Grid2>
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} autoFocus>
            Add Showtime
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default AddShowtimeDialog;
