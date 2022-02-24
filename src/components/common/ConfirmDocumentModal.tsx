// packages block
import { FC, useState, ChangeEvent } from "react";
import { CardContent, Button, Dialog, DialogActions, DialogContent, DialogTitle, PropTypes, Typography, Box } from "@material-ui/core";
// interfaces/types block/theme/svgs/constants
import { DeleteWarningIcon } from "../../assets/svgs";
import { ConfirmationTypes } from "../../interfacesTypes";
import { aboutToDelete } from "../../utils";
import { DELETE_RECORD_LEARN_MORE_TEXT, CANCEL, UPLOADS_DOCUMENT, UPLOAD } from "../../constants";

const ConfirmDocumentModal: FC<ConfirmationTypes> = ({ setOpen, isOpen, title, description, handleDelete, isLoading, actionText, success }): JSX.Element => {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleClose = () => {
    setChecked(false)
    setOpen && setOpen(!isOpen)
  }

  const buttonColor: PropTypes.Color = success ? "primary" : "secondary"

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="alert-dialog-title">
        { UPLOADS_DOCUMENT }
      </DialogTitle>

      <DialogContent>
        <Box display="flex">
          <Box pt={0.75}>
            <DeleteWarningIcon />
          </Box>

          <CardContent>
            <Typography component="h4" variant="h5">{aboutToDelete(title || '')}</Typography>

            <Typography>
              {DELETE_RECORD_LEARN_MORE_TEXT}
            </Typography>
          </CardContent>
        </Box>
      </DialogContent>

      <DialogActions>
        <Box pr={1}>
          <Button onClick={handleClose} color="default">
            {CANCEL}
          </Button>
        </Box>

        <Button color="primary" variant="contained">
          {UPLOAD}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDocumentModal;
