import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import "./displayroomdetail.scss";
import VisibilityIcon from "@mui/icons-material/Visibility";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    maxWidth: "80%", // Expand up to 80% of the screen width
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    overflowX: "auto", // Allow horizontal scrolling
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[300],
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.grey[400],
  },
}));

const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

interface DisplayRoomDetailProps {
  seatLayout: number[][]; // Current seat layout
}

const DisplayRoomDetail: React.FC<DisplayRoomDetailProps> = ({
  seatLayout: initialSeatLayout,
}) => {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState<number>(initialSeatLayout?.length); // Default rows
  const [columns, setColumns] = React.useState<number>(
    initialSeatLayout?.[0]?.length
  ); // Default columns
  const [seatLayout, setSeatLayout] =
    React.useState<number[][]>(initialSeatLayout);

  React.useEffect(() => {
    setSeatLayout(initialSeatLayout);
    setRows(initialSeatLayout?.length);
    setColumns(initialSeatLayout?.[0].length);
  }, [initialSeatLayout]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveSetup = () => {
    // Pass the updated layout back to the parent component
    setOpen(false);
  };

  const onSeatClick = (rowIndex: number, colIndex: number) => {
    const newLayout = seatLayout.map((row, rIndex) =>
      row.map((seat, cIndex) => {
        if (rIndex === rowIndex && cIndex === colIndex) {
          return seat === 0 ? -1 : 0; // Toggle between available (0) and invisible (-1)
        }
        return seat;
      })
    );
    setSeatLayout(newLayout);
  };

  const renderSeats = () => {
    return seatLayout?.map((row, rowIndex) => (
      <div key={`row-${rowIndex}`} className="row">
        <span className="row-label">{String.fromCharCode(65 + rowIndex)}</span>{" "}
        {/* Row labels (A, B, C, etc.) */}
        {row.map((seat, colIndex) => (
          <span
            key={`seat-${rowIndex}-${colIndex}`}
            className={`seat ${
              seat === 0
                ? "seat-not-booked"
                : seat === 1
                ? "seat-vip"
                : "seat-invisible"
            }`}
            style={seat === -1 ? { visibility: "hidden" } : {}}
          >
            {colIndex + 1}
          </span>
        ))}
      </div>
    ));
  };

  return (
    <React.Fragment>
      <Button>
        <VisibilityIcon
          onClick={() => {
            setOpen(true);
          }}
        />
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Room Seat Layout
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            The current seat layout of the room:
          </Typography>
          <div className="input-container">
            <TextField
              type="number"
              label="Rows"
              value={rows}
              disabled
              style={{ marginRight: "10px" }}
            />
            <TextField type="number" label="Columns" value={columns} disabled />
          </div>
          <div className="seat-layout">{renderSeats()}</div>
        </DialogContent>
        <DialogActions>
          <SaveButton onClick={handleClose}>OK</SaveButton>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default DisplayRoomDetail;
