// packages block
import { FC, useCallback } from "react";
import { FormProvider, useForm, } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, } from "@material-ui/core";
// components block
// interfaces/types block, theme, svgs and constants
import { createCopaySchema } from "../../validationSchemas";
import { CheckoutModalProps, CopayFields, } from "../../interfacesTypes";
import { ARE_YOU_SURE, CANCEL, CHECKOUT_MODAL_DESCRIPTION, YES_CHECKOUT } from "../../constants";

const CheckoutModal: FC<CheckoutModalProps> = ({ isOpen, setIsOpen, }): JSX.Element => {
  const methods = useForm<CopayFields>({
    mode: "all",
    resolver: yupResolver(createCopaySchema)
  });
  const { reset } = methods;

  const handleClose = useCallback(() => {
    reset();
    setIsOpen(false)
  }, [setIsOpen, reset])

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{ARE_YOU_SURE}</DialogTitle>

      <FormProvider {...methods}>
        <form>

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {CHECKOUT_MODAL_DESCRIPTION}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="default">
              {CANCEL}
            </Button>

            <Button type="submit" variant="outlined" color="primary">
              {YES_CHECKOUT}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default CheckoutModal;
