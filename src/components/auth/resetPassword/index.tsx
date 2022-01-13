// packages block
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Typography, Button, CircularProgress } from "@material-ui/core";
// components block
import Alert from "../../common/Alert";
import ResetPasswordController from "./ResetPasswordController";
import AuthLayout from "../AuthLayout";
// context, constants, graphql, interfaces, utils and styles block
import history from "../../../history";
import { getToken, requiredLabel } from "../../../utils";
import { ResetPasswordInputs } from "../../../interfacesTypes";
import { useResetPasswordMutation, } from "../../../generated/graphql";
import { resetPasswordValidationSchema } from "../../../validationSchemas";
import { BACK_TO, LOGIN_ROUTE, RESET, RESET_PASSWORD_SUCCESS, SIGN_IN, RESET_PASSWORD_TOKEN_NOT_FOUND, PASSWORD_LABEL, CONFIRM_PASSWORD, ROOT_ROUTE, LOGGED_OUT_BEFORE_RESETTING_PASSWORD } from "../../../constants";

const ResetPasswordComponent = (): JSX.Element => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const { handleSubmit, reset, control, formState: { errors } } = useForm<ResetPasswordInputs>({
    mode: 'all',
    resolver: yupResolver(resetPasswordValidationSchema)
  });

  const [resetPassword, { loading }] = useResetPasswordMutation({
    onError() {
      return null;
    },

    onCompleted() {
      reset();
      Alert.success(RESET_PASSWORD_SUCCESS);
      history.push(LOGIN_ROUTE)
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

  const { password: { message: passwordError } = {}, repeatPassword: { message: repeatPasswordError } = {} } = errors;

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ResetPasswordController
          control={control}
          controllerName="password"
          controllerLabel={requiredLabel(PASSWORD_LABEL)}
          fieldType="password"
          isPassword
          error={passwordError}
        />

        <ResetPasswordController
          control={control}
          controllerName="repeatPassword"
          controllerLabel={requiredLabel(CONFIRM_PASSWORD)}
          fieldType="password"
          isPassword
          error={repeatPasswordError}
        />

        <Box py={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {RESET}
            {loading && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>
      </form>

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
