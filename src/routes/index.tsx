import { FC, useContext } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
// components
import Login from "../pages/auth/login";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import { PageNotFound } from "../pages/404";
import Settings from "../pages/main/settings";
import Dashboard from "../pages/main/dashboard";
import { Maintenance } from "../pages/maintenance";
import AddStaff from "../pages/main/staff/addStaff";
import AddBill from "../pages/main/billing/addBill";
import Staff from "../pages/main/staff/staffListing";
import ViewStaff from "../pages/main/staff/viewStaff";
import AddResult from "../pages/main/reports/addResult";
import AddDoctor from "../pages/main/doctors/addDoctor";
import ResetPassword from "../pages/auth/resetPassword";
import ViewDoctor from "../pages/main/doctors/viewDoctor";
import ForgetPassword from "../pages/auth/forgetPassword";
import EmailVerification from "../pages/auth/verifyEmail";
import AddPatient from "../pages/main/patients/addPatient";
import Doctors from "../pages/main/doctors/doctorsListing";
import Invoices from "../pages/main/billing/invoicesListing";
import ViewPatient from "../pages/main/patients/viewPatient";
import DetailDoctor from "../pages/main/doctors/detailDoctor";
import Patients from "../pages/main/patients/patientsListing";
import ClaimFeed from "../pages/main/billing/claimFeedListing";
import LabResults from "../pages/main/reports/labResultsListing";
import ViewFacility from "../pages/main/facilities/viewFacility";
import PatientDetail from "../pages/main/patients/patientDetail";
import { AddPractice } from "../pages/main/practices/addPractice";
import Facilities from "../pages/main/facilities/facilitiesListing";
import { StartProject } from "../pages/main/dashboard/startProject";
import { ViewPractice } from "../pages/main/practices/viewPractice";
import { PublicAppointment } from "../pages/main/publicAppointments";
import AddFacilityComponent from "../pages/main/facilities/addFacility";
import { AppointmentFail } from "../pages/main/publicAppointments/fail";
import { PracticeListing } from "../pages/main/practices/practiceListing";
import { AddService } from "../pages/main/facilities/services/addService";
import { AddAppointment } from "../pages/main/appointments/addAppointment";
import Locations from "../pages/main/facilities/locations/locationListing";
import { Services } from "../pages/main/facilities/services/serviceListing";
import { AppointmentCancel } from "../pages/main/publicAppointments/cancel";
import { ViewService } from "../pages/main/facilities/services/viewService";
import { ViewAppointment } from "../pages/main/appointments/viewAppointment";
import { AddLocation } from "../pages/main/facilities/locations/addLocation";
import { Appointments } from "../pages/main/appointments/appointmentsListing";
import { AppointmentSuccess } from "../pages/main/publicAppointments/success";
import { ViewLocation } from "../pages/main/facilities/locations/viewLocation";
import { PatientForm } from "../pages/main/publicAppointments/externalPatient";
import { PatientChart } from "../pages/main/patients/patientDetail/patientChart";
import { ScheduleAppointments } from "../pages/main/appointments/scheduleAppointments";
import { AppointmentConfirmation } from "../pages/main/publicAppointments/confirmation";
import { VitalsCards } from "../pages/main/patients/patientDetail/patientChart/patientChartCards/patientVitals";
// constants
import { AuthContext } from "../context";
import {
  DASHBOARD_ROUTE, FACILITIES_ROUTE, FORGET_PASSWORD_ROUTE, LOGIN_ROUTE, RESET_PASSWORD_ROUTE,
  STAFF_ROUTE, DOCTORS_ROUTE, VERIFY_EMAIL_ROUTE, PATIENTS_ROUTE, VIEW_APPOINTMENTS_ROUTE,
  LAB_RESULTS_ROUTE, CLAIMS_ROUTE, APPOINTMENTS_ROUTE, PUBLIC_APPOINTMENT_ROUTE, PATIENT_INFORMATION,
  SLOT_CONFIRMATION, PATIENT_APPOINTMENT_SUCCESS, SCHEDULE_APPOINTMENTS_ROUTE, INVOICES_ROUTE,
  FACILITY_LOCATIONS_ROUTE, FACILITY_SERVICES_ROUTE, SETTINGS_ROUTE, PATIENT_APPOINTMENT_FAIL,
  PATIENT_APPOINTMENT_CANCEL, PATIENTS_CHART, VITALS_ROUTE, PRACTICE_MANAGEMENT_ROUTE, MAINTENANCE_ROUTE, CANCEL_APPOINTMENT
} from "../constants";
import { CancelAppointment } from "../pages/main/publicAppointments/cancelAppointment";

const Routes: FC = (): JSX.Element => {
  const { isLoggedIn } = useContext(AuthContext)

  return (
    <Switch>
      <PublicRoute path={LOGIN_ROUTE} component={Login} exact />
      <PublicRoute path={FORGET_PASSWORD_ROUTE} component={ForgetPassword} exact />
      <PublicRoute path={RESET_PASSWORD_ROUTE} component={ResetPassword} exact />
      <PublicRoute path={VERIFY_EMAIL_ROUTE} component={EmailVerification} exact />
      <PublicRoute path={PATIENT_APPOINTMENT_SUCCESS} component={AppointmentSuccess} exact />
      <PublicRoute path={`${PATIENT_INFORMATION}/:id`} component={PatientForm} exact />
      <PublicRoute path={`${SLOT_CONFIRMATION}/:id`} component={AppointmentConfirmation} exact />
      <PublicRoute path={PATIENT_APPOINTMENT_CANCEL} component={AppointmentCancel} exact />
      <PublicRoute path={CANCEL_APPOINTMENT} component={CancelAppointment} exact />
      <PublicRoute path={PATIENT_APPOINTMENT_FAIL} component={AppointmentFail} exact />
      <PublicRoute path={`${PUBLIC_APPOINTMENT_ROUTE}/:id`} component={PublicAppointment} exact />

      <Route exact path="/">
        {isLoggedIn ? <Redirect to={DASHBOARD_ROUTE} /> : <Login />}
      </Route>

      <PrivateRoute exact path={`${PRACTICE_MANAGEMENT_ROUTE}/new`} component={AddPractice} />
      <PrivateRoute exact path={`${PRACTICE_MANAGEMENT_ROUTE}/:id`} component={ViewPractice} />
      <PrivateRoute exact path={PRACTICE_MANAGEMENT_ROUTE} component={PracticeListing} />

      <PrivateRoute exact path={DASHBOARD_ROUTE} component={Dashboard} />
      <PrivateRoute exact path={`${DASHBOARD_ROUTE}/start-project`} component={StartProject} />
      <PrivateRoute exact path={DOCTORS_ROUTE} component={Doctors} />
      <PrivateRoute exact path={`${DOCTORS_ROUTE}/new`} component={AddDoctor} />
      <PrivateRoute exact path={`${DOCTORS_ROUTE}/:id`} component={ViewDoctor} />
      <PrivateRoute exact path={PATIENTS_ROUTE} component={Patients} />
      <PrivateRoute exact path={`${PATIENTS_ROUTE}/new`} component={AddPatient} />
      <PrivateRoute exact path={`${PATIENTS_ROUTE}/:id`} component={ViewPatient} />
      <PrivateRoute exact path={`${PATIENTS_ROUTE}/:id/details`} component={PatientDetail} />
      <PrivateRoute exact path={`${PATIENTS_ROUTE}/:id/details${PATIENTS_CHART}`} component={PatientChart} />
      <PrivateRoute exact path={`${PATIENTS_ROUTE}/:id/details${PATIENTS_CHART}${VITALS_ROUTE}`} component={VitalsCards} />
      <PrivateRoute exact path={`${DOCTORS_ROUTE}/:id/details`} component={DetailDoctor} />
      <PrivateRoute exact path={VIEW_APPOINTMENTS_ROUTE} component={Appointments} />
      <PrivateRoute exact path={SCHEDULE_APPOINTMENTS_ROUTE} component={ScheduleAppointments} />
      <PrivateRoute exact path={`${APPOINTMENTS_ROUTE}/new`} component={AddAppointment} />
      <PrivateRoute exact path={`${APPOINTMENTS_ROUTE}/:id`} component={ViewAppointment} />
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

      <PublicRoute path={MAINTENANCE_ROUTE} component={Maintenance} exact />

      <Route component={PageNotFound} />
    </Switch>
  );
};

export default Routes;
