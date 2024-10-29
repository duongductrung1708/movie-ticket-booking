import { Button, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import {
  deleteShowtime,
  getPaginatedShowtimes,
  isBookedShowtime,
} from "../../services/showtimeService";
import constants from "../../constants/constants";
import { dateFormat } from "../../services/formatService";
import AddShowtimeDialog from "../../components/add/AddShowTimeDialog";
import ConfirmModal from "../../components/modal/ConfirmModal";
import { toast } from "react-toastify";
import UpdateShowtimeDialog from "../../components/update/UpdateShowTimeDialog";
import ConfirmDeleteShowtimeModal from "../../components/display/ConfirmDeleteShowtimeModal";

const columns: GridColDef[] = [
  {
    headerName: "Movie",
    field: "movie",
    width: 300,
  },
  {
    headerName: "Theater",
    field: "theater",
    width: 300,
  },
  {
    headerName: "Room",
    field: "room",
    width: 200,
  },
  {
    headerName: "Date",
    field: "date",
    width: 200,
  },
  {
    headerName: "Time",
    field: "time",
    width: 200,
  },
];

const Showtimes = () => {
  const [showtimes, setShowtimes] = useState<any>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalShowtime, setTotalShowtime] = useState(0);
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [openShowtimeDetails, setOpenShowtimeDetails] = useState(false);

  useEffect(() => {
    const fetchShowtime = async () => {
      try {
        const response = await getPaginatedShowtimes({
          page: currentPage,
          limit: constants.PAGE_SIZE,
          searchValue: searchQuery,
        });
        console.log(response);

        const formattedShowtimes = response.data.showtimes.map((st: any) => ({
          _id: st._id,
          movie: st.movie.title,
          theater: st.theater.name,
          room: st.room.name,
          date: dateFormat(st.date),
          time: `${st.start_time} - ${st.end_time}`,
          seatLayout: st.seatLayout,
        }));

        setShowtimes(formattedShowtimes);
        setTotalShowtime(response.data.totalCount);
      } catch (error) {
        console.error("Failed to fetch showtimes:", error);
      }
    };
    fetchShowtime();
  }, [currentPage, searchQuery]);

  const handleTableAction = (actionType: string, id: string) => {
    const showtime = showtimes.find((st) => st?._id === id) ?? null;
    if (actionType === "delete") {
      setSelectedShowtime(showtime);
      setOpenConfirm(true);
    }
    if (actionType === "view") {
      if (showtime) {
        setSelectedShowtime(showtime);
        console.log(showtime);
        setOpenShowtimeDetails(true);
        setIsUpdate(true);
      }
    }
    if (actionType === "edit") {
      setSelectedShowtime(showtime);
    }
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setSelectedShowtime(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedShowtime) {
      try {
        const response = await isBookedShowtime(selectedShowtime._id);
        if (response.data.booked) {
          toast.error("Cannot delete. Showtime is booked or reserved!");
        } else {
          await deleteShowtime(selectedShowtime._id);
          setShowtimes(
            showtimes.filter((st) => st._id !== selectedShowtime._id)
          );
          setOpenConfirm(false);
          setSelectedShowtime(null);
          toast.success("Showtime deleted successfully");
        }
      } catch (error) {
        toast.error("Failed to delete showtime");
        console.error("Error deleting showtime:", error);
      }
    }
  };

  return (
    <div className="showtimes">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Showtimes</Typography>
        <AddShowtimeDialog setShowtimesList={setShowtimes} />
      </Box>
      <DataTable
        slug="showtimes"
        columns={columns}
        rowCount={totalShowtime}
        rows={showtimes}
        pageSize={constants.PAGE_SIZE}
        onPageChange={(page) => setCurrentPage(page)}
        currentPage={currentPage}
        onAction={handleTableAction}
        onSearch={setSearchQuery}
      />
      {selectedShowtime && (
        <ConfirmDeleteShowtimeModal
          open={openConfirm}
          onClose={handleCloseConfirm}
          onConfirm={handleConfirmDelete}
          seatLayout={selectedShowtime?.seatLayout} // Assuming seatLayout is part of showtime data
          message={`Are you sure you want to delete showtime ${selectedShowtime?.time} on ${selectedShowtime?.date} at ${selectedShowtime?.room} in Theater ${selectedShowtime?.theater}?`}
        />
      )}
      {isUpdate && (
        <UpdateShowtimeDialog
          setOpen={setIsUpdate}
          open={isUpdate}
          existingShowtimeId={selectedShowtime._id}
          setShowtimesList={setShowtimes}
        />
      )}
    </div>
  );
};

export default Showtimes;
