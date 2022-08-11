// packages block
import { FC } from "react";
import { FormProvider, useForm, } from "react-hook-form";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, } from "@material-ui/core";
// components block
// interfaces/types block, theme, svgs and constants
import { ISSUES, NO_ERROR_FOUND, OKAY } from "../../constants";
import { CopayFields, RejectedModalProps, } from "../../interfacesTypes";

const RejectedModal: FC<RejectedModalProps> = ({ isOpen, setIsOpen, billingClaim }): JSX.Element => {
  const methods = useForm<CopayFields>({
    mode: "all",
  });
  const { reset } = methods;
  const { claim } = billingClaim || {}
  const { errorMessages } = claim || {}

  const handleClose = () => {
    reset();
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

      <FormProvider {...methods}>
        <form>
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
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default RejectedModal;
