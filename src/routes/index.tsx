import { FC } from "react";
import { Route, Switch } from "react-router-dom";
// components
import Login from "../pages/auth/login";
import PageNotFound from "../pages/404";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import ResetPassword from "../pages/auth/resetPassword";
import EmailVerification from "../pages/auth/verifyEmail";
import ForgetPassword from "../pages/auth/forgetPassword";
// constants
import { DASHBOARD_ROUTE, FORGET_PASSWORD_ROUTE, LOGIN_ROUTE, RESET_PASSWORD_ROUTE, VERIFY_EMAIL_ROUTE } from "../constants";
import Dashboard from "../pages/main/dashboard";

const Routes: FC = (): JSX.Element => {
  return (
    <Switch>
      <PublicRoute path={LOGIN_ROUTE} component={Login} exact />
      <PublicRoute path={FORGET_PASSWORD_ROUTE} component={ForgetPassword} exact />
      <PublicRoute path={RESET_PASSWORD_ROUTE} component={ResetPassword} exact />
      <PublicRoute path={VERIFY_EMAIL_ROUTE} component={EmailVerification} exact />
      
      <PrivateRoute exact path={DASHBOARD_ROUTE} component={Dashboard} />

      <Route component={PageNotFound} />
    </Switch>
  )
}

export default Routes;
