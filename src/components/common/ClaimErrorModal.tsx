// packages block
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import { FC } from "react";
import { TickIconNew, WarningIconNew } from "../../assets/svgs";
// components block
// interfaces/types block, theme, svgs and constants
import { COMPLETED, ISSUES, NO_ERROR_FOUND, OKAY } from "../../constants";
import { ClaimErrorModalProps } from "../../interfacesTypes";

const ClaimErrorModal: FC<ClaimErrorModalProps> = ({ isOpen, setIsOpen, errorMessages }): JSX.Element => {
  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="claim-error-dialog"
    >
      <DialogTitle id="alert-dialog-title">
        <Box display='flex' alignItems='center'>
          {errorMessages?.length ? <WarningIconNew /> : <TickIconNew />}
          <Box p={1} />
          <Typography variant="h4">{errorMessages?.length ? ISSUES: COMPLETED}</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box className="dialogBg">
          {errorMessages && errorMessages?.length ?
            <ul>
              {errorMessages?.map((val) => {
                return !val?.trim() ? <></>
                  : (
                    <li key={val}>
                      <Typography variant="body2">{val}</Typography>
                    </li>
                  )
              })}
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
