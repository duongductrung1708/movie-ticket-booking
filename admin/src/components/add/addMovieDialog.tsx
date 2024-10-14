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

interface AddMovieDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setMovies: React.Dispatch<React.SetStateAction<any[]>>;
}

const AddMovieDialog: React.FC<AddMovieDialogProps> = ({
  open,
  setOpen,
  setMovies,
}) => {
  const [movieData, setMovieData] = React.useState({
    title: "",
    rating: 0,
    image: "", 
    trailer: "",
    synopsis: "",
    language: "",
    director: "",
    country: "",
    genre: [] as string[],
    releaseDate: "",
    duration: "",
    ageRating: 16,
    cast: "",
  });

  const [genres, setGenres] = React.useState([]); // Lưu danh sách thể loại từ API

  React.useEffect(() => {
    // Fetch genres từ API
    axiosInstance.get("/genres").then(({ data }) => {
      setGenres(data); // Lưu các thể loại (danh sách với ObjectId và name)
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMovieData({ ...movieData, [e.target.name]: e.target.value });
  };

  // Xử lý khi chọn thể loại (genre)
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
      const response = await axiosInstance.post("/movies", movieData);
      const updatedMovie = response.data;
      console.log(updatedMovie);

      // Thêm movie mới vào danh sách
      setMovies((prevMovies: any[]) => {
        if (prevMovies) {
          return [...prevMovies, updatedMovie];
        }
        return [updatedMovie]; 
      });
  
      setOpen(false); // Đóng dialog sau khi thêm thành công
    } catch (error) {
      console.error("Error saving Movie:", error);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Movie</DialogTitle>
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
          name="rating"
          label="Rating"
          type="number"
          fullWidth
          variant="outlined"
          value={movieData.rating}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="trailer"
          label="Trailer URL"
          fullWidth
          variant="outlined"
          value={movieData.trailer}
          onChange={handleChange}
        />
        {/* Nhập URL của ảnh */}
        <TextField
          margin="dense"
          name="image"
          label="Image URL"
          fullWidth
          variant="outlined"
          value={movieData.image}
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
          name="language"
          label="Language"
          fullWidth
          variant="outlined"
          value={movieData.language}
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
          name="country"
          label="Country"
          fullWidth
          variant="outlined"
          value={movieData.country}
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
          name="ageRating"
          label="Age Rating"
          fullWidth
          variant="outlined"
          value={movieData.ageRating}
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

        <FormControl fullWidth margin="dense">
          <InputLabel id="genre-label">Genres</InputLabel>
          <Select
            labelId="genre-label"
            id="genre"
            multiple
            value={movieData.genre} // Lưu các ObjectId của các thể loại
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
          type="date"
          fullWidth
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          value={movieData.releaseDate}
          onChange={handleChange}
          name="releaseDate"
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleAddMovie}>Add Movie</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMovieDialog;
