// packages block
import { FC, useCallback } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import {
  Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography,
} from "@material-ui/core";
// components block
import Alert from "./Alert";
import Selector from "./Selector";
import InputController from "../../controller";
// interfaces/types block, theme, svgs and constants
import { createCopaySchema } from "../../validationSchemas";
import { CopayType, useCreateCopayMutation } from "../../generated/graphql";
import { CopayFields, CopayModalProps, CreateBillingProps } from "../../interfacesTypes";
import {
  ADD_COPAY, AMOUNT_WITH_DOLLAR, CANCEL, COPAY_TYPE, CREATE_COPAY, EMAIL_OR_USERNAME_ALREADY_EXISTS,
  FORBIDDEN_EXCEPTION, MAPPED_COPAY_TYPE
} from "../../constants";

const CopayModal: FC<CopayModalProps> = ({ isOpen, setIsOpen, insuranceId }): JSX.Element => {
  const methods = useForm<CopayFields>({
    mode: "all",
    resolver: yupResolver(createCopaySchema)
  });
  const { reset, handleSubmit, watch: childWatch } = methods;
  const { amount: copayAmount } = childWatch()

  const { watch, setValue } = useFormContext<CreateBillingProps>()
  const { amount } = watch()

  const handleClose = useCallback(() => {
    reset();
    setIsOpen(false)
  }, [setIsOpen, reset])


  const [createCopay, { loading: createCopayLoading }] = useCreateCopayMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      if (data) {
        setValue('amount', String(Number(amount) + Number(copayAmount)))
        setIsOpen(false)
      }
    }
  });

  const onSubmit: SubmitHandler<CopayFields> = async (inputs) => {
    // if (billingStatusId === PatientBillingStatus.BillInsurance) {
    if (insuranceId) {
      createCopay({
        variables: {
          createCopayInput: {
            policyId: insuranceId, amount: String(inputs.amount),
            type: inputs.copayType?.id as CopayType ?? ''
          }
        }
      })
      return
    }

    setValue('amount', String(Number(amount) + Number(inputs.amount)))
    setIsOpen(false)
    return
  }
  //   setValue('amount', String(Number(amount) + Number(inputs.amount)))
  //   setIsOpen(false)
  // };

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleClose}
      aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
        <Typography variant="h4">{ADD_COPAY}</Typography>
      </DialogTitle>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box className="dialogBg">
              <Selector
                isRequired
                addEmpty
                name="copayType"
                label={COPAY_TYPE}
                options={MAPPED_COPAY_TYPE}
              />

              <InputController
                fieldType="number"
                controllerName="amount"
                controllerLabel={AMOUNT_WITH_DOLLAR}
              />
            </Box>
          </DialogContent>

          <DialogActions>
            <Box display='flex' justifyContent='flex-end' alignItems='center'>
              <Button onClick={handleClose} color="default">
                {CANCEL}
              </Button>

              <Box p={1} />

              <Button type="submit" variant="contained" color="primary" disabled={createCopayLoading}>
                {CREATE_COPAY}
                {createCopayLoading && <CircularProgress size={20} color="inherit" />}
              </Button>
            </Box>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog >
  );
};

export default CopayModal
