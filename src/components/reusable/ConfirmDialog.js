import React from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const ConfirmDialog = ({title, text, open, onCancel, onConfirm}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>{text}</DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={onCancel}
          color="error"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          color="success"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.defaultProps = {
  title: "Confirmation"
}

export default ConfirmDialog;