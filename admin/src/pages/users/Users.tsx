import { Button, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import DynamicFormModal from "../../components/modal/DynamicFormModal";
import ConfirmModal from "../../components/modal/ConfirmModal";
import {
  getUsers,
  deleteUser,
  createUser,
  updateUser,
} from "../../services/userService";
import { User } from "../../models/User";
import constants from "../../constants/constants";
import { toast } from "react-toastify";

type Field = SimpleField | SelectField;
const columns: GridColDef<User>[] = [
  {
    field: "username",
    headerName: "User Name",
    width: 200,
  },
  {
    field: "email",
    headerName: "Email",
    width: 250,
  },
  {
    field: "phoneNumber",
    headerName: "Phone Number",
    width: 250,
  },
  {
    field: "city",
    headerName: "City",
    width: 200,
  },
  {
    field: "role",
    headerName: "Role",
    width: 150,
    valueGetter: (params: any) => params.name || "N/A",
  },
];

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers({
          page: currentPage,
          limit: constants.PAGE_SIZE,
          searchValue: searchQuery,
        });
        setUsers(response.data.users);
        setTotalUsers(response.data.totalUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [currentPage, searchQuery]);

  const handleTableAction = (actionType: string, id: string) => {
    const user = users.find((user) => user._id === id) ?? null;
    if (actionType === "delete") {
      setSelectedUser(user);
      setOpenConfirm(true);
    } else if (actionType === "view") {
      if (user) {
        setSelectedUser(user);
        setIsUpdate(true);
        handleOpenModal("Update User Profile");
      }
    }
  };

  const handleOpenModal = (title: string) => {
    setOpen(true);
    setModalTitle(title);
  };

  const handleClose = () => {
    setOpen(false);
    setIsUpdate(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser._id);
        setUsers(users.filter((user) => user._id !== selectedUser._id));
        setOpenConfirm(false);
        setSelectedUser(null);
        toast.success("Delete user success");
      } catch (error) {
        toast.error("Delete user failed");
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setSelectedUser(null);
  };

  const handleSubmitForm = async (formData: Record<string, string>) => {
    try {
      if (isUpdate) {
        const response = await updateUser(selectedUser?._id, formData);
        if (response.status === 200 || response.status === 201) {
          // Update the existing user in the users array
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === response.data.user._id ? response.data.user : user
            )
          );
          setOpen(false);
          toast.success("Update user success");
        } else {
          toast.error("Update user failed");
        }
      } else {
        const response = await createUser(formData);
        if (response.status === 200 || response.status === 201) {
          // Add the new user to the users array
          setUsers((prevUsers) => [...prevUsers, response.data.user]);
          setOpen(false);
          toast.success("Create user success, please check email to login");
        } else {
          toast.error("Create user failed");
        }
      }
    } catch (error) {
      console.log(error);
      if (isUpdate) {
        toast.error("Update user failed");
      } else {
        toast.error("Create user failed");
      }
    }
  };

  const userFields: Field[] = [
    {
      label: "User Name",
      name: "username",
      type: "text",
    },
    {
      label: "Email",
      name: "email",
      type: "text",
    },
    {
      label: "Phone Number",
      name: "phoneNumber",
      type: "text",
    },
    {
      label: "",
      name: "dob",
      type: "date",
    },
    {
      label: "Address",
      name: "address",
      type: "text",
    },
    {
      label: "City",
      name: "city",
      type: "text",
    },
    {
      label: "District",
      name: "district",
      type: "text",
    },
    {
      label: "Role",
      name: "role",
      type: "select",
      options: [
        { label: "Customer", value: constants.ROLE.CUSTOMER },
        { label: "Staff", value: constants.ROLE.STAFF },
      ],
    },
    {
      label: "Gender",
      name: "gender",
      type: "select",
      options: [
        { label: "Male", value: constants.GENDER.MALE },
        { label: "Female", value: constants.GENDER.FEMALE },
        { label: "Other", value: constants.GENDER.OTHER },
      ],
    },
  ];

  return (
    <div className="users">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Users</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal("Create New User")}
        >
          Add New User
        </Button>
      </Box>
      <DataTable
        slug="users"
        columns={columns}
        rowCount={totalUsers}
        rows={users}
        pageSize={constants.PAGE_SIZE}
        onPageChange={(page) => setCurrentPage(page)}
        currentPage={currentPage}
        onAction={handleTableAction}
        onSearch={setSearchQuery}
      />

      <DynamicFormModal
        title={modalTitle}
        open={open}
        width={"50%"}
        onClose={handleClose}
        onSubmit={handleSubmitForm}
        fields={userFields}
        initialData={
          selectedUser
            ? {
                username: selectedUser.username,
                email: selectedUser.email,
                phoneNumber: selectedUser.phoneNumber,
                dob: selectedUser.dob
                  ? new Date(selectedUser.dob).toISOString().split("T")[0]
                  : "",
                address: selectedUser.address,
                city: selectedUser.city,
                district: selectedUser.district,
                role: selectedUser.role?.name,
                gender: selectedUser.gender,
              }
            : {}
        }
      />

      <ConfirmModal
        open={openConfirm}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this user?"
      />
    </div>
  );
};

export default Users;
