import { FC, useContext } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
// components
import Login from "../pages/auth/login";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import { PageNotFound } from "../pages/404";
import Settings from "../pages/main/settings";
import Dashboard from "../pages/main/dashboard";
import { Profile } from "../pages/main/profile";
import { Maintenance } from "../pages/maintenance";
import { Signature } from "../pages/main/signature";
import AddStaff from "../pages/main/staff/addStaff";
import AddBill from "../pages/main/billing/addBill";
import Staff from "../pages/main/staff/staffListing";
import { AddRole } from "../pages/main/roles/addRole";
import ViewStaff from "../pages/main/staff/viewStaff";
import { AutoLogout } from "../pages/main/autoLogout";
import AddResult from "../pages/main/reports/addResult";
import { EditRole } from "../pages/main/roles/viewRole";
import AddDoctor from "../pages/main/doctors/addDoctor";
import { SetPassword } from "../pages/auth/setPassword";
import { Roles } from "../pages/main/roles/roleListing";
import ViewDoctor from "../pages/main/doctors/viewDoctor";
import ForgetPassword from "../pages/auth/forgetPassword";
import { Cancellation } from "../pages/main/cancellation";
import AddPatient from "../pages/main/patients/addPatient";
import Doctors from "../pages/main/doctors/doctorsListing";
import { Calendar } from "../pages/main/dashboard/calendar";
import { ResetPassword } from "../pages/auth/resetPassword";
import Invoices from "../pages/main/billing/invoicesListing";
import ViewPatient from "../pages/main/patients/viewPatient";
import { ChangePassword } from "../pages/main/changePassword";
import DetailDoctor from "../pages/main/doctors/detailDoctor";
import Patients from "../pages/main/patients/patientsListing";
import ClaimFeed from "../pages/main/billing/claimFeedListing";
import { EmergencyAccess } from "../pages/main/emergencyAccess";
import LabResults from "../pages/main/reports/labResultsListing";
import PatientDetail from "../pages/main/patients/patientDetail";
import { AddPractice } from "../pages/main/practices/addPractice";
import { AddFacility } from "../pages/main/facilities/addFacility";
import { ViewPractice } from "../pages/main/practices/viewPractice";
import { DetailPractice } from "../pages/main/practices/detailPractice";
import { ViewFacility } from "../pages/main/facilities/viewFacility";
import { Facilities } from "../pages/main/facilities/facilitiesListing";
import { AppointmentFail } from "../pages/main/publicAppointments/fail";
import { PracticeListing } from "../pages/main/practices/practiceListing";
import { AddService } from "../pages/main/facilities/services/addService";
import { AddAppointment } from "../pages/main/appointments/addAppointment";
import { Services } from "../pages/main/facilities/services/serviceListing";
import { AppointmentCancel } from "../pages/main/publicAppointments/cancel";
import { ViewService } from "../pages/main/facilities/services/viewService";
import { FacilityPublicAppointment } from "../pages/main/publicAppointments";
import { ViewAppointment } from "../pages/main/appointments/viewAppointment";
import { Appointments } from "../pages/main/appointments/appointmentsListing";
import { AppointmentSuccess } from "../pages/main/publicAppointments/success";
import { PatientForm } from "../pages/main/publicAppointments/externalPatient";
import { PatientChart } from "../pages/main/patients/patientDetail/patientChart";
import { DoctorPublicAppointment } from "../pages/main/doctorPublicAppointments";
import { CancelAppointment } from "../pages/main/publicAppointments/cancelAppointment";
import { AppointmentConfirmation } from "../pages/main/publicAppointments/confirmation";
import { ExternalPayment } from "../pages/main/publicAppointments/payment/ExternalPayment";
import { VitalsCards } from "../pages/main/patients/patientDetail/patientChart/patientChartCards/patientVitals";
import { AddFormBuilder } from "../pages/main/formBuilder/addForm";
import { FormBuilderListing } from "../pages/main/formBuilder/formListing";
import { PublicFormPreview, PublicFormFail } from '../pages/main/publicFormbuilder'
// constants
import { AuthContext } from "../context";
import {
  STAFF_ROUTE, DOCTORS_ROUTE, PATIENTS_ROUTE, VIEW_APPOINTMENTS_ROUTE, CANCEL_APPOINTMENT,
  DASHBOARD_ROUTE, FACILITIES_ROUTE, FORGET_PASSWORD_ROUTE, LOGIN_ROUTE, RESET_PASSWORD_ROUTE,
  LAB_RESULTS_ROUTE, CLAIMS_ROUTE, APPOINTMENTS_ROUTE, PATIENT_INFORMATION, FACILITY_SERVICES_ROUTE,
  SETTINGS_ROUTE, PATIENT_APPOINTMENT_FAIL, PROFILE_ROUTE, MAINTENANCE_ROUTE, PATIENT_APPOINTMENT_CANCEL,
  PATIENTS_CHART, VITALS_ROUTE, PRACTICE_MANAGEMENT_ROUTE, APPOINTMENT_PAYMENT, ROLES_ROUTE, CALENDAR_ROUTE,
  EMERGENCY_ACCESS_ROUTE, FORM_BUILDER_ROUTE, SLOT_CONFIRMATION, PATIENT_APPOINTMENT_SUCCESS, INVOICES_ROUTE,
  SET_PASSWORD_ROUTE, CHANGE_PASSWORD_ROUTE, SIGNATURE_ROUTE, CANCELLATION_ROUTE, AUTO_LOGOUT_ROUTE, PUBLIC_FORM_BUILDER_ROUTE,
  PUBLIC_FORM_BUILDER_FAIL_ROUTE, FORM_BUILDER_EDIT_ROUTE, PRACTICE_DETAILS_ROUTE, CHECK_IN_ROUTE, FACILITY_PUBLIC_APPOINTMENT_ROUTE,
  PROVIDER_PUBLIC_APPOINTMENT_ROUTE,
  TWO_FA_ROUTE
} from "../constants";
import { CheckIn } from "../pages/main/checkIn";
import { TwoFA } from "../pages/main/twoFA";

const Routes: FC = (): JSX.Element => {
  const { isLoggedIn } = useContext(AuthContext)

  return (
    <Switch>
      <PublicRoute path={LOGIN_ROUTE} component={Login} exact />
      <PublicRoute path={FORGET_PASSWORD_ROUTE} component={ForgetPassword} exact />
      <PublicRoute path={SET_PASSWORD_ROUTE} component={SetPassword} exact />
      <PublicRoute path={RESET_PASSWORD_ROUTE} component={ResetPassword} exact />
      <PublicRoute path={PATIENT_APPOINTMENT_SUCCESS} component={AppointmentSuccess} exact />
      <PublicRoute path={`${PATIENT_INFORMATION}/:id`} component={PatientForm} exact />
      <PublicRoute path={`${SLOT_CONFIRMATION}/:id`} component={AppointmentConfirmation} exact />
      <PublicRoute path={PATIENT_APPOINTMENT_CANCEL} component={AppointmentCancel} exact />
      <PublicRoute path={`${CANCEL_APPOINTMENT}/:id`} component={CancelAppointment} exact />
      <PublicRoute path={`${APPOINTMENT_PAYMENT}/:id`} component={ExternalPayment} exact />
      <PublicRoute path={PATIENT_APPOINTMENT_FAIL} component={AppointmentFail} exact />
      <PublicRoute path={`${FACILITY_PUBLIC_APPOINTMENT_ROUTE}/:id`} component={FacilityPublicAppointment} exact />
      <PublicRoute path={`${PROVIDER_PUBLIC_APPOINTMENT_ROUTE}/:id`} component={DoctorPublicAppointment} exact />
      <PublicRoute exact path={`${PUBLIC_FORM_BUILDER_ROUTE}/:id`} component={PublicFormPreview} />
      <PublicRoute exact path={PUBLIC_FORM_BUILDER_FAIL_ROUTE} component={PublicFormFail} />

      <Route exact path="/">
        {isLoggedIn ? <Redirect to={DASHBOARD_ROUTE} /> : <Login />}
      </Route>

      <PrivateRoute exact path={`${PRACTICE_MANAGEMENT_ROUTE}/new`} component={AddPractice} />
      <PrivateRoute exact path={`${PRACTICE_MANAGEMENT_ROUTE}/:id`} component={ViewPractice} />
      <PrivateRoute exact path={PRACTICE_MANAGEMENT_ROUTE} component={PracticeListing} />
      <PrivateRoute exact path={PROFILE_ROUTE} component={Profile} />
      <PrivateRoute exact path={EMERGENCY_ACCESS_ROUTE} component={EmergencyAccess} />
      <PrivateRoute exact path={PRACTICE_DETAILS_ROUTE} component={DetailPractice} />
      <PrivateRoute exact path={SIGNATURE_ROUTE} component={Signature} />
      <PrivateRoute exact path={CANCELLATION_ROUTE} component={Cancellation} />
      <PrivateRoute exact path={ROLES_ROUTE} component={Roles} />
      <PrivateRoute exact path={TWO_FA_ROUTE} component={TwoFA} />
      <PrivateRoute exact path={`${ROLES_ROUTE}/new`} component={AddRole} />
      <PrivateRoute exact path={`${ROLES_ROUTE}/:id`} component={EditRole} />
      <PrivateRoute exact path={AUTO_LOGOUT_ROUTE} component={AutoLogout} />
      <PrivateRoute exact path={CHANGE_PASSWORD_ROUTE} component={ChangePassword} />
      <PrivateRoute exact path={DASHBOARD_ROUTE} component={Dashboard} />
      <PrivateRoute exact path={`${CALENDAR_ROUTE}`} component={Calendar} />
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
      <PrivateRoute exact path={`${APPOINTMENTS_ROUTE}/new`} component={AddAppointment} />
      <PrivateRoute exact path={`${APPOINTMENTS_ROUTE}/:id${CHECK_IN_ROUTE}`} component={CheckIn} />
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
      <PrivateRoute exact path={`${FACILITIES_ROUTE}/new`} component={AddFacility} />
      <PrivateRoute exact path={`${FACILITIES_ROUTE}/:id`} component={ViewFacility} />
      <PrivateRoute exact path={`${FACILITIES_ROUTE}/:id${FACILITY_SERVICES_ROUTE}`} component={Services} />
      <PrivateRoute exact path={`${FACILITIES_ROUTE}/:facilityId${FACILITY_SERVICES_ROUTE}/new`} component={AddService} />
      <PrivateRoute exact path={`${FACILITIES_ROUTE}/:facilityId${FACILITY_SERVICES_ROUTE}/:id`} component={ViewService} />
      <PrivateRoute exact path={SETTINGS_ROUTE} component={Settings} />
      <PrivateRoute exact path={FORM_BUILDER_ROUTE} component={FormBuilderListing} />
      <PrivateRoute exact path={`${FORM_BUILDER_ROUTE}/add`} component={AddFormBuilder} />
      <PrivateRoute exact path={`${FORM_BUILDER_EDIT_ROUTE}/:id`} component={AddFormBuilder} />

      <PublicRoute path={MAINTENANCE_ROUTE} component={Maintenance} exact />

      <Route component={PageNotFound} />
    </Switch>
  );
};

export default Routes;
