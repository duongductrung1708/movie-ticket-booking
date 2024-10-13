import * as React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import axiosInstance from "../../config/axiosConfig";
import EditIcon from "@mui/icons-material/Edit";

const UpdateServiceDialog = ({ serviceData, setServices }: any) => {
  const [open, setOpen] = React.useState(false);
  const [updatedServiceData, setUpdatedServiceData] = React.useState(serviceData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedServiceData({ ...updatedServiceData, [e.target.name]: e.target.value });
  };

  const handleUpdateService = () => {
    axiosInstance.put(`/services/${serviceData._id}`, updatedServiceData).then(({ data }) => {
      setServices(data);
      setOpen(false);
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} startIcon={<EditIcon />}>
        Edit
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Update Service</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Service Name"
            fullWidth
            value={updatedServiceData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            fullWidth
            value={updatedServiceData.price}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="image"
            label="Image URL"
            fullWidth
            value={updatedServiceData.image}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            value={updatedServiceData.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="quantity"
            label="Quantity"
            fullWidth
            value={updatedServiceData.quantity}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateService}>Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateServiceDialog;
