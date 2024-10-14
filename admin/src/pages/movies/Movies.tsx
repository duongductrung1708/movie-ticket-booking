import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axiosInstance from "../../config/axiosConfig";
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddMovieDialog from "../../components/add/addMovieDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateMovieDialog from "../../components/update/updateMovieDialog";
import { toast, ToastContainer } from "react-toastify";

function createMovieData(
  _id: string,
  title: string,
  rating: number,
  image: string,
  synopsis: string,
  director: string,
  country: string,
  genre: string[],
  releaseDate: string,
  duration: string,
  ageRating: string,
  cast: string[],
  status: string,
  createdAt: string,
  updatedAt: string,
  trailer: string,
  language: string
) {
  return {
    _id,
    title,
    rating,
    image,
    synopsis,
    director,
    country,
    genre,
    releaseDate,
    duration,
    ageRating,
    cast,
    status,
    createdAt,
    updatedAt,
    trailer,
    language,
  };
}

function Row(props: {
  row: ReturnType<typeof createMovieData>;
  handleUpdateMovie: (movie: any) => void;
  handleDeleteClick: (movieId: string) => void;
}) {
  const { row, handleUpdateMovie, handleDeleteClick } = props;
  const [open, setOpen] = React.useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">{row.title}</TableCell>
        <TableCell align="left">
          <img
            src={row.image}
            alt="movie-poster"
            className="table-image"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        </TableCell>
        <TableCell align="left">{row.rating}</TableCell>
        <TableCell align="left">{row.releaseDate}</TableCell>
        <TableCell align="left">{row.duration}</TableCell>
        <TableCell align="left">{row.ageRating}</TableCell>
        <TableCell align="left">{row.status}</TableCell>
        <TableCell align="left">
          <UpdateMovieDialog movieData={row} setMovies={handleUpdateMovie} />
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => handleDeleteClick(row._id)}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <p>
                <strong>Synopsis:</strong> {row.synopsis}
              </p>
              <p>
                <strong>Director:</strong> {row.director}
              </p>
              <p>
                <strong>Country:</strong> {row.country}
              </p>
              <p>
                <strong>Genres:</strong>{" "}
                {Array.isArray(row.genre)
                  ? row.genre.map((g: any) => g.name).join(", ")
                  : "N/A"}
              </p>
              <p>
                <strong>Cast:</strong>  {Array.isArray(row.cast) ? row.cast.join(", ") : "N/A"}
              </p>
              <p>
                <strong>Created At:</strong> {row.createdAt}
              </p>
              <p>
                <strong>Updated At:</strong> {row.updatedAt}
              </p>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Movies() {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [movieToDelete, setMovieToDelete] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    axiosInstance.get("/movies").then(({ data }) => {
      const newRows = data.map((movie: any) =>
        createMovieData(
          movie._id,
          movie.title,
          movie.rating,
          movie.image,
          movie.synopsis,
          movie.director,
          movie.country,
          movie.genre,
          new Date(movie.releaseDate).toLocaleDateString(),
          movie.duration,
          movie.ageRating,
          movie.cast,
          movie.status,
          movie.trailer,
          movie.language,
          new Date(movie.createdAt).toLocaleDateString(),
          new Date(movie.updatedAt).toLocaleDateString()
        )
      );
      setRows(newRows);
      setLoading(false);
    });
  }, []);

  const handleAddMovie = (newMovie: any) => {
    setRows((prevRows) => [...prevRows, newMovie]);
  };

  const handleUpdateMovie = (updatedMovie: any) => {
    setRows((prevRows) =>
      prevRows.map((movie) =>
        movie._id === updatedMovie._id ? updatedMovie : movie
      )
    );
  };

  const handleDeleteClick = (movieId: string) => {
    setMovieToDelete(movieId);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    setLoading(true);
    axiosInstance.delete(`/movies/${movieToDelete}`).then(() => {
      setRows((prevRows) =>
        prevRows.filter((movie) => movie._id !== movieToDelete)
      );
      setLoading(false);
      setConfirmDeleteOpen(false);
      toast.success("Movie deleted successfully!");
    });
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
  };

  return (
    <>
      <div className="info">
        <h1>Movies</h1>
        <button
          onClick={() => {
            setOpen(true);
          }}
          className="add-movie"
        >
          Add Movie
        </button>
      </div>
      <TableContainer
        component={Paper}
        style={{ maxHeight: "800px", overflowY: "auto" }}
      >
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left">Title</TableCell>
              <TableCell align="left">Image</TableCell>
              <TableCell align="left">Rating</TableCell>
              <TableCell align="left">Release Date</TableCell>
              <TableCell align="left">Duration</TableCell>
              <TableCell align="left">Age Rating</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <Row
                key={index}
                row={row}
                handleUpdateMovie={handleUpdateMovie}
                handleDeleteClick={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
        {rows.length === 0 && (
          <div className="empty-row">No movies available</div>
        )}
      </TableContainer>
      <AddMovieDialog
        open={open}
        setOpen={setOpen}
        setMovies={handleAddMovie}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            Are you sure you want to delete this movie? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
}
