// packages block
import {
  LocalAtm,
  ReportSharp,
  Home,
  LocalMall,
  BookOutlined,
} from "@material-ui/icons";
import {
  DashboardIcon,
  UsersIcon,
  AppointmentsIcon,
  FacilitiesIcon,
  ReportsIcon,
  BillingIcon,
} from "../assets/svgs";
// graphql and interfaces block

// regex
export const NUMBER_REGEX = /^[0-9]+$/;
export const ALPHABETS_REGEX = /^[^\s].([A-Za-z]+\s)*[A-Za-z]+$/;
export const LONGITUDE_LATITUDE_REGEX = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

// constants
export const HASH = "#";
export const N_A = "N/A";
export const TRUE = "TRUE";
export const TEXT = "text";
export const PLAN = "Plan";
export const NONE = "None";
export const NAME = "Name";
export const ROLE = "Role";
export const ROLES = "Roles";
export const ERROR = "error";
export const UNITS = "Units";
export const EMAIL = "Email";
export const PHONE = "Phone";
export const PAGE_LIMIT = 10;
export const RESET = "Reset";
export const STATUS = "Status";
export const SSN = "SSN / TIN";
export const TAGS_TEXT = "Tags";
export const ACTION = "Actions";
export const DRAWER_WIDTH = 240;
export const SUCCESS = "success";
export const COMMENT = "Comment";
export const SIGN_IN = "Sign in";
export const BACK_TO = "Back to";
export const FOUR_O_FOUR = "404";
export const ROLE_EVENT = "role";
export const LIST_PAGE_LIMIT = 25;
export const PHASE_TEXT = "Phase";
export const USERS_TEXT = "Users";

export const EMR_TEXT = "EMR";

export const DASHBOARD_TEXT = "Dashboard";

export const DOCTORS_TEXT = "Doctors";
export const PATIENTS_TEXT = "Patients";
export const STAFF_TEXT = "Staff";

export const APPOINTMENTS_TEXT = "Appointments";
export const VIEW_APPOINTMENTS_TEXT = "View Appointment";
export const SCHEDULE_APPOINTMENTS_TEXT = "Schedule Appointment";

export const FACILITIES_TEXT = "Facilities";
export const LIST_FACILITIES_TEXT = "List Facilities";

export const REPORTS_TEXT = "Reports";
export const LAB_RESULTS_TEXT = "Lab Results";

export const BILLING_TEXT = "Billing";
export const INVOICES_TEXT = "Invoices";
export const INSURANCE_CLAIMS_TEXT = "Insurance Claims";

export const LATITUDE = "Latitude";
export const COMMENTS = "Comments";
export const PASSWORD = "password";
export const STATE_LABEL = "State";
export const ACTIVATE = "Activate";
export const ZIP_CODE = "Zip code";
export const VERIFIED = "Verified";
export const STATES_TEXT = "States";
export const STATUS_EVENT = "status";
export const LONGITUDE = "Longitude";
export const ADDRESS_1 = "Address 1";
export const ACTIVATED = "ACTIVATED";
export const LAST_NAME = "Last name";
export const ADDRESS_2 = "Address 2";
export const UNVERIFIED = "Unverified";
export const FIRST_NAME = "First name";
export const PHASE_NAME = "Phase name";
export const DEACTIVATE = "Deactivate";
export const SEND_EMAIL = "Send Email";
export const FEATURES_TEXT = "Features";
export const TOKEN = "boca_admin_token";
export const REQUESTS_TEXT = "Requests";
export const PASSWORD_LABEL = "Password";
export const DESCRIPTION = "Description";
export const CREATE_USER = "Create User";
export const DEACTIVATED = "DEACTIVATED";
export const HIDDEN_PASSWORD = "*******";
export const DELETE_USER = "Delete User";
export const LOCATIONS_TEXT = "Locations";
export const USER_ROLE = "boca_admin_role";
export const PHONE_NUMBER = "Phone number";
export const NEW_PASSWORD = "New password";
export const DELETE_MEDIA = "Delete Media";
export const VERIFY_EMAIL = "Verify Email";
export const SEARCH_PLACEHOLDER = "Search";
export const UNAUTHORIZED = "Unauthorized";
export const PROPERTIES_TEXT = "Properties";
export const TOKEN_INVALID = "Token Invalid";
export const RESET_FILTERS = "Reset Filters";
export const NO_DATA_FOUND = "No data found";
export const BACK_TO_HOME = "Back to homepage";
export const PAGE_NOT_FOUND = "Page Not Found";
export const EXCEPTION = "Forbidden exception";
export const DELETE_REQUEST = "Delete Request";
export const REQUEST_DETAIL = "Request Detail";
export const REQUEST_STATUS = "Request Status";
export const INITIAL_CAPITAL_INVESTMENT = "2%";
export const EMAIL_VERIFIED = "Email Verified?";
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
export const MEMBERSHIP_PLANS = "Membership Plans";
export const CURRENT_PASSWORD = "Current password";
export const REQUEST_STATUS_EVENT = "requestStatus";
export const USER_STATUS_PLACEHOLDER = "User Status";
export const ADMIN_PORTAL = "BOCA Plus Admin Portal";
export const VIEW_SIGNED_DOCUMENT = "Signed document";
export const MEMBERSHIP_PLAN_EVENT = "MembershipPlan";
export const CONFLICT_EXCEPTION = "Conflict Exception";
export const CONTACT_INFORMATION = "Contact information";
export const NOT_FOUND_EXCEPTION = "Not Found Exception";
export const FORBIDDEN_EXCEPTION = "Forbidden Exception";
export const INDIVIDUAL_NAME = "Individual Name / Trust";
export const PROFILE_INFORMATION = "Profile information";
export const VIEW_OWNERSHIP_REQUEST = "Ownership Request";
export const PASSWORDS_MUST_MATCH = "Passwords must match";
export const CONFIRM_YOUR_PASSWORD = "Confirm your password";
export const ANNUAL_OPERATING_DUES = "Annual Operating Dues";
export const NOT_FOUND_EXCEPTION_CAP = "NOT FOUND EXCEPTION";
export const ALLOTED_NIGHTS_OF_USE = "Allotted Nights of Use";
export const REQUEST_MEMBERSHIP_PLAN = "Request Membership Plan";
export const BOCA_ADMIN_NOTIFICATIONS = "boca_admin_notifications";
export const VERIFICATION_MESSAGE = "You are verified. Please login.";
export const THANKYOU_MESSAGE = "Thank you for your interest in BOCA+.";
export const ADVANCE_NIGHTS_RESERVATIONS = "Advance Nights Reservations";
export const CONSECUTIVE_NIGHTS_ALLOWABLE = "Consecutive Nights Allowable";
export const PRECONDITION_FAILED_EXCEPTION = "Precondition Failed Exception";
export const DELETE_USER_DESCRIPTION =
  "Are you sure you want to delete this user?";
export const DELETE_MEDIA_DESCRIPTION =
  "Are you sure you want to delete this media?";
export const DELETE_REQUEST_DESCRIPTION =
  "Are you sure you want to delete this request?";
export const ANNUAL_MANAGEMENT_FEE =
  "Annual Management Fee (based on initial capital contribution)";
export const LOOKS_LIKE_EMPTY =
  "Looks like an empty space. You can go back to homepage by clicking the button below";

// Roles
export const STAFF = "STAFF";
export const ADMIN = "ADMIN";
export const OWNER = "OWNER";
export const INVESTOR = "INVESTOR";
export const SUPER_ADMIN = "SUPER_ADMIN";
export const PROPERTY_MANAGER = "PROPERTY_MANAGER";
export const RELATIONSHIP_MANAGER = "RELATIONSHIP_MANAGER";

// routes paths
export const TAG = "/tag";
export const USER = "/user";
export const TAGS = "/tags";
export const PHASE = "/phase";
export const STATE = "/state";
export const ROOT_ROUTE = "/";
export const USERS = "/users";
export const STATES = "/states";
export const PROFILE = "/profile";
export const FEATURE = "/feature";
export const REQUEST = "/request";
export const LOGIN_ROUTE = "/login";
export const PROPERTY = "/property";
export const FEATURES = "/features";
export const LOCATION = "/location";
export const REQUESTS = "/requests";
export const LOCATIONS = "/locations";
export const PROPERTIES = "/properties";
export const VERIFY_EMAIL_ROUTE = "/verify-email";
export const RESET_PASSWORD_ROUTE = "/reset-password";
export const FORGET_PASSWORD_ROUTE = "/forget-password";
export const FACILTIES = "/facilities";

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
export const DELETE_USER_INFO =
  "This will delete all the information associated with the user.";
export const ValidMessage = (fieldName: string, Example?: string) =>
  `Please enter valid ${fieldName.toLowerCase()}`;
export const MaxLength = (fieldName: string, length: number) =>
  `${fieldName} can be up to ${length} characters long`;
export const MinLength = (fieldName: string, length: number) =>
  `${fieldName} should be at least ${length} characters long`;
export const USER_REQUEST_CANNOT_EDITED_NOTE =
  "Note: Investor has not signed the document. So, this request cannot be edited.";
export const PASSWORD_VALIDATION_MESSAGE =
  "Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character";
export const PHASE_CANNOT_CHANGE_NOTE =
  "Note: Phase cannot be changed since user has already initiated the request, to change the phase first delete the request.";

// ALERT MESSAGES
export const INVALID_EMAIL = "Invalid email address";
export const TOKEN_EXPIRED = "Verification token is expired.";
export const CANT_DELETE_USER = "This user can't be deleted.";
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
export const PRECONDITION_FAILED_EXCEPTION_MESSAGE =
  "Resource can't be deleted.";
export const WRONG_EMAIL_OR_PASSWORD =
  "You have entered wrong email or password";
export const RESET_PASSWORD_SUCCESS =
  "Your password has been changed successfully.";
export const LOGIN_MESSAGE =
  "Please sign in to explore all that BOCA+ has to offer.";
export const INVALID_OR_EXPIRED_TOKEN_MESSAGE =
  "Sorry! Your token is expired or invalid.";
export const FORGOT_PASSWORD_MESSAGE =
  "Please enter your email to get a reset-password link.";
export const FORGET_PASSWORD_SUCCESS =
  "An email has been sent to your registered email address";
export const CANT_VERIFY_EMAIL_WHILE_LOGGED_IN_MESSAGE =
  "You can't verify a email while you are logged in.";
export const EMAIL_CHANGED_OR_NOT_VERIFIED_MESSAGE =
  "Email changed or not verified, please verify your email";
export const INVALID_OR_EXPIRED_VERIFICATION_TOKEN_MESSAGE =
  "Sorry! Your verification token is expired or invalid";
export const EXPIRE_TOKEN_MESSAGE =
  "Your token has been expired. Please click on the button below to get an email again.";

export const LEFT_NAV_LIST_ITEMS = [
  {
    title: DASHBOARD_TEXT,
    link: "/",
    icon: Home,
  },
  {
    title: APPOINTMENTS_TEXT,
    link: "/",
    icon: BookOutlined,
  },
  {
    title: FACILITIES_TEXT,
    link: "/",
    icon: LocalMall,
  },
  {
    title: REPORTS_TEXT,
    link: "/",
    icon: ReportSharp,
  },
  {
    title: BILLING_TEXT,
    link: "/",
    icon: LocalAtm,
  },
];
export const APP_MENU_ITEMS = [
  
  {
    name: DASHBOARD_TEXT,
    link: "/",
    Icon: DashboardIcon,
    index:1
  },
  {
    name: DASHBOARD_TEXT,
    index:2
  },
  {
    name: USERS_TEXT,
    Icon: UsersIcon,
    index:3,
    items: [
      {
        name: DOCTORS_TEXT,
        link: "/",
      },
      {
        name: PATIENTS_TEXT,
      },
      {
        name: STAFF_TEXT,
      },
    ],
  },
  {
    name: APPOINTMENTS_TEXT,
    Icon: AppointmentsIcon,
    index:4,
    items: [
      {
        name: VIEW_APPOINTMENTS_TEXT,
      },
      {
        name: SCHEDULE_APPOINTMENTS_TEXT,
      },
    ],
  },
  {
    name: DASHBOARD_TEXT,
    index:5,
  },
  {
    name: FACILITIES_TEXT,
    Icon: FacilitiesIcon,
    index:6,
    items: [
      {
        name: LIST_FACILITIES_TEXT,
      },
    ],
  },
  {
    name: REPORTS_TEXT,
    Icon: ReportsIcon,
    index:7,
    items: [
      {
        name: LAB_RESULTS_TEXT,
      },
    ],
  },
  {
    name: BILLING_TEXT,
    Icon: BillingIcon,
    index:8,
    items: [
      {
        name: INVOICES_TEXT,
      },
      {
        name: INSURANCE_CLAIMS_TEXT,
      },
    ],
  },
];

export const MAPPED_ROLES = {
  Staff: "Staff",
  Admin: "Manager",
  Owner: "Member Owner",
  SuperAdmin: "Developer",
  Investor: "Potential Investor",
  PropertyManager: "Property Manager",
  RelationshipManager: "Relations Owner",
};

// export const ROLES_OPTIONS_FOR_SUPER_ADMIN: multiOptionType[] = [
//   { value: UserRole.Staff, label: MAPPED_ROLES.Staff },
//   { value: UserRole.Owner, label: MAPPED_ROLES.Owner },
//   { value: UserRole.Admin, label: MAPPED_ROLES.Admin },
//   { value: UserRole.Investor, label: MAPPED_ROLES.Investor },
//   { value: UserRole.PropertyManager, label: MAPPED_ROLES.PropertyManager },
//   { value: UserRole.RelationshipManager, label: MAPPED_ROLES.RelationshipManager },
// ];

// export const ROLES_OPTIONS_FOR_ADMIN: multiOptionType[] = [
//   { value: UserRole.Staff, label: MAPPED_ROLES.Staff },
//   { value: UserRole.Owner, label: MAPPED_ROLES.Owner },
//   { value: UserRole.Admin, label: MAPPED_ROLES.Admin },
//   { value: UserRole.Investor, label: MAPPED_ROLES.Investor },
//   { value: UserRole.PropertyManager, label: MAPPED_ROLES.PropertyManager },
//   { value: UserRole.RelationshipManager, label: MAPPED_ROLES.RelationshipManager },
// ];

// export const ROLES_OPTIONS_FOR_NEW_USER: multiOptionType[] = [
//   { value: UserRole.Admin, label: MAPPED_ROLES.Admin },
//   { value: UserRole.PropertyManager, label: MAPPED_ROLES.PropertyManager },
//   { value: UserRole.RelationshipManager, label: MAPPED_ROLES.RelationshipManager },
//   { value: UserRole.Staff, label: MAPPED_ROLES.Staff }
// ];
