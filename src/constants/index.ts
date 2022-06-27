//packages block
import { Phone as PhoneIcon } from '@material-ui/icons';
import moment from "moment-timezone";
import states from "states-us";
import { v4 as uuid } from "uuid";
//assets
import EMERGENCY_LOG_OBD from '../../src/assets/images/obaid.png';
import EMERGENCY_LOG_PHLEPS from '../../src/assets/images/phleps.png';
import EMERGENCY_LOG_WILLIAMS from '../../src/assets/images/wiilaims.png';
import {
  UsersIcon, AppointmentsIcon, FacilitiesIcon, ReportsIcon, BillingIcon, CheckboxIcon, DateIcon,
  EmailIcon, FileInputIcon, NumberIcon, RadioGroupIcon, SelectIcon, TextAreaIcon, TextIcon,
  VitalsIcon, ProblemsIcon, AllergiesIcon
} from "../assets/svgs";
import {
  AbnormalFlag, AllergySeverity, AppointmentStatus, Communicationtype, CopayType, DoctorPatientRelationType, ElementType,
  Ethnicity, FieldOptionsInputType, FormType, Gender, Genderidentity, HeadCircumferenceType, Homebound, LabTestStatus,
  Maritialstatus, OnsetDateType, OrderOfBenefitType, OtherDateType, PatientBillingStatus, PatientPaymentType, PaymentType,
  PolicyHolderRelationshipType, Policy_Holder_Gender_Identity, PracticeType, PricingProductType, Pronouns, Race,
  RelationshipType, ServiceCode, Sexualorientation, SmokingStatus, Speciality, TempUnitType, UnitType, WeightType
} from "../generated/graphql";
import {
  ColumnTypes, FormBuilderFormInitial,
  FormInitialType, ItemsTypes, LabOrdersResultOption1, LabOrdersResultOption2, SelectOptions, SelectorOption,
  SpecimenTypeOption, StepLabelType, TestOption
} from "../interfacesTypes";
// graphql and interfaces block
import {
  formatServiceCode, formatValue, getFormattedDate, getStandardTime, mapEnum, setRecord
} from "../utils";

// regex
export const NPI_REGEX = /^\d{10}$/;
export const TID_REGEX = /^9\d{8}$/;
export const NUMBER_REGEX = /^[0-9]+$/;
export const EIN_REGEX = /^\d{2}-?\d{7}$/;
export const ZIP_REGEX = /^\d*[1-9\d,-]+$/;
export const STRING_REGEX = /^[A-Za-z\s]+$/;
export const REVENUE_CODE_REGEX = /^\d{4}$/;
export const UPIN_REGEX = /^[A-Za-z0-9]{6}$/;
export const CLIA_REGEX = /^[A-Za-z0-9]{10}$/;
export const SSN_REGEX = /^\d{3}-\d{2}-\d{4}$/;
export const FACILITY_CODE_REGEX = /^[A-Z]{2,5}$/;
export const ADDRESS_REGEX = /^[#.0-9a-zA-Z\s,-]+$/;
export const TAXONOMY_CODE_REGEX = /^[A-Z0-9]{9}X$/;
export const US_ROUTING_NUMBER_REGEX = /^[0-9]{9}$/g
export const US_BANK_ACCOUNT_REGEX = /^[0-9]{7,14}$/g
export const NO_WHITE_SPACE_REGEX = /^(?!\s)[a-zA-Z0-9_\s-]*$/;
export const ALPHABETS_REGEX = /^[^\s].([A-Za-z]+\s)*[A-Za-z]+$/;
export const MAMMOGRAPHY_CERT_NUMBER_REGEX = /^[A-Z]{3}-[A-Z]{2}-\d{6}$/;
export const BANK_ACCOUNT_REGEX = /^([0-9]{11})|([0-9]{2}-[0-9]{3}-[0-9]{6})$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

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

// Blood Pressure Ranges
export enum BLOOD_PRESSURE_RANGES {
  Normal = "Normal",
  Low = "Low",
  High = "Hight",
}

// Heart Rate Ranges
export enum Heart_RATE_RANGES {
  Abnormal = "Abnormal",
  Normal = "Normal",
  Low = "Low",
  High = "Hight",
}

// constants
export const GRANTED_TEXT = 'Granted';
export const CONTRACT_NO = 'Contract No';
export const ORGANIZATION_NAME = 'Organization Name';
export const FACILITY_FORM = 'Facility Form';
export const PRACTICE_FORM = 'Practice Form';
export const PRE_DEFINED_COMPONENT_PAGE_LIMIT = 25;
export const ACH_PAYMENT_AUTHORITY = 'I authorize Braintree to debit my bank account on my behalf.'
export const LOCALITY = 'Locality'
export const AUTHORITY = 'Authority'
export const COMPANY_NAME = 'Company Name'
export const ROUTING_NUMBER = 'Routing Number'
export const ACCOUNT_TYPE = 'Account Type'
export const PAY_VIA_ACH = 'Pay via ACH';
export const PATIENT_NOTE_SUCCESS_MESSAGE = 'Patient Notes is updated successfully'
export const PATIENT_NOTE_ERROR_MESSAGE = 'Patient Notes is not updated'
export const PINNED_NOTES = "Pinned Notes";
export const AUTO_OPEN_NOTES = "Auto Open Notes";
export const SUPER_ADMIN = "super-admin";
export const SUPER_ADMIN_TEXT = "Super Admin";
export const AUTO_LOGOUT_ERROR = "Auto logout time is not updated";
export const ITEMS_ID = 'ITEMS'
export const PRE_DEFINED = 'PRE-DEFINED'
export const DASHES = '--'
export const CURRENT_DATE = new Date();
export const LATEST_RECORDED_DATE = "Recorded Date"
export const NOTE = "Note";
export const MY_CARE_TEAM = "My Care Team";
export const PRACTICE_DETAILS = "Practice Details";
export const Ok_TEXT = "OK";
export const NOTES = "Notes";
export const ACUTE = "Acute";
export const CHRONIC = "Chronic";
export const LOCK_TIME_OUT = 604800000;
export const BASIC_DETAILS = "Basic Details";
export const DEMOGRAPHIC = "Demographic";
export const BILLING_DETAILS = "Billing Details";
export const EMERGENCY_CONTACTS = "Emergency Contacts";
export const ZIP_CODE_AND_CITY = "Please enter zip code & city";
export const ZIP_CODE_ENTER = "Please enter zip code";
export const POSSIBLE_MATCH = "possible address match";
export const CHECK_ADDRESS = "Check Address";
export const SMARTY_0_MATCH = "There are 0 matches for that address. Please edit and re-check.";
export const YOU_ENTER = "You have entered:";
export const SELECT_ADDRESS = "Please select a address";
export const NO_WHITE_SPACE_ALLOWED = "No white space allowed at beginning of file";
export const NO_WHITE_SPACE_ALLOWED_FOR_INPUT = "No white space allowed at beginning of input";
export const VERIFY_ADDRESS = "Verify address";
export const DISMISS = "Dismiss";
export const UPDATE_MEDIA = "Update media";
export const EDIT_MEDIA = "Edit Media";
export const ADVANCED_SEARCH = "Advanced Search";
export const LABEL = "Label";
export const FORMS = "Forms";
export const ADD_FORM = "Add Form";
export const EDIT_FORM = "Edit Form";
export const FORM_RESPONSES = "Form Responses";
export const TIME = "Time";
export const OPTION_TEXT = "Option";
export const FORM_TEXT = "Form";
export const FORM_COPY = "Copy form";
export const ENCOUNTERS = "Encounters";
export const CARE_TEAM = "Care Team";
export const FORM_NAME = "Form name";
export const THANK_YOU_TEXT = "Thank you!";
export const FORM_SUBMIT_TEXT = "Form Submit";
export const FORM_TYPE = "Form type";
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
export const DELETE_FORM_DESCRIPTION = "Confirm to delete form";
export const DELETE_AGREEMENT_DESCRIPTION = "Confirm to delete agreement";
export const CANT_DELETE_FORM = "Form can't be deleted.";
export const FORM_NOT_FOUND = "Form not found!";
export const FORM_UPDATED = "Form updated successfully!";
export const PUBLIC_FORM_LINK = "Public form preview Link";
export const FORM_FAIL_DESCRIPTION = "Public form preview Link";
export const EMPTY_OPTION = { id: "", name: "--" };
export const EMPTY_MULTISELECT_OPTION = { value: "", label: "" };
export const NO_RECORDS_OPTION = { id: "", name: "No Record Found" };
export const OTHER_OPTION = { id: "Other", name: "Other" };
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
export const ADD_TAB = 'add_tab'
export const EDIT_TAB = 'edit_tab'
export const BPM_TEXT = 'bpm'
export const PATIENT_VITAL_TEXT = 'Patient Vitals'
export const RPM_TEXT = 'rpm'
export const MMHG_TEXT = 'mmHg'
export const KG_PER_METER_SQUARE_TEXT = 'kg/m2'
export const ONE_TO_TEN_TEXT = '1-10'
export const PERCENTAGE = '%'
export const KG_TEXT = "KG"
export const LBS_TEXT = "LBS"
export const LB_TEXT = "LB"
export const OZ_TEXT = "OZ"
export const CM_TEXT = "CM"
export const IN_TEXT = "IN"
export const PULSE_TEXT = "Pulse"
export const PULSE_TEXT_AND_UNIT = "Pulse (bpm)";
export const BLOOD_PRESSURE_TEXT_AND_UNIT = "Blood Pressure (mmHg)";
export const OXYGEN_SATURATION_TEXT_AND_UNIT = "Oxygen Saturation (%)";
export const RESPIRATORY_TEXT_AND_UNIT = "Respiratory Rate (rpm)";
export const TEMPERATURE_TEXT_AND_UNIT = "Fever (°C)";
export const PAIN_TEXT_AND_UNIT = "Pain (1-10)";
export const HEIGHT_TEXT_AND_UNIT = "Height (in)";
export const WEIGHT_TEXT_AND_UNIT = "Weight (lbs)";
export const BMI_TEXT_AND_UNIT = "BMI (kg/m2)";
export const HEAD_TEXT_AND_UNIT = "Head Circumference (in)";
export const VITAL_ERROR_MSG = "Patient Vital is not added."
export const RESPIRATORY_RATE_TEXT = "Respiratory Rate"
export const LAST_READING_TEXT = "Last Reading"
export const BLOOD_PRESSURE_TEXT = "Blood Pressure"
export const BLOOD_PRESSURE_VALUE = "102 / 72"
export const BLOOD_PRESSURE_LAST_READ = "May 2, 2022"
export const BLOOD_PRESSURE_UNIT = "mmhg"
export const HEART_RATE_TEXT = "Heart Rate"
export const HEART_RATE_VALUE = "100"
export const HEART_RATE_UNIT = "bpm"
export const HEART_RATE_LAST_READ = "May 2, 2022"
export const OXYGEN_SATURATION_TEXT = "Oxygen Saturation"
export const HEIGHT_TEXT = "Height"
export const WEIGHT_TEXT = "Weight"
export const BMI_TEXT = "BMI"
export const PAIN_TEXT = "Pain"
export const SMOKING_STATUS_TEXT = "Smoking Status"
export const HEAD_CIRCUMFERENCE = "Head Circumference"
export const TEMPERATURE_TEXT = "Temperature"
export const FEVER = "Fever"
export const CREATED_ON = "Created On";
export const CDC = "CDC";
export const ADD = "Add";
export const CLOSE = "Close";
export const UPDATE = "Update";
export const DATE_ADDED = "Date Added";
export const BMI_FOR_AGE = "BMI for Age";
export const SYSTEM_PASSWORD = "admin@123";
export const NEXT = "Next";
export const VIEW = "View";
export const YES = "Yes";
export const NO = "No";
export const ASC = "ASC";
export const DESC = "DESC";
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
export const RE_SCHEDULE = "Re-Schedule";
export const CHECK_IN = "Check In";
export const START_TELEHEALTH = "Start Telehealth";
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
export const DONT_WANT_TO_SHARE_EMAIL = "Don't want to share email";
export const APPOINTMENT_NOT_EXIST = "Appointment doesn't exist";
export const DROP_YOUR_IMAGE_TEXT = "Drop your image here, or browse";
export const SUPPORT_DOC_TEXT = "Supports: JPG, PNG, PDF & DOC";
export const CALENDAR = "Calendar";
export const PRINT = "Print";
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
export const TERTIARY_INSURANCE = "Tertiary Insurance";
export const FAILED_TO_CREATE_DOCTOR = "Failed to create doctor!";
export const FAILED_TO_UPDATED_DOCTOR = "Failed to update doctor!";
export const ADD_STAFF = "Add Staff";
export const FRONT_SIDE = "Front Side";
export const BACK_SIDE = "Back Side";
export const BACK_TEXT = "Back";
export const DRIVING_LICENSE = "Driving License";
export const INSURANCE_CARD = "Insurance Card";
export const DOCUMENT_VERIFICATION = "Document Verification";
export const APARTMENT_SUITE_OTHER = "Apartment/Suite/Other";
export const PAYMENT_DETAILS = "Payment Details";
export const RECURRING_DATE = "Recurring Date";
export const END_DATE = "End Date";
export const WANT_RECURRING = "Recurring?";
export const CONTACT_METHOD = "How we can contact you?";
export const HCFA_DESC = "HCFA Box 10 - Is patient's condition related to:";
// export const SMS_PERMISSIONS = "Is it okay for us to leave a SMS/Txt messages";
export const CONSENT_TO_MESSAGES = "Consent To messages";
export const CONSENT_TO_MESSAGES_DESCRIPTION = "Disable all SMS/Txt messages for this user";
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
export const ADD_ANOTHER_TEST = "Add Another Test";
export const REMOVE_TEST = "Remove Test";
export const ADD_ANOTHER_RESULT = "Add Another Result";
export const REMOVE_RESULT = "Remove Result";
export const ADD_RESULT_FILE = "Add Result File";
export const ADD_ANOTHER_SPECIMEN = "Add Another Specimen";
export const ADD_SPECIMEN = "Add a Specimen";
export const REMOVE_SPECIMEN = "Remove Specimen";
export const RELEASE_BILLING_INFO_PERMISSIONS =
  "Can we release medical and billing information to this contact?";
export const APPOINTMENT_CONFIRMATION_PERMISSIONS =
  "May we phone, or send a email to you to confirm appointments?";
export const ADD_DOCTOR = "Add Doctor";
export const ADD_RESULT = "Add Result";
export const VIEW_STAFF = "View Staff";
export const EDIT_DOCTOR = "Edit Doctor";
export const ADD_PATIENT = "Add Patient";
export const ADD_COPAY = "Add Copay";
export const ADD_PRACTICE = "Add practice";
export const EDIT_PRACTICE = "Edit practice";
export const ADD_PATIENT_MODAL = "Add New Patient";
export const TIME_ZONE_TEXT = "Time Zone";
export const EDIT_PATIENT = "Edit Patient";
export const UPDATE_STAFF = "Update Staff";
export const SET_TIME_ZONE = "Set Time Zone";
export const UPDATE_DOCTOR = "Update Doctor";
export const UPDATE_PATIENT = "Update Patient";
export const CREATE_PATIENT = "Create Patient";
export const CREATE_COPAY = "Create Copay";
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
export const DRAFT_TEXT = "Draft";
export const TO_BILLING = "To Billing";
export const TO_LAB_ORDERS = "To Lab Orders";
export const UPLOAD_LOGO = "Upload Logo";
export const SAVE_DRAFT = "Save as Draft";
export const UPLOAD_PICTURE = "Upload Picture";
export const ALLOW_CANCELLATION = "Allow Cancellations";
export const VACCINE_TEXT = "Vaccine";
export const PROBLEMS_TEXT = "Problems";
export const PROBLEM_TEXT = "Problem";
export const ALLERGIES_TEXT = "Allergies";
export const ALLERGY_TEXT = "Allergy";
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
export const ACCEPTABLE_ONLY_IMAGES_FILES = [".jpg", ".jpeg", ".png", ".svg"];
export const ACCEPTABLE_PDF_AND_IMAGES_FILES = [".jpg", ".jpeg", ".png", ".pdf", ".docx", ".doc", ".svg"];
export const ACCEPTABLE_PDF_FILES = [".pdf", ".docx", ".doc"];
export const ACCEPTABLE_FILES = [".jpg", ".jpeg", ".png", ".docx", ".doc", ".pdf", ".mp3", ".svg"];
export const SCHEDULE = "Schedule";
export const FACILITY_MANAGEMENT = "Facility Management";
export const PROVIDER_MANAGEMENT = "Provider Management";
export const PROVIDER_DETAILS = "Provider Details";
export const STAFF_MANAGEMENT = "Staff Management";
export const ADD_PROVIDER_TEXT = "Add Provider";
export const ADD_PROVIDER_INFORMATION = "Click here to add Provider information";
export const SEARCH_PATIENT_NAME_ID = "Patient Name, Patient ID or Insurance Number etc...";
export const EMERGENCY_ACCESS = "Emergency Access";
export const EMERGENCY_ACCESS_REVOKE_ROLES = [SUPER_ADMIN, "facility-admin", "practice-admin"]
export const EMERGENCY_ACCESS_VALUE = "emergency-access";
export const ACCESS_ACTIVATED = "Access Activated";
export const EMERGENCY_ACCESS_DENIED = "Emergency Access Denied";
export const EMERGENCY_ACCESS_ENABLED = "Emergency Access Enabled";
export const ROLES_PERMISSIONS = "Roles & Permissions";
export const NOTICE_REQUIRED_TEXT = "Minimum Notice Required (In Hours)";
export const PRACTICE_DETAILS_DESCRIPTION =
  "Edit your practice information and settings";
export const PRACTICE_MANAGEMENT_DESCRIPTION =
  "Add and edit your practice information and settings";
export const PROVIDER_DETAILS_DESCRIPTION =
  "Edit your provider information and settings";
export const FACILITY_DETAILS_DESCRIPTION =
  "Edit your facility information and settings";
export const PROVIDER_PROFILE_DESCRIPTION =
  "Edit your provider profile";
export const FACILITY_MANAGEMENT_DESCRIPTION =
  "Add and edit your facility information and settings";
export const PROVIDER_MANAGEMENT_DESCRIPTION =
  "Add providers and update their profiles for the AIMED";
export const STAFF_MANAGEMENT_DESCRIPTION =
  "Add staff and update their profiles for the AIMED";
export const SCHEDULE_DESCRIPTION = "Add or update provider’s schedule";
export const ROLES_PERMISSIONS_DESCRIPTION =
  "Add or update staff roles and their permissions";
export const EMERGENCY_ACCESS_DESCRIPTION =
  "View and manage the users with emergency access";
export const TEMPORARY_EMERGENCY_ACCESS =
  "Temporary Emergency Administrator Access";
export const ACTIVATE_EMERGENCY_ACCESS_MODE = "Activate Emergency Access Mode";
export const REVOKE_EMERGENCY_ACCESS_MODE = "Revoke Emergency Access";
export const DEACTIVATE_EMERGENCY_ACCESS_MODE =
  "Deactivate Emergency Access Mode";
export const TEMPORARY_EMERGENCY_ACCESS_DESCRIPTION =
  "Emergency access mode gives practice members temporary administrator permissions in the event of an emergency or crisis. Access is secure and only available to pre-selected practice members designated by a practice administrator.";
export const ICT_TEN = "ICT-10 Codes";
export const ICD_TEN_CODES = "ICD-10 Codes";
export const ICD_TEN_CODE = "ICD-10 Code:";
export const ICD_CODE = "ICD Code";
export const SNOMED_CODE = "SnoMED Code:";
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
export const DOB = "Date of Birth";
export const DOB_TIME = "Date/Time";
export const SPECIALTY = "Specialty";
export const DOCTOR_ID = "doctor id";
export const PATIENT_ID = "patient id";
export const DEA_NUMBER = "DEA Number";
export const TAXONOMY_CODE = "Taxonomy Code";
export const DECEASED_DATE = "Deceased Date";
export const DEA_TERM_DATE = "DEA Term Date";
export const DATE_OF_SERVICE = "Date of Service";
export const DEA_ACTIVE_DATE = "DEA Active Date";
export const LANGUAGE_SPOKEN = "Language Spoken";
export const DEGREE_CREDENTIALS = "Degree/ Credentials";
export const SOCIAL_SECURITY_TYPE = "Social Security Type";
export const SOCIAL_SECURITY_NUMBER = "Social Security Number";
export const PRIMARY_SERVICE_LOCATION = "Primary Service Location";
export const FAX = "Fax";
export const SUPER = "Super";
export const ADMIN = "Admin";
export const SLOTS_TEXT = "Slots";
export const CITY = "City";
export const EMAIL = "Email";
export const PHONE = "Phone";
export const STATE = "State";
export const PDF_TEXT = "PDF";
export const SELECT = "Select";
export const GENDER = "Gender";
export const ENABLED = "Enabled";
export const ADDRESS = "Address";
export const COUNTRY = "Country";
export const RELATION = "Relation";
export const ZIP_CODE = "Zip code";
export const DISABLED = "Disabled";
export const ADDRESS_2 = "Address 2";
export const ENABLED_BY = "Enabled by";
export const PICK_DAY_TEXT = "Pick Day";
export const PICK_TIME_TEXT = "Pick Time";
export const ACTIVATED_ON = "Activated On";
export const GROWTH_CHART = "Growth Chart";
export const ADDRESS_CTD = "Address (CTD)";
export const PRACTICE_TYPE = "Practice Type";
export const FEDERAL_TAX_ID = "Federal Tax ID";
export const FACILITY_HOURS_END = "Facility hours end";
export const PRACTICE_IDENTIFIER = "Practice Identifier";
export const FACILITY_HOURS_START = "Facility hours start";
export const RELATIONSHIP_WITH_PATIENT = "Relationship With Patient";
export const UPDATE_PRIMARY_PROVIDER = "Update primary provider";
export const PRIMARY_PROVIDER_DESCRIPTION = "Are you sure to change your primary provider ";
export const NPI = "NPI";
export const HASH = "#";
export const N_A = "N/A";
export const DAY = "Day";
export const PRN = "PRN";
export const UPIN = "UPIN";
export const PAGER = "Pager";
export const TO_TEXT = "To:";
export const TAX_ID = "Tax ID";
export const GO_BACK = "Go Back";
export const CHAMPUS = "Champus";
export const FROM_TEXT = "From:";
export const MEDICARE = "Medicare";
export const MEDICAID = "Medicaid";
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
export const REGISTER_NEW_FACILITY = "Register New Facility";
export const TAX_ID_STUFF = "Tax ID Stuff / Provider Site ID";
export const MAMMOGRAPHY_CERT_NUMBER = "Mammography Cert Number";
export const PRESCRIPTIVE_AUTH_NUMBER = "Prescriptive Auth number";
export const CVV = "CVV";
export const PAY = "Pay";
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
export const PAGE_LIMIT = 13;
export const TEN_PAGE_LIMIT = 10;
export const VALUE = "Value";
export const VISIT = "Visit";
export const ROLES = "Roles";
export const ERROR = "error";
export const UNITS = "Units";
export const RESET = "Reset";
export const SSN_INPUT = "ssn";
export const REASON = "Reason";
export const MOBILE = "Mobile";
export const SERIAL_NO = "S.No";
export const DRAWER_WIDTH = 300;
export const REPORTS = "Reports";
export const GENERAL = "General";
export const UNKNOWN = "Unknown";
export const TIME_TO = "TIME:TO";
export const SET = "Set Password";
export const SECURITY = "Security";
export const ORDER_NUM = "Order #";
export const USERNAME = "Username";
export const SIGN_OFF = "Sign Off";
export const ADD_BILL = "Add Bill";
export const LOGOUT_TEXT = "Logout";
export const INITIAL_PAGE_LIMIT = 5;
export const TIME_FROM = "TIME:FROM";
export const INSURANCE = "Insurance";
export const ROLE_NAME = "Role name";
export const CHILDHOOD = "Childhood";
export const ADULTHOOD = "Adulthood";
export const REACTION_PAGE_LIMIT = 50;
export const DROPDOWN_PAGE_LIMIT = 10;
export const HISTORICAL = "Historical";
export const TEST_TAKEN = "Test Taken";
export const ENVIRONMENT = "Environment";
export const ENDING_TIME = "Ending time";
export const APPOINTMENT = "Appointment";
export const BILLING_TYPE = "Billing Type";
export const PRESCRIBED_BY = "Prescribed By";
export const STARTING_TIME = "Starting time";
export const RECEIVED_DATE = "Received Date";
export const COLLECTED_DATE = "Collected Date";
export const DRUG = "Drug";
export const FILE = "File";
export const EDIT = "Edit";
export const FOOD = "Food";
export const STAGE = "Stage";
export const CANCEL = "Cancel";
export const DOCTOR = "Doctor";
export const BILLED = "Billed";
export const RESULT = "Result";
export const ACTIVE = "Active";
export const STATUS = "Status";
export const TAGS_TEXT = "Tags";
export const ACTION = "Actions";
export const USER_ID = "User ID";
export const PATIENT = "Patient";
export const SUCCESS = "success";
export const CLAIMED = "Claimed";
export const SERVICE = "Service";
export const COMMENT = "Comment";
export const SIGN_IN = "Sign In";
export const TOKEN = "emr_token";
export const RESULTS = "Results";
export const BACK_TO = "Back to";
export const FOUR_O_FOUR = "404";
export const ROLE_EVENT = "role";
export const LIST_PAGE_LIMIT = 25;
export const USERS_TEXT = "Users";
export const STAFF_TEXT = "Staff";
export const DOCUMENT = "Document";
export const PRACTICE = "Practice";
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
export const LAB_RESULTS_LIMIT = 10;
export const REMOVE_TEXT = "Remove";
export const FA_TOKEN = "2fa_token";
export const USER_NAME = "Username";
export const PRACTICES = "Practices";
export const CANCELLED = "Cancelled";
export const NO_RECORDS = "No Records";
export const VITAL_LIST_PAGE_LIMIT = 4;
export const ADD_RECORD = "Add Record";
export const PRINT_CHART = "Print Chart";
export const NEW_PATIENT = "New Patient";
export const FACILITY_ID = "Facility ID";
export const LOCATION_ID = "Location ID";
export const VENDOR_NAME = "Vendor Name";
export const IN_PROGRESS = "In Progress";
export const ADD_ALLERGY = "Add Allergy";
export const UPDATE_ALLERGY = "Update Allergy";
export const NEW_PROVIDER = "New Provider";
export const REVENUE_CODE = "Revenue Code";
export const SERVICE_CODE = "Service Code";
export const REGISTERED_ON = "Registered on";
export const VIEW_PATIENTS = "View Patients";
export const CLIA_ID_NUMBER = "CLIA ID Number";
export const CLAIM_RECEIVED = "Claim Received";
export const VIEW_FACILITIES = "View Facilities";
export const NEW_APPOINTMENT = "New Appointment";
export const MEDICAL_BILLING = "Medical Billing";
export const POS = "Place of Service Code (POS)";
export const LAB_TEXT = "Lab";
export const REVOKE = "REVOKE";
export const OTP_CODE = "OTP Code";
export const LOCATION = "Location";
export const DURATION = "Duration";
export const RECURRING = "Recurring";
export const TEST_DATE = "Test Date";
export const TEST_TIME = "Test Time";
export const LAST_FIVE_RESULTS = "Last 5 Results";
export const ADD_ANOTHER_REACTION = "Add Another Reaction";
export const NEW_STAFF = "New Staff";
export const LAST_NAME = "Last Name";
export const ACTIVATED = "Activated";
export const APPT_TYPE = "Appt Type:";
export const ORDER_NUMBER = "Order #";
export const BILLING_TEXT = "Billing";
export const REPORTS_TEXT = "Reports";
export const DOCTORS_TEXT = "Doctors";
export const TEST_NOTES = "Test Notes";
export const INITIATED = "Initialized";
export const UNVERIFIED = "Unverified";
export const SEND_EMAIL = "Send Email";
export const FIRST_NAME = "First Name";
export const START_TIME = "Start Time";
export const START_DATE = "Start Date";
export const SUPER_BILL = "Super Bill";
export const DEACTIVATE = "DEACTIVATE";
export const SETTINGS_TEXT = "Settings";
export const REQUESTS_TEXT = "Requests";
export const INVOICES_TEXT = "Invoices";
export const PATIENTS_TEXT = "Patients";
export const CARD_NUMBER = "Card Number";
export const EXPIRY_DATE = "Expiry Date";
export const RESEND_OTP = "Resend OTP ?";
export const NUMBER = "Number";
export const MY_PATIENTS = "My Patients";
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
export const PRACTICE_NPI = "Practice NPI";
export const PATIENT_INFO = "Patient Info";
export const USER_ROLE = "boca_admin_role";
export const DELETE_STAFF = "Delete Staff";
export const ADD_FACILITY = "Add Facility";
export const EDIT_SERVICE = "Edit Service";
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
export const FACILITY_NAME = "Facility Name";
export const PRACTICE_NAME = "Practice Name";
export const SPECIMEN_TYPE = "Specimen Type";
export const QUICK_ACTIONS = "Quick Actions";
export const EDIT_LOCATION = "Edit Location";
export const EDIT_FACILITY = "Edit Facility";
export const DELETE_RECORD = "Delete Record";
export const VIEW_FACILITY = "View Facility";
export const TOKEN_INVALID = "Token Invalid";
export const MOBILE_NUMBER = "Mobile number";
export const RESET_FILTERS = "Reset Filters";
export const NO_DATA_FOUND = "No data found";
export const RECORD_VITALS = "Record Vitals";
export const BACK_TO_HOME = "Return to Home";
export const APPOINTMENT_TEXT = "Appointment";
export const LAB_RESULTS_TEXT = "Lab Results";
export const BILLING_STATUS = "Billing Status";
export const VISIT_REASON = "Reason for visit";
export const UPDATE_SERVICE = "Update Service";
export const DELETE_PATIENT = "Delete Patient";
export const PAGE_NOT_FOUND = "Page Not Found";
export const ARRIVAL_STATUS = "Arrival Status";
export const RECENT_READINGS = "Recent Readings";
export const LAST_READING_DATE = "Last Reading Date: ";
export const REGISTERED_PATIENTS = "Registered Patients";
export const TODAYS_APPOINTMENTS = "Today’s Appointments";
export const TOTAL_USERS_PER_ROLE = "Total Users Per Role";
export const TOTAL_NUMBER_OF_USERS = "Total Number of Users";
export const ADD_VITALS = "Add Vitals";
export const UPDATE_VITALS = "Update Vitals";
export const ADD_PROBLEM = "Add Problem";
export const ADD_PROBLEMS = "Add Problems";
export const VIEW_BILLING = "View Billing";
export const US_DATE_FORMAT = "mm/dd/yyyy";
export const EDIT_PROBLEMS = "Edit Problems";
export const UPDATE_PROBLEM = "Update Problem";
export const EXCEPTION = "Forbidden exception";
export const DELETE_REQUEST = "Delete Request";
export const REQUEST_DETAIL = "Request Detail";
export const REQUEST_STATUS = "Request Status";
export const TEST_DATE_TIME = "Test Date/Time";
export const SEARCH_PATIENT = "Search Patient";
export const SPECIMEN_NOTES = "Specimen Notes";
export const INITIAL_CAPITAL_INVESTMENT = "2%";
export const OTHER_RELATION = "Other Relation";
export const DOCTOR_SIGNOFF = "Doctor Signoff";
export const OTHER_PROVIDER = "Other Provider";
export const EMAIL_VERIFIED = "Email Verified?";
export const APPOINTMENTS_TEXT = "Appointments";
export const ROLE_DETAILS_TEXT = "Role Details";
export const DOCTOR_SCHEDULE = "Doctor Schedule";
export const MY_APPOINTMENTS = "My Appointments";
export const DELETE_FACILITY = "Delete Facility";
export const UPDATE_LOCATION = "Update Location";
export const COLLECTION_DATE = "Collection Date";
export const COLLECTION_TIME = "Collection Time";
export const CREATE_PRACTICE = "Create Practice";
export const SET_PERMISSIONS = "Set Permissions";
export const ADD_FACILITY_SERVICE = "Add Service";
export const LAB_ORDER_RESULT = "Lab Order Result";
export const APPOINTMENT_INFO = "Appointment Info";
export const RESULT_FILE_NAME = "Result File Name";
export const LAST_APPOINTMENT = "Last Appointment";
export const ACCESSION_NUMBER = "Accession Number";
export const ALL_APPOINTMENTS = "All Appointments";
export const CLAIM_IN_PROCESS = "Claims in Process";
export const RESULTS_ENTERED = "Results Entered At";
export const RECENT_ACTIVITIES = "Recent Activities";
export const ASSIGNED_PROVIDER = "Assigned Provider";
export const TOTAL_CLAIM_TEXT = "7900 Claim in Total";
export const LAB_PERMISSIONS_TEXT = "Lab Permissions";
export const TOTAL_APPOINTMENTS = "Total Appointments";
export const PATIENT_DISCHARGED = "Patient Discharged";
export const QUICK_APPOINTMENTS = "Quick Appointments";
export const UPDATE_FACILITY_SERVICE = "Update Service";
export const INSURANCE_PLAN_TYPE = "Insurance Plan Type";
export const FUNCTIONAL_HEARTBURN = "Functional Heartburn";
export const PATIENT_INSURANCE = "Patient Insurance";
export const PATIENT_PAYMENT_TYPE = "Patient Payment Type";
export const ENTER_OTP_CODE = "Please enter your OTP Code";
export const EMERGENCY_ACCESS_LOG = "Emergency Access Log";
export const UPCOMING_APPOINTMENTS = "Upcoming Appointments";
export const AVAILABILITY_SCHEDULE = "Availability Schedule";
export const STATE_IMMUNIZATION_ID = "State Immunization ID";
export const BILLING_PERMISSIONS_TEXT = "Billing Permissions";
export const PRACTICE_REGISTRATIONS = "Practice Registrations";
export const PRACTICE_PERMISSIONS_TEXT = "Practice Permissions";
export const FACILITY_PERMISSIONS_TEXT = "Facility Permissions";
export const CLAIMS_REQUIRING_ACTION = "Claims Requiring Action";
export const RECENTLY_ADDED_PATIENTS = "Recently Added Patients";
export const CLAIM_AMOUNT_TO_PROCESS = "Claim Amount to Process";
export const TOTAL_USERS_PER_FACILITY = "Total Users Per Facility";
export const TOTAL_USERS_PER_PRACTICE = "Total Users Per Practice";
export const TOTAL_DISCHARGED_PATIENTS = "Total Discharged Patients";
export const RECENTLY_ADDED_FACILITIES = "Recently Added Facilities";
export const APPOINTMENTS_PER_FACILITY = "Appointments Per Facility";
export const APPOINTMENT_PERMISSIONS_TEXT = "Appointment Permissions";
export const AGAINST_TOTAL_APPOINTMENTS = "Against Total Appointments";
export const BACKUP_PROVIDER_IN_PRACTICE = "Backup provider in practice";
export const QUICK_PATIENT_REGISTRATIONS = "Quick Patient Registrations";
export const MISCELLANEOUS_PERMISSIONS_TEXT = "Miscellaneous Permissions";
export const ACTIVE_STAFF_IN_CURRENT_SHIFT = "Active Staff in Current Shift";
export const TOTAL_FACILITIES_PER_PRACTICE = "Total Facilities Per Practice";
export const PREFERRED_PROVIDER_IN_PRACTICE = "Preferred provider in practice";
export const REACTION_SELECTION_REQUIRED = "Please select at least one reaction";
export const AVAILABLE_USERS_IN_CURRENT_SHIFT = "Available Users in Current Shift";
export const ACTIVE_PROVIDERS_IN_CURRENT_SHIFT = "Active Providers in Current Shift";
export const USD = "USD";
export const SEX = "Sex";
export const SIZE = "Size";
export const RACE = "Race";
export const ID_TEXT = "ID";
export const LOGIN = "Login";
export const ROUTE = "Route";
export const TITLE = "Title";
export const AGREEMENT_BODY = 'Agreement Body'
export const PRICE = "Price";
export const DOB_TEXT = "DOB";
export const CREATE = "Create";
export const AMOUNT = "Amount";
export const SUBMIT = "Submit";
export const VISITS = "Visits";
export const SEARCH = "Search";
export const SIGNED = "Signed";
export const DELETE = "Delete";
export const UPLOAD = "Upload";
export const HOME_TEXT = "Home";
export const DETAILS = "Details";
export const PENDING = "Pending";
export const MISSING = "Missing";
export const CANCEL_RECORD = "Cancel record";
export const ACTIONS = "Actions";
export const BILLING = "Billing";
export const PRIVACY = "Privacy";
export const PAYMENT = "Payment";
export const ROLES_TEXT = "Roles";
export const IS_ACTIVE = "Active";
export const TOTAL_TEXT = "Total";
export const TWO_FA_TEXT = "2-FA";
export const COPAY_TEXT = "COPAY";
export const GUARDIAN = "Guardian";
export const EMPLOYER = "Employer";
export const CHECKOUT = "checkout";
export const INDUSTRY = "Industry";
export const ADDED_BY = "Added by";
export const RELOAD = "Go To Home";
export const LANGUAGE = "Language";
export const PRONOUNS = "Pronouns";
export const ADD_NUM = "Add Number";
export const UNLOCK_TEXT = "Unlock";
export const LEGAL_SEX = "Legal Sex";
export const MORE_INFO = "More Info";
export const LESS_INFO = "Less Info";
export const DIAGNOSES = "Diagnoses";
export const GUARANTOR = "Guarantor";
export const MEMBER_ID = "Member ID";
export const ID_NUMBER = "ID Number";
export const YOUR_NAME = "Your Name";
export const PRN_FORMAT = 'AA123456';
export const LAB_ORDER = "Lab Order";
export const ETHNICITY = "Ethnicity";
export const SIGNED_BY = "Signed by";
export const SIGNED_AT = "Signed at";
export const CASH_PAID = "Cash Paid";
export const TIME_SLOT = "Time Slot";
export const HOMEBOUND = "Home Bound";
export const PROFILE_TEXT = "Profile";
export const AGREEMENTS = "Agreements";
export const LAB_ORDERS = "Lab Orders";
export const ADD_POLICY = "Add Policy";
export const ADD_AGREEMENT = "Add Agreement";
export const EDIT_AGREEMENT = "Edit Agreement";
export const EMPLOYMENT = "Employment";
export const LOINC_CODE = "LOINC Code";
export const ISSUE_DATE = "Issue Date";
export const COPAY_TYPE = "Copay Type";
export const DOB_FORMAT = 'MM-DD-YYYY';
export const HOME_PHONE = "Home Phone";
export const UPDATED_ON = "Updated On:";
export const SCHEDULE_TEXT = "Schedule";
export const YES_CANCEL = "Yes, Cancel";
export const SSN_FORMAT = '000-00-0000';
export const CONTINUE_TEXT = "Continue";
export const NAME_FORMAT = 'First Last';
export const ADD_ROLE_TEXT = "Add Role";
export const ENTER_PHONE = "Enter Phone";
export const NEXT_OF_KIN = "Next Of Kin";
export const AUTO_LOGOUT = "Auto Logout";
export const LOCK_SCREEN = "Lock Screen";
export const POLICY_NAME = "Policy Name";
export const ELIGIBILITY = "Eligibility";
export const SELECT_DATE = "Select Date";
export const SUB_TOTAL_TEXT = "Sub-Total";
export const EFFECTIVE_TEXT = "EFFECTIVE";
export const SNO_MED_CODE = "SnoMed Code";
export const SIGNATURE_TEXT = "Signature";
export const PAY_VIA_CASH = "Pay via Cash";
export const ASSIGN_TO_ME = "Assign To Me";
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
export const DOCUMENT_TYPE = "Document Type";
export const PATIENT_CHART = "Patient Chart";
export const SIGN_DOCUMENT = "Sign Document";
export const COPAY_AMOUNTS = "Copay Amounts";
export const EDIT_PROVIDER = "Edit Provider";
export const ADD_INSURANCE = "Add Insurance";
export const DOCUMENT_NAME = "Document Name";
export const ABNORMAL_FLAG = "Abnormal Flag";
export const USER_SETTINGS = "User Settings";
export const ADD_SIGNATURE = "Add Signature";
export const PATIENT_NOTES = "Patient Notes";
export const EMPLOYER_NAME = "Employer Name";
export const POLICY_HOLDER = "Policy Holder";
export const PROVIDER_NAME = "Provider Name";
export const REVOKE_ACCESS = "Revoke Access";
export const FORMER_SMOKER = "Former Smoker";
export const PRICE_WITH_DOLLAR = "Price ($)";
export const POLICY_NAME_TEXT = "POLICY NAME";
export const DECREASED_DATE = "Deceased Date";
export const ELIGIBILITY_TEXT = "ELIGIBILITY";
export const ADD_DOCUMENT = "Upload Document";
export const OUTSTANDING_TEXT = "Outstanding";
export const PREFERRED_NAME = "Preferred Name";
export const HOLD_STATEMENT = "Hold Statement";
export const ENTER_PASSWORD = "Enter Password";
export const PAYMENT_METHOD = "Payment Method";
export const AMOUNT_WITH_DOLLAR = "Amount ($)";
export const CONTACT_NUMBER = "Contact Number";
export const VIEW_ENCOUNTER = "View Encounter";
export const ENTER_RELATION = "Enter Relation";
export const MARITAL_STATUS = "Marital Status";
export const EMPLOYER_PHONE = "Employer Phone";
export const USUAL_INDUSTRY = "Usual Industry";
export const STATEMENT_NOTE = "Statement note";
export const PRIVACY_NOTICE = "Privacy Notice";
export const DISABLE_ACCESS_PORTAL = "Enabled";
export const PAY_VIA_PAYPAL = "Pay via PayPal";
export const USUAL_PROVIDER = "Usual Provider";
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
export const MAILING_ADDRESS = "Mailing address";
export const CONSENT_TO_CALL = "Consent To call";
export const EXPIRATION_DATE = "Expiration Date";
export const UPLOAD_DOCUMENT = "Upload Document";
export const GENDER_IDENTITY = "Gender Identity";
export const AVAILABLE_SLOTS = "Available Slots";
export const PATIENT_DETAILS = "Patient Details";
export const SELECT_SERVICES = "Select Services";
export const USUAL_PROVIDER_ID = "Usual Provider";
export const UPLOADS_DOCUMENT = "Upload Document";
export const FORGOT_PASSWORD = "Forgot Password?";
export const MEMBERSHIP_REQUEST_TEXT = "Requests";
export const CALENDAR_VIEW_TEXT = "Calendar View";
export const DOCUMENT_DETAILS = "Document Details";
export const TWO_FACTOR_LOGIN = "Two-Factor Login";
export const POLICY_HOLDER_ID = "Policy holder ID";
export const APP_NAME_FORMAT = 'First Middle Last';
export const USER_INFORMATION = "User information";
export const CONFIRM_PASSWORD = "Confirm password";
export const MEMBERSHIP_PLANS = "Membership Plans";
export const CURRENT_PASSWORD = "Current password";
export const SAVE_APPOINTMENT = "Save Appointment";
export const UPDATE_SIGNATURE = "Update Signature";
export const BOOK_APPOINTMENT = "Book Appointment";
export const ORDER_OF_BENEFIT = "Order of Benefit";
export const CREATE_LAB_ORDER = "Create Lab Order";
export const ORDER_CREATED_AT = "Order Created At";
export const APPOINTMENT_DATE = "Appointment Date";
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
export const REQUIRE_SIGNATURE = "Require Signature";
export const FORGOT_PASSWORD_TEXT = "Forgot Password";
export const VIEW_SIGNED_DOCUMENT = "Signed document";
export const MEMBERSHIP_PLAN_EVENT = "MembershipPlan";
export const LIST_FACILITIES_TEXT = "List Facilities";
export const DOCTOR_PROFILE_TEXT = "Provider Profile";
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
export const SEARCH_FOR_PROBLEMS = "Search for Problems";
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
export const SEARCH_FOR_ALLERGIES = "Search for Allergies";
export const SEARCH_FOR_ICD_CODES = "Search for ICD Codes";
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
export const SIGN_PATIENT_DOCUMENT = "Sign Patient Document";
export const NOT_FOUND_EXCEPTION_CAP = "NOT FOUND EXCEPTION";
export const PUBLIC_FORM_SUCCESS_HEADING = 'Record Submitted';
export const PRODUCT_AND_SERVICES_TEXT = "Product & Services";
export const ALLOTED_NIGHTS_OF_USE = "Allotted Nights of Use";
export const DELETE_ACCOUNT_DESCRIPTION = "Confirm to Delete";
export const COINSURANCE_PERCENTAGE = "Coinsurance percentage";
export const TWO_FA_AUTHENTICATION = "2-Factor Authentication";
export const NOTHING_HERE_TEXT = "Seems there is nothing here";
export const DELETE_RECORD_TEXT = "You are about delete record";
export const DELETE_ROLE_DESCRIPTION = "Confirm to delete role";
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
export const APPOINTMENT_CANCELLED_TEXT = "Appointment cancelled";
export const ADD_PHONE_NUM_DESCRIPTION = "Please add phone number";
export const AGREEMENT_TEXT = "I agree to all terms and agreement";
export const BOCA_ADMIN_NOTIFICATIONS = "boca_admin_notifications";
export const ADD_ANOTHER_COPAY_AMOUNT = "Add Another Copay";
export const LIST_FACILITY_SERVICES_TEXT = "List Facility Services";
export const DELETE_DOCTOR_DESCRIPTION = "Confirm to delete doctor";
export const SIGN_DOCUMENT_DESCRIPTION = "Confirm to sign document";
export const DELETE_PATIENT_DESCRIPTION = "Confirm to delete patient";
export const AGREEMENT_HEADING = "User data privacy & TOS agreement.";
export const DELETE_SERVICE_DESCRIPTION = "Confirm to delete Service";
export const PUBLIC_FORM_FAIL_MESSAGE = 'Your record is not created.';
export const VERIFICATION_MESSAGE = "You are verified. Please login.";
export const NEXT_SCHEDULED_APPOINTMENT = "Next Scheduled Appointment";
export const DELETE_FACILITY_DESCRIPTION = "Confirm to delete facility";
export const DELETE_LOCATION_DESCRIPTION = "Confirm to delete location";
export const DELETE_DOCUMENT_DESCRIPTION = "Confirm to delete document";
export const DELETE_PRACTICE_DESCRIPTION = "Confirm to delete practice";
export const MOST_USED_STANDARD_POLICES = "Most Used Standard Policies";
export const INSURANCE_POLICY_DETAILS = "Insurance and Policies Details";
export const CHOOSE_YOUR_PAYMENT_METHOD = "Choose your Payment Method";
export const PROVIDER_REGISTRATION_DATES = "Provider/ Registration Dates";
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
export const DELETE_APPOINTMENT_DESCRIPTION = "Confirm to delete appointment";
export const CANCEL_APPOINTMENT_DESCRIPTION = "Confirm to cancel appointment";
export const DELETE_ALLERGY_DESCRIPTION = "Confirm to delete allergy";
export const DELETE_PROBLEM_DESCRIPTION = "Confirm to delete problem";
export const PREFERRED_COMMUNICATION_METHOD = "Preferred Communication Method";
export const UPLOADS_DOCUMENT_LEARN_MORE_TEXT = "Drop your image here, or browse";
export const MAMMOGRAPHY_CERTIFICATION_NUMBER = "Mammography Certification Number";
export const ADD_INSURANCE_INFORMATION = "Click here to add insurance information";
export const DELETE_DOCTOR_SCHEDULE_DESCRIPTION = "Confirm to delete doctor schedule";
export const DELETE_MEDIA_DESCRIPTION = "Are you sure you want to delete this media?";
export const PUBLIC_FORM_SUCCESS_TITLE = 'Your record has been submitted successfully.';
export const DELETE_FACILITY_SCHEDULE_DESCRIPTION = "Confirm to delete facility schedule";
export const DELETE_REQUEST_DESCRIPTION = "Are you sure you want to delete this request?";
export const TWO_FACTOR_LOGIN_DESCRIPTION = "Enter security code from your mobile phone.";
export const PATIENT_RELATIONSHIP_TO_POLICY_HOLDER = "Patient relationship to policy holder";
export const DELETE_LAB_ORDER_RESULT_DESCRIPTION = "Confirm to delete lab order result file";
export const POLICY_HOLDER_ID_CERTIFICATION_NUMBER = "Policy holder ID/certification number";
export const PUBLIC_FORM_SUCCESS_DESCRIPTION_1 = 'Your Details has been record successfully.';
export const APPOINTMENT_CANCEL_SUBHEADING = "You won’t be able to revert this action later!";
export const REQUIRE_AGREEMENT_BEFORE_AGREEING = "Require to view the agreement before agreeing";
export const PRIMARY_INSURANCE_DESCRIPTION = "Click here to add primary insurance (Recommended)";
export const DELETE_POLICY_CARD_ATTACHMENT_DESCRIPTION = "Confirm to delete Insurance cards file";
export const RELEASE_OF_BILLING_INFO = "Release of Billing Information and Assignment of Benefits";
export const PROVIDER_DETAILS_SUCCESS_DESCRIPTION = 'Provider Details has been added successfully.';
export const ANNUAL_MANAGEMENT_FEE = "Annual Management Fee (based on initial capital contribution)";
export const FACILITY_ADMIN_SEARCH_PLACEHOLDER = "Patient Name, Patient ID or Insurance Number etc...";
export const APPOINTMENT_CONFIRM_HEADING = "We've sent you a confirmation message & email for your records.";
export const PASSWORD_CHANGE_TEXT = "Your password is successfully changed. Please Sign in to your account.";
export const AUTO_LOGOUT_DESCRIPTION = "Your account will automatically logout after a period of inactivity.";
export const APPOINTMENT_BOOKING_PAYMENT_CHARGED = "You will be charged $34.00 for this appointment booking.";
export const SLOT_CONFIRMATION_HEADING_TWO = "We've sent you a confirmation message & email for your records.";
export const SLOT_CONFIRMATION_SUB_HEADING = "Skip some of the paperwork at the clinic by adding more information.";
export const VERIFY_EMAIL_TEXT = "We have sent an email to example@aimed.com please follow a link to verify your email";
export const INSURANCE_SEARCH_DESCRIPTION = "Add more names for better search results (e.g. company, group, plan, policy, etc.)";
export const APPOINTMENT_SUCCESS_DOCUMENTS_SUBHEADING1 = "Please bring a valid photo ID and any insurance cards (if applicable).";
export const SLOT_CONFIRMATION_SUB_HEADING_TWO = "You can access the information form now or later from your email or text message.";
export const APPOINTMENT_SUCCESS_DOCUMENTS_HEADING = "Thank you! When you arrive, Please make sure to have these documents with you.";
export const SIGN_RECORD_LEARN_MORE_TEXT = "You are about to sign this document permanently. Are you sure you want to sign this document?";
export const DELETE_RECORD_LEARN_MORE_TEXT = "You are about to delete this record permanently. Are you sure you want to delete this record?";
export const CANCEL_RECORD_LEARN_MORE_TEXT = "You are about to cancel this record permanently. Are you sure you want to cancel this record?";
export const appointmentCancellationDescription = `Are you sure you want to cancel Devone Lane’s Appointment on 16 Feb, 2022 at time 11:00am?`;
export const CONSENT_AGREEMENT_LABEL = "I agree to the terms & conditions and hereby, authorize AIMED health facilities to keep my personal health record.";
export const APPOINTMENT_SUCCESS_DOCUMENTS_SUBHEADING2 = "Please consult your personal benefit plan details for any out-of-pocket costs which might apply (if applicable).";
export const APPOINTMENT_CONFIRM_SUBHEADING = "Skip some of the paperwork at the clinic by adding more information. You can access the information form now or later from your email or text message.";
export const TWO_FA_AUTHENTICATION_DESCRIPTION = "When you login you provide an email address and password. This is one “factor” of authenticating who you are. 2-Factor refers to using a second factor to confirm your identity.";
export const appointmentConfirmationDescription = (dateTime: string) =>
  `Thank you! Your visit at ${getStandardTime(
    dateTime || ""
  )} on ${getFormattedDate(
    dateTime || ""
  )} has been confirmed. ${APPOINTMENT_CONFIRM_HEADING}`;

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
export const TWO_FA_AUTHENTICATION_ROUTE = "/2FA-authentication";
export const MAINTENANCE_ROUTE = "/maintenance";
export const PAST_APPOINTMENTS = "Past Appointments";
export const LAB_RESULTS_ROUTE = "/lab-results";
export const AGREEMENTS_ROUTE = "/agreements";
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
export const EDIT_LAB_ORDERS_ROUTE = "/lab-orders/edit";
export const ADD_LAB_ORDERS_RESULTS_ROUTE = "/lab-orders/result/add";
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

// Register-Patient Routes
export const IDENTIFICATION_ROUTE = "identification";
export const CONTACT_INFORMATION_ROUTE = "contact-information";
export const PROVIDER_REGISTRATION__ROUTE = "provider-registration";
export const PRIVACY__ROUTE = "privacy";
export const EMERGENCY_CONTACT_ROUTE = "emergency-contact";
export const GUARANTOR_ROUTE = "guarantor";
export const MAILING_ADDRESS_ROUTE = "mailing-address";
export const EMPLOYMENT_ROUTE = "employment";
export const DEMOGRAPHICS_ROUTE = "demographics";
export const BILLING_ROUTE = "billing";


// HELPER TEXT MESSAGES
export const MIN_LENGTH_MESSAGE = `Text too short`;
export const ZIP_VALIDATION_MESSAGE = "Invalid Zip code";
export const REQUIRED_MESSAGE = "This field is required";
export const PASSWORD_NOT_MATCHED = "Password doesn't match";
export const DOB_VALIDATION_MESSAGE = "Date of birth is invalid";
export const DELETE_REQUEST_INFO = "This will delete the request.";
export const ROUTING_NO_VALIDATION_MESSAGE = `Invalid routing number`;
export const BANK_ACCOUNT_VALIDATION_MESSAGE = "Invalid bank account.";
export const SSN_VALIDATION_MESSAGE = "SSN valid format is NNN-NN-NNNN";
export const CLIA_VALIDATION_MESSAGE = "CLIA should be 10-alphanumeric";
export const TID_VALIDATION_MESSAGE = "Tax id valid format is 9xxxxxxxx";
export const NPI_VALIDATION_MESSAGE = "NPI should be a 10-digit combination";
export const ALLERGY_DATE_VALIDATION_MESSAGE = "Allergy start date is invalid";
export const REACTIONS_VALIDATION_MESSAGE = "At least one reaction is required";
export const DIAGNOSES_VALIDATION_MESSAGE = "At least one diagnose is required";
export const TEST_FIELD_VALIDATION_MESSAGE = "Test is required";
export const SPECIMEN_FIELD_VALIDATION_MESSAGE = "Specimen Type is required";
export const EIN_VALIDATION_MESSAGE = "EIN should be NN-NNNNNNN, dash is optional";
export const PLEASE_ADD_DOCUMENT = "Please upload or drag and drop the documents here";
export const PLEASE_CLICK_TO_UPDATE_DOCUMENT = "Please click here to update the documents";
export const UPIN_VALIDATION_MESSAGE = "UPIN should be six-place alpha numeric identifiers";
export const REVENUE_CODE_VALIDATION_MESSAGE = "Revenue code should be a 4-digit combination";
export const DELETE_USER_INFO = "This will delete all the information associated with the user.";
export const minDobValidMessage = (label: string) => `${label}'s age should be more that 20-years`;
export const maxDobValidMessage = (label: string) => `${label}'s age should be less that 100-years`;
export const FACILITY_CODE_VALIDATION_MESSAGE = "Facility code can only be capital alphabets 2-5 in length";
export const MAMMOGRAPHY_VALIDATION_MESSAGE = "Valid mammography certification Number format is like REF-EW-111111";
export const ValidOTP = () => `Please enter only numbers`;
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
export const ROLE_NOT_FOUND = "Role not found!";
export const SCHEDULE_END = "Schedule End Time";
export const STAFF_NOT_FOUND = "Staff not found!";
export const LOGIN_SUCCESSFULLY = "Welcome to AIMED";
export const INVALID_OTP_CODE = "Invalid otp code";
export const SCHEDULE_START = "Schedule Start Time";
export const INVALID_EMAIL = "Invalid email address";
export const OTP_WRONG_MESSAGE = "OTP code is wrong.";
export const PATIENT_NOT_FOUND = "Patient not found!";
export const SERVICE_NOT_FOUND = "Service not found!";
export const APPOINTMENT_CANCEL = "Appointment Cancel";
export const FACILITY_NOT_FOUND = "Facility not found!";
export const PRACTICE_NOT_FOUND = "Practice not found!";
export const LOCATION_NOT_FOUND = "Location not found!";
export const SCHEDULE_NOT_FOUND = "Schedule not found!";
export const CANT_DELETE_ROLE = "Role can't be deleted.";
export const CANT_DELETE_AGREEMENT = "Agreement can't be deleted.";
export const SELECT_DAY_MESSAGE = "Please select a day!";
export const STAFF_ALREADY_EXIST = "Staff already exists";
export const DROP_FIELD = "Please drop at least one field";
export const CANT_DELETE_STAFF = "Staff can't be deleted.";
export const ROLE_CREATED = "Role is created successfully";
export const ROLE_UPDATED = "Role is updated successfully";
export const STAFF_CREATED = "Staff created successfully!";
export const STAFF_UPDATED = "Staff updated successfully!";
export const TRY_AGAIN = "Something went wrong. Try again!";
export const SCHEDULE_WITH_DOCTOR = "Schedule with doctor: ";
export const SCHEDULED_IN_FACILITY = "Scheduled in facility: ";
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
export const PROFILE_UPDATE = "Profile is updated successfully";
export const CHANGES_SAVED = "Changes saved successfully!";
export const CANT_DELETE_SCHEDULE = "Schedule can't be deleted.";
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
export const CANT_DELETE_SELF_STAFF = "Staff can't delete itself";
export const NO_USER_WITH_EMAIL = "No user found with this email.";
export const PERMISSIONS_SET = "Role Permissions set successfully";
export const FAILED_TO_CREATE_PATIENT = "Failed to create patient!";
export const FAILED_TO_UPDATE_PATIENT = "Failed to update patient!";
export const FORBIDDEN_ROUTE = "This resource is forbidden for you!";
export const ATTACHMENT_DELETED = "Attachment deleted successfully!";
export const VALID_PASSWORD_MESSAGE = "Please enter valid password.";
export const NO_ASSOCIATED_PRACTICE = "No associated practice found!";
export const ORDER_DELETION_MESSAGE = "Order is deleted successfully";
export const ALREADY_ACTIVATED_MESSAGE = "User is already activated.";
export const TWO_FA_ENABLED_SUCCESSFULLY = "2FA enabled successfully";
export const CANT_UPDATE_SYSTEM_ROLES = "System roles can't be update";
export const OLD_PASSWORD_DID_NOT_MATCH = "Old password didn't match!";
export const APPOINTMENT_NOT_FOUND_EXCEPTION = "Appointment not found";
export const CANT_UPDATE_APPOINTMENT = "Appointment can't be updated.";
export const TWO_FA_DISABLED_SUCCESSFULLY = "2FA disabled successfully";
export const EMAIL_OR_USERNAME_ALREADY_EXISTS = "Email already exists!";
export const ROLE_ALREADY_EXIST = "Role already exists with this name!";
export const CANT_BOOK_APPOINTMENT = "You can not book this appointment.";
export const ALREADY_DEACTIVATED_MESSAGE = "User is already deactivated.";
export const PATIENT_ALLERGY_ADDED = "Patient allergy added successfully!";
export const PATIENT_PROBLEM_ADDED = "Patient problem added successfully!";
export const CANT_CANCELLED_APPOINTMENT = "Appointment can't be cancelled.";
export const ADMIN_PORTAL_MESSAGE = "Please sign in to explore Admin Portal.";
export const NOT_SUPER_ADMIN_MESSAGE = "Only Admins can access Admin Portal!";
export const EMERGENCY_ACCESS_UPDATE = "Emergency Access updated successfully";
export const PATIENT_ALLERGY_UPDATED = "Patient allergy updated successfully!";
export const OTP_NOT_FOUND_EXCEPTION_MESSAGE = "Precondition Failed Exception";
export const PATIENT_PROBLEM_UPDATED = "Patient problem updated successfully!";
export const RESET_PASSWORD_MESSAGE = "Please enter your new secure password.";
export const PATIENT_ALLERGY_DELETED = "Patient allergy deleted successfully!";
export const PATIENT_PROBLEM_DELETED = "Patient problem deleted successfully!";
export const SCHEDULE_CREATED_SUCCESSFULLY = "Schedule is booked successfully";
export const SET_PASSWORD_SUCCESS = "Your password has been set successfully.";
export const SCHEDULE_UPDATED_SUCCESSFULLY = "Schedule is updated successfully";
export const TRANSACTION_PAID_SUCCESSFULLY = "Transaction is paid successfully";
export const PATIENT_PROVIDER_UPDATED = "Patient Provider updated successfully!";
export const PRECONDITION_FAILED_EXCEPTION_MESSAGE = "Resource can't be deleted.";
export const PATIENT_CANT_BE_INVITED = "Some information is missing. Patient Can't be invited";
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
  "Cancelled appointment can't be edited!";
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
  "Practice/Facility already exists against provided data!";
export const FORGOT_PASSWORD_TEXT_MESSAGE =
  "Enter your registered email address to get reset-password link";
export const CANT_VERIFY_EMAIL_WHILE_LOGGED_IN_MESSAGE =
  "You can't verify a email while you are logged in.";
export const EMAIL_CHANGED_OR_NOT_VERIFIED_MESSAGE =
  "Email changed or not verified, please verify your email";
export const INVALID_OR_EXPIRED_VERIFICATION_TOKEN_MESSAGE =
  "Sorry! Your verification token is expired or invalid";
export const CANCEL_TIME_EXPIRED_MESSAGE =
  "Appointment is to be scheduled in less than 1 hour, It can't be cancelled now!";
export const CANCEL_TIME_PAST_MESSAGE = "Appointment time has passed";
export const EXPIRE_TOKEN_MESSAGE =
  "Your token has been expired. Please click on the button below to get an email again.";
export const EMERGENCY_ACCESS_ERROR_MESSAGE =
  "You don't have permission to change emergency access status.";
export const CREATE_AGREEMENT_MESSAGE =
  "Agreement created Successfully";
export const UPDATE_AGREEMENT_MESSAGE =
  "Agreement updated Successfully";
export const LOREM_TEXT_15 =
  "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente atque explicabo debitis inventore delectus quos!";

// INFO MESSAGES
export const MEMBER_ID_CERTIFICATE_NUMBER_TOOLTIP =
  "This field contains the payer-returned member ID or certification number. If you believe that this value was sent in error, you can set the verified eligibility status in the Eligibility section of this page using the 'Practice Override' reason. This will stop auto-updates of this field for ten days.";
export const COPAY_AMOUNTS_TOOLTIP =
  "These field(s) can be edited to store copay amounts by service-type. Some fields are pre-populated with payer-returned values and can be over-written by editing the field. These fields will no longer auto-populate after they have been edited.";
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
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const YEARS = [2017, 2018, 2019, 2020, 2021, 2022]
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
  { id: AllergySeverity.VeryMild, name: formatValue(AllergySeverity.VeryMild) },
  { id: AllergySeverity.Mild, name: formatValue(AllergySeverity.Mild) },
  { id: AllergySeverity.Moderate, name: formatValue(AllergySeverity.Moderate) },
  { id: AllergySeverity.Acute, name: formatValue(AllergySeverity.Acute) },
];

export const MAPPED_PRACTICE_TYPES: SelectorOption[] = [
  { id: PracticeType.Lab, name: formatValue(PracticeType.Lab) },
  { id: PracticeType.Clinic, name: formatValue(PracticeType.Clinic) },
  { id: PracticeType.Hospital, name: formatValue(PracticeType.Hospital) },
];

export const LAB_TEST_STATUSES: SelectorOption[] = [
  { id: LabTestStatus.Discontinued, name: formatValue(LabTestStatus.Discontinued) },
  { id: LabTestStatus.InProgress, name: formatValue(LabTestStatus.InProgress) },
  { id: LabTestStatus.OrderEntered, name: formatValue(LabTestStatus.OrderEntered) },
  { id: LabTestStatus.ResultReceived, name: formatValue(LabTestStatus.ResultReceived) },
  { id: LabTestStatus.ResultReviewedWithPatient, name: formatValue(LabTestStatus.ResultReviewedWithPatient) },
];

export const MAPPED_POLICY_HOLDER_RELATIONSHIP_TYPE = mapEnum<typeof PolicyHolderRelationshipType>(PolicyHolderRelationshipType)

export const MAPPED_POLICY_ORDER_OF_BENEFIT = mapEnum<typeof OrderOfBenefitType>(OrderOfBenefitType)

export const MAPPED_PRICING_PRODUCT_TYPE = mapEnum<typeof PricingProductType>(PricingProductType)

export const MAPPED_COPAY_TYPE = mapEnum<typeof CopayType>(CopayType)

export const MAPPED_POLICY_GENDER = mapEnum<typeof Policy_Holder_Gender_Identity>(Policy_Holder_Gender_Identity)

export const MAPPED_PATIENT_BILLING_STATUS = mapEnum<typeof PatientBillingStatus>(PatientBillingStatus)

export const MAPPED_PATIENT_PAYMENT_TYPE = mapEnum<typeof PatientPaymentType>(PatientPaymentType)

export const MAPPED_ONSET_DATE_TYPE = mapEnum<typeof OnsetDateType>(OnsetDateType)

export const MAPPED_OTHER_DATE_TYPE = mapEnum<typeof OtherDateType>(OtherDateType)



export const MAPPED_APPOINTMENT_STATUS: SelectorOption[] = [
  {
    id: AppointmentStatus.Cancelled,
    name: formatValue(AppointmentStatus.Cancelled),
  },
  {
    id: AppointmentStatus.Discharged,
    name: formatValue(AppointmentStatus.Discharged),
  },
  {
    id: AppointmentStatus.Scheduled,
    name: formatValue(AppointmentStatus.Scheduled),
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
    id: ServiceCode.Telehealth_10,
    name: formatServiceCode('TELEHEALTH_82'),
  },
  {
    id: ServiceCode.WalkInRetailHealthClinic,
    name: formatServiceCode(ServiceCode.WalkInRetailHealthClinic),
  },
];

export const TEMPORARY_CPT_CODES = [
  {
    cptCode: "86318",
    description: "Immunoassay for infectious agent antibody(ies), qualitative or semiquantitative, single-step method (eg, reagent strip);"
  },
  {
    cptCode: "86328",
    description: "Immunoassay for infectious agent antibody(ies), qualitative or semiquantitative, single-step method (eg, reagent strip); severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (Coronavirus disease [COVID-19])"
  },
  {
    cptCode: "86408",
    description: "Neutralizing antibody, severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (Coronavirus disease [COVID-19]); screen"
  },
  {
    cptCode: "86409",
    description: "Neutralizing antibody, severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (Coronavirus disease [COVID-19]); titer"
  },
  {
    cptCode: "86413",
    description: "Severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (Coronavirus disease [COVID-19]) antibody, quantitative"
  },
  {
    cptCode: "86769",
    description: "Antibody; severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (Coronavirus disease [COVID-19])"
  },
  {
    cptCode: "87301",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; adenovirus enteric types 40/41"
  },
  {
    cptCode: "87305",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; Aspergillus"
  },
  {
    cptCode: "87320",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; Chlamydia trachomatis"
  },
  {
    cptCode: "87324",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; Clostridium difficile toxin(s)"
  },
  {
    cptCode: "87327",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; Cryptococcus neoformans"
  },
  {
    cptCode: "87328",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; cryptosporidium"
  },
  {
    cptCode: "87329",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; giardia"
  },
  {
    cptCode: "87332",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; cytomegalovirus"
  },
  {
    cptCode: "87335",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; Escherichia coli 0157"
  },
  {
    cptCode: "87336",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; Entamoeba histolytica dispar group"
  },
  {
    cptCode: "87337",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; Entamoeba histolytica group"
  },
  {
    cptCode: "87338",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; Helicobacter pylori, stool"
  },
  {
    cptCode: "87339",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; Helicobacter pylori"
  },
  {
    cptCode: "87340",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; hepatitis B surface antigen (HBsAg)"
  },
  {
    cptCode: "87341",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; hepatitis B surface antigen (HBsAg) neutralization"
  },
  {
    cptCode: "87350",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; hepatitis Be antigen (HBeAg)"
  },
  {
    cptCode: "87380",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; hepatitis, delta agent"
  },
  {
    cptCode: "87385",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; Histoplasma capsulatum"
  },
  {
    cptCode: "87389",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; HIV-1 antigen(s), with HIV-1 and HIV-2 antibodies, single result"
  },
  {
    cptCode: "87390",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; HIV-1"
  },
  {
    cptCode: "87391",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; HIV-2"
  },
  {
    cptCode: "87400",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; Influenza, A or B, each"
  },
  {
    cptCode: "87420",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; respiratory syncytial virus"
  },
  {
    cptCode: "87425",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; rotavirus"
  },
  {
    cptCode: "87426",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; severe acute respiratory syndrome coronavirus (eg, SARS-CoV, SARS-CoV-2 [COVID-19])"
  },
  {
    cptCode: "87427",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; Shiga-like toxin"
  },
  {
    cptCode: "87428",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; severe acute respiratory syndrome coronavirus (eg, SARS-CoV, SARS-CoV-2 [COVID-19]) and influenza virus types A and B"
  },
  {
    cptCode: "87430",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; Streptococcus, group A"
  },
  {
    cptCode: "87449",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; not otherwise specified, each organism"
  },
  {
    cptCode: "87451",
    description: "Infectious agent antigen detection by immunoassay technique, (eg, enzyme immunoassay [EIA], enzyme-linked immunosorbent assay [ELISA], fluorescence immunoassay [FIA], immunochemiluminometric assay [IMCA]) qualitative or semiquantitative; polyvalent for multiple organisms, each polyvalent antiserum"
  },
  {
    cptCode: "87635",
    description: "Infectious agent detection by nucleic acid (DNA or RNA); severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (Coronavirus disease [COVID-19]), amplified probe technique"
  },
  {
    cptCode: "87636",
    description: "Infectious agent detection by nucleic acid (DNA or RNA); severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (Coronavirus disease [COVID-19]) and influenza virus types A and B, multiplex amplified probe technique"
  },
  {
    cptCode: "87637",
    description: "Infectious agent detection by nucleic acid (DNA or RNA); severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (Coronavirus disease [COVID-19]), influenza virus types A and B, and respiratory syncytial virus, multiplex amplified probe technique"
  },
  {
    cptCode: "87802",
    description: "Infectious agent antigen detection by immunoassay with direct optical (ie, visual) observation; Streptococcus, group B"
  },
  {
    cptCode: "87803",
    description: "Infectious agent antigen detection by immunoassay with direct optical (ie, visual) observation; Clostridium difficile toxin A"
  },
  {
    cptCode: "87806",
    description: "Infectious agent antigen detection by immunoassay with direct optical (ie, visual) observation; HIV-1 antigen(s), with HIV-1 and HIV-2 antibodies"
  },
  {
    cptCode: "87804",
    description: "Infectious agent antigen detection by immunoassay with direct optical (ie, visual) observation; Influenza"
  },
  {
    cptCode: "87807",
    description: "Infectious agent antigen detection by immunoassay with direct optical (ie, visual) observation; respiratory syncytial virus"
  },
  {
    cptCode: "87811",
    description: "Infectious agent antigen detection by immunoassay with direct optical (ie, visual) observation; severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (Coronavirus disease [COVID-19])"
  },
  {
    cptCode: "87808",
    description: "Infectious agent antigen detection by immunoassay with direct optical (ie, visual) observation; Trichomonas vaginalis"
  },
  {
    cptCode: "87809",
    description: "Infectious agent antigen detection by immunoassay with direct optical (ie, visual) observation; adenovirus"
  },
  {
    cptCode: "87810",
    description: "Infectious agent antigen detection by immunoassay with direct optical (ie, visual) observation; Chlamydia trachomatis"
  },
  {
    cptCode: "87850",
    description: "Infectious agent antigen detection by immunoassay with direct optical (ie, visual) observation; Neisseria gonorrhoeae"
  },
  {
    cptCode: "87880",
    description: "Infectious agent antigen detection by immunoassay with direct optical (ie, visual) observation; Streptococcus, group A"
  },
  {
    cptCode: "87899",
    description: "Infectious agent antigen detection by immunoassay with direct optical (ie, visual) observation; not otherwise specified"
  },
  {
    cptCode: "87913",
    description: "Infectious agent genotype analysis by nucleic acid (DNA or RNA); severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]), mutation identification in targeted region(s)"
  },
  {
    cptCode: "0202U",
    description: "Infectious disease (bacterial or viral respiratory tract infection), pathogen-specific nucleic acid (DNA or RNA), 22 targets including severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2), qualitative RT-PCR, nasopharyngeal swab, each pathogen reported as detected or not detected"
  },
  {
    cptCode: "0223U",
    description: "Infectious disease (bacterial or viral respiratory tract infection), pathogen-specific nucleic acid (DNA or RNA), 22 targets including severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2), qualitative RT-PCR, nasopharyngeal swab, each pathogen reported as detected or not detected"
  },
  {
    cptCode: "0224U",
    description: "Antibody, severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (Coronavirus disease [COVID-19]), includes titer(s), when performed"
  },
  {
    cptCode: "0225U",
    description: "Infectious disease (bacterial or viral respiratory tract infection) pathogen-specific DNA and RNA, 21 targets, including severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2), amplified probe technique, including multiplex reverse transcription for RNA targets, each analyte reported as detected or not detected"
  },
  {
    cptCode: "0226U",
    description: "Surrogate viral neutralization test (sVNT), severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (Coronavirus disease [COVID-19]), ELISA, plasma, serum"
  },
  {
    cptCode: "0240U",
    description: "Infectious disease (viral respiratory tract infection), pathogen-specific RNA, 3 targets (severe acute respiratory syndrome coronavirus 2 [SARS-CoV-2], influenza A, influenza B), upper respiratory specimen, each pathogen reported as detected or not detected"
  },
  {
    cptCode: "0241U",
    description: "Infectious disease (viral respiratory tract infection), pathogen-specific RNA, 4 targets (severe acute respiratory syndrome coronavirus 2 [SARS-CoV-2], influenza A, influenza B, respiratory syncytial virus [RSV]), upper respiratory specimen, each pathogen reported as detected or not detected"
  },
  {
    cptCode: "99072",
    description: "Additional supplies, materials, and clinical staff time over and above those usually included in an office visit or other non-facility service(s), when performed during a Public Health Emergency, as defined by law, due to respiratory-transmitted infectious disease"
  },
  {
    cptCode: "0001A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 30 mcg/0.3 mL dosage, diluent reconstituted; first dose"
  },
  {
    cptCode: "0002A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 30 mcg/0.3 mL dosage, diluent reconstituted; second dose"
  },
  {
    cptCode: "0003A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 30 mcg/0.3 mL dosage, diluent reconstituted; third dose"
  },
  {
    cptCode: "0004A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 30 mcg/0.3 mL dosage, diluent reconstituted; booster dose"
  },
  {
    cptCode: "0051A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 30 mcg/0.3 mL dosage, tris-sucrose formulation; first dose"
  },
  {
    cptCode: "0052A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 30 mcg/0.3 mL dosage, tris-sucrose formulation; second dose"
  },
  {
    cptCode: "0053A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 30 mcg/0.3 mL dosage, tris-sucrose formulation; third dose"
  },
  {
    cptCode: "0054A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 30 mcg/0.3 mL dosage, tris-sucrose formulation; booster dose"
  },
  {
    cptCode: "0071A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 10 mcg/0.2 mL dosage, diluent reconstituted, tris-sucrose formulation; first dose"
  },
  {
    cptCode: "0072A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 10 mcg/0.2 mL dosage, diluent reconstituted, tris-sucrose formulation; second dose"
  },
  {
    cptCode: "0073A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 10 mcg/0.2 mL dosage, diluent reconstituted, tris-sucrose formulation; third dose"
  },
  {
    cptCode: "0074A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 10 mcg/0.2 mL dosage, diluent reconstituted, tris-sucrose formulation; booster dose"
  },
  {
    cptCode: "0081A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 3 mcg/0.2 mL dosage, diluent reconstituted, tris-sucrose formulation; first dose"
  },
  {
    cptCode: "0082A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 3 mcg/0.2 mL dosage, diluent reconstituted, tris-sucrose formulation; second dose"
  },
  {
    cptCode: "0011A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 100 mcg/0.5 mL dosage; first dose"
  },
  {
    cptCode: "0012A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 100 mcg/0.5 mL dosage; second dose"
  },
  {
    cptCode: "0013A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 100 mcg/0.5 mL dosage; third dose"
  },
  {
    cptCode: "0064A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 50 mcg/0.25 mL dosage, booster dose"
  },
  {
    cptCode: "0094A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 50 mcg/0.5 mL dosage, booster dose"
  },
  {
    cptCode: "0021A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, DNA, spike protein, chimpanzee adenovirus Oxford 1 (ChAdOx1) vector, preservative free, 5x1010 viral particles/0.5 mL dosage; first dose"
  },
  {
    cptCode: "0022A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, DNA, spike protein, chimpanzee adenovirus Oxford 1 (ChAdOx1) vector, preservative free, 5x1010 viral particles/0.5 mL dosage; second dose"
  },
  {
    cptCode: "0031A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, DNA, spike protein, adenovirus type 26 (Ad26) vector, preservative free, 5x1010 viral particles/0.5 mL dosage; single dose"
  },
  {
    cptCode: "0034A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, DNA, spike protein, adenovirus type 26 (Ad26) vector, preservative free, 5x1010 viral particles/0.5 mL dosage; booster dose"
  },
  {
    cptCode: "0041A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, recombinant spike protein nanoparticle, saponin-based adjuvant, preservative free, 5 mcg/0.5 mL dosage; first dose"
  },
  {
    cptCode: "0042A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, recombinant spike protein nanoparticle, saponin-based adjuvant, preservative free, 5 mcg/0.5 mL dosage; second dose"
  },
  {
    cptCode: "0104A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, monovalent, preservative free, 5 mcg/0.5 mL dosage, adjuvant AS03 emulsion, booster dose"
  },
  {
    cptCode: "0111A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 25 mcg/0.25 mL dosage; first dose"
  },
  {
    cptCode: "0112A",
    description: "Immunization administration by intramuscular injection of severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 25 mcg/0.25 mL dosage; second dose"
  },
  {
    cptCode: "91300",
    description: "Severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 30 mcg/0.3 mL dosage, diluent reconstituted, for intramuscular use"
  },
  {
    cptCode: "91305",
    description: "Severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 30 mcg/0.3 mL dosage, tris-sucrose formulation, for intramuscular use"
  },
  {
    cptCode: "91307",
    description: "Severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 10 mcg/0.2 mL dosage, diluent reconstituted, tris-sucrose formulation, for intramuscular use"
  },
  {
    cptCode: "91308",
    description: "Severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 3 mcg/0.2 mL dosage, diluent reconstituted, tris-sucrose formulation, for intramuscular use"
  },
  {
    cptCode: "91301",
    description: "Severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 100 mcg/0.5 mL dosage, for intramuscular use"
  },
  {
    cptCode: "91306",
    description: "Severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 50 mcg/0.25 mL dosage, for intramuscular use"
  },
  {
    cptCode: "91311",
    description: "Severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 25 mcg/0.25 mL dosage, for intramuscular use"
  },
  {
    cptCode: "91309",
    description: "Severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, mRNA-LNP, spike protein, preservative free, 50 mcg/0.5 mL dosage, for intramuscular use"
  },
  {
    cptCode: "91302",
    description: "Severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, DNA, spike protein, chimpanzee adenovirus Oxford 1 (ChAdOx1) vector, preservative free, 5x1010 viral particles/0.5 mL dosage, for intramuscular use"
  },
  {
    cptCode: "91303",
    description: "Severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, DNA, spike protein, adenovirus type 26 (Ad26) vector, preservative free, 5x1010 viral particles/0.5 mL dosage, for intramuscular use"
  },
  {
    cptCode: "91304",
    description: "Severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, recombinant spike protein nanoparticle, saponin-based adjuvant, preservative free, 5 mcg/0.5 mL dosage, for intramuscular use"
  },
  {
    cptCode: "91310",
    description: "Severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) (coronavirus disease [COVID-19]) vaccine, monovalent, preservative free, 5 mcg/0.5 mL dosage, adjuvant AS03 emulsion, for intramuscular use"
  }
]

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
  { id: Maritialstatus.Maried, name: formatValue(Maritialstatus.Maried) },
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
    id: Race.AmericanIndianAlaskaNative,
    name: formatValue(Race.AmericanIndianAlaskaNative),
  },
  {
    id: Race.NativeHawaiianPacificIslander,
    name: formatValue(Race.NativeHawaiianPacificIslander),
  },
];

export const MAPPED_ETHNICITY: SelectorOption[] = [
  {
    id: Ethnicity.DeclineToSpecify,
    name: formatValue(Ethnicity.DeclineToSpecify),
  },
  {
    id: Ethnicity.HispanicOrLatino,
    name: formatValue(Ethnicity.HispanicOrLatino),
  },
  {
    id: Ethnicity.NotHispanicOrLatino,
    name: formatValue(Ethnicity.NotHispanicOrLatino),
  },
];

export const MAPPED_SEXUAL_ORIENTATION: SelectorOption[] = [
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
  { id: Genderidentity.Male, name: formatValue(Genderidentity.Male) },
  { id: Genderidentity.Female, name: formatValue(Genderidentity.Female) },
  {
    id: Genderidentity.DeclineToSpecify,
    name: formatValue(Genderidentity.DeclineToSpecify),
  },
  {
    id: Genderidentity.TransgenderFemale,
    name: formatValue(Genderidentity.TransgenderFemale),
  },
  {
    id: Genderidentity.TransgenderMale,
    name: formatValue(Genderidentity.TransgenderMale),
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

export const StepperIcons: { [index: string]: number } = {};

export const PATIENT_REGISTRATION_STEPS: StepLabelType[] = [
  { title: "Patient Information" },
  { title: "Document Verification" },
];

// Breadcrumb links
export const SERVICES_BREAD = (facilityId: string) => {
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
export const IS_DOCTOR_BREAD = { text: DOCTORS_TEXT, link: '' };
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
export const PATIENT_VITAL_BREAD = { text: PATIENT_VITAL_TEXT, link: "" };
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
export const LAB_ORDER_BREAD = { text: LAB_ORDER, link: LAB_ORDER, };
export const AGREEMENTS_BREAD = { text: AGREEMENTS, link: AGREEMENTS_ROUTE, };
export const AGREEMENTS_NEW_BREAD = { text: ADD_AGREEMENT, link: `${AGREEMENTS_ROUTE}/new`, };
export const AGREEMENTS_EDIT_BREAD = { text: EDIT_AGREEMENT, link: "", };

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
  // {
  //   title: "Registration",
  //   value: "3",
  // },
  // {
  //   title: "Messaging",
  //   value: "4",
  // },
  // {
  //   title: "Billing",
  //   value: "5",
  // },
  // {
  //   title: "Clinical",
  //   value: "6",
  // },
  // {
  //   title: "Communicator",
  //   value: "7",
  // },
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
  {
    title: "Care Team",
    value: "11",
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

export const DUMMY_OPTION = {
  id: ADD_PATIENT_MODAL,
  name: ADD_PATIENT_MODAL
}

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

export enum ITEM_MODULE {
  snoMedCode = 'SnoMedCode',
  insurance = 'insurance',
  documentTypes = 'documentTypes',
  icdCodes = 'IcdCodes',
  cptCode = 'CPTCode',

}

export enum TABLE_SELECTOR_MODULES {
  icdCodes = 'IcdCodes',
  cptCode = 'CPTCode',
  hcpcsCode = 'HCPCSCode',
  customCode = 'CustomCode'
}

export const DUMMY_ENCOUNTERS = [
  {
    id: 1,
    serviceName: "Sick Visit",
    scheduleDateTime: "March 16, 2022 at 3:15 PM",
    duration: "50 Minutes",
    doctorName: 'Dr. Jenny Wilson',
    hospitalName: 'Community Hospital'
  },
  {
    id: 2,
    serviceName: "Sick Visit",
    scheduleDateTime: "March 16, 2022 at 3:15 PM",
    duration: "50 Minutes",
    doctorName: 'Dr. Jenny Wilson',
    hospitalName: 'Community Hospital'
  }
];

export enum CARD_LAYOUT_MODAL {
  Allergies = 'Allergies',
  ICDCodes = 'ICDCodes',
}

export enum ATTACHMENT_TITLES {
  Signature = "Signature",
  Agreement = "Agreement",
  LabOrders = "Lab Orders",
  PracticeLogo = "Practice Logo",
  ProfilePicture = "Profile Picture",
  InsuranceCard1 = "Insurance Card 1",
  InsuranceCard2 = "Insurance Card 2",
  ProviderUploads = "Provider Uploads",
  DrivingLicense1 = "Driving License 1",
  DrivingLicense2 = "Driving License 2",
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
  "Practice",
  "Facility",
  "Emergency Access",
  "Provider",
  "Staff",
  "Patient",
  "Appointment",
  "Service",
  "Schedule",
  "Lab Orders",
  "Patient Charting",
  "User",
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

export const APPOINTMENT_SETTINGS_ITEMS = [
  {
    name: CANCELLED_APPOINTMENT,
    link: "/",
    desc: CANCELLED_APPOINTMENT_DESCRIPTION,
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
    icon: PhoneIcon,
    fieldId: uuid(),
    label: "Phone Input",
    type: ElementType.Tel,
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
  { id: 6, name: 6 },
  { id: 4, name: 4 },
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

export const ABNORMAL_FLAG_OPTIONS: SelectorOption[] = [
  { id: AbnormalFlag.None, name: formatValue(AbnormalFlag.None).trim() },
  { id: AbnormalFlag.BelowLowNormal, name: formatValue(AbnormalFlag.BelowLowNormal) },
  { id: AbnormalFlag.AboveHighNormal, name: formatValue(AbnormalFlag.AboveHighNormal) },
  { id: AbnormalFlag.BelowLowerPanicLimit, name: formatValue(AbnormalFlag.BelowLowerPanicLimit) },
  { id: AbnormalFlag.BelowUpperPanicLimit, name: formatValue(AbnormalFlag.BelowUpperPanicLimit) },
  { id: AbnormalFlag.BelowAbsoluteLowOffScale, name: formatValue(AbnormalFlag.BelowAbsoluteLowOffScale) },
  { id: AbnormalFlag.AboveAbsoluteHighOffScale, name: formatValue(AbnormalFlag.AboveAbsoluteHighOffScale) },
  { id: AbnormalFlag.Normal, name: formatValue(AbnormalFlag.Normal) },
  { id: AbnormalFlag.AbnormalAppliedToNonNumericResults, name: formatValue(AbnormalFlag.AbnormalAppliedToNonNumericResults) },
  { id: AbnormalFlag.VeryAbnormalAppliedToNonNumeric, name: formatValue(AbnormalFlag.VeryAbnormalAppliedToNonNumeric) },
  { id: AbnormalFlag.SignificantChangeUp, name: formatValue(AbnormalFlag.SignificantChangeUp) },
  { id: AbnormalFlag.SignificantChangeDown, name: formatValue(AbnormalFlag.SignificantChangeDown) },
  { id: AbnormalFlag.BetterUseWhenDirectionNotRelevant, name: formatValue(AbnormalFlag.BetterUseWhenDirectionNotRelevant) },
  { id: AbnormalFlag.WorstUseWhenDirectionNotRelevant, name: formatValue(AbnormalFlag.WorstUseWhenDirectionNotRelevant) },
  { id: AbnormalFlag.Susceptible, name: formatValue(AbnormalFlag.Susceptible) },
  { id: AbnormalFlag.Resistant, name: formatValue(AbnormalFlag.Resistant) },
  { id: AbnormalFlag.Intermediate, name: formatValue(AbnormalFlag.Intermediate) },
  { id: AbnormalFlag.Moderately, name: formatValue(AbnormalFlag.Moderately) },
  { id: AbnormalFlag.VerySusceptible, name: formatValue(AbnormalFlag.VerySusceptible) }
];

export const COVID_RESULT_OPTIONS: SelectorOption[] = [
  { id: 'Detected', name: 'Detected' },
  { id: 'Not Detected', name: 'Not Detected' },
]

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
  practiceId: {
    name: "",
    id: "",
  },
  isPractice: false,
};

export const getFormInitialValues = () => [{
  id: uuid(),
  name: "tab_1",
  sections: [{
    id: uuid(),
    col: 12,
    name: "Section",
    fields: [],
  }]
}
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

export const SPECIMEN_TYPE_INITIAL_VALUES: SpecimenTypeOption = {
  specimenType: { id: '', name: '' },
  collectionDate: moment().toString(),
  specimenNotes: '',
  collectionTime: moment().format('HH:mm:ss')
};

export const TEST_FIELD_INITIAL_VALUES: TestOption = {
  test: { id: '', name: '' },
  testDate: moment().toString(),
  testNotes: '',
  testTime: moment().format('HH:mm:ss'),
};

export const ORDERS_RESULT_INITIAL_VALUES_1: LabOrdersResultOption1 = {
  normalRange: '',
  normalRangeUnits: '',
  resultUnits: '',
  resultValue: '',
  abnormalFlag: { id: '', name: '' },
};

export const ORDERS_RESULT_INITIAL_VALUES_2: LabOrdersResultOption2 = {
  resultValue: { id: '', name: '' },
};

export const CHECK_IN_STEPS = [
  CHECK_IN,
  PATIENT_INFO,
  INSURANCE,
  CHART_TEXT,
  // VITALS_TEXT,
  LAB_ORDERS,
  BILLING_TEXT,
];

export const ADD_INSURANCE_STEPS = [
  INSURANCE,
  POLICY_HOLDER,
  INSURANCE_CARD
];

export const LAB_ORDER_STEPS = [
  LAB_ORDER, PROVIDER_DETAILS, PAYMENT
];

export const FacilityMenuNav = [
  {
    title: FACILITY_INFO,
    linkTo: FACILITY_INFO_ROUTE,
  },
  {
    title: BILLING_PROFILE,
    linkTo: BILLING_PROFILE_ROUTE,
  },
  {
    title: FACILITY_LOCATION,
    linkTo: FACILITY_LOCATION_ROUTE,
  },
  {
    title: BUSINESS_HOURS,
    linkTo: FACILITY_SCHEDULE_ROUTE,
  },
];

export const RegisterPatientMenuNav = [
  {
    title: IDENTIFICATION,
  },
  {
    title: DEMOGRAPHICS,
  },
  {
    title: CONTACT_INFORMATION,
  },
  {
    title: PRIVACY,
  },
  {
    title: EMERGENCY_CONTACT,
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
  removePermission = "removePermission",
  updateLabTestObservation = "updateLabTestObservation",
  findAllReactions = "findAllReactions",
  GetPermission = "GetPermission",
  findAllPatientVitals = "findAllPatientVitals",
  getPatientAllergy = "getPatientAllergy",
  addPatientAllergy = "addPatientAllergy",
  findAllLabTest = "findAllLabTest",
  findAllPatientAllergies = "findAllPatientAllergies",
  assignPermissionToRole = "assignPermissionToRole",
  getPatientVital = "getPatientVital",
  createLabTestObservation = "createLabTestObservation",
  emergencyAccess = "emergencyAccess",
  findAllPermissions = "findAllPermissions",
  createPermission = "createPermission",
  updatePatientAllergy = "updatePatientAllergy",
  getAppointments = "getAppointments",
  createLabTest = "createLabTest",
  removeLabTest = "removeLabTest",
  updatePermission = "updatePermission",
  removeLabTestObservation = "removeLabTestObservation",
  updateLabTest = "updateLabTest",
  removePatientVital = "removePatientVital",
  fetchAllPatients = "fetchAllPatients",
  findPatientAttachments = "findPatientAttachments",
  removePatientAllergy = "removePatientAllergy",
  getLabTest = "getLabTest",
  findAllAllergies = "findAllAllergies",
  updatePatientVital = "updatePatientVital",
  addPatientVital = "addPatientVital"
}

export const USER_MENU_ITEMS = [
  {
    name: PROVIDER_MANAGEMENT,
    link: DOCTORS_ROUTE,
    desc: PROVIDER_MANAGEMENT_DESCRIPTION,
    permission: USER_PERMISSIONS.findAllDoctor,
  },
  {
    name: STAFF_MANAGEMENT,
    link: STAFF_ROUTE,
    desc: STAFF_MANAGEMENT_DESCRIPTION,
    permission: USER_PERMISSIONS.findAllStaff,
  }
];

export const PRACTICE_SETTINGS_ITEMS = [
  {
    name: PRACTICE_DETAILS_TEXT,
    link: PRACTICE_DETAILS_ROUTE,
    desc: PRACTICE_DETAILS_DESCRIPTION,
    permission: USER_PERMISSIONS.findAllPractices,
  },
  {
    name: FACILITY_MANAGEMENT,
    link: FACILITIES_ROUTE,
    desc: FACILITY_MANAGEMENT_DESCRIPTION,
    permission: USER_PERMISSIONS.findAllFacility,
  },
  {
    name: ROLES_PERMISSIONS,
    link: ROLES_ROUTE,
    desc: ROLES_PERMISSIONS_DESCRIPTION,
    permission: USER_PERMISSIONS.getAllRoles,
  },
  {
    name: EMERGENCY_ACCESS,
    link: EMERGENCY_ACCESS_ROUTE,
    desc: EMERGENCY_ACCESS_DESCRIPTION,
    permission: USER_PERMISSIONS.emergencyAccess,
  },
];

export const TELEHEALTH_URL = 'https://doxy.me'

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

export const FORM_BUILDER_ADD_FIELDS_TABS = [
  {
    title: "Components",
    value: "1",
  },
  {
    title: "Fields",
    value: "2",
  },
]

export const ROLES_TABS = [
  {
    title: "System Roles",
    value: "1",
  },
  {
    title: "Custom Roles",
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
];

export const MAPPED_SMOKING_STATUS: SelectorOption[] = [
  { id: SmokingStatus.SmokerCurrentStatusUnknown, name: formatValue(SmokingStatus.SmokerCurrentStatusUnknown) },
  { id: SmokingStatus.CurrentEverydaySmoker, name: formatValue(SmokingStatus.CurrentEverydaySmoker) },
  { id: SmokingStatus.CurrentSomedaySmoker, name: formatValue(SmokingStatus.CurrentSomedaySmoker) },
  { id: SmokingStatus.FormerSmoker, name: formatValue(SmokingStatus.FormerSmoker) },
  { id: SmokingStatus.NeverSmoked, name: formatValue(SmokingStatus.NeverSmoked) },
  { id: SmokingStatus.UnknownIfEverSmoked, name: formatValue(SmokingStatus.UnknownIfEverSmoked) },
];

export const MAPPED_DOCTOR_PATIENT_RELATION: SelectorOption[] = [
  {
    name: formatValue(DoctorPatientRelationType.PrimaryProvider),
    id: DoctorPatientRelationType.PrimaryProvider,
  },
  {
    name: formatValue(DoctorPatientRelationType.BackupProvider),
    id: DoctorPatientRelationType.BackupProvider,
  },
  {
    name: formatValue(DoctorPatientRelationType.PreferredProvider),
    id: DoctorPatientRelationType.PreferredProvider,
  },
  {
    name: formatValue(DoctorPatientRelationType.ReferringProvider),
    id: DoctorPatientRelationType.ReferringProvider,
  },
  {
    name: formatValue(DoctorPatientRelationType.OrderingProvider),
    id: DoctorPatientRelationType.OrderingProvider,
  },
  {
    name: formatValue(DoctorPatientRelationType.OtherProvider),
    id: DoctorPatientRelationType.OtherProvider,
  },
]

export const PATIENT_HEIGHT_UNITS = [
  { id: UnitType.Inch, name: IN_TEXT },
  { id: UnitType.Centimeter, name: CM_TEXT },
]

export const PATIENT_WEIGHT_UNITS = [
  { id: WeightType.Kg, name: KG_TEXT },
  { id: WeightType.Pound, name: LB_TEXT },
  { id: WeightType.PoundOunce, name: OZ_TEXT },
]

export const HEAD_CIRCUMFERENCE_UNITS = [
  { id: HeadCircumferenceType.Inch, name: IN_TEXT },
  { id: HeadCircumferenceType.Centimeter, name: CM_TEXT },
]

export const FEVER_UNITS = [
  { id: TempUnitType.DegF, name: formatValue(TempUnitType.DegF) },
  { id: TempUnitType.DegC, name: formatValue(TempUnitType.DegC) },
]

export const MAPPED_AUTO_LOGOUT = [
  { id: "0", name: '30 Minutes', time: 1800 * 1000 },
  { id: "1", name: '1 Hour', time: 3600 * 1000 },
  { id: "2", name: '90 Minutes', time: 5400 * 1000 },
  { id: "3", name: '6 Hours', time: 21600 * 1000 },
  { id: "4", name: '12 Hours', time: 43200 * 1000 },
  { id: "5", name: '24 Hours', time: 86400 * 1000 },
  { id: "6", name: '2 Days', time: 172800 * 1000 },
  { id: "7", name: 'Remove Lock Time', time: 604800 * 1000 },
]

export const EMERGENCY_LOG_LIST = [
  {
    shortName: 'AW',
    fullName: "Andrew Williams",
    hospitalName: "National Hospital",
    activatedDate: '24/2/2022',
    imageUrl: EMERGENCY_LOG_WILLIAMS
  },
  {
    shortName: 'OM',
    fullName: "Obaid McCoy",
    hospitalName: "Horizon Eye Care and Medical Center",
    activatedDate: '17/10/2022',
    imageUrl: EMERGENCY_LOG_OBD
  },
  {
    shortName: 'MP',
    fullName: "Micheal Phelps",
    hospitalName: "City Medical Center",
    activatedDate: '2/6/2022',
    imageUrl: EMERGENCY_LOG_PHLEPS
  },
  {
    shortName: 'ND',
    fullName: "Novac Dominic",
    hospitalName: "National Hospital",
    activatedDate: '30/2/2022',
    imageUrl: ''
  },
]

export const RECENT_ACTIVITY_LIST = [
  {
    shortName: 'AW',
    fullName: "Andrew Williams",
    hospitalName: "National Hospital",
    activatedDate: '24/2/2022'
  },
  {
    shortName: 'OM',
    fullName: "Obaid McCoy",
    hospitalName: "Horizon Eye Care and Medical Center",
    activatedDate: '17/10/2022'
  },
  {
    shortName: 'MP',
    fullName: "Micheal Phelps",
    hospitalName: "City Medical Center",
    activatedDate: '2/6/2022'
  },
  {
    shortName: 'ND',
    fullName: "Novac Dominic",
    hospitalName: "National Hospital",
    activatedDate: '30/2/2022'
  },
]

export enum VITAL_LABELS {
  createdAt = "",
  pulseRate = 'Pulse (bpm)',
  respiratoryRate = 'Respiratory Rate (rpm)',
  bloodPressure = 'Blood Pressure (mmHg)',
  oxygenSaturation = 'Oxygen Saturation (%)',
  PatientHeight = 'Height',
  PatientWeight = 'Weight',
  PatientBMI = 'BMI (kg/m2)',
  PainRange = 'Pain (1-10)',
  smokingStatus = 'Smoking Status',
  patientHeadCircumference = 'Head Circumference',
  patientTemperature = 'Temperature',
}

export const UPCOMING_APPOINTMENT_LIST = [
  {
    fullName: 'Andrew Williams',
    visitType: "Sick Visit",
    imageUrl: EMERGENCY_LOG_WILLIAMS,
    shortName: 'AW',
    appointmentTime: '11:00 AM'
  },
  {
    fullName: 'Arlene McCoy',
    visitType: "Ortho Check up",
    imageUrl: EMERGENCY_LOG_OBD,
    shortName: 'AM',
    appointmentTime: '11:15 AM'
  },
  {
    fullName: 'Marvin McKinney',
    visitType: "Endoscopy",
    imageUrl: EMERGENCY_LOG_PHLEPS,
    shortName: 'MM',
    appointmentTime: '11:30 AM'
  },
  {
    fullName: 'Darlene Robertson',
    visitType: "CT Scan",
    imageUrl: '',
    shortName: 'DR',
    appointmentTime: '12:00 PM'
  },
  {
    fullName: 'Bessie Cooper',
    visitType: "Sick Visit",
    imageUrl: EMERGENCY_LOG_OBD,
    shortName: 'BC',
    appointmentTime: '12:15 PM'
  },
  {
    fullName: 'Cameron Williamson',
    visitType: "MRI",
    imageUrl: EMERGENCY_LOG_WILLIAMS,
    shortName: 'CW',
    appointmentTime: '12:30 PM'
  },
]

export const ADDED_PATIENTS_LIST = [
  {
    fullName: 'Andrew Williams',
    imageUrl: EMERGENCY_LOG_WILLIAMS,
    shortName: 'AW',
    dob: '20/02/1995'
  },
  {
    fullName: 'Arlene McCoy',
    imageUrl: EMERGENCY_LOG_OBD,
    shortName: 'AW',
    dob: '2/4/1992'
  },
  {
    fullName: 'Marvin McKinney',
    imageUrl: '',
    shortName: 'AW',
    dob: '16/05/1989'
  },
  {
    fullName: 'Zayn Wyatt',
    imageUrl: EMERGENCY_LOG_PHLEPS,
    shortName: 'AW',
    dob: '04/02/1966'
  },
  {
    fullName: 'Bessie Cooper',
    imageUrl: EMERGENCY_LOG_WILLIAMS,
    shortName: 'AW',
    dob: '19/10/2001'
  },
]

export const ACH_PAYMENT_TABS = [
  {
    title: "Personal",
    value: "personal",
  },
  {
    title: "Business",
    value: "business",
  }
];

export const ACH_PAYMENT_ACCOUNT_TYPE_ENUMS = [
  {
    name: "Checking",
    id: "checking",
  },
  {
    name: "Savings",
    id: "savings",
  }
];

export const INITIAL_COPAY_VALUE = {
  copayType: setRecord('', ''),
  amount: ''
}

export const MAPPED_REGIONS: SelectorOption[] = states.map(
  ({ name, abbreviation }) => ({ id: abbreviation, name: `${name} - ${abbreviation}` })
);

export const areaChartOne = {
  credits: { enabled: false },
  tooltip: { enabled: false },
  chart: {
    type: 'area',
    styledMode: false,
    renderTo: 'container',
    backgroundColor: "#ffffff",

  },
  accessibility: {
    description: 'Image description: An area chart compares the nuclear stockpiles of the USA and the USSR/Russia between 1945 and 2017. The number of nuclear weapons is plotted on the Y-axis and the years on the X-axis. The chart is interactive, and the year-on-year stockpile levels can be traced for each country. The US has a stockpile of 6 nuclear weapons at the dawn of the nuclear age in 1945. This number has gradually increased to 369 by 1950 when the USSR enters the arms race with 6 weapons. At this point, the US starts to rapidly build its stockpile culminating in 32,040 warheads by 1966 compared to the USSR’s 7,089. From this peak in 1966, the US stockpile gradually decreases as the USSR’s stockpile expands. By 1978 the USSR has closed the nuclear gap at 25,393. The USSR stockpile continues to grow until it reaches a peak of 45,000 in 1986 compared to the US arsenal of 24,401. From 1986, the nuclear stockpiles of both countries start to fall. By 2000, the numbers have fallen to 10,577 and 21,000 for the US and Russia, respectively. The decreases continue until 2017 at which point the US holds 4,018 weapons compared to Russia’s 4,500.'
  },
  title: {
    text: 'Blood Pressure',
    style: { "color": "#464E5F", "fontSize": "24px", "fontWeight": "600", "display": "none" },
    margin: 100,
    align: 'right'
  },
  subtitle: {
    text: 'Last Reading: May 2, 2022',
    style: { "color": "gray", "fontSize": "14px", "display": "none" },
    align: 'right'
  },
  xAxis: {
    allowDecimals: false,
    accessibility: {
      rangeDescription: 'Range: 1940 to 2017.'
    }
  },
  yAxis: {
    className: 'highcharts-color-0',
    title: {
      text: 'Nuclear weapon states'
    },
  },
  // tooltip: {
  //   pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}',
  //   style: { 'zIndex' :'1' },
  // },
  plotOptions: {
    area: {
      marker: {
        enabled: false,
        symbol: 'circle',
        radius: 2,
        states: {
          hover: {
            enabled: true
          }
        },
      },
      fillColor: '#F6E4E5'
    },
    column: {
      pointPadding: 0.4,
      borderWidth: 0,
      borderRadius: 4,
    }

  },
  series: [{
    name: 'USA',
    color: '#CA6B6E',
    data: [
      20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
      26662, 26956, 27912, 28999, 28965, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
    ]
  }]
}

export const areaChartTwo = {
  credits: { enabled: false },
  tooltip: { enabled: false },
  chart: {
    type: 'area',
    styledMode: false,
    backgroundColor: "#ffffff",
    marginBottom: 0,
  },
  accessibility: {
    description: 'Image description: An area chart compares the nuclear stockpiles of the USA and the USSR/Russia between 1945 and 2017. The number of nuclear weapons is plotted on the Y-axis and the years on the X-axis. The chart is interactive, and the year-on-year stockpile levels can be traced for each country. The US has a stockpile of 6 nuclear weapons at the dawn of the nuclear age in 1945. This number has gradually increased to 369 by 1950 when the USSR enters the arms race with 6 weapons. At this point, the US starts to rapidly build its stockpile culminating in 32,040 warheads by 1966 compared to the USSR’s 7,089. From this peak in 1966, the US stockpile gradually decreases as the USSR’s stockpile expands. By 1978 the USSR has closed the nuclear gap at 25,393. The USSR stockpile continues to grow until it reaches a peak of 45,000 in 1986 compared to the US arsenal of 24,401. From 1986, the nuclear stockpiles of both countries start to fall. By 2000, the numbers have fallen to 10,577 and 21,000 for the US and Russia, respectively. The decreases continue until 2017 at which point the US holds 4,018 weapons compared to Russia’s 4,500.'
  },
  title: {
    text: 'Heart Rate',
    style: { "color": "#464E5F", "fontSize": "24px", "fontWeight": "600", "display": "none" },
    margin: 100,
    align: 'right'
  },
  subtitle: {
    text: 'Last Reading: May 2, 2022',
    style: { "color": "gray", "fontSize": "14px", "display": "none" },
    align: 'right'
  },
  xAxis: {
    allowDecimals: false,
    accessibility: {
      rangeDescription: 'Range: 1940 to 2017.'
    }
  },
  yAxis: {
    className: 'highcharts-color-0',
    title: {
      text: 'Nuclear weapon states'
    },
  },
  // tooltip: {
  //   pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
  // },
  plotOptions: {
    area: {
      marker: {
        enabled: false,
        symbol: 'circle',
        radius: 2,
        states: {
          hover: {
            enabled: true
          }
        },
      },
      fillColor: '#C9F7F5'
    },
    column: {
      pointPadding: 0.4,
      borderWidth: 0,
      borderRadius: 4,
    }

  },
  series: [{
    color: '#1BC5BD',
    name: 'USSR/Russia',
    data: [
      20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
      26662, 26956, 27912, 28999, 28965, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
    ]
  }]
}

export const PATIENT_CHARTING_TABS = [
  {
    icon: VitalsIcon,
    title: "Vitals",
    value: "1",
  },
  {
    icon: ProblemsIcon,
    title: "Problems",
    value: "2",
  },
  {
    icon: AllergiesIcon,
    title: "Allergies",
    value: "3",
  }
]

export const VITALS_DUMMY_DATA = [
  {
    value: "124",
    name: "Pulse (bpm)",
  },
  {
    value: "120 / 70",
    name: "Blood Pressure (mmHg)",
  },
  {
    value: "68",
    name: "Oxygen Saturation (%)",
  },
  {
    value: "40",
    name: "Respiratory Rate (rpm)",
  },
  {
    value: "98",
    name: "Fever (°C)",
  },
  {
    value: "9",
    name: "Pain (1-10)",
  },
  {
    value: "69.60",
    name: "Height (in)",
  },
  {
    value: "149.91",
    name: "Weight (lbs)",
  },
  {
    value: "21.76",
    name: "BMI (kg/m2)",
  },
  {
    value: "25",
    name: "Head Circumference (in)",
  },
]

export const PROBLEMS_DUMMY_DATA = [
  {
    name: "Functional Heartburn",
    value: "Moderate",
    status: "Active"
  },
  {
    name: "Pain in lower limb (left)",
    value: "Mild",
    status: "Active"
  },
  {
    name: "High blood pressure",
    value: "Acute",
    status: "Active"
  },
  {
    name: "Abnormal heartbeat",
    value: "Acute",
    status: "Historical"
  },
]

export const ALLERGIES_DUMMY_DATA = [
  {
    name: "peanut",
    value: "Nausea, Mild",
    status: "Active"
  },
  {
    name: "Pollen",
    value: "Breathing Problem, Mild",
    status: "Active"
  },
]

export enum FormBuilderApiSelector {
  SERVICE_SELECT = 'serviceSelect',
  SERVICE_SLOT = 'serviceSlot',
  FACILITY_PROVIDERS = 'facilityProviders',
  PAYMENT_TYPE = 'paymentType',
  PRACTICE_FACILITIES = 'practiceFacilities',
  PATIENT_CONSENT = 'patientConsent',
  TERMS_CONDITIONS = 'termsConditions'
}

export enum FormBuilderPaymentTypes {
  INSURANCE = 'insurance',
  NO_INSURANCE = 'no_insurance',
  CONTRACT = 'contract',
  INTERNATIONAL_TRAVELER = 'international_traveler',
}

export const AGREEMENTS_TABLE_DUMMY_DATA = [
  {
    name: 'Submit Website Form',
    date: '9/4/12',
  },
  {
    name: 'Community Meet Up Form',
    date: '7/11/19',
  },
  {
    name: 'Referral Form',
    date: '6/19/14',
  },
  {
    name: 'Neighborhood Recommendations Form',
    date: '12/10/13',
  },
  {
    name: 'Submit Website Form',
    date: '8/2/19',
  },
  {
    name: 'Preliminary Vacation Itinerary',
    date: '7/18/17',
  },
  {
    name: 'School Withdrawal Survey Form',
    date: '5/7/16',
  },
  {
    name: 'Clone of Cami Fit Form',
    date: '1/15/12',
  },
]
