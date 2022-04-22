// packages block
import { FC, useState, ChangeEvent } from "react";
import {
  CardContent, Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, PropTypes, FormControlLabel,
  Checkbox, Typography, Box, TextField, FormControl, InputLabel
} from "@material-ui/core";
// interfaces/types block/theme/svgs/constants
import { DeleteWarningIcon } from "../../assets/svgs";
import { CreateTemplateTypes } from "../../interfacesTypes";
import { SUBMIT, DELETE_RECORD_LEARN_MORE_TEXT, CANCEL } from "../../constants";

const TemplateModal: FC<CreateTemplateTypes> = ({
  setOpen, isOpen, title, description, handleDelete, isLoading, actionText, success,
  formName, setFormName
}): JSX.Element => {


  const handleClose = () => {
    setOpen && setOpen(!isOpen)
  }

  const onDelete = () => {

    handleDelete()
  }

  const buttonColor: PropTypes.Color = success ? "primary" : "secondary"

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>

      <DialogContent>
        <Box >
            <Typography component="h4" variant="h5">{title}</Typography>
            <FormControl>
              <InputLabel >
                {description}
              </InputLabel>
              <TextField variant="outlined" onChange={(e) => setFormName(e.target.value)} value={formName}>
              </TextField>
            </FormControl>
            <Box display="flex" ml={4} pb={2}>

            </Box>
        </Box>
      </DialogContent>



      <DialogActions>
        <Box pr={1}>
          <Button onClick={handleClose} color="default">
            {CANCEL}
          </Button>
        </Box>

        <Button onClick={onDelete} color="secondary" disabled={isLoading} variant="contained">
          {isLoading && <CircularProgress size={20} color={buttonColor} />}

          {actionText ? actionText : SUBMIT}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateModal;
