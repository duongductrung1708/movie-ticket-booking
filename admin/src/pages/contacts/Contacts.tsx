import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import DynamicFormModal from "../../components/modal/DynamicFormModal";
import ConfirmModal from "../../components/modal/ConfirmModal";
import { getContacts, deleteContact } from "../../services/contactServices";
import { Contact } from "../../models/Contact";
import { toast } from "react-toastify";
import constants from "../../constants/constants";

type Field = SimpleField | SelectField;

const columns: GridColDef<Contact>[] = [
  { field: "fullName", headerName: "Full Name", width: 200 },
  { field: "phoneNumber", headerName: "Phone Number", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "service", headerName: "Service", width: 150 },
  { field: "area", headerName: "Area", width: 150 },
  { field: "theater", headerName: "Theater", width: 150 },
  { field: "details", headerName: "Details", width: 300 },
];

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await getContacts({
          page: currentPage,
          limit: constants.PAGE_SIZE,
          isPaginate: true,
        });
        setTotalContacts(response.data.total);
        setContacts(response.data.contacts);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    fetchContacts();
  }, [currentPage]);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedContact(null);
  };

  const handleTableAction = (actionType: string, id: string) => {
    const contact = contacts.find((contact) => contact._id === id) ?? null;
    if (actionType === "delete") {
      setSelectedContact(contact);
      setOpenConfirm(true);
    } else if (actionType === "view" && contact) {
      setSelectedContact(contact);
      handleOpenModal();
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedContact) {
      try {
        await deleteContact(selectedContact._id);
        setContacts((prev) =>
          prev.filter((contact) => contact._id !== selectedContact._id)
        );
        setOpenConfirm(false);
        setSelectedContact(null);
        toast.success("Contact deleted successfully");
      } catch (error) {
        toast.error("Failed to delete contact");
        console.error("Failed to delete contact:", error);
      }
    }
  };

  const contactFields: Field[] = [
    { label: "Full Name", name: "fullName", type: "text" },
    { label: "Phone Number", name: "phoneNumber", type: "text" },
    { label: "Email", name: "email", type: "text" },
    { label: "Service", name: "service", type: "text" },
    { label: "Area", name: "area", type: "text" },
    { label: "Theater", name: "theater", type: "text" },
    { label: "Details", name: "details", type: "text" },
  ];

  return (
    <div className="contacts">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Contacts</Typography>
      </Box>
      <DataTable
        slug="contacts"
        columns={columns}
        rows={contacts}
        rowCount={totalContacts}
        pageSize={constants.PAGE_SIZE}
        onPageChange={(page) => setCurrentPage(page)}
        currentPage={currentPage}
        onAction={handleTableAction}
        onSearch={() => ""}
      />

      <DynamicFormModal
        title="Contact Details"
        open={open}
        width="50%"
        onClose={handleClose}
        onSubmit={() => {}}
        fields={contactFields}
        initialData={selectedContact || {}}
        viewOnly={true}
      />

      <ConfirmModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this contact?"
      />
    </div>
  );
};

export default Contacts;
