// packages block
import { FC, useState, ChangeEvent } from "react";
import { CardContent, Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, PropTypes, Divider, FormControlLabel, Checkbox, Typography, Box } from "@material-ui/core";
// interfaces/types block/theme/svgs/constants
import { ConfirmationTypes } from "../../interfacesTypes";
import { DeleteWarningIcon } from "../../assets/svgs";
import { DELETE_RECORD_LEARN_MORE_TEXT } from "../../constants";

const ConfirmationModal: FC<ConfirmationTypes> = ({ setOpen, isOpen, title, description, handleDelete, isLoading, actionText, success }): JSX.Element => {
  const [state, setState] = useState({
    confirmDelete: false,
  })
  const handleChange = (name: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [name]: event.target.checked });
  };
  const handleClose = () => setOpen && setOpen(!isOpen)
  const buttonColor: PropTypes.Color = success ? "primary" : "secondary"

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <Divider />
      <DialogContent>
        <Box display="flex">
          <DeleteWarningIcon />
          <CardContent>
            <Typography>
              {DELETE_RECORD_LEARN_MORE_TEXT}
            </Typography>
          </CardContent>
        </Box>
      </DialogContent>

      <Box display="flex" ml={4}>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.confirmDelete}
              onChange={handleChange("confirmDelete")}
            />
          }
          label={description}
        />
      </Box>
      <Divider />
      <DialogActions>
        <Button onClick={handleClose} color="default">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="primary" disabled={!state.confirmDelete} variant="contained">
          {isLoading ? (
            <CircularProgress size={20} color={buttonColor} />
          ) : <>
            {actionText ? actionText : "Delete"}
          </>
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
