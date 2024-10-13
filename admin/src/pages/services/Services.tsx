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
import DeleteIcon from "@mui/icons-material/Delete";
import AddServiceDialog from "../../components/add/addServiceDialog";
import UpdateServiceDialog from "../../components/update/updateService";
import axiosInstance from "../../config/axiosConfig";
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function createServiceData(
  _id: string,
  name: string,
  price: number,
  image: string,
  description: string,
  quantity: number
) {
  return {
    _id,
    name,
    price,
    image,
    description,
    quantity,
  };
}

function Row(props: {
  row: ReturnType<typeof createServiceData>;
  handleUpdateService: (service: any) => void;
  handleDeleteClick: (serviceId: string) => void;
}) {
  const { row, handleUpdateService, handleDeleteClick } = props;
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
        <TableCell align="left">{row.name}</TableCell>
        <TableCell align="left">
          <img
            src={row.image}
            alt=""
            className="table-image"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        </TableCell>
        <TableCell align="left">${row.price}</TableCell>
        <TableCell align="left">{row.quantity}</TableCell>
        <TableCell align="left">
          <UpdateServiceDialog
            serviceData={row}
            setServices={handleUpdateService}
          />
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => handleDeleteClick(row._id)}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <p>{row.description}</p>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Services() {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [serviceToDelete, setServiceToDelete] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    axiosInstance.get("/services").then(({ data }) => {
      const newRows = data.map((service: any) =>
        createServiceData(
          service._id,
          service.name,
          service.price,
          service.image,
          service.description,
          service.quantity
        )
      );
      setRows(newRows);
    });
  }, []);

  const handleAddService = (newService: any) => {
    setRows((prevRows) => [...prevRows, newService]);
  };

  const handleUpdateService = (updatedService: any) => {
    setRows((prevRows) =>
      prevRows.map((service) =>
        service._id === updatedService._id ? updatedService : service
      )
    );
  };

  const handleDeleteClick = (serviceId: string) => {
    setServiceToDelete(serviceId); // Set the service to delete
    setConfirmDeleteOpen(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = () => {
    setLoading(true);
    axiosInstance.delete(`/services/${serviceToDelete}`).then(() => {
      setRows((prevRows) =>
        prevRows.filter((service) => service._id !== serviceToDelete)
      );
      setLoading(false);
      setConfirmDeleteOpen(false); // Close the confirmation dialog
    });
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false); // Close the confirmation dialog
  };

  return (
    <>
      <div className="info">
        <h1>Services</h1>
        <button
          onClick={() => {
            setOpen(true);
          }}
          className="add-service"
        >
          Add Service
        </button>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Image</TableCell>
              <TableCell align="left">Price</TableCell>
              <TableCell align="left">Quantity</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <Row
                key={index}
                row={row}
                handleUpdateService={handleUpdateService}
                handleDeleteClick={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
        {rows.length === 0 && (
          <div className="empty-row">No services available</div>
        )}
      </TableContainer>
      <AddServiceDialog open={open} setOpen={setOpen} setServices={handleAddService} />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            Are you sure you want to delete this service? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
