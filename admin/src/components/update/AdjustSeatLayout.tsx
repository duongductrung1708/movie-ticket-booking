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
import Switch from "@mui/material/Switch";
import "./seatlayout.scss"

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

interface AdjustSeatLayoutProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  seatLayout: number[][];
  onSave: (newLayout: number[][]) => void;
}

const AdjustSeatLayout: React.FC<AdjustSeatLayoutProps> = ({
  open,
  setOpen,
  seatLayout: initialSeatLayout,
  onSave,
}) => {
  const [rows, setRows] = React.useState<number>(initialSeatLayout?.length);
  const [columns, setColumns] = React.useState<number>(
    initialSeatLayout?.[0]?.length
  );
  const [seatLayout, setSeatLayout] =
    React.useState<number[][]>(initialSeatLayout);

  const [vipMode, setVipMode] = React.useState<boolean>(false); // State for VIP mode

  React.useEffect(() => {
    setSeatLayout(initialSeatLayout);
    setRows(initialSeatLayout?.length);
    setColumns(initialSeatLayout?.[0].length);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveSetup = () => {
    onSave(seatLayout);
    setOpen(false);
  };

  const onSeatClick = (rowIndex: number, colIndex: number) => {
    const newLayout = seatLayout.map((row, rIndex) =>
      row.map((seat, cIndex) => {
        if (rIndex === rowIndex && cIndex === colIndex) {
          if (vipMode) {
            // Set seat as VIP if VIP mode is active
            return seat == 1 ? 0 : 1;
          } else {
            // Toggle between standard (0) and blocked (-1)
            return seat === 0 ? -1 : 0;
          }
        }
        return seat;
      })
    );
    setSeatLayout(newLayout);
  };
  console.log(seatLayout);

  const renderSeats = () => {
    return seatLayout.map((row, rowIndex) => (
      <div key={`row-${rowIndex}`} className="row">
        <span className="row-label">{String.fromCharCode(65 + rowIndex)}</span>{" "}
        {row.map((seat, colIndex) => (
          <span
            key={`seat-${rowIndex}-${colIndex}`}
            className={`seat ${
              seat === 0
                ? "seat-standard"
                : seat === 1
                ? "seat-vip"
                : "seat-blocked"
            }`}
            onClick={() => onSeatClick(rowIndex, colIndex)}
          >
            {colIndex + 1}
          </span>
        ))}
      </div>
    ));
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Adjust Seat Layout
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
            Adjust the number of rows and columns, then click on seats to
            block/unblock them or set VIP seats.
          </Typography>
          <div className="input-container">
            <TextField
              type="number"
              label="Rows"
              value={rows}
              onChange={(e) => {
                const newRowValue = parseInt(e.target.value) || 0;
                setRows(newRowValue);
                setSeatLayout(Array(newRowValue).fill(Array(columns).fill(0)));
              }}
              style={{ marginRight: "10px" }}
            />
            <TextField
              type="number"
              label="Columns"
              value={columns}
              onChange={(e) => {
                const newColValue = parseInt(e.target.value) || 0;
                setColumns(newColValue);
                setSeatLayout(Array(rows).fill(Array(newColValue).fill(0)));
              }}
            />
          </div>
          <div>
            <Typography gutterBottom>VIP Mode</Typography>
            <Switch
              checked={vipMode}
              onChange={() => setVipMode(!vipMode)} // Toggle VIP mode
              name="vipMode"
              color="primary"
            />
          </div>
          <div className="seat-layout">{renderSeats()}</div>
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={handleClose}>Cancel</CancelButton>
          <SaveButton onClick={handleSaveSetup} autoFocus>
            Save Setup
          </SaveButton>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default AdjustSeatLayout;
