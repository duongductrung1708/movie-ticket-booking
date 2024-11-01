import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import "./confirmDelete.scss";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    maxWidth: "80%",
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    overflowX: "auto",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ConfirmDeleteShowtimeModal = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  seatLayout,
}) => {
  const renderSeats = () => {
    return seatLayout?.map((row, rowIndex) => (
      <div key={`row-${rowIndex}`} className="row">
        <span className="row-label">{String.fromCharCode(65 + rowIndex)}</span>
        {row?.map((seat, colIndex) => (
          <span
            key={`seat-${rowIndex}-${colIndex}`}
            className={`seat ${
              seat.status === "available"
                ? "seat-available"
                : seat.status === "reserved"
                ? "seat-reserved"
                : seat.status === "occupied"
                ? "seat-occupied"
                : "seat-blocked"
            }`}
          >
            {colIndex + 1}
          </span>
        ))}
      </div>
    ));
  };

  return (
    <BootstrapDialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>{message}</DialogContentText>
        <Typography gutterBottom>The current seat layout:</Typography>
        <div className="seat-legend">
          <span className="seat seat-available"> </span>Available
          <span className="seat seat-reserved"> </span>Reserved
          <span className="seat seat-occupied"> </span>Occupied
        </div>
        <div className="seat-layout">{renderSeats()}</div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="secondary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default ConfirmDeleteShowtimeModal;
