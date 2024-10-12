import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({ open, onClose, onConfirm, title = "Confirm Action", message = "Are you sure you want to proceed?" }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="secondary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
