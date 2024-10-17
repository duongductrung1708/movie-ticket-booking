import * as React from "react";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import AddGenreDialog from "../../components/add/addGenreDialog";
import UpdateGenreDialog from "../../components/update/updateGenre";
import axiosInstance from "../../config/axiosConfig";

interface Genre {
  _id: string;
  name: string;
  description: string;
}

function createGenreData(
  _id: string,
  name: string,
  description: string
): Genre {
  return { _id, name, description };
}

function Row(props: {
  row: Genre;
  handleUpdateGenre: (genre: Genre) => void;
  handleDeleteClick: (genreId: string) => void;
}) {
  const { row, handleUpdateGenre, handleDeleteClick } = props;
  const [open, setOpen] = React.useState(false);

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
        <TableCell align="left">{row.name}</TableCell>
        <TableCell align="left">
          <UpdateGenreDialog genreData={row} setGenres={handleUpdateGenre} />
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
              <p>{row.description}</p>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Genres() {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState<Genre[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [genreToDelete, setGenreToDelete] = React.useState<string | null>(null);

  React.useEffect(() => {
    axiosInstance.get("/genres").then(({ data }) => {
      const newRows = data.map((genre: any) =>
        createGenreData(genre._id, genre.name, genre.description)
      );
      setRows(newRows);
    });
  }, []);

  const handleAddGenre = (newGenre: Genre) => {
    setRows((prevRows) => [...prevRows, newGenre]);
    toast.success("Genre added successfully!");
  };

  const handleUpdateGenre = (updatedGenre: Genre) => {
    setRows((prevRows) =>
      prevRows.map((genre) =>
        genre._id === updatedGenre._id ? updatedGenre : genre
      )
    );
    toast.success("Genre updated successfully!");
  };

  const handleDeleteClick = (genreId: string) => {
    setGenreToDelete(genreId);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    setLoading(true);
    axiosInstance.delete(`/genres/${genreToDelete}`).then(() => {
      setRows((prevRows) =>
        prevRows.filter((genre) => genre._id !== genreToDelete)
      );
      setLoading(false);
      setConfirmDeleteOpen(false);
      toast.success("Genre deleted successfully!");
    });
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
  };

  return (
    <>
      <div>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4">Genres</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
            className="add-genre"
          >
            Add Genre
          </Button>
        </Box>
      </div>
      <TableContainer
        component={Paper}
        style={{ maxHeight: "800px", overflowY: "auto" }}
      >
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left">Name</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <Row
                key={index}
                row={row}
                handleUpdateGenre={handleUpdateGenre}
                handleDeleteClick={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
        {rows.length === 0 && (
          <div className="empty-row">No genres available</div>
        )}
      </TableContainer>
      <AddGenreDialog
        open={open}
        setOpen={setOpen}
        setGenres={handleAddGenre}
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
            Are you sure you want to delete this genre? This action cannot be
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
