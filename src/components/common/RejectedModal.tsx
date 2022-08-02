// packages block
import { FC, useCallback } from "react";
import { FormProvider, useForm, } from "react-hook-form";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, } from "@material-ui/core";
// components block
// interfaces/types block, theme, svgs and constants
import { CopayFields, RejectedModalProps, } from "../../interfacesTypes";
import { ISSUES, OKAY, } from "../../constants";

const RejectedModal: FC<RejectedModalProps> = ({ isOpen, setIsOpen, }): JSX.Element => {
  const methods = useForm<CopayFields>({
    mode: "all",
  });
  const { reset } = methods;

  const handleClose = useCallback(() => {
    reset();
    setIsOpen(false)
  }, [setIsOpen, reset])

  return (
    <Dialog
      maxWidth="sm"
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
              <ul>
                <li>Insurance ID is not valid</li>
                <li>CPT code “1b2.2” should be replaces by “1b2.20”</li>
                <li>Tax ID field is mandatory</li>
              </ul>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button variant="contained" color="primary">
              {OKAY}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default RejectedModal;
