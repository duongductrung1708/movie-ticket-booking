import * as React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import axiosInstance from "../../config/axiosConfig";

const AddServiceDialog = ({ open, setOpen, setServices }: any) => {
  const [serviceData, setServiceData] = React.useState({
    name: "",
    price: 0,
    image: "",
    description: "",
    quantity: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServiceData({ ...serviceData, [e.target.name]: e.target.value });
  };

  const handleAddService = () => {
    axiosInstance.post("/services", serviceData).then(({ data }) => {
      setServices(data);
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Add New Service</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Service Name"
          fullWidth
          value={serviceData.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="price"
          label="Price"
          fullWidth
          value={serviceData.price}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="image"
          label="Image URL"
          fullWidth
          value={serviceData.image}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          fullWidth
          value={serviceData.description}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="quantity"
          label="Quantity"
          fullWidth
          value={serviceData.quantity}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleAddService}>Add Service</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddServiceDialog;
