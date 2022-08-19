// packages block
import { FC, useState, ChangeEvent } from "react";
import {
  CardContent, Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, PropTypes,
  FormControlLabel, Checkbox, Typography, Box
} from "@material-ui/core";
//components
import Signature from "./signature";
// interfaces/types block/theme/svgs/constants
import { DeleteWarningIcon } from "../../assets/svgs";
import { ConfirmationTypes } from "../../interfacesTypes";
import { aboutToCancel, aboutToDelete, aboutToSign, cancelRecordTitle, deleteRecordTitle } from "../../utils";
import {
  DELETE_RECORD, DELETE_RECORD_LEARN_MORE_TEXT, CANCEL, SIGN_RECORD_LEARN_MORE_TEXT, SIGN_PATIENT_DOCUMENT, CANCEL_RECORD_LEARN_MORE_TEXT
} from "../../constants";

const ConfirmationModal: FC<ConfirmationTypes> = ({
  setOpen, isOpen, title, description, handleDelete, isLoading, actionText, success, isSign, isCalendar, onSignatureEnd, cancelText
}): JSX.Element => {
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
        {isSign ? SIGN_PATIENT_DOCUMENT : isCalendar ? cancelRecordTitle(title || '') : deleteRecordTitle(title || '')}
      </DialogTitle>

      <DialogContent>
        <Box display="flex">
          <Box pt={0.75}>
            <DeleteWarningIcon />
          </Box>

          <Box flex={1}>
            <CardContent>
              <Typography variant="h5">
                <strong>{isSign ? aboutToSign(title || '') : isCalendar ? aboutToCancel(title || '') : aboutToDelete(title || '')}</strong>
              </Typography>

              <Box p={0.5} />

              <Typography variant="body1">
                {isSign ? SIGN_RECORD_LEARN_MORE_TEXT : isCalendar ? CANCEL_RECORD_LEARN_MORE_TEXT : DELETE_RECORD_LEARN_MORE_TEXT}
              </Typography>
            </CardContent>
          </Box>
        </Box>
      </DialogContent>

      <Box display="flex" ml={4} pb={2}>
        {isSign ? <Signature controllerName="signature" onSignatureEnd={(file) => {
          setChecked(!!file)
          onSignatureEnd && onSignatureEnd(file)
        }} isController={false} /> : <FormControlLabel
          control={<Checkbox color="primary" checked={checked} onChange={handleChange} />}
          label={description}
        />}
      </Box>

      <DialogActions>
        <Button onClick={handleClose} color="default" variant="text">
          {cancelText || CANCEL}
        </Button>

        <Button onClick={onDelete} disabled={!checked || isLoading} variant="outlined" className={checked ? isSign ? 'success' : 'danger' : ''}>
          {isLoading && <CircularProgress size={20} color={buttonColor} />}

          {actionText ? actionText : DELETE_RECORD}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
