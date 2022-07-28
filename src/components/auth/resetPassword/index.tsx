// packages block
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { Box, Typography, Button, CircularProgress } from "@material-ui/core";
// components block
import Alert from "../../common/Alert";
import AuthLayout from "../AuthLayout";
import PasswordChange from "./passwordChange";
import ResetPasswordController from "./ResetPasswordController";
// context, constants, graphql, interfaces, utils and styles block
import history from "../../../history";
import { getToken } from "../../../utils";
import { ResetPasswordInputs } from "../../../interfacesTypes";
import { useResetPasswordMutation, } from "../../../generated/graphql";
import { resetPasswordValidationSchema } from "../../../validationSchemas";
import {
  BACK_TO, LOGIN_ROUTE, RESET, RESET_PASSWORD_SUCCESS, SIGN_IN, RESET_PASSWORD_TOKEN_NOT_FOUND,
  PASSWORD_LABEL, CONFIRM_PASSWORD, ROOT_ROUTE, LOGGED_OUT_BEFORE_RESETTING_PASSWORD, PASSWORDS_MUST_MATCH
} from "../../../constants";

const ResetPasswordComponent = (): JSX.Element => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const [passwordChanged, setPasswordChanged] = useState<boolean>(false)

  const methods = useForm<ResetPasswordInputs>({
    mode: 'all',
    resolver: yupResolver(resetPasswordValidationSchema)
  });
  const { handleSubmit, reset, setError, clearErrors, watch } = methods;
  const { password, repeatPassword } = watch();

  const [resetPassword, { loading }] = useResetPasswordMutation({
    onError() {
      return null;
    },

    onCompleted() {
      reset();
      Alert.success(RESET_PASSWORD_SUCCESS);
      setPasswordChanged(true)
    }
  })

  const onSubmit: SubmitHandler<ResetPasswordInputs> = async (data) => {
    const { password } = data;
    if (token) {
      await resetPassword({ variables: { resetPassword: { password, token } } });
    }
  };

  useEffect(() => {
    if (getToken()) {
      Alert.error(LOGGED_OUT_BEFORE_RESETTING_PASSWORD)
      history.push(ROOT_ROUTE)
    } else {
      if (!token) {
        Alert.error(RESET_PASSWORD_TOKEN_NOT_FOUND)
        history.push(LOGIN_ROUTE)
      }
    }
  }, [token])

  useEffect(() => {
    password === repeatPassword || !!!repeatPassword ?
      clearErrors("repeatPassword")
      : setError("repeatPassword", { message: PASSWORDS_MUST_MATCH })
  }, [clearErrors, password, repeatPassword, setError, watch])

  return (
    passwordChanged ?
      <PasswordChange /> : <AuthLayout>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ResetPasswordController
              isPassword
              isRequired
              fieldType="password"
              controllerName="password"
              controllerLabel={PASSWORD_LABEL}
            />

            <ResetPasswordController
              isPassword
              isRequired
              fieldType="password"
              controllerName="repeatPassword"
              controllerLabel={CONFIRM_PASSWORD}
            />

            <Box py={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                {RESET}

                {loading && <CircularProgress size={20} color="inherit" />}
              </Button>
            </Box>
          </form>
        </FormProvider>

        <Box justifyContent="center" alignItems="center" display="flex">
          <Typography variant="body2">
            {BACK_TO}
          </Typography>

          <Box ml={0.5}>
            <Typography component={Link} to={ROOT_ROUTE}>{SIGN_IN}</Typography>
          </Box>
        </Box>
      </AuthLayout>
  );
};

export default ResetPasswordComponent;
