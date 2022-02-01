import { FC, useContext } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
// components
import Login from "../pages/auth/login";
import PageNotFound from "../pages/404";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import Settings from "../pages/main/settings";
import Dashboard from "../pages/main/dashboard";
import AddStaff from "../pages/main/staff/addStaff";
import AddBill from "../pages/main/billing/addBill";
import Staff from "../pages/main/staff/staffListing";
import ViewStaff from "../pages/main/staff/viewStaff";
import AddResult from "../pages/main/reports/addResult";
import AddDoctor from "../pages/main/doctors/addDoctor";
import ResetPassword from "../pages/auth/resetPassword";
import MainLayout from "../components/common/MainLayout";
import ViewDoctor from "../pages/main/doctors/viewDoctor";
import ForgetPassword from "../pages/auth/forgetPassword";
import EmailVerification from "../pages/auth/verifyEmail";
import AddPatient from "../pages/main/patients/addPatient";
import Doctors from "../pages/main/doctors/doctorsListing";
import Invoices from "../pages/main/billing/invoicesListing";
import ViewPatient from "../pages/main/patients/viewPatient";
import Patients from "../pages/main/patients/patientsListing";
import ClaimFeed from "../pages/main/billing/claimFeedListing";
import LabResults from "../pages/main/reports/labResultsListing";
import ViewFacility from "../pages/main/facilities/viewFacility";
import PatientDetails from "../pages/main/patients/patientDetails";
import Facilities from "../pages/main/facilities/facilitiesListing";
import { StartProject } from "../pages/main/dashboard/startProject";
import AddFacilityComponent from "../pages/main/facilities/addFacility";
import { AddService } from "../pages/main/facilities/services/addService";
import { AddAppointment } from "../pages/main/appointments/addAppointment";
import Locations from "../pages/main/facilities/locations/locationListing";
import { Services } from "../pages/main/facilities/services/serviceListing";
import { ViewService } from "../pages/main/facilities/services/viewService";
import AppointmentPublic from "../pages/main/appointments/appointmentPublic";
import { AddLocation } from "../pages/main/facilities/locations/addLocation";
import { Appointments } from "../pages/main/appointments/appointmentsListing";
import { ViewLocation } from "../pages/main/facilities/locations/viewLocation";
import { ScheduleAppointments } from "../pages/main/appointments/scheduleAppointments";
import SlotConfirmation from "../pages/main/appointments/appointmentPublic/slotConfirmation";
import AppointmentSuccess from "../pages/main/appointments/appointmentPublic/appointmentSuccess";
import PatientInformation from "../pages/main/appointments/appointmentPublic/patientInformation";
// constants
import { AuthContext } from "../context";
import {
  DASHBOARD_ROUTE, FACILITIES_ROUTE, FORGET_PASSWORD_ROUTE, LOGIN_ROUTE, RESET_PASSWORD_ROUTE,
  STAFF_ROUTE, DOCTORS_ROUTE, VERIFY_EMAIL_ROUTE, PATIENTS_ROUTE, VIEW_APPOINTMENTS_ROUTE,
  LAB_RESULTS_ROUTE, CLAIMS_ROUTE, APPOINTMENTS_ROUTE, PUBLIC_APPOINTMENT_ROUTE, PATIENT_INFORMATION,
  SLOT_CONFIRMATION, PATIENT_APPOINTMENT_SUCCESS, SCHEDULE_APPOINTMENTS_ROUTE, INVOICES_ROUTE,
  FACILITY_LOCATIONS_ROUTE, FACILITY_SERVICES_ROUTE, SETTINGS_ROUTE
} from "../constants";

const Routes: FC = (): JSX.Element => {
  const { isLoggedIn } = useContext(AuthContext)

  return (
    <Switch>
      <PublicRoute path={LOGIN_ROUTE} component={Login} exact />
      <PublicRoute path={FORGET_PASSWORD_ROUTE} component={ForgetPassword} exact />
      <PublicRoute path={RESET_PASSWORD_ROUTE} component={ResetPassword} exact />
      <PublicRoute path={VERIFY_EMAIL_ROUTE} component={EmailVerification} exact />
      <PublicRoute path={PUBLIC_APPOINTMENT_ROUTE} component={AppointmentPublic} exact />
      <PublicRoute path={PATIENT_INFORMATION} component={PatientInformation} exact />
      <PublicRoute path={SLOT_CONFIRMATION} component={SlotConfirmation} exact />
      <PublicRoute path={PATIENT_APPOINTMENT_SUCCESS} component={AppointmentSuccess} exact />
      <Route exact path="/">
        {isLoggedIn ? <Redirect to={DASHBOARD_ROUTE} /> : <Login />}
      </Route>

      <MainLayout>
        <Switch>
          <PrivateRoute exact path={DASHBOARD_ROUTE} component={Dashboard} />
          <PrivateRoute exact path={`${DASHBOARD_ROUTE}/start-project`} component={StartProject} />
          <PrivateRoute exact path={DOCTORS_ROUTE} component={Doctors} />
          <PrivateRoute exact path={`${DOCTORS_ROUTE}/new`} component={AddDoctor} />
          <PrivateRoute exact path={`${DOCTORS_ROUTE}/:id`} component={ViewDoctor} />
          <PrivateRoute exact path={PATIENTS_ROUTE} component={Patients} />
          <PrivateRoute exact path={`${PATIENTS_ROUTE}/new`} component={AddPatient} />
          <PrivateRoute exact path={`${PATIENTS_ROUTE}/:id`} component={ViewPatient} />
          <PrivateRoute exact path={`${PATIENTS_ROUTE}/:id/details`} component={PatientDetails} />
          <PrivateRoute exact path={VIEW_APPOINTMENTS_ROUTE} component={Appointments} />
          <PrivateRoute exact path={SCHEDULE_APPOINTMENTS_ROUTE} component={ScheduleAppointments} />
          <PrivateRoute exact path={`${APPOINTMENTS_ROUTE}/new`} component={AddAppointment} />
          <PrivateRoute exact path={LAB_RESULTS_ROUTE} component={LabResults} />
          <PrivateRoute exact path={`${LAB_RESULTS_ROUTE}/new`} component={AddResult} />
          <PrivateRoute exact path={CLAIMS_ROUTE} component={ClaimFeed} />
          <PrivateRoute exact path={`${CLAIMS_ROUTE}/new`} component={AddBill} />
          <PrivateRoute exact path={INVOICES_ROUTE} component={Invoices} />
          <PrivateRoute exact path={STAFF_ROUTE} component={Staff} />
          <PrivateRoute exact path={`${STAFF_ROUTE}/new`} component={AddStaff} />
          <PrivateRoute exact path={`${STAFF_ROUTE}/:id`} component={ViewStaff} />
          <PrivateRoute exact path={FACILITIES_ROUTE} component={Facilities} />
          <PrivateRoute exact path={`${FACILITIES_ROUTE}/new`} component={AddFacilityComponent} />
          <PrivateRoute exact path={`${FACILITIES_ROUTE}/:id`} component={ViewFacility} />
          <PrivateRoute exact path={`${FACILITIES_ROUTE}/:id${FACILITY_LOCATIONS_ROUTE}`} component={Locations} />
          <PrivateRoute exact path={`${FACILITIES_ROUTE}/:facilityId${FACILITY_LOCATIONS_ROUTE}/new`} component={AddLocation} />
          <PrivateRoute exact path={`${FACILITIES_ROUTE}/:facilityId${FACILITY_LOCATIONS_ROUTE}/:id`} component={ViewLocation} />
          <PrivateRoute exact path={`${FACILITIES_ROUTE}/:id${FACILITY_SERVICES_ROUTE}`} component={Services} />
          <PrivateRoute exact path={`${FACILITIES_ROUTE}/:facilityId${FACILITY_SERVICES_ROUTE}/new`} component={AddService} />
          <PrivateRoute exact path={`${FACILITIES_ROUTE}/:facilityId${FACILITY_SERVICES_ROUTE}/:id`} component={ViewService} />
          <PrivateRoute exact path={SETTINGS_ROUTE} component={Settings} />
        </Switch>
      </MainLayout>

      <Route component={PageNotFound} />
    </Switch>
  );
};

export default Routes;
