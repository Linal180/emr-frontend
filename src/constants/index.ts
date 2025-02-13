//packages block
import { Phone as PhoneIcon } from '@material-ui/icons';
import moment from "moment-timezone";
import states from "states-us";
import { v4 as uuid } from "uuid";
// graphql and interfaces block
import {
  AllergiesIcon, AssessmentPlanIcon, CheckboxIcon, DateIcon, EmailIcon, FileInputIcon, HistoryIcon, LabOrderIcon, MedicationIcon,
  NumberIcon, ProblemsIcon, RadioGroupIcon, ReasonForVisit, SelectIcon, TextAreaIcon, TextIcon, TriageIcon, VaccineIcon, VitalsIcon
} from "../assets/svgs";
import {
  AbnormalFlag, AllergySeverity, AppointmentStatus, Communicationtype, CopayType, DoctorPatientRelationType, ElementType,
  Ethnicity, FieldOptionsInputType, FormType, Gender, Genderidentity, HeadCircumferenceType, Homebound, LabTestStatus,
  Maritialstatus, OnsetDateType, OrderOfBenefitType, OtherDateType, PatientPaymentType, PaymentType,
  PolicyHolderRelationshipType, Policy_Holder_Gender_Identity, PracticeType, PricingProductType, Pronouns, Race,
  RelationshipType, ServiceCode, Sexualorientation, SmokingStatus, Speciality, TemplateType, TempUnitType, UnitType, WeightType
} from "../generated/graphql";
import {
  ColumnTypes, FormBuilderFormInitial,
  FormInitialType, ItemsTypes, LabOrdersResultOption1, LabOrdersResultOption2, SelectOptions, SelectorOption,
  SpecimenTypeOption, StepLabelType, TestOption, UpFrontPaymentTypeProps
} from "../interfacesTypes";
import {
  formatValue, getFormattedDate, getStandardTime, getTemplateLabel, mapEnum, mapEnumWithCode, setRecord, sortingValue
} from "../utils";

// regex
export const TID_REGEX = /^\d{9}$/;
export const NPI_REGEX = /^\d{10}$/;
export const NUMBER_REGEX = /^[0-9]+$/;
export const NO_SPACE_REGEX = /^[^\s]+$/;
export const NON_EMPTY_SPACE_REGEX = /^(?!\s*$).+/g
export const ALL_ZEROS_REGEX = /^((?!^[0]+$|^$).)*$/g
export const EIN_REGEX = /^\d{2}-?\d{7}$/;
export const STRING_REGEX = /^[A-Za-z\s]+$/;
export const REVENUE_CODE_REGEX = /^\d{4}$/;
export const SUFFIX_REGEX = /^[.A-Za-z\s]+$/;
export const UPIN_REGEX = /^[A-Za-z0-9]{6}$/;
export const CLIA_REGEX = /^[A-Za-z0-9]{10}$/;
export const SSN_REGEX = /^\d{3}-\d{2}-\d{4}$/;
export const FACILITY_CODE_REGEX = /^[A-Z]{2,5}$/;
export const ZIP_REGEX = /^[0-9]{5}(?:-[0-9]{4})?$/;
export const ADDRESS_REGEX = /^[#.0-9a-zA-Z\s,-]+$/;
export const TAXONOMY_CODE_REGEX = /^[A-Z0-9]{9}X$/;
export const US_ROUTING_NUMBER_REGEX = /^[0-9]{9}$/g
export const US_BANK_ACCOUNT_REGEX = /^[0-9]{7,14}$/g
export const NO_START_SPACE_REGEX = /^([a-zA-Z0-9]+\s?)/;
export const NO_SPECIAL_CHAR_REGEX = /^[A-Za-z0-9\s]+$/;
export const ALPHABETS_REGEX = /^([A-Za-z]+\s)*[A-Za-z]+$/;
export const NO_WHITE_SPACE_REGEX = /^(?!\s)[a-zA-Z0-9_\s-]*$/;
export const NO_SPACE_AT_BOTH_ENDS_REGEX = /^[^\s]+(\s+[^\s]+)*$/;
export const MAMMOGRAPHY_CERT_NUMBER_REGEX = /^[A-Z]{3}-[A-Z]{2}-\d{6}$/;
export const BANK_ACCOUNT_REGEX = /^([0-9]{11})|([0-9]{2}-[0-9]{3}-[0-9]{6})$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;
export const NDC_REGEX = /^(?:\d{4}-\d{4}-\d{2}|\d{5}-(?:\d{3}-\d{2}|\d{4}-\d{1,2}))$/;
export const MVX_CODE_REGEX = /^([A-Z]{2}|[A-Z]{3})$/;
// export const ONLY_NUMBERS_REGEX = /^[0-9]+$/;
// export const NUMBERS_WITHOUT_DDECIMAL_REGEX = /(?<![.\d])\d+(?![.\d])/g;

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
  Biller = "biller",
}

export enum APPOINTMENT_PAYMENT_TYPE {
  CASH = 'cash',
  CARD = 'card'
}


// Blood Pressure Ranges
export enum BLOOD_PRESSURE_RANGES {
  Normal = "Normal",
  Abnormal = "Abnormal",
}

// Heart Rate Ranges
export enum Heart_RATE_RANGES {
  Abnormal = "Abnormal",
  Normal = "Normal",
}

// constants
export const BULK_UPDATE_TEXT = 'Bulk Update'
export const DIED_TEXT = 'Died'
export const NDC_FORMAT = 'NNNNN/NNNN-NNN/NNNN-NN'
export const ICD_TEXT = 'International Classification of Diseases'
export const DISEASE_TEXT = 'Disease'
export const ONSET_AGE_TEXT = 'Onset Age'
export const RELATIVE = 'Relative'
export const FAMILY_RELATIVE = 'Family Relative'
export const ADD_FAMILY_HISTORY = 'Add Family History'
export const LAST_FOUR_DIGIT = 'Card Last Four Digit'
export const SELF_CHECK_IN = 'Self Check in'
export const CHECK_IN_AT_TEXT = 'Checked in at'
export const TAKE_AGAIN = 'Take again'
export const TAKE = 'Take'
export const DOWNLOAD_TEXT = 'Download'
export const SELF_PAY = 'Self Pay'
export const NO_ERROR_FOUND = 'No error found'
export const REMOVE_FACILITY_FIELD = 'Please remove facility field. As you are making facility form'
export const FUTURE_DATE = 'Disable Past Date'
export const PAST_DATE = 'Disable Future Date'
export const ASSESSMENT_PLAN = 'Assessment & Plan'
export const FOLLOWUP = 'Follow up'
export const STATUS_NAME = 'Status Name';
export const REQUIRED = 'Required';
export const FILE_REQUIRED = 'Please select at least one file';
export const AGREEMENT_BODY_REQUIRED = 'Agreement body is a required field'
export const DESCRIPTION_TYPE = 'Description Type';
export const PUBLIC_AGREEMENTS_PAGE_LIMIT = 25;
export const GRANTED_TEXT = 'Granted';
export const CONTRACT_NO = 'Contract No';
export const ORGANIZATION_NAME = 'Organization Name';
export const FACILITY_FORM = 'Facility Form';
export const PRACTICE_FORM = 'Practice Form';
export const PRE_DEFINED_COMPONENT_PAGE_LIMIT = 25;
export const ACH_PAYMENT_AUTHORITY = 'I authorize Braintree to debit my bank account on my behalf.'
export const LOCALITY = 'Locality'
export const AUTHORITY = 'Authority'
export const COMPANY_NAME = 'Insurance Company Name'
export const CHECKED_IN_SUCCESSFULLY = "Checked in successfully!";
export const ROUTING_NUMBER = 'Routing Number'
export const ACCOUNT_TYPE = 'Account Type'
export const PAY_VIA_ACH = 'Pay via ACH';
export const ADD_CPT_AND_ICD_CODES = `Please add CPT & ICD Codes`
export const PATIENT_NOTE_SUCCESS_MESSAGE = 'Patient Notes is updated successfully'
export const PATIENT_NOTE_ERROR_MESSAGE = 'Patient Notes is not updated'
export const PATIENT_NO = 'Patient No'
export const FINAL_REPORT = 'Final Report'
export const PINNED_NOTES = "Pinned Notes";
export const AUTO_OPEN_NOTES = "Auto Open Notes";
export const SUPER_ADMIN = "super-admin";
export const SUPER_ADMIN_TEXT = "Super Admin";
export const AUTO_LOGOUT_ERROR = "Auto logout time is not updated";
export const ITEMS_ID = 'ITEMS'
export const PRE_DEFINED = 'PRE-DEFINED'
export const DASHES = '--'
export const SLASH_IN_DASHES = '-- / --'
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
export const VERIFY_ADDRESS = "Verify address";
export const DISMISS = "Dismiss";
export const UPDATE_MEDIA = "Update media";
export const EDIT_MEDIA = "Edit Media";
export const ADVANCED_SEARCH = "Advanced Search";
export const LABEL = "Label";
export const REGEX_LABEL = "Regular Expression";
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
export const REASON_FOR_VISIT = "Reason For Visit";
export const CHIEF_COMPLAINT = "Chief Complaint";
export const ADD_CHIEF_COMPLAINT = "Chief complaint added successfully";
export const HISTORY_OF_PATIENT_ILLNESS = "History of Patient Illness";
export const CSS_CLASSES = "CSS Classes";
export const PLACEHOLDER = "Placeholder";
export const DROP_ITEM_TEXT = "Drop items here";
export const SELECT_COLUMN_TEXT = "Select a column";
export const YES_TEXT = "Yes";
export const NO_TEXT = "No";
export const CANCEL_TEXT = "Cancel";
export const REQUIRED_TEXT = "Required?";
export const CREATE_FORM_BUILDER = "Form is created successfully.";
export const CREATE_CLAIM_STATUS = "Create Claim Status";
export const UPDATE_CLAIM_STATUS = "Update Claim Status";
export const CREATE_FORM_TEMPLATE = "Form Template is created successfully.";
export const DELETE_FORM_DESCRIPTION = "Confirm to delete form";
export const DELETE_AGREEMENT_DESCRIPTION = "Confirm to delete agreement";
export const DELETE_CLAIM_STATUS_DESCRIPTION = "Confirm to delete claim status";
export const CANT_DELETE_FORM = "Form can't be deleted.";
export const FORM_NOT_FOUND = "Form not found!";
export const FORM_UPDATED = "Form updated successfully!";
export const PUBLIC_FORM_LINK = "Public form preview link";
export const FORM_FAIL_DESCRIPTION = "Public form preview link";
export const EMPTY_OPTION = { id: "", name: "--" };
export const EMPTY_OPTION_WITHOUT_DASHES = { id: "", name: "" };
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
export const DRAW_SIGNATURE = "Please draw your signature"
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
export const SAVE_AND_NEXT = "Save & Next";
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
export const START_CHECK_IN = "Start Check In";
export const DONE_CHECK_IN = "Done with Check In";
export const TO_INTAKE = "To Intake";
export const TO_EXAM = "To Exam";
export const TO_CHECKOUT = "To Checkout";
export const DONE_INTAKE = "Done with Intake";
export const REASON_VISIT = "Reason For Visit";
export const TELEHEALTH = "Telehealth";
export const INSURANCES = "Insurances";
export const START_TELEHEALTH = "Start Telehealth";
export const LINK_COPIED = "Link Copied";
export const BILLING_PROFILE = "Billing Profile";
export const GO_TO_PROFILE = "Go To Profile";
export const PAYABLE_ADDRESS = "Payable Address";
export const BILLING_IDENTIFIER = "Billing Identifier";
export const DOD = "Date of Death";
export const ADDRESS_LINE_1 = "ADDRESS LINE 1";
export const ADDRESS_LINE_2 = "ADDRESS LINE 2";
export const CONTACT_BY = "CONTACT_BY";
export const OFFICE_EXTENSION = "Office Extension";
export const FAMILY_INFORMATION = "Family Information";
export const MEDICATIONS = "Medications";
export const START_STOP = "Start/Stop";
export const ASSOCIATED_DX = "Associated DX";
export const NO_HISTORICAL_DIAGNOSIS = "No historical diagnosis";
export const PATIENTS_MOTHERS_MAIDEN_NAME = "Patient's Mother's Maiden Name";
export const DRUG_ALLERGIES = "Drug Allergies";
export const ONSET = "Onset";
export const SEVERITY_REACTIONS = "Severity/Reactions";
export const FOOD_ALLERGIES = "Food Allergies";
export const ENVIRONMENTAL_ALLERGIES = "Environmental Allergies";
export const NO_DRUG_ALLERGIES_RECORDED = "No Drug Allergies Recorded";
export const NO_FOOD_ALLERGIES_RECORDED = "No Food Allergies Recorded";
export const NO_SURGICAL_PROCEDURE_RECORDED = "No Surgical Procedure Recorded";
export const NO_ENVIRONMENTAL_ALLERGIES_RECORDED = "No Environmental Allergies Recorded";
export const CURRENT = "Current";
export const ACUITY = "Acuity";
export const START = "Start";
export const STOP = "Stop";
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
export const HCFA_DESC = "HCFA Box 10:";
// export const SMS_PERMISSIONS = "Is it okay for us to leave a SMS/Txt messages";
export const CONSENT_TO_MESSAGES = "Consent To messages";
export const CONSENT_TO_MESSAGES_DESCRIPTION = "Disable all SMS/Txt messages for this user";
export const PHONE_EMAIL_PERMISSION = 'May we phone, email, or send a text to you to confirm appointments?'
export const CELL_PHONE_PERMISSION = 'May we leave a message on your answering machine at home or on your cell phone?'
export const MEDICAL_PERMISSION = 'May we discuss your medical condition with any member of your family?'
export const RESULT_CONSENT = 'I want to receive information to access my results and health data online through patient portal.'
export const IMMUNIZATION_CONSENT = 'I consent to share my immunization record with a state registry.'
export const MEDICATION_HISTORY_CONSENT = 'I consent to the clinic pulling my medication history to best treat me.'
export const PERMISSIONS_TEXT = 'Permissions: I give permissions for the following:'
export const CONSENTS = 'Consents'
export const ADD_NEW_TEXT = "Add New";
export const EDIT_STAFF = "Edit Staff";
export const CREATE_DOCTOR = "Create Provider";
export const USER_DETAILS_TEXT = "User Details";
export const PRACTICE_ADMIN_DETAILS_TEXT = "Practice Admin Details";
export const PRACTICE_USER_TEXT = "Practice User";
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
export const SPECIMEN = 'SPECIMEN'
export const RELEASE_BILLING_INFO_PERMISSIONS =
  "Can we release medical and billing information to this contact?";
export const APPOINTMENT_CONFIRMATION_PERMISSIONS =
  "May we phone, or send a email to you to confirm appointments?";
export const ADD_DOCTOR = "Add Provider";
export const ADD_RESULT = "Add Result";
export const SYNC_RESULTS = "Sync Results";
export const VIEW_STAFF = "View Staff";
export const EDIT_DOCTOR = "Edit Provider";
export const ADD_PATIENT = "Add Patient";
export const ADD_COPAY = "Add Copay";
export const ARE_YOU_SURE = "Are you sure?";
export const ADD_PRACTICE = "Add practice";
export const EDIT_PRACTICE = "Edit practice";
export const TIME_ZONE_TEXT = "Time Zone";
export const EDIT_PATIENT = "Edit Patient";
export const UPDATE_STAFF = "Update Staff";
export const CREATE_COPAY = "Create Copay";
export const SET_TIME_ZONE = "Set Time Zone";
export const UPDATE_DOCTOR = "Update Provider";
export const UPDATE_PATIENT = "Update Patient";
export const CREATE_PATIENT = "Create Patient";
export const CREATE_INVOICE = "Create Invoice";
export const UPDATE_FACILITY = "Update Facility";
export const ADD_APPOINTMENT = "Add Appointment";
export const ADD_PATIENT_MODAL = "Add New Patient";
export const EDIT_APPOINTMENT = "Edit Appointment";
export const USERS_MANAGEMENT = "Users Management";
export const UNCOVERED_AMOUNT = "Pt. Uncovered Amt";
export const PRACTICE_SETTINGS = "Practice Settings";
export const ADD_MEDIA = "Add Media";
export const PAID = "Paid";
export const UNPAID = "Unpaid";
export const INVOICE = "Invoice";
export const INVOICE_NO = "Invoice No";
export const CONTACT = "Contact";
export const REACTION = "Reaction";
export const PROVIDER = "Provider";
export const SEVERITY = "Severity";
export const INVENTORY = "Inventory";
export const RESOURCE = "Resource";
export const RENDERING = "Rendering";
export const ONSET_DATE = "Onset Date";
export const VISIT_DATE = "Visit Date";
export const STRUCTURED = "Structured";
export const SIG = "Sig";
export const ADD_ANOTHER = "ADD ANOTHER";
export const ADD_ANOTHER_COPAY = "ADD ANOTHER COPAY";
export const SERVICE_DATE = "Service Date";
export const COPAY_AMOUNT = "Copay Amount";
export const UNCOVERED_AMT = "Uncovered Amt";
export const CLAIM_STATUS = "Claim Status";
export const CLAIM_DATE = "Claim Date";
export const INVOICE_DATE = "Invoice Date";
export const SUPERVISOR = "Supervisor";
export const OTHER_DATE = "Other Date";
export const LAST_VISITED = "Last Visited";
export const NO_INVOICE = "No Invoice";
export const PAY_AMOUNT = "Pay Amount";
export const TOTALS = "Totals:";
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
export const BILLING_PROVIDER = "Billing Provider";
export const RENDERING_PROVIDER = "Rendering Provider";
export const SERVICING_PROVIDER = "Servicing Provider";
export const INSURANCE_DETAILS = "Insurance Details";
export const ELIGIBILITY_CHECK = "Eligibility Check";
export const ASSOCIATED_FACILITY = "Associated Facility";
export const APPOINTMENT_FACILITY = "Appointment Facility";
export const APPOINTMENT_SETTINGS = "Appointment Settings";
export const FACILITY_CONTACT_INFO = "Facility Contact Information";
export const FACILITY_BILLING_INFO = "Facility BIling Information";
export const ENABLE = "Enable";
export const VITALS_TEXT = "Vitals";
export const TRIAGE_NOTES = "Triage Notes";
export const NO_NOTES_ADDED = "No Notes Added";
export const TO_CHART = "To Chart";
export const SAVE_TEXT = "Save";
export const HCFA_1500_FORM = "HCFA - 1500 Form"
export const CLEAR_TEXT = "Clear";
export const ALL_NORMAL = "All Normal"
export const NORMAL = "Normal"
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
export const ADD_VACCINE_TEXT = "Add Vaccine";
export const UPDATE_VACCINE_TEXT = "Update Vaccine";
export const MANUFACTURER_TEXT = "Manufacturer";
export const ADMINISTRATION_DATE = "Administration Date";
export const ADMINISTER_BY = "Administer By";
export const SITE_TEXT = "Site";
export const NDC_TEXT = "NDC";
export const MVX_TEXT = "MVX";
export const ROOM_TEXT = "Room";
export const CVX_TEXT = "CVX";
export const IMAGING_TEST_TEXT = "Imaging Test";
export const PATIENT_LOCATION_TEXT = "Patient location";
export const VACCINE_PRODUCT_TEXT = "Vaccine Product";
export const VIS_GIVEN_TEXT = "VIS Given";
export const DATE_ON_VIS = "Date on VIS";
export const LOT_NO_TEXT = "Lot #";
export const AMOUNT_UNIT_TEXT = "Amount/unit";
export const PROBLEMS_TEXT = "Problems";
export const PROBLEM_TEXT = "Problem";
export const MEDICATION_TEXT = "Medication";
export const SURGICAL_TEXT = "Surgical History";
export const UPDATE_PROBLEM = "Update Problem"
export const UPDATE_MEDICATION = "Update Medication"
export const ALLERGIES_TEXT = "Allergies";
export const ALLERGY_TEXT = "Allergy";
export const CARE_PLAN_TEXT = "Care Plan";
export const CARE_PROGRAM_TEXT = "Care Programs";
export const RECENT_EVENT_SUMMARY = "Recent Event Summary";
export const GOALS_TEXT = "Goals";
export const NONE_RECORDED_TEXT = "None Recorded";
export const MEDICATIONS_TEXT = "Medications";
export const SOCIAL_HISTORY_TEXT = "Social History";
export const PATIENT_HISTORY_ILLNESS_TEXT = "History of Patient Illness";
export const ENCOUNTER_INFORMATION = "Encounter Information";
export const REVIEW_OF_SYSTEM_TEXT = "Review of Systems";
export const PHYSICAL_EXAM_TEXT = "Physical Exam";
export const FAMILY_HISTORY_TEXT = "Family History";
export const SURGICAL_HISTORY_TEXT = "Surgical History";
export const MEDICAL_HISTORY_TEXT = "Past Medical History";
export const IMPLANT_HISTORY_TEXT = "Implant History";
export const AVAILABILITY_TEXT = "Availability";
export const ADD_MORE_RECORDS_TEXT = "Add more records";
export const ADD_WIDGET_TEXT = "Add Widget";
export const EXCEL_FILE_FORMATS = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
export const LAB_RESULTS_SUPPORTED_FILE = [...EXCEL_FILE_FORMATS, 'text/csv']
export const EXCEL_FILE_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
export const EXCEL_FILE_EXTENSION = ".xlsx";
export const ACCEPTABLE_PDF_FILES = [".pdf", ".docx", ".doc"];
export const ACCEPTABLE_ONLY_IMAGES_FILES = [".jpg", ".jpeg", ".png", ".svg"];
export const ACCEPTABLE_FILES = [".jpg", ".jpeg", ".png", ".docx", ".doc", ".pdf", ".mp3", ".svg"];
export const ACCEPTABLE_PDF_AND_IMAGES_FILES = [".jpg", ".jpeg", ".png", ".pdf", ".docx", ".doc", ".svg"];
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
export const ONLY_EXCEL_AND_CSV = 'Only excel and csv file supported'
export const LAB_ORDER_CREATE_SUCCESS = "Lab Order Created Successfully"
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
export const INSURANCE_CARD_ERROR_MESSAGE = "Please upload insurance card pictures"
export const TEMPORARY_EMERGENCY_ACCESS =
  "Temporary Emergency Administrator Access";
export const ACTIVATE_EMERGENCY_ACCESS_MODE = "Activate Emergency Access Mode";
export const REVOKE_EMERGENCY_ACCESS_MODE = "Revoke Emergency Access";
export const DEACTIVATE_EMERGENCY_ACCESS_MODE =
  "Deactivate Emergency Access Mode";
export const TEMPORARY_EMERGENCY_ACCESS_DESCRIPTION =
  "Emergency access mode gives practice members temporary administrator permissions in the event of an emergency or crisis. Access is secure and only available to pre-selected practice members designated by a practice administrator.";
export const ICD_TEN = "ICD-10 Codes";
export const ICD_TEN_CODES = "ICD-10 Codes";
export const ICD_CODE = "ICD Code";
export const SNOMED_CODE = "SnoMED Code:";
export const SNOMED = "SnoMed";
export const ICD_10 = "ICD-10";
export const HCPCS_CODES = "HCPCS Codes";
export const ICT_NINE = "ICT-9 Codes";
export const CPT_CODES = "CPT Codes";
export const CPT_CODE = "CPT Code";
export const CPT_TEXT = "CPT";
export const CUSTOM_CODES = "Custom Codes";
export const MEDICINES = "Medicines";
export const TESTS = "Tests";
export const LAB_TESTS = "Lab Tests";
export const VACCINES = "Vaccines";
export const ICD_TEN_DESCRIPTION =
  "Create and edit ICD-10 codes inventory for your practice";
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
export const NDC_DESCRIPTION =
  "Create and edit National Drug Code (NDC) inventory for your practice";
export const MVX_DESCRIPTION =
  "Create and edit MVX inventory for your practice";
export const CVX_DESCRIPTION =
  "Create and edit CVX inventory for your practice";
export const VACCINE_PRODUCT_DESCRIPTION =
  "Create and edit Vaccine Product inventory for your practice";
export const IMAGING_TEST_DESCRIPTION =
  "Create and edit imaging test inventory for your practice";
export const CLINICAL_TEXT = "Clinical";
export const FORM_BUILDER = "Form Builder";
export const AUDIT_LOG = "Audit Log";
export const MACROS = "Macros";
export const FORM_FIELDS = "Form Fields";
export const NO_TEMPLATE = "No Template Found";
export const SELECT_TEMPLATE = "Select Template";
export const FORM_BUILDER_DESCRIPTION = "Design your form by drag and drop";
export const AUDIT_LOG_DESCRIPTION = "View all logs of different activities";
export const MACRO_DESCRIPTION = "View and create macros";
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
export const POLICY_CARDS = "INSURANCE CARDS PICTURES";
export const INSURANCE_CARDS = "INSURANCE CARDS";
export const CHECK_PRIOR_DATE_OF_SERVICE = "Check At Prior Date Of Service";
export const OVERRIDE_PAYER_RETURNED_RESULT = "Override Payer Returned Result";
export const TAKE_A_PICTURE_OF_INSURANCE =
  "Please take a pictures of your insurance card and upload here. ";
export const DOB = "Date of Birth";
export const DOB_TIME = "Date/Time";
export const SPECIALTY = "Specialty";
export const PRICING = "Pricing";
export const DOCTOR_ID = "provider id";
export const PATIENT_ID = "patient id";
export const DEA_NUMBER = "DEA Number";
export const BILLED_AMOUNT = "Billed Amount";
export const TAXONOMY_CODE = "Taxonomy Code";
export const DECEASED_DATE = "Deceased Date";
export const DEA_TERM_DATE = "DEA Term Date";
export const PATIENT_RECEIPT = "Patient Receipt";
export const DATE_OF_SERVICE = "Date of Service";
export const DOS = "DOS";
export const DEA_ACTIVE_DATE = "DEA Active Date";
export const PROVIDER_INFORMATION = "Provider Information";
export const CLINIC = "Clinic";
export const LANGUAGE_SPOKEN = "Language Spoken";
export const DEGREE_CREDENTIALS = "Degree/ Credentials";
export const SOCIAL_SECURITY_TYPE = "Social Security Type";
export const SOCIAL_SECURITY_NUMBER = "Social Security Number";
export const PRIMARY_SERVICE_LOCATION = "Primary Service Location";
export const CPT_CODE_PROCEDURE_CODE = "CPT Code / Procedure Code";
export const PROCEDURE_TEXT = "Procedure"
export const PROCEDURES_TEXT = "Procedures"
export const SURGERY_DATE = "Surgery Date"
export const FAX = "Fax";
export const CITY = "City";
export const SUPER = "Super";
export const ADMIN = "Admin";
export const EMAIL = "Email";
export const PHONE = "Phone";
export const STATE = "State";
export const PDF_TEXT = "PDF";
export const SELECT = "Select";
export const GENDER = "Gender";
export const TEL = 'TEL'
export const PHYSICIAN = 'PHYSICIAN'
export const PRIMARY_CARE = 'Primary Care'
export const PRIMARY = 'Primary'
export const ATTENDING = 'Attending'
export const VIRAL_STRAIN = 'VIRAL STRAIN'
export const METHOD = 'METHOD'
export const UPLOAD_CSV = 'Upload CSV'
export const ENABLED = "Enabled";
export const COUNTRY = "Country";
export const ADDRESS = "Address";
export const SLOTS_TEXT = "Slots";
export const RELATION = "Relation";
export const ZIP_CODE = "Zip code";
export const DISABLED = "Disabled";
export const ADDRESS_2 = "Address 2";
export const ADDRESS_ONE = "Address 1";
export const ADDRESS_TWO = "Address 2";
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
export const UPDATE_PRIMARY_PROVIDER = "Update primary provider";
export const RELATIONSHIP_WITH_PATIENT = "Relationship With Patient";
export const PRIMARY_PROVIDER_DESCRIPTION = "Are you sure to change your primary provider ";
export const NPI = "NPI";
export const NPI_MESSAGE = "NPI should match LUHN Pattern";
export const BY_ORAL_ROUTE = "by oral route";
export const GROUP_NPI = "Group NPI ID";
export const HASH = "#";
export const N_A = "N/A";
export const DAY = "Day";
export const PRN = "PRN";
export const UPIN = "UPIN";
export const PAGER = "Pager";
export const TO_TEXT = "To:";
export const TAX_ID = "Tax ID";
export const GROUP_TAX_ID = "Group Tax ID";
export const GO_BACK = "Go Back";
export const CHAMPUS = "Champus";
export const FROM_TEXT = "From:";
export const FROM = "From";
export const TO = "To";
export const MEDICARE = "Medicare";
export const MEDICAID = "Medicaid";
export const ACTIVE_TEXT = "Active";
export const ADJUSTMENT = "Adjustment";
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
export const PT_LINE_ITEM_BAL = "Pt Line Item Bal";
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
export const OKAY = "Okay";
export const COMPLETED = 'COMPLETED'
export const DATE = "Date";
export const TEST = "Test";
export const TYPE = "Type";
export const CODE = "Code";
export const PRIORITY = "Priority";
export const SR_NO = "SR #";
export const TRUE = "TRUE";
export const TEXT = "text";
export const PLAN = "Plan";
export const NONE = "None";
export const NAME = "Name";
export const NUMBER_TEXT = "Number";
export const SECTION = "Section";
export const ROLE = "Role";
export const UNIT = "Unit";
export const INFO = "Info";
export const PAGE_LIMIT = 9;
export const LAB_ORDERS_LIMIT = 50;
export const PAGE_LIMIT_EIGHT = 8;
export const INS_1 = "Ins 1";
export const INS = "Ins";
export const VALUE = "Value";
export const VISIT = "Visit";
export const VISIT_TYPE = "Visit Type";
export const ISSUES = "Issues";
export const PRINT_PATIENT_CHART = "Print Patient Chart"
export const PRINT_MEDICATION_RECORD = "Print Medication Record"
export const LAB_TEST_STICKERS = "Lab Test Stickers";
export const ALLOWED = "Allowed";
export const PT_PAID = "Pt Paid";
export const INS_BAL = "Ins Bal";
export const MODIFIER = "Modifier";
export const INS_PAID = "Ins Paid";
export const INS_1_PAID = "Ins 1 Paid";
export const INS_2_PAID = "Ins 2 Paid";
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
export const TO_DATE = "To Date";
export const UNKNOWN = "Unknown";
export const TIME_TO = "TIME:TO";
export const SET = "Set Password";
export const EIGHT_PAGE_LIMIT = 8;
export const SECURITY = "Security";
export const ORDER_NUM = "Order #";
export const REJECTED = "Rejected";
export const USERNAME = "Username";
export const PAYER_ID = "Payer ID";
export const SIGN_OFF = "Sign Off";
export const ELEVEN_PAGE_LIMIT = 11;
export const ADD_BILL = "Add Bill";
export const CLAIM_ID = "Claim ID";
export const LOGOUT_TEXT = "Logout";
export const INITIAL_PAGE_LIMIT = 5;
export const TIME_FROM = "TIME:FROM";
export const INSURANCE = "Insurance";
export const INSURANCE_NAME = "Insurance Name";
export const INSURANCE_TYPE = "Insurance Type";
export const PROCEDURE_CODES = "Procedure Codes";
export const NO_INSURANCE = "No Insurance";
export const INTERNATIONAL_TRAVELER = "International Traveler";
export const CONTRACT = "Contract";
export const BALANCE_DUE = "Balance Due";
export const DEDUCTIBLE = "Deductible";
export const MODIFIERS = "Modifiers";
export const ROLE_NAME = "Role name";
export const CHILDHOOD = "Childhood";
export const ADULTHOOD = "Adulthood";
export const CLAIM_BAL = "Claim Bal";
export const FROM_DATE = "From Date";
export const EXTENDED_PAGE_LIMIT = 12;
export const REACTION_PAGE_LIMIT = 50;
export const DROPDOWN_PAGE_LIMIT = 10;
export const USER_LOG_PAGE_LIMIT = 50;
export const HISTORICAL = "Historical";
export const TEST_TAKEN = "Test Taken";
export const TEST_1 = "Test 1";
export const TEST_2 = "Test 2";
export const TEST_3 = "Test 3";
export const TEST_4 = "Test 4";
export const RESULT_1 = "Result 1";
export const RESULT_2 = "Result 2";
export const RESULT_3 = "Result 3";
export const RESULT_4 = "Result 4";
export const ENVIRONMENT = "Environment";
export const ENDING_TIME = "Ending time";
export const APPOINTMENT = "Appointment";
export const TOTAL_CODES = "Total codes";
export const CHARGE_DOLLAR = "Charge ($)";
export const TIME_OF_CHECK = "Time of Check";
export const DRUG = "Drug";
export const FILE = "File";
export const EDIT = "Edit";
export const FOOD = "Food";
export const PAYER = "Payer";
export const CHARGE = "Charge";
export const STAGE = "Stage";
export const CANCEL = "Cancel";
export const BILLED = "Billed";
export const RESULT = "Result";
export const ACTIVE = "Active";
export const STATUS = "Status";
export const USER_TEXT = "User";
export const TAGS_TEXT = "Tags";
export const ACTION = "Action";
export const USER_ID = "User ID";
export const DOCTOR = "Provider";
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
export const SENDING_APPOINTMENT_REMINDER = "Sending Appointment Reminder"
export const END_TIME = "End Time";
export const LAB_RESULTS_LIMIT = 5;
export const REMOVE_TEXT = "Remove";
export const FA_TOKEN = "2fa_token";
export const USER_NAME = "Username";
export const REMOTE_IP = "client_ip";
export const PRACTICES = "Practices";
export const CANCELLED = "Cancelled";
export const NO_RECORDS = "No Records";
export const VITAL_LIST_PAGE_LIMIT = 4;
export const ADD_RECORD = "Add Record";
export const DR_CLAIM_NO = "Dr Claim #";
export const PRINT_CHART = "Print Chart";
export const NEW_PATIENT = "New Patient";
export const FACILITY_ID = "Facility ID";
export const LOCATION_ID = "Location ID";
export const VENDOR_NAME = "Vendor Name";
export const IN_PROGRESS = "In Progress";
export const ADD_ALLERGY = "Add Allergy";
export const NEW_PROVIDER = "New Provider";
export const APPLY_FILTER = "Apply Filter";
export const REVENUE_CODE = "Revenue Code";
export const BILLING_TYPE = "Billing Type";
export const SERVICE_CODE = "Service Code";
export const UPDATE_FILTER = "Update Filter";
export const CLEAR_FILTER = "Clear Filter";
export const ALL_LOG_TYPES = "All Log Types";
export const REGISTERED_ON = "Registered on";
export const RECEIVED_DATE = "Received Date";
export const VIEW_PATIENTS = "View Patients";
export const STARTING_TIME = "Starting time";
export const PRESCRIBED_BY = "Prescribed By";
export const CLIA_ID_NUMBER = "CLIA ID Number";
export const UPDATE_ALLERGY = "Update Allergy";
export const CLAIM_RECEIVED = "Claim Received";
export const COLLECTED_DATE = "Collected Date";
export const EFFECTIVE_DATE = "Effective Date";
export const VIEW_FACILITIES = "View Facilities";
export const NEW_APPOINTMENT = "New Appointment";
export const DISPLAY_COLUMNS = "Display Columns";
export const MEDICAL_BILLING = "Medical Billing";
export const POS = "POS";
export const LAB_TEXT = "Lab";
export const PATIENT_IMAGE = "Patient Image"
export const OTHER_TEXT = "Other"
export const REVOKE = "REVOKE";
export const NUMBER = "Number";
export const OTP_CODE = "OTP Code";
export const LOCATION = "Location";
export const DURATION = "Duration";
export const RECURRING = "Recurring";
export const TEST_DATE = "Test Date";
export const TEST_TIME = "Test Time";
export const NEW_STAFF = "New Staff";
export const LAST_NAME = "Last Name";
export const ACTIVATED = "Activated";
export const APPT_TYPE = "Appt Type:";
export const ORDER_NUMBER = "Order #";
export const BILLING_TEXT = "Billing";
export const REPORTS_TEXT = "Reports";
export const DOCTORS_TEXT = "Providers";
export const TEST_NOTES = "Test Notes";
export const INITIATED = "Initialized";
export const UNVERIFIED = "Unverified";
export const SEND_EMAIL = "Send Email";
export const FIRST_NAME = "First Name";
export const START_TIME = "Start Time";
export const START_DATE = "Start Date";
export const STOP_DATE = "Stop Date"
export const STOP_REASON = "Stop Reason"
export const SUPER_BILL = "Super Bill";
export const SELECT_ANOTHER_STATUS = 'Please Select another status';
export const DEACTIVATE = "DEACTIVATE";
export const ADD_VITALS = "Add Vitals";
export const SETTINGS_TEXT = "Settings";
export const REQUESTS_TEXT = "Requests";
export const INVOICES_TEXT = "Invoices";
export const PATIENTS_TEXT = "Patients";
export const CARD_NUMBER = "Card Number";
export const EXPIRY_DATE = "Expiry Date";
export const RESEND_OTP = "Resend OTP ?";
export const ADD_PROBLEM = "Add Problem";
export const ADD_REASON = "Add Reason";
export const ADD_MEDICATION = "Add Medication";
export const ADD_ORDER = "Add Order"
export const ADD_SCRIBE = "Add Scribe"
export const ADD_SURGICAL_HISTORY = "Add Surgical History";
export const UPDATE_SURGICAL_HISTORY = "Update Surgical History";
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
export const DASHBOARD_TEXT = "Home";
export const ADD_PROBLEMS = "Add Problems";
export const ADD_MEDICATIONS = "Add Medications";
export const VIEW_BILLING = "View Billing";
export const SEND_SMS = "Send SMS";
export const US_DATE_FORMAT = "mm/dd/yyyy";
export const PRACTICE_NPI = "Practice NPI";
export const PATIENT_INFO = "Patient Info";
export const INTAKE = "Intake";
export const EXAM = "Exam";
export const USER_ROLE = "boca_admin_role";
export const DELETE_STAFF = "Delete Staff";
export const ADD_FACILITY = "Add Facility";
export const EDIT_SERVICE = "Edit Service";
export const ADD_LOCATION = "Add Location";
export const FEE_SCHEDULE = "Fee Schedule";
export const CPT_FEE_SCHEDULE = "CPT Fee Schedule";
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
export const UPDATE_VITALS = "Update Vitals";
export const EDIT_PROBLEMS = "Edit Problems";
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
export const HPI_TEMPLATES = "HPI Templates";
export const ROS_TEMPLATES = "ROS Templates";
export const PE_TEMPLATES = "PE Templates";
export const LAB_RESULTS_TEXT = "Lab Results";
export const BILLING_STATUS = "Billing Status";
export const VISIT_REASON = "Reason for visit";
export const UPDATE_SERVICE = "Update Service";
export const DELETE_PATIENT = "Delete Patient";
export const PAGE_NOT_FOUND = "Page Not Found";
export const ARRIVAL_STATUS = "Arrival Status";
export const LONG_DESCRIPTION = "Long Description";
export const SHORT_DESCRIPTION = "Short Description";
export const SHORT_CUT = "Shortcut";
export const MACRO_TEXT = "Macro Text";
export const MACRO = "Macro";
export const EXP_REIMBURSEMENT = "Exp Reimb";
export const SERVICE_FEE_CHARGE = "Service Fee (Charge)";
export const PATIENT_INFORMATION = "Patient Information";
export const SUBSCRIBER_INFORMATION = "Subscriber Information";
export const PLAN_DETAIL_INFORMATION = "Plan Detail Information";
export const PROFESSIONAL_OFFICE_VISIT = "Professional Office Visit";
export const HEALTH_PLAN_BENEFITS = "Health Plan Benefits";
export const PRIMARY_CARE_PROVIDER_INFO = "Primary Care Provider Info";
export const DETAILED_COVERAGE_INFORMATION = "Detailed Coverage Information";
export const PROFESSIONAL_PHYSICIAN_DATA = "Professional (Physician) Visit - Office";
export const REMAINING = "Remaining";
export const MESSAGE = "Message";
export const IN_NETWORK = "In Network";
export const COVERAGE_SUMMARY = "Coverage Summary";
export const URGENT = "Urgent Care";
export const AUTH_CERT_REQUIRED = "Auth/Cert Required";
export const TIME_PERIOD = "Time Period";
export const URGENT_CARE = "Urgent Care";
export const CHIROPRACTIC = "Chiropractic";
export const SERVICE_TYPE = "Service Type";
export const COVERAGE_LEVEL = "Coverage Level";
export const EXCEPTION = "Forbidden exception";
export const DELETE_REQUEST = "Delete Request";
export const REQUEST_DETAIL = "Request Detail";
export const REQUEST_STATUS = "Request Status";
export const TEST_DATE_TIME = "Test Date/Time";
export const SEARCH_PATIENT = "Search Patient";
export const SPECIMEN_NOTES = "Specimen Notes";
export const INITIAL_CAPITAL_INVESTMENT = "2%";
export const OTHER_RELATION = "Other Relation";
export const ALL_INSURANCES = "All Insurances";
export const DOCTOR_SIGNOFF = "Lab Manager Signoff";
export const OTHER_PROVIDER = "Other Provider";
export const EMAIL_VERIFIED = "Email Verified?";
export const APPOINTMENTS_TEXT = "Appointments";
export const ROLE_DETAILS_TEXT = "Role Details";
export const DOCTOR_SCHEDULE = "Provider Schedule";
export const MY_APPOINTMENTS = "My Appointments";
export const DELETE_FACILITY = "Delete Facility";
export const UPDATE_LOCATION = "Update Location";
export const COLLECTION_DATE = "Collection Date";
export const COLLECTION_TIME = "Collection Time";
export const CREATE_PRACTICE = "Create Practice";
export const SET_PERMISSIONS = "Set Permissions";
export const RECENT_READINGS = "Recent Readings";
export const LAST_FIVE_RESULTS = "Last 5 Results";
export const ADD_FACILITY_SERVICE = "Add Service";
export const LAB_ORDER_RESULT = "Lab Order Result";
export const APPOINTMENT_INFO = "Appointment Info";
export const RESULT_FILE_NAME = "Result File Name";
export const LAST_APPOINTMENT = "Last Appointment";
export const ACCESSION_NUMBER = "Accession Number";
export const ALL_APPOINTMENTS = "All Appointments";
export const RECENT_PRACTICES = "Recent Practices";
export const CLAIM_IN_PROCESS = "Claims in Process";
export const RESULTS_ENTERED = "Results Entered At";
export const PATIENT_INSURANCE = "Patient Insurance";
export const RECENT_ACTIVITIES = "Recent Activities";
export const ASSIGNED_PROVIDER = "Assigned Provider";
export const TOTAL_CLAIM_TEXT = "7900 Claim in Total";
export const LAB_PERMISSIONS_TEXT = "Lab Permissions";
export const TOTAL_APPOINTMENTS = "Total Appointments";
export const PATIENT_DISCHARGED = "Patient Discharged";
export const PATIENT_DISCHARGED_SUCCESS = "Patient Discharged Successfully";
export const QUICK_APPOINTMENTS = "Quick Appointments";
export const DIAGNOSIS_POINTERS = "Diagnosis Pointers";
export const LAST_READING_DATE = "Last Reading Date: ";
export const UPDATE_FACILITY_SERVICE = "Update Service";
export const INSURANCE_PLAN_TYPE = "Insurance Plan Type";
export const REGISTERED_PATIENTS = "Registered Patients";
export const TODAYS_APPOINTMENTS = "Today’s Appointments";
export const FUNCTIONAL_HEARTBURN = "Functional Heartburn";
export const ADD_ANOTHER_REACTION = "Add Another Reaction";
export const CHECK_ELIGIBILITY = "Check Eligibility";
export const COVERAGE_DETAILS = "Coverage Details";
export const ELIGIBILITY_LISTING = "Eligibility Listing";
export const PATIENT_PAYMENT_TYPE = "Patient Payment Type";
export const BILLING_AND_INSURANCE = "Billing & Insurance";
export const TOTAL_USERS_PER_ROLE = "Total Users Per Role";
export const ENTER_OTP_CODE = "Please enter your OTP Code";
export const EMERGENCY_ACCESS_LOG = "Emergency Access Log";
export const UPCOMING_APPOINTMENTS = "Upcoming Appointments";
export const TOTAL_NUMBER_OF_USERS = "Total Number of Users";
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
export const ACTIVE_STAFF = "Active Staff";
export const TOTAL_FACILITIES_PER_PRACTICE = "Total Facilities Per Practice";
export const PREFERRED_PROVIDER_IN_PRACTICE = "Preferred provider in practice";
export const REACTION_SELECTION_REQUIRED = "Please select at least one reaction";
export const AVAILABLE_USERS = "Available Users";
export const ACTIVE_PROVIDERS = "Active Providers";
export const USD = "USD";
export const SEX = "Sex";
export const SYNC = "Sync";
export const SIZE = "Size";
export const RACE = "Race";
export const IP_TEXT = "IP";
export const ID_TEXT = "ID";
export const LOGIN = "Login";
export const ROUTE = "Route";
export const TITLE = "Title";
export const TODAY = "Today";
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
export const DETAIL = "Detail";
export const HOME_TEXT = "Home";
export const INSURER = "Insurer";
export const DETAILS = "Details";
export const MARRIED = "MARRIED";
export const PENDING = "Pending";
export const MISSING = "Missing";
export const ACTIONS = "Actions";
export const BILLING = "Billing";
export const PRIVACY = "Privacy";
export const RECEIVED = "Received";
export const INSURANCE_SELECTION = "Insurance Selection";
export const NO_INSURANCE_ADDED = "No Insurance Added";
export const AMOUNT_TYPE = "Amount Type";
export const DUE_AMOUNT = "Due Amount";
export const COLLECTED_AMOUNT = "Collected Amount";
export const CHARGE_ENTRY = "Charge Entry";
export const PAYMENT = "Payment";
export const GROUP_NO = "Group #";
export const ROLES_TEXT = "Roles";
export const ADDITIONAL = "Additional";
export const PREVIOUS = "Previous";
export const IS_ACTIVE = "Active";
export const TOTAL_TEXT = "Total";
export const TWO_FA_TEXT = "2-FA";
export const COPAY_TEXT = "COPAY";
export const PAYMENTS = "Payments";
export const GUARDIAN = "Guardian";
export const EMPLOYER = "Employer";
export const CHECKOUT = "checkout";
export const CHECKOUT_TEXT = "Checkout";
export const CHECKOUT_DISCHARGE = "checkout & discharge";
export const INDUSTRY = "Industry";
export const DISCHARGE = "Discharge";
export const ADDED_BY = "Added by";
export const RELOAD = "Go To Home";
export const LANGUAGE = "Language";
export const PRONOUNS = "Pronouns";
export const CLAIM_NO = "Claim No";
export const ADD_NUM = "Add Number";
export const MEMBER_NO = "Member #";
export const UNLOCK_TEXT = "Unlock";
export const DIAGNOSIS = "Diagnosis";
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
export const LAB_SPECIMEN = 'Lab Specimen'
export const ETHNICITY = "Ethnicity";
export const SIGNED_BY = "Signed by";
export const SIGNED_AT = "Signed at";
export const CASH_PAID = "Cash Paid";
export const TIME_SLOT = "Time Slot";
export const HOMEBOUND = "Home Bound";
export const PROFILE_TEXT = "Profile";
export const EXPECTED = "Expected";
export const ADJUSTMENTS = "Adjustments";
export const BALANCE = "Balance";
export const TOTAL_CHARGES = "Total Charges :";
export const TOTAL_DISCOUNTS = "Total Discounts:";
export const PATIENT_PAID = "Patient Paid:";
export const INSURANCE_PAID = "Insurance Paid:";
export const PATIENT_BALANCE_DUE = "Patient Balance Due:";
export const INSURANCE_BALANCE_DUE = "Insurance Balance Due:";
export const TREATMENT = "Treatment";
export const AGREEMENTS = "Agreements";
export const DATE_OF_VISIT = "Date of Visit";
export const BILLING_CODE = "Billing Code";
export const MODS = "Mods";
export const DX_PTRS = "Dx Ptrs";
export const QTY = "Qty";
export const FEE = "Fee";
export const DIS = "Dis";
export const SEND_SMS_TEXT = "Send SMS";
export const DIAGNOSIS_CODE = "Diagnosis Code";
export const CLAIM_STATUSES = "Claim Statuses";
export const PATIENT_SIGNATURE = "Patient Signature:";
export const PROVIDER_SIGNATURE = "Provider Signature:";
export const SEND_SMS_DESCRIPTION = "Send SMS to the any one.";
export const LAB_RESULTS_DESCRIPTION = "Patient's Lab Results";
export const INSURANCE_ELIGIBILITY_TEXT = "Insurance Eligibility";
export const AGREEMENTS_DESCRIPTION = "Create Agreements for patients";
export const CLAIM_STATUSES_DESCRIPTION = "Create Claim Statuses for Billing";
export const INSURANCE_ELIGIBILITY_DESCRIPTION = "Check the patient's insurance eligibility";
export const ROOM_DESCRIPTION = "Add Room for your facility";
export const PATIENT_RECEIPT_AUTHORIZE_TEXT = "I authorize the release of any medical information necessary to process this claim."
export const LAB_ORDERS = "Lab Orders";
export const SIGNATURE_DATE = "DATE:"
export const ADD_POLICY = "Add Policy";
export const EMPLOYMENT = "Employment";
export const LOINC_CODE = "LOINC Code";
export const ISSUE_DATE = "Issue Date";
export const SUBSCRIBER = "Subscriber";
export const COPAY_TYPE = "Copay Type";
export const OFFICE_EIN = "Office EIN";
export const DOB_FORMAT = 'MM-DD-YYYY';
export const HOME_PHONE = "Home Phone";
export const CHECKED_IN = 'CHECKED IN';
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
export const ICD_TEN_CODE = "ICD-10 Code";
export const SNO_MED_CODE = "SnoMed Code";
export const SIGNATURE_TEXT = "Signature";
export const PAY_VIA_CASH = "Pay via Cash";
export const ASSIGN_TO_ME = "Assign To Me";
export const RESULT_VALUE = "Result Value";
export const RESULT_UNITS = "Result Units";
export const NORMAL_RANGE = "Normal Range";
export const FFE_SCHEDULE = "Fee Schedule";
export const CREATE_CLAIM = "Create Claim";
export const UPDATE_CLAIM = "Update Claim";
export const SUBMIT_CLAIM = "Submit Claim";
export const SEX_AT_BIRTH = "Sex At Birth";
export const PAY_VIA_CARD = "Pay via Card";
export const RELATIONSHIP = "Relationship";
export const MOBILE_PHONE = "Mobile Phone";
export const PATIENT_NAME = "Patient Name";
export const DEMOGRAPHICS = "Demographics";
export const ADDRESS_CTA = "Address (CTA)";
export const MANUAL_ENTRY = "Manual Entry";
export const MY_ACCOUNT_TEXT = "My Account";
export const APP_NAME_FORMAT = 'First Last';
export const EDIT_ROLE_TEXT = "Update Role";
export const SKIP_NOW_TEXT = "Skip for now";
export const CANCELLATIONS = "Cancellations";
export const DOCUMENT_TYPE = "Document Type";
export const CANCEL_RECORD = "Cancel record";
export const YES_CHECKOUT = "Yes, Check Out";
export const PATIENT_CHART = "Patient Chart";
export const SIGN_DOCUMENT = "Sign Document";
export const COPAY_AMOUNTS = "Copay Amounts";
export const NEW_LAB_ORDER = "New Lab Order";
export const EDIT_PROVIDER = "Edit Provider";
export const ADD_INSURANCE = "Add Insurance";
export const PATIENT_PHONE = 'Patient Phone';
export const DOCUMENT_NAME = "Document Name";
export const ABNORMAL_FLAG = "Abnormal Flag";
export const USER_SETTINGS = "User Settings";
export const ADD_AGREEMENT = "Add Agreement";
export const ADD_SIGNATURE = "Add Signature";
export const PATIENT_NOTES = "Patient Notes";
export const EMPLOYER_NAME = "Employer Name";
export const POLICY_HOLDER = "Policy Holder";
export const PROVIDER_NAME = "Provider Name";
export const OFFICE_PHONE = "Office Phone";
export const DATE_OF_BIRTH = "Date of Birth";
export const REVOKE_ACCESS = "Revoke Access";
export const FORMER_SMOKER = "Former Smoker";
export const PRICE_WITH_DOLLAR = "Price ($)";
export const POLICY_NAME_TEXT = "POLICY NAME";
export const BILL_FEE_DOLLAR = "Bill Fee ($)";
export const DECREASED_DATE = "Deceased Date";
export const ELIGIBILITY_TEXT = "ELIGIBILITY";
export const ADD_DOCUMENT = "Upload Document";
export const OUTSTANDING_TEXT = "Outstanding";
export const EXPORT_TO_FILE = "Export To File";
export const EXPORT_TO_CSV = "Export To Csv";
export const EXPORT_TO_EXCEL = "Export To Excel";
export const PREFERRED_NAME = "Preferred Name";
export const EDIT_INSURANCE = "Edit Insurance";
export const EDIT_AGREEMENT = "Edit Agreement";
export const HOLD_STATEMENT = "Hold Statement";
export const ENTER_PASSWORD = "Enter Password";
export const PAYMENT_METHOD = "Payment Method";
export const ADDRESS_NUMBER = "Address Number";
export const AMOUNT_WITH_DOLLAR = "Amount ($)";
export const CONTACT_NUMBER = "Contact Number";
export const VIEW_ENCOUNTER = "View Encounter";
export const ENTER_RELATION = "Enter Relation";
export const AGREEMENT_BODY = "Agreement Body";
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
export const BUILD_FEE_DOLLAR = "Build Fee ($)";
export const FIRST_NAME_USED = "First Name Used";
export const PATIENT_ADDRESS = "Patient Address";
export const PATIENT_CONTACT = "Patient Contact";
export const INSURANCE_NAMES = "Insurance Names";
export const MEMBERSHIP_NAME = "Membership name";
export const LIVE_CLAIM_FEED = "Live Claim Feed";
export const MEMBERSHIP_PLAN = "Membership Plan";
export const CHANGE_PASSWORD = "Change password";
export const ATTACHMENT_NAME = "Attachment Name";
export const DETAIL_OVERVIEW = "Detail overview";
export const TEST_LOINC_CODE = "Test/LOINC Code";
export const REPEAT_PASSWORD = "Repeat password";
export const INITIAL_PAYMENT = "Initial payment";
export const TOKEN_NOT_FOUND = "Token not found";
export const USER_ROLE_PLACEHOLDER = "User Role";
export const CLAIM_FEED_TEXT = "Live Claim Feed";
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
export const BILLED_FEE_DOLLAR = "Billed Fee ($)";
export const CALENDAR_VIEW_TEXT = "Calendar View";
export const DOCUMENT_DETAILS = "Document Details";
export const TWO_FACTOR_LOGIN = "Two-Factor Login";
export const POLICY_HOLDER_ID = "Policy holder ID";
export const USER_INFORMATION = "User information";
export const CONFIRM_PASSWORD = "Confirm password";
export const MEMBERSHIP_PLANS = "Membership Plans";
export const CURRENT_PASSWORD = "Current password";
export const SAVE_APPOINTMENT = "Save Appointment";
export const ADD_CLAIM_STATUS = "Add Claim Status";
export const UPDATE_SIGNATURE = "Update Signature";
export const BOOK_APPOINTMENT = "Book Appointment";
export const AUDIT_LOG_REPORT = "Audit Log Report";
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
export const USUAL_OCCUPATION = "Usual Occupation";
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
export const REMOVE_COPAY_AMOUNT = "Remove Copay Amount";
export const NOT_FOUND_EXCEPTION = "Not Found Exception";
export const FORBIDDEN_EXCEPTION = "Forbidden Exception";
export const SEARCH_FOR_PROBLEMS = "Search for Problems";
export const REASON_ADDED = 'Reason Added'
export const SEARCH_FOR_VACCINES = "Search for vaccines";
export const SEARCH_FOR_DISEASE = "Search for Disease";
export const SEARCH_FOR_USER = "Search for User";
export const CONTACT_INFORMATION = "Contact Information";
export const PREVIOUS_FIRST_NAME = "Previous First Name";
export const INDIVIDUAL_NAME = "Individual Name / Trust";
export const APPOINTMENT_DETAILS = "Appointment Details";
export const PROFILE_INFORMATION = "Profile information";
export const VIEW_APPOINTMENTS_TEXT = "View Appointments";
export const FACILITY_SERVICES_TEXT = "Facility Services";
export const VIEW_OWNERSHIP_REQUEST = "Ownership Request";
export const MOTHERS_MAIDEN_NAME = "Mother's Maiden Name";
export const FEE_SCHEDULE_LISTING = "Fee Schedule Listing";
export const PASSWORDS_MUST_MATCH = "Passwords must match";
export const PRICING_PRODUCT_TYPE = "Pricing Product Type";
export const INSURANCE_PAYER_NAME = "Insurance Payer Name";
export const SEARCH_FOR_ALLERGIES = "Search for Allergies";
export const SEARCH_FOR_ICD_CODES = "Search for ICD Codes";
export const ENABLE_ACCESS_PORTAL = "Enable Portal Access";
export const GUARANTOR_RELATION = "Patient’s Relationship";
export const ADD_ANOTHER_COPAY_AMOUNT = "Add Another Copay";
export const ADD_COPAY_AMOUNT = "Add Copay";
export const VALID_DATE_REQUIRED = "Valid date is required";
export const CANCEL_APPOINTMENT_TEXT = "Cancel Appointment";
export const FACILITY_LOCATIONS_TEXT = "Facility Locations";
export const ENABLE_PATIENT_ACCESS = "Enable Patient Access";
export const SEARCH_FOR_PROCEDURES = "Search for Procedures";
export const PRIMARY_CARE_PROVIDER = "Primary Care Provider";
export const INSURANCE_POLICY_INFO = "Insurance Policy Info";
export const PLACE_OF_SERVICE_CODE = "Place of Service Code";
export const POLICY_HOLDER_DETAILS = "Policy Holder Details";
export const INSURANCE_AND_POLICIES = "Insurance & Policies";
export const VERIFY_EMAIL_HEADING_TEXT = "Verify Your Email";
export const LOADING_PLEASE_WAIT = "Loading, PLEASE WAIT...";
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
export const SEARCH_FOR_MEDICATIONS = "Search for Medications";
export const SEARCH_FOR_TESTS = "Search for Tests";
export const SEARCH_FOR_DOCTORS = "Search for Doctors";
export const SEARCH_FOR_STAFF = "Search for Staff";
export const SEARCH_FOR_IMAGING = "Search for Imaging";
export const DELETE_RECORD_TEXT = "You are about delete record";
export const DELETE_ROLE_DESCRIPTION = "Confirm to delete role";
export const REGISTRATION_DEPARTMENT = "Registration Department";
export const REQUEST_MEMBERSHIP_PLAN = "Request Membership Plan";
export const SCHEDULE_APPOINTMENTS_TEXT = "Schedule Appointment";
export const RELATIONSHIP_TO_PATIENT = "Relationship To Patient";
export const BOOK_YOUR_APPOINTMENT = "1 - Book Your Appointment";
export const MAINTENANCE_IN_PROGRESS = "Maintenance in progress";
export const REGISTRATION_DATES = "Provider/ Registration Dates";
export const PROVIDER_FACILITY = "Provider/ Facility";
export const DELETE_STAFF_DESCRIPTION = "Confirm to delete staff";
export const PAY_DEBIT_CARD_TEXT = "Pay via Debit or Credit Card";
export const PASSWORD_CHANGE_HEADING_TEXT = "Password is changed";
export const APPOINTMENT_CANCELLED_TEXT = "Appointment cancelled";
export const ADD_PHONE_NUM_DESCRIPTION = "Please add phone number";
export const AGREEMENT_TEXT = "I agree to all terms and agreement";
export const BOCA_ADMIN_NOTIFICATIONS = "boca_admin_notifications";
export const SIGN_DOCUMENT_DESCRIPTION = "Confirm to sign document";
export const LIST_FACILITY_SERVICES_TEXT = "List Facility Services";
export const DELETE_DOCTOR_DESCRIPTION = "Confirm to delete provider";
export const DELETE_PATIENT_DESCRIPTION = "Confirm to delete patient";
export const AGREEMENT_HEADING = "User data privacy & TOS agreement.";
export const DELETE_SERVICE_DESCRIPTION = "Confirm to delete Service";
export const PUBLIC_FORM_FAIL_MESSAGE = 'Your record is not created.';
export const VERIFICATION_MESSAGE = "You are verified. Please login.";
export const DELETE_PROBLEM_DESCRIPTION = "Confirm to delete problem";
export const DELETE_REASON_DESCRIPTION = "Confirm to delete appointment reason";
export const DELETE_CHIEF_COMPLAINT_DESCRIPTION = "Confirm to delete chief complaint";
export const DELETE_VACCINE_DESCRIPTION = "Confirm to delete vaccine";
export const DELETE_ICD_10_DESCRIPTION = "Confirm to delete icd-10";
export const DELETE_CPT_CODE_DESCRIPTION = "Confirm to delete CPT code";
export const DELETE_NDC_CODE_DESCRIPTION = "Confirm to delete NDC code";
export const DELETE_ROOM_DESCRIPTION = "Confirm to delete room";
export const DELETE_IMAGING_TEST_DESCRIPTION = "Confirm to delete imaging test";
export const DELETE_VACCINE_PRODUCT_DESCRIPTION = "Confirm to delete Vaccine Product";
export const DELETE_CVX_CODE_DESCRIPTION = "Confirm to delete cvx code";
export const DELETE_MACRO_DESCRIPTION = "Confirm to delete Macro";
export const DELETE_ALLERGY_DESCRIPTION = "Confirm to delete allergy";
export const CHOOSE_YOUR_PAYMENT_METHOD = "Choose your Payment Method";
export const NEXT_SCHEDULED_APPOINTMENT = "Next Scheduled Appointment";
export const DELETE_FACILITY_DESCRIPTION = "Confirm to delete facility";
export const DELETE_LOCATION_DESCRIPTION = "Confirm to delete location";
export const DELETE_DOCUMENT_DESCRIPTION = "Confirm to delete document";
export const DELETE_PRACTICE_DESCRIPTION = "Confirm to delete practice";
export const MOST_USED_STANDARD_POLICES = "Most Used Standard Policies";
export const INSURANCE_POLICY_DETAILS = "Insurance and Policies Details";
export const PROVIDER_REGISTRATION_DATES = "Provider/ Registration Dates";
export const EMAIL_NOT_RECEIVE_TEXT = "Did’t receive an email? Try Again";
export const INSURANCE_DISCLAIMER = "How will you be covering your visit?";
export const MEDICATION_HISTORY_AUTHORITY = "Medication History Authority";
export const PAY_VIA_DEBIT_OR_CREDIT_CARD = "Pay via Debit or Credit Card";
export const STATEMENT_DELIVERED_ONLINE = "Statement delivered online only";
export const DELETE_MEDICATION_DESCRIPTION = "Confirm to delete medication";
export const DELETE_FAMILY_DESCRIPTION = "Confirm to delete family history";
export const APPOINTMENT_CANCEL_REASON = "Admin/Staff cancelled appointment";
export const MEMBER_ID_CERTIFICATE_NUMBER = "Member ID/Certification Number";
export const FEE_SCHEDULE_DESCRIPTION = "Manage fee schedule for procedures";
export const PATIENT_CANCELLED_APPOINTMENT = "Patient cancelled appointment";
export const PRECONDITION_FAILED_EXCEPTION = "Precondition Failed Exception";
export const GUARANTOR_NOTE = "Guarantor (Name to whom statements are sent)";
export const DELETE_APPOINTMENT_DESCRIPTION = "Confirm to delete appointment";
export const DISCHARGE_PATIENT_DESCRIPTION = "Are you sure you want to discharge the Patient?";
export const INTERNAL_SERVER_ERROR_EXCEPTION = "InternalServerErrorException";
export const CANCEL_APPOINTMENT_DESCRIPTION = "Confirm to cancel appointment";
export const PREFERRED_COMMUNICATION_METHOD = "Preferred Communication Method";
export const DELETE_FEE_SCHEDULE_DESCRIPTION = "Confirm to delete fee schedule";
export const UPLOADS_DOCUMENT_LEARN_MORE_TEXT = "Drop your image here, or browse";
export const MAMMOGRAPHY_CERTIFICATION_NUMBER = "Mammography Certification Number";
export const ADD_INSURANCE_INFORMATION = "Click here to add insurance information";
export const FACILITY_ADMIN_SEARCH_PLACEHOLDER = "Patient Name or Patient ID etc...";
export const DELETE_MEDIA_DESCRIPTION = "Are you sure you want to delete this media?";
export const DELETE_CPT_FEE_SCHEDULE_DESCRIPTION = "Confirm to delete cpt fee schedule";
export const DELETE_SURGICAL_HISTORY_DESCRIPTION = "Confirm to delete surgical history";
export const DELETE_DOCTOR_SCHEDULE_DESCRIPTION = "Confirm to delete provider schedule";
export const PUBLIC_FORM_SUCCESS_TITLE = 'Your record has been submitted successfully.';
export const DELETE_FACILITY_SCHEDULE_DESCRIPTION = "Confirm to delete facility schedule";
export const DELETE_REQUEST_DESCRIPTION = "Are you sure you want to delete this request?";
export const TWO_FACTOR_LOGIN_DESCRIPTION = "Enter security code from your mobile phone.";
export const PATIENT_RELATIONSHIP_TO_POLICY_HOLDER = "Patient relationship to policy holder";
export const DELETE_LAB_ORDER_RESULT_DESCRIPTION = "Confirm to delete lab order result file";
export const POLICY_HOLDER_ID_CERTIFICATION_NUMBER = "Policy holder ID/certification number";
export const PUBLIC_FORM_SUCCESS_DESCRIPTION_1 = 'Your details has been record successfully.';
export const APPOINTMENT_CANCEL_SUBHEADING = "You won’t be able to revert this action later!";
export const REQUIRE_AGREEMENT_BEFORE_AGREEING = "Require to view the agreement before agreeing";
export const PRIMARY_INSURANCE_DESCRIPTION = "Click here to add primary insurance (Recommended)";
export const DELETE_POLICY_CARD_ATTACHMENT_DESCRIPTION = "Confirm to delete Insurance card file";
export const RELEASE_OF_BILLING_INFO = "Release of Billing Information and Assignment of Benefits";
export const ELIGIBILITY_ERROR_MESSAGE = 'Realtime Eligibility is not supported by this insurance';
export const PROVIDER_DETAILS_SUCCESS_DESCRIPTION = 'Provider Details has been added successfully.';
export const ANNUAL_MANAGEMENT_FEE = "Annual Management Fee (based on initial capital contribution)";
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
export const CHECKOUT_MODAL_DESCRIPTION = "After checking out, you will not be able to edit it again. Do you still want to check out?";
export const SIGN_RECORD_LEARN_MORE_TEXT = "You are about to sign this document permanently. Are you sure you want to sign this document?";
export const DELETE_RECORD_LEARN_MORE_TEXT = "You are about to delete this record permanently. Are you sure to delete this record?";
export const CANCEL_RECORD_LEARN_MORE_TEXT = "You are about to cancel this record permanently. Are you sure you want to cancel this record?";
export const DISCHARGE_MODAL_PATIENT_DESCRIPTION = "You are about to discharge the patient permanently. Are you sure you want to discharge the patient?";
export const appointmentCancellationDescription = `Are you sure you want to cancel`;
export const APPOINTMENT_ON = `Appointment on`
export const AT = `at`
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
export const DASHBOARD_ROUTE = "/home";
export const PROFILE_ROUTE = "/profile";
export const DOCTORS_ROUTE = "/providers";
export const CHECK_IN_ROUTE = "/check-in";
export const SETTINGS_ROUTE = "/settings";
export const PATIENTS_ROUTE = "/patients";
export const SEND_SMS_ROUTE = `/send-sms`;
export const INVOICES_ROUTE = "/invoices";
export const AUDIT_LOG_ROUTE = "/audit-log";
export const MACROS_ROUTE = "/macros";
export const SIGNATURE_ROUTE = "/signature";
export const CLAIM_FEED_ROUTE = "/claim-feed";
export const SUPER_BILL_ROUTE = "/super-bill";
export const AGREEMENTS_ROUTE = "/agreements";
export const AUTO_LOGOUT_ROUTE = "/auto-logout";
export const MAINTENANCE_ROUTE = "/maintenance";
export const LAB_RESULTS_ROUTE = "/lab-results";
export const LAB_RESULTS_INFO = "/lab-results-info";
export const CANCELLATION_ROUTE = "/cancellation";
export const SET_PASSWORD_ROUTE = "/set-password";
export const APPOINTMENTS_ROUTE = "/appointments";
export const VERIFY_EMAIL_ROUTE = "/verify-email";
export const FORM_BUILDER_ROUTE = "/form-builder";
export const FEE_SCHEDULE_ROUTE = "/fee-schedule";
export const COVERAGE_ROUTE = "/coverage-details";
export const FACILITIES_ROUTE = "/list-facilities";
export const ADD_ROLES_ROUTE = `${ROLES_ROUTE}/new`;
export const CALENDAR_ROUTE = "/dashboard/calendar";
export const PAST_APPOINTMENTS = "Past Appointments";
export const FACILITY_LOCATIONS_ROUTE = "/locations";
export const ELIGIBILITY_ROUTE = "/check-eligibility";
export const CLAIM_STATUSES_ROUTE = "/claim-statuses";
export const RESET_PASSWORD_ROUTE = "/reset-password";
export const UPDATE_PASSWORD_ROUTE = "/update-password";
export const CHANGE_PASSWORD_ROUTE = "/change-password";
export const FORGET_PASSWORD_ROUTE = "/forget-password";
export const CANCEL_APPOINTMENT = "/cancel-appointment";
export const PUBLIC_FORM_BUILDER_ROUTE = "/public/form";
export const FORM_BUILDER_RESPONSES = "/form-responses";
export const EDIT_LAB_ORDERS_ROUTE = "/lab-orders/edit";
export const CREATE_LAB_ORDERS_ROUTE = "/lab-orders/new";
export const CLAIM_STATUS_ROUTE = "/billing-claim-status";
export const EMERGENCY_ACCESS_ROUTE = "/emergency-access";
export const PRACTICE_DETAILS_ROUTE = "/practice-details";
export const VIEW_APPOINTMENTS_ROUTE = "/view-appointments";
export const FORM_BUILDER_EDIT_ROUTE = "/form-builder/edit";
export const PUBLIC_APPOINTMENT_ROUTE = "/public-appointment";
export const ADD_TEST_SPECIMEN_ROUTE = "/lab-test/addSpecimen";
export const PRACTICE_MANAGEMENT_ROUTE = "/practice-management";
export const PATIENT_INFORMATION_ROUTE = "/patient-information";
export const TWO_FA_AUTHENTICATION_ROUTE = "/2FA-authentication";
export const FACILITY_SERVICES_ROUTE = "/list-facility-services";
export const ADD_LAB_ORDERS_RESULTS_ROUTE = "/lab-orders/result/add";
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
export const INSURANCE_ELIGIBILITY_ROUTE = `/insurance-eligibility`;
export const ICD_10_ROUTE = `/icd-10`;
export const CPT_CODE_ROUTE = `/cpt-code`;
export const NDC_ROUTE = `/ndc-code`;
export const MVX_ROUTE = `/mvx-code`;
export const CVX_ROUTE = `/cvx-code`;
export const VACCINE_PRODUCT_ROUTE = `/vaccine-product`;
export const ROOM_ROUTE = `/room`;
export const IMAGING_TEST_ROUTE = `/imaging-test`;

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
export const UPDATE_TRIAGE_NOTES = "Triage notes is updated successfully."
export const NO_CAMERA_FOUND = "No Camera found"
export const OPEN_CAMERA = "Open Camera"
export const LONG_URL_TEXT = "URL";
export const SHORT_URL_TEXT = "Short URL";
export const MIN_LENGTH_MESSAGE = "Text too short";
export const ZIP_VALIDATION_MESSAGE = "Invalid Zip code";
export const REQUIRED_MESSAGE = "This field is required";
export const DATE_VALIDATION_MESSAGE = "Date is invalid";
export const PASSWORD_NOT_MATCHED = "Password doesn't match";
export const TEST_FIELD_VALIDATION_MESSAGE = "Test is required";
export const TESTS_FIELD_VALIDATION_MESSAGE = "Atleast one test is required";
export const DOB_VALIDATION_MESSAGE = "Date of birth is invalid";
export const DELETE_REQUEST_INFO = "This will delete the request.";
export const NO_NUMBER_ERROR_MESSAGE = "Numbers are not acceptable";
export const ROUTING_NO_VALIDATION_MESSAGE = `Invalid routing number`;
export const BANK_ACCOUNT_VALIDATION_MESSAGE = "Invalid bank account.";
export const SSN_VALIDATION_MESSAGE = "SSN valid format is NNN-NN-NNNN";
export const NDC_VALIDATION_MESSAGE = `NDC valid format is ${NDC_FORMAT}`;
export const CLIA_VALIDATION_MESSAGE = "CLIA should be 10-alphanumeric";
export const TID_VALIDATION_MESSAGE = "Tax ID valid format is xxxxxxxxx";
export const NPI_VALIDATION_MESSAGE = "NPI should be a 10-digit combination";
export const INVALID_END_TIME = "End time should be greater than start time";
export const SPECIMEN_FIELD_VALIDATION_MESSAGE = "Specimen Type is required";
export const REACTIONS_VALIDATION_MESSAGE = "At least one reaction is required";
export const DIAGNOSES_VALIDATION_MESSAGE = "At least one diagnose is required";
export const EIN_VALIDATION_MESSAGE = "EIN should be NN-NNNNNNN, dash is optional";
export const PLEASE_ADD_DOCUMENT = "Please upload or drag and drop the documents here";
export const PLEASE_CLICK_TO_UPDATE_DOCUMENT = "Please click here to update the documents";
export const UPIN_VALIDATION_MESSAGE = "UPIN should be six-place alpha numeric identifiers";
export const NO_WHITE_SPACING_ERROR_MESSAGE = "White-spaces at beginning is not acceptable";
export const REVENUE_CODE_VALIDATION_MESSAGE = "Revenue code should be a 4-digit combination";
export const INVALID_DEA_DATE_ERROR_MESSAGE = "DEA Term date should be after DEA Active date";
export const INVALID_EXPIRATION_DATE_ERROR_MESSAGE = "Expiration date should be after Effective date";
export const INVALID_BILL_FEE_MESSAGE = 'Invalid bill fee';
export const INVALID_UNIT_MESSAGE = 'Invalid unit'
export const INVALID_AMOUNT_MESSAGE = 'Invalid amount'
export const NO_SPECIAL_CHAR_ERROR_MESSAGE = "Special characters (!@#$%^&*) are not acceptable";
export const NUMBER_AND_SPECIAL_ERROR_MESSAGE = "Numbers and Special characters (!@#$%^&*) are not acceptable";
export const DELETE_USER_INFO = "This will delete all the information associated with the user.";
export const minDobValidMessage = (label: string) => `${label}'s age should be more that 20-years`;
export const maxDobValidMessage = (label: string) => `${label}'s age should be less that 100-years`;
export const INVALID_LICENSE_DATE_ERROR_MESSAGE = "License Term date should be after License Active date";
export const FACILITY_CODE_VALIDATION_MESSAGE = "Facility code can only be capital alphabets 2-5 in length";
export const NO_WHITE_SPACING_AT_BOTH_ENDS_ERROR_MESSAGE = "White-spaces at beginning or ending is not acceptable";
export const MAMMOGRAPHY_VALIDATION_MESSAGE = "Valid mammography certification number format is like REF-EW-111111";
export const DESCRIPTION_INVALID_MESSAGE = "White-spaces at start and special characters (!@#$%^&*) are not acceptable";
export const NO_DECIMAL_REQUIRED = "Only numbers without decimal required"
export const ValidOTP = () => 'Please enter only numbers';
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
export const INVALID_OTP_CODE = "Invalid otp code";
export const SCHEDULE_START = "Schedule Start Time";
export const INVALID_EMAIL = "Invalid email address";
export const LOGIN_SUCCESSFULLY = "Welcome to AIMED";
export const OTP_WRONG_MESSAGE = "OTP code is wrong.";
export const PATIENT_NOT_FOUND = "Patient not found!";
export const SERVICE_NOT_FOUND = "Service not found!";
export const APPOINTMENT_CANCEL = "Appointment Cancel";
export const FACILITY_NOT_FOUND = "Facility not found!";
export const PRACTICE_NOT_FOUND = "Practice not found!";
export const LOCATION_NOT_FOUND = "Location not found!";
export const SCHEDULE_NOT_FOUND = "Schedule not found!";
export const CANT_DELETE_ROLE = "Role can't be deleted.";
export const SELECT_DAY_MESSAGE = "Please select a day!";
export const STAFF_ALREADY_EXIST = "Staff already exists";
export const DROP_FIELD = "Please drop at least one field";
export const DRAG_FIELD = "Please drag at least one field";
export const CHANGES_SAVED = "Changes saved successfully!";
export const CANT_DELETE_STAFF = "Staff can't be deleted.";
export const ROLE_CREATED = "Role is created successfully";
export const ROLE_UPDATED = "Role is updated successfully";
export const STAFF_CREATED = "Staff created successfully!";
export const STAFF_UPDATED = "Staff updated successfully!";
export const BAD_REQUEST_EXCEPTION = "BadRequestException";
export const SOMETHING_WENT_WRONG = "Something went wrong!";
export const TRY_AGAIN = "Something went wrong. Try again!";
export const NO_FACILITY_MESSAGE = "No facility exists yet!";
export const APPOINTMENT_NOT_FOUND = "Appointment not found!";
export const TOKEN_EXPIRED = "Verification token is expired.";
export const CANT_DELETE_USER = "This user can't be deleted.";
export const MAINTENANCE_ALERT = "Maintenance is in progress";
export const SCHEDULE_WITH_DOCTOR = "Schedule with provider: ";
export const CANT_DELETE_DOCTOR = "Provider can't be deleted.";
export const DOCTOR_CREATED = "Provider created successfully!";
export const DOCTOR_UPDATED = "Provider updated successfully!";
export const SCHEDULED_IN_FACILITY = "Scheduled in facility: ";
export const SERVICE_CREATED = "Service created successfully!";
export const SERVICE_UPDATED = "Service updated successfully!";
export const CANT_DELETE_PATIENT = "Patient can't be deleted.";
export const INVOICE_CREATED = "Invoice created successfully!";
export const PATIENT_CREATED = "Patient created successfully!";
export const PATIENT_UPDATED = "Patient updated successfully!";
export const CANT_DELETE_SERVICE = "Service can't be deleted.";
export const PROFILE_UPDATE = "Profile is updated successfully";
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
export const PREVIEW_IS_NOT_AVAILABLE = "Preview isn't available!";
export const NO_USER_WITH_EMAIL = "No user found with this email.";
export const PERMISSIONS_SET = "Role Permissions set successfully";
export const CANT_DELETE_AGREEMENT = "Agreement can't be deleted.";
export const FAILED_TO_CREATE_PATIENT = "Failed to create patient!";
export const FAILED_TO_UPDATE_PATIENT = "Failed to update patient!";
export const FORBIDDEN_ROUTE = "This resource is forbidden for you!";
export const PLEASE_SELECT_MEDIA = "Please select a file to upload!";
export const ATTACHMENT_DELETED = "Attachment deleted successfully!";
export const VALID_PASSWORD_MESSAGE = "Please enter valid password.";
export const NO_ASSOCIATED_PRACTICE = "No associated practice found!";
export const ORDER_DELETION_MESSAGE = "Order is deleted successfully";
export const ALREADY_ACTIVATED_MESSAGE = "User is already activated.";
export const NO_FILE_ASSOCIATED = 'No File Associated with agreement';
export const TWO_FA_ENABLED_SUCCESSFULLY = "2FA enabled successfully";
export const CANT_UPDATE_SYSTEM_ROLES = "System roles can't be update";
export const OLD_PASSWORD_DID_NOT_MATCH = "Old password didn't match!";
export const APPOINTMENT_NOT_FOUND_EXCEPTION = "Appointment not found";
export const CANT_UPDATE_APPOINTMENT = "Appointment can't be updated.";
export const TWO_FA_DISABLED_SUCCESSFULLY = "2FA disabled successfully";
export const EMAIL_OR_USERNAME_ALREADY_EXISTS = "Email already exists!";
export const ROLE_ALREADY_EXIST = "Role already exists with this name!";
export const CANT_DELETE_FEE_SCHEDULE = "Fee Schedule can't be deleted.";
export const CANT_DELETE_CLAIM_STATUS = "Claim Status can't be deleted.";
export const CANT_BOOK_APPOINTMENT = "You can not book this appointment.";
export const ALREADY_DEACTIVATED_MESSAGE = "User is already deactivated.";
export const PATIENT_ALLERGY_ADDED = "Patient allergy added successfully!";
export const PATIENT_PROBLEM_ADDED = "Patient problem added successfully!";
export const PATIENT_SURGICAL_HISTORY_ADD = "Patient surgical history added successfully!"
export const CANT_CANCELLED_APPOINTMENT = "Appointment can't be cancelled.";
export const INSURANCE_CARD_DELETED = 'Insurance Card deleted successfully';
export const ADMIN_PORTAL_MESSAGE = "Please sign in to explore Admin Portal.";
export const NOT_SUPER_ADMIN_MESSAGE = "Only Admins can access Admin Portal!";
export const EMERGENCY_ACCESS_UPDATE = "Emergency Access updated successfully";
export const PATIENT_ALLERGY_UPDATED = "Patient allergy updated successfully!";
export const OTP_NOT_FOUND_EXCEPTION_MESSAGE = "Precondition Failed Exception";
export const PATIENT_PROBLEM_UPDATED = "Patient problem updated successfully!";
export const PATIENT_MEDICATION_UPDATED = "Patient medication updated successfully!";
export const PATIENT_SURGICAL_HISTORY_UPDATED = "Patient surgical history updated successfully!";
export const RESET_PASSWORD_MESSAGE = "Please enter your new secure password.";
export const PATIENT_ALLERGY_DELETED = "Patient allergy deleted successfully!";
export const PATIENT_PROBLEM_DELETED = "Patient problem deleted successfully!";
export const APPOINTMENT_REASON_DELETED = "Appointment Reason deleted successfully!";
export const APPOINTMENT_CHIEF_COMPLAINT_DELETED = "Chief Complaint deleted successfully!";
export const PATIENT_SURGICAL_HISTORY_DELETE = "Patient surgical history removed successfully!"
export const PATIENT_MEDICATION_ADD = "Patient medication added successfully"
export const MEDICATION_PROBLEM_DELETED = "Medication deleted successfully";
export const SCHEDULE_CREATED_SUCCESSFULLY = "Schedule is booked successfully";
export const SET_PASSWORD_SUCCESS = "Your password has been set successfully.";
export const SCHEDULE_UPDATED_SUCCESSFULLY = "Schedule is updated successfully";
export const TRANSACTION_PAID_SUCCESSFULLY = "Transaction is paid successfully";
export const PATIENT_PROVIDER_UPDATED = "Patient Provider updated successfully!";
export const PRECONDITION_FAILED_EXCEPTION_MESSAGE = "Resource can't be deleted.";
export const PATIENT_EMAIL_PHONE_INFO_MISSING = "Patient Email or Phone Info missing"
export const PATIENT_CANT_BE_INVITED = "Some information is missing. Patient can't be invited";
export const RESET_TOKEN_EXPIRED = "Reset password token is expired. Please generate a new one!";
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
export const UPFRONT_PAYMENT_SUCCESS =
  "UpFront Payment Saved Successfully";
export const APPOINTMENT_STATUS_UPDATED_SUCCESSFULLY =
  "Appointment status is updated successfully";
export const APPOINTMENT_REMINDER_SENT_SUCCESSFULLY =
  "Appointment reminder is sent successfully";
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
  "Agreement created successfully";
export const UPDATE_AGREEMENT_MESSAGE =
  "Agreement updated successfully";
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
export const PORTAL_ACCESS_TITLE = "AIMED Patient Portal Access";
export const PORTAL_ACCESS_DESCRIPTION =
  "AIMED Patient portal access allows patient to have access to his records, appointments and other utilties in one place. It helps user to stay connected to their facility in a better way."
export const UPIN_INFO =
  "A unique physician identification number (UPIN) was a six-character alpha-numeric identifier used by Medicare to identify providers in the United States.";
export const CLIA_ID_NUMBER_INFO =
  "This number is used to identify and track your laboratory throughout its entire history. Each CLIA number consists of ten alphanumeric digits";
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const YEARS = [2017, 2018, 2019, 2020, 2021, 2022]
export const COVERAGE_SUMMARY_COLUMNS = ['Health Benefit Plan Coverage', 'Professional (Physician) Visit - Office', 'Urgent Care']

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
  }
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
    name: LIVE_CLAIM_FEED,
    link: CLAIM_FEED_ROUTE
  },
  {
    name: CLAIM_STATUS,
    link: CLAIM_STATUS_ROUTE
  }
];

export const MAPPED_WIDGETS: SelectorOption[] = [
  { id: "one", name: "one" },
  { id: "two", name: "two" },
  { id: "three", name: "three" },
  { id: "four", name: "four" },
];

export const LANGUAGE_SPOKEN_OPTIONS: SelectorOption[] = [
  { id: "English", name: "English" },
  { id: "Arabic", name: "Arabic" },
  { id: "Chinese", name: "Chinese" },
  { id: "French", name: "French" },
  { id: "German", name: "German" },
  { id: "Russian", name: "Russian" },
  { id: "Spanish", name: "Spanish" },
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

export const MAPPED_SPECIALTIES = sortingValue(mapEnumWithCode<typeof Speciality>(Speciality))
export const MAPPED_SERVICE_CODES = sortingValue(mapEnumWithCode<typeof ServiceCode>(ServiceCode))

export const MAPPED_MARITAL_STATUS: SelectorOption[] = [
  { id: Maritialstatus.Single, name: formatValue(Maritialstatus.Single) },
  { id: Maritialstatus.Married, name: formatValue(Maritialstatus.Married) },
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

export const TIME_DURATION_OPTIONS: SelectorOption[] = [
  { id: "every day", name: "every day" },
  { id: "twice a day", name: "twice a day" },
  { id: "3 times a day", name: "3 times a day" },
  { id: "4 times a day", name: "4 times a day" },
  { id: "5 times a day", name: "5 times a day" },
  { id: "6 times a day", name: "6 times a day" },
  { id: "every other day", name: "every other day" },
  { id: "every hour", name: "every hour" },
  { id: "every 2 hours", name: "every 2 hours" },
  { id: "every 3-4 hours", name: "every 3-4 hours" },
  { id: "every 4 hours", name: "every 4 hours" },
  { id: "every 4-6 hours", name: "every 4-6 hours" },
  { id: "every 6 hours", name: "every 6 hours" },
  { id: "every 6-8 hours", name: "every 6-8 hours" },
  { id: "every 8 hours", name: "every 8 hours" },
  { id: "every 12 hours", name: "every 12 hours" },
  { id: "every 24 hours", name: "every 24 hours" },
  { id: "every 72 hours", name: "every 72 hours" },
  { id: "every week", name: "every week" },
  { id: "twice a week", name: "twice a week" },
  { id: "3 times a week", name: "3 times a week" },
  { id: "every 2 weeks", name: "every 2 weeks" },
  { id: "every 3 weeks", name: "every 3 weeks" },
  { id: "every 4 weeks", name: "every 4 weeks" },
  { id: "every month", name: "every month" },
  { id: "every 2 months", name: "every 2 months" },
  { id: "every 3 months", name: "every 3 months" },
  { id: "as needed", name: "as needed" },
];

export const STOP_REASON_OPTIONS: SelectorOption[] = [
  { id: "adverse reaction", name: "adverse reaction" },
  { id: "end of course", name: "end of course" },
  { id: "ineffective", name: "ineffective" },
  { id: "not in stock", name: "not in stock" },
  { id: "off formulary", name: "off formulary" },
  { id: "patient refused", name: "patient refused" },
  { id: "stopped by PCP", name: "stopped by PCP" },
  { id: "stopped by specialist", name: "stopped by specialist" },
  { id: "too expensive", name: "too expensive" },
  { id: "unknown", name: "unknown" },
];

export const ORAL_ROUTE_OPTIONS = [
  { id: "before meals", name: "before meals" },
  { id: "with meals", name: "with meals" },
  { id: "after meals", name: "after meals" },
  { id: "in the morning", name: "in the morning" },
  { id: "at noon", name: "at noon" },
  { id: "in the evening", name: "in the evening" },
  { id: "at dinner", name: "at dinner" },
  { id: "at bedtime", name: "at bedtime" },
  { id: "around the clock", name: "around the clock" },
  { id: "as directed", name: "as directed" },
  { id: "as needed", name: "as needed" },
]


export const TABLET_UNIT_OPTIONS: SelectorOption[] = [
  { id: "mg", name: "mg" },
  { id: "mL", name: "mL" },
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

export const MAPPED_CONTACT_RELATIONSHIP_TYPE: SelectorOption[] = [
  { id: RelationshipType.Spouse, name: formatValue(RelationshipType.Spouse) },
  { id: RelationshipType.Parent, name: formatValue(RelationshipType.Parent) },
  { id: RelationshipType.Child, name: formatValue(RelationshipType.Child) },
  { id: RelationshipType.Sibling, name: formatValue(RelationshipType.Sibling) },
  { id: RelationshipType.Friend, name: formatValue(RelationshipType.Friend) },
  { id: RelationshipType.Cousin, name: formatValue(RelationshipType.Cousin) },
  { id: RelationshipType.Guardian, name: formatValue(RelationshipType.Guardian) },
  { id: RelationshipType.Other, name: formatValue(RelationshipType.Other) }]

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
    id: RelationshipType.FosterChild,
    name: formatValue(RelationshipType.FosterChild),
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
    id: RelationshipType.InjuredPlaintiff,
    name: formatValue(RelationshipType.InjuredPlaintiff),
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
    id: RelationshipType.StepsonStepdaughterStepmotherInsurance,
    name: formatValue(RelationshipType.StepsonStepdaughterStepmotherInsurance),
  },
  {
    id: RelationshipType.StepsonStepdaughterStepfatherInsurance,
    name: formatValue(RelationshipType.StepsonStepdaughterStepfatherInsurance),
  },
];

export const StepperIcons: { [index: string]: number } = {};

export const PATIENT_REGISTRATION_STEPS: StepLabelType[] = [
  { title: "Patient Information" },
  { title: "Document Verification" },
];

// Appointment Tabs
export const APPOINTMENT_TABS = [
  {
    title: "Upcoming Appointments",
    value: "1",
  },
  {
    title: "Past Appointments",
    value: "2",
  },
];

// Breadcrumb links
export const SERVICES_BREAD = (facilityId: string) => {
  return { text: SERVICES, link: `${FACILITIES_ROUTE}/${facilityId}${FACILITY_SERVICES_ROUTE}` }
}

export const FACILITIES_BREAD = { text: FACILITIES_LISTING, link: FACILITIES_ROUTE, };
export const ELIGIBILITY_BREAD = { text: ELIGIBILITY_LISTING, link: ELIGIBILITY_ROUTE, };
export const COVERAGE_BREAD = { text: COVERAGE_DETAILS, link: COVERAGE_ROUTE, };

export const FEE_SCHEDULE_BREAD = { text: FEE_SCHEDULE_LISTING, link: FEE_SCHEDULE_ROUTE, };

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
export const SMS_BREAD = { text: SEND_SMS_TEXT, link: "" };
export const PATIENT_CHART_BREAD = { text: PATIENT_CHART, link: "" };
export const CHECK_ELIGIBILITY_BREAD = { text: CHECK_ELIGIBILITY, link: "" };
export const PATIENT_VITAL_BREAD = { text: PATIENT_VITAL_TEXT, link: "" };
export const PATIENT_EDIT_BREAD = { text: EDIT_PATIENT, link: "" };
export const STAFF_NEW_BREAD = { text: ADD_STAFF, link: `${STAFF_ROUTE}/new` };
export const STAFF_EDIT_BREAD = { text: EDIT_STAFF, link: "" };
export const DASHBOARD_BREAD = { text: DASHBOARD_TEXT, link: DASHBOARD_ROUTE };
export const USERS_BREAD = { text: USERS_TEXT, link: "" };
export const APPOINTMENTS_BREAD = { text: APPOINTMENTS_TEXT, link: "" };
export const SCHEDULE_BREAD = { text: SCHEDULE_TEXT, link: "" };
export const SETTINGS_BREAD = { text: SETTINGS_TEXT, link: SETTINGS_ROUTE };
export const EMERGENCY_ACCESS_BREAD = { text: EMERGENCY_ACCESS, link: '' };
export const BILLING_BREAD = { text: BILLING_TEXT, link: "" };
export const REPORTS_BREAD = { text: REPORTS_TEXT, link: "" };
export const LAB_RESULTS_BREAD = { text: LAB_RESULTS_TEXT, link: LAB_RESULTS_ROUTE, };
export const EDIT_LAB_RESULTS_BREAD = { text: LAB_RESULTS_TEXT, link: '', };
export const LAB_ORDER_BREAD = { text: LAB_ORDER, link: LAB_ORDER, };
export const LAB_SPECIMEN_BREAD = { text: LAB_SPECIMEN, link: LAB_SPECIMEN, };
export const AGREEMENTS_BREAD = { text: AGREEMENTS, link: AGREEMENTS_ROUTE, };
export const AUDIT_LOG_BREAD = { text: AUDIT_LOG, link: AUDIT_LOG_ROUTE, };
export const AGREEMENTS_NEW_BREAD = { text: ADD_AGREEMENT, link: `${AGREEMENTS_ROUTE}/new`, };
export const CLAIM_STATUS_NEW_BREAD = { text: CLAIM_STATUSES, link: '', };
export const AGREEMENTS_EDIT_BREAD = { text: EDIT_AGREEMENT, link: "", };

export const INVOICES_BREAD = { text: INVOICES_TEXT, link: INVOICES_ROUTE };
export const VIEW_APPOINTMENTS_BREAD = {
  text: VIEW_APPOINTMENTS_TEXT,
  link: VIEW_APPOINTMENTS_ROUTE,
};

export const CALENDAR_VIEW_APPOINTMENTS_BREAD = { text: CALENDAR_VIEW_TEXT, link: CALENDAR_ROUTE, };
export const INSURANCE_ELIGIBILITY_TEXT_BREAD = { text: INSURANCE_ELIGIBILITY_TEXT, link: INSURANCE_ELIGIBILITY_ROUTE, };

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
    title: "Appointments",
    value: "3",
  },
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
  // {
  //   title: "Portal Access",
  //   value: "9",
  // },
  {
    title: "Lab Orders",
    value: "10",
  },
  {
    title: "Care Team",
    value: "11",
  },
  {
    title: "Receivables",
    value: "12",
  },
];

export const DOCTOR_TOP_TABS = [
  {
    title: "Provider Profile",
    value: "1",
  },
  {
    title: "Providers Schedule",
    value: "2",
  },
  {
    title: "Providers Appointments",
    value: "3",
  },
];

export const BILLING_TABS = [
  {
    title: "ICD & CPT",
    value: "1",
  },
  {
    title: "Insurance",
    value: "2",
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

export const dummyAppointmentData = {
  appTime: "16:30 - 17:00",
  timeVariant: "PM",
  patientName: "John Doe",
  patientDOB: "12-01-1990",
  patientTel: "(333)123-4567",
  patientStatus: "Status",
  patientElg: "Eligibility Issue",
};

export const DUMMY_OPTION = {
  id: ADD_PATIENT_MODAL,
  name: ADD_PATIENT_MODAL
}

export enum ITEM_MODULE {
  snoMedCode = 'SnoMedCode',
  insurance = 'insurance',
  documentTypes = 'documentTypes',
  icdCodes = 'IcdCodes',
  cptCode = 'CPT Code',
  claimStatus = 'claimStatus',
  feeSchedule = 'feeSchedule',
  cptFeeSchedule = 'cptFeeSchedule',
  taxonomies = 'taxonomies',
}

export enum TABLE_SELECTOR_MODULES {
  icdCodes = 'IcdCodes',
  cptCode = 'CPTCode',
  hcpcsCode = 'HCPCSCode',
  customCode = 'CustomCode'
}

export enum CARD_LAYOUT_MODAL {
  Allergies = 'Allergies',
  ICDCodes = 'ICDCodes',
}

export enum UPFRONT_PAYMENT_TYPES {
  Copay = 'Copay',
  Additional = 'Additional',
  Previous = 'Previous'
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
  Agreements = 'Agreements',
  Attachments = 'Attachments',
  Appointment = "Appointment",
  EmergencyAccess = "Emergency Access",
}

export const MODULES = [
  "User",
  "Practice",
  "Facility",
  "Emergency Access",
  "Provider",
  "Staff",
  "Patient",
  "Appointment",
  "Service",
  "Schedule",
  'Agreements',
  "Lab Orders",
  'Attachments',
  "Patient Charting",
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
    label: "With Provider",
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

export const INVENTORY_ITEMS = [
  {
    name: ICD_TEN,
    link: ICD_10_ROUTE,
    desc: ICD_TEN_DESCRIPTION,
  },
  {
    name: CPT_CODES,
    link: CPT_CODE_ROUTE,
    desc: CPT_CODES_DESCRIPTION,
  },
  {
    name: NDC_TEXT,
    link: NDC_ROUTE,
    desc: NDC_DESCRIPTION,
  },
  {
    name: MVX_TEXT,
    link: MVX_ROUTE,
    desc: MVX_DESCRIPTION,
  },
  {
    name: CVX_TEXT,
    link: CVX_ROUTE,
    desc: CVX_DESCRIPTION,
  },
  {
    name: VACCINE_PRODUCT_TEXT,
    link: VACCINE_PRODUCT_ROUTE,
    desc: VACCINE_PRODUCT_DESCRIPTION,
  },
  {
    name: IMAGING_TEST_TEXT,
    link: IMAGING_TEST_ROUTE,
    desc: IMAGING_TEST_DESCRIPTION,
  },

  // {
  //   name: MEDICINES,
  //   link: "/",
  //   desc: MEDICINES_DESCRIPTION,
  // },
  // {
  //   name: TESTS,
  //   link: "/",
  //   desc: TESTS_DESCRIPTION,
  // },
  // {
  //   name: ICT_NINE,
  //   link: "/",
  //   desc: ICT_NINE_DESCRIPTION,
  // },
];

export const APPOINTMENT_SETTINGS_ITEMS = [
  {
    name: CANCELLED_APPOINTMENT,
    link: "/",
    desc: CANCELLED_APPOINTMENT_DESCRIPTION,
  },
];

export const MAPPED_SECTION = [
  {
    label: getTemplateLabel(TemplateType.Hpi),
    value: TemplateType.Hpi
  },
  {
    label: getTemplateLabel(TemplateType.PhysicalExam),
    value: TemplateType.PhysicalExam
  },
  {
    label: getTemplateLabel(TemplateType.ReviewOfSystem),
    value: TemplateType.ReviewOfSystem
  },
  {
    label: getTemplateLabel(TemplateType.AssessmentPlan),
    value: TemplateType.AssessmentPlan
  },
]

export const CLINICAL_ITEMS = [
  {
    name: FORM_BUILDER,
    link: FORM_BUILDER_ROUTE,
    desc: FORM_BUILDER_DESCRIPTION,
  },
  {
    name: AUDIT_LOG,
    link: AUDIT_LOG_ROUTE,
    desc: AUDIT_LOG_DESCRIPTION,
  },
  {
    name: MACROS,
    link: MACROS_ROUTE,
    desc: MACRO_DESCRIPTION,
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
  { id: 'Corrupted', name: 'Corrupted' },
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
  regex: '',
  pastEnable: true,
  futureEnable: true
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
  diagnosesIds: [EMPTY_MULTISELECT_OPTION]
};

export const UPFRONT_INITIAL_VALUES: UpFrontPaymentTypeProps = {
  amount: 0,
  type: { id: '', name: '' },
  notes: '',
  paymentType: UPFRONT_PAYMENT_TYPES.Copay
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

export const UPFRONT_TYPE_OPTIONS: SelectorOption[] = [
  { id: 'Cash', name: 'Cash' },
  { id: 'Check', name: 'Check' },
  { id: 'American Express', name: 'American Express' },
  { id: 'Mastercard', name: 'Mastercard' },
  { id: 'Visa', name: 'Visa' },
  { id: 'Discover', name: 'Discover' },
  { id: 'Other', name: 'Other' },
];

export const CHECK_IN_STEPS = [
  CHECK_IN,
  INTAKE,
  EXAM,
  SIGN_OFF,
  CHECKOUT_TEXT
  // PATIENT_INFO,
  // CHART_TEXT,
  // LAB_ORDERS,
  // BILLING_AND_INSURANCE,
];

export const ADD_INSURANCE_STEPS = [
  INSURANCE,
  POLICY_HOLDER,
  INSURANCE_CARD
];

export const LAB_ORDER_STEPS = [
  LAB_ORDER, PROVIDER_DETAILS, PAYMENT
];

export const LAB_ORDER_SIDEDRAWER_STEPS = [
  LAB_ORDER,
  // TESTS,
  // PAYMENTS
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

export const RegisterPatientMenuNav = [
  {
    title: IDENTIFICATION,
  },
  {
    title: EMERGENCY_CONTACT,
  },
  {
    title: DEMOGRAPHICS,
  },
  {
    title: PRIVACY,
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

export enum USER_PERMISSIONS {
  me = 'me',
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
  addPatientVital = "addPatientVital",
  fetchAllAgreements = 'fetchAllAgreements',
  fetchAgreement = 'fetchAgreement',
  removeAgreement = 'removeAgreement',
  updateAgreement = 'updateAgreement',
  createAgreement = 'createAgreement',
  updatePatientProviderRelation = 'updatePatientProviderRelation'
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
    permission: USER_PERMISSIONS.getPractice,
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
  {
    name: FFE_SCHEDULE,
    link: FEE_SCHEDULE_ROUTE,
    desc: FEE_SCHEDULE_DESCRIPTION,
    permission: USER_PERMISSIONS.createStaff // NEED TO UPDATE THIS *****************************
  }
];

export const MISCELLANEOUS_SETTINGS_ITEMS = [
  {
    name: AGREEMENTS,
    link: AGREEMENTS_ROUTE,
    desc: AGREEMENTS_DESCRIPTION,
    permission: USER_PERMISSIONS.fetchAllAgreements,
  },
  {
    name: CLAIM_STATUSES,
    link: CLAIM_STATUSES_ROUTE,
    desc: CLAIM_STATUSES_DESCRIPTION,
  },
  {
    name: LAB_RESULTS_TEXT,
    link: LAB_RESULTS_ROUTE,
    desc: LAB_RESULTS_DESCRIPTION,
  },
  {
    name: SEND_SMS_TEXT,
    link: SEND_SMS_ROUTE,
    desc: SEND_SMS_DESCRIPTION,
  },
  {
    name: INSURANCE_ELIGIBILITY_TEXT,
    link: INSURANCE_ELIGIBILITY_ROUTE,
    desc: INSURANCE_ELIGIBILITY_DESCRIPTION,
  },
  {
    name: ROOM_TEXT,
    link: ROOM_ROUTE,
    desc: ROOM_DESCRIPTION,
  }
];

export const TELEHEALTH_URL = 'https://doxy.me';
export const EXPRESS_HEALTHCARE_URL = "https://www.expresshealthcaremd.com/wp-content/uploads/2022/04/new-transparent-logo.png";

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
    name: formatValue(DoctorPatientRelationType.RenderingProvider),
    id: DoctorPatientRelationType.RenderingProvider,
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

// export const AUDIT_LOG_SCHEDULE = [
// { id: ScheduleType.Day, name: 'Day' },
// { id: ScheduleType.Week, name: 'Week' },
// { id: ScheduleType.Month, name: 'Month' },
// { id: ScheduleType.Year, name: 'Year' },
// ]

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
  { id: "7", name: '7 Days', time: 604800 * 1000 },
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
    type: 'areaspline',
    styledMode: false,
    renderTo: 'container',
    backgroundColor: "#ffffff",
    marginBottom: 0,

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
      fillColor: '#F6E4E5',
    },
    column: {
      pointPadding: 0.4,
      borderWidth: 0,
      borderRadius: 4,
    },
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
    type: 'areaspline',
    styledMode: false,
    backgroundColor: "#ffffff",
    renderTo: 'container',
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

export const CLAIM_SUCCESS_MESSAGES = [
  "Claim Submitted Successfully",
  "Claim Created Successfully"
]

export const TRIAGE_NOTE_OPTION = {
  icon: TriageIcon,
  title: "Triage Notes",
  value: "1",
}

export const PATIENT_CHARTING_TABS = [
  {
    icon: VitalsIcon,
    title: "Vitals",
    value: "2",
  },
  {
    icon: ProblemsIcon,
    title: "Problems",
    value: "3",
  },
  {
    icon: AllergiesIcon,
    title: "Allergies",
    value: "4",
  },
  {
    icon: MedicationIcon,
    title: "Medication",
    value: "5",
  },
  {
    icon: HistoryIcon,
    title: "History",
    value: "6",
  },
  {
    icon: LabOrderIcon,
    title: "Lab Orders",
    value: "7",
  },
  {
    icon: VaccineIcon,
    title: "Vaccines",
    value: "8",
  },
]

export const REASON_FOR_VISIT_OPTION = {
  icon: ReasonForVisit,
  title: "Chief Complaint",
  value: "1",
}

export const VISIT_OPTION = {
  icon: ReasonForVisit,
  title: "Visits",
  value: "9",
}

// export const ASSESSMENT_PLAN_OPTION = {
//   icon: AssessmentPlanIcon,
//   title: "Assessment & Plan",
//   value: "10",
// }

// export const PATIENT_HISTORY_OPTION = {
//   icon: AssessmentPlanIcon,
//   title: "HPI",
//   value: "11",
// }

// export const REVIEW_OF_SYSTEM_OPTION = {
//   icon: AssessmentPlanIcon,
//   title: "ROS",
//   value: "12",
// }

export const EXAM_OPTION = {
  icon: AssessmentPlanIcon,
  title: "Exam",
  value: "1",
}

export const PATIENT_CHARTING_MENU = [
  {
    title: "Chief Complaint",
    value: "chief_complaint"
  },
  // {
  //   title: "Triage Notes",
  // },
  {
    title: "Vitals",
    value: 'vitals'
  },
  {
    title: "Problems",
    value: 'problems'
  },
  {
    title: "Allergies",
    value: 'allergies'
  },
  {
    title: "Medication",
    value: "medication",
  },
  {
    title: "Family History",
    value: 'family_history'
  },
  {
    title: "Surgical History",
    value: 'surgical_history'
  },
  {
    title: "Social History",
    value: 'social_history'
  },
  {
    title: "Lab Orders",
    value: 'lab_orders'
  },
  {
    title: "Vaccines",
    value: 'vaccines'
  },
  {
    title: "HPI",
    value: "history_of_present_illness"
  },
  {
    title: "ROS",
    value: "review_of_system"
  },
  {
    title: "PE",
    value: "physical_exam"
  },
  // {
  //   title: "Orders And Diagnoses",
  // }
]

export const HISTORY_CHARTING_TABS = [
  {
    title: "Social History",
    value: "1",
  },
  {
    title: "Family History",
    value: "2",
  },
  {
    title: "Surgical History",
    value: "3",
  },
]

export const EXAM_TABS = [
  {
    title: "Review",
    value: "1",
  },
  {
    title: "HPI",
    value: "2",
  },
  {
    title: "ROS",
    value: "3",
  },
  {
    title: "PE",
    value: "4",
  },
  {
    title: "Assessment & Plan",
    value: "5",
  },
]

export enum FormBuilderApiSelector {
  SERVICE_SLOT = 'serviceSlot',
  PAYMENT_TYPE = 'paymentType',
  SERVICE_SELECT = 'serviceSelect',
  PATIENT_CONSENT = 'patientConsent',
  TERMS_CONDITIONS = 'termsConditions',
  FACILITY_PROVIDERS = 'facilityProviders',
  INSURANCE_CARD_BACK = 'insuranceCardBack',
  PRACTICE_FACILITIES = 'practiceFacilities',
  DRIVING_LICENSE_BACK = 'drivingLicenseBack',
  INSURANCE_CARD_FRONT = 'insuranceCardFront',
  DRIVING_LICENSE_FRONT = 'drivingLicenseFront',
}

export enum FormBuilderPaymentTypes {
  INSURANCE = 'insurance',
  NO_INSURANCE = 'no_insurance',
  CONTRACT = 'contract',
  INTERNATIONAL_TRAVELER = 'international_traveler',
}

export const AUDIT_TIME_ENUMS = ['Day', 'Week', 'Month', 'Year']
export const BILLING_MODIFIERS_DATA = ['M1', 'M2', 'M3', 'M4']
export const DIAGNOSIS_POINTERS_DATA = ['ICD-1', 'ICD-2', 'ICD-3', 'ICD-4']


export const MODULE_LOGS_TYPES = [
  "Agreement",
  "Appointment",
  "Attachments",
  "DocumentTypes",
  "Billing",
  "Dashboard",
  "Facility",
  "Service",
  "Element",
  "Form",
  "UserForm",
  "Copay",
  "Insurance",
  "PolicyHolder",
  "Policy",
  "LabTestObservation",
  "LabTests",
  "LoincCodes",
  "TestSpecimen",
  "PatientAllergies",
  "Problem",
  "Vitals",
  "DoctorPatient",
  "Patient",
  "PatientConsent",
  "Invoice",
  "Payment",
  "Practice",
  "Staff",
  "Role",
  "Users",
  "Doctor",
  "Contact",
  "Schedule",
  "Permission",
  "RolePermission",
]

export enum SystemBillingStatuses {
  READY_TO_CLAIM = 'ready_to_claim',
  REJECTED = 'rejected',
  ACKNOWLEDGED = 'acknowledged'
}

export const formTemplateTabIds = {
  CONTACT_INFO: "contact_info",
  PAYMENT_INFO: "payment_info",
  PRIVACY_POLICY: "privacy_policy",
  EMPLOYMENT_INFO: "employment_info",
  SELECT_SERVICES: "select_services",
  GUARDIAN_CONTACT: "guardian_contact",
  PRIVACY_AGREEMENT: "privacy_agreement",
  GUARANTOR_CONTACT: "guarantor_contact",
  EMERGENCY_CONTACT: "emergency_contact",
  DOCUMENT_VERIFICATION: "document_verification",
  DEMOGRAPHICS: "demographics",
  PATIENT_INFO: "patient_info",
  TERMS_CONDITIONS: "terms_conditions"
}


export const SMS_TEMPLATES: SelectorOption[] = [
  {
    // id: `Please register on the following link: ${`${process.env.REACT_APP_URL}/login`}`,
    id: `Please register on the following link: https://app.aimed.healthcare/public/form/2f883f99-c220-427c-8cee-2c39e65e3ec9`,
    name: "Registration Link",
  },
  {
    id: `Your appointment is schedule at 7:30 on 08/31/2022.`,
    name: "Telehealth",
  },
  {
    id: `Please give us a review at: https://www.google.com`,
    name: "Review",
  },
]

export const MAPPED_APPOINTMENT_PAYMENT_TYPE = [
  {
    id: APPOINTMENT_PAYMENT_TYPE.CARD,
    name: PAY_VIA_CARD
  },
  {
    id: APPOINTMENT_PAYMENT_TYPE.CASH,
    name: PAY_VIA_CASH
  }
]

export const FAMILY_RELATIVE_MAPPED = [
  { id: "BROTHER", name: "Brother" },
  { id: "DAUGHTER", name: "Daughter" },
  { id: "FATHER", name: "Father" },
  { id: "MATERNAL_AUNT", name: "Maternal Aunt" },
  { id: "MATERNAL_GRANDFATHER", name: "Maternal Grandfather" },
  { id: "MATERNAL_GRANDMOTHER", name: "Maternal Grandmother" },
  { id: "MATERNAL_UNCLE", name: "Maternal Uncle" },
  { id: "MOTHER", name: "Mother" },
  { id: "PATERNAL_AUNT", name: "Paternal Aunt" },
  { id: "PATERNAL_GRANDFATHER", name: "Paternal Grandfather" },
  { id: "PATERNAL_GRANDMOTHER", name: "Paternal Grandmother" },
  { id: "PATERNAL_UNCLE", name: "Paternal Uncle" },
  { id: "SISTER", name: "Sister" },
  { id: "SON", name: "Son" },
  { id: "UNSPECIFIED", name: "Unspecified Relation" },
]


export const familyRelativeFormDefaultValue = {
  id: '',
  relative: { id: '', name: '' },
  onsetAge: '',
  died: '',
  notes: '',
}

// Social History
export const ACTIVITIES_OF_DAILY_LIVING = 'Activities of Daily Living';
export const ABLE_TO_CARE_YOURSELF = "Are you able to care for yourself?";
export const BLIND_OR_DO_YOU_HAVE_DIFFICULTY_SEEING = "Are you blind or do you have difficulty seeing?";
export const DEAF_OR_DO_YOU_HAVE_DIFFICULTY_SEEING = "Are you deaf or do you have serious difficulty hearing?";
export const DIFFICULTY_CONCENTRATING_MAKING_DECISION = "Do you have difficulty concentrating, remembering or making decisions?";
export const DIFFICULTY_WALKING_CLIMBING = "Do you have difficulty walking or climbing stairs?";
export const DIFFICULTY_DRESSING_BATHING = "Do you have difficulty dressing or bathing?";
export const DIFFICULTY_DOING_ERRANDS_ALONE = "Do you have difficulty doing errands alone?";
export const ARE_YOU_ABLE_TO_WALK = "Are you able to walk?";
export const DO_YOU_HAVE_TRANSPORTATION_DIFFICULTIES = "Do you have transportation difficulties?";
export const PUBLIC_HEALTH_TRAVEL = "Public Health and Travel";
export const HAVE_YOU_BEEN_TO_AN_AREA_KNOWN_HIGH_RISK = "Have you been to an area known to be high risk for COVID-19?";
export const IN_THE_14_DAYS_BEFORE_SYMPTOM_ONSET_CASE_ILL = "In the 14 days before symptom onset, have you had close contact with a laboratory-confirmed COVID-19 while that case was ill?";
export const IN_THE_14_DAYS_BEFORE_SYMPTOM_ONSET_PERSON_ILL = "In the 14 days before symptom onset, have you had close contact with a person who is under investigation for COVID-19 while that person was ill?";
export const RESIDE_IN_OR_HAVE_YOU_TRAVELED = "Do you reside in or have you traveled to an area where Ebola virus transmission is active?";
export const HAVE_YOU_PROCESSED_BLOOD_BODY_FLUIDS = "Have you processed blood or body fluids from an Ebola virus disease patient without appropriate PPE?";
export const HAVE_YOU_RECENTLY_PLANNING_TO_TRAVEL = "Have you recently or are you planning to travel to an area with Zika virus?";
export const SUBSTANCE_USE = "Substance Use";
export const DO_YOU_HAVE_EVER_SMOKED_TOBACCO = "Do you or have you ever smoked tobacco?";
export const DO_YOU_EVER_USED_TOBACCO_NICOTINE = "Do you or have you ever used any other forms of tobacco or nicotine?";
export const WHAT_WAS_DATE_OF_YOUR_MOST_RECENT_TOBACCO_SCREENING = "What was the date of your most recent tobacco screening?";
export const WHAT_IS_YOUR_LEVEL_OF_ALCOHOL_CONSUMPTION = "What is your level of alcohol consumption?";
export const DO_YOU_USE_ANY_ILLICIT = "Do you use any illicit or recreational drugs?";
export const WHAT_IS_YOUR_LEVEL_OF_CAFFEINE_CONSUMPTION = "What is your level of caffeine consumption?";
export const ADVANCED_DIRECTIVE = "Advanced Directive";
export const DO_YOU_HAVE_AN_ADVANCED_DIRECTIVE = "Do you have an advanced directive?";
export const IS_BLOOD_TRANSFUSION_ACCEPTABLE_IN_AN_EMERGENCY = "Is blood transfusion acceptable in an emergency?";
export const HOME_AND_ENVIRONMENT = "Home and Environment";
export const HAVE_THERE_BEEN_ANY_CHANGES_TO_YOUR_FAMILY = "Have there been any changes to your family or social situation?";
export const WHAT_TYPE_OF_CHILD_CARE_DO_YOU_USE = "What type of child care do you use?";
export const DO_YOU_HAVE_ANY_PETS = "Do you have any pets?";
export const DO_YOU_HAVE_SMOKE_AND_CARBON_MONOXIDE = "Do you have smoke and carbon monoxide detectors in your home?";
export const ARE_YOU_PASSIVELY_EXPOSED_TO_SMOKE = "Are you passively exposed to smoke?";
export const ARE_THERE_ANY_GUNS_PRESENT_HOME = "Are there any guns present in your home?";
export const WHAT_IS_FLUORIDE_STATUS_OF_YOUR_HOME = "What is the fluoride status of your home?";
export const DO_YOU_USE_INSECT_REPELLENT_ROUTINELY = "Do you use insect repellent routinely?";
export const DO_YOU_USE_SUNSCREEN = "Do you use sunscreen routinely?";
export const LIFESTYLE = "Lifestyle";
export const DO_YOU_FEEL_STRESSED = "Do you feel stressed (tense, restless, nervous, or anxious, or unable to sleep at night)?";
export const DO_YOU_WEAR_HELMET = "Do you wear a helmet when biking?";
export const DO_YOU_USE_SEAT_BELT = "Do you use your seat belt or car seat routinely?";
export const EDUCATION_AND_OCCUPATION = "Education and Occupation";
export const WHAT_IS_THE_HIGHEST_GRADE_OR_LEVEL_OF_SCHOOL_COMPLETED = "What is the highest grade or level of school you have completed or the highest degree you have received?";
export const ARE_YOU_CURRENTLY_EMPLOYED = "Are you currently employed?";
export const MARRIAGE_AND_SEXUALITY = "Marriage and Sexuality";
export const WHAT_IS_YOUR_RELATIONSHIP_STATUS = "What is your relationship status?";
export const ARE_YOU_SEXUALLY_ACTIVE = "Are you sexually active?";
export const HOW_MANY_CHILDREN_DO_YOU_HAVE = "How many children do you have?";
export const DIET_AND_EXERCISE = "Diet and Exercise";
export const WHAT_TYPE_OF_DIET_FOLLOWING = "What type of diet are you following?";
export const WHAT_IS_YOUR_EXERCISE_LEVEL = "What is your exercise level?";
export const HOW_MANY_DAYS_OF_MODERATE_TO_STRENUOUS_EXERCISE = "How many days of moderate to strenuous exercise, like a brisk walk, did you do in the last 7 days?";
export const WHAT_TYPES_OF_SPORTING_ACTIVITIES_PARTICIPATE = "What types of sporting activities do you participate in?";
export const GENDER_IDENTITY_LGBTQ_IDENTITY = "Gender Identity and LGBTQ Identity";
export const ASSIGNED_SEX_AT_BIRTH = "Assigned sex at birth";


// social selectors
export const ABLE_WALK_MAPPED = [
  { id: "RESTRICTIONS", name: "Yes: walks without restrictions" },
  { id: "ASSISTIVE", name: "Yes: walks with assistive device(s)" },
  { id: "SELF_MOBILITY", name: "Yes: limited self-mobility with assistive device(s); generally relies on wheeled mobility" },
  { id: "CONFINED", name: "No: Confined to chair" },
  { id: "INDEPENDENT_WHEELCHAIR", name: "No: Independent in wheelchair" },
  { id: "HELP_WHEELCHAIR", name: "No: Requires minimal help in wheelchair" },
  { id: "PUSHING_WHEELCHAIR", name: "No: Dependent on helper pushing wheelchair" },
  { id: "UNABLE_WALK", name: "No: Unable to walk" },
  { id: "UNABLE_INITIATE_WALKING", name: "No: Unable to initiate walking" },
  { id: "BED_RIDDEN", name: "No: Bed-ridden" },
]

export const SMOKED_TOBACCO_MAPPED = [
  { id: "NEVER_SMOKER", name: "Never smoker" },
  { id: "FORMER_SMOKER", name: "Former smoker" },
  { id: "EVERYDAY_SMOKER", name: "Current every day smoker" },
  { id: "SOME_DAY_SMOKER", name: "Current some days smoker" },
  { id: "STATUS_UNKNOWN", name: "Smoker - current status unknown" },
  { id: "EVER_SMOKED", name: "Unknown if ever smoked" },
  { id: "NOT_TOLERATED", name: "Not tolerated" },
  { id: "PATIENT_REFUSED", name: "Patient refused" },
  { id: "NOT_INDICATED", name: "Not indicated" },
]

export const ALCOHOL_CONSUMPTION_MAPPED = [
  { id: "NONE", name: "None" },
  { id: "OCCASIONAL", name: "Occasional" },
  { id: "MODERATE", name: "Moderate" },
  { id: "HEAVY", name: "Heavy" },
]

export const CAFFEINE_CONSUMPTION_MAPPED = [
  { id: "NONE", name: "None" },
  { id: "OCCASIONAL", name: "Occasional" },
  { id: "MODERATE", name: "Moderate" },
  { id: "HEAVY", name: "Heavy" },
]

export const CHILD_CARE_MAPPED = [
  { id: "NONE", name: "None" },
  { id: "RELATIVE", name: "Relative" },
  { id: "PRIVATE_SITTER", name: "Private sitter" },
  { id: "DAYCARE", name: "Daycare/preschool" },
]

export const FLUORIDE_STATUS_MAPPED = [
  { id: "FLUORIDATED", name: "Fluoridated" },
  { id: "NON_FLUORIDATED", name: "Non-fluoridated" },
  { id: "UNKNOWN", name: "Unknown" },
]

export const FEEL_STRESSED_MAPPED = [
  { id: "NOT_AT_ALL", name: "Not at all" },
  { id: "ONLY_LITTLE", name: "Only a little" },
  { id: "SOME_CONTEXT", name: "To some extent" },
  { id: "RATHER_MUCH", name: "Rather much" },
  { id: "VERY_MUCH", name: "Very much" },
]

export const HIGHEST_GRADE_MAPPED = [
  { id: "NEVER_ATTEND", name: "Never attended/kindergarten only" },
  { id: "FIRST_GRADE", name: "1st grade" },
  { id: "SECOND_GRADE", name: "2nd grade" },
  { id: "THIRD_GRADE", name: "3rd grade" },
  { id: "FORTH_GRADE", name: "4th grade" },
  { id: "FIFTH_GRADE", name: "5th grade" },
  { id: "SIXTH_GRADE", name: "6th grade" },
  { id: "SEVENTH_GRADE", name: "7th grade" },
  { id: "EIGHTH_GRADE", name: "8th grade" },
  { id: "NINTH_GRADE", name: "9th grade" },
  { id: "TENTH_GRADE", name: "10th grade" },
  { id: "ELEVENTH_GRADE", name: "11th grade" },
  { id: "TWELVE_GRADE", name: "12th grade, no diploma" },
  { id: "GED_EQUIVALENT", name: "GED or equivalent" },
  { id: "HIGH_SCHOOL_GRADUATE", name: "High school graduate" },
  { id: "NO_DEGREE", name: "Some college, no degree" },
  { id: "ASSOCIATE_DEGREE_VOCATIONAL", name: "Associate degree: occupational, technical, or vocational program" },
  { id: "ASSOCIATE_DEGREE_ACADEMIC", name: "Associate degree: academic program" },
  { id: "BACHELORS_DEGREE", name: "Bachelor's degree (e.g., BA, AB, BS)" },
  { id: "MASTERS_DEGREE", name: "Master's degree (e.g., MA, MS, MEng, MEd, MSW, MBA)" },
  { id: "PROFESSIONAL_SCHOOL_DEGREE", name: "Professional school degree (example: MD, DDS, DVM, JD)" },
  { id: "DOCTOR_DEGREE", name: "Doctoral degree (example:PhD, EdD)" },
  { id: "DONT_KNOW", name: "Don't know" },
  { id: "REFUSED", name: "Refused" },
]

export const RELATIONSHIP_STATUS_MAPPED = [
  { id: "UNKNOWN", name: "Unknown" },
  { id: "MARRIED", name: "Married" },
  { id: "SINGLE", name: "Single" },
  { id: "DIVORCED", name: "Divorced" },
  { id: "SEPARATED", name: "Separated" },
  { id: "WIDOWED", name: "Widowed" },
  { id: "DOMESTIC_PARTNER", name: "Domestic partner" },
  { id: "OTHER", name: "Other" },
]

export const DIET_TYPE_MAPPED = [
  { id: "REGULAR", name: "Regular" },
  { id: "VEGETARIAN", name: "Vegetarian" },
  { id: "VEGAN", name: "Vegan" },
  { id: "GLUTEN_FREE", name: "Gluten free" },
  { id: "SPECIFIC", name: "Specific" },
  { id: "CARBOHYDRATE", name: "Carbohydrate" },
  { id: "CARDIAC", name: "Cardiac" },
  { id: "DIABETIC", name: "Diabetic" },
]

export const EXERCISE_LEVEL_MAPPED = [
  { id: "NONE", name: "None" },
  { id: "OCCASIONAL", name: "Occasional" },
  { id: "MODERATE", name: "Moderate" },
  { id: "HEAVY", name: "Heavy" },
]

export const GENDER_IDENTITY_MAPPED = [
  { id: "MALE_IDENTIFIES", name: "Identifies as Male" },
  { id: "FEMALE_IDENTIFIES", name: "Identifies as Female" },
  { id: "TRANSGENDER_FTM", name: "Transgender Male/Female-to-Male (FTM)" },
  { id: "TRANSGENDER_MTF", name: "Transgender Female/Male-to-Female (MTF)" },
  { id: "GENDER_NON_CONFIRM", name: "Gender non-conforming (neither exclusively male nor female)" },
  { id: "GENDER_CATEGORY", name: "Additional gender category / other, please specify" },
  { id: "NOT_DISCLOSE", name: "Choose not to disclose" },
]

export const SEX_AT_BIRTH_MAPPED = [
  { id: "MALE", name: "Male" },
  { id: "FEMALE", name: "Female" },
  { id: "NOT_DISCLOSE", name: "Choose not to disclose" },
  { id: "UNKNOWN", name: "Unknown" },
]

export const PRONOUNS_MAPPED = [
  { id: "HE", name: "he/him" },
  { id: "SHE", name: "she/her" },
  { id: "THEY", name: "they/them" },
]

export const SEXUAL_ORIENTATION_MAPPED = [
  { id: "LESBIAN", name: "Lesbian, gay or homosexual" },
  { id: "STRAIGHT", name: "Straight or heterosexual" },
  { id: "BISEXUAL", name: "Bisexual" },
  { id: "SOMETHING_ELSE", name: "Something else, please describe" },
  { id: "DONT_KNOW", name: "Don't know" },
  { id: "NOT_DISCLOSE", name: "Choose not to disclose" },
]

export const ACTIVITIES_DAILY_LIVING_MAPPED = [
  {
    switchName: 'careYourself',
    title: ABLE_TO_CARE_YOURSELF,
    notesName: 'careYourselfNote',
  },
  {
    switchName: 'difficultySeeing',
    notesName: 'difficultySeeingNote',
    title: BLIND_OR_DO_YOU_HAVE_DIFFICULTY_SEEING,
  },
  {
    switchName: 'difficultyHearing',
    notesName: 'difficultyHearingNote',
    title: DEAF_OR_DO_YOU_HAVE_DIFFICULTY_SEEING,
  },
  {
    switchName: 'difficultyConcentrating',
    notesName: 'difficultyConcentratingNote',
    title: DIFFICULTY_CONCENTRATING_MAKING_DECISION,
  },
  {
    switchName: 'difficultyWalking',
    notesName: 'difficultyWalkingNote',
    title: DIFFICULTY_WALKING_CLIMBING,
  },
  {
    switchName: 'difficultyDressing',
    notesName: 'difficultyDressingNote',
    title: DIFFICULTY_DRESSING_BATHING,
  },
  {
    switchName: 'difficultyErrands',
    notesName: 'difficultyErrandsNote',
    title: DIFFICULTY_DOING_ERRANDS_ALONE,
  },
  {
    switchName: 'difficultyTransportation',
    notesName: 'difficultyTransportationNote',
    title: DO_YOU_HAVE_TRANSPORTATION_DIFFICULTIES,
  }
]

export const CIGARETTE_LEVEL_MAPPED = [
  {
    id: 'never_used_electronic_cigarettes',
    name: "Never used electronic cigarettes"
  },
  {
    name: "Former user of electronic cigarettes",
    id: 'former_user_of_electronic_cigarettes'
  },
  {
    id: 'current_user_of_electronic_cigarettes',
    name: "Current user of electronic cigarettes"
  }
]

export const SMOKELESS_TOBACCO_MAPPED = [
  {
    id: "never_used_smokeless_tobacco",
    name: "Never used smokeless tobacco",
  },
  {
    name: "Former smokeless tobacco user",
    id: "former_smokeless_tobacco_user",
  },
  {
    id: "currently_uses_moist_powdered_tobacco",
    name: "Currently uses moist powdered tobacco",
  },
  {
    id: "not_tolerated",
    name: "Not tolerated",
  },
  {
    id: "patient_refused",
    name: "Patient refused",
  },
  {
    id: "not_indicated",
    name: "Not indicated",
  },
];

export const RESIDE_IN_OR_HAVE_YOU_TRAVELED_FIELDS_MAPPED = [
  {
    title: "Have you had other close contact with an Ebola virus disease patient in health care facilities or community settings?",
    switchName: 'knownHighRisk',
    notesName: 'knownHighRiskNote',
  },
  {
    title: "Have you had household contact with an Ebola virus disease patient?",
    switchName: 'knownHighRisk',
    notesName: 'knownHighRiskNote',
  },
  {
    title: "Have you directly handled bats, rodents, or primates from Ebola endemic areas?",
    switchName: 'knownHighRisk',
    notesName: 'knownHighRiskNote',
  },
  {
    title: "Have you had direct contact with a dead body in an Ebola-affected area without appropriate PPE?",
    switchName: 'knownHighRisk',
    notesName: 'knownHighRiskNote',
  },
  {
    title: "Have you had percutaneous (e.g. needle stick) or mucous membrane exposure to blood or body fluids from an Ebola virus disease patient?",
    switchName: 'knownHighRisk',
    notesName: 'knownHighRiskNote',
  },
]

export const SEX_PROTECTION_MAPPED = [
  {
    id: "always",
    name: "Always",
  },
  {
    id: "usually",
    name: "Usually",
  },
  {
    id: "no",
    name: "No",
  },
];

export const HAVE_YOU_RECENTLY_PLANNING_TO_TRAVEL_FIELDS_MAPPED = [
  {
    switchName: 'planningToTravel',
    notesName: 'planningToTravelNote',
    title: 'Do you have symptoms associated with Zika virus (fever, rash, joint pain, or conjunctivitis)?',
  }
]

export const DO_YOU_EVER_USED_TOBACCO_NICOTINE_FIELDS = [
  {
    title: 'Do you or have you ever used e-cigarettes or vape?',
    selectorOptions: CHILD_CARE_MAPPED,
    selectorName: 'childCare',
    notesName: 'childCareNote',
  },
  {
    title: "Do you or have you ever used smokeless tobacco?",
    selectorOptions: CHILD_CARE_MAPPED,
    selectorName: 'childCare',
    notesName: 'childCareNote',
  }
]

export const PUBLIC_HEALTH_TRAVEL_MAPPED = [
  {
    switchName: 'knownHighRisk',
    notesName: 'knownHighRiskNote',
    title: HAVE_YOU_BEEN_TO_AN_AREA_KNOWN_HIGH_RISK,
  },
  {
    switchName: 'onsetSymptomCase',
    notesName: 'onsetSymptomCaseNote',
    title: IN_THE_14_DAYS_BEFORE_SYMPTOM_ONSET_CASE_ILL,
  },
  {
    switchName: 'onsetSymptomPerson',
    notesName: 'onsetSymptomPersonNote',
    title: IN_THE_14_DAYS_BEFORE_SYMPTOM_ONSET_PERSON_ILL,
  },
  {
    switchName: 'resideInOrTravel',
    notesName: 'resideInOrTravelNote',
    title: RESIDE_IN_OR_HAVE_YOU_TRAVELED,
    subFields: RESIDE_IN_OR_HAVE_YOU_TRAVELED_FIELDS_MAPPED
  },
  {
    switchName: 'bloodBodyFluids',
    notesName: 'bloodBodyFluidsNote',
    title: HAVE_YOU_PROCESSED_BLOOD_BODY_FLUIDS,
  },
  {
    switchName: 'planningToTravel',
    notesName: 'planningToTravelNote',
    title: HAVE_YOU_RECENTLY_PLANNING_TO_TRAVEL,
    subFields: HAVE_YOU_RECENTLY_PLANNING_TO_TRAVEL_FIELDS_MAPPED
  },
]

export const ADVANCED_DIRECTIVE_MAPPED = [
  {
    switchName: 'advanceDirective',
    notesName: 'advanceDirectiveNote',
    title: DO_YOU_HAVE_AN_ADVANCED_DIRECTIVE,
  },
  {
    switchName: 'bloodTransfusion',
    notesName: 'bloodTransfusionNote',
    title: IS_BLOOD_TRANSFUSION_ACCEPTABLE_IN_AN_EMERGENCY,
  }
]

export const HOME_AND_ENVIRONMENT_SWITCH_MAPPED = [
  {
    switchName: 'familyChanges',
    notesName: 'familyChangesNote',
    title: HAVE_THERE_BEEN_ANY_CHANGES_TO_YOUR_FAMILY,
  },
  {
    switchName: 'havePets',
    notesName: 'havePetsNote',
    title: DO_YOU_HAVE_ANY_PETS,
  },
  {
    switchName: 'carbonDetectors',
    notesName: 'carbonDetectorsNote',
    title: DO_YOU_HAVE_SMOKE_AND_CARBON_MONOXIDE,
  },
  {
    switchName: 'smokeExposed',
    notesName: 'smokeExposedNote',
    title: ARE_YOU_PASSIVELY_EXPOSED_TO_SMOKE,
  },
  {
    switchName: 'gunsInHome',
    notesName: 'gunsInHomeNote',
    title: ARE_THERE_ANY_GUNS_PRESENT_HOME,
  },
  {
    switchName: 'insectRepellent',
    notesName: 'insectRepellentNote',
    title: DO_YOU_USE_INSECT_REPELLENT_ROUTINELY,
  },
  {
    switchName: 'sunscreenUse',
    notesName: 'sunscreenUseNote',
    title: DO_YOU_USE_SUNSCREEN,
  },
]

export const HOME_AND_ENVIRONMENT_SELECTOR_MAPPED = [
  {
    selectorOptions: CHILD_CARE_MAPPED,
    selectorName: 'childCare',
    notesName: 'childCareNote',
    title: WHAT_TYPE_OF_CHILD_CARE_DO_YOU_USE,
  },
  {
    selectorOptions: FLUORIDE_STATUS_MAPPED,
    selectorName: 'fluorideStatus',
    notesName: 'fluorideStatusNote',
    title: WHAT_IS_FLUORIDE_STATUS_OF_YOUR_HOME,
  },
]

export const LIFE_STYLE_MAPPED = [
  {
    switchName: 'wearHelmet',
    title: DO_YOU_WEAR_HELMET,
    notesName: 'wearHelmetNote',
  },
  {
    switchName: 'seatBelt',
    notesName: 'seatBeltNote',
    title: DO_YOU_USE_SEAT_BELT,
  }
]

export enum CONFIRMATION_MODAL_TYPE {
  DELETE = 'delete',
  CANCEL = 'cancel',
  ACTIVE = 'active',
  IN_ACTIVE = 'in_active',
  DISCHARGE = 'discharge',
}

export const VACCINE_UNITS_MAPPED = [
  { id: "mL", name: "ML" },
  { id: "mcg", name: "MCG" },
  { id: "mg", name: "MG" },
]

export const VACCINE_ROUTES_MAPPED = [
  { id: "buccal", name: "Buccal" },
  { id: "dental", name: "Dental" },
  { id: "epidural", name: "Epidural" },
  { id: "hemodialysis", name: "Hemodialysis" },
  { id: "implant", name: "Implant" },
  { id: "in_vitro", name: "In Vitro" },
  { id: "inhalation", name: "Inhalation" },
  { id: "injection", name: "Injection" },
  { id: "intra_arterial", name: "Intra Arterial" },
  { id: "intra_articular", name: "Intra Articular" },
  { id: "intra_cavernosal", name: "Intra Cavernosal" },
  { id: "intra_urethral", name: "Intra Urethral" },
  { id: "intra_dermal", name: "Intra Dermal" },
  { id: "intra_muscular", name: "Intra Muscular" },
  { id: "intra_nasal", name: "Intra Nasal" },
  { id: "intra_ocular", name: "Intra Ocular" },
  { id: "intra_peritoneal", name: "Intra Peritoneal" },
  { id: "intra_pleural", name: "Intra Pleural" },
  { id: "intra_thecal", name: "Intra Thecal" },
  { id: "intra Uterine", name: "Intra Uterine" },
  { id: "intra_venous", name: "Intra Venous" },
  { id: "intra_vesical", name: "Intra Vesical" },
  { id: "irrigation", name: "Irrigation" },
  { id: "miscellaneous", name: "Miscellaneous" },
  { id: "mucous_membrane", name: "Mucous Membrane" },
  { id: "ophthalmic", name: "Ophthalmic" },
  { id: "oral", name: "Oral" },
  { id: "otic", name: "Otic" },
  { id: "perfusion", name: "Perfusion" },
  { id: "rectal", name: "Rectal" },
  { id: "subcutaneous", name: "Subcutaneous" },
  { id: "sublingual", name: "Sublingual" },
  { id: "Topical", name: "Topical" },
  { id: "transdermal", name: "Transdermal" },
  { id: "trans_lingual", name: "Trans Lingual" },
  { id: "vaginal", name: "Vaginal" },
]


export const VACCINE_SITES_MAPPED = [
  { id: "bladder", name: "Bladder" },
  { id: "ear_left", name: "Ear, Left" },
  { id: "chest_left", name: "Chest, Left" },
  { id: "buttock_left", name: "Buttock, Left" },
  { id: "ankle_left", name: "Ankle, Left" },
  { id: "abdomen_llq", name: "Abdomen, LLQ" },
  { id: "abdomen_luq", name: "Abdomen, LUQ" },
  { id: "abdomen_rlq", name: "Abdomen, RLQ" },
  { id: "abdomen_ruq", name: "Abdomen, RUQ" },
  { id: "ankle_right", name: "Ankle, Right" },
  { id: "chest_right", name: "Chest, Right" },
  { id: "buttock_right", name: "Buttock, Right" },
  { id: "deltoid_left", name: "Deltoid, Left" },
  { id: "deltoid_right", name: "Deltoid, Right" },
  { id: "arm_left_upper", name: "Arm, Left Upper" },
  { id: "arm_right_upper", name: "Arm, Right Upper" },
  { id: "chest_port_left", name: "Chest Port, Left" },
  { id: "chest_port_right", name: "Chest Port, Right" },
  { id: "dorsogluteal_left", name: "Dorsogluteal, Left" },
  { id: "dorsogluteal_right", name: "Dorsogluteal, Right" },
  { id: "antecubital_fossa_left", name: "Antecubital Fossa, Left" },
  { id: "antecubital_fossa_right", name: "Antecubital Fossa, Right" },
  { id: "oral", name: "Oral" },
  { id: "nasal", name: "Nasal" },
  { id: "foot_left", name: "Foot, Left" },
  { id: "eye_right", name: "Eye, Right" },
  { id: "eye_left", name: "Eye, Left" },
  { id: "hand_right", name: "Hand, Right" },
  { id: "hand_left", name: "Hand, Left" },
  { id: "hip_right", name: "Hip, Right" },
  { id: "hip_left", name: "Hip, Left" },
  { id: "knee_left", name: "Knee, Left" },
  { id: "knee_right", name: "Knee, Right" },
  { id: "foot_right", name: "Foot, Right" },
  { id: "ear_right", name: "Ear, Right" },
  { id: "elbow_right", name: "Elbow, Left" },
  { id: "elbow_left", name: "Elbow, Right" },
  { id: "forearm_left", name: "Forearm, Left" },
  { id: "forearm_right", name: "Forearm, Right" },
  { id: "other", name: "Other" },
  { id: "penis", name: "Penis" },
  { id: "rectal", name: "Rectal" },
  { id: "rectus_femoris_left", name: "Rectus femoris, Left" },
  { id: "rectus_femoris_right", name: "Rectus femoris, Right" },
  { id: "scrotum", name: "Scrotum" },
  { id: "shoulder_left", name: "Shoulder, Left" },
  { id: "shoulder_right", name: "Shoulder, Right" },
  { id: "thigh_left", name: "Thigh, Left" },
  { id: "thigh_right", name: "Thigh, Right" },
  { id: "thumb_left", name: "Thumb, Left" },
  { id: "thumb_right", name: "Thumb, Right" },
  { id: "vaginal", name: "Vaginal" },
  { id: "uterus", name: "Uterus" },
  { id: "vastus_lateralis_left", name: "Vastus Lateralis, Left" },
  { id: "vastus_lateralis_right", name: "Vastus Lateralis, Right" },
  { id: "ventrogluteal_left", name: "Ventrogluteal, Left" },
  { id: "ventrogluteal_right", name: "Ventrogluteal, Right" },
  { id: "wrist_left", name: "Wrist, Left" },
  { id: "wrist_right", name: "Wrist, Right" },
  { id: "left_arm", name: "Left Arm" },
  { id: "right_arm", name: "Right Arm" },
  { id: "right_upper_arm", name: "Right Upper Arm" },
  { id: "left_upper_arm", name: "Left Upper Arm" },
  { id: "left_leg", name: "Left Leg" },
  { id: "right_leg", name: "Right Leg" },
  { id: "left_acf", name: "Left ACF" },
  { id: "right_acf", name: "Right ACF" },
  { id: "abdomen", name: "Abdomen" },
  { id: "left_lower_thigh", name: "Left Lower Thigh" },
  { id: "right_lower_thigh", name: "Right Lower Thigh" },
  { id: "left_upper_thigh", name: "Left Upper Thigh" },
  { id: "right_upper_thigh", name: "Right Upper Thigh" },
  { id: "right_upper_extremity", name: "Right Upper Extremity" },
  { id: "left_lower_extremity", name: "Left Lower Extremity" },
  { id: "left_upper_extremity", name: "Left Upper Extremity" },
  { id: "right_lower_extremity", name: "Right Lower Extremity" },
  { id: "intra_articular_joint", name: "INTRA ARTICULAR JOINT" },
  { id: "left_abdomen", name: "Left Abdomen" },
  { id: "right_abdomen", name: "Right Abdomen" },
  { id: "bilateral_knee", name: "Bilateral Knee" },
  { id: "bilateral_thigh", name: "Bilateral Thigh" },
  { id: "left_upper_eyelid", name: "Left Upper Eyelid" },
  { id: "right_lower_eyelid", name: "Right Lower Eyelid" },
  { id: "right_upper_eyelid", name: "Right Upper Eyelid" },
  { id: "left_lower_eyelid", name: "Left Lower Eyelid" },
  { id: "left_flank", name: "Left Flank" },
  { id: "right_flank", name: "Right Flank" },
]

export enum QuestionType {
  SWITCH = 'switch',
  SELECT = 'select',
  INPUT = 'input',
  DATE = 'date',
  NUMBER = 'number'
}

export enum STATUS_ENUM {
  ACTIVE = "Active",
  IN_ACTIVE = "Inactive",
}

export const STATUS_MAPPED = [
  {
    id: STATUS_ENUM.ACTIVE,
    name: STATUS_ENUM.ACTIVE
  },
  {
    id: STATUS_ENUM.IN_ACTIVE,
    name: STATUS_ENUM.IN_ACTIVE
  }
]
export const PROBLEMS_TABS = ['Common Terms']
export const ORDERS_TABS = ['Lab Order', 'Medications', 'Imaging']
export const SCRIBE_TABS = ['Doctors', 'Staff']

export enum InsuranceRadioTypes {
  INSURANCE = "insurance",
  NO_INSURANCE = 'no_insurance',
  INTERNATIONAL_TRAVELER = 'international_traveler',
  CONTRACT = 'contract'
}

export const INSURANCE_RADIO_BUTTON_MAPPED = [
  {
    type: InsuranceRadioTypes.INSURANCE,
    title: INSURANCE,
  },
  {
    type: InsuranceRadioTypes.NO_INSURANCE,
    title: NO_INSURANCE,
  },
  {
    type: InsuranceRadioTypes.INTERNATIONAL_TRAVELER,
    title: INTERNATIONAL_TRAVELER,
  },
  {
    type: InsuranceRadioTypes.CONTRACT,
    title: CONTRACT,
  },
]
