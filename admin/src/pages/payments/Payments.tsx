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
import { Backdrop, CircularProgress } from "@mui/material";

// Define Payment Type
type Payment = {
  _id: string;
  amount: number;
  paymentMethodId: paymentMethod;
  bookingId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};
type paymentMethod = {
  _id: string;
  name: string;
  description: string;
  fee: number;
};

function createPaymentData(
  _id: string,
  amount: number,
  paymentMethod: paymentMethod | null,
  bookingId: string,
  status: string,
  createdAt: string,
  updatedAt: string
): Payment {
  return {
    _id,
    amount,
    paymentMethodId: paymentMethod || {
      _id: "",
      name: "Unknown",
      description: "",
      fee: 0,
    },
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
        <TableCell align="left">{row.amount} VND</TableCell>
        <TableCell align="left">
          {row.paymentMethodId ? row.paymentMethodId.name : "Unknown"}
        </TableCell>
        <TableCell align="left">
          {row.paymentMethodId ? row.paymentMethodId.fee : 0}
        </TableCell>
        <TableCell align="left">{row.status}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(row.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(row.updatedAt).toLocaleString()}
              </p>
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
  const totalAmount = rows.reduce((sum, row) => sum + row.amount, 0);

  React.useEffect(() => {
    setLoading(true);

    const fetchPayment = async () => {
      const responseData = await axiosInstance
        .get("/payments")
        .then(({ data }) => {
          const newRows = data.map((payment: any) =>
            createPaymentData(
              payment._id,
              payment.amount,
              payment.paymentMethodId,
              payment.bookingId,
              payment.status,
              payment.createdAt,
              payment.updatedAt
            )
          );
          setRows(newRows);
        });
    };
    fetchPayment();
    setLoading(false);
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
            <TableRow>
              <TableCell colSpan={2} />
              <TableCell align="left">
                <strong>Total: {totalAmount.toFixed(2)}VND</strong>
              </TableCell>
              <TableCell colSpan={3} />
            </TableRow>
          </TableBody>
        </Table>
        {rows.length === 0 && (
          <div className="empty-row">No payments available</div>
        )}
      </TableContainer>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
