// packages block
import { FC, useState, ChangeEvent } from "react";
import { CardContent, Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, PropTypes, FormControlLabel, Checkbox, Typography, Box } from "@material-ui/core";
// interfaces/types block/theme/svgs/constants
import { DeleteWarningIcon } from "../../assets/svgs";
import { ConfirmationTypes } from "../../interfacesTypes";
import { DELETE_RECORD, DELETE_RECORD_LEARN_MORE_TEXT, DELETE_RECORD_TEXT, CANCEL } from "../../constants";

const ConfirmationModal: FC<ConfirmationTypes> = ({ setOpen, isOpen, title, description, handleDelete, isLoading, actionText, success }): JSX.Element => {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleClose = () => {
    setChecked(false)
    setOpen && setOpen(!isOpen)
  }

  const onDelete = () => {
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
            <Typography component="h4" variant="h5">{DELETE_RECORD_TEXT}</Typography>

            <Typography>
              {DELETE_RECORD_LEARN_MORE_TEXT}
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
        <Box pr={1}>
          <Button onClick={handleClose} color="default">
            {CANCEL}
          </Button>
        </Box>

        <Button onClick={onDelete} color="secondary" disabled={!checked || isLoading} variant="contained">
          {isLoading && <CircularProgress size={20} color={buttonColor} />}
          {actionText ? actionText : DELETE_RECORD}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
