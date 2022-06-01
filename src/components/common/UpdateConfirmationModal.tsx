// packages block
import { FC, useState, ChangeEvent } from "react";
import {
  CardContent, Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, PropTypes, FormControlLabel, Checkbox, Typography, Box
} from "@material-ui/core";
// interfaces/types block/theme/svgs/constants
import { DeleteWarningIcon } from "../../assets/svgs";
import { ConfirmationTypes } from "../../interfacesTypes";
import { DELETE_RECORD, CANCEL } from "../../constants";

const UpdateConfirmationModal: FC<ConfirmationTypes> = ({
  setOpen, isOpen, title, description, handleDelete, isLoading, actionText, success, learnMoreText, aboutToText
}): JSX.Element => {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleClose = () => {
    setChecked(false)
    setOpen && setOpen(!isOpen)
  }

  const onUpdate = () => {
    setChecked(false)
    handleDelete()
  }

  const buttonColor: PropTypes.Color = success ? "primary" : "secondary"

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="alert-dialog-title">
          {title}
      </DialogTitle>

      <DialogContent>
        <Box display="flex">
          <Box pt={0.75}>
            <DeleteWarningIcon />
          </Box>

          <CardContent>
            <Typography variant="h5"><strong>{aboutToText}</strong></Typography>

            <Box p={0.5} />

            <Typography variant="body1">
              {learnMoreText}
            </Typography>
          </CardContent>
        </Box>
      </DialogContent>

      <Box display="flex" ml={4} pb={2}>
        <FormControlLabel
          control={<Checkbox color="primary" checked={checked} onChange={handleChange} />}
          label={description}
        />
      </Box>

      <DialogActions>
        <Button onClick={handleClose} color="default" variant="text">
          {CANCEL}
        </Button>

        <Button onClick={onUpdate} color="inherit" disabled={!checked || isLoading} variant="outlined" className={checked ? `danger` : ''}>
          {isLoading && <CircularProgress size={20} color={buttonColor} />}

          {actionText ? actionText : DELETE_RECORD}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateConfirmationModal;
