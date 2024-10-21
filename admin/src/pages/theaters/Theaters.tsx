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
import EditIcon from "@mui/icons-material/Edit";

import "./theaters.scss";
import AddTheaterDialog from "../../components/add/AddTheaterDialog";
import axiosInstance from "../../config/axiosConfig";
import constants from "../../constants/constants";
import DisplayRoomDetail from "../../components/display/DisplayRoomDetail";
import { Backdrop, Button, CircularProgress, Typography } from "@mui/material";
import UpdateTheaterDialog from "../../components/update/UpdateTheater";

function createTheaterData(
  _id: string,
  name: string,
  address: string,
  city: string,
  image: string,
  rooms?:
    | {
        _id: string;
        name: string;
        image?: string;
        seatLayout: [][];
        type?: "2D" | "3D" | "IMAX";
      }[]
    | null
) {
  return {
    _id,
    name,
    address,
    city,
    image,
    rooms: rooms || null,
  };
}

function Row(props: {
  row: ReturnType<typeof createTheaterData>;
  handleUpdateTheater: (theater: any) => void;
}) {
  const { row, handleUpdateTheater } = props;
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
        {/* <TableCell align="right">{row.id}</TableCell> */}
        <TableCell align="left">{row.name}</TableCell>
        <TableCell align="left">
          <img
            src={constants.url + "images/" + row.image}
            alt=""
            className="table-image"
          />
        </TableCell>
        <TableCell align="left">{row.address}</TableCell>
        <TableCell align="left">{row.city}</TableCell>
        <TableCell align="left">{row.rooms?.length}</TableCell>
        <TableCell align="left">
          <UpdateTheaterDialog
            theaterData={row}
            setTheaters={handleUpdateTheater}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row?.rooms?.map((room) => (
                    <TableRow key={room._id}>
                      <TableCell>{room.name}</TableCell>
                      <TableCell>
                        <img
                          src={`${constants.url}images/${room.image}`}
                          alt=""
                          style={{
                            width: "100px", // Set the desired width
                            height: "100px", // Set the desired height
                            objectFit: "cover", // Maintain aspect ratio and cover the area
                            borderRadius: "5px", // Optional: add rounded corners
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <DisplayRoomDetail seatLayout={room.seatLayout} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
export default function Theaters() {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false); // Manage loading state

  React.useEffect(() => {
    axiosInstance.get("/theaters/rooms").then(({ data }) => {
      console.log(data);

      const newRows = data.map((theater) =>
        createTheaterData(
          theater._id,
          theater.name,
          theater.address,
          theater.city,
          theater.image,
          theater.rooms
        )
      );
      setRows(newRows);
    });
  }, []);

  // Function to append a new theater to the existing list of theaters
  const handleAddTheater = (newTheater: any) => {
    setRows((prevRows) => [...prevRows, newTheater]);
  };

  // Function to update an existing theater in the list
  const handleUpdateTheater = (updatedTheater: any) => {
    console.log(updatedTheater);

    setRows((prevRows) =>
      prevRows.map((theater) =>
        theater._id === updatedTheater._id ? updatedTheater : theater
      )
    ); // Replace the existing theater with the updated one
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
          <Typography variant="h4">Theaters</Typography>
          <Button
            variant="contained"
            style={{ fontWeight: "bold" }}
            color="primary"
            onClick={() => setOpen(true)}
            className="add-service"
          >
            Add Theater
          </Button>
        </Box>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Image</TableCell>
              <TableCell align="left">Address</TableCell>
              <TableCell align="left">City</TableCell>
              <TableCell align="left">Rooms</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <Row
                key={index}
                row={row}
                handleUpdateTheater={handleUpdateTheater}
              />
            ))}
          </TableBody>
        </Table>
        {rows.length == 0 && (
          <div className="empty-row">No theater is created</div>
        )}
      </TableContainer>
      <AddTheaterDialog
        open={open}
        setOpen={setOpen}
        setTheaters={handleAddTheater}
      />
      {/* Loading overlay to prevent user interaction */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
