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
import EditIcon from "@mui/icons-material/Edit";
import { toast, ToastContainer } from "react-toastify";

interface UpdateUpcomingMovieDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  movieData: {
    _id: string;
    title: string;
    genre: string[];
    language: string;
    duration: string;
    release_date: string;
    status: string;
    director: string;
    cast: string[];
    synopsis: string;
    trailer_url: string;
    poster_image: string;
  };
  setUpcomingMovies: React.Dispatch<React.SetStateAction<any[]>>;
}

const UpdateUpcomingMovieDialog: React.FC<UpdateUpcomingMovieDialogProps> = ({
  movieData,
  setUpcomingMovies,
}) => {
  const [open, setOpen] = React.useState(false);
  const [updatedMovieData, setUpdatedMovieData] = React.useState({
    ...movieData,
    genre: Array.isArray(movieData.genre) ? movieData.genre : [],
    cast: Array.isArray(movieData.cast) ? movieData.cast : [],
  });

  const [genres, setGenres] = React.useState([]);

  React.useEffect(() => {
    axiosInstance.get("/genres").then(({ data }) => {
      setGenres(data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedMovieData({
      ...updatedMovieData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenreChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setUpdatedMovieData({
      ...updatedMovieData,
      genre: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleUpdateMovie = async () => {
    const movieToUpdate = {
      ...updatedMovieData,
      genre: updatedMovieData.genre.filter((g: string) =>
        g.match(/^[0-9a-fA-F]{24}$/)
      ),
    };

    try {
      const response = await axiosInstance.put(
        `/upcoming-movie/${movieToUpdate._id}`,
        movieToUpdate
      );
      console.log("Updated movie response:", response.data);

      const updatedMovie = response.data;

      setUpcomingMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie._id === updatedMovie._id ? updatedMovie : movie
        )
      );

      toast.success("Upcoming movie updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error updating movie:", error);
      toast.error("Failed to update the upcoming movie.");
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} startIcon={<EditIcon />} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Upcoming Movie</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Movie Title"
            fullWidth
            variant="outlined"
            value={updatedMovieData.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="language"
            label="Language"
            fullWidth
            variant="outlined"
            value={updatedMovieData.language}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="duration"
            label="Duration"
            fullWidth
            variant="outlined"
            value={updatedMovieData.duration}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="director"
            label="Director"
            fullWidth
            variant="outlined"
            value={updatedMovieData.director}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="cast"
            label="Cast (comma-separated)"
            fullWidth
            variant="outlined"
            value={
              Array.isArray(updatedMovieData.cast)
                ? updatedMovieData.cast.join(", ")
                : updatedMovieData.cast || ""
            }
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="synopsis"
            label="Synopsis"
            fullWidth
            variant="outlined"
            value={updatedMovieData.synopsis}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="trailer_url"
            label="Trailer URL"
            fullWidth
            variant="outlined"
            value={updatedMovieData.trailer_url}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="poster_image"
            label="Poster Image URL"
            fullWidth
            variant="outlined"
            value={updatedMovieData.poster_image}
            onChange={handleChange}
          />

          {/* Genre Selection */}
          <FormControl fullWidth margin="dense">
            <InputLabel id="genre-label">Genres</InputLabel>
            <Select
              labelId="genre-label"
              id="genre"
              multiple
              value={updatedMovieData.genre}
              onChange={handleGenreChange}
              input={<OutlinedInput label="Genres" />}
              renderValue={(selected) =>
                genres
                  .filter((g: any) => selected.includes(g._id))
                  .map((g: any) => g.name)
                  .join(", ")
              }
            >
              {genres.map((genre: any) => (
                <MenuItem key={genre._id} value={genre._id}>
                  <Checkbox
                    checked={updatedMovieData.genre.includes(genre._id)}
                  />
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
            value={updatedMovieData.release_date}
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
              value={updatedMovieData.status}
              onChange={(e) =>
                setUpdatedMovieData({
                  ...updatedMovieData,
                  status: e.target.value,
                })
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
          <Button onClick={handleUpdateMovie}>Update Movie</Button>
        </DialogActions>
      </Dialog>

      {/* Toast container */}
      <ToastContainer />
    </>
  );
};

export default UpdateUpcomingMovieDialog;
