// packages block
import { useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
// common block
import Alert from "../../common/Alert";
import history from "../../../history";
import AuthLayout from '../../auth/AuthLayout';
// interfaces/types block/theme/svgs/constants
import { handleLogout } from "../../../utils";
import InputController from "../../../controller";
import { otpSchema } from "../../../validationSchemas";
import { AuthContext, ListContext } from "../../../context";
import { useHeaderStyles } from "../../../styles/headerStyles";
import { useResentOtpMutation, useVerifyOtpMutation } from "../../../generated/graphql";
import { VerifyCodeInputProps } from "../../../interfacesTypes";
import { CANT_CANCELLED_APPOINTMENT, ERROR, RESEND_OTP, DASHBOARD_ROUTE, LOGIN_SUCCESSFULLY, SIGN_IN, ENTER_OTP_CODE } from "../../../constants";

const TwoFaAuthenticationComponent = (): JSX.Element => {
  const { user } = useContext(AuthContext)
  const { id } = user || {}
  const { fetchAllFacilityList } = useContext(ListContext)
  const classes = useHeaderStyles()
  const methods = useForm<VerifyCodeInputProps>({
    defaultValues: {
      otpCode: ''
    }, resolver: yupResolver(otpSchema)
  });
  const { handleSubmit } = methods;

  const [verifyOtp, { loading: verifyOtpLoading }] = useVerifyOtpMutation({
    onError() {
      Alert.error(CANT_CANCELLED_APPOINTMENT)
      handleLogout()
    },

    async onCompleted(data) {
      if (data) {
        const { verifyOTP: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          fetchAllFacilityList();
          Alert.success(LOGIN_SUCCESSFULLY)
          history.push(DASHBOARD_ROUTE);
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

  return (
    <AuthLayout>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputController
            isRequired
            fieldType="text"
            controllerName="otpCode"
            controllerLabel={ENTER_OTP_CODE}
          />
          <Box display='flex' justifyContent='flex-end'>
            <Typography onClick={handleResendOtp} className={classes.resendBtn}>
              {resentOtpLoading && <CircularProgress size={20} color='primary' />}
              {RESEND_OTP}
            </Typography>
          </Box>

          <Button type="submit" variant="contained" color="inherit" fullWidth disabled={verifyOtpLoading}>
            {SIGN_IN}

            {verifyOtpLoading && <CircularProgress size={20} color="inherit" />}
          </Button>
        </form>
      </FormProvider>
    </AuthLayout>
  )
};

export default TwoFaAuthenticationComponent;
