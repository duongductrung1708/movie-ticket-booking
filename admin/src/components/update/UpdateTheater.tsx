import * as React from "react";
import { useState, useEffect } from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import constants from "../../constants/constants";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface Room {
  id: string;
  name: string;
  roomType: "2D" | "3D" | "IMAX";
  seatLayout: number[][];
  image?: File | null | string; // File or existing image URL
}

interface UpdateTheaterDialogProps {
  theaterData: {
    _id: string;
    name: string;
    address: string;
    city: string;
    rooms: {
      _id: string;
      name: string;
      type: "2D" | "3D" | "IMAX";
      seatLayout: number[][];
      image?: string;
    }[];
    image?: string;
  } | null;
  setTheaters: React.Dispatch<React.SetStateAction<[]>>;
}

const UpdateTheaterDialog: React.FC<UpdateTheaterDialogProps> = ({
  theaterData,
  setTheaters,
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [theaterImage, setTheaterImage] = useState<File | null>(null);
  const [theaterImageUrl, setTheaterImageUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (theaterData) {
      setName(theaterData.name);
      setAddress(theaterData.address);
      setCity(theaterData.city);
      setRooms(
        theaterData?.rooms?.map((room) => ({
          id: room._id,
          name: room.name,
          roomType: room.type,
          seatLayout: room.seatLayout,
          image: room.image,
        }))
      );
      setTheaterImageUrl(theaterData.image || null);
    }
  }, [theaterData]);

  const handleSeatLayoutChange = (roomId: string, newLayout: number[][]) => {
    setRooms((prevRooms) =>
      prevRooms?.map((room) =>
        room.id === roomId ? { ...room, seatLayout: newLayout } : room
      )
    );
  };

  const handleRoomChange = (roomId: string, field: keyof Room, value: any) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, [field]: value } : room
      )
    );
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
  const [removedRooms, setRemovedRooms] = useState<string[]>([]);

  const handleRemoveRoom = (roomId: string) => {

    setRemovedRooms((prevRemovedRooms) => [...prevRemovedRooms, roomId]);

    const updatedRooms = rooms.filter((room) => room.id !== roomId);
    setRooms(updatedRooms);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("city", city);

    if (theaterImage) {
      formData.append("theaterImage", theaterImage);
    }

    const roomsData = rooms.map((room) => {
      const { id, name, roomType, seatLayout } = room;
      return { id, name, roomType, seatLayout };
    });

    formData.append("rooms", JSON.stringify(roomsData));

    // Add room images
    rooms.forEach((room) => {
      if (room.image && room.image instanceof File) {
        formData.append(`roomImage_${room.id}`, room.image);
      }
    });

    // Add removed rooms
    formData.append("removedRooms", JSON.stringify(removedRooms));

    console.log(theaterData);
    
    try {
      const response = await axiosInstance.put(
        `/theaters/${theaterData?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setTheaters(response.data);
      
      setOpen(false);
    } catch (error) {
      console.error("Error updating theater:", error);
    }
  };

  const handleTheaterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTheaterImage(e.target.files[0]);
      setTheaterImageUrl(null); // Clear the old image URL when a new file is selected
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
      <Button onClick={() => setOpen(true)}>
        <EditIcon />
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Update Theater
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
            Update the details of the theater.
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
            {(theaterImage || theaterImageUrl) && (
              <img
                src={
                  theaterImage
                    ? URL.createObjectURL(theaterImage)
                    : `${constants.url}images/${theaterImageUrl} `
                }
                alt="Theater Preview"
                style={{
                  maxWidth: "50%",
                  height: "auto",
                  borderRadius: "8px",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            )}
          </div>

          <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
            Rooms
          </Typography>

          {rooms?.map((room) => (
            <div
              key={room.id}
              style={{
                marginBottom: "10px",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
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
                      src={
                        typeof room.image === "string"
                          ? `${constants.url}images/${room.image} `
                          : URL.createObjectURL(room.image)
                      }
                      alt={`Room ${room.name} Preview`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        width: "auto",
                        height: "auto",
                        borderRadius: "8px",
                        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
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
            Update Theater
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

export default UpdateTheaterDialog;
