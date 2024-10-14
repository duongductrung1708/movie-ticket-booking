import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import axiosInstance from "../../config/axiosConfig";
import { toast } from "react-toastify";

interface UpdateGenreDialogProps {
  genreData: any;
  setGenres: (updatedGenre: any) => void;
}

export default function UpdateGenreDialog({
  genreData,
  setGenres,
}: UpdateGenreDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(genreData.name);
  const [description, setDescription] = React.useState(genreData.description);

  const handleUpdateGenre = () => {
    axiosInstance
      .put(`/genres/${genreData._id}`, { name, description })
      .then(({ data }) => {
        setGenres(data);
        setOpen(false);
      })
      .catch(() => {
        toast.error("Failed to update genre");
      });
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Edit
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="update-genre-title"
      >
        <DialogTitle id="update-genre-title">Update Genre</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateGenre} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
