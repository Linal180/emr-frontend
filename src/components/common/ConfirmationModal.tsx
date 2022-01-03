// packages block
import { FC } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, PropTypes } from "@material-ui/core";
// interfaces/types block
import { ConfirmationTypes } from "../../interfacesTypes";

const ConfirmationModal: FC<ConfirmationTypes> = ({ setOpen, isOpen, title, description, handleDelete, isLoading, actionText, success }): JSX.Element => {
  const handleClose = () => setOpen && setOpen(!isOpen)
  const buttonColor: PropTypes.Color = success ? "primary" : "secondary"

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleDelete} color={buttonColor} disabled={isLoading}>
          {isLoading ? (
            <CircularProgress size={20} color={buttonColor} />
          ) : <>
            {actionText ? actionText : "Delete"}
          </>
          }
        </Button>

        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
