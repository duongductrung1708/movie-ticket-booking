import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Breadcrumbs,
  Link as MuiLink,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
} from "@mui/material";
import styled from "styled-components";
import {
  getAllBookings,
  deleteBookings,
  updateBookings,
} from "../services/bookingService";
import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast, ToastContainer } from "react-toastify";

const Section = styled.section`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  width: 100vw;
  position: relative;
  background-color: ${(props) => props.theme.body};
`;

const Container = styled.div`
  width: 75%;
  min-height: 80vh;
  margin: 0 auto;
  margin-bottom: 10rem;

  @media (max-width: 64em) {
    width: 85%;
  }
  @media (max-width: 48em) {
    width: 100%;
  }
`;

const BreadcrumbContainer = styled.div`
  margin-bottom: 1rem;
  margin-top: 5rem;
`;

const StyledBreadcrumbs = styled(Breadcrumbs)`
  background-color: ${(props) => props.theme.body};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const BreadcrumbLink = styled(MuiLink)`
  font-family: "Sora", sans-serif !important;
  color: orange !important;
  text-decoration: none !important;

  &:hover {
    text-decoration: underline;
  }
`;

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalBookings, setTotalBookings] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBookings, setFilteredBookings] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getAllBookings({
          page: currentPage + 1,
          limit: rowsPerPage,
          isPaginate: true,
        });

        if (Array.isArray(response)) {
          setTotalBookings(response.length);
          const formattedBookings = response.map((booking) => ({
            _id: booking._id || "",
            user: booking.user?.email || "",
            movie: booking.movie?.title || "",
            theater: booking.theater || "",
            room: booking.room || "",
            showtime: new Date(booking.showtime.date).toLocaleDateString(),
            timestamp: new Date(booking.timestamp).toLocaleString(),
            status: booking.booking_status || "",
          }));

          setBookings(formattedBookings);
          setFilteredBookings(formattedBookings);
        } else {
          console.error("Unexpected response structure:", response);
          setTotalBookings(0);
          setBookings([]);
          setFilteredBookings([]);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setTotalBookings(0);
        setBookings([]);
        setFilteredBookings([]);
      }
    };

    fetchBookings();
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    const filtered = bookings.filter((booking) =>
      booking.movie.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBookings(filtered);
  }, [searchQuery, bookings]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDelete = (booking) => {
    setSelectedBooking(booking);
    setConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedBooking) {
      try {
        await deleteBookings({ params: { id: selectedBooking._id } });
        setBookings(
          bookings.filter((booking) => booking._id !== selectedBooking._id)
        );
        setTotalBookings(totalBookings - 1);
        toast.success("Booking deleted successfully!");
      } catch (error) {
        console.error("Failed to delete booking:", error);
        toast.error("Failed to delete booking.");
      } finally {
        setConfirmDeleteDialogOpen(false); 
        setSelectedBooking(null);
      }
    }
  };

  const handleEditDialogOpen = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setOpenDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
  };

  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  const handleStatusChange = async () => {
    if (selectedBooking) {
      try {
        await updateBookings(selectedBooking._id, {
          booking_status: newStatus,
        });
        setBookings(
          bookings.map((booking) =>
            booking._id === selectedBooking._id
              ? { ...booking, status: newStatus }
              : booking
          )
        );
        handleConfirmDialogClose();
        handleEditDialogClose();
        toast.success("Booking status updated successfully!");
      } catch (error) {
        console.error("Failed to update booking status:", error);
        toast.error("Failed to update booking status.");
      }
    } else {
      console.error("No booking selected for status update.");
      toast.error("No booking selected for status update.");
    }
  };

  return (
    <Section>
      <Navigation />
      <Container>
        <BreadcrumbContainer>
          <StyledBreadcrumbs aria-label="breadcrumb">
            <BreadcrumbLink component={Link} to="/home">
              Home
            </BreadcrumbLink>
            <Typography color="textPrimary">Booking Management</Typography>
          </StyledBreadcrumbs>
        </BreadcrumbContainer>

        <Typography variant="h4" align="center" gutterBottom>
          Booking Management
        </Typography>

        <TextField
          label="Search by Movie Name"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          margin="normal"
        />

        <TableContainer
          component={Paper}
          style={{ maxHeight: "800px", overflowY: "auto" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Movie</TableCell>
                <TableCell>Theater</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>Showtime</TableCell>
                <TableCell>Booking Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking.user}</TableCell>
                  <TableCell>{booking.movie}</TableCell>
                  <TableCell>{booking.theater}</TableCell>
                  <TableCell>{booking.room}</TableCell>
                  <TableCell>{booking.showtime}</TableCell>
                  <TableCell>{booking.timestamp}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditDialogOpen(booking)}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(booking)}
                    >
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={totalBookings}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Container>

      <Dialog open={openDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Booking Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change the booking status for {selectedBooking?.user} to:
          </DialogContentText>
          <Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            fullWidth
          >
            <MenuItem value="done">Done</MenuItem>
            <MenuItem value="canceled">Cancelled</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDialogOpen} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the status for{" "}
            {selectedBooking?.user}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleStatusChange} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={() => setConfirmDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the booking for{" "}
            {selectedBooking?.user}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDeleteDialogOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
      <Footer />
    </Section>
  );
};

export default BookingManagement;
