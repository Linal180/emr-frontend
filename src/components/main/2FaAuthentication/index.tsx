// packages block
import { useContext, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
// common block
import Alert from "../../common/Alert";
import history from "../../../history";
import AuthLayout from '../../auth/AuthLayout';
// interfaces/types block/theme/svgs/constants
import InputController from "../../../controller";
import { otpSchema } from "../../../validationSchemas";
import { AuthContext, ListContext } from "../../../context";
import { useHeaderStyles } from "../../../styles/headerStyles";
import { ParamsType, VerifyCodeInputProps } from "../../../interfacesTypes";
import { useResentOtpMutation, useVerifyOtpMutation } from "../../../generated/graphql";
import { ERROR, RESEND_OTP, DASHBOARD_ROUTE, LOGIN_SUCCESSFULLY, SIGN_IN, ENTER_OTP_CODE, OTP_NOT_FOUND_EXCEPTION_MESSAGE, OTP_WRONG_MESSAGE, TOKEN, LOGIN_ROUTE } from "../../../constants";
import { useParams } from "react-router";

const TwoFaAuthenticationComponent = (): JSX.Element => {
  const { setIsLoggedIn } = useContext(AuthContext)
  const { id: userId } = useParams<ParamsType>();
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const { fetchAllFacilityList } = useContext(ListContext)
  const classes = useHeaderStyles()
  const methods = useForm<VerifyCodeInputProps>({
    defaultValues: {
      otpCode: ''
    }, resolver: yupResolver(otpSchema)
  });
  const { handleSubmit } = methods;

  const [verifyOtp, { loading: verifyOtpLoading }] = useVerifyOtpMutation({
    onError({ message }) {
      message === OTP_NOT_FOUND_EXCEPTION_MESSAGE ?
        Alert.error(OTP_WRONG_MESSAGE)
        :
        Alert.error(message)
    },

    async onCompleted(data) {
      if (data) {
        const { verifyOTP: { response } } = data

        if (response) {
          token && localStorage.setItem(TOKEN, token);
          setIsLoggedIn(true)
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
    userId && await resentOtp({
      variables: {
        seneOTPAgainInput: {
          id: userId
        }
      }
    })
  };

  const onSubmit: SubmitHandler<VerifyCodeInputProps> = async (inputs) => {
    const { otpCode } = inputs
    userId && await verifyOtp({
      variables: {
        verifyCodeInput: {
          id: userId, otpCode
        }
      }
    })
  }

  useEffect(() => {
    if (!userId || !token) {
      history.push(LOGIN_ROUTE)
    }
  }, [token, userId])

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
              {resentOtpLoading && <CircularProgress size={20} color='inherit' />}
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
