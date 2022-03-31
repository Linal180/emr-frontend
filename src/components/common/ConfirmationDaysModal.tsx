// packages block
import { FC } from "react";
import {
  CardContent, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box
} from "@material-ui/core";
// interfaces/types block/theme/svgs/constants
import { ConfirmationDaysTypes } from "../../interfacesTypes";
import { CANCEL } from "../../constants";

const ConfirmationModal: FC<ConfirmationDaysTypes> = ({
  setOpen, isOpen, title, isLoading, actionText, success
}): JSX.Element => {
  const handleClose = () => {
    setOpen && setOpen(!isOpen)
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>

      <DialogContent>
        <Box display="flex">
          <CardContent>
            <Typography component="h4" variant="h5">{title}</Typography>
          </CardContent>
        </Box>
      </DialogContent>

      <Box display="flex" ml={4} pb={2}>
        hello
      </Box>

      <DialogActions>
        <Box pr={1}>
          <Button onClick={handleClose} color="default">
            {CANCEL}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
