// packages block
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import { FC, useCallback } from "react";
import { TickIconNew, WarningIconNew } from "../../assets/svgs";
// components block
// interfaces/types block, theme, svgs and constants
import { CLAIM_SUCCESS_MESSAGES, COMPLETED, ISSUES, NO_ERROR_FOUND, OKAY } from "../../constants";
import { ClaimErrorModalProps } from "../../interfacesTypes";

const ClaimErrorModal: FC<ClaimErrorModalProps> = ({ isOpen, setIsOpen, errorMessages }): JSX.Element => {
  const handleClose = () => {
    setIsOpen(false)
  }

  const getHeaderIcon = useCallback(() => {
    if (!errorMessages?.length) {
      return <TickIconNew />
    }

    if (CLAIM_SUCCESS_MESSAGES.includes(errorMessages[0])) {
      return <TickIconNew />
    }

    return <WarningIconNew />
  }, [errorMessages])

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
          {getHeaderIcon()}
          <Box p={1} />
          <Typography variant="h4">{CLAIM_SUCCESS_MESSAGES.includes(errorMessages?.[0] || '') ? COMPLETED: ISSUES}</Typography>
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
