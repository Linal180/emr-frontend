import { FC } from "react";
import { Route, Switch } from "react-router-dom";
// components
import Login from "../pages/auth/login";
import PageNotFound from "../pages/404";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/main/dashboard";
import AddStaff from "../pages/main/staff/addStaff";
import Staff from "../pages/main/staff/staffListing";
import ViewStaff from "../pages/main/staff/viewStaff";
import ResetPassword from "../pages/auth/resetPassword";
import MainLayout from "../components/common/MainLayout";
import EmailVerification from "../pages/auth/verifyEmail";
import ForgetPassword from "../pages/auth/forgetPassword";
import Facilities from "../pages/main/facilities/facilitiesListing";
import AddFacilityComponent from "../components/main/facilities/addFacility"
// constants
import { DASHBOARD_ROUTE, FACILITIES_ROUTE, FORGET_PASSWORD_ROUTE, LOGIN_ROUTE, RESET_PASSWORD_ROUTE, ROOT_ROUTE, STAFF_ROUTE, VERIFY_EMAIL_ROUTE } from "../constants";

const Routes: FC = (): JSX.Element => {
  return (
    <MainLayout>
      <Switch>
        <PublicRoute path={LOGIN_ROUTE} component={Login} exact />
        <PublicRoute path={FORGET_PASSWORD_ROUTE} component={ForgetPassword} exact />
        <PublicRoute path={RESET_PASSWORD_ROUTE} component={ResetPassword} exact />
        <PublicRoute path={VERIFY_EMAIL_ROUTE} component={EmailVerification} exact />

        <PrivateRoute exact path={DASHBOARD_ROUTE} component={Dashboard} />
        <PrivateRoute exact path={FACILITIES_ROUTE} component={Facilities} />
        <PrivateRoute exact path={STAFF_ROUTE} component={Staff} />
        <PrivateRoute exact path={`${STAFF_ROUTE}/new`} component={AddStaff} />
        <PrivateRoute exact path={`${STAFF_ROUTE}/:id`} component={ViewStaff} />


        <PrivateRoute exact path={`${FACILITIES_ROUTE}/new`} component={AddFacilityComponent} />
        <PrivateRoute exact path={ROOT_ROUTE} component={Dashboard} />

        <Route component={PageNotFound} />3
      </Switch>
    </MainLayout>
  );
};

export default Routes;
