// packages block
import { FC, useContext } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Button, Dialog, CircularProgress, PropTypes, Typography, Box, Grid } from "@material-ui/core";
// common block
import Alert from "./Alert";
// interfaces/types block/theme/svgs/constants
import { AuthContext } from "../../context";
import InputController from "../../controller";
import { useHeaderStyles } from "../../styles/headerStyles";
import { useResentOtpMutation, useVerifyOtpMutation } from "../../generated/graphql";
import { DELETE_RECORD, CANCEL, CANT_CANCELLED_APPOINTMENT, ERROR, RESEND_OTP } from "../../constants";
import { ConfirmationAuthenticationTypes, VerifyCodeInputProps } from "../../interfacesTypes";
import { yupResolver } from "@hookform/resolvers/yup";
import { otpSchema } from "../../validationSchemas";

const ConfirmationAuthenticationModal: FC<ConfirmationAuthenticationTypes> = ({
  setOpen, isOpen, title, description, success, actionText
}): JSX.Element => {
  const { user } = useContext(AuthContext)
  const { id } = user || {}
  const classes = useHeaderStyles()
  const methods = useForm<VerifyCodeInputProps>({
    defaultValues: {
      otpCode: ''
    }, resolver: yupResolver(otpSchema)
  });
  const { handleSubmit, formState: { errors } } = methods;

  const [verifyOtp, { loading: verifyOtpLoading }] = useVerifyOtpMutation({
    onError() {
      Alert.error(CANT_CANCELLED_APPOINTMENT)
      setOpen && setOpen(false)
    },

    async onCompleted(data) {
      if (data) {
        const { verifyOTP: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          setOpen && setOpen(false)
        }
      }
    }
  });

  const [resentOtp, { loading: resentOtpLoading }] = useResentOtpMutation({
    onError() {
      Alert.error(ERROR)
    },

    async onCompleted(data) {
      if (data) {
        const { resentOTP: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
        }
      }
    }
  });

  const handleResendOtp = async () => {
    id && await resentOtp({
      variables: {
        seneOTPAgainInput: {
          id
        }
      }
    })
  };

  const handleClose = () => {
    setOpen && setOpen(!isOpen)
  }

  const onSubmit: SubmitHandler<VerifyCodeInputProps> = async (inputs) => {
    const { otpCode } = inputs

    id && await verifyOtp({
      variables: {
        verifyCodeInput: {
          id, otpCode
        }
      }
    })
  }


  const buttonColor: PropTypes.Color = success ? "primary" : "secondary"

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {JSON.stringify(errors)}
          <Box ml={4} mt={2}>
            <Typography variant="h4">
              {title}
            </Typography>

            <Typography variant="h5">
              {description}
            </Typography>

            <Grid container spacing={3}>
              <Grid item md={8}>
                <InputController
                  fieldType="text"
                  controllerName="otpCode"
                />
              </Grid>

              <Grid item md={4}>
                <Typography onClick={handleResendOtp} className={classes.resendBtn}>
                  {resentOtpLoading && <CircularProgress size={20} color={buttonColor} />}
                  {RESEND_OTP}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box pr={1} display='flex'>
            <Button onClick={handleClose} color="default">
              {CANCEL}
            </Button>

            <Button type="submit" color="primary" variant="contained">
              {verifyOtpLoading && <CircularProgress size={20} color={buttonColor} />}

              {actionText ? actionText : DELETE_RECORD}
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ConfirmationAuthenticationModal;
