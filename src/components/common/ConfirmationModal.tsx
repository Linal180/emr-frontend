// packages block
import { FC, useState, ChangeEvent } from "react";
import { Card, CardContent, Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, PropTypes, Divider, FormControlLabel, Checkbox, Typography, Box } from "@material-ui/core";
// interfaces/types block/theme/svgs
import { ConfirmationTypes } from "../../interfacesTypes";
import { DeleteWarningIcon } from "../../assets/svgs";

const ConfirmationModal: FC<ConfirmationTypes> = ({ setOpen, isOpen, title, description, handleDelete, isLoading, actionText, success }): JSX.Element => {
  const [state, setState] = useState({
    confirmDelete: false,
  })
  const handleChange = (name: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [name]: event.target.checked });
  };
  const handleClose = () => setOpen && setOpen(!isOpen)
  const buttonColor: PropTypes.Color = success ? "primary" : "secondary"

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <Divider />
      <DialogContent>
        <Card>
          <Box display="flex">
            <DeleteWarningIcon />
            <CardContent>
              <Typography>
                You are about delete record</Typography>
              <Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisl scelerisque convallis ante vivamus amet non. Learn more</Typography>
            </CardContent>
          </Box>
        </Card>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.confirmDelete}
              onChange={handleChange("confirmDelete")}
            />
          }
          label={description}
        />
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleClose} color="default">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="primary" disabled={!state.confirmDelete} variant="contained">
          {isLoading ? (
            <CircularProgress size={20} color={buttonColor} />
          ) : <>
            {actionText ? actionText : "Delete"}
          </>
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
