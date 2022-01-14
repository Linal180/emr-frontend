// packages block

// graphql and interfaces block
import { DashboardIcon, UsersIcon, AppointmentsIcon, FacilitiesIcon, ReportsIcon, BillingIcon, } from "../assets/svgs";
import { Gender, PracticeType, ServiceCode, Speciality, SsnType, UserRole } from "../generated/graphql";
import { MappedGenderInterface, MappedRoleInterface } from '../interfacesTypes'


// regex
export const NUMBER_REGEX = /^[0-9]+$/;
export const BANK_ACCOUNT_REGEX = /^([0-9]{11})|([0-9]{2}-[0-9]{3}-[0-9]{6})$/;
export const ALPHABETS_REGEX = /^[^\s].([A-Za-z]+\s)*[A-Za-z]+$/;
export const LONGITUDE_LATITUDE_REGEX = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

// constants
export const ALL_STAFF = "Staff";
export const CREATE_STAFF = "Create Staff";
export const CREATE_FACILITY = "Create facility";
export const ADD_STAFF = "Add Staff";
export const CREATE_DOCTOR = "Create Doctor";
export const ADD_DOCTOR = "Add Doctor";
export const EDIT_DOCTOR = "Edit Doctor";
export const ADD_PATIENT = "Add Patient";
export const ADD_RESULT = "Add Result";
export const ADD_APPOINTMENT = "Add Appointment";
export const VIEW_STAFF = "View Staff";
export const UPDATE_STAFF = "Update Staff";
export const UPDATE_FACILITY = "Update Facility";
export const UPDATE_DOCTOR = "Update Doctor";
export const STAFF_LISTING = "Staff Listing";
export const PRIMARY_PROVIDER = "Primary Provider";
export const PROVIDER = "Provider";
export const STAFF_BASIC_INFO = "Staff Basic Info";
export const FACILITY_INFO = "Facility Information";
export const FACILITY_CONTACT = "Contact";
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
export const PRIMARY_SERVICE_LOCATION = "Primary Service Location";
export const SOCIAL_SECURITY_NUMBER = "Social Security Number";
export const SOCIAL_SECURITY_TYPE = "Social Security Type";
export const TAXONOMY_CODE = "Taxonomy Code";
export const DEA_NUMBER = "DEA Number";
export const DEA_ACTIVE_DATE = "DEA Active date";
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
export const EMR = "EMR";
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
export const SIGN_IN = "Sign in";
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
export const VERIFIED = "Verified";
export const CLIA_ID_NUMBER = "CLIA ID Number";
export const FACILITY = "Facility";
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
export const LAST_NAME = "Last name";
export const BILLING_TEXT = "Billing";
export const REPORTS_TEXT = "Reports";
export const DOCTORS_TEXT = "Doctors";
export const UNVERIFIED = "Unverified";
export const FIRST_NAME = "First name";
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
export const DELETE_RECORD = "Delete Record";
export const DELETE_FACILITY = "Delete Facility";
export const LOCATIONS_TEXT = "Locations";
export const DASHBOARD_TEXT = "Dashboard";
export const USER_ROLE = "boca_admin_role";
export const ADD_FACILITY = "Add Facility";
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
export const CONFLICT_EXCEPTION = "Conflict Exception";
export const FACILITIES_LISTING = "Facilities Listing";
export const INSURANCE_CLAIMS_TEXT = "Insurance Claims";
export const CONTACT_INFORMATION = "Contact information";
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
export const DELETE_STAFF_DESCRIPTION = "Confirm to delete staff";
export const DELETE_DOCTOR_DESCRIPTION = "Confirm to delete doctor";
export const DELETE_MEDIA_DESCRIPTION = "Are you sure you want to delete this media?";
export const DELETE_REQUEST_DESCRIPTION = "Are you sure you want to delete this request?";
export const ANNUAL_MANAGEMENT_FEE = "Annual Management Fee (based on initial capital contribution)";
export const LOOKS_LIKE_EMPTY = "Looks like an empty space. You can go back to homepage by clicking the button below";
export const DELETE_RECORD_LEARN_MORE_TEXT = "You are about to delete this record permanently. Are you sure you want to delete this record?";

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
export const FACILITIES_ROUTE = "/facilities";
export const STAFF_ROUTE = "/staff";
export const DOCTORS_ROUTE = "/doctors";
export const PATIENTS_ROUTE = "/patients";
export const APPOINTMENTS_ROUTE = "/appointments";
export const VIEW_APPOINTMENTS_ROUTE = "/view-appointments";
export const LAB_RESULTS_ROUTE = "/lab";
export const CLAIMS_ROUTE = "/insurance";
export const VERIFY_EMAIL_ROUTE = "/verify-email";
export const RESET_PASSWORD_ROUTE = "/reset-password";
export const FORGET_PASSWORD_ROUTE = "/forget-password";

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
export const DELETE_USER_INFO = "This will delete all the information associated with the user.";
export const ValidMessage = (fieldName: string, Example?: string) => `Please enter valid ${fieldName.toLowerCase()}`;
export const MaxLength = (fieldName: string, length: number) => `${fieldName} can be up to ${length} characters long`;
export const MinLength = (fieldName: string, length: number) => `${fieldName} should be at least ${length} characters long`;
export const USER_REQUEST_CANNOT_EDITED_NOTE = "Note: Investor has not signed the document. So, this request cannot be edited.";
export const PASSWORD_VALIDATION_MESSAGE = "Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character";
export const BANK_ACCOUNT_VALIDATION_MESSAGE = "Invalid bank account.";
export const PHASE_CANNOT_CHANGE_NOTE = "Note: Phase cannot be changed since user has already initiated the request, to change the phase first delete the request.";

// ALERT MESSAGES
export const LOGIN_SUCCESSFULLY = "Welcome to ERM";
export const STAFF_ALREADY_EXIST = "Staff already exists";
export const STAFF_CREATED = "Staff created successfully!";
export const FACILITY_CREATED = "Facility created successfully!";
export const DOCTOR_CREATED = "Doctor created successfully!";
export const FACILITY_UPDATED = "Facility updated successfully!";
export const DOCTOR_UPDATED = "Doctor updated successfully!";
export const STAFF_UPDATED = "Staff updated successfully!";
export const EMAIL_OR_USERNAME_ALREADY_EXISTS = "Email already exists!";
export const INVALID_EMAIL = "Invalid email address";
export const SOMETHING_WENT_WRONG = "Something went wrong!";
export const TOKEN_EXPIRED = "Verification token is expired.";
export const CANT_DELETE_USER = "This user can't be deleted.";
export const CANT_DELETE_STAFF = "Staff can't be deleted.";
export const CANT_DELETE_FACILITY = "Facility can't be deleted.";
export const CANT_DELETE_DOCTOR = "Doctor can't be deleted.";
export const NO_FACILITY_MESSAGE = "No facility exists yet!";
export const USER_EXIST = "User already exists with this email.";
export const USER_NOT_FOUND_EXCEPTION_MESSAGE = "User not found.";
export const USER_CREATED = "User has been created successfully.";
export const NO_USER_WITH_EMAIL = "No user found with this email.";
export const ALREADY_ACTIVATED_MESSAGE = "User is already activated.";
export const OLD_PASSWORD_DID_NOT_MATCH = "Old password didn't match!";
export const REQUEST_NOT_FOUND = "Requests not found for current user";
export const ALREADY_DEACTIVATED_MESSAGE = "User is already deactivated.";
export const ADMIN_PORTAL_MESSAGE = "Please sign in to explore Admin Portal.";
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
    name: DASHBOARD_TEXT,
    link: DASHBOARD_ROUTE,
    Icon: DashboardIcon,
    items: [],
    index: 1
  },
  {
    name: MANAGEMENT_TEXT,
    items: [],
    index: 2
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
      },
    ],
  },
  {
    name: CLINICAL_TEXT,
    items: [],
    index: 5,
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
      },
      {
        name: INSURANCE_CLAIMS_TEXT,
        link: CLAIMS_ROUTE,
      },
    ],
  },
];

export const MAPPED_ROLES: MappedRoleInterface[] = [
  { value: UserRole.Admin, label: 'Admin' },
  { value: UserRole.Nurse, label: "Nurse" },
  { value: UserRole.Staff, label: "Staff" },
  { value: UserRole.Billing, label: 'Billing' },
];

export const MAPPED_GENDER: MappedGenderInterface[] = [
  { value: Gender.Male, label: 'Male' },
  { value: Gender.Female, label: 'Female' },
  { value: Gender.Other, label: 'Other' },
]

export const MAPPED_PRACTICE_TYPES = [
  { value: PracticeType.Hospital, label: 'Hospital' },
  { value: PracticeType.Clinic, label: 'Clinic' },
  { value: PracticeType.Lab, label: 'Lab' },
]

const MAPPED_SERVICE_CODE = {
  AMBULANCE_41: "Ambulance 41",
  AMBULANCE_42: "Ambulance 42",
  AMBULANCE_24: "Ambulance 24",
  ASSISTED_LIVING_13: "Assisted Living 13",
  BIRTHING_CENTER_25: "Birthing Center 25",
  COMMUNITY_MENTAL_HEALTH_CENTER_53: "CMHC 53",
  COMPREHENSIVE_INPATIENT_REHABILITATION_FACILITY_61: "CIRF 61",
  COMPREHENSIVE_OUTPATIENT_REHABILITATION_FACILITY_62: "CORF 62",
  CUSTODIAL_CARE_FACILITY_33: "CAF 33",
  EMERGENCY_ROOM_23: "Emergency Room 23",
  END_STAGE_RENAL_DISEASE_TREATMENT_FACILITY_65: "ESRDTF 65",
  FEDERALLY_QUALIFIED_HEALTH_CENTER_50: "FQHC 50",
  GROUP_HOME_14: "Group Home 14",
  HOMELESS_SHELTER_04: "Homeless Shelter 04",
  HOSPICE_34: "HOSPICE 34",
  INDEPENDENT_CLINIC_49: "Independent Clinic 49",
  INDEPENDENT_LABORATORY_81: "Independent Lab 81",
  INDIAN_HEALTH_SERVICE_FREE_STANDING_FACILITY_05: "IHSFSF 05",
  INDIAN_HEALTH_SERVICE_PROVIDER_BASED_FACILITY_06: "IHSPBF 06",
}

export const MAPPED_SERVICE_CODES = [
  { value: ServiceCode.Hospice_34, label: MAPPED_SERVICE_CODE.HOSPICE_34 },
  { value: ServiceCode.Ambulance_41, label: MAPPED_SERVICE_CODE.AMBULANCE_41 },
  { value: ServiceCode.Ambulance_42, label: MAPPED_SERVICE_CODE.AMBULANCE_42 },
  { value: ServiceCode.Ambulance_24, label: MAPPED_SERVICE_CODE.AMBULANCE_24 },
  { value: ServiceCode.GroupHome_14, label: MAPPED_SERVICE_CODE.GROUP_HOME_14 },
  { value: ServiceCode.EmergencyRoom_23, label: MAPPED_SERVICE_CODE.EMERGENCY_ROOM_23 },
  { value: ServiceCode.AssistedLiving_13, label: MAPPED_SERVICE_CODE.ASSISTED_LIVING_13 },
  { value: ServiceCode.BirthingCenter_25, label: MAPPED_SERVICE_CODE.BIRTHING_CENTER_25 },
  { value: ServiceCode.HomelessShelter_04, label: MAPPED_SERVICE_CODE.HOMELESS_SHELTER_04 },
  { value: ServiceCode.IndependentClinic_49, label: MAPPED_SERVICE_CODE.INDEPENDENT_CLINIC_49 },
  { value: ServiceCode.IndependentLaboratory_81, label: MAPPED_SERVICE_CODE.INDEPENDENT_LABORATORY_81 },
  { value: ServiceCode.CustodialCareFacility_33, label: MAPPED_SERVICE_CODE.CUSTODIAL_CARE_FACILITY_33 },
  { value: ServiceCode.CommunityMentalHealthCenter_53, label: MAPPED_SERVICE_CODE.COMMUNITY_MENTAL_HEALTH_CENTER_53 },
  { value: ServiceCode.FederallyQualifiedHealthCenter_50, label: MAPPED_SERVICE_CODE.FEDERALLY_QUALIFIED_HEALTH_CENTER_50 },
  { value: ServiceCode.EndStageRenalDiseaseTreatmentFacility_65, label: MAPPED_SERVICE_CODE.END_STAGE_RENAL_DISEASE_TREATMENT_FACILITY_65 },
  { value: ServiceCode.IndianHealthServiceFreeStandingFacility_05, label: MAPPED_SERVICE_CODE.INDIAN_HEALTH_SERVICE_FREE_STANDING_FACILITY_05 },
  { value: ServiceCode.IndianHealthServiceProviderBasedFacility_06, label: MAPPED_SERVICE_CODE.INDIAN_HEALTH_SERVICE_PROVIDER_BASED_FACILITY_06 },
  { value: ServiceCode.ComprehensiveInpatientRehabilitationFacility_61, label: MAPPED_SERVICE_CODE.COMPREHENSIVE_INPATIENT_REHABILITATION_FACILITY_61 },
  { value: ServiceCode.ComprehensiveOutpatientRehabilitationFacility_62, label: MAPPED_SERVICE_CODE.COMPREHENSIVE_OUTPATIENT_REHABILITATION_FACILITY_62 }
];

export const MAPPED_SPECIALTIES = [
  { value: Speciality.Neurology, label: "Neurology" },
  { value: Speciality.Pharmacist, label: "Pharmacist" },
  { value: Speciality.Gastroenterology, label: "Gastroenterology" },
  { value: Speciality.PediatricDentist, label: "PediatricDentist" },
  { value: Speciality.PhysicianAssistant, label: "PhysicianAssistant" },
];

export const MAPPED_SSN_TYPES = [
  { value: SsnType.Tanf, label: "Tanf" },
  { value: SsnType.Oasdi, label: "Oasdi" },
  { value: SsnType.Medicare, label: "Medicare" },
  { value: SsnType.Medicaid, label: "Medicaid" },
];

// Breadcrumb links
export const FACILITIES_BREAD = { text: FACILITIES_TEXT, link: FACILITIES_ROUTE }
export const FACILITY_NEW_BREAD = { text: ADD_FACILITY, link: `${FACILITIES_ROUTE}/new` }
export const FACILITY_EDIT_BREAD = { text: VIEW_FACILITY, link: '' }
export const STAFF_BREAD = { text: STAFF_TEXT, link: STAFF_ROUTE }
export const DOCTORS_BREAD = { text: DOCTORS_TEXT, link: DOCTORS_ROUTE }
export const DOCTOR_NEW_BREAD = { text: ADD_DOCTOR, link: `${DOCTORS_ROUTE}/new` }
export const DOCTOR_EDIT_BREAD = { text: EDIT_DOCTOR, link: '' }
export const PATIENTS_BREAD = { text: PATIENTS_TEXT, link: PATIENTS_ROUTE }
export const STAFF_NEW_BREAD = { text: ADD_STAFF, link: `${STAFF_ROUTE}/new` }
export const STAFF_EDIT_BREAD = { text: VIEW_STAFF, link: '' }
export const DASHBOARD_BREAD = { text: DASHBOARD_TEXT, link: DASHBOARD_ROUTE }
export const USERS_BREAD = { text: USERS_TEXT, link: '' }
export const APPOINTMENTS_BREAD = { text: APPOINTMENTS_TEXT, link: '' }
export const BILLING_BREAD = { text: BILLING_TEXT, link: '' }
export const REPORTS_BREAD = { text: REPORTS_TEXT, link: '' }
export const LAB_RESULTS_BREAD = { text: LAB_RESULTS_TEXT, link: LAB_RESULTS_ROUTE }
export const CLAIM_FEED_BREAD = { text: CLAIM_FEED_TEXT, link: CLAIMS_ROUTE }
export const VIEW_APPOINTMENTS_BREAD = { text: VIEW_APPOINTMENTS_TEXT, link: VIEW_APPOINTMENTS_ROUTE }

// ---------------------- DUMMY DATA --------------------
export const dummyDoctorsList = [
  {
    id: 1,
    firstName: "Smith",
    lastName: "John",
    email: "john60@alxtel.com",
    phone: +14842634724,
    specialty: "Physician Assistant",
    code: 45025,
  },
  {
    id: 2,
    firstName: "Helmet",
    lastName: "Smith",
    email: "smith0@alxtel.com",
    phone: +16102458096,
    specialty: "Pharmacist",
    code: 65065,
  },
  {
    id: 3,
    firstName: "Ala",
    lastName: "Dude",
    email: "dude34@alxtel.com",
    phone: +14844493827,
    specialty: "Periodontics",
    code: 25525,
  },
  {
    id: 4,
    firstName: "Harry",
    lastName: "Steve",
    email: "harry45@alxtel.com",
    phone: +14845219734,
    specialty: "Pediatric Dentist",
    code: 88025,
  },
  {
    id: 5,
    firstName: "Chris",
    lastName: "Handle",
    email: "dakeve00@alxtel.com",
    phone: +18143519562,
    specialty: "Pediatric Dermatology",
    code: 12025,
  },
  {
    id: 6,
    firstName: "Bolt",
    lastName: "Tick",
    email: "bolt@alxtel.com",
    phone: +14845219734,
    specialty: "Neurology",
    code: 67025,
  },
  {
    id: 7,
    firstName: "Lara",
    lastName: "Bell",
    email: "lara@alxtel.com",
    phone: +14842989327,
    specialty: "Gastroenterology",
    code: 33325,
  },
  {
    id: 8,
    firstName: "Hymen",
    lastName: "Stoke",
    email: "stoke@alxtel.com",
    phone: +16102458766,
    specialty: "Neurology",
    code: 19825,
  },
  {
    id: 9,
    firstName: "Black",
    lastName: "Pointer",
    email: "pointer@alxtel.com",
    phone: +15854380126,
    specialty: "Physician Assistant",
    code: 45025,
  },
  {
    id: 10,
    firstName: "Mira",
    lastName: "Khan",
    email: "khan39@alxtel.com",
    phone: +16102458766,
    specialty: "Pediatric Dentist",
    code: 89025,
  },
]

export const dummyPatientsList = [
  {
    id: 1,
    firstName: "Bolt",
    lastName: "Tick",
    email: "bolt@alxtel.com",
    phone: +14845219734,
    lastAppointment: '03-01-2021',
    insurance: "Approved",
  },
  {
    id: 2,
    firstName: "Helmet",
    lastName: "Smith",
    email: "smith0@alxtel.com",
    phone: +16102458096,
    lastAppointment: '22-03-2021',
    insurance: "In Review",
  },
  {
    id: 3,
    firstName: "Alaa",
    lastName: "Dude",
    email: "dude34@alxtel.com",
    phone: +14844493827,
    lastAppointment: '12-01-2021',
    insurance: "Submit",
  },
  {
    id: 4,
    firstName: "Harry",
    lastName: "Steve",
    email: "harry45@alxtel.com",
    phone: +14845219734,
    lastAppointment: '03-01-2021',
    insurance: "Approved",
  },
  {
    id: 5,
    firstName: "Cris",
    lastName: "Handle",
    email: "dakeve00@alxtel.com",
    phone: +18143519562,
    lastAppointment: '03-05-2021',
    insurance: "Submit",
  },
  {
    id: 6,
    firstName: "Lara",
    lastName: "Bell",
    email: "lara@alxtel.com",
    phone: +14842989327,
    lastAppointment: '23-12-2021',
    insurance: "In Review",
  },
  {
    id: 7,
    firstName: "Smith",
    lastName: "John",
    email: "john60@alxtel.com",
    phone: +14842634724,
    lastAppointment: '03-01-2021',
    insurance: "Approved",
  },
];
