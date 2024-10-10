import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import AdjustSeatLayout from "../update/AdjustSeatLayout";
import axiosInstance from "../../config/axiosConfig";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface Room {
  id: string; // Unique identifier
  name: string;
  roomType: "2D" | "3D" | "IMAX";
  seatLayout: number[][];
  image?: File | null; // Add image property
}

// interface Theater {
//   name: string;
//   address: string;
//   city: string;
//   rooms: Room[];
// }

interface AddTheaterDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddTheaterDialog: React.FC<AddTheaterDialogProps> = ({
  open,
  setOpen,
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const [theaterImage, setTheaterImage] = useState<File | null>(null);
  const [roomImages, setRoomImages] = useState<{ [key: string]: File | null }>(
    {}
  );

  const handleClose = () => {
    setName("");
    setAddress("");
    setCity("");
    setRooms([]);
    setOpen(false);
  };

  const handleSave = async () => {
    const theater = {
      name,
      address,
      city,
      image: theaterImage,
      rooms,
    };
    console.log(theater);
    
    const response = await axiosInstance.get("/theaters");
    console.log(response.data);

    // if (name && address && city && rooms.length > 0) {
    //   setOpen(false);
    //   // Reset form fields
    //   setName("");
    //   setAddress("");
    //   setCity("");
    //   setRooms([]);
    // } else {
    //   alert("Please fill in all fields and add at least one room.");
    // }
  };

  const handleAddRoom = () => {
    const newRoom: Room = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: `Room ${rooms.length + 1}`,
      roomType: "2D",
      seatLayout: Array(5).fill(Array(10).fill(0)),
    };
    setRooms([...rooms, newRoom]);
  };

  const handleRemoveRoom = (roomId: string) => {
    const updatedRooms = rooms.filter((room) => room.id !== roomId);
    setRooms(updatedRooms);
  };

  const handleRoomChange = (roomId: string, field: keyof Room, value: any) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, [field]: value } : room
      )
    );
  };

  const handleSeatLayoutChange = (roomId: string, newLayout: number[][]) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, seatLayout: newLayout } : room
      )
    );
  };

  const handleTheaterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTheaterImage(e.target.files[0]);
    }
  };

  const handleRoomImageChange = (roomId: string, file: File) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, image: file } : room
      )
    );
  };

  const handleOpenAdjustSeatLayout = (roomId: string) => {
    setSelectedRoomId(roomId);
    setAdjustOpen(true);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Add New Theater
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
        </DialogTitle>

        <DialogContent dividers>
          <Typography gutterBottom>
            Enter the details of the new theater.
          </Typography>
          <TextField
            margin="dense"
            label="Theater Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            margin="dense"
            label="City"
            select
            fullWidth
            variant="outlined"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <MenuItem value="Hanoi">Hanoi</MenuItem>
            <MenuItem value="HCMC">HCMC</MenuItem>
            <MenuItem value="Da Nang">Da Nang</MenuItem>
          </TextField>
          <Typography gutterBottom style={{ marginTop: "20px" }}>
            Upload Theater Image
          </Typography>
          <div className="image_theater">
            <input
              accept="image/*"
              type="file"
              onChange={handleTheaterImageChange}
              style={{ marginBottom: "20px" }}
            />
            {theaterImage && (
              <img
                src={URL.createObjectURL(theaterImage)}
                alt="Theater Preview"
                style={{
                  maxWidth: "50%",
                  height: "auto",
                  borderRadius: "8px", // Optional for rounded corners
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            )}
          </div>

          <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
            Rooms
          </Typography>

          {rooms.map((room) => (
            <div
              key={room.id}
              style={{
                marginBottom: "10px",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px", // Optional for rounded corners
              }}
            >
              <TextField
                margin="dense"
                label="Room Name"
                fullWidth
                variant="outlined"
                value={room.name}
                onChange={(e) =>
                  handleRoomChange(room.id, "name", e.target.value)
                }
              />
              <TextField
                margin="dense"
                label="Room Type"
                select
                fullWidth
                variant="outlined"
                value={room.roomType}
                onChange={(e) =>
                  handleRoomChange(
                    room.id,
                    "roomType",
                    e.target.value as "2D" | "3D" | "IMAX"
                  )
                }
              >
                <MenuItem value="2D">2D</MenuItem>
                <MenuItem value="3D">3D</MenuItem>
                <MenuItem value="IMAX">IMAX</MenuItem>
              </TextField>
              <Typography gutterBottom style={{ marginTop: "10px" }}>
                Upload Room Image
              </Typography>
              <div>
                <input
                  accept="image/*"
                  type="file"
                  onChange={(e) =>
                    e.target.files &&
                    handleRoomImageChange(room.id, e.target.files[0])
                  }
                  style={{ marginBottom: "10px" }}
                />
                {room.image && (
                  <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    <img
                      src={URL.createObjectURL(room.image)}
                      alt={`Room ${room.name} Preview`}
                      style={{
                        maxWidth: "100%", // Fit within the container
                        maxHeight: "200px", // Set a max height for room image
                        width: "auto", // Maintain aspect ratio
                        height: "auto", // Maintain aspect ratio
                        borderRadius: "8px", // Optional for rounded corners
                        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Optional shadow for better appearance
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="button_field">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpenAdjustSeatLayout(room.id)}
                  style={{ marginTop: "10px" }}
                >
                  Seat Layout
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleRemoveRoom(room.id)}
                  style={{ marginTop: "10px" }}
                >
                  Remove Room
                </Button>
              </div>
            </div>
          ))}

          <Button
            variant="outlined"
            onClick={handleAddRoom}
            style={{ marginTop: "10px" }}
          >
            Add Room
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} autoFocus>
            Add Theater
          </Button>
        </DialogActions>
      </BootstrapDialog>
      {selectedRoomId && (
        <AdjustSeatLayout
          open={adjustOpen}
          setOpen={setAdjustOpen}
          seatLayout={
            rooms.find((room) => room.id === selectedRoomId)?.seatLayout || []
          }
          onSave={(newLayout) =>
            handleSeatLayoutChange(selectedRoomId, newLayout)
          }
        />
      )}
    </React.Fragment>
  );
};

export default AddTheaterDialog;
