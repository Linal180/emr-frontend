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
import Doctors from "../pages/main/doctors/doctorsListing"
import AddDoctor from "../pages/main/doctors/addDoctor";
import ResetPassword from "../pages/auth/resetPassword";
import MainLayout from "../components/common/MainLayout";
import EmailVerification from "../pages/auth/verifyEmail";
import ForgetPassword from "../pages/auth/forgetPassword";
import ViewFacility from "../pages/main/facilities/viewFacility";
import Facilities from "../pages/main/facilities/facilitiesListing";
import AddFacilityComponent from "../components/main/facilities/addFacility"
import Patients from "../pages/main/patients/patientsListing";
import Appointments from "../pages/main/appointments/appointmentsListing";
import LabResults from "../pages/main/reports/labResultsListing";
import ClaimFeed from "../pages/main/billing/claimFeedListing";
import AddPatient from "../pages/main/patients/addPatient";
import AddAppointment from "../pages/main/appointments/addAppointment";
import ScheduleAppointments from "../pages/main/appointments/scheduleAppointments";
// constants
import { DASHBOARD_ROUTE, FACILITIES_ROUTE, FORGET_PASSWORD_ROUTE, LOGIN_ROUTE, RESET_PASSWORD_ROUTE, ROOT_ROUTE, STAFF_ROUTE, DOCTORS_ROUTE, VERIFY_EMAIL_ROUTE, PATIENTS_ROUTE, VIEW_APPOINTMENTS_ROUTE, LAB_RESULTS_ROUTE, CLAIMS_ROUTE, APPOINTMENTS_ROUTE, SCHEDULE_APPOINTMENTS_ROUTE } from "../constants";

const Routes: FC = (): JSX.Element => {
  return (
    <Switch>
      <PublicRoute path={LOGIN_ROUTE} component={Login} exact />
      <PublicRoute path={FORGET_PASSWORD_ROUTE} component={ForgetPassword} exact />
      <PublicRoute path={RESET_PASSWORD_ROUTE} component={ResetPassword} exact />
      <PublicRoute path={VERIFY_EMAIL_ROUTE} component={EmailVerification} exact />

      <MainLayout>
        <Switch>
          <PrivateRoute exact path={DASHBOARD_ROUTE} component={Dashboard} />
          <PrivateRoute exact path={DOCTORS_ROUTE} component={Doctors} />
          <PrivateRoute exact path={`${DOCTORS_ROUTE}/new`} component={AddDoctor} />
          <PrivateRoute exact path={PATIENTS_ROUTE} component={Patients} />
          <PrivateRoute exact path={`${PATIENTS_ROUTE}/new`} component={AddPatient} />
          <PrivateRoute exact path={VIEW_APPOINTMENTS_ROUTE} component={Appointments} />
          <PrivateRoute exact path={SCHEDULE_APPOINTMENTS_ROUTE} component={ScheduleAppointments} />
          <PrivateRoute exact path={`${APPOINTMENTS_ROUTE}/new`} component={AddAppointment} />
          <PrivateRoute exact path={LAB_RESULTS_ROUTE} component={LabResults} />
          <PrivateRoute exact path={CLAIMS_ROUTE} component={ClaimFeed} />
          <PrivateRoute exact path={STAFF_ROUTE} component={Staff} />
          <PrivateRoute exact path={`${STAFF_ROUTE}/new`} component={AddStaff} />
          <PrivateRoute exact path={`${STAFF_ROUTE}/:id`} component={ViewStaff} />
          <PrivateRoute exact path={FACILITIES_ROUTE} component={Facilities} />
          <PrivateRoute exact path={`${FACILITIES_ROUTE}/new`} component={AddFacilityComponent} />
          <PrivateRoute exact path={`${FACILITIES_ROUTE}/:id`} component={ViewFacility} />
          <PrivateRoute exact path={ROOT_ROUTE} component={Dashboard} />
        </Switch>
      </MainLayout>

      <Route component={PageNotFound} />
    </Switch>
  );
};

export default Routes;
