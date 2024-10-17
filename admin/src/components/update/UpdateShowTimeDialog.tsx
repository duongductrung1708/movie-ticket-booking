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
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getMovies } from "../../services/movieService";
import { getTheaters } from "../../services/theaterService";
import { getRoomByTheaterId } from "../../services/roomService";
import {
  getShowtimeById,
  getShowtimes,
  getShowtimesByRoom,
  saveShowtime,
  updateShowtime, // Import the update function
} from "../../services/showtimeService";
import { Box, Grid2 } from "@mui/material";
import { toast } from "react-toastify";
import { dateFormat } from "../../services/formatService";
import { Dispatch } from "@reduxjs/toolkit";
import dayjs from "dayjs";

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
  showtimes: string[];
}

interface Showtime {
  id: string;
  start_time: string;
  end_time: string;
  movie: Movie;
  theater: Theater;
  room: Room;
  date: string;
}

interface UpdateShowtimeDialogProps {
  setShowtimesList: (showtimes: any) => void;
  existingShowtimeId: string; // New prop for existing showtime
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateShowtimeDialog: React.FC<UpdateShowtimeDialogProps> = ({
  setShowtimesList,
  existingShowtimeId,
  open,
  setOpen,
}) => {
  const [showtime, setShowtime] = useState<any>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [rooms, setRooms] = useState<Room[] | null>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[] | null>(null);
  const [startHour, setStartHour] = useState<string>("");
  const [startMinute, setStartMinute] = useState<string>("");
  const [endHour, setEndHour] = useState<string>("");
  const [endMinute, setEndMinute] = useState<string>("");

  const startMinuteRef = useRef<HTMLInputElement>(null);
  const endHourRef = useRef<HTMLInputElement>(null);
  const endMinuteRef = useRef<HTMLInputElement>(null);

  // Load movies and theaters when the dialog opens
  useEffect(() => {
    const fetchData = async () => {
      const moviesResponse = await getMovies();
      const theatersResponse = await getTheaters();
      const showtimeResponse = await getShowtimeById(existingShowtimeId);

      const formattedMovie = moviesResponse.data.map((mv: any) => {
        return {
          id: mv._id,
          title: mv.title,
        };
      });

      const formattedTheaters = theatersResponse.data.map((th: any) => {
        return {
          id: th._id,
          name: th.name,
          rooms: th.rooms.map((roomId: string) => ({
            id: roomId,
          })),
        };
      });

      setMovies(formattedMovie);
      setTheaters(formattedTheaters);

      //set select
      setSelectedMovie(
        formattedMovie.find(
          (fm: any) => fm.id === showtimeResponse.data.movie_id._id
        )
      );
      const tempTheater = formattedTheaters.find(
        (ft: any) => ft.id === showtimeResponse.data.theater._id
      );
      setSelectedTheater(tempTheater);
      setSelectedRoom(showtimeResponse.data.room_id);
      let dateObj = new Date(showtimeResponse.data.date.split("T")[0]);

      // Customize the locale and format options
      let formattedDate = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      setSelectedDate(formattedDate);
      console.log(formattedDate);

      setStartHour(showtimeResponse.data.start_time.split(":")[0]);
      setStartMinute(showtimeResponse.data.start_time.split(":")[1]);
      setEndHour(showtimeResponse.data.end_time.split(":")[0]);
      setEndMinute(showtimeResponse.data.end_time.split(":")[1]);
    };

    if (open) {
      fetchData();
    }
  }, [open]);

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

  useEffect(() => {
    setShowtimes([]);
    const fetchShowtimeByRoom = async () => {
      if (selectedDate && selectedRoom) {
        const response = await getShowtimesByRoom(
          { date: selectedDate },
          selectedRoom._id
        );
        console.log(selectedDate);

        setShowtimes(response.data);
        console.log(response.data);
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
    setSelectedDate(null);
    setOpen(false);
  };

  const handleSave = async () => {
    const startTime = `${startHour}:${startMinute}`;
    const endTime = `${endHour}:${endMinute}`;

    const requestData = {
      movie_id: selectedMovie?.id,
      room_id: selectedRoom?._id,
      date: selectedDate,
      startTime,
      endTime,
    };
    console.log(requestData);

    try {
      const response = await updateShowtime(existingShowtimeId, requestData);
      toast.success("Showtime updated successfully");
      const updateData = {
        _id: response.data.showtime._id,
        date: dateFormat(response.data.showtime.date),
        time:
          response.data.showtime.start_time +
          " - " +
          response.data.showtime.end_time,
        room: response.data.showtime.room,
        theater: response.data.showtime.theater,
        movie: response.data.showtime.movie,
      };
      // Update showtimesList by finding the matching _id and updating the entry
      setShowtimesList((prev: any) =>
        prev.map((showtime: any) =>
          showtime._id === updateData._id ? updateData : showtime
        )
      );
      setOpen(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    max: number,
    nextFieldRef?: React.RefObject<HTMLInputElement>
  ) => {
    let value = e.target.value;

    if (parseInt(value) > max) {
      value = max.toString();
    }

    if (value.length === 2 && nextFieldRef?.current) {
      nextFieldRef.current.focus();
    }

    setValue(value);
  };

  const handleEndMinuteBlur = () => {
    if (parseInt(endMinute) > 59) {
      setEndMinute("59");
    }
  };

  const handleSelectDate = (date: any) => {
    
    let dateObj = new Date(date);
    let formattedDate = dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    
    setSelectedDate(formattedDate);
  };
  const formattedDate = selectedDate
    ? dayjs(selectedDate.split("/").reverse().join("-"))
    : null;

  return (
    <React.Fragment>
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
          Update Showtime
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
            Enter the details of the {showtime ? "existing" : "new"} showtime.
          </Typography>

          <Autocomplete
            options={movies}
            getOptionLabel={(option) => option.title}
            value={selectedMovie}
            onChange={(e, newValue) => setSelectedMovie(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Movie" margin="dense" />
            )}
          />

          <Autocomplete
            options={theaters}
            getOptionLabel={(option) => option.name}
            value={selectedTheater}
            onChange={(e, newValue) => {
              setSelectedTheater(newValue);
              setSelectedRoom(null);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select Theater" margin="dense" />
            )}
          />

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

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                value={formattedDate}
                label="Select Date"
                onChange={(date) => handleSelectDate(date)}
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
            Update
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default UpdateShowtimeDialog;
