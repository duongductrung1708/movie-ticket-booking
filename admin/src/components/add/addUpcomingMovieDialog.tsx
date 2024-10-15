import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import axiosInstance from "../../config/axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddUpcomingMovieDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setUpcomingMovies: React.Dispatch<React.SetStateAction<any[]>>;
}

const AddUpcomingMovieDialog: React.FC<AddUpcomingMovieDialogProps> = ({
  open,
  setOpen,
  setUpcomingMovies,
}) => {
  const [movieData, setMovieData] = React.useState({
    title: "",
    genre: [] as string[],
    language: "",
    duration: "",
    release_date: "",
    status: "coming soon",
    director: "",
    cast: "",
    synopsis: "",
    trailer_url: "",
    poster_image: "",
  });

  const [genres, setGenres] = React.useState([]);

  React.useEffect(() => {
    axiosInstance.get("/genres").then(({ data }) => {
      setGenres(data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMovieData({ ...movieData, [e.target.name]: e.target.value });
  };

  const handleGenreChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setMovieData({
      ...movieData,
      genre: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleAddMovie = async () => {
    try {
      const response = await axiosInstance.post("/upcoming-movie", movieData);
      const updatedMovie = response.data;

      setUpcomingMovies((prevMovies: any[]) => {
        if (prevMovies) {
          return [...prevMovies, updatedMovie];
        }
        return [updatedMovie];
      });

      toast.success("Upcoming movie added successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error saving Upcoming Movie:", error);
      toast.error("Failed to add the upcoming movie.");
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Upcoming Movie</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Movie Title"
            fullWidth
            variant="outlined"
            value={movieData.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="language"
            label="Language"
            fullWidth
            variant="outlined"
            value={movieData.language}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="duration"
            label="Duration"
            fullWidth
            variant="outlined"
            value={movieData.duration}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="director"
            label="Director"
            fullWidth
            variant="outlined"
            value={movieData.director}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="cast"
            label="Cast (comma-separated)"
            fullWidth
            variant="outlined"
            value={movieData.cast}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="synopsis"
            label="Synopsis"
            fullWidth
            variant="outlined"
            value={movieData.synopsis}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="trailer_url"
            label="Trailer URL"
            fullWidth
            variant="outlined"
            value={movieData.trailer_url}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="poster_image"
            label="Poster Image URL"
            fullWidth
            variant="outlined"
            value={movieData.poster_image}
            onChange={handleChange}
          />

          {/* Genre Selection */}
          <FormControl fullWidth margin="dense">
            <InputLabel id="genre-label">Genres</InputLabel>
            <Select
              labelId="genre-label"
              id="genre"
              multiple
              value={movieData.genre}
              onChange={handleGenreChange}
              input={<OutlinedInput label="Genres" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {genres.map((genre: any) => (
                <MenuItem key={genre._id} value={genre._id}>
                  <Checkbox checked={movieData.genre.indexOf(genre._id) > -1} />
                  <ListItemText primary={genre.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Release Date"
            type="text"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            value={movieData.release_date}
            onChange={handleChange}
            name="release_date"
            margin="dense"
          />

          {/* Status selection */}
          <FormControl fullWidth margin="dense">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={movieData.status}
              onChange={(e) =>
                setMovieData({ ...movieData, status: e.target.value })
              }
            >
              <MenuItem value="coming soon">Coming Soon</MenuItem>
              <MenuItem value="released">Released</MenuItem>
              <MenuItem value="postponed">Postponed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMovie}>Add Movie</Button>
        </DialogActions>
      </Dialog>

      {/* Toast container */}
      <ToastContainer />
    </>
  );
};

export default AddUpcomingMovieDialog;
