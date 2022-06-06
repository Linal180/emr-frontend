// packages block
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress, Dialog, Grid } from "@material-ui/core";
import { FC, useCallback } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
// components block
import CardComponent from "./CardComponent";
import Selector from "./Selector";
import Alert from "./Alert";
import InputController from "../../controller";
// interfaces/types block, theme, svgs and constants
import { ADD_COPAY, AMOUNT_WITH_DOLLAR, CANCEL, COPAY_TYPE, CREATE_COPAY, EMAIL_OR_USERNAME_ALREADY_EXISTS, FORBIDDEN_EXCEPTION, MAPPED_COPAY_TYPE } from "../../constants";
import { CopayType, PatientBillingStatus, useCreateCopayMutation } from "../../generated/graphql";
import { CopayFields, CopayModalProps, CreateBillingProps } from "../../interfacesTypes";
import { createCopaySchema } from "../../validationSchemas";

const CopayModal: FC<CopayModalProps> = ({ isOpen, setIsOpen, insuranceId }): JSX.Element => {
  const methods = useForm<CopayFields>({
    mode: "all",
    resolver: yupResolver(createCopaySchema)
  });
  const { reset, handleSubmit, watch: childWatch } = methods;
  const { amount: copayAmount } = childWatch()

  const { watch, setValue } = useFormContext<CreateBillingProps>()
  const { amount, billingStatus } = watch()
  const { id: billingStatusId } = billingStatus ?? {}

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
    if (billingStatusId === PatientBillingStatus.BillInsurance) {
      if (insuranceId) {
        createCopay({
          variables: {
            createCopayInput: {
              policyId: insuranceId,
              amount: inputs.amount,
              type: inputs.copayType?.id as CopayType ?? ''
            }
          }
        })
      }
      return
    }
    setValue('amount', String(Number(amount) + Number(inputs.amount)))
    setIsOpen(false)
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardComponent cardTitle={ADD_COPAY}>
            <Grid container spacing={3}>
              <Grid item md={12} sm={12} xs={12}>
                <Selector
                  isRequired
                  addEmpty
                  name="copayType"
                  label={COPAY_TYPE}
                  options={MAPPED_COPAY_TYPE}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  fieldType="number"
                  controllerName="amount"
                  controllerLabel={AMOUNT_WITH_DOLLAR}
                />
              </Grid>
            </Grid>
          </CardComponent>

          <Box pb={2} display='flex' justifyContent='flex-end' alignItems='center' pr={4}>
            <Button onClick={handleClose} color="default">
              {CANCEL}
            </Button>

            <Box p={1} />

            <Button type="submit" variant="contained" color="primary"
              disabled={createCopayLoading}
            >
              {CREATE_COPAY}

              {createCopayLoading && <CircularProgress size={20} color="inherit" />}
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default CopayModal
