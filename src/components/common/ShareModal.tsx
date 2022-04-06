// packages block
import { FC } from "react";
import { CardContent, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box } from "@material-ui/core";
// interfaces/types block/theme/svgs/constants
import { ShareModalTypes } from "../../interfacesTypes";
import { FORM_COPY, CANCEL } from "../../constants";

const ShareModal: FC<ShareModalTypes> = ({ setOpen, isOpen, title, description, handleCopy, actionText }): JSX.Element => {

  const handleClose = () => {
    setOpen && setOpen(!isOpen)
  }

  const onCopy = () => {
    handleCopy()
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="alert-dialog-title">
        {title || ''}
      </DialogTitle>
      <DialogContent>
        <Box display="flex">
          <CardContent>
            <Typography component="h4" variant="h5">
              {description}
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

        <Button onClick={onCopy} color="secondary" variant="contained">

          {actionText ? actionText : FORM_COPY}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareModal;
