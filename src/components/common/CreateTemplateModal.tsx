// packages block
import { FC } from "react";
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, PropTypes,
  Typography, Box, TextField, FormControl, InputLabel
} from "@material-ui/core";
// interfaces/types block/theme/svgs/constants
import { CreateTemplateTypes } from "../../interfacesTypes";
import { SUBMIT, CANCEL } from "../../constants";
import { usePreviewModalStyles } from "../../styles/formbuilder/previewModalStyles";
import { ActionType } from '../../reducers/formBuilderReducer'

const TemplateModal: FC<CreateTemplateTypes> = ({
  setOpen, isOpen, title, description, handleDelete, isLoading, actionText, success,
  formName, dispatch
}): JSX.Element => {
  const classes = usePreviewModalStyles()

  const handleClose = () => setOpen && setOpen(!isOpen)
  const onDelete = () => handleDelete()
  const buttonColor: PropTypes.Color = success ? "primary" : "secondary"

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {title}
      </DialogTitle>

      <DialogContent>
        <Box className={classes.main}>
          <Typography component="h4" variant="h5">{title}</Typography>
          <Box mt={2}>
            <FormControl margin="normal" fullWidth>
              <InputLabel shrink>
                {description}
              </InputLabel>
              <TextField
                variant="outlined"
                onChange={(e) => dispatch({ type: ActionType.SET_FORM_NAME, formName: e.target.value })}
                value={formName}>
              </TextField>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Box pr={1}>
          <Button onClick={handleClose} color="default">
            {CANCEL}
          </Button>
        </Box>

        <Button onClick={onDelete} color="secondary" disabled={!Boolean(!!formName) || isLoading} variant="contained">
          {isLoading && <CircularProgress size={20} color={buttonColor} />}

          {actionText ? actionText : SUBMIT}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateModal;
