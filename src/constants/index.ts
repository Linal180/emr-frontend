// graphql and interfaces block
import { formatValue } from '../utils';
import { SelectorOption, StepLabelType } from '../interfacesTypes'
import { UsersIcon, AppointmentsIcon, FacilitiesIcon, ReportsIcon, BillingIcon, } from "../assets/svgs";
import {
  Ethnicity, Gender, Genderidentity, Homebound, Maritialstatus, PracticeType, Pronouns, Race, RegDepartment, RelationshipType,
  ServiceCode, Sexualorientation, Speciality, SsnType, UserRole
} from "../generated/graphql";

// regex
export const NPI_REGEX = /^\d{10}$/;
export const NUMBER_REGEX = /^[0-9]+$/;
export const REVENUE_CODE_REGEX = /^\d{4}$/;
export const CLIA_REGEX = /^[A-Za-z0-9]{10}$/;
export const TAXONOMY_CODE_REGEX = /^[A-Z0-9]{9}X$/;
export const ALPHABETS_REGEX = /^[^\s].([A-Za-z]+\s)*[A-Za-z]+$/;
export const BANK_ACCOUNT_REGEX = /^([0-9]{11})|([0-9]{2}-[0-9]{3}-[0-9]{6})$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

// constants
export const ALL_STAFF = "Staff";
export const CREATE_STAFF = "Create Staff";
export const CREATE_FACILITY = "Create facility";
export const CREATE_LOCATION = "Create location";
export const UPDATE_LOCATION_TEXT = "Update location";
export const ADD_STAFF = "Add Staff";
export const CREATE_DOCTOR = "Create Doctor";
export const ADD_DOCTOR = "Add Doctor";
export const EDIT_DOCTOR = "Edit Doctor";
export const ADD_PATIENT = "Add Patient";
export const UPDATE_PATIENT = "Update Patient";
export const EDIT_PATIENT = "Edit Patient";
export const ADD_RESULT = "Add Result";
export const ADD_APPOINTMENT = "Add Appointment";
export const VIEW_STAFF = "View Staff";
export const UPDATE_STAFF = "Update Staff";
export const UPDATE_FACILITY = "Update Facility";
export const UPDATE_DOCTOR = "Update Doctor";
export const STAFF_LISTING = "Staff Listing";
export const PRIMARY_PROVIDER = "Primary Provider";
export const PROVIDER = "Provider";
export const CONTACT = "Contact";
export const STAFF_BASIC_INFO = "Staff Basic Info";
export const LOCATION_INFO = "Location Info";
export const FACILITY_INFO = "Facility Information";
export const FACILITY_CONTACT = "Contact";
export const ASSOCIATED_FACILITY = "Associated Facility";
export const BILLING_ADDRESS = "Billing Address";
export const FACILITY_CONTACT_INFO = "Facility Contact Information";
export const FACILITY_BILLING_INFO = "Facility BIling Information";
export const ACCOUNT_INFO = "Account Information";
export const IDENTIFICATION = "Identification";
export const ADDITIONAL_INFO = "Additional Info";
export const AVAILABILITY_STATUS = "set your availability status";
export const TAX_ID_DETAILS = "Tax ID Details";
export const MIDDLE_NAME = "Middle initial";
export const PREFIX = "Prefix";
export const SUFFIX = "Suffix";
export const PROVIDER_INITIALS = "Provider Initials";
export const DEGREE_CREDENTIALS = "Degree/ Credentials";
export const SPECIALTY = "Specialty";
export const DOB = "Date of Birth";
export const DESEASED_DATE = "deseased Date";
export const DOCTOR_ID = "doctor id";
export const PATIENT_ID = "patient id";
export const PRIMARY_SERVICE_LOCATION = "Primary Service Location";
export const SOCIAL_SECURITY_NUMBER = "Social Security Number";
export const SOCIAL_SECURITY_TYPE = "Social Security Type";
export const TAXONOMY_CODE = "Taxonomy Code";
export const DEA_NUMBER = "DEA Number";
export const DEA_ACTIVE_DATE = "DEA Active Date";
export const DEA_TERM_DATE = "DEA Term Date";
export const LANGUAGE_SPOKEN = "Language Spoken";
export const GENDER = "Gender";
export const EMAIL = "Email";
export const PHONE = "Phone";
export const FAX = "Fax";
export const ZIP_CODE = "Zip code";
export const ADDRESS = "Address";
export const ADDRESS_2 = "Address 2";
export const CITY = "City";
export const STATE = "State"
export const COUNTRY = "Country";
export const PRACTICE_TYPE = "Practice Type";
export const FEDERAL_TAX_ID = "Federal Tax ID";
export const CHECK_PAYABLE_TO = "Check Payable To";
export const BANK_ACCOUNT = "Bank Account";
export const PAGER = "Pager";
export const TAX_ID = "Tax ID";
export const NPI = "NPI";
export const UPIN = "UPIN";
export const EMC_PROVIDER_ID = "EMC Provider ID";
export const Organization_Type = "Organization Type";
export const BILLING_FACILITY = "Billing Facility";
export const MEDICARE_GRP_NUMBER = "Medicare GRP Number";
export const MEDICAID_GRP_NUMBER = "Medicaid GRP Number";
export const MAMMOGRAPHY_CERT_NUMBER = "Mammography Cert Number";
export const CAMPUS_GRP_NUMBER = "Campus GRP Number";
export const BLUE_SHIED_NUMBER = "Blue Shied Number";
export const TAX_ID_STUFF = "Tax ID Stuff / Provider Site ID";
export const SPECIALTY_LICENSE = "Specialty License";
export const ANESTHESIA_LICENSE = "Anesthesia License";
export const CTP_NUMBER = "DPS / CTP Number";
export const STATE_LICENSE = "State License";
export const LICENSE_ACTIVE_DATE = "License Active Date";
export const ACTIVE_TEXT = "Active";
export const SERVICE_NAME_TEXT = "Service Name";
export const DURATION_TEXT = "Duration (In Minutes)";
export const PRICE_TEXT = "Price (In USD)";
export const LICENSE_TERM_DATE = "License Term Date";
export const PRESCRIPTIVE_AUTH_NUMBER = "Prescriptive Auth number";
export const FACILITY_IDS = "Facility IDs";
export const FACILITY_TYPE = "Facility Type";
export const MERCHANT_ID = "Merchant ID";
export const MOBILE = "Mobile";
export const BILLING_TYPE = "Billing Type";
export const VISIT = "Visit";
export const TEST = "Test";
export const TEST_TAKEN = "Test Taken";
export const PRESCRIBED_BY = "Prescribed By";
export const REPORTS = "Reports";
export const USERNAME = "Username";
export const HASH = "#";
export const N_A = "N/A";
export const TYPE = "Type";
export const EMR = "EMR";
export const ADD_BILL = "Add Bill";
export const LOGOUT_TEXT = "Logout";
export const CODE = "Code";
export const TRUE = "TRUE";
export const TEXT = "text";
export const PLAN = "Plan";
export const NONE = "None";
export const NAME = "Name";
export const ROLE = "Role";
export const ROLES = "Roles";
export const ERROR = "error";
export const UNITS = "Units";
export const PAGE_LIMIT = 8;
export const INSURANCE = "Insurance";
export const LAST_APPOINTMENT = "Last Appointment";
export const RESET = "Reset";
export const REASON = "Reason";
export const BILLED = "Billed";
export const EMR_TEXT = "EMR";
export const USER_NAME = "Username";
export const STATUS = "Status";
export const CLAIMED = "Claimed";
export const SSN = "SSN";
export const SSN_TYPE = "Snn Type";
export const TAGS_TEXT = "Tags";
export const ACTION = "Actions";
export const DRAWER_WIDTH = 300;
export const SUCCESS = "success";
export const COMMENT = "Comment";
export const SIGN_IN = "Sign In";
export const TOKEN = "emr_token";
export const BACK_TO = "Back to";
export const FOUR_O_FOUR = "404";
export const ROLE_EVENT = "role";
export const LIST_PAGE_LIMIT = 25;
export const USERS_TEXT = "Users";
export const STAFF_TEXT = "Staff";
export const LATITUDE = "Latitude";
export const COMMENTS = "Comments";
export const PASSWORD = "password";
export const ACTIVATE = "Activate";
export const ZIP = "Zip";
export const ACTIVE = "Active";
export const INACTIVE = "Inactive";
export const VERIFIED = "Verified";
export const CLIA_ID_NUMBER = "CLIA ID Number";
export const FACILITY = "Facility";
export const SERVICE = "Service";
export const FACILITY_ID = "Facility ID";
export const INSURANCE_PLAN_TYPE = "Insurance Plan Type";
export const MAMMOGRAPHY_CERTIFICATION_NUMBER = "Mammography Certification Number";
export const REVENUE_CODE = "Revenue Code";
export const SERVICE_CODE = "Service Code";
export const STATE_IMMUNIZATION_ID = "State Immunization ID";
export const LOCATION_ID = "Location ID";
export const POS = "Place of Service Code (POS)";
export const TAMXONOMY_CODE = "Tamxonomy Code";
export const USER_ID = "User ID";
export const CANCEL = "Cancel";
export const LAST_NAME = "Last Name";
export const BILLING_TEXT = "Billing";
export const REPORTS_TEXT = "Reports";
export const DOCTORS_TEXT = "Doctors";
export const UNVERIFIED = "Unverified";
export const FIRST_NAME = "First Name";
export const SEND_EMAIL = "Send Email";
export const START_DATE = "Start date";
export const REQUESTS_TEXT = "Requests";
export const CLINICAL_TEXT = "Clinical";
export const INVOICES_TEXT = "Invoices";
export const PATIENTS_TEXT = "Patients";
export const PATIENT = "Patient";
export const DATE = "Date";
export const DOCTOR = "Doctor";
export const DURATION = "Duration";
export const RECURRING = "Recurring";
export const SUPER_BILL = "Super Bill";
export const PASSWORD_LABEL = "Password";
export const DESCRIPTION = "Description";
export const CREATE_USER = "Create User";
export const DEACTIVATED = "DEACTIVATED";
export const HIDDEN_PASSWORD = "*******";
export const DELETE_USER = "Delete User";
export const DELETE_STAFF = "Delete Staff";
export const DELETE_PATIENT = "Delete Staff";
export const DELETE_RECORD = "Delete Record";
export const DELETE_FACILITY = "Delete Facility";
export const LOCATIONS_TEXT = "Locations";
export const DASHBOARD_TEXT = "Dashboard";
export const USER_ROLE = "boca_admin_role";
export const ADD_FACILITY = "Add Facility";
export const ADD_SERVICE = "Add Service";
export const UPDATE_SERVICE = "Update Service";
export const ADD_FACILITY_SERVICE = "Add Facility Service";
export const UPDATE_FACILITY_SERVICE = "Update Facility Service";
export const ADD_LOCATION = "Add Facility Location";
export const EDIT_LOCATION = "Edit Facility Location";
export const UPDATE_LOCATION = "Update Facility Location";
export const LOCATION = "Location";
export const VIEW_FACILITY = "View Facility";
export const PHONE_NUMBER = "Phone number";
export const MOBILE_NUMBER = "Mobile number";
export const NEW_PASSWORD = "New password";
export const DELETE_MEDIA = "Delete Media";
export const VERIFY_EMAIL = "Verify Email";
export const SEARCH_PLACEHOLDER = "Search";
export const UNAUTHORIZED = "Unauthorized";
export const MANAGEMENT_TEXT = "Management";
export const PROPERTIES_TEXT = "Properties";
export const FACILITIES_TEXT = "Facilities";
export const FACILITY_LOCATIONS_TEXT = "Facility Locations";
export const TOKEN_INVALID = "Token Invalid";
export const RESET_FILTERS = "Reset Filters";
export const NO_DATA_FOUND = "No data found";
export const LAB_RESULTS_TEXT = "Lab Results";
export const BACK_TO_HOME = "Back to homepage";
export const PAGE_NOT_FOUND = "Page Not Found";
export const EXCEPTION = "Forbidden exception";
export const DELETE_REQUEST = "Delete Request";
export const REQUEST_DETAIL = "Request Detail";
export const REQUEST_STATUS = "Request Status";
export const INITIAL_CAPITAL_INVESTMENT = "2%";
export const EMAIL_VERIFIED = "Email Verified?";
export const APPOINTMENTS_TEXT = "Appointments";
export const APPOINTMENT_TEXT = "Appointment";
export const CLAIM_FEED_TEXT = "Claim Feed";
export const DETAIL_OVERVIEW = "Detail overview";
export const MEMBERSHIP_PLAN = "Membership Plan";
export const MEMBERSHIP_NAME = "Membership name";
export const CHANGE_PASSWORD = "Change password";
export const REPEAT_PASSWORD = "Repeat password";
export const INITIAL_PAYMENT = "Initial payment";
export const TOKEN_NOT_FOUND = "Token not found";
export const USER_ROLE_PLACEHOLDER = "User Role";
export const FORGOT_PASSWORD = "Forgot Password?";
export const MEMBERSHIP_REQUEST_TEXT = "Requests";
export const USER_EMAIL = "boca_admin_user_email";
export const UPLOAD_DOCUMENT = "Uploaded Document";
export const USER_INFORMATION = "User information";
export const CONFIRM_PASSWORD = "Confirm password";
export const EMR_ADMIN_PORTAL = "EMR Admin Portal";
export const MEMBERSHIP_PLANS = "Membership Plans";
export const CURRENT_PASSWORD = "Current password";
export const REQUEST_STATUS_EVENT = "requestStatus";
export const USER_STATUS_PLACEHOLDER = "User Status";
export const VIEW_SIGNED_DOCUMENT = "Signed document";
export const MEMBERSHIP_PLAN_EVENT = "MembershipPlan";
export const LIST_FACILITIES_TEXT = "List Facilities";
export const LIST_FACILITY_SERVICES_TEXT = "List Facility Services";
export const FACILITY_SERVICES_TEXT = "Facility Services";
export const CONFLICT_EXCEPTION = "Conflict Exception";
export const FACILITIES_LISTING = "Facilities Listing";
export const INSURANCE_CLAIMS_TEXT = "Insurance Claims";
export const CONTACT_INFORMATION = "Contact Information";
export const DEMOGRAPHICS = "Demographics";
export const GUARANTOR = "Guarantor";
export const REGISTRATION_DATES = "Provider/ Registration Dates";
export const PRIVACY = "Privacy";
export const PRICE = "Price";
export const IS_ACTIVE = "Active";
export const EMERGENCY_CONTACT = "Emergency Contact";
export const NEXT_OF_KIN = "Next Of Kin";
export const EMPLOYMENT = "Employment";
export const INSURANCE_POLICY_INFO = "Insurance Policy Info";
export const GUARDIAN = "Guardian";
export const POLICY_HOLDER = "Policy Holder";
export const ELIGIBILITY = "Eligibility";
export const FIRST_NAME_USED = "First Name Used";
export const PREFERRED_NAME = "Preferred Name";
export const PREVIOUS_FIRST_NAME = "Previous First Name";
export const PREVIOUS_LAST_NAME = "Previous Last Name";
export const MOTHERS_MAIDEN_NAME = "Mothers Maiden Name";
export const LEGAL_SEX = "Legal Sex";
export const VALID_DATE_REQUIRED = "Valid date is required";
export const ADDRESS_CTA = "Address (CTA)";
export const EMPLOYER = "Employer";
export const REGISTRATION_DATE = "Registration Date";
export const DECREASED_DATE = "Deceased Date";
export const NOTICE_ON_FILE = "Notices on file";
export const CONSENT_TO_CALL = "Consent To call";
export const MEDICATION_HISTORY_AUTHORITY = "Medication History Authority";
export const PATIENT_NOTES = "Patient Notes";
export const HOME_PHONE = "Home Phone";
export const MOBILE_PHONE = "Mobile Phone";
export const EMPLOYER_NAME = "Employer Name";
export const ETHNICITY = "Ethnicity";
export const GENDER_IDENTITY = "Gender Identity";
export const HOLD_STATEMENT = "Hold Statement";
export const HOMEBOUND = "Home Bound";
export const LANGUAGE = "Language";
export const REGISTRATION_DEPARTMENT = "Registration Department"
export const PRIMARY_DEPARTMENT = "Primary Department"
export const MARITAL_STATUS = "Marital Status"
export const SEX_AT_BIRTH = "Sex At Birth"
export const SEXUAL_ORIENTATION = "Sexual Orientation"
export const USUAL_PROVIDER_ID = "Usual Provider"
export const PRONOUNS = "pronouns"
export const RACE = "Race"
export const RELATIONSHIP = "RelationShip"
export const GUARANTOR_RELATION = "Patient’s Relationship with guarantor"
export const GUARANTOR_NOTE = "Guarantor (Name to whom statements are sent)"
export const EMPLOYER_PHONE = "Employer Phone";
export const USUAL_OCCUPATION = "Usual Occupation (Current or Most Recent)";
export const USUAL_INDUSTRY = "Usual Industry";
export const STATEMENT_DELIVERED_ONLINE = "Statement delivered online only";
export const STATEMENT_NOTE = "Statement note";
export const ID_NUMBER = "ID Number";
export const GROUP_NUMBER = "Policy / Group number";
export const ISSUE_DATE = "Issue Date";
export const EXPIRATION_DATE = "Expiration Date";
export const COINSURANCE_PERCENTAGE = "Coinsurance percentage";
export const NOTES = "Notes";
export const POLICY_HOLDER_ID = "Policy holder ID";
export const NOT_FOUND_EXCEPTION = "Not Found Exception";
export const FORBIDDEN_EXCEPTION = "Forbidden Exception";
export const INDIVIDUAL_NAME = "Individual Name / Trust";
export const PROFILE_INFORMATION = "Profile information";
export const VIEW_APPOINTMENTS_TEXT = "View Appointments";
export const VIEW_OWNERSHIP_REQUEST = "Ownership Request";
export const PASSWORDS_MUST_MATCH = "Passwords must match";
export const CONFIRM_YOUR_PASSWORD = "Confirm your password";
export const ANNUAL_OPERATING_DUES = "Annual Operating Dues";
export const NOT_FOUND_EXCEPTION_CAP = "NOT FOUND EXCEPTION";
export const ALLOTED_NIGHTS_OF_USE = "Allotted Nights of Use";
export const REQUEST_MEMBERSHIP_PLAN = "Request Membership Plan";
export const SCHEDULE_APPOINTMENTS_TEXT = "Schedule Appointment";
export const BOCA_ADMIN_NOTIFICATIONS = "boca_admin_notifications";
export const VERIFICATION_MESSAGE = "You are verified. Please login.";
export const DELETE_RECORD_TEXT = "You are about delete record";
export const THANKYOU_MESSAGE = "Thank you for your interest in BOCA+.";
export const ADVANCE_NIGHTS_RESERVATIONS = "Advance Nights Reservations";
export const CONSECUTIVE_NIGHTS_ALLOWABLE = "Consecutive Nights Allowable";
export const PRECONDITION_FAILED_EXCEPTION = "Precondition Failed Exception";
export const DELETE_ACCOUNT_DESCRIPTION = "Confirm to Delete";
export const DELETE_FACILITY_DESCRIPTION = "Confirm to delete facility";
export const DELETE_SERVICE_DESCRIPTION = "Confirm to delete Service";
export const DELETE_LOCATION_DESCRIPTION = "Confirm to delete location";
export const DELETE_STAFF_DESCRIPTION = "Confirm to delete staff";
export const DELETE_DOCTOR_DESCRIPTION = "Confirm to delete doctor";
export const DELETE_PATIENT_DESCRIPTION = "Confirm to delete patient";
export const DELETE_MEDIA_DESCRIPTION = "Are you sure you want to delete this media?";
export const DELETE_REQUEST_DESCRIPTION = "Are you sure you want to delete this request?";
export const ANNUAL_MANAGEMENT_FEE = "Annual Management Fee (based on initial capital contribution)";
export const LOOKS_LIKE_EMPTY = "Looks like an empty space. You can go back to homepage by clicking the button below";
export const DELETE_RECORD_LEARN_MORE_TEXT = "You are about to delete this record permanently. Are you sure you want to delete this record?";
export const VISIT_REASON = "Reason for visit"
export const SELECT_SERVICES = "Select Services"
export const PATIENT_DETAILS = "Patient Details"
export const AGREEMENT_HEADING = "User data privacy & TOS agreement."
export const SLOT_CONFIRMATION_HEADING_TWO = "We've sent you a confirmation message & email for your records."
export const SLOT_CONFIRMATION_SUB_HEADING = "Skip some of the paperwork at the clinic by adding more information."
export const SLOT_CONFIRMATION_SUB_HEADING_TWO = "You can access the information form now or later from your email or text message."
export const CONSENT_AGREEMENT_LABEL = "I agree to the terms & conditions and hereby, authorize EMR health facilities to keep my personal health record."


// Roles
export const STAFF = "STAFF";
export const ADMIN = "ADMIN";
export const OWNER = "OWNER";
export const INVESTOR = "INVESTOR";
export const SUPER_ADMIN = "SUPER_ADMIN";
export const PROPERTY_MANAGER = "PROPERTY_MANAGER";
export const RELATIONSHIP_MANAGER = "RELATIONSHIP_MANAGER";

// routes paths
export const ROOT_ROUTE = "/";
export const LOGIN_ROUTE = "/login";
export const REQUESTS = "/requests";
export const DASHBOARD_ROUTE = "/dashboard";
export const FACILITIES_ROUTE = "/list-facilities";
export const FACILITY_SERVICES_ROUTE = "/list-facility-services";
export const STAFF_ROUTE = "/staff";
export const DOCTORS_ROUTE = "/doctors";
export const PATIENTS_ROUTE = "/patients";
export const APPOINTMENTS_ROUTE = "/appointments";
export const VIEW_APPOINTMENTS_ROUTE = "/view-appointments";
export const SCHEDULE_APPOINTMENTS_ROUTE = "/schedule-appointments";
export const LAB_RESULTS_ROUTE = "/lab-results";
export const CLAIMS_ROUTE = "/insurance-claims";
export const INVOICES_ROUTE = "/invoices";
export const VERIFY_EMAIL_ROUTE = "/verify-email";
export const RESET_PASSWORD_ROUTE = "/reset-password";
export const FORGET_PASSWORD_ROUTE = "/forget-password";
export const FACILITY_LOCATIONS_ROUTE = "/locations";
export const PUBLIC_APPOINTMENT_ROUTE = "/public-appointment";
export const PATIENT_INFORMATION = "/patient-information";
export const PATIENT_APPOINTMENT_SUCCESS = `${PATIENT_INFORMATION}/success`;
export const SLOT_CONFIRMATION = `${PUBLIC_APPOINTMENT_ROUTE}/available-slot`;

// stepper arrays
export const getTagSteps = () => ["Tag Details", "Review"];
export const getMediaSteps = () => ["Add details", "Review", "Upload image"];
export const getStateSteps = () => ["State Details", "Review", "Upload images"];
export const getPropertySteps = () => [
  "Property Details",
  "Add Features and Tags",
  "Review",
  "Upload images",
];

// toolbar options for rich text editor
export const toolbarOptions = {
  options: ["inline", "link", "list", "blockType"],
  inline: {
    options: ["bold", "italic", "underline"],
  },
};

// HELPER TEXT MESSAGES
export const MIN_LENGTH_MESSAGE = `Text too short`;
export const REQUIRED_MESSAGE = "This field is required";
export const PASSWORD_NOT_MATCHED = "Password doesn't match";
export const DELETE_REQUEST_INFO = "This will delete the request.";
export const BANK_ACCOUNT_VALIDATION_MESSAGE = "Invalid bank account.";
export const CLIA_VALIDATION_MESSAGE = "CLIA should be 10-alphanumeric";
export const NPI_VALIDATION_MESSAGE = "NPI should be a 10-digit combination";
export const TAXONOMY_VALIDATION_MESSAGE = "Taxonomy code 10-alphanumeric";
export const REVENUE_CODE_VALIDATION_MESSAGE = "Revenue code should be a 4-digit combination";
export const DELETE_USER_INFO = "This will delete all the information associated with the user.";
export const ValidMessage = (fieldName: string, Example?: string) => `Please enter valid ${fieldName.toLowerCase()}`;
export const MaxLength = (fieldName: string, length: number) => `${fieldName} can be up to ${length} characters long`;
export const MinLength = (fieldName: string, length: number) => `${fieldName} should be at least ${length} characters long`;
export const USER_REQUEST_CANNOT_EDITED_NOTE = "Note: Investor has not signed the document. So, this request cannot be edited.";
export const PASSWORD_VALIDATION_MESSAGE = "Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character";
export const PHASE_CANNOT_CHANGE_NOTE = "Note: Phase cannot be changed since user has already initiated the request, to change the phase first delete the request.";
// ALERT MESSAGES
export const LOGIN_SUCCESSFULLY = "Welcome to ERM";
export const FACILITY_NOT_FOUND = 'Facility not found!';
export const STAFF_NOT_FOUND = 'Staff not found!';
export const PATIENT_NOT_FOUND = 'Patient not found!';
export const SERVICE_NOT_FOUND = 'Service not found!';
export const FAILED_TO_CREATE_PATIENT = "Failed to create patient!"
export const FAILED_TO_UPDATE_PATIENT = "Failed to update patient!"
export const TRY_AGAIN = "Something went wrong. Try again!";
export const INVALID_EMAIL = "Invalid email address";
export const STAFF_ALREADY_EXIST = "Staff already exists";
export const CANT_DELETE_STAFF = "Staff can't be deleted.";
export const STAFF_CREATED = "Staff created successfully!";
export const PATIENT_CREATED = "Patient created successfully!";
export const STAFF_UPDATED = "Staff updated successfully!";
export const SOMETHING_WENT_WRONG = "Something went wrong!";
export const CANT_DELETE_DOCTOR = "Doctor can't be deleted.";
export const DOCTOR_CREATED = "Doctor created successfully!";
export const SERVICE_CREATED = "Service created successfully!";
export const SERVICE_UPDATED = "Service updated successfully!";
export const DOCTOR_UPDATED = "Doctor updated successfully!";
export const NO_FACILITY_MESSAGE = "No facility exists yet!";
export const TOKEN_EXPIRED = "Verification token is expired.";
export const CANT_DELETE_USER = "This user can't be deleted.";
export const CANT_DELETE_PATIENT = "Patient can't be deleted.";
export const LOCATION_DELETED_SUCCESSFULLY = "Location deleted.";
export const USER_EXIST = "User already exists with this email.";
export const FACILITY_UPDATED = "Facility updated successfully!";
export const PATIENT_UPDATED = "Patient updated successfully!";
export const CANT_DELETE_FACILITY = "Facility can't be deleted.";
export const CANT_DELETE_SERVICE = "Service can't be deleted.";
export const CANT_DELETE_LOCATION = "Location can't be deleted.";
export const FACILITY_CREATED = "Facility created successfully!";
export const USER_NOT_FOUND_EXCEPTION_MESSAGE = "User not found.";
export const USER_CREATED = "User has been created successfully.";
export const NO_USER_WITH_EMAIL = "No user found with this email.";
export const ALREADY_ACTIVATED_MESSAGE = "User is already activated.";
export const OLD_PASSWORD_DID_NOT_MATCH = "Old password didn't match!";
export const REQUEST_NOT_FOUND = "Requests not found for current user";
export const EMAIL_OR_USERNAME_ALREADY_EXISTS = "Email already exists!";
export const ALREADY_DEACTIVATED_MESSAGE = "User is already deactivated.";
export const ADMIN_PORTAL_MESSAGE = "Please sign in to explore Admin Portal.";
export const ADMIN_PORTAL_NEW_MESSAGE = "Enter your credentials to login to your portal";
export const RESET_PASSWORD_MESSAGE = "Please enter your new secure password.";
export const RESET_PASSWORD_TOKEN_NOT_FOUND = "Reset password token not found.";
export const NOT_SUPER_ADMIN_MESSAGE = "Only Managers can access Admin Portal!";
export const PRECONDITION_FAILED_EXCEPTION_MESSAGE = "Resource can't be deleted.";
export const WRONG_EMAIL_OR_PASSWORD = "You have entered wrong email or password";
export const RESET_PASSWORD_SUCCESS = "Your password has been changed successfully.";
export const LOGIN_MESSAGE = "Please sign in to explore all that BOCA+ has to offer.";
export const INVALID_OR_EXPIRED_TOKEN_MESSAGE = "Sorry! Your token is expired or invalid.";
export const LOGGED_OUT_BEFORE_RESETTING_PASSWORD = "Please log out before resetting password";
export const FORGOT_PASSWORD_MESSAGE = "Please enter your email to get a reset-password link.";
export const FORGET_PASSWORD_SUCCESS = "An email has been sent to your registered email address";
export const CANT_VERIFY_EMAIL_WHILE_LOGGED_IN_MESSAGE = "You can't verify a email while you are logged in.";
export const EMAIL_CHANGED_OR_NOT_VERIFIED_MESSAGE = "Email changed or not verified, please verify your email";
export const INVALID_OR_EXPIRED_VERIFICATION_TOKEN_MESSAGE = "Sorry! Your verification token is expired or invalid";
export const EXPIRE_TOKEN_MESSAGE = "Your token has been expired. Please click on the button below to get an email again.";

export const APP_MENU_ITEMS = [
  {
    name: MANAGEMENT_TEXT,
    items: [],
    index: 2,
    sectionName: true
  },
  {
    name: USERS_TEXT,
    Icon: UsersIcon,
    index: 3,
    items: [
      {
        name: DOCTORS_TEXT,
        link: DOCTORS_ROUTE
      },
      {
        name: PATIENTS_TEXT,
        link: PATIENTS_ROUTE
      },
      {
        name: STAFF_TEXT,
        link: STAFF_ROUTE
      },
    ],
  },
  {
    name: APPOINTMENTS_TEXT,
    Icon: AppointmentsIcon,
    index: 4,
    items: [
      {
        name: VIEW_APPOINTMENTS_TEXT,
        link: VIEW_APPOINTMENTS_ROUTE
      },
      {
        name: SCHEDULE_APPOINTMENTS_TEXT,
        link: SCHEDULE_APPOINTMENTS_ROUTE
      },
    ],
  },
  {
    name: CLINICAL_TEXT,
    items: [],
    index: 5,
    sectionName: true
  },
  {
    name: FACILITIES_TEXT,
    Icon: FacilitiesIcon,
    index: 6,
    items: [
      {
        name: LIST_FACILITIES_TEXT,
        link: FACILITIES_ROUTE,
      },
    ],
  },
  {
    name: REPORTS_TEXT,
    Icon: ReportsIcon,
    index: 7,
    items: [
      {
        name: LAB_RESULTS_TEXT,
        link: LAB_RESULTS_ROUTE,
      },
    ],
  },
  {
    name: BILLING_TEXT,
    Icon: BillingIcon,
    index: 8,
    items: [
      {
        name: INVOICES_TEXT,
        link: INVOICES_ROUTE,
      },
      {
        name: INSURANCE_CLAIMS_TEXT,
        link: CLAIMS_ROUTE,
      },
    ],
  },
];

export const MAPPED_ROLES: SelectorOption[] = [
  { id: UserRole.Admin, name: formatValue(UserRole.Admin) },
  { id: UserRole.Nurse, name: formatValue(UserRole.Nurse) },
  { id: UserRole.Staff, name: formatValue(UserRole.Staff) },
  { id: UserRole.Billing, name: formatValue(UserRole.Billing) },
];

export const MAPPED_GENDER: SelectorOption[] = [
  { id: Gender.Male, name: formatValue(Gender.Male) },
  { id: Gender.Female, name: formatValue(Gender.Female) },
  { id: Gender.Other, name: formatValue(Gender.Other) },
]

export const MAPPED_PRACTICE_TYPES: SelectorOption[] = [
  { id: PracticeType.Lab, name: formatValue(PracticeType.Lab) },
  { id: PracticeType.Clinic, name: formatValue(PracticeType.Clinic) },
  { id: PracticeType.Hospital, name: formatValue(PracticeType.Hospital) },
]

export const MAPPED_SERVICE_CODES: SelectorOption[] = [
  { id: ServiceCode.Hospice_34, name: formatValue(ServiceCode.Hospice_34) },
  { id: ServiceCode.Ambulance_41, name: formatValue(ServiceCode.Ambulance_41) },
  { id: ServiceCode.Ambulance_42, name: formatValue(ServiceCode.Ambulance_42) },
  { id: ServiceCode.Ambulance_24, name: formatValue(ServiceCode.Ambulance_24) },
  { id: ServiceCode.GroupHome_14, name: formatValue(ServiceCode.GroupHome_14) },
  { id: ServiceCode.EmergencyRoom_23, name: formatValue(ServiceCode.EmergencyRoom_23) },
  { id: ServiceCode.AssistedLiving_13, name: formatValue(ServiceCode.AssistedLiving_13) },
  { id: ServiceCode.BirthingCenter_25, name: formatValue(ServiceCode.BirthingCenter_25) },
  { id: ServiceCode.HomelessShelter_04, name: formatValue(ServiceCode.HomelessShelter_04) },
  { id: ServiceCode.IndependentClinic_49, name: formatValue(ServiceCode.IndependentClinic_49) },
  { id: ServiceCode.IndependentLaboratory_81, name: formatValue(ServiceCode.IndependentLaboratory_81) },
  { id: ServiceCode.CustodialCareFacility_33, name: formatValue(ServiceCode.CustodialCareFacility_33) },
  { id: ServiceCode.CommunityMentalHealthCenter_53, name: formatValue(ServiceCode.CommunityMentalHealthCenter_53) },
  { id: ServiceCode.FederallyQualifiedHealthCenter_50, name: formatValue(ServiceCode.FederallyQualifiedHealthCenter_50) },
  { id: ServiceCode.EndStageRenalDiseaseTreatmentFacility_65, name: formatValue(ServiceCode.EndStageRenalDiseaseTreatmentFacility_65) },
  { id: ServiceCode.IndianHealthServiceFreeStandingFacility_05, name: formatValue(ServiceCode.IndianHealthServiceFreeStandingFacility_05) },
  { id: ServiceCode.IndianHealthServiceProviderBasedFacility_06, name: formatValue(ServiceCode.IndianHealthServiceProviderBasedFacility_06) },
  { id: ServiceCode.ComprehensiveInpatientRehabilitationFacility_61, name: formatValue(ServiceCode.ComprehensiveInpatientRehabilitationFacility_61) },
  { id: ServiceCode.ComprehensiveOutpatientRehabilitationFacility_62, name: formatValue(ServiceCode.ComprehensiveOutpatientRehabilitationFacility_62) },
];

export const MAPPED_SPECIALTIES: SelectorOption[] = [
  { id: Speciality.Neurology, name: formatValue(Speciality.Neurology) },
  { id: Speciality.Pharmacist, name: formatValue(Speciality.Pharmacist) },
  { id: Speciality.Gastroenterology, name: formatValue(Speciality.Gastroenterology) },
  { id: Speciality.PediatricDentist, name: formatValue(Speciality.PediatricDentist) },
  { id: Speciality.PhysicianAssistant, name: formatValue(Speciality.PhysicianAssistant) },
];

export const MAPPED_MARITAL_STATUS: SelectorOption[] = [
  { id: Maritialstatus.Single, name: formatValue(Maritialstatus.Single) },
  { id: Maritialstatus.Widowed, name: formatValue(Maritialstatus.Widowed) },
  { id: Maritialstatus.Divorced, name: formatValue(Maritialstatus.Divorced) },
  { id: Maritialstatus.Separated, name: formatValue(Maritialstatus.Separated) },
];

export const MAPPED_SSN_TYPES: SelectorOption[] = [
  { id: SsnType.Tanf, name: formatValue(SsnType.Tanf) },
  { id: SsnType.Oasdi, name: formatValue(SsnType.Oasdi) },
  { id: SsnType.Medicare, name: formatValue(SsnType.Medicare) },
  { id: SsnType.Medicaid, name: formatValue(SsnType.Medicaid) },
];

export const MAPPED_REG_DEPARTMENT: SelectorOption[] = [
  { id: RegDepartment.Lab, name: formatValue(RegDepartment.Lab) },
  { id: RegDepartment.Clinic, name: formatValue(RegDepartment.Clinic) },
  { id: RegDepartment.Hospital, name: formatValue(RegDepartment.Hospital) },
];

export const MAPPED_HOMEBOUND: SelectorOption[] = [
  { id: Homebound.No, name: Homebound.No},
  { id: Homebound.Yes, name: Homebound.Yes},
];

export const MAPPED_PRONOUNS: SelectorOption[] = [
  { id: Pronouns.He, name: formatValue(Pronouns.He) },
  { id: Pronouns.She, name: formatValue(Pronouns.She) },
  { id: Pronouns.None, name: formatValue(Pronouns.None) },
];

export const MAPPED_RACE: SelectorOption[] = [
  { id: Race.Other, name: formatValue(Race.Other) },
  { id: Race.Asian, name: formatValue(Race.Asian) },
  { id: Race.White, name: formatValue(Race.White) },
  { id: Race.BlackAfricanAmerican, name: formatValue(Race.BlackAfricanAmerican) },
  { id: Race.BlackAfricanAmerican, name: formatValue(Race.BlackAfricanAmerican) },
  { id: Race.AmericanIndianAlaskaNative, name: formatValue(Race.AmericanIndianAlaskaNative) },
  { id: Race.NativeHawaiianPacificIslander, name: formatValue(Race.NativeHawaiianPacificIslander) },
];

export const MAPPED_ETHNICITY: SelectorOption[] = [
  { id: Ethnicity.None, name: formatValue(Ethnicity.None) },
  { id: Ethnicity.CenteralAmerican, name: formatValue(Ethnicity.CenteralAmerican) },
  { id: Ethnicity.CenteralAmericanIndian, name: formatValue(Ethnicity.CenteralAmericanIndian) },
];

export const MAPPED_SEXUAL_ORIENTATION: SelectorOption[] = [
  { id: Sexualorientation.None, name: formatValue(Sexualorientation.None) },
  { id: Sexualorientation.DontKnow, name: formatValue(Sexualorientation.DontKnow) },
  { id: Sexualorientation.Bisexual, name: formatValue(Sexualorientation.Bisexual) },
  { id: Sexualorientation.Homosexual, name: formatValue(Sexualorientation.Homosexual) },
  { id: Sexualorientation.Heterosexual, name: formatValue(Sexualorientation.Heterosexual) },
];

export const MAPPED_GENDER_IDENTITY: SelectorOption[] = [
  { id: Genderidentity.None, name: formatValue(Genderidentity.None) },
  { id: Genderidentity.Male, name: formatValue(Genderidentity.Male) },
  { id: Genderidentity.Female, name: formatValue(Genderidentity.Female) },
  { id: Genderidentity.NotExclusive, name: formatValue(Genderidentity.NotExclusive) },
  { id: Genderidentity.TransgenderMale, name: formatValue(Genderidentity.TransgenderMale) },
  { id: Genderidentity.TransgenderFemale, name: formatValue(Genderidentity.TransgenderFemale) },
];

export const MAPPED_RELATIONSHIP_TYPE: SelectorOption[] = [
  { id: RelationshipType.Ward, name: formatValue(RelationshipType.Ward) },
  { id: RelationshipType.Self, name: formatValue(RelationshipType.Self) },
  { id: RelationshipType.Child, name: formatValue(RelationshipType.Child) },
  { id: RelationshipType.Other, name: formatValue(RelationshipType.Other) },
  { id: RelationshipType.Mother, name: formatValue(RelationshipType.Mother) },
  { id: RelationshipType.Spouse, name: formatValue(RelationshipType.Spouse) },
  { id: RelationshipType.Father, name: formatValue(RelationshipType.Father) },
  { id: RelationshipType.Unknown, name: formatValue(RelationshipType.Unknown) },
  { id: RelationshipType.Employee, name: formatValue(RelationshipType.Employee) },
  { id: RelationshipType.OrganDonor, name: formatValue(RelationshipType.OrganDonor) },
  { id: RelationshipType.Grandchild, name: formatValue(RelationshipType.Grandchild) },
  { id: RelationshipType.LifePartner, name: formatValue(RelationshipType.LifePartner) },
  { id: RelationshipType.Grandparent, name: formatValue(RelationshipType.Grandparent) },
  { id: RelationshipType.NephewNiece, name: formatValue(RelationshipType.NephewNiece) },
  { id: RelationshipType.FostherChild, name: formatValue(RelationshipType.FostherChild) },
  { id: RelationshipType.CadaverDonor, name: formatValue(RelationshipType.CadaverDonor) },
  { id: RelationshipType.SignificantOther, name: formatValue(RelationshipType.SignificantOther) },
  { id: RelationshipType.EmancipatedMinor, name: formatValue(RelationshipType.EmancipatedMinor) },
  { id: RelationshipType.InjuredPlaintiiff, name: formatValue(RelationshipType.InjuredPlaintiiff) },
  { id: RelationshipType.SponsoredDependent, name: formatValue(RelationshipType.SponsoredDependent) },
  { id: RelationshipType.StepsonStepdaughter, name: formatValue(RelationshipType.StepsonStepdaughter) },
  { id: RelationshipType.ChildMotherInsurance, name: formatValue(RelationshipType.ChildMotherInsurance) },
  { id: RelationshipType.HandicappedDependent, name: formatValue(RelationshipType.HandicappedDependent) },
  { id: RelationshipType.ChildFatherInsurance, name: formatValue(RelationshipType.ChildFatherInsurance) },
  { id: RelationshipType.DependentOfMinorDependent, name: formatValue(RelationshipType.DependentOfMinorDependent) },
  { id: RelationshipType.StepsonStepdaughterStepmotherInsrtance, name: formatValue(RelationshipType.StepsonStepdaughterStepmotherInsrtance) },
  { id: RelationshipType.StepsonStepdaughterStepfatherInsrtance, name: formatValue(RelationshipType.StepsonStepdaughterStepfatherInsrtance) },
];

export const StepperIcons: { [index: string]: number } = { 1: 1, 2: 2, 3: 3 };

export const getSteps = (): StepLabelType[] => {
  return [
    { title: 'Patient Information', subTitle: 'Provide basic Patient Information' },
    { title: 'Document Verification', subTitle: 'Verification information requested' },
    { title: 'Consent Agreement', subTitle: 'Provide basic Patient Information' },
  ];
};

export const agreementPoints = [
  "Proin id ligula dictum, convallis enim ut, facilisis massa.Mauris a nisi ut sapien blandit imperdiet sed id lacus.Mauris auctor interdum dignissim.",
  "Proin id ligula dictum, convallis enim ut, facilisis massa.",
  "Proin id ligula dictum, convallis enim ut, facilisis massa. Mauris a nisi ut sapien blandit imperdiet sed id lacus. Mauris auctor interdum dignissim. Cras at lacus malesuada, mattis neque mattis, lacinia mauris. Nunc ornare blandit turpis, sit amet dignissim lacus egestas in. Ut in iaculis turpis, ac consequat turpis. Nullam mi tortor, auctor quis orci sed",
  "Proin id ligula dictum, convallis enim ut, facilisis massa. Mauris a nisi ut sapien blandit imperdiet sed id lacus. Mauris auctor interdum dignissim. Cras at lacus ma",
  "Proin id ligula dictum, convallis enim ut, facilisis massa. Mauris a nisi ut sapien blandit imperdiet sed id lacus. Mauris auctor interdum dignissim. Cras at lacus malesuada, mattis neque mattis, lacinia mauris. Nunc ornare blandit turpis, sit amet dignissim lacus egestas in. Ut in iaculis turpis, ac consequat turpis. Nullam mi tortor, auctor quis orci sed, posuere luctus enim. Ut sollicitudin neque at enim gravida, ut dictum est finibus. Praesent sit",
  "Proin id ligula dictum, convallis enim ut, facilisis massa.rtor pretium vehicula quis et ante. Aenean purus sem, pharetra et ante vel, tincidunt cursus ante.",
  "Proin id ligula dictum, convallis enim ut, facilisis massa. Mauris a nisi ut sapien blandit imperdiet sed id lacus. Mauris auctor interdum dignissim. Cras at lacus malesuada, mattis neque mattis, lacinia mauris. Nunc ornare blandit turpis, sit amet dignissim ",
  "Proin id ligula dictum, convallis enim ut, facilisis massa.rtor pretium vehicula quis et ante. Aenean purus sem, pharetra et ante vel, tincidunt cursus ante.",
  "Proin id ligula dictum, convallis enim ut, facilisis massa. Mauris a nisi ut sapien blandit imperdiet sed id lacus. Mauris auctor interdum dignissim. Cras at lacus malesuada, mattis neque mattis, lacinia mauris. Nunc ornare blandit turpis, sit amet dignissim ",
  "Pro in id ligula dictum, convallis enim ut, facilisis massa.Maris a nisi ut sapien blandit imperdiet sed id lacus.Mauis auctor interdum dignissim.Crasat lacus ma",
  "Proin id ligula dictum, convallis enim ut, facilisis massa. Mauris a nisi ut sapien blandit imperdiet sed id lacus. Mauris auctor interdum dignissim. Cras at lacus malesuada, mattis neque mattis, lacinia mauris. Nunc ornare blandit turpis, sit amet dignissim lacus egestas in. Ut in iaculis turpis, ac consequat turpis",
]


// Breadcrumb links
export const FACILITIES_BREAD = { text: FACILITIES_TEXT, link: FACILITIES_ROUTE }
export const FACILITY_SERVICES_BREAD = { text: FACILITY_SERVICES_TEXT, link: FACILITY_SERVICES_ROUTE }
export const FACILITY_LOCATIONS_BREAD = { text: FACILITY_LOCATIONS_TEXT, link: FACILITY_LOCATIONS_ROUTE }
export const FACILITY_NEW_BREAD = { text: ADD_FACILITY, link: `${FACILITIES_ROUTE}/new` }
export const FACILITY_EDIT_BREAD = { text: VIEW_FACILITY, link: '' }
export const STAFF_BREAD = { text: STAFF_TEXT, link: STAFF_ROUTE }
export const DOCTORS_BREAD = { text: DOCTORS_TEXT, link: DOCTORS_ROUTE }
export const DOCTOR_NEW_BREAD = { text: ADD_DOCTOR, link: `${DOCTORS_ROUTE}/new` }
export const APPOINTMENT_NEW_BREAD = { text: ADD_APPOINTMENT, link: `${VIEW_APPOINTMENTS_ROUTE}/new` }
export const RESULT_NEW_BREAD = { text: ADD_RESULT, link: `${LAB_RESULTS_ROUTE}/new` }
export const BILL_NEW_BREAD = { text: ADD_BILL, link: CLAIMS_ROUTE }
export const DOCTOR_EDIT_BREAD = { text: EDIT_DOCTOR, link: '' }
export const PATIENTS_BREAD = { text: PATIENTS_TEXT, link: PATIENTS_ROUTE }
export const PATIENT_NEW_BREAD = { text: ADD_PATIENT, link: `${PATIENTS_ROUTE}/new` }
export const PATIENT_EDIT_BREAD = { text: EDIT_PATIENT, link: '' }
export const STAFF_NEW_BREAD = { text: ADD_STAFF, link: `${STAFF_ROUTE}/new` }
export const STAFF_EDIT_BREAD = { text: VIEW_STAFF, link: '' }
export const DASHBOARD_BREAD = { text: DASHBOARD_TEXT, link: DASHBOARD_ROUTE }
export const USERS_BREAD = { text: USERS_TEXT, link: '' }
export const APPOINTMENTS_BREAD = { text: APPOINTMENTS_TEXT, link: '' }
export const BILLING_BREAD = { text: BILLING_TEXT, link: '' }
export const REPORTS_BREAD = { text: REPORTS_TEXT, link: '' }
export const LAB_RESULTS_BREAD = { text: LAB_RESULTS_TEXT, link: LAB_RESULTS_ROUTE }
export const CLAIM_FEED_BREAD = { text: CLAIM_FEED_TEXT, link: CLAIMS_ROUTE }
export const INVOICES_BREAD = { text: INVOICES_TEXT, link: INVOICES_ROUTE }
export const VIEW_APPOINTMENTS_BREAD = { text: VIEW_APPOINTMENTS_TEXT, link: VIEW_APPOINTMENTS_ROUTE }
export const SCHEDULE_APPOINTMENTS_BREAD = { text: SCHEDULE_APPOINTMENTS_TEXT, link: SCHEDULE_APPOINTMENTS_ROUTE }

// profile top tabs
export const PROFILE_TOP_TABS = [
  {
    title: 'General Info',
    value: "1"
  },
  {
    title: 'Insurance',
    value: "2"
  },
  {
    title: 'Registration',
    value: "3"
  },
  {
    title: 'Messaging',
    value: "4"
  },
  {
    title: 'Billing',
    value: "5"
  },
  {
    title: 'Clinical',
    value: "6"
  },
  {
    title: 'Communicator',
    value: "7"
  },
]