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
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import "./theaters.scss";
import AddTheaterDialog from "../../components/add/AddTheaterDialog";

function createTheaterData(
  id: string,
  name: string,
  address: string,
  city: string,
  image: string,
  rooms: {
    id: string;
    name: string;
    image?: string;
    rows: number;
    columns: number;
    type: "2D" | "3D" | "IMAX";
  }[]
) {
  return {
    id,
    name,
    address,
    city,
    image,
    rooms,
  };
}

function Row(props: { row: ReturnType<typeof createTheaterData> }) {
  const { row } = props;
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
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        {/* <TableCell align="right">{row.id}</TableCell> */}
        <TableCell align="right">{row.name}</TableCell>
        <TableCell align="right">{row.image}</TableCell>
        <TableCell align="right">{row.address}</TableCell>
        <TableCell align="right">{row.city}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Room Id</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell align="right">Dimension (Row x Col)</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell component="th" scope="row">
                        {room.id}
                      </TableCell>
                      <TableCell>{room.name}</TableCell>
                      <TableCell>{room.image}</TableCell>
                      <TableCell align="right">
                        {room.rows} x {room.columns}
                      </TableCell>
                      <TableCell align="right">Hi</TableCell>
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
const rows = [
  createTheaterData("1", "Theater 1", "123 Street", "City 1", "image1.png", [
    {
      id: "1",
      name: "Room 1",
      image: "room1.png",
      rows: 10,
      columns: 15,
      type: "IMAX",
    },
    {
      id: "1",
      name: "Room 2",
      rows: 8,
      columns: 12,
      type: "2D",
    },
  ]),
];
export default function Theaters() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="info">
        <h1>Theaters</h1>
        <button
          onClick={() => {
            setOpen(true);
          }}
          className="add-theater"
        >
          Add Theaters
        </button>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Id</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Image</TableCell>
              <TableCell align="right">Address</TableCell>
              <TableCell align="right">City</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
        {rows.length == 0 && (
          <div className="empty-row">No theater is created</div>
        )}
      </TableContainer>
      <AddTheaterDialog open={open} setOpen={setOpen}/>
    </>
  );
}
