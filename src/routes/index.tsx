import { FC, useContext } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
// components
import AuditLogComponent from "../components/main/auditLog";
import { PageNotFound } from "../pages/404";
import ForgetPassword from "../pages/auth/forgetPassword";
import { Lock } from "../pages/auth/lock";
import Login from "../pages/auth/login";
import { ResetPassword } from "../pages/auth/resetPassword";
import { SetPassword } from "../pages/auth/setPassword";
import { TwoFA } from "../pages/main/2FA";
import { TwoFaAuthentication } from "../pages/main/2FaAuth";
import { Agreements } from "../pages/main/agreements";
import AddAgreement from "../pages/main/agreements/addAgreement";
import { AddAppointment } from "../pages/main/appointments/addAppointment";
import { Appointments } from "../pages/main/appointments/appointmentsListing";
import { ViewAppointment } from "../pages/main/appointments/viewAppointment";
import { AutoLogout } from "../pages/main/autoLogout";
import ClaimFeed from "../pages/main/billing/claimFeedListing";
import Invoices from "../pages/main/billing/invoicesListing";
import { Cancellation } from "../pages/main/cancellation";
import { ChangePassword } from "../pages/main/changePassword";
import { CheckIn } from "../pages/main/checkIn";
import { ClaimStatuses } from "../pages/main/claimStatuses";
import { CptFeeSchedule } from "../pages/main/CptFeeSchedule";
import { Calendar } from "../pages/main/dashboard/calendar";
import { DoctorDashboard } from "../pages/main/dashboard/Doctor";
import { FacilityDashboard } from "../pages/main/dashboard/Facility";
import { PracticeDashboard } from "../pages/main/dashboard/Practice";
import { StaffDashboard } from "../pages/main/dashboard/Staff";
import { SuperDashboard } from "../pages/main/dashboard/Super";
import { AddDoctor } from "../pages/main/doctors/addDoctor";
import DetailDoctor from "../pages/main/doctors/detailDoctor";
import Doctors from "../pages/main/doctors/doctorsListing";
import ViewDoctor from "../pages/main/doctors/viewDoctor";
import { EmergencyAccess } from "../pages/main/emergencyAccess";
import { AddFacility } from "../pages/main/facilities/addFacility";
import { Facilities } from "../pages/main/facilities/facilitiesListing";
import { AddService } from "../pages/main/facilities/services/addService";
import { Services } from "../pages/main/facilities/services/serviceListing";
import { ViewService } from "../pages/main/facilities/services/viewService";
import { ViewFacility } from "../pages/main/facilities/viewFacility";
import { FeeSchedule } from "../pages/main/feeSchedule";
import { AddFormBuilder } from "../pages/main/formBuilder/addForm";
import { FormBuilderListing } from "../pages/main/formBuilder/formListing";
import { FormBuilderResponses } from "../pages/main/formBuilder/formResponses";
import { AddLabOrders } from "../pages/main/labOrders/addOrder";
import { EditLabOrders } from "../pages/main/labOrders/editOrder";
import { LabOrderResults } from "../pages/main/labOrders/orderResults";
import { PatientChart } from "../pages/main/patientChart";
import AddPatient from "../pages/main/patients/addPatient";
import { PatientDetail } from "../pages/main/patients/patientDetail";
import { CoverageDetails } from "../pages/main/patients/patientDetail/CoverageDetails";
import { EligibilityTable } from "../pages/main/patients/patientDetail/EligibilityTable";
import { Patients } from "../pages/main/patients/patientsListing";
import ViewPatient from "../pages/main/patients/viewPatient";
import { AddPractice } from "../pages/main/practices/addPractice";
import { DetailPractice } from "../pages/main/practices/detailPractice";
import { PracticeListing } from "../pages/main/practices/practiceListing";
import { ViewPractice } from "../pages/main/practices/viewPractice";
import { Profile } from "../pages/main/profile";
import { AppointmentCancel } from "../pages/main/publicAppointments/cancel";
import { CancelAppointment } from "../pages/main/publicAppointments/cancelAppointment";
import { AppointmentConfirmation } from "../pages/main/publicAppointments/confirmation";
import { DoctorPublicAppointment } from "../pages/main/publicAppointments/doctor";
import { PatientForm } from "../pages/main/publicAppointments/externalPatient";
import { FacilityPublicAppointment } from "../pages/main/publicAppointments/facility";
import { AppointmentFail } from "../pages/main/publicAppointments/fail";
import { ExternalPayment } from "../pages/main/publicAppointments/payment/ExternalPayment";
import { AppointmentSuccess } from "../pages/main/publicAppointments/success";
import { PublicFormFail, PublicFormPreview, PublicFormSuccessComponent } from '../pages/main/publicFormbuilder';
import AddResult from "../pages/main/reports/addResult";
import { LabResults } from "../pages/main/reports/labResultsListing";
import { AddRole } from "../pages/main/roles/addRole";
import { Roles } from "../pages/main/roles/roleListing";
import { EditRole } from "../pages/main/roles/viewRole";
import Settings from "../pages/main/settings";
import { Signature } from "../pages/main/signature";
import AddStaff from "../pages/main/staff/addStaff";
import Staff from "../pages/main/staff/staffListing";
import ViewStaff from "../pages/main/staff/viewStaff";
import { SuperBill } from "../pages/main/superBill";
import { Maintenance } from "../pages/maintenance";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import ClaimStatus from "../pages/main/billing/claimStatusListing";
// constants, contexts and utils
import { AuthContext } from "../context";
import { isFacilityAdmin, isOnlyDoctor, isPracticeAdmin, isSuperAdmin } from "../utils";
import {
  ADD_LAB_ORDERS_RESULTS_ROUTE, AGREEMENTS_ROUTE, APPOINTMENTS_ROUTE, APPOINTMENT_PAYMENT, AUDIT_LOG_ROUTE,
  AUTO_LOGOUT_ROUTE, CALENDAR_ROUTE, CANCELLATION_ROUTE, CANCEL_APPOINTMENT, CHANGE_PASSWORD_ROUTE,
  CHECK_IN_ROUTE, CLAIM_FEED_ROUTE, CLAIM_STATUSES_ROUTE, CLAIM_STATUS_ROUTE, COVERAGE_ROUTE,
  CREATE_LAB_ORDERS_ROUTE, DASHBOARD_ROUTE, DOCTORS_ROUTE, EDIT_LAB_ORDERS_ROUTE, ELIGIBILITY_ROUTE,
  EMERGENCY_ACCESS_ROUTE, FACILITIES_ROUTE, FACILITY_PUBLIC_APPOINTMENT_ROUTE, FACILITY_SERVICES_ROUTE,
  FEE_SCHEDULE_ROUTE, FORGET_PASSWORD_ROUTE, FORM_BUILDER_COPY_TEMPLATE_ROUTE, FORM_BUILDER_EDIT_ROUTE,
  FORM_BUILDER_RESPONSES, FORM_BUILDER_ROUTE, INVOICES_ROUTE, LAB_RESULTS_ROUTE, LOCK_ROUTE, LOGIN_ROUTE,
  MAINTENANCE_ROUTE, PATIENTS_ROUTE, PATIENT_APPOINTMENT_CANCEL, PATIENT_APPOINTMENT_FAIL, TWO_FA_ROUTE,
  PATIENT_APPOINTMENT_SUCCESS, PATIENT_INFORMATION_ROUTE, USER_PERMISSIONS, VIEW_APPOINTMENTS_ROUTE,
  PRACTICE_DETAILS_ROUTE, PRACTICE_MANAGEMENT_ROUTE, PROFILE_ROUTE, PROVIDER_PUBLIC_APPOINTMENT_ROUTE,
  PUBLIC_FORM_BUILDER_FAIL_ROUTE, PUBLIC_FORM_BUILDER_ROUTE, PUBLIC_FORM_BUILDER_SUCCESS_ROUTE, RESET_PASSWORD_ROUTE,
  ROLES_ROUTE, ROOT_ROUTE, SETTINGS_ROUTE, SET_PASSWORD_ROUTE, SIGNATURE_ROUTE, SLOT_CONFIRMATION, STAFF_ROUTE,
  SUPER_BILL_ROUTE, TWO_FA_AUTHENTICATION_ROUTE, CHART_ROUTE,
} from "../constants";

const Routes: FC = (): JSX.Element => {
  const { isLoggedIn, user } = useContext(AuthContext)
  const { roles } = user || {}

  return (
    <Switch>
      <PublicRoute path={LOGIN_ROUTE} component={Login} exact />
      <PublicRoute path={LOCK_ROUTE} component={Lock} exact />
      <PublicRoute path={FORGET_PASSWORD_ROUTE} component={ForgetPassword} exact />
      <PublicRoute path={SET_PASSWORD_ROUTE} component={SetPassword} exact />
      <PublicRoute path={RESET_PASSWORD_ROUTE} component={ResetPassword} exact />
      <PublicRoute path={PATIENT_APPOINTMENT_SUCCESS} component={AppointmentSuccess} exact />
      <PublicRoute path={`${PATIENT_INFORMATION_ROUTE}/:id`} component={PatientForm} exact />
      <PublicRoute path={`${SLOT_CONFIRMATION}/:id`} component={AppointmentConfirmation} exact />
      <PublicRoute path={PATIENT_APPOINTMENT_CANCEL} component={AppointmentCancel} exact />
      <PublicRoute path={`${CANCEL_APPOINTMENT}/:id`} component={CancelAppointment} exact />
      <PublicRoute path={`${APPOINTMENT_PAYMENT}/:id`} component={ExternalPayment} exact />
      <PublicRoute path={PATIENT_APPOINTMENT_FAIL} component={AppointmentFail} exact />
      <PublicRoute path={`${FACILITY_PUBLIC_APPOINTMENT_ROUTE}/:id`} component={FacilityPublicAppointment} exact />
      <PublicRoute path={`${PROVIDER_PUBLIC_APPOINTMENT_ROUTE}/:id`} component={DoctorPublicAppointment} exact />
      <PublicRoute exact path={`${PUBLIC_FORM_BUILDER_ROUTE}/:id`} component={PublicFormPreview} />
      <PublicRoute exact path={PUBLIC_FORM_BUILDER_FAIL_ROUTE} component={PublicFormFail} />
      <PublicRoute exact path={TWO_FA_AUTHENTICATION_ROUTE} component={TwoFaAuthentication} />
      <PublicRoute exact path={PUBLIC_FORM_BUILDER_SUCCESS_ROUTE} component={PublicFormSuccessComponent} />

      <Route exact path={ROOT_ROUTE}>
        {isLoggedIn ? <Redirect to={DASHBOARD_ROUTE} /> : <Login />}
      </Route>

      {isSuperAdmin(roles) ?
        <PrivateRoute exact path={DASHBOARD_ROUTE} component={SuperDashboard} />
        : isPracticeAdmin(roles) ? <PrivateRoute exact path={DASHBOARD_ROUTE} component={PracticeDashboard} />
          : isFacilityAdmin(roles) ? <PrivateRoute exact path={DASHBOARD_ROUTE} component={FacilityDashboard} />
            : isOnlyDoctor(roles) ? <PrivateRoute exact path={DASHBOARD_ROUTE} component={DoctorDashboard} />
              : <PrivateRoute exact path={DASHBOARD_ROUTE} component={StaffDashboard} />
      }

      <PrivateRoute exact path={`${PRACTICE_MANAGEMENT_ROUTE}/new`} component={AddPractice} permission={USER_PERMISSIONS.createPractice} />
      <PrivateRoute exact path={`${PRACTICE_MANAGEMENT_ROUTE}/:id`} component={ViewPractice} permission={USER_PERMISSIONS.updatePractice} />
      <PrivateRoute exact path={PRACTICE_MANAGEMENT_ROUTE} component={PracticeListing} permission={USER_PERMISSIONS.findAllPractices} />
      <PrivateRoute exact path={PROFILE_ROUTE} component={Profile} />
      <PrivateRoute exact path={EMERGENCY_ACCESS_ROUTE} component={EmergencyAccess} />
      <PrivateRoute exact path={PRACTICE_DETAILS_ROUTE} component={DetailPractice} permission={USER_PERMISSIONS.updatePractice} />
      <PrivateRoute exact path={SIGNATURE_ROUTE} component={Signature} />
      <PrivateRoute exact path={CANCELLATION_ROUTE} component={Cancellation} />
      <PrivateRoute exact path={TWO_FA_ROUTE} component={TwoFA} />
      <PrivateRoute exact path={ROLES_ROUTE} component={Roles} permission={USER_PERMISSIONS.getAllRoles} />
      <PrivateRoute exact path={`${ROLES_ROUTE}/new`} component={AddRole} permission={USER_PERMISSIONS.createRole} />
      <PrivateRoute exact path={`${ROLES_ROUTE}/:id`} component={EditRole} permission={USER_PERMISSIONS.updateRole} />
      <PrivateRoute exact path={AUTO_LOGOUT_ROUTE} component={AutoLogout} />
      <PrivateRoute exact path={CHANGE_PASSWORD_ROUTE} component={ChangePassword} />
      <PrivateRoute exact path={`${CALENDAR_ROUTE}`} component={Calendar} />
      <PrivateRoute exact path={DOCTORS_ROUTE} component={Doctors} permission={USER_PERMISSIONS.findAllDoctor} />
      <PrivateRoute exact path={`${DOCTORS_ROUTE}/new`} component={AddDoctor} permission={USER_PERMISSIONS.createDoctor} />
      <PrivateRoute exact path={`${DOCTORS_ROUTE}/:id`} component={ViewDoctor} permission={USER_PERMISSIONS.updateDoctor} />
      <PrivateRoute exact path={PATIENTS_ROUTE} component={Patients} permission={USER_PERMISSIONS.fetchAllPatients} />
      <PrivateRoute exact path={`${PATIENTS_ROUTE}/new`} component={AddPatient} permission={USER_PERMISSIONS.createPatient} />
      <PrivateRoute exact path={`${PATIENTS_ROUTE}/:id`} component={ViewPatient} permission={USER_PERMISSIONS.updatePatient} />
      <PrivateRoute exact path={`${PATIENTS_ROUTE}/:id/details/:tabValue?`} component={PatientDetail} />
      <PrivateRoute exact path={`${PATIENTS_ROUTE}/:id${CHART_ROUTE}`} component={PatientChart} />
      <PrivateRoute exact path={`${DOCTORS_ROUTE}/:id/details`} component={DetailDoctor} />
      <PrivateRoute exact path={VIEW_APPOINTMENTS_ROUTE} component={Appointments} permission={USER_PERMISSIONS.findAllAppointments} />
      <PrivateRoute exact path={`${APPOINTMENTS_ROUTE}/new`} component={AddAppointment} permission={USER_PERMISSIONS.createAppointment} />
      <PrivateRoute exact path={`${APPOINTMENTS_ROUTE}/:appointmentId/:id${CHECK_IN_ROUTE}`} component={CheckIn} />
      <PrivateRoute exact path={`${APPOINTMENTS_ROUTE}/:id`} component={ViewAppointment} permission={USER_PERMISSIONS.updateAppointment} />
      <PrivateRoute exact path={LAB_RESULTS_ROUTE} component={LabResults} />
      <PrivateRoute exact path={`${LAB_RESULTS_ROUTE}/new`} component={AddResult} />
      <PrivateRoute exact path={CLAIM_FEED_ROUTE} component={ClaimFeed} />
      <PrivateRoute exact path={CLAIM_STATUS_ROUTE} component={ClaimStatus} />
      <PrivateRoute exact path={INVOICES_ROUTE} component={Invoices} />
      <PrivateRoute exact path={STAFF_ROUTE} component={Staff} permission={USER_PERMISSIONS.findAllStaff} />
      <PrivateRoute exact path={`${STAFF_ROUTE}/new`} component={AddStaff} permission={USER_PERMISSIONS.createStaff} />
      <PrivateRoute exact path={`${STAFF_ROUTE}/:id`} component={ViewStaff} permission={USER_PERMISSIONS.updateStaff} />
      <PrivateRoute exact path={FACILITIES_ROUTE} component={Facilities} permission={USER_PERMISSIONS.findAllFacility} />
      <PrivateRoute exact path={`${FACILITIES_ROUTE}/new`} component={AddFacility} permission={USER_PERMISSIONS.createFacility} />
      <PrivateRoute exact path={`${FACILITIES_ROUTE}/:id`} component={ViewFacility} permission={USER_PERMISSIONS.updateFacility} />
      <PrivateRoute exact path={`${FACILITIES_ROUTE}/:id${FACILITY_SERVICES_ROUTE}`} component={Services} permission={USER_PERMISSIONS.findAllServices} />
      <PrivateRoute exact path={`${FACILITIES_ROUTE}/:facilityId${FACILITY_SERVICES_ROUTE}/new`} component={AddService} permission={USER_PERMISSIONS.createService} />
      <PrivateRoute exact path={`${FACILITIES_ROUTE}/:facilityId${FACILITY_SERVICES_ROUTE}/:id`} component={ViewService} permission={USER_PERMISSIONS.updateService} />
      <PrivateRoute exact path={SETTINGS_ROUTE} component={Settings} />
      <PrivateRoute exact path={AGREEMENTS_ROUTE} component={Agreements} permission={USER_PERMISSIONS.fetchAllAgreements} />
      <PrivateRoute exact path={CLAIM_STATUSES_ROUTE} component={ClaimStatuses} />
      <PrivateRoute exact path={AUDIT_LOG_ROUTE} component={AuditLogComponent} />
      <PrivateRoute exact path={`${AGREEMENTS_ROUTE}/new`} component={AddAgreement} permission={USER_PERMISSIONS.createAgreement} />
      <PrivateRoute exact path={`${AGREEMENTS_ROUTE}/:id`} component={AddAgreement} permission={USER_PERMISSIONS.updateAgreement} />
      <PrivateRoute exact path={FORM_BUILDER_ROUTE} component={FormBuilderListing} />
      <PrivateRoute exact path={FEE_SCHEDULE_ROUTE} component={FeeSchedule} />
      <PrivateRoute exact path={`${FEE_SCHEDULE_ROUTE}/:id/details`} component={CptFeeSchedule} />
      <PrivateRoute exact path={`${SUPER_BILL_ROUTE}/:id`} component={SuperBill} />
      <PrivateRoute exact path={`${CREATE_LAB_ORDERS_ROUTE}/:id`} component={AddLabOrders} />
      <PrivateRoute exact path={`${EDIT_LAB_ORDERS_ROUTE}/:patientId/:orderNum`} component={EditLabOrders} />
      <PrivateRoute exact path={`${ADD_LAB_ORDERS_RESULTS_ROUTE}/:patientId/:orderNum`} component={LabOrderResults} />
      <PrivateRoute exact path={`${FORM_BUILDER_ROUTE}/add`} component={AddFormBuilder} />
      <PrivateRoute exact path={`${FORM_BUILDER_EDIT_ROUTE}/:id`} component={AddFormBuilder} />
      <PrivateRoute exact path={`${FORM_BUILDER_COPY_TEMPLATE_ROUTE}/:templateId`} component={AddFormBuilder} />
      <PrivateRoute exact path={`${FORM_BUILDER_RESPONSES}/:id`} component={FormBuilderResponses} />
      <PrivateRoute exact path={`${ELIGIBILITY_ROUTE}/:id`} component={EligibilityTable} />
      <PrivateRoute exact path={`${COVERAGE_ROUTE}/:id/:patientId/:appointmentId?`} component={CoverageDetails} />

      <PublicRoute path={MAINTENANCE_ROUTE} component={Maintenance} exact />

      <Route component={PageNotFound} />
    </Switch>
  );
};

export default Routes;
