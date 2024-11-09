import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import DynamicFormModal from "../../components/modal/DynamicFormModal";
import ConfirmModal from "../../components/modal/ConfirmModal";
import { getBookings, cancelBooking } from "../../services/bookingService";
import { Booking } from "../../models/Booking";
import { toast } from "react-toastify";
import constants from "../../constants/constants";

type Field = SimpleField | SelectField;

const columns: GridColDef<Booking>[] = [
  { field: "user", headerName: "User", width: 200 },
  { field: "showtime", headerName: "Showtime", width: 200 },
  { field: "room", headerName: "Room", width: 80 },
  { field: "movie", headerName: "Movie", width: 200 },
  { field: "theater", headerName: "Theater", width: 200 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "timestamp", headerName: "Timestamp", width: 200 },
];

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookings({
          page: currentPage,
          limit: constants.PAGE_SIZE,
          isPaginate: true,
        });
        setTotalBookings(response.data.total);

        const formatDate = (date: Date) => {
          const d = new Date(date);
          return d.toISOString().split("T")[0];
        };

        const fetchedBookings = response.data.bookings.map((booking: any) => ({
          _id: booking._id || "",
          user: booking.user?.email || "",
          showtime: formatDate(booking.showtime.date || new Date()), 
          start_time: booking.showtime.start_time || "", 
          end_time: booking.showtime.end_time || "",
          seats: booking.seats || "",
          room: booking.room || "",
          amount: booking.amount || "",
          movie: booking.movie?.title || "",
          theater: booking.theater || "",
          timestamp: formatDate(booking.timestamp || new Date()),
          status: booking.booking_status || "",
        }));

        // Check for duplicates by creating a Set of IDs
        const uniqueBookings = Array.from(
          new Set(fetchedBookings.map((booking: Booking) => booking._id))
        ).map((id) =>
          fetchedBookings.find((booking: Booking) => booking._id === id)
        );

        setBookings(uniqueBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    fetchBookings(); // Call the function to fetch bookings
  }, [currentPage]); // Dependency array

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBooking(null);
  };

  const handleTableAction = (actionType: string, id: string) => {
    const booking = bookings.find((booking) => booking._id === id) ?? null;
    if (actionType === "delete") {
      setSelectedBooking(booking);
      setOpenConfirm(true);
    } else if (actionType === "view" && booking) {
      setSelectedBooking(booking);
      handleOpenModal();
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedBooking) {
      // Check if the selected booking status is "done"
      if (selectedBooking.status === "done") {
        setOpenConfirm(false);
        toast.error("Cannot cancel a booking that is already done");
        return; // Exit the function early
      }

      try {
        await cancelBooking(selectedBooking._id);
        const updatedBookings: Booking[] = bookings.map((booking) => {
          if (booking._id === selectedBooking._id) {
            return {
              ...booking,
              status: "canceled", // Cast to BookingStatus to satisfy TypeScript
            };
          }
          return booking; // Return unchanged
        });

        // Set the updated bookings to state
        setBookings(updatedBookings);
        setOpenConfirm(false);
        setSelectedBooking(null);
        toast.success("Booking canceled successfully");
      } catch (error) {
        toast.error("Failed to cancel booking");
        console.error("Failed to cancel booking:", error);
      }
    }
  };

  const bookingFields: Field[] = [
    { label: "Customer", name: "user", type: "text" },
    { label: "Movie", name: "movie", type: "text" },
    { label: "Theater", name: "theater", type: "text" },
    { label: "Room", name: "room", type: "text" },
    { label: "Showtime", name: "showtime", type: "text" },
    { label: "Start Time", name: "start_time", type: "text" },
    { label: "End Time", name: "end_time", type: "text" },
    { label: "Amount", name: "amount", type: "text" },
    {
      label: "Status",
      name: "status",
      type: "select",
      options: [
        { label: "Processing", value: "processing" },
        { label: "Canceled", value: "canceled" },
        { label: "Done", value: "done" },
      ],
    },
  ];

  return (
    <div className="bookings">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Bookings</Typography>
      </Box>
      <DataTable
        slug="bookings"
        columns={columns}
        rows={bookings}
        rowCount={totalBookings}
        pageSize={constants.PAGE_SIZE}
        onPageChange={(page) => setCurrentPage(page)}
        currentPage={currentPage}
        onAction={handleTableAction}
        onSearch={() => ""}
      />

      <DynamicFormModal
        title={"Booking Details"}
        open={open}
        width={"50%"}
        onClose={handleClose}
        onSubmit={() => {}}
        fields={bookingFields}
        initialData={selectedBooking || {}}
        viewOnly={true}
      />

      <ConfirmModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Cancel"
        message="Are you sure you want to cancel this booking?"
      />
    </div>
  );
};

export default Bookings;
