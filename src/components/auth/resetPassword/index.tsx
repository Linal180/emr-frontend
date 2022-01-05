// packages block
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from "react-hook-form";
import { Grid, Box, Typography, Button, CircularProgress } from "@material-ui/core";
// components block
import Alert from "../../common/Alert";
import ResetPasswordController from "./ResetPasswordController";
// context, constants, graphql, interfaces, utils and styles block
import history from "../../../history";
import { requiredLabel } from "../../../utils";
import { MainLogo } from "../../../assets/svgs";
import { useLoginStyles } from "../../../styles/loginStyles";
import { ResetPasswordInputs } from "../../../interfacesTypes";
import { useResetPasswordMutation, } from "../../../generated/graphql";
import { resetPasswordValidationSchema } from "../../../validationSchemas";
import { BACK_TO, LOGIN_ROUTE, RESET, RESET_PASSWORD_MESSAGE, RESET_PASSWORD_SUCCESS, SIGN_IN, EMR_ADMIN_PORTAL, RESET_PASSWORD_TOKEN_NOT_FOUND, PASSWORD_LABEL, CONFIRM_PASSWORD } from "../../../constants";

const ResetPasswordComponent = (): JSX.Element => {
  const classes = useLoginStyles();
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
    if (!token) {
      Alert.error(RESET_PASSWORD_TOKEN_NOT_FOUND)
      history.push(LOGIN_ROUTE)
    }
  }, [token])

  const { password: { message: passwordError } = {}, repeatPassword: { message: repeatPasswordError } = {} } = errors;

  return (
    <Box className={classes.root}>
      <Box className={classes.loginFormContainer}>
        <Grid container justifyContent="center" alignItems="center">
          <MainLogo />
        </Grid>

        <Box py={2}>
          <Typography variant="h3" component="h3" color="primary" className={classes.heading}>{EMR_ADMIN_PORTAL}</Typography>
        </Box>

        <Box pb={1}>
          <Typography variant="body1">{RESET_PASSWORD_MESSAGE}</Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
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

          <Box pt={2}>
            <Button className={classes.button} type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              <Typography className={classes.buttonText}>{RESET}</Typography>

              {loading && <CircularProgress size={20} color="inherit" />}
            </Button>
          </Box>
        </form>

        <Box mt={2}>
          <Grid container justifyContent="center" alignItems="center">
            <Typography variant="body2">
              {BACK_TO}
            </Typography>
            <Link to="/" className={classes.signinLink}>{SIGN_IN}</Link>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPasswordComponent;
