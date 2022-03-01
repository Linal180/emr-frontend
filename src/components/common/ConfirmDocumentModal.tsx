// packages block
import { FC } from "react";
import dotenv from 'dotenv';
import {
  Button, Dialog, DialogActions, DialogTitle, DialogContent, Box, Typography, IconButton
} from "@material-ui/core";
// constants and interfaces block
import { DocumentUploadIcon } from "../../assets/svgs";
import { DocumentModalComponentType } from "../../interfacesTypes";
import { useDocumentModalStyles } from "../../styles/documentModalStyles";
import { CANCEL, UPLOAD, UPLOADS_DOCUMENT, UPLOADS_DOCUMENT_LEARN_MORE_TEXT } from "../../constants";

dotenv.config()

const ConfirmDocumentModal: FC<DocumentModalComponentType> = ({ isOpen, setOpen }): JSX.Element => {
  const classes = useDocumentModalStyles();

  const handleClose = () => setOpen && setOpen(!isOpen);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="image-dialog-title"
      aria-describedby="image-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{UPLOADS_DOCUMENT}</DialogTitle>

      <DialogContent className={classes.modalContent}>
        <IconButton>
          <DocumentUploadIcon />
        </IconButton>

        <Typography>{UPLOADS_DOCUMENT_LEARN_MORE_TEXT}</Typography>
      </DialogContent>

      <DialogActions className={classes.modalActions}>
        <Box pr={1}>
          <Button onClick={handleClose} variant="outlined" color="default">{CANCEL}</Button>
        </Box>

        <Button color="primary" variant="contained">{UPLOAD}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDocumentModal;
