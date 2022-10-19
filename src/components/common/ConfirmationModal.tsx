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
import { aboutToCancel, aboutToDelete, aboutToDischarge, aboutToSign, cancelRecordTitle, deleteRecordTitle } from "../../utils";
import {
  DELETE_RECORD, DELETE_RECORD_LEARN_MORE_TEXT, CANCEL, SIGN_RECORD_LEARN_MORE_TEXT, SIGN_PATIENT_DOCUMENT, CANCEL_RECORD_LEARN_MORE_TEXT, CONFIRMATION_MODAL_TYPE, DISCHARGE_MODAL_PATIENT_DESCRIPTION
} from "../../constants";

const ConfirmationModal: FC<ConfirmationTypes> = ({
  setOpen, isOpen, title, description, handleDelete, isLoading, actionText, success, isSign, isCalendar,
  onSignatureEnd, cancelText, shouldDisplayCancel, modalType
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

  const buttonColor: PropTypes.Color = success ? "primary" : "secondary";

  const getAboutDescription = () => {
    if (isSign)
      return aboutToSign(title || '')
    else if (isCalendar)
      return aboutToCancel(title || '')
    else if (shouldDisplayCancel)
      return aboutToCancel(title || '')
    else if (modalType === CONFIRMATION_MODAL_TYPE.DISCHARGE)
      return aboutToDischarge(title || "")
    else
      return aboutToDelete(title || '')
  }

  const getTitle = () => {
    if (isSign)
      return SIGN_PATIENT_DOCUMENT
    else if (isCalendar)
      return cancelRecordTitle(title || '')
    else if (shouldDisplayCancel)
      return cancelRecordTitle(title || '')
    else if (modalType === CONFIRMATION_MODAL_TYPE.DISCHARGE)
      return title
    else
      return deleteRecordTitle(title || '')
  }

  const getDescription = () => {
    if (isSign)
      return SIGN_RECORD_LEARN_MORE_TEXT
    else if (isCalendar)
      return CANCEL_RECORD_LEARN_MORE_TEXT
    else if (shouldDisplayCancel)
      return CANCEL_RECORD_LEARN_MORE_TEXT
    else if (modalType === CONFIRMATION_MODAL_TYPE.DISCHARGE)
      return DISCHARGE_MODAL_PATIENT_DESCRIPTION
    else
      return DELETE_RECORD_LEARN_MORE_TEXT
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="alert-dialog-title">
        {getTitle()}
      </DialogTitle>

      <DialogContent>
        <Box display="flex">
          <Box width={35} pt={0.75}>
            <DeleteWarningIcon />
          </Box>

          <Box flex={1}>
            <CardContent>
              <Typography variant="h5">
                <strong>{getAboutDescription()}</strong>
              </Typography>

              <Box p={0.5} />

              <Typography variant="body1">
                {getDescription()}
              </Typography>
            </CardContent>
          </Box>
        </Box>
      </DialogContent>


      {isSign ? <Box display="flex" ml={4} pb={2} mr={4}>
        <Signature controllerName="signature" onSignatureEnd={(file) => {
          setChecked(!!file)
          onSignatureEnd && onSignatureEnd(file)
        }} isController={false} />
      </Box> :
        <Box display="flex" ml={4} pb={2}><FormControlLabel
          control={<Checkbox color="primary" checked={checked} onChange={handleChange} />}
          label={description}
        />
        </Box>}

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
