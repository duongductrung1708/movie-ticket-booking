import React from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

type Field = SimpleField | SelectField;

type Props = {
  open: boolean;
  width: number | string;
  title: string;
  onClose: () => void;
  onSubmit: (formData: Record<string, string>) => void;
  fields: Field[];
  initialData?: Record<string, any>; // Add this line
};

const DynamicFormModal = ({
  open,
  onClose,
  onSubmit,
  fields,
  title,
  width,
  initialData = {}, // Default to an empty object
}: Props) => {
  const [formData, setFormData] = React.useState<Record<string, string>>({});

  // Use an effect to update formData when initialData changes
  React.useEffect(() => {
    setFormData(initialData);
  }, [initialData, open]); // Dependency on open to reset when modal opens

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <form>
          {fields.map((field) => {
            if (field.type === "select") {
              return (
                <FormControl
                  size="small"
                  fullWidth
                  margin="normal"
                  key={field.name}
                >
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    label={field.label}
                  >
                    {field.options?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            }

            // Handling for the date field
            if (field.type === "date") {
              return (
                <TextField
                  size="small"
                  key={field.name}
                  label={field.label}
                  type="date" // Use type="date" for date input
                  name={field.name}
                  fullWidth
                  margin="normal"
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                  InputLabelProps={{
                    shrink: true, // Ensures the label is positioned correctly
                  }}
                />
              );
            }

            // Default case for other types
            return (
              <TextField
                size="small"
                key={field.name}
                label={field.label}
                type={field.type}
                name={field.name}
                fullWidth
                margin="normal"
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              />
            );
          })}
        </form>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DynamicFormModal;
