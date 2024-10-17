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
    image: null as File | null,
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

  interface Genre {
    _id: string;
    name: string;
  }

  const [genres, setGenres] = React.useState<Genre[]>([]); // Lưu danh sách thể loại từ API

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Lấy file đầu tiên mà người dùng chọn
    if (file) {
      setMovieData({ ...movieData, image: file }); // Lưu file ảnh vào state
    }
  };

  const handleAddMovie = async () => {
    try {
      const formData = new FormData();
      formData.append("title", movieData.title);
      formData.append("rating", movieData.rating.toString());
      formData.append("trailer", movieData.trailer);
      formData.append("synopsis", movieData.synopsis);
      formData.append("language", movieData.language);
      formData.append("director", movieData.director);
      formData.append("country", movieData.country);
      formData.append("duration", movieData.duration);
      formData.append("ageRating", movieData.ageRating.toString());
      formData.append("cast", movieData.cast);
      formData.append("releaseDate", movieData.releaseDate);
  
      // Thêm file ảnh vào formData
      if (movieData.image) {
        formData.append("image", movieData.image); // 'image' là tên field được sử dụng ở backend
      }
  
      formData.append("genre", JSON.stringify(movieData.genre));
  
      // Gửi dữ liệu và ảnh lên backend
      const response = await axiosInstance.post("/movies", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const updatedMovie = response.data;
      setMovies((prevMovies) => [...prevMovies, updatedMovie]);
  
      toast.success("Movie added successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error saving movie:", error);
      toast.error("Failed to add the movie.");
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
          <input
            accept="image/*"
            type="file"
            onChange={handleImageUpload} // Hàm xử lý khi người dùng chọn file
            style={{ margin: "dense", display: "block", marginBottom: "16px" }}
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
              value={movieData.genre}
              onChange={handleGenreChange}
              input={<OutlinedInput label="Genres" />}
              renderValue={(selected) =>
                (selected as string[]) // Chuyển đổi selected thành kiểu string[]
                  .map((id) => genres.find((genre) => genre._id === id)?.name) // Tìm tên genre dựa trên ID
                  .join(", ")
              }
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

      {/* Toast container */}
      <ToastContainer />
    </>
  );
};

export default AddMovieDialog;
