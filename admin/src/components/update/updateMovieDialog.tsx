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

interface UpdateMovieDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  movieData: {
    _id: string;
    title: string;
    rating: number;
    image: string;
    synopsis: string;
    director: string;
    country: string;
    genre: string[];
    releaseDate: string;
    duration: string;
    ageRating: string;
    cast: string[];
    status: string;
    trailer:string;
    language : string;
  };
  setMovies: React.Dispatch<React.SetStateAction<any[]>>;
}

const UpdateMovieDialog: React.FC<UpdateMovieDialogProps> = ({
  open,
  setOpen,
  movieData,
  setMovies,
}) => {
  const [updatedMovieData, setUpdatedMovieData] = React.useState(movieData);
  const [genres, setGenres] = React.useState([]); // Fetch danh sách thể loại từ API

  React.useEffect(() => {
    // Fetch genres từ API
    axiosInstance.get("/genres").then(({ data }) => {
      setGenres(data); // Lưu các thể loại (danh sách với ObjectId và name)
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedMovieData({ ...updatedMovieData, [e.target.name]: e.target.value });
  };

  // Xử lý khi chọn thể loại (genre)
  const handleGenreChange = (event: any) => {
    const { target: { value } } = event;
    setUpdatedMovieData({
      ...updatedMovieData,
      genre: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleUpdateMovie = async () => {
    try {
      const response = await axiosInstance.put(`/movies/${updatedMovieData._id}`, updatedMovieData);
      const updatedMovie = response.data;

      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie._id === updatedMovie._id ? updatedMovie : movie
        )
      );

      setOpen(false); // Đóng dialog sau khi cập nhật thành công
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Update Movie</DialogTitle>
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
          name="rating"
          label="Rating"
          type="number"
          fullWidth
          variant="outlined"
          value={updatedMovieData.rating}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="trailer"
          label="Trailer URL"
          fullWidth
          variant="outlined"
          value={updatedMovieData.trailer}
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
          name="language"
          label="Language"
          fullWidth
          variant="outlined"
          value={updatedMovieData.language}
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
          name="country"
          label="Country"
          fullWidth
          variant="outlined"
          value={updatedMovieData.country}
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
          name="ageRating"
          label="Age Rating"
          fullWidth
          variant="outlined"
          value={updatedMovieData.ageRating}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="cast"
          label="Cast (comma-separated)"
          fullWidth
          variant="outlined"
          value={updatedMovieData.cast.join(", ")}
          onChange={(e) =>
            setUpdatedMovieData({ ...updatedMovieData, cast: e.target.value.split(", ") })
          }
        />

        <FormControl fullWidth margin="dense">
          <InputLabel id="genre-label">Genres</InputLabel>
          <Select
            labelId="genre-label"
            id="genre"
            multiple
            value={updatedMovieData.genre} // Lưu các ObjectId của các thể loại
            onChange={handleGenreChange}
            input={<OutlinedInput label="Genres" />}
            renderValue={(selected) => selected.join(", ")}
          >
            {genres.map((genre: any) => (
              <MenuItem key={genre._id} value={genre._id}>
                <Checkbox checked={updatedMovieData.genre.indexOf(genre._id) > -1} />
                <ListItemText primary={genre.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            value={updatedMovieData.status}
            onChange={(e) =>
              setUpdatedMovieData({ ...updatedMovieData, status: e.target.value })
            }
            variant="outlined"
          >
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Unavailable">Unavailable</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Release Date"
          type="date"
          fullWidth
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          value={updatedMovieData.releaseDate}
          onChange={handleChange}
          name="releaseDate"
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleUpdateMovie}>Update Movie</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateMovieDialog;
