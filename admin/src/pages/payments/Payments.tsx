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
import axiosInstance from "../../config/axiosConfig";
import {
  Backdrop,
  CircularProgress,
} from "@mui/material";

// Define Payment Type
type Payment = {
  _id: string;
  amount: number;
  paymentMethod: { name: string, fee: number };
  bookingId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

function createPaymentData(
  _id: string,
  amount: number,
  paymentMethod: { name: string, fee: number },
  bookingId: string,
  status: string,
  createdAt: string,
  updatedAt: string
): Payment {
  return {
    _id,
    amount,
    paymentMethod,
    bookingId,
    status,
    createdAt,
    updatedAt,
  };
}


function Row(props: { row: Payment }) {
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
        <TableCell align="left">{row._id}</TableCell>
        <TableCell align="left">${row.amount}</TableCell>
        <TableCell align="left">{row.paymentMethod?.name}</TableCell>
        <TableCell align="left">{row.paymentMethod?.fee}</TableCell>
        <TableCell align="left">{row.status}</TableCell>
        
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <p><strong>Created At:</strong> {new Date(row.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(row.updatedAt).toLocaleString()}</p>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// Payments Component
export default function Payments() {
  const [rows, setRows] = React.useState<Payment[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    axiosInstance.get("/payments").then(({ data }) => {
      const newRows = data.map((payment: any) =>
        createPaymentData(
          payment._id,
          payment.amount,
          payment.paymentMethod,
          payment.bookingId,
          payment.status,
          payment.createdAt,
          payment.updatedAt
        )
      );
      setRows(newRows);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <div className="info">
        <h1>Payments</h1>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left">Transaction ID</TableCell>
              <TableCell align="left">Amount</TableCell>
              <TableCell align="left">Payment Method</TableCell>
              <TableCell align="left">Fee</TableCell>
              <TableCell align="left">Status</TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <Row key={index} row={row} />
            ))}
          </TableBody>
        </Table>
        {rows.length === 0 && <div className="empty-row">No payments available</div>}
      </TableContainer>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
