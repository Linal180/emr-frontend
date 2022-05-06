//packages block
import states from "states-us";
import moment from "moment-timezone";
import { v4 as uuid } from "uuid";
// graphql and interfaces block
import {
  formatServiceCode, formatValue, getFormattedDate, getStandardTime,
} from "../utils";
import {
  SelectorOption, StepLabelType, ColumnTypes, ItemsTypes, SelectOptions, FormBuilderFormInitial,
  FormInitialType,
} from "../interfacesTypes";
import {
  UsersIcon, AppointmentsIcon, FacilitiesIcon, ReportsIcon, BillingIcon, CheckboxIcon,
  DateIcon, EmailIcon, FileInputIcon, NumberIcon, RadioGroupIcon, SelectIcon,
  TextAreaIcon, TextIcon,
} from "../assets/svgs";
import {
  Ethnicity, Genderidentity, Homebound, Maritialstatus, PaymentType, PracticeType, Pronouns,
  Race, RelationshipType, ServiceCode, Sexualorientation, Speciality, Communicationtype, Gender,
  FormType, ElementType, FieldOptionsInputType, Appointmentstatus, AllergySeverity,
} from "../generated/graphql";

// regex
export const ZIP_REGEX = /^\d*[1-9\d,-]+$/;
export const NPI_REGEX = /^\d{10}$/;
export const TID_REGEX = /^9\d{8}$/;
export const NUMBER_REGEX = /^[0-9]+$/;
export const EIN_REGEX = /^\d{2}-?\d{7}$/;
export const STRING_REGEX = /^[A-Za-z\s]+$/;
export const REVENUE_CODE_REGEX = /^\d{4}$/;
export const UPIN_REGEX = /^[A-Za-z0-9]{6}$/;
export const CLIA_REGEX = /^[A-Za-z0-9]{10}$/;
export const SSN_REGEX = /^\d{3}-\d{2}-\d{4}$/;
export const FACILITY_CODE_REGEX = /^[A-Z]{2,5}$/;
export const ADDRESS_REGEX = /^[#.0-9a-zA-Z\s,-]+$/;
export const TAXONOMY_CODE_REGEX = /^[A-Z0-9]{9}X$/;
export const ALPHABETS_REGEX = /^[^\s].([A-Za-z]+\s)*[A-Za-z]+$/;
export const MAMMOGRAPHY_CERT_NUMBER_REGEX = /^[A-Z]{3}-[A-Z]{2}-\d{6}$/;
export const BANK_ACCOUNT_REGEX = /^([0-9]{11})|([0-9]{2}-[0-9]{3}-[0-9]{6})$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

// system roles
export enum SYSTEM_ROLES {
  EmergencyAccess = "emergency-access",
  SuperAdmin = "super-admin",
  PracticeAdmin = "practice-admin",
  FacilityAdmin = "facility-admin",
  Doctor = "doctor",
  DoctorAssistant = "doctor-assistant",
  Staff = "staff",
  OfficeManager = "office-manager",
  NursePractitioner = "nurse-practitioner",
  Nurse = "nurse",
  FrontDesk = "front-desk",
  Patient = "patient",
}
export const SUPER_ADMIN = "super-admin";
export const ADMIN = "admin";
// constants
export const CURRENT_DATE = new Date();
export const NOTE = "Note";
export const Ok_TEXT = "OK";
export const NOTES = "Notes";
export const ACUTE = "Acute";
export const CHRONIC = "Chronic";
export const LOCK_TIME_OUT = 6000000;
export const ZIP_CODE_AND_CITY = "Please enter zip code & city";
export const ZIP_CODE_ENTER = "Please enter zip code";
export const POSSIBLE_MATCH = "possible address match";
export const CHECK_ADDRESS = "Check Address";
export const SMARTY_0_MATCH =
  "There are 0 matches for that address. Please edit and re-check.";
export const YOU_ENTER = "You have entered:";
export const SELECT_ADDRESS = "Please select a address";
export const VERIFY_ADDRESS = "Verify address";
export const DISMISS = "Dismiss";
export const LABEL = "Label";
export const FORMS = "Forms";
export const ADD_FORM = "Add Form";
export const EDIT_FORM = "Edit Form";
export const FORM_RESPONSES = "Form Responses";
export const TIME = "Time";
export const OPTION_TEXT = "Option";
export const FORM_TEXT = "Form";
export const FORM_COPY = "Copy form";
export const FORM_NAME = "Form name";
export const THANK_YOU_TEXT = "Thank you!";
export const FORM_SUBMIT_TEXT = "Form Submit";
export const FORM_TYPE = "Select a form type";
export const ADD_COLUMNS_TEXT = "Add Columns";
export const FORM_EMBED_TITLE = "Embed your form builder";
export const FORM_NOT_PUBLISHED = "Form is not published";
export const CONTACT_SUPPORT_TEAM = "Please Contact support team";
export const CSS_CLASSES = "CSS Classes";
export const PLACEHOLDER = "Placeholder";
export const DROP_ITEM_TEXT = "Drop items here";
export const SELECT_COLUMN_TEXT = "Select a column";
export const YES_TEXT = "Yes";
export const NO_TEXT = "No";
export const CANCEL_TEXT = "Cancel";
export const REQUIRED_TEXT = "Required?";
export const CREATE_FORM_BUILDER = "Form is created successfully.";
export const CREATE_FORM_TEMPLATE = "Form Template is created successfully.";
export const DELETE_FORM_DESCRIPTION = "Confirm to delete form.";
export const CANT_DELETE_FORM = "Form can't be deleted.";
export const FORM_NOT_FOUND = "Form not found!";
export const FORM_UPDATED = "Form updated successfully!";
export const PUBLIC_FORM_LINK = "Public form preview Link";
export const FORM_FAIL_DESCRIPTION = "Public form preview Link";
export const EMPTY_OPTION = { id: "", name: "--" };
export const EMPTY_WIDGETS = [];
export enum DAYS {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}
export const CREATED_ON = "Created On";
export const CDC = "CDC";
export const ADD = "Add";
export const UPDATE = "Update";
export const DATE_ADDED = "Date Added";
export const BMI_FOR_AGE = "BMI for Age";
export const SYSTEM_PASSWORD = "admin@123";
export const NEXT = "Next";
export const VIEW = "View";
export const YES = "Yes";
export const NO = "No";
export const IS_ADMIN = "Is Admin?";
export const VIEW_PRACTICES = "View Practices";
export const EIN = "EIN";
export const ADMIN_NAME = "Admin Name";
export const PRACTITIONER = "Practitioner";
export const FINISH = "Finish";
export const DONE = "Done";
export const ALL_STAFF = "Staff";
export const MINUTES = "minutes";
export const USA = "United States";
export const CHECK_IN = "Check In";
export const LINK_COPIED = "Link Copied";
export const BILLING_PROFILE = "Billing Profile";
export const GO_TO_PROFILE = "Go To Profile";
export const PAYABLE_ADDRESS = "Payable Address";
export const BILLING_IDENTIFIER = "Billing Identifier";
export const PUBLIC_LINK = "Public Appointment Link";
export const FACILITY_LOCATION = "Facility Location";
export const ADD_FACILITY_BILLING = "Add billing for this facility";
export const SAME_AS_FACILITY_LOCATION = "Same as facility location";
export const SAME_AS_PATIENT = "Same as patient";
export const APPOINTMENT_NOT_EXIST = "Appointment doesn't exist";
export const DROP_YOUR_IMAGE_TEXT = "Drop your image here, or browse";
export const SUPPORT_DOC_TEXT = "Supports: JPG, PNG, PDF & DOC";
export const CALENDAR = "Calendar";
export const PRINT = "Print";
export const FUNCTIONAL_HEARTBURN = "Functional Heartburn";
export const PAY_LATER = "Pay Later";
export const SCHEDULE_APPOINTMENT = "Schedule Appointment";
export const APARTMENT = "Apartment";
export const INFORMATION = "Information";
export const CREATE_STAFF = "Create Staff";
export const CREATE_TEMPLATE = "Create Template";
export const PAYMENT_TYPE = "Payment Type";
export const SELF_PAY_RESTRICTION = "Self Pay Restriction";
export const PRIMARY_INSURANCE_FOR_ORDER = "Primary Insurance For Order";
export const SECONDARY_INSURANCE_FOR_ORDER = "Secondary Insurance For Order";
export const ORDERING_PROVIDER = "Ordering Provider";
export const SELECT_PAYMENT = "Select Payment";
export const AUTO_ACCIDENT = "Auto Accident";
export const STREET_ADDRESS = "Street Address";
export const OTHER_ACCIDENT = "Other Accident";
export const CREATE_SCHEDULE = "Create Schedule";
export const UPDATE_SCHEDULE = "Update Schedule";
export const CREATE_SERVICE = "Create Service";
export const CREATE_FACILITY = "Create facility";
export const CREATE_LOCATION = "Create location";
export const BASIC_CALENDAR = "Basic Calendar";
export const APPOINTMENT_TYPE = "Appointment Type";
export const DOCTOR_NOT_FOUND = "Doctor not found!";
export const PATIENT_CONDITION = "Patient Condition";
export const INSURANCE_COMPANY = "Insurance Company";
export const PRIMARY_INSURANCE = "Primary Insurance";
export const UPDATE_LOCATION_TEXT = "Update location";
export const PREFERRED_LANGUAGE = "Preferred Language";
export const PREFERRED_PHARMACY = "Preferred Pharmacy";
export const CREATE_APPOINTMENT = "Create Appointment";
export const CREATE_NEW_APPOINTMENT = "Create New Appointment";
export const APPOINTMENT_LIST = "Appointment List";
export const UPDATE_APPOINTMENT = "Update Appointment";
export const SECONDARY_INSURANCE = "Secondary Insurance";
export const FAILED_TO_CREATE_DOCTOR = "Failed to create doctor!";
export const FAILED_TO_UPDATED_DOCTOR = "Failed to update doctor!";
export const ADD_STAFF = "Add Staff";
export const FRONT_SIDE = "Front Side";
export const BACK_SIDE = "Back Side";
export const DRIVING_LICENSE = "Driving License";
export const INSURANCE_CARD = "Insurance Card";
export const DOCUMENT_VERIFICATION = "Document Verification";
export const APARTMENT_SUITE_OTHER = "Apartment/Suite/Other";
export const PAYMENT_DETAILS = "Payment Details";
export const CONTACT_METHOD = "How we can contact you?";
export const HCFA_DESC = "HCFA Box 10 - Is patient's condition related to:";
export const VOICE_MAIL_PERMISSIONS = "Is it okay for us to leave a voicemail?";
export const ADD_NEW_TEXT = "Add New";
export const EDIT_STAFF = "Edit Staff";
export const CREATE_DOCTOR = "Create Doctor";
export const USER_DETAILS_TEXT = "User Details";
export const CANT_CREATE_STAFF = "Can't create staff";
export const PRACTICE_DETAILS_TEXT = "Practice Details";
export const FACILITY_DETAILS_TEXT = "Facility Details";
export const ADD_NEW_PRACTICE_TEXT = "Add New Practice";
export const CANT_UPDATE_STAFF = "Staff cant be updated";
export const CANT_CREATE_SCHEDULE = "Can't create schedule";
export const PRACTICE_MANAGEMENT_TEXT = "Practice Management";
export const CANT_UPDATE_SCHEDULE = "Schedule cant be updated";
export const ADD_ANOTHER_PATIENT_PAYMENT = "Add Another Patient Payment";
export const ADD_ANOTHER_SPECIMEN = "Add Another Specimen";
export const RELEASE_BILLING_INFO_PERMISSIONS =
  "Can we release medical and billing information to this contact?";
export const APPOINTMENT_CONFIRMATION_PERMISSIONS =
  "May we phone, email, or send a text to you to confirm appointments?";
export const ADD_DOCTOR = "Add Doctor";
export const ADD_RESULT = "Add Result";
export const VIEW_STAFF = "View Staff";
export const EDIT_DOCTOR = "Edit Doctor";
export const ADD_PATIENT = "Add Patient";
export const ADD_PRACTICE = "Add practice";
export const EDIT_PRACTICE = "Edit practice";
export const ADD_PATIENT_MODAL = "Add Patient?";
export const TIME_ZONE_TEXT = "Time Zone";
export const EDIT_PATIENT = "Edit Patient";
export const UPDATE_STAFF = "Update Staff";
export const SET_TIME_ZONE = "Set Time Zone";
export const UPDATE_DOCTOR = "Update Doctor";
export const UPDATE_PATIENT = "Update Patient";
export const CREATE_PATIENT = "Create Patient";
export const UPDATE_FACILITY = "Update Facility";
export const ADD_APPOINTMENT = "Add Appointment";
export const EDIT_APPOINTMENT = "Edit Appointment";
export const CREATE_INVOICE = "Create Invoice";
export const PRACTICE_SETTINGS = "Practice Settings";
export const USERS_MANAGEMENT = "Users Management";
export const ADD_MEDIA = "Add Media";
export const PAID = "Paid";
export const UNPAID = "Unpaid";
export const INVOICE = "Invoice";
export const CONTACT = "Contact";
export const REACTION = "Reaction";
export const PROVIDER = "Provider";
export const SEVERITY = "Severity";
export const INVENTORY = "Inventory";
export const ONSET_DATE = "Onset Date";
export const OTHER_DATE = "Other Date";
export const NO_INVOICE = "No Invoice";
export const PAY_AMOUNT = "Pay Amount";
export const UPDATE_TIME = "Update Time";
export const FACILITY_CONTACT = "Facility Contact";
export const AMOUNT_DOLLAR = "Amount ($)";
export const STAFF_LISTING = "Staff Listing";
export const MEMBERSHIP_ID = "Membership ID";
export const LOCATION_INFO = "Location Info";
export const IDENTIFICATION = "Identification";
export const SELECT_PROVIDER = "Select Provider";
export const BILLING_ADDRESS = "Billing Address";
export const SERVICE_INFO = "Service Information";
export const ACCOUNT_INFO = "Account Information";
export const STAFF_BASIC_INFO = "Staff Basic Info";
export const PRIMARY_PROVIDER = "Primary Provider";
export const FACILITY_INFO = "Facility Information";
export const ONSET_DATE_TYPE = "Onset Date Type";
export const OTHER_DATE_TYPE = "Other Date Type";
export const ASSOCIATED_FACILITY = "Associated Facility";
export const APPOINTMENT_SETTINGS = "Appointment Settings";
export const FACILITY_CONTACT_INFO = "Facility Contact Information";
export const FACILITY_BILLING_INFO = "Facility BIling Information";
export const ENABLE = "Enable";
export const VITALS_TEXT = "Vitals";
export const TO_CHART = "To Chart";
export const SAVE_TEXT = "Save";
export const CLEAR_TEXT = "Clear";
export const PUBLISH = "Publish";
export const PUBLISHED = "Published";
export const NOT_PUBLISHED = "Not Published";
export const TO_BILLING = "To Billing";
export const UPLOAD_LOGO = "Upload Logo";
export const SAVE_DRAFT = "Save as Draft";
export const UPLOAD_PICTURE = "Upload Picture";
export const ALLOW_CANCELLATION = "Allow Cancellations";
export const VACCINE_TEXT = "Vaccine";
export const PROBLEMS_TEXT = "Problems";
export const ALLERGIES_TEXT = "Allergies";
export const CARE_PLAN_TEXT = "Care Plan";
export const MEDICATIONS_TEXT = "Medications";
export const SOCIAL_HISTORY_TEXT = "Social History";
export const FAMILY_HISTORY_TEXT = "Family History";
export const SURGICAL_HISTORY_TEXT = "Surgical History";
export const MEDICAL_HISTORY_TEXT = "Past Medical History";
export const IMPLANT_HISTORY_TEXT = "Implant History";
export const AVAILABILITY_TEXT = "Availability";
export const ADD_MORE_RECORDS_TEXT = "Add more records";
export const ADD_WIDGET_TEXT = "Add Widget";
export const ACCEPTABLE_FILES = [".jpg", ".jpeg", ".png", ".docx", ".doc", ".pdf",];
export const SCHEDULE = "Schedule";
export const FACILITY_MANAGEMENT = "Facility Management";
export const PROVIDER_MANAGEMENT = "Provider Management";
export const STAFF_MANAGEMENT = "Staff Management";
export const EMERGENCY_ACCESS = "Emergency Access";
export const EMERGENCY_ACCESS_REVOKE_ROLES = [SUPER_ADMIN, "facility-admin", "practice-admin"]
export const EMERGENCY_ACCESS_VALUE = "emergency-access";
export const ACCESS_ACTIVATED = "Access Activated";
export const EMERGENCY_ACCESS_DENIED = "Emergency Access Denied";
export const EMERGENCY_ACCESS_ENABLED = "Emergency Access Enabled";
export const ROLES_PERMISSIONS = "Roles & Permissions";
export const NOTICE_REQUIRED_TEXT = "Minimum Notice Required (In Hours)";
export const PRACTICE_DETAILS_DESCRIPTION =
  "Edit your facility information and settings";
export const FACILITY_MANAGEMENT_DESCRIPTION =
  "Add and edit your facility information and settings";
export const PROVIDER_MANAGEMENT_DESCRIPTION =
  "Add providers and update their profiles for the EMR";
export const STAFF_MANAGEMENT_DESCRIPTION =
  "Add staff and update their profiles for the EMR";
export const SCHEDULE_DESCRIPTION = "Add or update provider’s schedule";
export const ROLES_PERMISSIONS_DESCRIPTION =
  "Add or update staff roles and their permissions";
export const EMERGENCY_ACCESS_DESCRIPTION =
  "View and manage the users with emergency access";
export const TEMPORARY_EMERGENCY_ACCESS =
  "Temporary Emergency Administrator Access";
export const ACTIVATE_EMERGENCY_ACCESS_MODE = "Activate Emergency Access Mode";
export const DEACTIVATE_EMERGENCY_ACCESS_MODE =
  "Deactivate Emergency Access Mode";
export const TEMPORARY_EMERGENCY_ACCESS_DESCRIPTION =
  "Emergency access mode gives practice members temporary administrator permissions in the event of an emergency or crisis. Access is secure and only available to pre-selected practice members designated by a practice administrator.";
export const ICT_TEN = "ICT-10 Codes";
export const ICD_TEN_CODES = "ICD-10 Codes";
export const HCPCS_CODES = "HCPCS Codes";
export const ICT_NINE = "ICT-9 Codes";
export const CPT_CODES = "CPT Codes";
export const CUSTOM_CODES = "Custom Codes";
export const MEDICINES = "Medicines";
export const TESTS = "Tests";
export const VACCINES = "Vaccines";
export const ICT_TEN_DESCRIPTION =
  "Create and edit ICT-10 codes inventory for your practice";
export const ICT_NINE_DESCRIPTION =
  "Create and edit ICT-9 codes inventory for your practice";
export const CPT_CODES_DESCRIPTION =
  "Create and edit CPT codes inventory for your practice";
export const MEDICINES_DESCRIPTION =
  "Create and edit medicine inventory for your practice";
export const TESTS_DESCRIPTION =
  "Create and edit lab tests inventory for your practice";
export const VACCINES_DESCRIPTION =
  "Create and edit vaccine inventory for your practice";
export const FACILITY_SERVICES_DESCRIPTION =
  "Add or update all the services a facility is offering";
export const CANCELLED_APPOINTMENT = "Cancelled Appointment";
export const CANCELLED_APPOINTMENT_DESCRIPTION =
  "View cancelled appointments and their reason";
export const CALENDAR_SETTINGS_TEXT = "Calendar Settings";
export const BUSINESS_HOURS = "Business Hours";
export const FACILITY_SCHEDULE = "Facility Schedule";
export const FACILITY_REGISTRATION = "Facility Registration";
export const FACILITY_SCHEDULE_DESCRIPTION =
  "Set timings of facility and manage slots";
export const CLINICAL_TEXT = "Clinical";
export const FORM_BUILDER = "Form Builder";
export const FORM_FIELDS = "Form Fields";
export const NO_TEMPLATE = "No Template Found";
export const FORM_BUILDER_DESCRIPTION = "Design your form by drag and drop";
export const MISCELLANEOUS_SETTINGS = "Miscellaneous Settings";
export const TIME_ZONE = "Time Zone Settings";
export const TIME_ZONE_DESCRIPTION = "Set time zones";
export const DELETE_WIDGET_DESCRIPTION =
  " Are you sure you want to remove this widget?";
export const DELETE_WIDGET_TEXT = "Delete Widget";
export const VIEW_CHART_TEXT = "View Chart";
export const CHART_TEXT = "Chart";
export const NON_AVAILABILITY_TEXT = "Non-Availability";
export const ADDITIONAL_INFO = "Additional Info";
export const AVAILABILITY_STATUS = "Set your availability status";
export const TAX_ID_DETAILS = "Tax ID Details";
export const MIDDLE_NAME = "Middle Name";
export const PREFIX = "Prefix";
export const SUFFIX = "Suffix";
export const PROVIDER_INITIALS = "Provider Initials";
export const CHECK_ELIGIBILITY_TODAY = "Check Eligibility Today";
export const CHECK_PRIOR_DATE_OF_SERVICE = "Check At Prior Date Of Service";
export const OVERRIDE_PAYER_RETURNED_RESULT = "Override Payer Returned Result";
export const TAKE_A_PICTURE_OF_INSURANCE =
  "Please take a pictures of your insurance card and upload here. ";
export const DEGREE_CREDENTIALS = "Degree/ Credentials";
export const SPECIALTY = "Specialty";
export const DOB = "Date of Birth";
export const DOB_TIME = "Date/Time";
export const DECEASED_DATE = "Deceased Date";
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
export const DISABLED = "Disabled";
export const ENABLED_BY = "Enabled by";
export const ACTIVATED_ON = "Activated On";
export const PRACTICE_IDENTIFIER = "Practice Identifier";
export const FAX = "Fax";
export const CITY = "City";
export const PHONE = "Phone";
export const STATE = "State";
export const PDF_TEXT = "PDF";
export const SELECT = "Select";
export const ADDRESS = "Address";
export const COUNTRY = "Country";
export const ZIP_CODE = "Zip code";
export const ADDRESS_2 = "Address 2";
export const PICK_DAY_TEXT = "Pick Day";
export const PICK_TIME_TEXT = "Pick Time";
export const GROWTH_CHART = "Growth Chart";
export const ADDRESS_CTD = "Address (CTD)";
export const PRACTICE_TYPE = "Practice Type";
export const FEDERAL_TAX_ID = "Federal Tax ID";
export const FACILITY_HOURS_END = "Facility hours end";
export const FACILITY_HOURS_START = "Facility hours start";
export const RELATIONSHIP_WITH_PATIENT = "Relationship With Patient";
export const NPI = "NPI";
export const HASH = "#";
export const N_A = "N/A";
export const EMR = "EMR";
export const DAY = "Day";
export const UPIN = "UPIN";
export const PAGER = "Pager";
export const TO_TEXT = "To:";
export const TAX_ID = "Tax ID";
export const CHAMPUS = "Champus";
export const FROM_TEXT = "From:";
export const MEDICARE = "Medicare";
export const MEDICAID = "Medicaid";
export const PRN = "PRN";
export const ACTIVE_TEXT = "Active";
export const MERCHANT_ID = "Merchant ID";
export const BANK_ACCOUNT = "Bank Account";
export const FACILITY_IDS = "Facility IDs";
export const PRICE_TEXT = "Price (In USD)";
export const STATE_LICENSE = "State License";
export const CTP_NUMBER = "DPS / CTP Number";
export const FACILITY_TYPE = "Facility Type";
export const OFFICE_TIMING = "Office Timing";
export const SERVICE_NAME_TEXT = "Service Name";
export const SELECT_COLOR_TEXT = "Select Color";
export const EMC_PROVIDER_ID = "EMC Provider ID";
export const CHECK_PAYABLE_TO = "Check Payable To";
export const BILLING_FACILITY = "Billing Facility";
export const DURATION_TEXT = "Duration (In Minutes)";
export const LICENSE_TERM_DATE = "License Term Date";
export const SPECIALTY_LICENSE = "Specialty License";
export const BLUE_SHIED_NUMBER = "Blue Shied Number";
export const Organization_Type = "Organization Type";
export const ANESTHESIA_LICENSE = "Anesthesia License";
export const CHAMPUS_GRP_NUMBER = "Champus GRP Number";
export const LICENSE_ACTIVE_DATE = "License Active Date";
export const MEDICARE_GRP_NUMBER = "Medicare GRP Number";
export const MEDICAID_GRP_NUMBER = "Medicaid GRP Number";
export const TAX_ID_STUFF = "Tax ID Stuff / Provider Site ID";
export const MAMMOGRAPHY_CERT_NUMBER = "Mammography Cert Number";
export const PRESCRIPTIVE_AUTH_NUMBER = "Prescriptive Auth number";
export const REGISTER_NEW_FACILITY = "Register New Facility";
export const SSN = "SSN";
export const ZIP = "Zip";
export const DATE = "Date";
export const TEST = "Test";
export const TYPE = "Type";
export const CODE = "Code";
export const TRUE = "TRUE";
export const TEXT = "text";
export const PLAN = "Plan";
export const NONE = "None";
export const NAME = "Name";
export const ROLE = "Role";
export const PAGE_LIMIT = 8;
export const VALUE = "Value";
export const VISIT = "Visit";
export const ROLES = "Roles";
export const ERROR = "error";
export const UNITS = "Units";
export const RESET = "Reset";
export const REASON = "Reason";
export const MOBILE = "Mobile";
export const SERIAL_NO = "S.No";
export const DRAWER_WIDTH = 300;
export const REPORTS = "Reports";
export const GENERAL = "General";
export const TIME_TO = "TIME:TO";
export const SET = "Set Password";
export const SECURITY = "Security";
export const USERNAME = "Username";
export const ADD_BILL = "Add Bill";
export const LOGOUT_TEXT = "Logout";
export const TIME_FROM = "TIME:FROM";
export const INSURANCE = "Insurance";
export const ROLE_NAME = "Role name";
export const HISTORICAL = "Historical";
export const CHILDHOOD = "Childhood";
export const ADULTHOOD = "Adulthood";
export const UNKNOWN = "Unknown";
export const TEST_TAKEN = "Test Taken";
export const APPOINTMENT = "Appointment";
export const BILLING_TYPE = "Billing Type";
export const PRESCRIBED_BY = "Prescribed By";
export const STARTING_TIME = "Starting time";
export const ENDING_TIME = "Ending time";
export const EMR_TEXT = "EMR";
export const BILLED = "Billed";
export const DRUG = "Drug";
export const FOOD = "Food";
export const ENVIRONMENT = "Environment";
export const ACTIVE = "Active";
export const STATUS = "Status";
export const ACTION = "Actions";
export const TAGS_TEXT = "Tags";
export const SUCCESS = "success";
export const CLAIMED = "Claimed";
export const SERVICE = "Service";
export const COMMENT = "Comment";
export const SIGN_IN = "Sign In";
export const SIGN_OFF = "Sign Off";
export const RESULT = "Result";
export const RESULTS = "Results";
export const FILE = "File";
export const TOKEN = "emr_token";
export const BACK_TO = "Back to";
export const FOUR_O_FOUR = "404";
export const ROLE_EVENT = "role";
export const LIST_PAGE_LIMIT = 25;
export const USERS_TEXT = "Users";
export const STAFF_TEXT = "Staff";
export const LATITUDE = "Latitude";
export const SSN_TYPE = "SNN Type";
export const COMMENTS = "Comments";
export const PASSWORD = "password";
export const ACTIVATE = "Activate";
export const INACTIVE = "Inactive";
export const VERIFIED = "Verified";
export const SERVICES = "Services";
export const FACILITY = "Facility";
export const END_TIME = "End Time";
export const USER_NAME = "Username";
export const CANCELLED = "Cancelled";
export const CVV = "CVV";
export const PAY = "Pay";
export const EDIT = "Edit";
export const CANCEL = "Cancel";
export const DOCTOR = "Doctor";
export const USER_ID = "User ID";
export const PATIENT = "Patient";
export const DOCUMENT = "Document";
export const PRACTICE = "Practice";
export const NO_RECORDS = "No Records";
export const IN_PROGRESS = "In Progress";
export const LAST_NAME = "Last Name";
export const BILLING_TEXT = "Billing";
export const INITIATED = "Initialized";
export const FACILITY_ID = "Facility ID";
export const LOCATION_ID = "Location ID";
export const REVENUE_CODE = "Revenue Code";
export const SERVICE_CODE = "Service Code";
export const CLIA_ID_NUMBER = "CLIA ID Number";
export const POS = "Place of Service Code (POS)";
export const ALL_APPOINTMENTS = "All Appointments";
export const LAST_APPOINTMENT = "Last Appointment";
export const REPORTS_TEXT = "Reports";
export const DOCTORS_TEXT = "Doctors";
export const UNVERIFIED = "Unverified";
export const SEND_EMAIL = "Send Email";
export const FIRST_NAME = "First Name";
export const START_TIME = "Start Time";
export const START_DATE = "Start Date";
export const REQUESTS_TEXT = "Requests";
export const INVOICES_TEXT = "Invoices";
export const PATIENTS_TEXT = "Patients";
export const CARD_NUMBER = "Card Number";
export const EXPIRY_DATE = "Expiry Date";
export const PRACTICE_NPI = "Practice NPI";
export const PATIENT_INFO = "Patient Info";
export const FACILITY_NAME = "Facility Name";
export const PRACTICE_NAME = "Practice Name";
export const BILLING_STATUS = "Billing Status";
export const DOCTOR_SCHEDULE = "Doctor Schedule";
export const LOCATION = "Location";
export const DURATION = "Duration";
export const RECURRING = "Recurring";
export const SUPER_BILL = "Super Bill";
export const SETTINGS_TEXT = "Settings";
export const PASSWORD_LABEL = "Password";
export const DESCRIPTION = "Description";
export const PERMISSIONS = "Permissions";
export const CREATE_USER = "Create User";
export const DEACTIVATED = "DEACTIVATED";
export const HIDDEN_PASSWORD = "*******";
export const DELETE_USER = "Delete User";
export const ADD_SERVICE = "Add Service";
export const LOCATIONS_TEXT = "Locations";
export const DASHBOARD_TEXT = "Dashboard";
export const USER_ROLE = "boca_admin_role";
export const DELETE_STAFF = "Delete Staff";
export const ADD_FACILITY = "Add Facility";
export const EDIT_SERVICE = "Edit Service";
export const EDIT_FACILITY = "Edit Facility";
export const EDIT_LOCATION = "Edit Location";
export const DELETE_RECORD = "Delete Record";
export const UPDATE_SERVICE = "Update Service";
export const DELETE_PATIENT = "Delete Patient";
export const DELETE_FACILITY = "Delete Facility";
export const UPDATE_LOCATION = "Update Location";
export const ADD_FACILITY_SERVICE = "Add Service";
export const ADD_LOCATION = "Add Location";
export const PHONE_NUMBER = "Phone number";
export const NEW_PASSWORD = "New password";
export const OLD_PASSWORD = "Old password";
export const DELETE_MEDIA = "Delete Media";
export const VERIFY_EMAIL = "Verify Email";
export const SEARCH_PLACEHOLDER = "Search";
export const UNAUTHORIZED = "Unauthorized";
export const MANAGEMENT_TEXT = "Management";
export const PROPERTIES_TEXT = "Properties";
export const FACILITIES_TEXT = "Facilities";
export const VIEW_FACILITY = "View Facility";
export const TOKEN_INVALID = "Token Invalid";
export const MOBILE_NUMBER = "Mobile number";
export const RESET_FILTERS = "Reset Filters";
export const NO_DATA_FOUND = "No data found";
export const RECORD_VITALS = "Record Vitals";
export const BACK_TO_HOME = "Return to Home";
export const APPOINTMENT_TEXT = "Appointment";
export const LAB_RESULTS_TEXT = "Lab Results";
export const VISIT_REASON = "Reason for visit";
export const PAGE_NOT_FOUND = "Page Not Found";
export const EXCEPTION = "Forbidden exception";
export const DELETE_REQUEST = "Delete Request";
export const REQUEST_DETAIL = "Request Detail";
export const REQUEST_STATUS = "Request Status";
export const TEST_DATE_TIME = "Test Date/Time";
export const TEST_DATE = "Test Date";
export const TEST_TIME = "Test Time";
export const TEST_NOTES = "Test Notes";
export const SPECIMEN_TYPE = "Specimen Type";
export const SPECIMEN_NOTES = "Specimen Notes";
export const COLLECTION_DATE = "Collection Date";
export const COLLECTION_TIME = "Collection Time";
export const INITIAL_CAPITAL_INVESTMENT = "2%";
export const DOCTOR_SIGNOFF = "Doctor Signoff";
export const EMAIL_VERIFIED = "Email Verified?";
export const APPOINTMENTS_TEXT = "Appointments";
export const ROLE_DETAILS_TEXT = "Role Details";
export const SET_PERMISSIONS = "Set Permissions";
export const APPOINTMENT_INFO = "Appointment Info";
export const LAB_PERMISSIONS_TEXT = "Lab Permissions";
export const UPDATE_FACILITY_SERVICE = "Update Service";
export const INSURANCE_PLAN_TYPE = "Insurance Plan Type";
export const PATIENT_PAYMENT_TYPE = "Patient Payment Type";
export const STATE_IMMUNIZATION_ID = "State Immunization ID";
export const BILLING_PERMISSIONS_TEXT = "Billing Permissions";
export const PRACTICE_PERMISSIONS_TEXT = "Practice Permissions";
export const FACILITY_PERMISSIONS_TEXT = "Facility Permissions";
export const APPOINTMENT_PERMISSIONS_TEXT = "Appointment Permissions";
export const MISCELLANEOUS_PERMISSIONS_TEXT = "Miscellaneous Permissions";
export const USD = "USD";
export const SEX = "Sex";
export const SIZE = "Size";
export const RACE = "Race";
export const ROUTE = "Route";
export const TITLE = "Title";
export const PRICE = "Price";
export const DOB_TEXT = "DOB";
export const SUBMIT = "Submit";
export const SEARCH = "Search";
export const SIGNED = "Signed";
export const DELETE = "Delete";
export const UPLOAD = "Upload";
export const HOME_TEXT = "Home";
export const PENDING = "Pending";
export const ACTIONS = "Actions";
export const BILLING = "Billing";
export const PRIVACY = "Privacy";
export const PAYMENT = "Payment";
export const ROLES_TEXT = "Roles";
export const IS_ACTIVE = "Active";
export const TOTAL_TEXT = "Total";
export const TWO_FA_TEXT = "2-FA";
export const GUARDIAN = "Guardian";
export const EMPLOYER = "Employer";
export const CHECKOUT = "checkout";
export const INDUSTRY = "Industry";
export const RELOAD = "Go To Home";
export const LANGUAGE = "Language";
export const PRONOUNS = "Pronouns";
export const UNLOCK_TEXT = "Unlock";
export const LEGAL_SEX = "Legal Sex";
export const MORE_INFO = "More Info";
export const DIAGNOSES = "diagnoses";
export const GUARANTOR = "Guarantor";
export const MEMBER_ID = "Member ID";
export const ID_NUMBER = "ID Number";
export const YOUR_NAME = "Your Name";
export const PRN_FORMAT = 'AA123456';
export const LAB_ORDER = "Lab Order";
export const ETHNICITY = "Ethnicity";
export const CASH_PAID = "Cash Paid";
export const HOMEBOUND = "Home Bound";
export const PROFILE_TEXT = "Profile";
export const ADD_POLICY = "Add Policy";
export const EMPLOYMENT = "Employment";
export const LOINC_CODE = "LOINC Code";
export const ISSUE_DATE = "Issue Date";
export const DOB_FORMAT = 'MM-DD-YYYY';
export const HOME_PHONE = "Home Phone";
export const SCHEDULE_TEXT = "Schedule";
export const YES_CANCEL = "Yes, Cancel";
export const SSN_FORMAT = '000-00-0000';
export const CONTINUE_TEXT = "Continue";
export const NAME_FORMAT = 'First Last';
export const ADD_ROLE_TEXT = "Add Role";
export const NEXT_OF_KIN = "Next Of Kin";
export const AUTO_LOGOUT = "Auto Logout";
export const LOCK_SCREEN = "Lock Screen";
export const POLICY_NAME = "Policy Name";
export const ELIGIBILITY = "Eligibility";
export const SELECT_DATE = "Select Date";
export const SUB_TOTAL_TEXT = "Sub-Total";
export const SIGNATURE_TEXT = "Signature";
export const PAY_VIA_CASH = "Pay via Cash";
export const RESULT_VALUE = "Result Value";
export const RESULT_UNITS = "Result Units";
export const NORMAL_RANGE = "Normal Range";
export const SEX_AT_BIRTH = "Sex At Birth";
export const PAY_VIA_CARD = "Pay via Card";
export const RELATIONSHIP = "Relationship";
export const MOBILE_PHONE = "Mobile Phone";
export const PATIENT_NAME = "Patient Name";
export const DEMOGRAPHICS = "Demographics";
export const ADDRESS_CTA = "Address (CTA)";
export const MANUAL_ENTRY = "Manual Entry";
export const MY_ACCOUNT_TEXT = "My Account";
export const CLAIM_FEED_TEXT = "Claim Feed";
export const EDIT_ROLE_TEXT = "Update Role";
export const SKIP_NOW_TEXT = "Skip for now";
export const CANCELLATIONS = "Cancellations";
export const PATIENT_CHART = "Patient Chart";
export const COPAY_AMOUNTS = "Copay Amounts";
export const ADD_INSURANCE = "Add Insurance";
export const ABNORMAL_FLAG = "Abnormal Flag";
export const USER_SETTINGS = "User Settings";
export const PATIENT_NOTES = "Patient Notes";
export const EMPLOYER_NAME = "Employer Name";
export const POLICY_HOLDER = "Policy Holder";
export const PROVIDER_NAME = "Provider Name";
export const REVOKE_ACCESS = "Revoke Access";
export const DECREASED_DATE = "Deceased Date";
export const OUTSTANDING_TEXT = "Outstanding";
export const PREFERRED_NAME = "Preferred Name";
export const HOLD_STATEMENT = "Hold Statement";
export const ENTER_PASSWORD = "Enter Password";
export const PAYMENT_METHOD = "Payment Method";
export const ADDRESS_NUMBER = "Address Number";
export const CONTACT_NUMBER = "Contact Number";
export const MARITAL_STATUS = "Marital Status";
export const EMPLOYER_PHONE = "Employer Phone";
export const USUAL_INDUSTRY = "Usual Industry";
export const STATEMENT_NOTE = "Statement note";
export const PRIVACY_NOTICE = "Privacy Notice";
export const DISABLE_ACCESS_PORTAL = "Enabled";
export const PAY_VIA_PAYPAL = "Pay via PayPal";
export const EDIT_LAB_ORDER = "Edit Lab Order";
export const NOTICE_ON_FILE = "Notices on file";
export const PAY_PAYPAL_TEXT = "Pay via Paypal";
export const CANCELLATION_TEXT = "Cancellation";
export const EMAIL_FORMAT = 'example@email.com';
export const FIRST_NAME_USED = "First Name Used";
export const PATIENT_CONTACT = "Patient Contact";
export const INSURANCE_NAMES = "Insurance Names";
export const MEMBERSHIP_NAME = "Membership name";
export const MEMBERSHIP_PLAN = "Membership Plan";
export const CHANGE_PASSWORD = "Change password";
export const DETAIL_OVERVIEW = "Detail overview";
export const TEST_LOINC_CODE = "Test/LOINC Code";
export const REPEAT_PASSWORD = "Repeat password";
export const INITIAL_PAYMENT = "Initial payment";
export const TOKEN_NOT_FOUND = "Token not found";
export const USER_ROLE_PLACEHOLDER = "User Role";
export const CONSENT_TO_CALL = "Consent To call";
export const EXPIRATION_DATE = "Expiration Date";
export const GENDER_IDENTITY = "Gender Identity";
export const AVAILABLE_SLOTS = "Available Slots";
export const PATIENT_DETAILS = "Patient Details";
export const SELECT_SERVICES = "Select Services";
export const USUAL_PROVIDER_ID = "Usual Provider";
export const UPLOADS_DOCUMENT = "Upload Document";
export const FORGOT_PASSWORD = "Forgot Password?";
export const MEMBERSHIP_REQUEST_TEXT = "Requests";
export const USER_EMAIL = "boca_admin_user_email";
export const CALENDAR_VIEW_TEXT = "Calendar View";
export const POLICY_HOLDER_ID = "Policy holder ID";
export const UPLOAD_DOCUMENT = "Uploaded Document";
export const APP_NAME_FORMAT = 'First Middle Last';
export const USER_INFORMATION = "User information";
export const CONFIRM_PASSWORD = "Confirm password";
export const EMR_ADMIN_PORTAL = "EMR Admin Portal";
export const MEMBERSHIP_PLANS = "Membership Plans";
export const CURRENT_PASSWORD = "Current password";
export const SAVE_APPOINTMENT = "Save Appointment";
export const UPDATE_SIGNATURE = "Update Signature";
export const BOOK_APPOINTMENT = "Book Appointment";
export const ORDER_OF_BENEFIT = "Order of Benefit";
export const CREATE_LAB_ORDER = "Create Lab Order";
export const RESET_PASSWORD_TEXT = "Reset Password";
export const GROUP_NUMBER = "Policy / Group number";
export const REQUEST_STATUS_EVENT = "requestStatus";
export const YOU_HAVE_ENTERED = "You have entered:";
export const NO_SLOT_AVAILABLE = "No Slot available";
export const NORMAL_RANGE_UNIT = "Normal Range Unit";
export const USER_STATUS_PLACEHOLDER = "User Status";
export const EMERGENCY_CONTACT = "Emergency Contact";
export const REGISTRATION_DATE = "Registration Date";
export const PATIENT_LAST_NAME = "Patient Last Name";
export const FORGOT_PASSWORD_TEXT = "Forgot Password";
export const VIEW_SIGNED_DOCUMENT = "Signed document";
export const MEMBERSHIP_PLAN_EVENT = "MembershipPlan";
export const LIST_FACILITIES_TEXT = "List Facilities";
export const PATIENT_FIRST_NAME = "Patient First Name";
export const SCANNED_IN_RESULTS = "Scanned in Results";
export const CONFLICT_EXCEPTION = "Conflict Exception";
export const FACILITIES_LISTING = "Facilities Listing";
export const SEXUAL_ORIENTATION = "Sexual Orientation";
export const ADD_UPLOAD_IMAGES = "Add & Upload Images";
export const REFERRING_PROVIDER = "Referring Provider";
export const POLICY_INFORMATION = "Policy Information";
export const NORMAL_RANGE_UNITS = "Normal Range Units";
export const PRIMARY_DEPARTMENT = "Primary Department";
export const PREVIOUS_LAST_NAME = "Previous Last Name";
export const INSURANCE_CLAIMS_TEXT = "Insurance Claims";
export const POLICY_GROUP_NUMBER = "Policy/group number";
export const NOT_FOUND_EXCEPTION = "Not Found Exception";
export const FORBIDDEN_EXCEPTION = "Forbidden Exception";
export const CONTACT_INFORMATION = "Contact Information";
export const PREVIOUS_FIRST_NAME = "Previous First Name";
export const INDIVIDUAL_NAME = "Individual Name / Trust";
export const APPOINTMENT_DETAILS = "Appointment Details";
export const PROFILE_INFORMATION = "Profile information";
export const VIEW_APPOINTMENTS_TEXT = "View Appointments";
export const FACILITY_SERVICES_TEXT = "Facility Services";
export const VIEW_OWNERSHIP_REQUEST = "Ownership Request";
export const MOTHERS_MAIDEN_NAME = "Mother's Maiden Name";
export const PASSWORDS_MUST_MATCH = "Passwords must match";
export const PRICING_PRODUCT_TYPE = "Pricing Product Type";
export const INSURANCE_PAYER_NAME = "Insurance Payer Name";
export const ENABLE_ACCESS_PORTAL = "Enable Access Portal";
export const VALID_DATE_REQUIRED = "Valid date is required";
export const CANCEL_APPOINTMENT_TEXT = "Cancel Appointment";
export const FACILITY_LOCATIONS_TEXT = "Facility Locations";
export const ENABLE_PATIENT_ACCESS = "Enable Patient Access";
export const PRIMARY_CARE_PROVIDER = "Primary Care Provider";
export const INSURANCE_POLICY_INFO = "Insurance Policy Info";
export const POLICY_HOLDER_DETAILS = "Policy Holder Details";
export const INSURANCE_AND_POLICIES = "Insurance & Policies";
export const VERIFY_EMAIL_HEADING_TEXT = "Verify Your Email";
export const APPOINTMENT_CONFIRMED = "Appointment Confirmed";
export const CONFIRM_YOUR_PASSWORD = "Confirm your password";
export const ANNUAL_OPERATING_DUES = "Annual Operating Dues";
export const NOT_FOUND_EXCEPTION_CAP = "NOT FOUND EXCEPTION";
export const PUBLIC_FORM_SUCCESS_HEADING = 'Record Submitted';
export const PRODUCT_AND_SERVICES_TEXT = "Product & Services";
export const ALLOTED_NIGHTS_OF_USE = "Allotted Nights of Use";
export const DELETE_ACCOUNT_DESCRIPTION = "Confirm to Delete";
export const COINSURANCE_PERCENTAGE = "Coinsurance percentage";
export const TWO_FA_AUTHENTICATION = "2-Factor Authentication";
export const NOTHING_HERE_TEXT = "Seems there is nothing here";
export const DELETE_RECORD_TEXT = "You are about delete record";
export const REGISTRATION_DEPARTMENT = "Registration Department";
export const REQUEST_MEMBERSHIP_PLAN = "Request Membership Plan";
export const SCHEDULE_APPOINTMENTS_TEXT = "Schedule Appointment";
export const RELATIONSHIP_TO_PATIENT = "Relationship To Patient";
export const BOOK_YOUR_APPOINTMENT = "1 - Book Your Appointment";
export const MAINTENANCE_IN_PROGRESS = "Maintenance in progress";
export const REGISTRATION_DATES = "Provider/ Registration Dates";
export const DELETE_STAFF_DESCRIPTION = "Confirm to delete staff";
export const PAY_DEBIT_CARD_TEXT = "Pay via Debit or Credit Card";
export const PASSWORD_CHANGE_HEADING_TEXT = "Password is changed";
export const AGREEMENT_TEXT = "I agree to all terms and agreement";
export const BOCA_ADMIN_NOTIFICATIONS = "boca_admin_notifications";
export const ADD_ANOTHER_COPAY_AMOUNT = "ADD ANOTHER COPAY AMOUNT";
export const LIST_FACILITY_SERVICES_TEXT = "List Facility Services";
export const DELETE_DOCTOR_DESCRIPTION = "Confirm to delete doctor";
export const DELETE_PATIENT_DESCRIPTION = "Confirm to delete patient";
export const AGREEMENT_HEADING = "User data privacy & TOS agreement.";
export const DELETE_SERVICE_DESCRIPTION = "Confirm to delete Service";
export const PUBLIC_FORM_FAIL_MESSAGE = 'Your record is not created.';
export const VERIFICATION_MESSAGE = "You are verified. Please login.";
export const DELETE_FACILITY_DESCRIPTION = "Confirm to delete facility";
export const DELETE_LOCATION_DESCRIPTION = "Confirm to delete location";
export const DELETE_DOCUMENT_DESCRIPTION = "Confirm to delete document";
export const DELETE_PRACTICE_DESCRIPTION = "Confirm to delete practice";
export const MOST_USED_STANDARD_POLICES = "Most Used Standard Policies";
export const INSURANCE_POLICY_DETAILS = "Insurance and Policies Details";
export const CHOOSE_YOUR_PAYMENT_METHOD = "2- Choose your Payment Method";
export const EMAIL_NOT_RECEIVE_TEXT = "Did’t receive an email? Try Again";
export const GUARANTOR_RELATION = "Patient’s Relationship with guarantor";
export const MEDICATION_HISTORY_AUTHORITY = "Medication History Authority";
export const PAY_VIA_DEBIT_OR_CREDIT_CARD = "Pay via Debit or Credit Card";
export const STATEMENT_DELIVERED_ONLINE = "Statement delivered online only";
export const USUAL_OCCUPATION = "Usual Occupation (Current or Most Recent)";
export const APPOINTMENT_CANCEL_REASON = "Admin/Staff cancelled appointment";
export const MEMBER_ID_CERTIFICATE_NUMBER = "Member ID/Certification Number";
export const PATIENT_CANCELLED_APPOINTMENT = "Patient cancelled appointment";
export const PRECONDITION_FAILED_EXCEPTION = "Precondition Failed Exception";
export const GUARANTOR_NOTE = "Guarantor (Name to whom statements are sent)";
export const DELETE_APPOINTMENT_DESCRIPTION = "Confirm to cancel appointment";
export const PREFERRED_COMMUNICATION_METHOD = "Preferred Communication Method";
export const UPLOADS_DOCUMENT_LEARN_MORE_TEXT = "Drop your image here, or browse";
export const MAMMOGRAPHY_CERTIFICATION_NUMBER = "Mammography Certification Number";
export const ADD_INSURANCE_INFORMATION = "Click here to add insurance information";
export const DELETE_DOCTOR_SCHEDULE_DESCRIPTION = "Confirm to delete doctor schedule";
export const DELETE_MEDIA_DESCRIPTION = "Are you sure you want to delete this media?";
export const PUBLIC_FORM_SUCCESS_TITLE = 'Your record has been submitted successfully.';
export const DELETE_FACILITY_SCHEDULE_DESCRIPTION = "Confirm to delete facility schedule";
export const DELETE_REQUEST_DESCRIPTION = "Are you sure you want to delete this request?";
export const PATIENT_RELATIONSHIP_TO_POLICY_HOLDER = "Patient relationship to policy holder";
export const POLICY_HOLDER_ID_CERTIFICATION_NUMBER = "Policy holder ID/certification number";
export const PUBLIC_FORM_SUCCESS_DESCRIPTION_1 = 'Your Details has been record successfully.';
export const PRIMARY_INSURANCE_DESCRIPTION = "Click here to add primary insurance (Recommended)";
export const RELEASE_OF_BILLING_INFO = "Release of Billing Information and Assignment of Benefits";
export const ANNUAL_MANAGEMENT_FEE = "Annual Management Fee (based on initial capital contribution)";
export const APPOINTMENT_CONFIRM_HEADING = "We've sent you a confirmation message & email for your records.";
export const PASSWORD_CHANGE_TEXT = "Your password is successfully changed. Please Sign in to your account.";
export const AUTO_LOGOUT_DESCRIPTION = "Your account will automatically logout after a period of inactivity.";
export const APPOINTMENT_BOOKING_PAYMENT_CHARGED = "You will be charged $34.00 for this appointment booking.";
export const SLOT_CONFIRMATION_HEADING_TWO = "We've sent you a confirmation message & email for your records.";
export const SLOT_CONFIRMATION_SUB_HEADING = "Skip some of the paperwork at the clinic by adding more information.";
export const VERIFY_EMAIL_TEXT = "We have sent an email to example@emr.com please follow a link to verify your email";
export const INSURANCE_SEARCH_DESCRIPTION = "Add more names for better search results (e.g. company, group, plan, policy, etc.)";
export const APPOINTMENT_SUCCESS_DOCUMENTS_SUBHEADING1 = "Please bring a valid photo ID and any insurance cards (if applicable).";
export const SLOT_CONFIRMATION_SUB_HEADING_TWO = "You can access the information form now or later from your email or text message.";
export const APPOINTMENT_SUCCESS_DOCUMENTS_HEADING = "Thank you! When you arrive, Please make sure to have these documents with you.";
export const DELETE_RECORD_LEARN_MORE_TEXT = "You are about to delete this record permanently. Are you sure you want to delete this record?";
export const CONSENT_AGREEMENT_LABEL = "I agree to the terms & conditions and hereby, authorize EMR health facilities to keep my personal health record.";
export const APPOINTMENT_SUCCESS_DOCUMENTS_SUBHEADING2 = "Please consult your personal benefit plan details for any out-of-pocket costs which might apply (if applicable).";
export const APPOINTMENT_CANCEL_SUBHEADING = "You won’t be able to revert this action later!";
export const APPOINTMENT_CONFIRM_SUBHEADING = "Skip some of the paperwork at the clinic by adding more information. You can access the information form now or later from your email or text message.";
export const TWO_FA_AUTHENTICATION_DESCRIPTION = "When you login you provide an email address and password. This is one “factor” of authenticating who you are. 2-Factor refers to using a second factor to confirm your identity.";
export const appointmentConfirmationDescription = (dateTime: string) =>
  `Thank you! Your visit at ${getStandardTime(
    dateTime || ""
  )} on ${getFormattedDate(
    dateTime || ""
  )} has been confirmed. ${APPOINTMENT_CONFIRM_HEADING}`;
export const appointmentCancellationDescription = `Are you sure you want to cancel Devone Lane’s Appointment on 16 Feb, 2022 at time 11:00am?`;

// routes paths
export const ROOT_ROUTE = "/";
export const LOCK_ROUTE = "/lock";
export const TWO_FA_ROUTE = "/2FA";
export const STAFF_ROUTE = "/staff";
export const CHART_ROUTE = "/chart";
export const LOGIN_ROUTE = "/login";
export const ROLES_ROUTE = "/roles";
export const VITALS_ROUTE = "/vitals";
export const PROFILE_ROUTE = "/profile";
export const DOCTORS_ROUTE = "/doctors";
export const CHECK_IN_ROUTE = "/check-in";
export const SETTINGS_ROUTE = "/settings";
export const PATIENTS_ROUTE = "/patients";
export const INVOICES_ROUTE = "/invoices";
export const DASHBOARD_ROUTE = "/dashboard";
export const SIGNATURE_ROUTE = "/signature";
export const AUTO_LOGOUT_ROUTE = "/auto-logout";
export const MAINTENANCE_ROUTE = "/maintenance";
export const LAB_RESULTS_ROUTE = "/lab-results";
export const CLAIMS_ROUTE = "/insurance-claims";
export const CANCELLATION_ROUTE = "/cancellation";
export const SET_PASSWORD_ROUTE = "/set-password";
export const APPOINTMENTS_ROUTE = "/appointments";
export const VERIFY_EMAIL_ROUTE = "/verify-email";
export const FORM_BUILDER_ROUTE = "/form-builder";
export const FACILITIES_ROUTE = "/list-facilities";
export const ADD_ROLES_ROUTE = `${ROLES_ROUTE}/new`;
export const CALENDAR_ROUTE = "/dashboard/calendar";
export const FACILITY_LOCATIONS_ROUTE = "/locations";
export const RESET_PASSWORD_ROUTE = "/reset-password";
export const UPDATE_PASSWORD_ROUTE = "/update-password";
export const CHANGE_PASSWORD_ROUTE = "/change-password";
export const FORGET_PASSWORD_ROUTE = "/forget-password";
export const CANCEL_APPOINTMENT = "/cancel-appointment";
export const PUBLIC_FORM_BUILDER_ROUTE = "/public/form";
export const FORM_BUILDER_RESPONSES = "/form-responses";
export const CREATE_LAB_ORDERS_ROUTE = "/lab-orders/new";
export const EMERGENCY_ACCESS_ROUTE = "/emergency-access";
export const PRACTICE_DETAILS_ROUTE = "/practice-details";
export const VIEW_APPOINTMENTS_ROUTE = "/view-appointments";
export const FORM_BUILDER_EDIT_ROUTE = "/form-builder/edit";
export const PUBLIC_APPOINTMENT_ROUTE = "/public-appointment";
export const PRACTICE_MANAGEMENT_ROUTE = "/practice-management";
export const PATIENT_INFORMATION_ROUTE = "/patient-information";
export const FACILITY_SERVICES_ROUTE = "/list-facility-services";
export const PUBLIC_FORM_BUILDER_FAIL_ROUTE = "/public/form-form/fail";
export const APPOINTMENT_PAYMENT = `${PUBLIC_APPOINTMENT_ROUTE}/payment`;
export const FORM_BUILDER_COPY_TEMPLATE_ROUTE = "/form-builder/template";
export const PATIENT_APPOINTMENT_FAIL = `${PUBLIC_APPOINTMENT_ROUTE}/fail`;
export const PUBLIC_FORM_BUILDER_SUCCESS_ROUTE = "/public/form-form/success";
export const SLOT_CONFIRMATION = `${PUBLIC_APPOINTMENT_ROUTE}/available-slot`;
export const PROVIDER_PUBLIC_APPOINTMENT_ROUTE = "/provider-public-appointment";
export const FACILITY_PUBLIC_APPOINTMENT_ROUTE = "/facility-public-appointment";
export const PATIENT_APPOINTMENT_SUCCESS = `${PATIENT_INFORMATION_ROUTE}/success`;
export const PATIENT_APPOINTMENT_CANCEL = `${PUBLIC_APPOINTMENT_ROUTE}/appointment-cancel`;

// Facility Routes
export const BILLING_PROFILE_ROUTE = "billing-profile";
export const FACILITY_INFO_ROUTE = "facility-information";
export const FACILITY_LOCATION_ROUTE = "facility-location";
export const FACILITY_SCHEDULE_ROUTE = "business-hours";

// HELPER TEXT MESSAGES
export const MIN_LENGTH_MESSAGE = `Text too short`;
export const REQUIRED_MESSAGE = "This field is required";
export const PASSWORD_NOT_MATCHED = "Password doesn't match";
export const DOB_VALIDATION_MESSAGE = "Date of birth is invalid";
export const ALLERGY_DATE_VALIDATION_MESSAGE = "Allergy start date is invalid";
export const DELETE_REQUEST_INFO = "This will delete the request.";
export const ZIP_VALIDATION_MESSAGE = "Invalid Zip code";
export const BANK_ACCOUNT_VALIDATION_MESSAGE = "Invalid bank account.";
export const SSN_VALIDATION_MESSAGE = "SSN valid format is NNN-NN-NNNN";
export const CLIA_VALIDATION_MESSAGE = "CLIA should be 10-alphanumeric";
export const TID_VALIDATION_MESSAGE = "Tax id valid format is 9xxxxxxxx";
export const NPI_VALIDATION_MESSAGE = "NPI should be a 10-digit combination";
export const EIN_VALIDATION_MESSAGE =
  "EIN should be NN-NNNNNNN, dash is optional";
export const PLEASE_ADD_DOCUMENT =
  "Please upload or drag and drop the documents here";
export const PLEASE_CLICK_TO_UPDATE_DOCUMENT =
  "Please click here to update the documents";
export const UPIN_VALIDATION_MESSAGE =
  "UPIN should be six-place alpha numeric identifiers";
export const minDobValidMessage = (label: string) =>
  `${label}'s age should be more that 20-years`;
export const maxDobValidMessage = (label: string) =>
  `${label}'s age should be less that 100-years`;
export const REVENUE_CODE_VALIDATION_MESSAGE =
  "Revenue code should be a 4-digit combination";
export const DELETE_USER_INFO =
  "This will delete all the information associated with the user.";
export const FACILITY_CODE_VALIDATION_MESSAGE =
  "Facility code can only be capital alphabets 2-5 in length";
export const MAMMOGRAPHY_VALIDATION_MESSAGE =
  "Valid mammography certification Number format is like REF-EW-111111";
export const ValidMessage = (fieldName: string, Example?: string) =>
  `Please enter valid ${fieldName.toLowerCase()}`;
export const MaxLength = (fieldName: string, length: number) =>
  `${fieldName} can be up to ${length} characters long`;
export const MinLength = (fieldName: string, length: number) =>
  `${fieldName} should be at least ${length} characters long`;
export const USER_REQUEST_CANNOT_EDITED_NOTE =
  "Note: Investor has not signed the document. So, this request cannot be edited.";
export const TAXONOMY_VALIDATION_MESSAGE =
  "Taxonomy code should be combination of 10 alphanumerics with capital alphabets and ending with 'X'";
export const PASSWORD_VALIDATION_MESSAGE =
  "Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character";
export const PHASE_CANNOT_CHANGE_NOTE =
  "Note: Phase cannot be changed since user has already initiated the request, to change the phase first delete the request.";

// ALERT MESSAGES
export const PROFILE_UPDATE = "Profile is updated successfully";
export const EMERGENCY_ACCESS_UPDATE = "Emergency Access updated successfully";
export const SCHEDULE_END = "Schedule End Time";
export const STAFF_NOT_FOUND = "Staff not found!";
export const ROLE_NOT_FOUND = "Role not found!";
export const LOGIN_SUCCESSFULLY = "Welcome to EMR";
export const SCHEDULE_START = "Schedule Start Time";
export const INVALID_EMAIL = "Invalid email address";
export const PATIENT_NOT_FOUND = "Patient not found!";
export const SERVICE_NOT_FOUND = "Service not found!";
export const APPOINTMENT_CANCEL = "Appointment Cancel";
export const FACILITY_NOT_FOUND = "Facility not found!";
export const PRACTICE_NOT_FOUND = "Practice not found!";
export const LOCATION_NOT_FOUND = "Location not found!";
export const SCHEDULE_NOT_FOUND = "Schedule not found!";
export const STAFF_ALREADY_EXIST = "Staff already exists";
export const DROP_FIELD = "Please drop at least one field";
export const CANT_DELETE_STAFF = "Staff can't be deleted.";
export const CANT_DELETE_SELF_STAFF = "Staff can't delete itself";
export const ROLE_CREATED = "Role is created successfully";
export const ROLE_UPDATED = "Role is updated successfully";
export const STAFF_CREATED = "Staff created successfully!";
export const STAFF_UPDATED = "Staff updated successfully!";
export const TRY_AGAIN = "Something went wrong. Try again!";
export const SOMETHING_WENT_WRONG = "Something went wrong!";
export const CANT_DELETE_DOCTOR = "Doctor can't be deleted.";
export const DOCTOR_CREATED = "Doctor created successfully!";
export const DOCTOR_UPDATED = "Doctor updated successfully!";
export const NO_FACILITY_MESSAGE = "No facility exists yet!";
export const APPOINTMENT_NOT_FOUND = "Appointment not found!";
export const TOKEN_EXPIRED = "Verification token is expired.";
export const CANT_DELETE_USER = "This user can't be deleted.";
export const MAINTENANCE_ALERT = "Maintenance is in progress";
export const SERVICE_CREATED = "Service created successfully!";
export const SERVICE_UPDATED = "Service updated successfully!";
export const CANT_DELETE_PATIENT = "Patient can't be deleted.";
export const INVOICE_CREATED = "Invoice created successfully!";
export const PATIENT_CREATED = "Patient created successfully!";
export const PATIENT_UPDATED = "Patient updated successfully!";
export const CANT_DELETE_SERVICE = "Service can't be deleted.";
export const RESET_PASSWORD_TOKEN_NOT_FOUND = "Token not found.";
export const CANT_DELETE_PRACTICE = "Practice can't be deleted.";
export const LOCATION_DELETED_SUCCESSFULLY = "Location deleted.";
export const USER_EXIST = "User already exists with this email.";
export const FACILITY_UPDATED = "Facility updated successfully!";
export const CANT_DELETE_FACILITY = "Facility can't be deleted.";
export const CANT_DELETE_LOCATION = "Location can't be deleted.";
export const FACILITY_CREATED = "Facility created successfully!";
export const USER_NOT_FOUND_EXCEPTION_MESSAGE = "User not found.";
export const USER_CREATED = "User has been created successfully.";
export const NO_USER_WITH_EMAIL = "No user found with this email.";
export const PERMISSIONS_SET = "Role Permissions set successfully";
export const FAILED_TO_CREATE_PATIENT = "Failed to create patient!";
export const FAILED_TO_UPDATE_PATIENT = "Failed to update patient!";
export const FORBIDDEN_ROUTE = "This resource is forbidden for you!";
export const ATTACHMENT_DELETED = "Attachment deleted successfully!";
export const NO_ASSOCIATED_PRACTICE = "No associated practice found!";
export const ALREADY_ACTIVATED_MESSAGE = "User is already activated.";
export const CANT_UPDATE_SYSTEM_ROLES = "System roles can't be update";
export const OLD_PASSWORD_DID_NOT_MATCH = "Old password didn't match!";
export const APPOINTMENT_NOT_FOUND_EXCEPTION = "Appointment not found";
export const CANT_UPDATE_APPOINTMENT = "Appointment can't be updated.";
export const EMAIL_OR_USERNAME_ALREADY_EXISTS = "Email already exists!";
export const ROLE_ALREADY_EXIST = "Role already exists with this name!";
export const CANT_BOOK_APPOINTMENT = "You can not book this appointment.";
export const ALREADY_DEACTIVATED_MESSAGE = "User is already deactivated.";
export const PATIENT_ALLERGY_ADDED = "Patient allergy added successfully!";
export const CANT_CANCELLED_APPOINTMENT = "Appointment can't be cancelled.";
export const ADMIN_PORTAL_MESSAGE = "Please sign in to explore Admin Portal.";
export const NOT_SUPER_ADMIN_MESSAGE = "Only Admins can access Admin Portal!";
export const PATIENT_ALLERGY_UPDATED = "Patient allergy update successfully!";
export const RESET_PASSWORD_MESSAGE = "Please enter your new secure password.";
export const PATIENT_ALLERGY_DELETED = "Patient allergy deleted successfully!";
export const SCHEDULE_CREATED_SUCCESSFULLY = "Schedule is booked successfully";
export const CANT_DELETE_DOCTOR_SCHEDULE = "Doctor schedule can't be deleted.";
export const SET_PASSWORD_SUCCESS = "Your password has been set successfully.";
export const SCHEDULE_UPDATED_SUCCESSFULLY = "Schedule is updated successfully";
export const TRANSACTION_PAID_SUCCESSFULLY = "Transaction is paid successfully";
export const PRECONDITION_FAILED_EXCEPTION_MESSAGE =
  "Resource can't be deleted.";
export const WRONG_EMAIL_OR_PASSWORD =
  "You have entered wrong email or password";
export const PRACTICE_USER_ALREADY_EXISTS =
  "User with this email already exists";
export const LOGIN_TEXT_MESSAGE =
  "Enter your credentials to login to your portal";
export const APPOINTMENT_BOOKED_SUCCESSFULLY =
  "Appointment is booked successfully";
export const APPOINTMENT_CANCEL_TEXT =
  "Your appointment is cancelled successfully";
export const RESET_PASSWORD_SUCCESS =
  "Your password has been changed successfully.";
export const LOGIN_MESSAGE =
  "Please sign in to explore all that BOCA+ has to offer.";
export const SET_PASSWORD_TEXT_MESSAGE =
  "Set your password and login to your portal";
export const APPOINTMENT_UPDATED_SUCCESSFULLY =
  "Appointment is updated successfully";
export const PERMISSION_DENIED =
  "You don't have permission to access these resources";
export const PAYMENT_CANT_DONE =
  "Patient not exist in system, so payment can't be done";
export const CANCELLED_APPOINTMENT_EDIT_MESSAGE =
  "Cancelled appointment cant be edited!";
export const RESET_PASSWORD_TEXT_MESSAGE =
  "Reset your password and login to your portal";
export const INVALID_OR_EXPIRED_TOKEN_MESSAGE =
  "Sorry! Your token is expired or invalid.";
export const FORGOT_PASSWORD_MESSAGE =
  "Please enter your email to get a reset-password link.";
export const LOGGED_OUT_BEFORE_RESETTING_PASSWORD =
  "Please log out before resetting password";
export const FORGET_PASSWORD_SUCCESS =
  "An email has been sent to your registered email address";
export const APPOINTMENT_STATUS_UPDATED_SUCCESSFULLY =
  "Appointment status is updated successfully";
export const SLOT_ALREADY_BOOKED =
  "This patient has already a booked appointment with this provider.";
export const APPOINTMENT_SLOT_ERROR_MESSAGE =
  "Appointment Time is required. Please select available slot!";
export const PRACTICE_OR_FACILITY_ALREADY_EXISTS =
  "Practice/Facility already exits against provided data!";
export const FORGOT_PASSWORD_TEXT_MESSAGE =
  "Enter your registered email address to get reset-password link";
export const CANT_VERIFY_EMAIL_WHILE_LOGGED_IN_MESSAGE =
  "You can't verify a email while you are logged in.";
export const EMAIL_CHANGED_OR_NOT_VERIFIED_MESSAGE =
  "Email changed or not verified, please verify your email";
export const INVALID_OR_EXPIRED_VERIFICATION_TOKEN_MESSAGE =
  "Sorry! Your verification token is expired or invalid";
export const CANCEL_TIME_EXPIRED_MESSAGE =
  "Appointment is to be scheduled in less than 1 hour, It can't ne cancelled now";
export const EXPIRE_TOKEN_MESSAGE =
  "Your token has been expired. Please click on the button below to get an email again.";
export const appointmentChargesDescription = (amount: string) =>
  `You will be charged $${amount} for this appointment booking.`;
export const LOREM_TEXT_15 =
  "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente atque explicabo debitis inventore delectus quos!";

// INFO MESSAGES
export const FEDERAL_TAX_ID_INFO =
  "Known as Employer Identification Number (EIN) and is used to identify a business entity";
export const NPI_INFO =
  "The NPI is a unique identification number for covered health care providers and is a unique 10-digit number";
export const TAXONOMY_CODE_INFO =
  " Taxonomy code is a unique 10-character code that designates your classification and specialization.";
export const EIN_INFO =
  "An Employer Identification Number (EIN) is a nine-digit number that IRS assigns in the following format: XX-XXXXXXX";
export const TAX_ID_INFO =
  "A Tax Identification Number is a nine-digit number used as a tracking number by the Internal Revenue Service (IRS).";
export const MAMOGRAPHY_CERTIFICATION_NUMBER_INFO =
  "The Mammography Certification Number is required on Medicare claims for all mammography services. Format is REF*EW*111111";
export const UPIN_INFO =
  "A unique physician identification number (UPIN) was a six-character alpha-numeric identifier used by Medicare to identify doctors in the United States.";
export const CLIA_ID_NUMBER_INFO =
  "This number is used to identify and track your laboratory throughout its entire history. Each CLIA number consists of ten alphanumeric digits";

export const APP_MENU_ITEMS = [
  {
    name: MANAGEMENT_TEXT,
    items: [],
    index: 2,
    sectionName: true,
  },
  {
    name: USERS_TEXT,
    Icon: UsersIcon,
    index: 3,
    items: [
      {
        name: DOCTORS_TEXT,
        link: DOCTORS_ROUTE,
      },
      {
        name: PATIENTS_TEXT,
        link: PATIENTS_ROUTE,
      },
      {
        name: STAFF_TEXT,
        link: STAFF_ROUTE,
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
        link: VIEW_APPOINTMENTS_ROUTE,
      },
      {
        name: SCHEDULE_APPOINTMENTS_TEXT,
        link: `${APPOINTMENTS_ROUTE}/new`,
      },
    ],
  },
  {
    name: CLINICAL_TEXT,
    items: [],
    index: 5,
    sectionName: true,
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

export const USER_MENU_ITEMS = [
  {
    name: DOCTORS_TEXT,
    link: DOCTORS_ROUTE,
  },
  {
    name: STAFF_TEXT,
    link: STAFF_ROUTE,
  },
];

export const APPOINTMENT_MENU_ITEMS = [
  {
    name: VIEW_APPOINTMENTS_TEXT,
    link: VIEW_APPOINTMENTS_ROUTE,
  },
  {
    name: SCHEDULE_APPOINTMENTS_TEXT,
    link: `${APPOINTMENTS_ROUTE}/new`,
  },
  {
    name: CALENDAR_VIEW_TEXT,
    link: CALENDAR_ROUTE,
  },
];

export const PROFILE_GENERAL_MENU_ITEMS = [
  {
    name: PROFILE_TEXT,
    link: PROFILE_ROUTE,
  },
  {
    name: SIGNATURE_TEXT,
    link: SIGNATURE_ROUTE,
  },
  {
    name: CANCELLATIONS,
    link: CANCELLATION_ROUTE,
  },
];

export const PROFILE_SECURITY_MENU_ITEMS = [
  {
    name: CHANGE_PASSWORD,
    link: CHANGE_PASSWORD_ROUTE,
  },
  {
    name: TWO_FA_TEXT,
    link: TWO_FA_ROUTE,
  },
  {
    name: AUTO_LOGOUT,
    link: AUTO_LOGOUT_ROUTE,
  },
];

export const BILLING_MENU_ITEMS = [
  {
    name: INVOICES_TEXT,
    link: INVOICES_ROUTE,
  },
  {
    name: INSURANCE_CLAIMS_TEXT,
    link: CLAIMS_ROUTE,
  },
];

export const MAPPED_WIDGETS: SelectorOption[] = [
  { id: "one", name: "one" },
  { id: "two", name: "two" },
  { id: "three", name: "three" },
  { id: "four", name: "four" },
];

export const MAPPED_ALLERGY_SEVERITY: SelectorOption[] = [
  { id: AllergySeverity.Acute, name: formatValue(AllergySeverity.Acute) },
  { id: AllergySeverity.Mild, name: formatValue(AllergySeverity.Mild) },
  { id: AllergySeverity.Moderate, name: formatValue(AllergySeverity.Moderate) },
  { id: AllergySeverity.VeryMild, name: formatValue(AllergySeverity.VeryMild) }
];

export const MAPPED_PRACTICE_TYPES: SelectorOption[] = [
  { id: PracticeType.Lab, name: formatValue(PracticeType.Lab) },
  { id: PracticeType.Clinic, name: formatValue(PracticeType.Clinic) },
  { id: PracticeType.Hospital, name: formatValue(PracticeType.Hospital) },
];

export const MAPPED_APPOINTMENT_STATUS: SelectorOption[] = [
  {
    id: Appointmentstatus.Cancelled,
    name: formatValue(Appointmentstatus.Cancelled),
  },
  {
    id: Appointmentstatus.Completed,
    name: formatValue(Appointmentstatus.Completed),
  },
  {
    id: Appointmentstatus.Initiated,
    name: formatValue(Appointmentstatus.Initiated),
  },
];

export const MAPPED_TIME_ZONES: SelectorOption[] = moment.tz
  .names()
  .map((timezone) => {
    return { id: timezone, name: formatValue(timezone) };
  });

export const MAPPED_COUNTRIES: SelectorOption[] = [{ id: USA, name: USA }];
export const MAPPED_STATES: SelectorOption[] = states.map(
  ({ name, abbreviation }) => ({ id: name, name: `${name} - ${abbreviation}` })
);

export const MAPPED_SERVICE_CODES: SelectorOption[] = [
  {
    id: ServiceCode.Pharmacy_01,
    name: formatServiceCode(ServiceCode.Pharmacy_01),
  },
  {
    id: ServiceCode.TelehealthOtherThanPatientHome_02,
    name: formatServiceCode(ServiceCode.TelehealthOtherThanPatientHome_02),
  },
  { id: ServiceCode.School_03, name: formatServiceCode(ServiceCode.School_03) },
  {
    id: ServiceCode.HomelessShelter_04,
    name: formatServiceCode(ServiceCode.HomelessShelter_04),
  },
  {
    id: ServiceCode.IndianHealthServiceFreeStandingFacility_05,
    name: formatServiceCode(
      ServiceCode.IndianHealthServiceFreeStandingFacility_05
    ),
  },
  {
    id: ServiceCode.IndianHealthServiceProviderBasedFacility_06,
    name: formatServiceCode(
      ServiceCode.IndianHealthServiceProviderBasedFacility_06
    ),
  },
  { id: ServiceCode.Tribal_07, name: formatServiceCode(ServiceCode.Tribal_07) },
  { id: ServiceCode.Prison_09, name: formatServiceCode(ServiceCode.Prison_09) },
  {
    id: ServiceCode.Telehealth_10,
    name: formatServiceCode(ServiceCode.Telehealth_10),
  },
  { id: ServiceCode.Prison_10, name: formatServiceCode(ServiceCode.Prison_10) },
  { id: ServiceCode.Office_11, name: formatServiceCode(ServiceCode.Office_11) },
  { id: ServiceCode.Home_12, name: formatServiceCode(ServiceCode.Home_12) },
  {
    id: ServiceCode.AssistedLiving_13,
    name: formatServiceCode(ServiceCode.AssistedLiving_13),
  },
  {
    id: ServiceCode.GroupHome_14,
    name: formatServiceCode(ServiceCode.GroupHome_14),
  },
  {
    id: ServiceCode.MobileUnit_15,
    name: formatServiceCode(ServiceCode.MobileUnit_15),
  },
  {
    id: ServiceCode.TemporaryLoOgoing_16,
    name: formatServiceCode(ServiceCode.TemporaryLoOgoing_16),
  },
  {
    id: ServiceCode.PlaceOfEmployment_18,
    name: formatServiceCode(ServiceCode.PlaceOfEmployment_18),
  },
  {
    id: ServiceCode.OffCampusOutpatientHospital_19,
    name: formatServiceCode(ServiceCode.OffCampusOutpatientHospital_19),
  },
  {
    id: ServiceCode.UrgentCare_20,
    name: formatServiceCode(ServiceCode.UrgentCare_20),
  },
  {
    id: ServiceCode.InpatientHospital_21,
    name: formatServiceCode(ServiceCode.InpatientHospital_21),
  },
  {
    id: ServiceCode.OutpatientHospital_22,
    name: formatServiceCode(ServiceCode.OutpatientHospital_22),
  },
  {
    id: ServiceCode.EmergencyRoomHospital_23,
    name: formatServiceCode(ServiceCode.EmergencyRoomHospital_23),
  },
  {
    id: ServiceCode.AmbulatorySurgicalCenter_24,
    name: formatServiceCode(ServiceCode.AmbulatorySurgicalCenter_24),
  },
  {
    id: ServiceCode.BirthingCenter_25,
    name: formatServiceCode(ServiceCode.BirthingCenter_25),
  },
  {
    id: ServiceCode.MilitaryTreatmentFacility_26,
    name: formatServiceCode(ServiceCode.MilitaryTreatmentFacility_26),
  },
  {
    id: ServiceCode.SkilledNursingFacility_31,
    name: formatServiceCode(ServiceCode.SkilledNursingFacility_31),
  },
  {
    id: ServiceCode.NursingFacility_32,
    name: formatServiceCode(ServiceCode.NursingFacility_32),
  },
  {
    id: ServiceCode.CustodialCareFacility_33,
    name: formatServiceCode(ServiceCode.CustodialCareFacility_33),
  },
  {
    id: ServiceCode.Hospice_34,
    name: formatServiceCode(ServiceCode.Hospice_34),
  },
  {
    id: ServiceCode.AmbulanceLand_41,
    name: formatServiceCode(ServiceCode.AmbulanceLand_41),
  },
  {
    id: ServiceCode.Ambulance_42,
    name: formatServiceCode(ServiceCode.Ambulance_42),
  },
  {
    id: ServiceCode.IndependentClinic_49,
    name: formatServiceCode(ServiceCode.IndependentClinic_49),
  },
  {
    id: ServiceCode.FederallyQualifiedHealthCenter_50,
    name: formatServiceCode(ServiceCode.FederallyQualifiedHealthCenter_50),
  },
  {
    id: ServiceCode.InpatientPsychiatricFacility_51,
    name: formatServiceCode(ServiceCode.InpatientPsychiatricFacility_51),
  },
  {
    id: ServiceCode.PsychiatricFacilityPartialHospitilization_52,
    name: formatServiceCode(
      ServiceCode.PsychiatricFacilityPartialHospitilization_52
    ),
  },
  {
    id: ServiceCode.CommunityMentalHealthCenter_53,
    name: formatServiceCode(ServiceCode.CommunityMentalHealthCenter_53),
  },
  {
    id: ServiceCode.IntermediateCareFacilityMentallyRetarded_54,
    name: formatServiceCode(
      ServiceCode.IntermediateCareFacilityMentallyRetarded_54
    ),
  },
  {
    id: ServiceCode.ResidentialSubstanceAbuseTreatmenmtFacility_55,
    name: formatServiceCode(
      ServiceCode.ResidentialSubstanceAbuseTreatmenmtFacility_55
    ),
  },
  {
    id: ServiceCode.PsychiatricResidentialTreatmentCenter_56,
    name: formatServiceCode(
      ServiceCode.PsychiatricResidentialTreatmentCenter_56
    ),
  },
  {
    id: ServiceCode.NonResidentialSubstanceAbuseTreatmentFacility_57,
    name: formatServiceCode(
      ServiceCode.NonResidentialSubstanceAbuseTreatmentFacility_57
    ),
  },
  {
    id: ServiceCode.NonResidentialOpioidTreatmentFacility_58,
    name: formatServiceCode(
      ServiceCode.NonResidentialOpioidTreatmentFacility_58
    ),
  },
  {
    id: ServiceCode.MassImmunizationCenter_60,
    name: formatServiceCode(ServiceCode.MassImmunizationCenter_60),
  },
  {
    id: ServiceCode.ComprehensiveInpatientRehabilitationFacility_61,
    name: formatServiceCode(
      ServiceCode.ComprehensiveInpatientRehabilitationFacility_61
    ),
  },
  {
    id: ServiceCode.ComprehensiveOutpatientRehabilitationFacility_62,
    name: formatServiceCode(
      ServiceCode.ComprehensiveOutpatientRehabilitationFacility_62
    ),
  },
  {
    id: ServiceCode.EndStageRenalDiseaseTreatmentFacility_65,
    name: formatServiceCode(
      ServiceCode.EndStageRenalDiseaseTreatmentFacility_65
    ),
  },
  {
    id: ServiceCode.StateOrLocalPublicHealthClinic_71,
    name: formatServiceCode(ServiceCode.StateOrLocalPublicHealthClinic_71),
  },
  {
    id: ServiceCode.RuralHealthClinic_72,
    name: formatServiceCode(ServiceCode.RuralHealthClinic_72),
  },
  {
    id: ServiceCode.IndependentLaboratory_81,
    name: formatServiceCode(ServiceCode.IndependentLaboratory_81),
  },
  {
    id: ServiceCode.WalkInRetailHealthClinic,
    name: formatServiceCode(ServiceCode.WalkInRetailHealthClinic),
  },
];

export const MAPPED_SPECIALTIES: SelectorOption[] = [
  {
    id: Speciality.AllergyOrImmunology,
    name: formatValue(Speciality.AllergyOrImmunology),
  },
  {
    id: Speciality.Anesthesiology,
    name: formatValue(Speciality.Anesthesiology),
  },
  { id: Speciality.Cardiology, name: formatValue(Speciality.Cardiology) },
  { id: Speciality.Dermatology, name: formatValue(Speciality.Dermatology) },
  {
    id: Speciality.FamilyPractice,
    name: formatValue(Speciality.FamilyPractice),
  },
  {
    id: Speciality.Gastroenterology,
    name: formatValue(Speciality.Gastroenterology),
  },
  {
    id: Speciality.GeneralPractice,
    name: formatValue(Speciality.GeneralPractice),
  },
  {
    id: Speciality.GeneralSurgery,
    name: formatValue(Speciality.GeneralSurgery),
  },
  {
    id: Speciality.InternalMedicine,
    name: formatValue(Speciality.InternalMedicine),
  },
  {
    id: Speciality.InterventionalPainManagement,
    name: formatValue(Speciality.InterventionalPainManagement),
  },
  { id: Speciality.Neurology, name: formatValue(Speciality.Neurology) },
  { id: Speciality.Neurosurgery, name: formatValue(Speciality.Neurosurgery) },
  {
    id: Speciality.ObstetricsOrGynecology,
    name: formatValue(Speciality.ObstetricsOrGynecology),
  },
  { id: Speciality.Ophthalmology, name: formatValue(Speciality.Ophthalmology) },
  { id: Speciality.OralSurgery, name: formatValue(Speciality.OralSurgery) },
  {
    id: Speciality.OrthopedicSurgery,
    name: formatValue(Speciality.OrthopedicSurgery),
  },
  {
    id: Speciality.OsteopathicManipulativeTherapy,
    name: formatValue(Speciality.OsteopathicManipulativeTherapy),
  },
  {
    id: Speciality.Otolaryngology,
    name: formatValue(Speciality.Otolaryngology),
  },
  { id: Speciality.Pathology, name: formatValue(Speciality.Pathology) },
  {
    id: Speciality.PediatricDentist,
    name: formatValue(Speciality.PediatricDentist),
  },
  {
    id: Speciality.PediatricDermatology,
    name: formatValue(Speciality.PediatricDermatology),
  },
  { id: Speciality.Periodontics, name: formatValue(Speciality.Periodontics) },
  { id: Speciality.Pharmacist, name: formatValue(Speciality.Pharmacist) },
  {
    id: Speciality.PhysicalMedicineAndRehabilitation,
    name: formatValue(Speciality.PhysicalMedicineAndRehabilitation),
  },
  {
    id: Speciality.PhysicianAssistant,
    name: formatValue(Speciality.PhysicianAssistant),
  },
  {
    id: Speciality.PlasticAndReconstructiveSurgery,
    name: formatValue(Speciality.PlasticAndReconstructiveSurgery),
  },
  { id: Speciality.Psychiatry, name: formatValue(Speciality.Psychiatry) },
];

export const MAPPED_MARITAL_STATUS: SelectorOption[] = [
  { id: Maritialstatus.Single, name: formatValue(Maritialstatus.Single) },
  { id: Maritialstatus.Widowed, name: formatValue(Maritialstatus.Widowed) },
  { id: Maritialstatus.Divorced, name: formatValue(Maritialstatus.Divorced) },
  { id: Maritialstatus.Separated, name: formatValue(Maritialstatus.Separated) },
];

export const MAPPED_HOMEBOUND: SelectorOption[] = [
  { id: Homebound.No, name: Homebound.No },
  { id: Homebound.Yes, name: Homebound.Yes },
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
  {
    id: Race.BlackAfricanAmerican,
    name: formatValue(Race.BlackAfricanAmerican),
  },
  {
    id: Race.BlackAfricanAmerican,
    name: formatValue(Race.BlackAfricanAmerican),
  },
  {
    id: Race.AmericanIndianAlaskaNative,
    name: formatValue(Race.AmericanIndianAlaskaNative),
  },
  {
    id: Race.NativeHawaiianPacificIslander,
    name: formatValue(Race.NativeHawaiianPacificIslander),
  },
];

export const MAPPED_ETHNICITY: SelectorOption[] = [
  { id: Ethnicity.None, name: formatValue(Ethnicity.None) },
  {
    id: Ethnicity.CenteralAmerican,
    name: formatValue(Ethnicity.CenteralAmerican),
  },
  {
    id: Ethnicity.CenteralAmericanIndian,
    name: formatValue(Ethnicity.CenteralAmericanIndian),
  },
];

export const MAPPED_SEXUAL_ORIENTATION: SelectorOption[] = [
  { id: Sexualorientation.None, name: formatValue(Sexualorientation.None) },
  {
    id: Sexualorientation.DontKnow,
    name: formatValue(Sexualorientation.DontKnow),
  },
  {
    id: Sexualorientation.Bisexual,
    name: formatValue(Sexualorientation.Bisexual),
  },
  {
    id: Sexualorientation.Homosexual,
    name: formatValue(Sexualorientation.Homosexual),
  },
  {
    id: Sexualorientation.Heterosexual,
    name: formatValue(Sexualorientation.Heterosexual),
  },
];

export const MAPPED_GENDER: SelectorOption[] = [
  { id: Gender.Male, name: formatValue(Gender.Male) },
  { id: Gender.Female, name: formatValue(Gender.Female) },
  { id: Gender.Other, name: formatValue(Gender.Other) },
];

export const MAPPED_GENDER_IDENTITY: SelectorOption[] = [
  { id: Genderidentity.None, name: formatValue(Genderidentity.None) },
  { id: Genderidentity.Male, name: formatValue(Genderidentity.Male) },
  { id: Genderidentity.Female, name: formatValue(Genderidentity.Female) },
  {
    id: Genderidentity.NotExclusive,
    name: formatValue(Genderidentity.NotExclusive),
  },
];

export const MAPPED_PAYMENT_METHOD: SelectorOption[] = [
  { id: PaymentType.Self, name: formatValue(PaymentType.Self) },
  { id: PaymentType.Insurance, name: formatValue(PaymentType.Insurance) },
];

export const MAPPED_COMMUNICATION_METHOD: SelectorOption[] = [
  { id: Communicationtype.Email, name: formatValue(Communicationtype.Email) },
  {
    id: Communicationtype.Message,
    name: formatValue(Communicationtype.Message),
  },
  { id: Communicationtype.Phone, name: formatValue(Communicationtype.Phone) },
  {
    id: Communicationtype.VoiceMessage,
    name: formatValue(Communicationtype.VoiceMessage),
  },
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
  {
    id: RelationshipType.Employee,
    name: formatValue(RelationshipType.Employee),
  },
  {
    id: RelationshipType.OrganDonor,
    name: formatValue(RelationshipType.OrganDonor),
  },
  {
    id: RelationshipType.Grandchild,
    name: formatValue(RelationshipType.Grandchild),
  },
  {
    id: RelationshipType.LifePartner,
    name: formatValue(RelationshipType.LifePartner),
  },
  {
    id: RelationshipType.Grandparent,
    name: formatValue(RelationshipType.Grandparent),
  },
  {
    id: RelationshipType.NephewNiece,
    name: formatValue(RelationshipType.NephewNiece),
  },
  {
    id: RelationshipType.FostherChild,
    name: formatValue(RelationshipType.FostherChild),
  },
  {
    id: RelationshipType.CadaverDonor,
    name: formatValue(RelationshipType.CadaverDonor),
  },
  {
    id: RelationshipType.SignificantOther,
    name: formatValue(RelationshipType.SignificantOther),
  },
  {
    id: RelationshipType.EmancipatedMinor,
    name: formatValue(RelationshipType.EmancipatedMinor),
  },
  {
    id: RelationshipType.InjuredPlaintiiff,
    name: formatValue(RelationshipType.InjuredPlaintiiff),
  },
  {
    id: RelationshipType.SponsoredDependent,
    name: formatValue(RelationshipType.SponsoredDependent),
  },
  {
    id: RelationshipType.StepsonStepdaughter,
    name: formatValue(RelationshipType.StepsonStepdaughter),
  },
  {
    id: RelationshipType.ChildMotherInsurance,
    name: formatValue(RelationshipType.ChildMotherInsurance),
  },
  {
    id: RelationshipType.HandicappedDependent,
    name: formatValue(RelationshipType.HandicappedDependent),
  },
  {
    id: RelationshipType.ChildFatherInsurance,
    name: formatValue(RelationshipType.ChildFatherInsurance),
  },
  {
    id: RelationshipType.DependentOfMinorDependent,
    name: formatValue(RelationshipType.DependentOfMinorDependent),
  },
  {
    id: RelationshipType.StepsonStepdaughterStepmotherInsrtance,
    name: formatValue(RelationshipType.StepsonStepdaughterStepmotherInsrtance),
  },
  {
    id: RelationshipType.StepsonStepdaughterStepfatherInsrtance,
    name: formatValue(RelationshipType.StepsonStepdaughterStepfatherInsrtance),
  },
];

export const StepperIcons: { [index: string]: number } = { 1: 1, 2: 2, 3: 3 };

export const PATIENT_REGISTRATION_STEPS: StepLabelType[] = [
  { title: "Patient Information" },
  { title: "Document Verification" },
];

// Breadcrumb links
export const SERVICES_BREAD = (facilityId: string) =>  {
  return { text: SERVICES, link: `${FACILITIES_ROUTE}/${facilityId}${FACILITY_SERVICES_ROUTE}` }
}

export const FACILITIES_BREAD = { text: FACILITIES_LISTING, link: FACILITIES_ROUTE, };

export const FACILITY_SERVICES_BREAD = {
  text: FACILITY_SERVICES_TEXT,
  link: FACILITY_SERVICES_ROUTE,
};

export const FACILITY_NEW_BREAD = {
  text: ADD_FACILITY,
  link: `${FACILITIES_ROUTE}/new`,
};

export const FACILITY_EDIT_BREAD = { text: EDIT_FACILITY, link: "" };
export const FACILITY_LOCATIONS_BREAD = {
  text: FACILITY_LOCATIONS_TEXT,
  link: FACILITY_LOCATIONS_ROUTE,
};

export const FACILITY_LOCATION_NEW_BREAD = { text: ADD_LOCATION, link: "" };
export const FACILITY_LOCATION_EDIT_BREAD = { text: EDIT_LOCATION, link: "" };
export const FACILITY_SERVICE_NEW_BREAD = { text: ADD_SERVICE, link: "" };
export const FACILITY_SERVICE_EDIT_BREAD = { text: EDIT_SERVICE, link: "" };
export const STAFF_BREAD = { text: STAFF_TEXT, link: STAFF_ROUTE };
export const DOCTORS_BREAD = { text: DOCTORS_TEXT, link: DOCTORS_ROUTE };
export const DOCTOR_NEW_BREAD = { text: ADD_DOCTOR, link: `${DOCTORS_ROUTE}/new`, };

export const APPOINTMENT_NEW_BREAD = {
  text: ADD_APPOINTMENT,
  link: `${APPOINTMENTS_ROUTE}/new`,
};

export const APPOINTMENT_EDIT_BREAD = { text: EDIT_APPOINTMENT, link: "" };
export const RESULT_NEW_BREAD = { text: ADD_RESULT, link: `${LAB_RESULTS_ROUTE}/new`, };

export const BILL_NEW_BREAD = { text: ADD_BILL, link: CLAIMS_ROUTE };
export const DOCTOR_EDIT_BREAD = { text: EDIT_DOCTOR, link: "" };
export const PATIENTS_BREAD = { text: PATIENTS_TEXT, link: PATIENTS_ROUTE };
export const PATIENT_NEW_BREAD = { text: ADD_PATIENT, link: `${PATIENTS_ROUTE}/new`, };
export const PRACTICE_BREAD = { text: PRACTICE_MANAGEMENT_TEXT, link: PRACTICE_MANAGEMENT_ROUTE };
export const PRACTICE_NEW_BREAD = { text: ADD_PRACTICE, link: `${PRACTICE_MANAGEMENT_ROUTE}/new`, };
export const PRACTICE_EDIT_BREAD = { text: EDIT_PRACTICE, link: "" };
export const ROLES_BREAD = { text: ROLES_TEXT, link: ROLES_ROUTE };
export const ROLES_EDIT_BREAD = { text: EDIT_ROLE_TEXT, link: "" };
export const ROLES_ADD_BREAD = { text: ADD_ROLE_TEXT, link: "" };
export const FORMS_BREAD = { text: FORMS, link: FORM_BUILDER_ROUTE };
export const FORMS_ADD_BREAD = { text: ADD_FORM, link: "" };
export const FORMS_EDIT_BREAD = { text: EDIT_FORM, link: "" };

export const PATIENT_CHART_BREAD = { text: PATIENT_CHART, link: "" };
export const PATIENT_EDIT_BREAD = { text: EDIT_PATIENT, link: "" };
export const STAFF_NEW_BREAD = { text: ADD_STAFF, link: `${STAFF_ROUTE}/new` };
export const STAFF_EDIT_BREAD = { text: EDIT_STAFF, link: "" };
export const DASHBOARD_BREAD = { text: DASHBOARD_TEXT, link: DASHBOARD_ROUTE };
export const USERS_BREAD = { text: USERS_TEXT, link: "" };
export const APPOINTMENTS_BREAD = { text: APPOINTMENTS_TEXT, link: "" };
export const SCHEDULE_BREAD = { text: SCHEDULE_TEXT, link: "" };
export const SETTINGS_BREAD = { text: SETTINGS_TEXT, link: SETTINGS_ROUTE };
export const BILLING_BREAD = { text: BILLING_TEXT, link: "" };
export const REPORTS_BREAD = { text: REPORTS_TEXT, link: "" };
export const LAB_RESULTS_BREAD = { text: LAB_RESULTS_TEXT, link: LAB_RESULTS_ROUTE, };

export const CLAIM_FEED_BREAD = { text: CLAIM_FEED_TEXT, link: CLAIMS_ROUTE };
export const INVOICES_BREAD = { text: INVOICES_TEXT, link: INVOICES_ROUTE };
export const VIEW_APPOINTMENTS_BREAD = {
  text: VIEW_APPOINTMENTS_TEXT,
  link: VIEW_APPOINTMENTS_ROUTE,
};

export const CALENDAR_VIEW_APPOINTMENTS_BREAD = { text: CALENDAR_VIEW_TEXT, link: CALENDAR_ROUTE, };

// profile top tabs
export const PROFILE_TOP_TABS = [
  {
    title: "General Info",
    value: "1",
  },
  {
    title: "Insurance",
    value: "2",
  },
  {
    title: "Registration",
    value: "3",
  },
  {
    title: "Messaging",
    value: "4",
  },
  {
    title: "Billing",
    value: "5",
  },
  {
    title: "Clinical",
    value: "6",
  },
  {
    title: "Communicator",
    value: "7",
  },
  {
    title: "Documents",
    value: "8",
  },
  {
    title: "Portal Access",
    value: "9",
  },
  {
    title: "Lab Orders",
    value: "10",
  },
];

export const DOCTOR_TOP_TABS = [
  {
    title: "Doctor Profile",
    value: "1",
  },
  {
    title: "Doctors Schedule",
    value: "2",
  },
  {
    title: "Doctors Appointments",
    value: "3",
  },
];

export const WEEK_DAYS: SelectorOption[] = [
  { id: DAYS.Monday, name: DAYS.Monday },
  { id: DAYS.Tuesday, name: DAYS.Tuesday },
  { id: DAYS.Wednesday, name: DAYS.Wednesday },
  { id: DAYS.Thursday, name: DAYS.Thursday },
  { id: DAYS.Friday, name: DAYS.Friday },
  { id: DAYS.Saturday, name: DAYS.Saturday },
  { id: DAYS.Sunday, name: DAYS.Sunday },
];

export const dummyVitalsChartingList = [
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
];

export const dummyAppointmentData = {
  appTime: "16:30 - 17:00",
  timeVariant: "PM",
  patientName: "John Doe",
  patientDOB: "12-01-1990",
  patientTel: "(333)123-4567",
  patientStatus: "Status",
  patientElg: "Eligibility Issue",
};

export const PATIENT_CHARTING_DATA = [
  {
    title: "Allergies",
    description: "Lorem ipsum",
    date: "25-11-22",
  },
  {
    title: "Allergies",
    description: "Lorem ipsum",
    date: "25-11-22",
  },
  {
    title: "Allergies",
    description: "Lorem ipsum",
    date: "25-11-22",
  },
  {
    title: "Allergies",
    description: "Lorem ipsum",
    date: "25-11-22",
  },
  {
    title: "Allergies",
    description: "Lorem ipsum",
    date: "25-11-22",
  },
];

export const DUMMY_APPOINTMENTS = [
  {
    id: 1,
    title: "Website Re-Design Plan",
    startDate: "2022-02-24T04:30:00.000Z",
    endDate: "2022-02-24T06:30:00.000Z",
  },
  {
    id: 2,
    title: "Book Flights to San Fran for Sales Trip",
    startDate: "2022-02-24T07:00:00.000Z",
    endDate: "2022-02-24T08:00:00.000Z",
  },
  {
    id: 3,
    title: "Install New Router in Dev Room",
    startDate: "2022-02-24T09:30:00.000Z",
    endDate: "2022-02-24T10:30:00.000Z",
  },
  {
    id: 4,
    title: "Approve Personal Computer Upgrade Plan",
    startDate: "2018-07-24T05:00:00.000Z",
    endDate: "2018-07-24T06:00:00.000Z",
  },
  {
    id: 5,
    title: "Final Budget Review",
    startDate: "2018-07-24T07:00:00.000Z",
    endDate: "2018-07-24T08:35:00.000Z",
  },
  {
    id: 6,
    title: "New Brochures",
    startDate: "2018-07-24T09:30:00.000Z",
    endDate: "2018-07-24T10:45:00.000Z",
  },
  {
    id: 7,
    title: "Install New Database",
    startDate: "2018-07-25T04:45:00.000Z",
    endDate: "2018-07-25T06:15:00.000Z",
  },
  {
    id: 8,
    title: "Approve New Online Marketing Strategy",
    startDate: "2018-07-25T07:00:00.000Z",
    endDate: "2018-07-25T09:00:00.000Z",
  },
  {
    id: 9,
    title: "Upgrade Personal Computers",
    startDate: "2018-07-25T10:15:00.000Z",
    endDate: "2018-07-25T11:30:00.000Z",
  },
  {
    id: 10,
    title: "Customer Workshop",
    startDate: "2018-07-26T06:00:00.000Z",
    endDate: "2018-07-26T07:00:00.000Z",
  },
  {
    id: 11,
    title: "Prepare 2015 Marketing Plan",
    startDate: "2018-07-26T06:00:00.000Z",
    endDate: "2018-07-26T08:30:00.000Z",
  },
  {
    id: 12,
    title: "Brochure Design Review",
    startDate: "2018-07-26T09:00:00.000Z",
    endDate: "2018-07-26T10:30:00.000Z",
  },
  {
    id: 13,
    title: "Create Icons for Website",
    startDate: "2018-07-27T05:00:00.000Z",
    endDate: "2018-07-27T06:30:00.000Z",
  },
];

export enum ATTACHMENT_TITLES {
  ProfilePicture = "Profile Picture",
  DrivingLicense1 = "Driving License 1",
  DrivingLicense2 = "Driving License 2",
  InsuranceCard1 = "Insurance Card 1",
  InsuranceCard2 = "Insurance Card 2",
  ProviderUploads = "Provider Uploads",
}

export enum MODULE_TYPES {
  User = "User",
  Staff = "Staff",
  Patient = "Patient",
  Service = "Service",
  Services = "Services",
  Practice = "Practice",
  Facility = "Facility",
  Provider = "Provider",
  Schedule = "Schedule",
  Schedules = "Schedules",
  Permission = "Permission",
  Appointment = "Appointment",
  EmergencyAccess = "Emergency Access",
}

export const MODULES = [
  "Emergency Access",
  "User",
  "Staff",
  "Patient",
  "Service",
  "Practice",
  "Facility",
  "Provider",
  "Schedule",
  "Permission",
  "Appointment",
];

export const MAPPED_STATUS = [
  {
    value: "status",
    label: "Status",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "inLobby",
    label: "In Lobby",
  },
  {
    value: "inRoom",
    label: "In Room",
  },
  {
    value: "withDoctor",
    label: "With Doctor",
  },
  {
    value: "noShow",
    label: "No Show",
  },
  {
    value: "cancel",
    label: "Cancel",
  },
  {
    title: "Vacation",
    startDate: "2018-07-27T19:00:00.000Z",
    endDate: "2018-08-06T19:00:00.000Z",
  },
];

export const PROFILE_DETAIL_DATA = [
  {
    title: "Allergies",
    description: LOREM_TEXT_15,
  },
  {
    title: "Past Medical History",
    description: LOREM_TEXT_15,
  },
  {
    title: "Problems",
    description: LOREM_TEXT_15,
  },
  {
    title: "Medications",
    description: LOREM_TEXT_15,
  },
  {
    title: "Family History",
    description: LOREM_TEXT_15,
  },
];

export const PORTAL_DUMMY_DATA = [
  {
    email: "willie.jennings@example.com",
    enabledByName: "Leslie Alexander",
    enabledByDate: "On: March 15, 2022. 2:18AM",
    activatedOn: "March 15, 2022. 2:18AM",
    disabledName: "Dr. Harrold Wixen",
    disabledDate: "On: March 15, 2022. 2:18AM",
  },
  {
    email: "bill.sanders@example.com",
    enabledByName: "Bessie Cooper",
    enabledByDate: "On: March 15, 2022. 2:18AM",
    activatedOn: "March 15, 2022. 2:18AM",
    disabledName: "Dr. A. H. John",
    disabledDate: "On: March 15, 2022. 2:18AM",
  },
  {
    email: "georgia.young@example.com",
    enabledByName: "Floyd Miles",
    enabledByDate: "On: March 15, 2022. 2:18AM",
    activatedOn: "March 15, 2022. 2:18AM",
    disabledName: "Floyd Miles",
    disabledDate: "On: March 15, 2022. 2:18AM",
  },
];

export const LAB_ORDERS_DUMMY_DATA = [
  {
    appointment: "2020-04-18 07:31 AM",
    test: "Blood Sugar Test",
    date: "2020-03-15 09:06 AM",
  },
  {
    appointment: "2020-06-26 12:10 AM",
    test: "Vitamin D Test",
    date: "2020-03-15 09:06 AM",
  },
  {
    appointment: "2020-01-04 02:46 PM",
    test: "Thallium Scan",
    date: "2020-02-08 07:31 AM",
  },
  {
    appointment: "2020-01-04 02:46 PM",
    test: "Vitamin E Test",
    date: "2020-06-27 01:23 PM",
  },
];

export const LAB_ORDERS_LISTING_DATA = [
  {
    doctorName: "Courtney Fox",
    loinsCode: "14444-4",
    description: "Cholesterol [Mass/volume] in Urine",
    appointmentDate: "Appointment: March 29, 2022, 9:45 a.m",
    entered: "Entered: March 28, 2022, 7:09 a.m.",
    performed: "Performed: March 28, 2022, 4:08 p.m.",
    signOff: "Signed Off",
    status: "Result Received",
    result: "33 mg/dL",
    file: "Patient HIPAA Signature",
    comments: "Report is normal",
  },
  {
    doctorName: "Philip Richards",
    loinsCode: "13333-3",
    description: "CD3+CD25+ cells/100 cells in Blood",
    appointmentDate: "Appointment: March 29, 2022, 9:45 a.m",
    entered: "Entered: March 28, 2022, 7:09 a.m.",
    performed: "Performed: March 28, 2022, 4:08 p.m.",
    signOff: "Pending",
    status: "Order Entered",
    result: "34 %",
    file: "--",
    comments: "Report is normal",
  },
  {
    doctorName: "Darrell Fox",
    loinsCode: "12234-5",
    description: "Cholesterol [Mass/volume] in Urine",
    appointmentDate: "Appointment: March 29, 2022, 9:45 a.m",
    entered: "Entered: March 28, 2022, 7:09 a.m.",
    performed: "Performed: March 28, 2022, 4:08 p.m.",
    signOff: "Pending",
    status: "Order Entered",
    result: "42 mg/dL",
    file: "Result",
    comments: "Report is normal",
  },
  {
    doctorName: "Ronald Lane",
    loinsCode: "18577-3",
    description: "CD3+CD25+ cells/100 cells in Blood",
    appointmentDate: "Appointment: March 29, 2022, 9:45 a.m",
    entered: "Entered: March 28, 2022, 7:09 a.m.",
    performed: "Performed: March 28, 2022, 4:08 p.m.",
    signOff: "Pending",
    status: "Order Entered",
    result: "35 %",
    file: "Report",
    comments: "Report is not normal. refer him for another test...",
  },
];

export const PRACTICE_SETTINGS_ITEMS = [
  {
    name: PRACTICE_DETAILS_TEXT,
    link: PRACTICE_DETAILS_ROUTE,
    desc: PRACTICE_DETAILS_DESCRIPTION,
    visible: [SYSTEM_ROLES.SuperAdmin, SYSTEM_ROLES.PracticeAdmin],
  },
  {
    name: FACILITY_MANAGEMENT,
    link: FACILITIES_ROUTE,
    desc: FACILITY_MANAGEMENT_DESCRIPTION,
    visible: [SYSTEM_ROLES.SuperAdmin, SYSTEM_ROLES.PracticeAdmin],
  },
  {
    name: PROVIDER_MANAGEMENT,
    link: DOCTORS_ROUTE,
    desc: PROVIDER_MANAGEMENT_DESCRIPTION,
    visible: ["All"],
  },
  {
    name: STAFF_MANAGEMENT,
    link: STAFF_ROUTE,
    desc: STAFF_MANAGEMENT_DESCRIPTION,
    visible: ["All"],
  },
  {
    name: ROLES_PERMISSIONS,
    link: ROLES_ROUTE,
    desc: ROLES_PERMISSIONS_DESCRIPTION,
    visible: [SYSTEM_ROLES.SuperAdmin, SYSTEM_ROLES.PracticeAdmin],
  },
  {
    name: EMERGENCY_ACCESS,
    link: EMERGENCY_ACCESS_ROUTE,
    desc: EMERGENCY_ACCESS_DESCRIPTION,
  },
];

export const INVENTORY_ITEMS = [
  {
    name: ICT_TEN,
    link: "/",
    desc: ICT_TEN_DESCRIPTION,
  },
  {
    name: ICT_NINE,
    link: "/",
    desc: ICT_NINE_DESCRIPTION,
  },
  {
    name: CPT_CODES,
    link: "/",
    desc: CPT_CODES_DESCRIPTION,
  },
  {
    name: MEDICINES,
    link: "/",
    desc: MEDICINES_DESCRIPTION,
  },
  {
    name: TESTS,
    link: "/",
    desc: TESTS_DESCRIPTION,
  },
  {
    name: VACCINES,
    link: "/",
    desc: VACCINES_DESCRIPTION,
  },
];

export const SERVICES_ITEMS = [
  {
    name: FACILITY_SERVICES_TEXT,
    link: "/",
    desc: FACILITY_SERVICES_DESCRIPTION,
  },
];

export const APPOINTMENT_SETTINGS_ITEMS = [
  {
    name: CANCELLED_APPOINTMENT,
    link: "/",
    desc: CANCELLED_APPOINTMENT_DESCRIPTION,
  },
];

export const CALENDAR_SETTINGS_ITEMS = [
  {
    name: FACILITY_SCHEDULE,
    link: "/",
    desc: FACILITY_SCHEDULE_DESCRIPTION,
  },
];

export const CLINICAL_ITEMS = [
  {
    name: FORM_BUILDER,
    link: FORM_BUILDER_ROUTE,
    desc: FORM_BUILDER_DESCRIPTION,
  },
];

export const MISCELLANEOUS_SETTINGS_ITEMS = [
  {
    name: TIME_ZONE,
    link: "/",
    desc: TIME_ZONE_DESCRIPTION,
  },
];

export const EMERGENCY_ACCESS_DUMMY_DATA = [
  {
    name: "Cody Fisher",
    accessDate: "Sep 3, 2020 6:57 AM",
    drName: "",
    actionDate: "",
  },
  {
    name: "Ronald Richards",
    accessDate: "Aug 12, 2020 9:37 AM",
    drName: "Dr. Harrold Wixen",
    actionDate: "On: March 15, 2022. 2:18AM",
  },
  {
    name: "Bessie Cooper",
    accessDate: "Sep 3, 2020 6:57 AM",
    drName: "Dr. A. H. John",
    actionDate: "On: March 15, 2022. 2:18AM",
  },
  {
    name: "Darlene Robertson",
    accessDate: "Sep 3, 2020 6:57 AM",
    drName: "Floyd Miles",
    actionDate: "On: March 15, 2022. 2:18AM",
  },
];

export const COL_TYPES: ColumnTypes = {
  COL_1: "col-1",
  COL_2: "col-2",
  COL_3: "col-3",
};

export const OPTIONS: FieldOptionsInputType[] = [
  { name: "option 1", value: "option_1" },
  { name: "option 2", value: "option_2" },
];

export const ITEMS: ItemsTypes[] = [
  {
    icon: TextIcon,
    fieldId: uuid(),
    label: "Text Input",
    type: ElementType.Text,
    name: uuid(),
    css: "",
    column: 12,
    placeholder: "",
    required: false,
    errorMsg: "",
    defaultValue: "",
    options: [],
    textArea: false,
    isMultiSelect: false,
  },
  {
    icon: RadioGroupIcon,
    fieldId: uuid(),
    label: "Radio Group",
    type: ElementType.Radio,
    name: uuid(),
    css: "",
    column: 12,
    placeholder: "",
    required: false,
    errorMsg: "",
    defaultValue: "",
    options: OPTIONS,
    textArea: false,
    isMultiSelect: false,
  },
  {
    icon: CheckboxIcon,
    fieldId: uuid(),
    label: "Checkbox",
    type: ElementType.Checkbox,
    name: uuid(),
    css: "",
    column: 12,
    placeholder: "",
    required: false,
    errorMsg: "",
    defaultValue: "",
    options: OPTIONS,
    textArea: false,
    isMultiSelect: false,
  },
  {
    icon: DateIcon,
    fieldId: uuid(),
    label: "Date",
    type: ElementType.Date,
    name: uuid(),
    css: "",
    column: 12,
    placeholder: "",
    required: false,
    errorMsg: "",
    defaultValue: "",
    textArea: false,
    options: [],
    isMultiSelect: false,
  },
  {
    icon: NumberIcon,
    fieldId: uuid(),
    label: "Number",
    type: ElementType.Number,
    name: uuid(),
    css: "",
    column: 12,
    placeholder: "",
    required: false,
    errorMsg: "",
    defaultValue: "",
    textArea: false,
    options: [],
    isMultiSelect: false,
  },
  {
    icon: EmailIcon,
    fieldId: uuid(),
    label: "Email",
    type: ElementType.Email,
    name: uuid(),
    css: "",
    column: 12,
    placeholder: "",
    required: false,
    defaultValue: "",
    errorMsg: "",
    textArea: false,
    options: [],
    isMultiSelect: false,
  },
  {
    icon: FileInputIcon,
    fieldId: uuid(),
    label: 'File Upload',
    type: ElementType.File,
    name: uuid(),
    css: "",
    column: 12,
    placeholder: "",
    required: false,
    defaultValue: "",
    errorMsg: "",
    textArea: false,
    options: [],
    isMultiSelect: false,
  },
  {
    icon: SelectIcon,
    fieldId: uuid(),
    label: "Select",
    type: ElementType.Select,
    name: uuid(),
    css: "",
    column: 12,
    placeholder: "",
    required: false,
    defaultValue: "",
    errorMsg: "",
    textArea: false,
    options: OPTIONS,
  },
  {
    icon: SelectIcon,
    fieldId: uuid(),
    label: 'Multi Select',
    type: ElementType.Select,
    name: uuid(),
    css: '',
    column: 12,
    placeholder: '',
    required: false,
    defaultValue: '',
    errorMsg: '',
    textArea: false,
    options: OPTIONS,
    isMultiSelect: true,
  },

  {
    icon: TextAreaIcon,
    fieldId: uuid(),
    label: "Text Area",
    type: ElementType.Text,
    name: uuid(),
    css: "",
    column: 12,
    placeholder: "",
    required: false,
    defaultValue: "",
    errorMsg: "",
    textArea: true,
    options: [],
    isMultiSelect: false,
  },
];

export const COLUMN_LENGTH: SelectOptions[] = [
  { id: 12, name: 12 },
  { id: 11, name: 11 },
  { id: 10, name: 10 },
  { id: 9, name: 9 },
  { id: 8, name: 8 },
  { id: 7, name: 7 },
  { id: 6, name: 6 },
  { id: 5, name: 5 },
  { id: 4, name: 4 },
  { id: 3, name: 3 },
  { id: 2, name: 2 },
  { id: 1, name: 1 },
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MENU_PROPS = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const COL_TYPES_ARRAY = [
  { text: "1 Column", value: COL_TYPES.COL_1 },
  { text: "2 Columns", value: COL_TYPES.COL_2 },
  { text: "3 Columns", value: COL_TYPES.COL_3 },
];

export const MAPPED_FORM_TYPES: SelectorOption[] = [
  { id: FormType.Appointment, name: formatValue(FormType.Appointment) },
  { id: FormType.Doctor, name: formatValue(FormType.Doctor) },
  { id: FormType.Patient, name: formatValue(FormType.Patient) },
  { id: FormType.Staff, name: formatValue(FormType.Staff) },
];

export const FORM_BUILDER_INITIAL_VALUES: FormBuilderFormInitial = {
  name: "",
  type: {
    name: "",
    id: "",
  },
  facilityId: {
    name: "",
    id: "",
  },
};

export const getFormInitialValues = () => [
  {
    id: uuid(),
    col: 12,
    name: "Section",
    fields: [],
  },
];

export const FIELD_EDIT_INITIAL_VALUES: FormInitialType = {
  fieldId: "",
  label: "",
  type: ElementType.Text,
  name: "",
  css: "",
  column: 12,
  placeholder: "",
  required: false,
  list: "",
  errorMsg: "",
  defaultValue: "",
  textArea: false,
  options: [],
};

export const CHECK_IN_STEPS = [
  CHECK_IN,
  PATIENT_INFO,
  INSURANCE,
  VITALS_TEXT,
  CHART_TEXT,
  BILLING_TEXT,
];

export const LAB_ORDER_STEPS = [
  LAB_ORDER, PAYMENT
];

export const FacilityMenuNav = [
  {
    title: FACILITY_INFO,
    linkTo: FACILITY_INFO_ROUTE,
  },
  {
    title: FACILITY_LOCATION,
    linkTo: FACILITY_LOCATION_ROUTE,
  },
  {
    title: BILLING_PROFILE,
    linkTo: BILLING_PROFILE_ROUTE,
  },
  {
    title: BUSINESS_HOURS,
    linkTo: FACILITY_SCHEDULE_ROUTE,
  },
];

export const MAPPED_WEEK_DAYS = [
  {
    id: "Monday",
    name: "Monday",
  },
  {
    id: "Tuesday",
    name: "Tuesday",
  },
  {
    id: "Wednesday",
    name: "Wednesday",
  },
  {
    id: "Thursday",
    name: "Thursday",
  },
  {
    id: "Friday",
    name: "Friday",
  },
  {
    id: "Saturday",
    name: "Saturday",
  },
  {
    id: "Sunday",
    name: "Sunday",
  },
];

export const APPOINTMENT_INFO_DATA = [
  {
    name: APPOINTMENT_TYPE,
    description: GENERAL,
  },
  {
    name: FACILITY_LOCATION,
    description: "Clay County Hospital",
  },
  {
    name: PROVIDER_NAME,
    description: "Dr. Michael Hall, MD",
  },
  {
    name: REASON,
    description: "High temperature",
  },
  {
    name: "Checked in at",
    description: "3:44 PM",
  },
  {
    name: "Self Check in",
    description: "No",
  },
  {
    name: "Primary Insurance",
    description: "United Health Ins.",
  },
];

export const ICD_TEN_CODES_DATA = [
  {
    code: "S00.00XA ",
    description: "Unspecified superficial injury of scalp, initial encounter",
  },
  {
    code: "M00.09 ",
    description: "Staphylococcal poly arthritis",
  },
];

export enum USER_PERMISSIONS {
  fetchAllUsers = "fetchAllUsers",
  fetchUser = "fetchUser",
  getUser = "getUser",
  searchUser = "searchUser",
  forgotPassword = "forgotPassword",
  deactivateUser = "deactivateUser",
  removeUser = "removeUser",
  updateUser = "updateUser",
  updateUserRole = "updateUserRole",
  createRole = "createRole",
  updateRole = "updateRole",
  getAllRoles = "getAllRoles",
  getRole = "getRole",
  removeRole = "removeRole",
  createAppointment = "createAppointment",
  createExternalAppointment = "createExternalAppointment",
  updateAppointment = "updateAppointment",
  updateAppointmentBillingStatus = "updateAppointmentBillingStatus",
  findAllAppointments = "findAllAppointments",
  getAppointment = "getAppointment",
  getDoctorAppointment = "getDoctorAppointment",
  removeAppointment = "removeAppointment",
  cancelAppointment = "cancelAppointment",
  getPatientAppointment = "getPatientAppointment",
  createFacility = "createFacility",
  updateFacility = "updateFacility",
  updateFacilityTimeZone = "updateFacilityTimeZone",
  findAllFacility = "findAllFacility",
  getFacility = "getFacility",
  removeFacility = "removeFacility",
  createService = "createService",
  updateService = "updateService",
  findAllServices = "findAllServices",
  getService = "getService",
  removeService = "removeService",
  createPatient = "createPatient",
  updatePatient = "updatePatient",
  patientInfo = "patientInfo",
  updatePatientProfile = "updatePatientProfile",
  sendInviteToPatient = "sendInviteToPatient",
  updatePatientProvider = "updatePatientProvider",
  findAllPatient = "findAllPatient",
  getPatient = "getPatient",
  removePatient = "removePatient",
  createPractice = "createPractice",
  updatePractice = "updatePractice",
  findAllPractices = "findAllPractices",
  getPractice = "getPractice",
  removePractice = "removePractice",
  createDoctor = "createDoctor",
  updateDoctor = "updateDoctor",
  findAllDoctor = "findAllDoctor",
  getDoctor = "getDoctor",
  removeDoctor = "removeDoctor",
  disableDoctor = "disableDoctor",
  createStaff = "createStaff",
  updateStaff = "updateStaff",
  findAllStaff = "findAllStaff",
  getStaff = "getStaff",
  removeStaff = "removeStaff",
  disableStaff = "disableStaff",
  createSchedule = "createSchedule",
  getDoctorSchedule = "getDoctorSchedule",
  getFacilitySchedule = "getFacilitySchedule",
  updateSchedule = "updateSchedule",
  findAllSchedules = "findAllSchedules",
  getSchedule = "getSchedule",
  getSlots = "getSlots",
  removeSchedule = "removeSchedule",
  addPatientProblem = "addPatientProblem",
  updatePatientProblem = "updatePatientProblem",
  findAllPatientProblem = "findAllPatientProblem",
  searchIcdCodes = "searchIcdCodes",
  searchSnoMedCodeByIcdCodes = "searchSnoMedCodeByIcdCodes",
  getPatientProblem = "getPatientProblem",
  removePatientProblem = "removePatientProblem",
}

//Form Builder API urls
export const USER_FORM_IMAGE_UPLOAD_URL = `/user-form/upload`

export const FORM_BUILDER_FIELDS_TABS = [
  {
    title: "Custom Forms",
    value: "1",
  },
  {
    title: "Templates",
    value: "2",
  },
]

export const PatientSearchingTooltipData = [
  {
    name: `${NAME}:`,
    format: NAME_FORMAT,
  },
  {
    name: `${EMAIL}:`,
    format: EMAIL_FORMAT,
  },
  {
    name: `${PRN}:`,
    format: PRN_FORMAT,
  },
  {
    name: `${DOB}:`,
    format: DOB_FORMAT,
  },
  {
    name: `${SSN}:`,
    format: SSN_FORMAT,
  }
];

export const AppointmentSearchingTooltipData = [
  {
    name: `${NAME}:`,
    format: APP_NAME_FORMAT,
  },
  {
    name: `${EMAIL}:`,
    format: EMAIL_FORMAT,
  },
  {
    name: `${DOB}:`,
    format: DOB_FORMAT,
  },
  {
    name: `${SSN}:`,
    format: SSN_FORMAT,
  }
];
