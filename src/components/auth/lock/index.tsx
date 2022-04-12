// packages block
import { useContext } from "react";
import { withRouter } from "react-router";
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress } from "@material-ui/core";
// components block
import AuthLayout from "../AuthLayout";
import Alert from "../../common/Alert";
import LoginController from "../login/LoginController";
// history, context, constants, graphql, and utils
import history from "../../../history";
import { handleLogout, requiredLabel } from "../../../utils";
import { AuthContext } from "../../../context";
import { ListContext } from "../../../context/listContext";
import { loginValidationSchema } from "../../../validationSchemas";
import { LoginUserInput, useLoginMutation } from "../../../generated/graphql";
import {
  EMAIL, EMAIL_CHANGED_OR_NOT_VERIFIED_MESSAGE, EXCEPTION, FORBIDDEN_EXCEPTION,
  NOT_SUPER_ADMIN_MESSAGE, PASSWORD_LABEL, TOKEN, WRONG_EMAIL_OR_PASSWORD, DASHBOARD_ROUTE, SOMETHING_WENT_WRONG,
  LOGOUT_TEXT, UNLOCK_TEXT, ROUTE,
} from "../../../constants";

const LockComponent = (): JSX.Element => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const { fetchAllFacilityList } = useContext(ListContext);
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
            const isAdmin = userRoles.filter(role => role !== 'patient')

            if (!!isAdmin?.length) {
              localStorage.setItem(TOKEN, access_token);
              setIsLoggedIn(true);
              fetchAllFacilityList();
              const existingRoute = sessionStorage.getItem(ROUTE) ? sessionStorage.getItem(ROUTE) : DASHBOARD_ROUTE
              existingRoute && history.push(existingRoute);
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
    setIsLoggedIn(false);

    await login({
      variables: { loginUser: data }
    });
  };

  const logoutHandler = () => {
    handleLogout()
  }


  const { email: { message: emailError } = {}, password: { message: passwordError } = {} } = errors;

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <Box display='flex' justifyContent='space-between'>
          <Button variant="contained" color="inherit" onClick={logoutHandler}>
            {LOGOUT_TEXT}
          </Button>

          <Button type="submit" variant="contained" color="inherit">
            {UNLOCK_TEXT}
            {loading && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default withRouter(LockComponent);
