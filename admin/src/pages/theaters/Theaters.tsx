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
import axiosInstance from "../../config/axiosConfig";

function createTheaterData(
  id: string,
  name: string,
  address: string,
  city: string,
  image: string,
  rooms?:
    | {
        id: string;
        name: string;
        image?: string;
        rows: number;
        columns: number;
        type?: "2D" | "3D" | "IMAX";
      }[]
    | null
) {
  return {
    id,
    name,
    address,
    city,
    image,
    rooms: rooms || null,
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
        {/* <TableCell align="right">{row.id}</TableCell> */}
        <TableCell align="left">{row.name}</TableCell>
        <TableCell align="left">
          <img src={row.image} alt="" className="table-image" />
        </TableCell>
        <TableCell align="left">{row.address}</TableCell>
        <TableCell align="left">{row.city}</TableCell>
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
                  {row?.rooms?.map((room) => (
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
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    axiosInstance.get("/theaters").then(({ data }) => {
      const newRows = data.map((theater) =>
        createTheaterData(
          theater._id,
          theater.name,
          theater.address,
          theater.city,
          theater.image
        )
      );
      setRows(newRows);
    });
  }, []);
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
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Image</TableCell>
              <TableCell align="left">Address</TableCell>
              <TableCell align="left">City</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row?.id} row={row} />
            ))}
          </TableBody>
        </Table>
        {rows.length == 0 && (
          <div className="empty-row">No theater is created</div>
        )}
      </TableContainer>
      <AddTheaterDialog open={open} setOpen={setOpen} />
    </>
  );
}
