// packages block
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import { FC } from "react";
// components block
// interfaces/types block, theme, svgs and constants
import { ISSUES, NO_ERROR_FOUND, OKAY } from "../../constants";
import { ClaimErrorModalProps } from "../../interfacesTypes";

const ClaimErrorModal: FC<ClaimErrorModalProps> = ({ isOpen, setIsOpen, errorMessages }): JSX.Element => {
  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{ISSUES}</DialogTitle>
      <DialogContent>
        <Box className="dialogBg">
          {errorMessages && errorMessages?.length ?
            <ul>
              {errorMessages?.map((val) => (
                <li>{val}</li>
              ))}
            </ul> : <Typography>
              {NO_ERROR_FOUND}
            </Typography>
          }
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleClose}>
          {OKAY}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClaimErrorModal;
