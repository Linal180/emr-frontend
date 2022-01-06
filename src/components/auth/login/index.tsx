// packages block
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid, Typography } from "@material-ui/core";
// components block
import Alert from "../../common/Alert";
import LoginController from "./LoginController";
// history, context, constants, graphql, and utils
import history from "../../../history";
import { requiredLabel } from "../../../utils";
import { AuthContext } from "../../../context";
import { MainLogo } from "../../../assets/svgs";
import { useLoginStyles } from "../../../styles/loginStyles";
import { loginValidationSchema } from "../../../validationSchemas";
import { LoginUserInput, useLoginMutation } from "../../../generated/graphql";
import { ADMIN, EMR_ADMIN_PORTAL, ADMIN_PORTAL_MESSAGE, EMAIL, EMAIL_CHANGED_OR_NOT_VERIFIED_MESSAGE, EXCEPTION, FORBIDDEN_EXCEPTION, FORGET_PASSWORD_ROUTE, FORGOT_PASSWORD, NOT_SUPER_ADMIN_MESSAGE, PASSWORD_LABEL, SIGN_IN, SUPER_ADMIN, TOKEN, WRONG_EMAIL_OR_PASSWORD, DASHBOARD_ROUTE, SOMETHING_WENT_WRONG, LOGIN_SUCCESSFULLY } from "../../../constants";

const LoginComponent = (): JSX.Element => {
  const classes = useLoginStyles();
  const { setIsLoggedIn } = useContext(AuthContext);
  const { control, handleSubmit, formState: { errors } } = useForm<LoginUserInput>({
    defaultValues: {
      email: "",
      password: "",
    },

    resolver: yupResolver(loginValidationSchema)
  });

  const [login, { loading }] = useLoginMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION || message === EXCEPTION)
        return Alert.error(EMAIL_CHANGED_OR_NOT_VERIFIED_MESSAGE)
    },

    onCompleted(data) {
      if (data) {
        const { login: { response, access_token, roles } } = data
        if (response) {
          const { status } = response

          if (status === 404) {
            return Alert.error(WRONG_EMAIL_OR_PASSWORD);
          }

          if (status === 200 && access_token && roles) {
            const userRoles = roles.map(role => role.role)
            const isAdmin = userRoles.filter(role => role === SUPER_ADMIN || role === ADMIN)

            if (!!isAdmin?.length) {
              localStorage.setItem(TOKEN, access_token);
              setIsLoggedIn(true);

              Alert.success(LOGIN_SUCCESSFULLY)
              history.push(DASHBOARD_ROUTE);
            } else {
              Alert.error(NOT_SUPER_ADMIN_MESSAGE)
            }
          } else {
            Alert.error(SOMETHING_WENT_WRONG)
          }
        }
      }
    }
  });

  const onSubmit: SubmitHandler<LoginUserInput> = async (data) => {
    await login({
      variables: {
        loginUser: data,
      },
    });
  };

  useEffect(() => {
    localStorage.getItem(TOKEN) && history.push(DASHBOARD_ROUTE)
  }, []);

  const { email: { message: emailError } = {}, password: { message: passwordError } = {} } = errors;

  return (
    <Box className={classes.root}>
      <Box className={classes.loginFormContainer}>
        <Grid container justifyContent="center" alignItems="center">
          <MainLogo />
        </Grid>

        <Box py={1}>
          <Typography variant="h3" component="h3" className={classes.heading} color="primary">{EMR_ADMIN_PORTAL}</Typography>
        </Box>

        <Box pb={1}>
          <Typography variant="body2" className={classes.body}>{ADMIN_PORTAL_MESSAGE}</Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <LoginController
            control={control}
            controllerName="email"
            controllerLabel={requiredLabel(EMAIL)}
            fieldType="email"
            error={emailError}
          />

          <LoginController
            control={control}
            controllerName="password"
            isPassword={true}
            controllerLabel={requiredLabel(PASSWORD_LABEL)}
            fieldType="password"
            error={passwordError}
          />

          <Box mt={1} mb={2}>
            <Link to={FORGET_PASSWORD_ROUTE} className={classes.subHeading}>{FORGOT_PASSWORD}</Link>
          </Box>

          <Box mt={2}>
            <Button className={classes.button} type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              <Typography className={classes.buttonText}>{SIGN_IN}</Typography>

              {loading && <CircularProgress size={20} color="inherit" />}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default withRouter(LoginComponent);
