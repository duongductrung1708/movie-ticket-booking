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

interface AddGenreDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setGenres: (newGenre: any) => void;
}

export default function AddGenreDialog({
  open,
  setOpen,
  setGenres,
}: AddGenreDialogProps) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleAddGenre = () => {
    axiosInstance
      .post("/genres", { name, description })
      .then(({ data }) => {
        setGenres(data);
        setOpen(false);
      })
      .catch(() => {
        toast.error("Failed to add genre");
      });
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="add-genre-title"
    >
      <DialogTitle id="add-genre-title">Add New Genre</DialogTitle>
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
        <Button onClick={handleAddGenre} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
