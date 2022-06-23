import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type AchPaymentInputs = {
  appointmentId?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  deviceData?: Maybe<Scalars['String']>;
  doctorId?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  patientId?: Maybe<Scalars['String']>;
  price: Scalars['String'];
  token: Scalars['String'];
};

/** The test result's abnormal flag status assigned */
export enum AbnormalFlag {
  AbnormalAppliedToNonNumericResults = 'ABNORMAL_APPLIED_TO_NON_NUMERIC_RESULTS',
  AboveAbsoluteHighOffScale = 'ABOVE_ABSOLUTE_HIGH_OFF_SCALE',
  AboveHighNormal = 'ABOVE_HIGH_NORMAL',
  BelowAbsoluteLowOffScale = 'BELOW_ABSOLUTE_LOW_OFF_SCALE',
  BelowLowerPanicLimit = 'BELOW_LOWER_PANIC_LIMIT',
  BelowLowNormal = 'BELOW_LOW_NORMAL',
  BelowUpperPanicLimit = 'BELOW_UPPER_PANIC_LIMIT',
  BetterUseWhenDirectionNotRelevant = 'BETTER_USE_WHEN_DIRECTION_NOT_RELEVANT',
  Intermediate = 'INTERMEDIATE',
  Moderately = 'MODERATELY',
  None = 'NONE',
  Normal = 'NORMAL',
  Resistant = 'RESISTANT',
  SignificantChangeDown = 'SIGNIFICANT_CHANGE_DOWN',
  SignificantChangeUp = 'SIGNIFICANT_CHANGE_UP',
  Susceptible = 'SUSCEPTIBLE',
  VeryAbnormalAppliedToNonNumeric = 'VERY_ABNORMAL_APPLIED_TO_NON_NUMERIC',
  VerySusceptible = 'VERY_SUSCEPTIBLE',
  WorstUseWhenDirectionNotRelevant = 'WORST_USE_WHEN_DIRECTION_NOT_RELEVANT'
}

export type AccessUserPayload = {
  __typename?: 'AccessUserPayload';
  access_2fa_token?: Maybe<Scalars['String']>;
  access_token?: Maybe<Scalars['String']>;
  isTwoFactorEnabled?: Maybe<Scalars['Boolean']>;
  response?: Maybe<ResponsePayload>;
  roles?: Maybe<Array<Role>>;
  userId?: Maybe<Scalars['String']>;
};

export type ActiveInactivePracticesPayload = {
  __typename?: 'ActiveInactivePracticesPayload';
  activePractices?: Maybe<Scalars['Int']>;
  inactivePractices?: Maybe<Scalars['Int']>;
  response?: Maybe<ResponsePayloadResponse>;
};

export type Agreement = {
  __typename?: 'Agreement';
  body?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  signatureRequired?: Maybe<Scalars['Boolean']>;
  title?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  viewAgreementBeforeAgreeing?: Maybe<Scalars['Boolean']>;
};

export type AgreementInput = {
  body?: Maybe<Scalars['String']>;
  signatureRequired?: Maybe<Scalars['Boolean']>;
  title?: Maybe<Scalars['String']>;
  viewAgreementBeforeAgreeing?: Maybe<Scalars['Boolean']>;
};

export type AgreementPaginationInput = {
  paginationOptions: PaginationInput;
  searchString?: Maybe<Scalars['String']>;
};

export type AgreementPayload = {
  __typename?: 'AgreementPayload';
  agreement: Agreement;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type AgreementsPayload = {
  __typename?: 'AgreementsPayload';
  agreements: Array<Agreement>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type AllDoctorPayload = {
  __typename?: 'AllDoctorPayload';
  doctors?: Maybe<Array<Maybe<Doctor>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type AllStaffPayload = {
  __typename?: 'AllStaffPayload';
  allstaff?: Maybe<Array<Maybe<Staff>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type Allergies = {
  __typename?: 'Allergies';
  allergyType: AllergyType;
  createdAt?: Maybe<Scalars['String']>;
  drugAllergyTypes?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  patientAllergies?: Maybe<Array<PatientAllergies>>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type AllergiesPayload = {
  __typename?: 'AllergiesPayload';
  allergies?: Maybe<Array<Maybe<Allergies>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type AllergyInput = {
  allergyName?: Maybe<Scalars['String']>;
  allergyType?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
};

/** The patient's allergy onset type assigned */
export enum AllergyOnset {
  Adulthood = 'ADULTHOOD',
  Childhood = 'CHILDHOOD',
  Unknown = 'UNKNOWN'
}

/** The patient's allergy severity type assigned */
export enum AllergySeverity {
  Acute = 'ACUTE',
  Mild = 'MILD',
  Moderate = 'MODERATE',
  VeryMild = 'VERY_MILD'
}

/** The patient's allergy type assigned */
export enum AllergyType {
  Drug = 'DRUG',
  Environment = 'ENVIRONMENT',
  Food = 'FOOD'
}

export type Appointment = {
  __typename?: 'Appointment';
  appointmentCancelReason?: Maybe<Scalars['String']>;
  appointmentCreateType?: Maybe<AppointmentCreateType>;
  appointmentNumber?: Maybe<Scalars['String']>;
  appointmentType?: Maybe<Service>;
  appointmentTypeId?: Maybe<Scalars['String']>;
  autoAccident?: Maybe<Scalars['Boolean']>;
  billing?: Maybe<Billing>;
  billingStatus: BillingStatus;
  checkInActiveStep?: Maybe<Scalars['String']>;
  checkedInAt?: Maybe<Scalars['String']>;
  checkedOutAt?: Maybe<Scalars['String']>;
  contract?: Maybe<Contract>;
  createdAt?: Maybe<Scalars['String']>;
  employment?: Maybe<Scalars['Boolean']>;
  facility?: Maybe<Facility>;
  facilityId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  insuranceCompany?: Maybe<Scalars['String']>;
  invoice?: Maybe<Invoice>;
  invoiceId?: Maybe<Scalars['String']>;
  isExternal?: Maybe<Scalars['Boolean']>;
  labTests?: Maybe<Array<LabTests>>;
  membershipID?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  otherAccident?: Maybe<Scalars['Boolean']>;
  otherPartyResponsible?: Maybe<Scalars['Boolean']>;
  patient?: Maybe<Patient>;
  patientAllergies?: Maybe<Array<PatientAllergies>>;
  patientId?: Maybe<Scalars['String']>;
  patientProblem?: Maybe<Array<PatientProblems>>;
  patientVitals?: Maybe<Array<PatientVitals>>;
  paymentType: PaymentType;
  practiceId?: Maybe<Scalars['String']>;
  primaryInsurance?: Maybe<Scalars['String']>;
  provider?: Maybe<Doctor>;
  providerId?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
  scheduleEndDateTime?: Maybe<Scalars['String']>;
  scheduleStartDateTime?: Maybe<Scalars['String']>;
  secondaryInsurance?: Maybe<Scalars['String']>;
  selfCheckIn?: Maybe<Scalars['Boolean']>;
  status: AppointmentStatus;
  token?: Maybe<Scalars['String']>;
  transaction?: Maybe<Transactions>;
  updatedAt?: Maybe<Scalars['String']>;
};

/** The appointment create type assigned */
export enum AppointmentCreateType {
  Appointment = 'APPOINTMENT',
  Telehealth = 'TELEHEALTH'
}

export type AppointmentInput = {
  appointmentNumber?: Maybe<Scalars['String']>;
  appointmentStatus?: Maybe<Scalars['String']>;
  appointmentTypeId?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
  patientId?: Maybe<Scalars['String']>;
  practiceId?: Maybe<Scalars['String']>;
  providerId?: Maybe<Scalars['String']>;
  relationTable?: Maybe<Scalars['String']>;
  searchString?: Maybe<Scalars['String']>;
  sortBy?: Maybe<Scalars['String']>;
};

export type AppointmentPayload = {
  __typename?: 'AppointmentPayload';
  appointment?: Maybe<Appointment>;
  response?: Maybe<ResponsePayload>;
};

/** The patient appointment status type assigned */
export enum AppointmentStatus {
  Arrived = 'ARRIVED',
  Cancelled = 'CANCELLED',
  CheckInOnline = 'CHECK_IN_ONLINE',
  Discharged = 'DISCHARGED',
  InLobby = 'IN_LOBBY',
  InSession = 'IN_SESSION',
  NoShow = 'NO_SHOW',
  Rescheduled = 'RESCHEDULED',
  Scheduled = 'SCHEDULED'
}

export type AppointmentsPayload = {
  __typename?: 'AppointmentsPayload';
  appointments?: Maybe<Array<Maybe<Appointment>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type ArrayOfStringsType = {
  __typename?: 'ArrayOfStringsType';
  name: Scalars['String'];
  value: Scalars['Boolean'];
};

export type ArrayOfStringsTypeInput = {
  name: Scalars['String'];
  value: Scalars['Boolean'];
};

export type Attachment = {
  __typename?: 'Attachment';
  attachmentMetadata?: Maybe<AttachmentMetadata>;
  attachmentMetadataId?: Maybe<Scalars['String']>;
  attachmentName?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type: AttachmentType;
  typeId: Scalars['String'];
  updatedAt: Scalars['String'];
  url?: Maybe<Scalars['String']>;
};

export type AttachmentMediaPayload = {
  __typename?: 'AttachmentMediaPayload';
  preSignedUrl?: Maybe<Scalars['String']>;
  response?: Maybe<ResponsePayload>;
};

export type AttachmentMetadata = {
  __typename?: 'AttachmentMetadata';
  agreementId?: Maybe<Scalars['String']>;
  assignedTo?: Maybe<Scalars['String']>;
  attachment?: Maybe<Attachment>;
  attachmentId?: Maybe<Scalars['String']>;
  comments?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  documentDate?: Maybe<Scalars['String']>;
  documentType?: Maybe<DocumentType>;
  documentTypeId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  labOrderNum?: Maybe<Scalars['String']>;
  policyId?: Maybe<Scalars['String']>;
  providerName?: Maybe<Scalars['String']>;
  signedAt?: Maybe<Scalars['String']>;
  signedBy?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type AttachmentPayload = {
  __typename?: 'AttachmentPayload';
  attachment?: Maybe<Attachment>;
  response?: Maybe<ResponsePayload>;
};

/** The type is assigned */
export enum AttachmentType {
  Doctor = 'DOCTOR',
  FormBuilder = 'FORM_BUILDER',
  Patient = 'PATIENT',
  Practice = 'PRACTICE',
  Staff = 'STAFF',
  SuperAdmin = 'SUPER_ADMIN',
  Lab = 'lab'
}

export type AttachmentWithPreSignedUrl = {
  __typename?: 'AttachmentWithPreSignedUrl';
  attachmentMetadata?: Maybe<AttachmentMetadata>;
  attachmentMetadataId?: Maybe<Scalars['String']>;
  attachmentName?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  preSignedUrl?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type: AttachmentType;
  typeId: Scalars['String'];
  updatedAt: Scalars['String'];
  url?: Maybe<Scalars['String']>;
};

export type AttachmentWithPreSignedUrlPayload = {
  __typename?: 'AttachmentWithPreSignedUrlPayload';
  attachmentsWithPreSignedUrl?: Maybe<Array<AttachmentWithPreSignedUrl>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type AttachmentsPayload = {
  __typename?: 'AttachmentsPayload';
  attachments?: Maybe<Array<Maybe<Attachment>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

/** The invoice payment type */
export enum Billing_Type {
  Insurance = 'INSURANCE',
  SelfPay = 'SELF_PAY'
}

export type Billing = {
  __typename?: 'Billing';
  amount?: Maybe<Scalars['String']>;
  appointment?: Maybe<Appointment>;
  appointmentId?: Maybe<Scalars['String']>;
  autoAccident?: Maybe<Scalars['Boolean']>;
  codes?: Maybe<Array<Code>>;
  createdAt?: Maybe<Scalars['String']>;
  employment?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  labOrderNumber?: Maybe<Scalars['String']>;
  onsetDate?: Maybe<Scalars['String']>;
  onsetDateType: OnsetDateType;
  otherAccident?: Maybe<Scalars['Boolean']>;
  otherDate?: Maybe<Scalars['String']>;
  otherDateType: OtherDateType;
  patient?: Maybe<Patient>;
  patientBillingStatus: PatientBillingStatus;
  patientId?: Maybe<Scalars['String']>;
  patientPaymentType: PatientPaymentType;
  updatedAt?: Maybe<Scalars['String']>;
};

export type BillingAddress = {
  __typename?: 'BillingAddress';
  address?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  bankAccount?: Maybe<Scalars['String']>;
  checkPayableTo?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  doctor?: Maybe<Doctor>;
  email?: Maybe<Scalars['String']>;
  facility?: Maybe<Facility>;
  facilityId?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  federalTaxId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  mobile?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  userId?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
};

export type BillingInput = {
  amount?: Maybe<Scalars['String']>;
  appointmentId?: Maybe<Scalars['String']>;
  autoAccident?: Maybe<Scalars['Boolean']>;
  codes?: Maybe<Array<CodesInput>>;
  employment?: Maybe<Scalars['Boolean']>;
  labOrderNumber?: Maybe<Scalars['String']>;
  onsetDate?: Maybe<Scalars['String']>;
  onsetDateType?: Maybe<OnsetDateType>;
  otherAccident?: Maybe<Scalars['Boolean']>;
  otherDate?: Maybe<Scalars['String']>;
  otherDateType?: Maybe<OtherDateType>;
  patientBillingStatus?: Maybe<PatientBillingStatus>;
  patientId?: Maybe<Scalars['String']>;
  patientPaymentType?: Maybe<PatientPaymentType>;
};

export type BillingPayload = {
  __typename?: 'BillingPayload';
  billing: Billing;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<Response>;
};

/** The patient billing status assigned */
export enum BillingStatus {
  Due = 'DUE',
  Paid = 'PAID',
  Refund = 'REFUND'
}

export type BraintreePayload = {
  __typename?: 'BraintreePayload';
  clientToken: Scalars['String'];
};

/** The patient's communication method assigned */
export enum Communicationtype {
  Email = 'EMAIL',
  Message = 'MESSAGE',
  Phone = 'PHONE',
  VoiceMessage = 'VOICE_MESSAGE'
}

export type CancelAppointment = {
  reason: Scalars['String'];
  token: Scalars['String'];
};

export type Code = {
  __typename?: 'Code';
  billing?: Maybe<Billing>;
  billingId?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  codeType: CodeType;
  createdAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  price?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

/** The code type assigned with the code */
export enum CodeType {
  CptCode = 'CPT_CODE',
  CustomCode = 'CUSTOM_CODE',
  HcpcsCode = 'HCPCS_CODE',
  Icd_10Code = 'ICD_10_CODE'
}

export type CodesInput = {
  code?: Maybe<Scalars['String']>;
  codeType?: Maybe<CodeType>;
  description?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
};

export type Contact = {
  __typename?: 'Contact';
  address?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  contactType?: Maybe<ContactType>;
  country?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  doctor?: Maybe<Doctor>;
  doctorId?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  employerName?: Maybe<Scalars['String']>;
  facility?: Maybe<Facility>;
  facilityId?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  insuranceId?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  locationLink?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  pager?: Maybe<Scalars['String']>;
  patientId?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  primaryContact?: Maybe<Scalars['Boolean']>;
  relationship?: Maybe<RelationshipType>;
  serviceCode: ServiceCodes;
  ssn?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  userId?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
};

export type ContactInput = {
  facilityId?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
  primaryContact?: Maybe<Scalars['Boolean']>;
};

export type ContactPayload = {
  __typename?: 'ContactPayload';
  contact?: Maybe<Contact>;
  response?: Maybe<ResponsePayload>;
};

/** The user's contact type assigned */
export enum ContactType {
  ChildMotherInsurance = 'CHILD_MOTHER_INSURANCE',
  Emergency = 'EMERGENCY',
  Guarandor = 'GUARANDOR',
  Guardian = 'GUARDIAN',
  NextOfKin = 'NEXT_OF_KIN',
  Self = 'SELF'
}

export type ContactsPayload = {
  __typename?: 'ContactsPayload';
  contacts?: Maybe<Array<Maybe<Contact>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type Contract = {
  __typename?: 'Contract';
  appointment?: Maybe<Appointment>;
  contractNumber?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  organizationName?: Maybe<Scalars['String']>;
};

export type Copay = {
  __typename?: 'Copay';
  amount?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['String'];
  policy?: Maybe<Policy>;
  policyId?: Maybe<Scalars['String']>;
  type?: Maybe<CopayType>;
  updatedAt: Scalars['String'];
};

export type CopayInput = {
  amount?: Maybe<Scalars['String']>;
  policy?: Maybe<CreatePolicyInput>;
  policyId?: Maybe<Scalars['String']>;
  type?: Maybe<CopayType>;
};

/** The type of copay */
export enum CopayType {
  Allergy = 'ALLERGY',
  AmbulatorySurgery = 'AMBULATORY_SURGERY',
  Audiologist = 'AUDIOLOGIST',
  BrandDrug = 'BRAND_DRUG',
  ChiropracticCopayment = 'CHIROPRACTIC_COPAYMENT',
  Deductible = 'DEDUCTIBLE',
  Dermatology = 'DERMATOLOGY',
  Dme = 'DME',
  ErVisit = 'ER_VISIT',
  GenericDrug = 'GENERIC_DRUG',
  Global = 'GLOBAL',
  Lab = 'LAB',
  MhGroup = 'MH_GROUP',
  MhIndividual = 'MH_INDIVIDUAL',
  NonFormularyDrug = 'NON_FORMULARY_DRUG',
  NurseVisit = 'NURSE_VISIT',
  ObGyn = 'OB_GYN',
  OfficeVisirNew = 'OFFICE_VISIR_NEW',
  OfficeVisit = 'OFFICE_VISIT',
  OfficeVisitFu = 'OFFICE_VISIT_FU',
  OutOfNetwork = 'OUT_OF_NETWORK',
  PhysiciansAssistant = 'PHYSICIANS_ASSISTANT',
  Podiatry = 'PODIATRY',
  PostOp = 'POST_OP',
  PreferredDrug = 'PREFERRED_DRUG',
  PrenatalCare = 'PRENATAL_CARE',
  PreventiveCare = 'PREVENTIVE_CARE',
  PtOtSt = 'PT_OT_ST',
  RetailConvenience = 'RETAIL_CONVENIENCE',
  SpecialtyCare = 'SPECIALTY_CARE',
  TeleHealth = 'TELE_HEALTH',
  Ultrasound = 'ULTRASOUND',
  UrgentCare = 'URGENT_CARE',
  WellChild = 'WELL_CHILD',
  XrayImaging = 'XRAY_IMAGING'
}

export type CreateAppointmentInput = {
  appointmentCreateType?: Maybe<AppointmentCreateType>;
  appointmentTypeId: Scalars['String'];
  autoAccident?: Maybe<Scalars['Boolean']>;
  billingStatus: BillingStatus;
  contractNumber?: Maybe<Scalars['String']>;
  employment?: Maybe<Scalars['Boolean']>;
  facilityId?: Maybe<Scalars['String']>;
  insuranceCompany?: Maybe<Scalars['String']>;
  isExternal?: Maybe<Scalars['Boolean']>;
  membershipID?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  organizationName?: Maybe<Scalars['String']>;
  otherAccident?: Maybe<Scalars['Boolean']>;
  otherPartyResponsible?: Maybe<Scalars['Boolean']>;
  patientId?: Maybe<Scalars['String']>;
  paymentType: PaymentType;
  practiceId?: Maybe<Scalars['String']>;
  primaryInsurance?: Maybe<Scalars['String']>;
  providerId?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
  scheduleEndDateTime: Scalars['String'];
  scheduleStartDateTime: Scalars['String'];
  secondaryInsurance?: Maybe<Scalars['String']>;
};

export type CreateAttachmentInput = {
  agreementId?: Maybe<Scalars['String']>;
  attachmentName?: Maybe<Scalars['String']>;
  comments?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  documentDate?: Maybe<Scalars['String']>;
  documentTypeId?: Maybe<Scalars['String']>;
  documentTypeName?: Maybe<Scalars['String']>;
  labOrderNum?: Maybe<Scalars['String']>;
  policyId?: Maybe<Scalars['String']>;
  practiceId?: Maybe<Scalars['String']>;
  signedAt?: Maybe<Scalars['String']>;
  signedBy?: Maybe<Scalars['String']>;
  signedByProvider?: Maybe<Scalars['Boolean']>;
  subTitle?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  /** enum type for module type - Upload Media */
  type: AttachmentType;
  typeId: Scalars['String'];
  url?: Maybe<Scalars['String']>;
};

export type CreateBillingAddressInput = {
  address?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  bankAccount?: Maybe<Scalars['String']>;
  checkPayableTo?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  doctorId?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  facilityId?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  pager?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
};

export type CreateContactInput = {
  address?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  contactType?: Maybe<ContactType>;
  country?: Maybe<Scalars['String']>;
  doctorId?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  employerName?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  insuranceId?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  locationLink?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  pager?: Maybe<Scalars['String']>;
  patientId?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  primaryContact?: Maybe<Scalars['Boolean']>;
  relationship?: Maybe<RelationshipType>;
  serviceCode?: Maybe<ServiceCodes>;
  ssn?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
};

export type CreateDoctorInput = {
  createBillingAddressInput: CreateBillingAddressInput;
  createContactInput: CreateContactInput;
  createDoctorItemInput: CreateDoctorItemInput;
};

export type CreateDoctorItemInput = {
  adminId?: Maybe<Scalars['String']>;
  anesthesiaLicense?: Maybe<Scalars['String']>;
  billingFacility?: Maybe<Scalars['String']>;
  blueShildNumber?: Maybe<Scalars['String']>;
  campusGrpNumber?: Maybe<Scalars['String']>;
  deaActiveDate?: Maybe<Scalars['String']>;
  deaNumber?: Maybe<Scalars['String']>;
  deaTermDate?: Maybe<Scalars['String']>;
  degreeCredentials?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['String']>;
  dpsCtpNumber?: Maybe<Scalars['String']>;
  emcProviderId?: Maybe<Scalars['String']>;
  facilityId: Scalars['String'];
  firstName: Scalars['String'];
  languagesSpoken?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  licenseActiveDate?: Maybe<Scalars['String']>;
  licenseTermDate?: Maybe<Scalars['String']>;
  meammographyCertNumber?: Maybe<Scalars['String']>;
  medicaidGrpNumber?: Maybe<Scalars['String']>;
  medicareGrpNumber?: Maybe<Scalars['String']>;
  middleName: Scalars['String'];
  npi?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  practiceId?: Maybe<Scalars['String']>;
  prefix?: Maybe<Scalars['String']>;
  prescriptiveAuthNumber?: Maybe<Scalars['String']>;
  providerIntials?: Maybe<Scalars['String']>;
  /** Send doctor Type from the string - Sign-up */
  roleType?: Maybe<Scalars['String']>;
  /** Doctor speciality */
  speciality?: Maybe<Speciality>;
  specialityLicense?: Maybe<Scalars['String']>;
  ssn?: Maybe<Scalars['String']>;
  stateLicense?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  taxId?: Maybe<Scalars['String']>;
  taxIdStuff?: Maybe<Scalars['String']>;
  taxonomyCode?: Maybe<Scalars['String']>;
  timeZone?: Maybe<Scalars['String']>;
  upin?: Maybe<Scalars['String']>;
};

export type CreateEmployerInput = {
  address?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  industry?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  patientId?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  usualOccupation?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
};

export type CreateExternalAppointmentInput = {
  createExternalAppointmentItemInput: CreateExternalAppointmentItemInput;
  createGuardianContactInput: CreateContactInput;
  createPatientItemInput: CreatePatientItemInput;
};

export type CreateExternalAppointmentItemInput = {
  billingStatus: BillingStatus;
  facilityId?: Maybe<Scalars['String']>;
  insuranceCompany?: Maybe<Scalars['String']>;
  isExternal?: Maybe<Scalars['Boolean']>;
  membershipID?: Maybe<Scalars['String']>;
  patientId?: Maybe<Scalars['String']>;
  paymentStatus?: Maybe<Scalars['String']>;
  paymentType: PaymentType;
  practiceId?: Maybe<Scalars['String']>;
  providerId?: Maybe<Scalars['String']>;
  scheduleEndDateTime: Scalars['String'];
  scheduleStartDateTime: Scalars['String'];
  serviceId: Scalars['String'];
};

export type CreateExternalInvoiceInputs = {
  amount: Scalars['String'];
  billingType: Billing_Type;
  facilityId: Scalars['String'];
  generatedBy?: Maybe<Scalars['String']>;
  paymentMethod: Scalars['String'];
  paymentTransactionId: Scalars['String'];
  status: Status;
};

export type CreateFacilityInput = {
  createBillingAddressInput: CreateBillingAddressInput;
  createContactInput: CreateContactInput;
  createFacilityItemInput: CreateFacilityItemInput;
};

export type CreateFacilityItemInput = {
  cliaIdNumber?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  endTime?: Maybe<Scalars['String']>;
  federalTaxId?: Maybe<Scalars['String']>;
  mammographyCertificationNumber?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  npi?: Maybe<Scalars['String']>;
  practiceId?: Maybe<Scalars['String']>;
  /** Facility type */
  practiceType?: Maybe<PracticeType>;
  /** Service Code type */
  serviceCode?: Maybe<ServiceCode>;
  startTime?: Maybe<Scalars['String']>;
  stateImmunizationId?: Maybe<Scalars['String']>;
  tamxonomyCode?: Maybe<Scalars['String']>;
  timeZone?: Maybe<Scalars['String']>;
};

export type CreateFormInput = {
  facilityId?: Maybe<Scalars['String']>;
  isActive?: Maybe<Scalars['Boolean']>;
  isSystemForm?: Maybe<Scalars['Boolean']>;
  layout: LayoutJsonInputType;
  name: Scalars['String'];
  practiceId?: Maybe<Scalars['String']>;
  type?: Maybe<FormType>;
};

export type CreateInvoiceInputs = {
  amount: Scalars['String'];
  appointmentId: Scalars['String'];
  billingType: Billing_Type;
  facilityId: Scalars['String'];
  generatedBy?: Maybe<Scalars['String']>;
  paymentMethod?: Maybe<Scalars['String']>;
  paymentTransactionId?: Maybe<Scalars['String']>;
  status: Status;
};

export type CreateLabTestInput = {
  createLabTestItemInput?: Maybe<CreateLabTestItemInput>;
  createSpecimenItemInput?: Maybe<Array<CreateSpecimenItemInput>>;
  diagnoses?: Maybe<Array<Scalars['String']>>;
  test?: Maybe<Scalars['String']>;
};

export type CreateLabTestItemInput = {
  accessionNumber?: Maybe<Scalars['String']>;
  appointmentId?: Maybe<Scalars['String']>;
  collectedDate?: Maybe<Scalars['String']>;
  doctorId?: Maybe<Scalars['String']>;
  labName?: Maybe<Scalars['String']>;
  orderNumber?: Maybe<Scalars['String']>;
  patientId: Scalars['String'];
  primaryProviderId?: Maybe<Scalars['String']>;
  providerNotes?: Maybe<Scalars['String']>;
  receivedDate?: Maybe<Scalars['String']>;
  referringProviderId?: Maybe<Scalars['String']>;
  status?: Maybe<LabTestStatus>;
  testDate?: Maybe<Scalars['String']>;
  testNotes?: Maybe<Scalars['String']>;
  testTime?: Maybe<Scalars['String']>;
  vendorName?: Maybe<Scalars['String']>;
};

export type CreateLabTestObservationInput = {
  createLabTestObservationItemInput?: Maybe<Array<CreateLabTestObservationItemInput>>;
  labTestId: Scalars['String'];
};

export type CreateLabTestObservationItemInput = {
  abnormalFlag: AbnormalFlag;
  description: Scalars['String'];
  doctorsSignOff?: Maybe<Scalars['Boolean']>;
  normalRange: Scalars['String'];
  normalRangeUnit: Scalars['String'];
  resultUnit: Scalars['String'];
  resultValue: Scalars['String'];
};

export type CreatePatientAllergyInput = {
  allergyId?: Maybe<Scalars['String']>;
  allergyName?: Maybe<Scalars['String']>;
  allergyOnset?: Maybe<AllergyOnset>;
  allergySeverity?: Maybe<AllergySeverity>;
  allergyStartDate?: Maybe<Scalars['String']>;
  allergyType?: Maybe<AllergyType>;
  appointmentId?: Maybe<Scalars['String']>;
  comments?: Maybe<Scalars['String']>;
  isActive?: Maybe<Scalars['Boolean']>;
  patientId: Scalars['String'];
  providerId?: Maybe<Scalars['String']>;
  reactionsIds: Array<Scalars['String']>;
  staffId?: Maybe<Scalars['String']>;
};

export type CreatePatientInput = {
  createContactInput: CreateContactInput;
  createEmergencyContactInput: CreateContactInput;
  createEmployerInput: CreateEmployerInput;
  createGuarantorContactInput: CreateContactInput;
  createGuardianContactInput: CreateContactInput;
  createNextOfKinContactInput: CreateContactInput;
  createPatientItemInput: CreatePatientItemInput;
};

export type CreatePatientItemInput = {
  adminId?: Maybe<Scalars['String']>;
  callToConsent?: Maybe<Scalars['Boolean']>;
  deceasedDate?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  ethnicity?: Maybe<Ethnicity>;
  facilityId?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  firstNameUsed?: Maybe<Scalars['String']>;
  gender?: Maybe<Genderidentity>;
  genderIdentity?: Maybe<Genderidentity>;
  holdStatement?: Maybe<Holdstatement>;
  homeBound?: Maybe<Homebound>;
  inviteAccepted?: Maybe<Scalars['Boolean']>;
  language?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  maritialStatus?: Maybe<Maritialstatus>;
  medicationHistoryAuthority?: Maybe<Scalars['Boolean']>;
  middleName?: Maybe<Scalars['String']>;
  motherMaidenName?: Maybe<Scalars['String']>;
  patientNote?: Maybe<Scalars['String']>;
  patientRecord?: Maybe<Scalars['String']>;
  pharmacy?: Maybe<Scalars['String']>;
  phonePermission?: Maybe<Scalars['Boolean']>;
  practiceId?: Maybe<Scalars['String']>;
  preferredCommunicationMethod?: Maybe<Communicationtype>;
  prefferedName?: Maybe<Scalars['String']>;
  previousFirstName?: Maybe<Scalars['String']>;
  previouslastName?: Maybe<Scalars['String']>;
  primaryDepartment?: Maybe<Scalars['String']>;
  privacyNotice?: Maybe<Scalars['Boolean']>;
  pronouns?: Maybe<Pronouns>;
  race?: Maybe<Race>;
  registrationDate?: Maybe<Scalars['String']>;
  registrationDepartment?: Maybe<Scalars['String']>;
  releaseOfInfoBill?: Maybe<Scalars['Boolean']>;
  sexAtBirth?: Maybe<Genderidentity>;
  sexualOrientation?: Maybe<Sexualorientation>;
  smsPermission?: Maybe<Scalars['Boolean']>;
  ssn?: Maybe<Scalars['String']>;
  statementDelivereOnline?: Maybe<Scalars['Boolean']>;
  statementNote?: Maybe<Scalars['String']>;
  statementNoteDateFrom?: Maybe<Scalars['String']>;
  statementNoteDateTo?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  usualProviderId?: Maybe<Scalars['String']>;
};

export type CreatePolicyInput = {
  coinsurancePercentage?: Maybe<Scalars['String']>;
  copays?: Maybe<Array<CopayInput>>;
  expirationDate?: Maybe<Scalars['String']>;
  groupNumber?: Maybe<Scalars['String']>;
  insuranceId?: Maybe<Scalars['String']>;
  issueDate?: Maybe<Scalars['String']>;
  memberId?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  orderOfBenefit?: Maybe<OrderOfBenefitType>;
  patientId?: Maybe<Scalars['String']>;
  policyHolderInfo?: Maybe<PolicyHolderInput>;
  policyHolderRelationship?: Maybe<PolicyHolderRelationshipType>;
  pricingProductType?: Maybe<PricingProductType>;
  primaryCareProviderId?: Maybe<Scalars['String']>;
  referringProviderId?: Maybe<Scalars['String']>;
};

export type CreatePracticeInput = {
  createContactInput?: Maybe<CreateContactInput>;
  createFacilityContactInput?: Maybe<CreateContactInput>;
  createFacilityItemInput?: Maybe<CreateFacilityItemInput>;
  createPracticeItemInput?: Maybe<CreatePracticeItemInput>;
  registerUserInput?: Maybe<RegisterUserInput>;
};

export type CreatePracticeItemInput = {
  champus?: Maybe<Scalars['String']>;
  ein?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  medicaid?: Maybe<Scalars['String']>;
  medicare?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  upin?: Maybe<Scalars['String']>;
};

export type CreateProblemInput = {
  appointmentId?: Maybe<Scalars['String']>;
  icdCodeId: Scalars['String'];
  note?: Maybe<Scalars['String']>;
  patientId: Scalars['String'];
  problemSeverity?: Maybe<ProblemSeverity>;
  problemStartDate?: Maybe<Scalars['String']>;
  problemType?: Maybe<ProblemType>;
  providerId?: Maybe<Scalars['String']>;
  snowMedCodeId?: Maybe<Scalars['String']>;
  staffId?: Maybe<Scalars['String']>;
};

export type CreateScheduleInput = {
  day: Scalars['String'];
  doctorId?: Maybe<Scalars['String']>;
  endAt: Scalars['String'];
  facilityId?: Maybe<Scalars['String']>;
  recurringEndDate?: Maybe<Scalars['DateTime']>;
  servicesIds: Array<Scalars['String']>;
  startAt: Scalars['String'];
};

export type CreateServiceInput = {
  color: Scalars['String'];
  duration: Scalars['String'];
  facilityId: Scalars['String'];
  isActive?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  price: Scalars['String'];
  /** Service type */
  serviceType?: Maybe<ServiceType>;
};

export type CreateSpecimenItemInput = {
  collectionDate?: Maybe<Scalars['String']>;
  collectionTime?: Maybe<Scalars['String']>;
  specimenNotes?: Maybe<Scalars['String']>;
  testSpecimen: Scalars['String'];
};

export type CreateStaffInput = {
  providers?: Maybe<Array<Scalars['String']>>;
  staffInput: CreateStaffItemInput;
};

export type CreateStaffItemInput = {
  adminId?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  facilityId?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  /** Staff gender */
  gender?: Maybe<Gender>;
  lastName: Scalars['String'];
  mobile?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  practiceId?: Maybe<Scalars['String']>;
  /** Send Investor Type from the ENUM - Sign-up */
  roleType?: Maybe<Scalars['String']>;
  username: Scalars['String'];
};

export type CreateUserFormInput = {
  DoctorId?: Maybe<Scalars['String']>;
  FormId: Scalars['String'];
  PatientId?: Maybe<Scalars['String']>;
  StaffId?: Maybe<Scalars['String']>;
  SubmitterId?: Maybe<Scalars['String']>;
  userFormElements: Array<UserFormElementInputs>;
};

export type CreateVitalInput = {
  PainRange?: Maybe<Scalars['String']>;
  PatientBMI?: Maybe<Scalars['String']>;
  PatientHeight?: Maybe<Scalars['String']>;
  PatientWeight?: Maybe<Scalars['String']>;
  appointmentId?: Maybe<Scalars['String']>;
  diastolicBloodPressure?: Maybe<Scalars['String']>;
  headCircumference: HeadCircumferenceType;
  oxygenSaturation?: Maybe<Scalars['String']>;
  patientHeadCircumference?: Maybe<Scalars['String']>;
  patientId: Scalars['String'];
  patientTemperature?: Maybe<Scalars['String']>;
  pulseRate?: Maybe<Scalars['String']>;
  respiratoryRate?: Maybe<Scalars['String']>;
  smokingStatus: SmokingStatus;
  staffId?: Maybe<Scalars['String']>;
  systolicBloodPressure?: Maybe<Scalars['String']>;
  temperatureUnitType: TempUnitType;
  unitType: UnitType;
  vitalCreationDate?: Maybe<Scalars['String']>;
  weightUnit: WeightType;
};

export type DisableDoctor = {
  id: Scalars['String'];
};

export type DisableStaff = {
  id: Scalars['String'];
};

export type Doctor = {
  __typename?: 'Doctor';
  anesthesiaLicense?: Maybe<Scalars['String']>;
  attachments?: Maybe<Array<Attachment>>;
  billingAddress?: Maybe<Array<BillingAddress>>;
  billingFacility?: Maybe<Scalars['String']>;
  blueShildNumber?: Maybe<Scalars['String']>;
  campusGrpNumber?: Maybe<Scalars['String']>;
  contacts?: Maybe<Array<Contact>>;
  createdAt: Scalars['String'];
  deaActiveDate?: Maybe<Scalars['String']>;
  deaNumber?: Maybe<Scalars['String']>;
  deaTermDate?: Maybe<Scalars['String']>;
  degreeCredentials?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['String']>;
  dpsCtpNumber?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  emcProviderId?: Maybe<Scalars['String']>;
  facility?: Maybe<Facility>;
  facilityId?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  labTests?: Maybe<Array<LabTests>>;
  languagesSpoken?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  licenseActiveDate?: Maybe<Scalars['String']>;
  licenseTermDate?: Maybe<Scalars['String']>;
  meammographyCertNumber?: Maybe<Scalars['String']>;
  medicaidGrpNumber?: Maybe<Scalars['String']>;
  medicareGrpNumber?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
  npi?: Maybe<Scalars['String']>;
  patientAllergies?: Maybe<Array<PatientAllergies>>;
  patientProblem?: Maybe<Array<PatientProblems>>;
  policyOfPrimaryCareProvider?: Maybe<Array<Policy>>;
  policyOfReferringProvider?: Maybe<Array<Policy>>;
  practiceId?: Maybe<Scalars['String']>;
  prefix?: Maybe<Scalars['String']>;
  prescriptiveAuthNumber?: Maybe<Scalars['String']>;
  primaryProviderLabTests?: Maybe<Array<LabTests>>;
  providerIntials?: Maybe<Scalars['String']>;
  referringProviderLabTests?: Maybe<Array<LabTests>>;
  schedule?: Maybe<Array<Schedule>>;
  speciality?: Maybe<Speciality>;
  specialityLicense?: Maybe<Scalars['String']>;
  ssn?: Maybe<Scalars['String']>;
  staff?: Maybe<Array<Maybe<Staff>>>;
  stateLicense?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  taxId?: Maybe<Scalars['String']>;
  taxIdStuff?: Maybe<Scalars['String']>;
  taxonomyCode?: Maybe<Scalars['String']>;
  telehealthLink?: Maybe<Scalars['String']>;
  timeZone?: Maybe<Scalars['String']>;
  transaction?: Maybe<Array<Transactions>>;
  updatedAt: Scalars['String'];
  upin?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type DoctorInput = {
  doctorFirstName?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
  practiceId?: Maybe<Scalars['String']>;
  searchString?: Maybe<Scalars['String']>;
};

export type DoctorPatient = {
  __typename?: 'DoctorPatient';
  createdAt: Scalars['String'];
  currentProvider?: Maybe<Scalars['Boolean']>;
  doctor?: Maybe<Doctor>;
  doctorId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  otherRelation?: Maybe<Scalars['String']>;
  patient?: Maybe<Patient>;
  patientId?: Maybe<Scalars['String']>;
  relation?: Maybe<DoctorPatientRelationType>;
  updatedAt: Scalars['String'];
};

/** The relationship of patient with doctor */
export enum DoctorPatientRelationType {
  BackupProvider = 'BACKUP_PROVIDER',
  OrderingProvider = 'ORDERING_PROVIDER',
  OtherProvider = 'OTHER_PROVIDER',
  PreferredProvider = 'PREFERRED_PROVIDER',
  PrimaryProvider = 'PRIMARY_PROVIDER',
  ReferringProvider = 'REFERRING_PROVIDER'
}

export type DoctorPatientsInput = {
  doctorId?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
};

export type DoctorPatientsPayload = {
  __typename?: 'DoctorPatientsPayload';
  doctorPatients?: Maybe<Array<Maybe<DoctorPatient>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type DoctorPayload = {
  __typename?: 'DoctorPayload';
  doctor?: Maybe<Doctor>;
  response?: Maybe<ResponsePayload>;
};

export type DocumentType = {
  __typename?: 'DocumentType';
  attachments?: Maybe<Array<AttachmentMetadata>>;
  createdAt: Scalars['String'];
  id: Scalars['String'];
  practice?: Maybe<Practice>;
  practiceId?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type DocumentTypeInput = {
  documentPracticeId?: Maybe<Scalars['String']>;
  documentTypeName?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
};

export type DocumentTypePayload = {
  __typename?: 'DocumentTypePayload';
  documentType?: Maybe<DocumentType>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type DocumentTypesPayload = {
  __typename?: 'DocumentTypesPayload';
  documentTypes?: Maybe<Array<Maybe<DocumentType>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

/** The patient's ethnicity type assigned */
export enum Ethnicity {
  DeclineToSpecify = 'DECLINE_TO_SPECIFY',
  HispanicOrLatino = 'HISPANIC_OR_LATINO',
  None = 'NONE',
  NotHispanicOrLatino = 'NOT_HISPANIC_OR_LATINO'
}

export type Element = {
  __typename?: 'Element';
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  type: ElementType;
  updatedAt?: Maybe<Scalars['String']>;
};

export type ElementInputs = {
  type: ElementType;
};

/** The form's element types */
export enum ElementType {
  Checkbox = 'CHECKBOX',
  Color = 'COLOR',
  Custom = 'CUSTOM',
  Date = 'DATE',
  Dropdown = 'DROPDOWN',
  Email = 'EMAIL',
  File = 'FILE',
  Image = 'IMAGE',
  Month = 'MONTH',
  Number = 'NUMBER',
  Password = 'PASSWORD',
  Radio = 'RADIO',
  Select = 'SELECT',
  Tel = 'TEL',
  Text = 'TEXT',
  Time = 'TIME',
  Url = 'URL',
  Week = 'WEEK'
}

export type EmergencyAccessUserInput = {
  email?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  paginationInput?: Maybe<PaginationInput>;
  practiceId?: Maybe<Scalars['String']>;
};

export type EmergencyAccessUserPayload = {
  __typename?: 'EmergencyAccessUserPayload';
  emergencyAccessUsers?: Maybe<Array<User>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type Employer = {
  __typename?: 'Employer';
  address?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  industry?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  patient?: Maybe<Patient>;
  patientId?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  usualOccupation?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
};

export type FacilitiesPayload = {
  __typename?: 'FacilitiesPayload';
  facilities?: Maybe<Array<Maybe<Facility>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type FacilitiesUser = {
  __typename?: 'FacilitiesUser';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  usersCount?: Maybe<Scalars['Float']>;
};

export type FacilitiesUserWithRoles = {
  __typename?: 'FacilitiesUserWithRoles';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  users?: Maybe<Array<UserWithRoles>>;
};

export type Facility = {
  __typename?: 'Facility';
  appointments?: Maybe<Array<Appointment>>;
  billingAddress?: Maybe<Array<BillingAddress>>;
  cliaIdNumber?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  contacts?: Maybe<Array<Contact>>;
  createdAt?: Maybe<Scalars['String']>;
  doctors?: Maybe<Array<Doctor>>;
  endTime?: Maybe<Scalars['String']>;
  federalTaxId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isPrimary?: Maybe<Scalars['Boolean']>;
  isPrivate?: Maybe<Scalars['Boolean']>;
  mammographyCertificationNumber?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  npi?: Maybe<Scalars['String']>;
  practice?: Maybe<Practice>;
  practiceId?: Maybe<Scalars['String']>;
  practiceType?: Maybe<PracticeType>;
  schedule?: Maybe<Array<Schedule>>;
  serviceCode: ServiceCode;
  services?: Maybe<Array<Service>>;
  staff?: Maybe<Array<Staff>>;
  startTime?: Maybe<Scalars['String']>;
  tamxonomyCode?: Maybe<Scalars['String']>;
  timeZone?: Maybe<Scalars['String']>;
  transaction?: Maybe<Array<Transactions>>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<Array<User>>;
};

export type FacilityInput = {
  facilityName?: Maybe<Scalars['String']>;
  isPrivate?: Maybe<Scalars['Boolean']>;
  paginationOptions: PaginationInput;
  practiceId?: Maybe<Scalars['String']>;
  singleFacilityId?: Maybe<Scalars['String']>;
};

export type FacilityPayload = {
  __typename?: 'FacilityPayload';
  facility?: Maybe<Facility>;
  response?: Maybe<ResponsePayload>;
};

export type FieldOptionsInputType = {
  name: Scalars['String'];
  value: Scalars['String'];
};

export type FieldOptionsType = {
  __typename?: 'FieldOptionsType';
  name: Scalars['String'];
  value: Scalars['String'];
};

export type FieldsInputs = {
  apiCall?: Maybe<Scalars['String']>;
  column: Scalars['Int'];
  columnName?: Maybe<Scalars['String']>;
  css: Scalars['String'];
  defaultValue: Scalars['String'];
  errorMsg: Scalars['String'];
  fieldId: Scalars['String'];
  isMultiSelect?: Maybe<Scalars['Boolean']>;
  label: Scalars['String'];
  name: Scalars['String'];
  options: Array<FieldOptionsInputType>;
  placeholder: Scalars['String'];
  required: Scalars['Boolean'];
  tableContactType?: Maybe<Scalars['String']>;
  tableName?: Maybe<Scalars['String']>;
  textArea: Scalars['Boolean'];
  type: ElementType;
};

export type FieldsTypes = {
  __typename?: 'FieldsTypes';
  apiCall?: Maybe<Scalars['String']>;
  column: Scalars['Int'];
  columnName?: Maybe<Scalars['String']>;
  css: Scalars['String'];
  defaultValue: Scalars['String'];
  errorMsg: Scalars['String'];
  fieldId: Scalars['String'];
  isMultiSelect?: Maybe<Scalars['Boolean']>;
  label: Scalars['String'];
  name: Scalars['String'];
  options: Array<FieldOptionsType>;
  placeholder: Scalars['String'];
  required: Scalars['Boolean'];
  tableContactType?: Maybe<Scalars['String']>;
  tableName?: Maybe<Scalars['String']>;
  textArea: Scalars['Boolean'];
  type: ElementType;
};

export type ForgotPasswordInput = {
  email: Scalars['String'];
};

export type ForgotPasswordPayload = {
  __typename?: 'ForgotPasswordPayload';
  response?: Maybe<ResponsePayload>;
};

export type Form = {
  __typename?: 'Form';
  createdAt?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  formElements?: Maybe<Array<FormElement>>;
  id: Scalars['String'];
  isActive?: Maybe<Scalars['Boolean']>;
  isSystemForm?: Maybe<Scalars['Boolean']>;
  layout: LayoutJsonType;
  name?: Maybe<Scalars['String']>;
  practiceId?: Maybe<Scalars['String']>;
  type: FormType;
  updatedAt?: Maybe<Scalars['String']>;
  userForms?: Maybe<Array<UserForms>>;
};

export type FormElement = {
  __typename?: 'FormElement';
  columnName?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  defaultValue?: Maybe<Scalars['String']>;
  element?: Maybe<Element>;
  errorMsg?: Maybe<Scalars['String']>;
  fieldId: Scalars['String'];
  id: Scalars['String'];
  isDeleted: Scalars['Boolean'];
  label?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  placeholder?: Maybe<Scalars['String']>;
  required?: Maybe<Scalars['Boolean']>;
  sectionId: Scalars['String'];
  tableContactType?: Maybe<Scalars['String']>;
  tableName?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type FormInput = {
  facilityId?: Maybe<Scalars['String']>;
  formType?: Maybe<FormType>;
  isSystemForm?: Maybe<Scalars['Boolean']>;
  paginationOptions: PaginationInput;
  practiceId?: Maybe<Scalars['String']>;
};

export type FormMediaPayload = {
  __typename?: 'FormMediaPayload';
  publicUrl?: Maybe<Scalars['String']>;
  response?: Maybe<ResponsePayloadResponse>;
};

export type FormPayload = {
  __typename?: 'FormPayload';
  form?: Maybe<Form>;
  response?: Maybe<ResponsePayload>;
};

export type FormTabs = {
  __typename?: 'FormTabs';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  sections: Array<SectionsTypes>;
};

export type FormTabsInputs = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  sections: Array<SectionsInputs>;
};

/** The form's types */
export enum FormType {
  Appointment = 'APPOINTMENT',
  Doctor = 'DOCTOR',
  Patient = 'PATIENT',
  PreDefined = 'PRE_DEFINED',
  Staff = 'STAFF',
  Template = 'TEMPLATE'
}

export type FormsPayload = {
  __typename?: 'FormsPayload';
  forms: Array<Form>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

/** The patient's sexual orientation type assigned */
export enum Genderidentity {
  DeclineToSpecify = 'DECLINE_TO_SPECIFY',
  Female = 'FEMALE',
  Male = 'MALE',
  None = 'NONE',
  TransgenderFemale = 'TRANSGENDER_FEMALE',
  TransgenderMale = 'TRANSGENDER_MALE'
}

/** The user gender assigned */
export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER'
}

export type GetAllTransactionsInputs = {
  facilityId?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
};

export type GetAppointment = {
  id: Scalars['String'];
};

export type GetAppointments = {
  doctorId?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
};

export type GetAttachment = {
  typeId: Scalars['String'];
};

export type GetAttachmentsByAgreementId = {
  agreementId: Scalars['String'];
  typeId: Scalars['String'];
};

export type GetAttachmentsByLabOrder = {
  orderNum: Scalars['String'];
  typeId: Scalars['String'];
};

export type GetAttachmentsByPolicyId = {
  policyId: Scalars['String'];
  typeId: Scalars['String'];
};

export type GetContact = {
  id?: Maybe<Scalars['String']>;
};

export type GetDoctor = {
  id: Scalars['String'];
};

export type GetDoctorSchedule = {
  id: Scalars['String'];
};

export type GetFacility = {
  id: Scalars['String'];
};

export type GetFacilitySchedule = {
  id: Scalars['String'];
};

export type GetForm = {
  id: Scalars['String'];
};

export type GetLabTest = {
  id?: Maybe<Scalars['String']>;
};

export type GetMedia = {
  id?: Maybe<Scalars['String']>;
};

export type GetPatient = {
  id: Scalars['String'];
};

export type GetPatientAllergy = {
  id: Scalars['String'];
};

export type GetPatientAppointmentInput = {
  patientId: Scalars['String'];
};

export type GetPatientProblem = {
  id: Scalars['String'];
};

export type GetPatientVital = {
  id: Scalars['String'];
};

export type GetPermission = {
  id?: Maybe<Scalars['String']>;
};

export type GetPractice = {
  id?: Maybe<Scalars['String']>;
};

export type GetPublicMediaInput = {
  formId: Scalars['String'];
  url: Scalars['String'];
};

export type GetRole = {
  id?: Maybe<Scalars['String']>;
};

export type GetSchedule = {
  id: Scalars['String'];
};

export type GetService = {
  id: Scalars['String'];
};

export type GetSlots = {
  currentDate: Scalars['String'];
  day?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  offset: Scalars['Float'];
  providerId?: Maybe<Scalars['String']>;
  serviceId: Scalars['String'];
};

export type GetStaff = {
  id: Scalars['String'];
};

export type GetUser = {
  id: Scalars['String'];
};

/** The patient's hold statement type assigned */
export enum Holdstatement {
  AccountTooLong = 'ACCOUNT_TOO_LONG',
  BadAddress = 'BAD_ADDRESS',
  Bankruptcy = 'BANKRUPTCY',
  ClaimCanceled = 'CLAIM_CANCELED',
  IncorrectGurantor = 'INCORRECT_GURANTOR',
  None = 'NONE',
  NoForwAddress = 'NO_FORW_ADDRESS',
  PatientDeaseased = 'PATIENT_DEASEASED',
  PracticeRequest = 'PRACTICE_REQUEST'
}

/** The patient's homebound type assigned */
export enum Homebound {
  No = 'NO',
  Yes = 'YES'
}

/** The patient's head circumference unit type assigned */
export enum HeadCircumferenceType {
  Centimeter = 'CENTIMETER',
  Inch = 'INCH'
}

export type IcdCodes = {
  __typename?: 'ICDCodes';
  code: Scalars['String'];
  createdAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  labTests?: Maybe<LabTests>;
  updatedAt?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
};

export type IcdCodesWithSnowMedCode = {
  __typename?: 'ICDCodesWithSnowMedCode';
  code: Scalars['String'];
  createdAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  labTests?: Maybe<LabTests>;
  snoMedCode?: Maybe<SnoMedCodes>;
  updatedAt?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
};

export type IcdCodesPayload = {
  __typename?: 'IcdCodesPayload';
  icdCodes?: Maybe<Array<Maybe<IcdCodesWithSnowMedCode>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type Insurance = {
  __typename?: 'Insurance';
  Note?: Maybe<Scalars['String']>;
  contacts?: Maybe<Array<Contact>>;
  createdAt?: Maybe<Scalars['String']>;
  electronicRemittanceAdvice?: Maybe<Scalars['Boolean']>;
  enrollmentRequired?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  lineOfBusiness: Scalars['String'];
  payerId: Scalars['String'];
  payerName: Scalars['String'];
  policies?: Maybe<Array<Policy>>;
  realTimeClaimStatus?: Maybe<Scalars['Boolean']>;
  realTimeEligibility?: Maybe<Scalars['Boolean']>;
  secondaryCoordinationBenefits?: Maybe<Scalars['Boolean']>;
  state?: Maybe<Scalars['String']>;
  type: InsurancePayerType;
  updatedAt?: Maybe<Scalars['String']>;
};

export type InsurancePaginationInput = {
  paginationOptions: PaginationInput;
  searchString?: Maybe<Scalars['String']>;
};

/** The insurance payer type */
export enum InsurancePayerType {
  Np = 'NP',
  P = 'P'
}

export type InsurancesPayload = {
  __typename?: 'InsurancesPayload';
  insurances: Array<Insurance>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<Response>;
};

export type Invoice = {
  __typename?: 'Invoice';
  amount: Scalars['String'];
  appointment?: Maybe<Appointment>;
  appointmentId?: Maybe<Scalars['String']>;
  billingType: Billing_Type;
  createdAt?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  generatedBy?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  invoiceNo: Scalars['String'];
  paymentMethod?: Maybe<Scalars['String']>;
  paymentTransactionId?: Maybe<Scalars['String']>;
  status: Status;
  transaction?: Maybe<Transactions>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type InvoiceInputs = {
  facilityId?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
};

export type InvoicePayload = {
  __typename?: 'InvoicePayload';
  invoice?: Maybe<Invoice>;
  response?: Maybe<ResponsePayload>;
};

export type InvoiceStatusInputs = {
  id: Scalars['String'];
  status: Status;
};

export type InvoicesPayload = {
  __typename?: 'InvoicesPayload';
  invoices?: Maybe<Array<Maybe<Invoice>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type LabTestByOrderNumInput = {
  labTestStatus?: Maybe<Scalars['String']>;
  orderNumber?: Maybe<Scalars['String']>;
  paginationOptions?: Maybe<PaginationInput>;
  patientId?: Maybe<Scalars['String']>;
};

export type LabTestInput = {
  labTestStatus?: Maybe<Scalars['String']>;
  orderNumber?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
  patientId?: Maybe<Scalars['String']>;
};

export type LabTestObservationPayload = {
  __typename?: 'LabTestObservationPayload';
  labTestObservation?: Maybe<Observations>;
  response?: Maybe<ResponsePayload>;
};

export type LabTestPayload = {
  __typename?: 'LabTestPayload';
  labTest?: Maybe<LabTests>;
  response?: Maybe<ResponsePayload>;
};

/** The lab's test status assigned */
export enum LabTestStatus {
  Discontinued = 'DISCONTINUED',
  InProgress = 'IN_PROGRESS',
  OrderEntered = 'ORDER_ENTERED',
  ResultReceived = 'RESULT_RECEIVED',
  ResultReviewedWithPatient = 'RESULT_REVIEWED_WITH_PATIENT'
}

export type LabTests = {
  __typename?: 'LabTests';
  accessionNumber?: Maybe<Scalars['String']>;
  appointment?: Maybe<Appointment>;
  appointmentId?: Maybe<Scalars['String']>;
  collectedDate?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  diagnoses?: Maybe<Array<Maybe<IcdCodes>>>;
  doctor?: Maybe<Doctor>;
  doctorId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  labName?: Maybe<Scalars['String']>;
  labTestStatus: LabTestStatus;
  orderNumber?: Maybe<Scalars['String']>;
  patient?: Maybe<Patient>;
  patientId?: Maybe<Scalars['String']>;
  primaryProvider?: Maybe<Doctor>;
  primaryProviderId?: Maybe<Scalars['String']>;
  providerNotes?: Maybe<Scalars['String']>;
  receivedDate?: Maybe<Scalars['String']>;
  referringProvider?: Maybe<Doctor>;
  referringProviderId?: Maybe<Scalars['String']>;
  test?: Maybe<LoincCodes>;
  testDate?: Maybe<Scalars['String']>;
  testNotes?: Maybe<Scalars['String']>;
  testObservations?: Maybe<Array<Observations>>;
  testSpecimens?: Maybe<Array<TestSpecimens>>;
  testTime?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  vendorName?: Maybe<Scalars['String']>;
};

export type LabTestsPayload = {
  __typename?: 'LabTestsPayload';
  labTests?: Maybe<Array<Maybe<LabTests>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type LayoutJsonInputType = {
  tabs: Array<FormTabsInputs>;
};

export type LayoutJsonType = {
  __typename?: 'LayoutJSONType';
  tabs: Array<FormTabs>;
};

export type LoginUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoincCodeInput = {
  component?: Maybe<Scalars['String']>;
  loincNum?: Maybe<Scalars['String']>;
};

export type LoincCodePayload = {
  __typename?: 'LoincCodePayload';
  loincCode?: Maybe<LoincCodes>;
  response?: Maybe<ResponsePayload>;
};

export type LoincCodes = {
  __typename?: 'LoincCodes';
  askAtOrderEntry?: Maybe<Scalars['String']>;
  associationObservations?: Maybe<Scalars['String']>;
  cdiscCommonTests?: Maybe<Scalars['String']>;
  changeReasonPublic?: Maybe<Scalars['String']>;
  chngType?: Maybe<Scalars['String']>;
  class?: Maybe<Scalars['String']>;
  classType?: Maybe<Scalars['String']>;
  commonOrderRank?: Maybe<Scalars['String']>;
  commonSiTestRank?: Maybe<Scalars['String']>;
  commonTestRank?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
  consumerName?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  definitionDescription?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  exampleSiUcumUnits?: Maybe<Scalars['String']>;
  exampleUcumUnits?: Maybe<Scalars['String']>;
  exampleUnits?: Maybe<Scalars['String']>;
  exmplAnswers?: Maybe<Scalars['String']>;
  externalCopyRightLink?: Maybe<Scalars['String']>;
  externalCopyRightNotice?: Maybe<Scalars['String']>;
  formula?: Maybe<Scalars['String']>;
  hl7AttachmentStructure?: Maybe<Scalars['String']>;
  hl7FieldSubFieldId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  labTests?: Maybe<Array<LabTests>>;
  loincNum?: Maybe<Scalars['String']>;
  longCommonName?: Maybe<Scalars['String']>;
  methodTyp?: Maybe<Scalars['String']>;
  observations?: Maybe<Array<Observations>>;
  orderObs?: Maybe<Scalars['String']>;
  panelType?: Maybe<Scalars['String']>;
  property?: Maybe<Scalars['String']>;
  relatedNames2?: Maybe<Scalars['String']>;
  scaleTyp?: Maybe<Scalars['String']>;
  shortName?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  statusReason?: Maybe<Scalars['String']>;
  statusText?: Maybe<Scalars['String']>;
  submittedUnits?: Maybe<Scalars['String']>;
  surveyQuestSRC?: Maybe<Scalars['String']>;
  surveyQuestTest?: Maybe<Scalars['String']>;
  system?: Maybe<Scalars['String']>;
  timeAspect?: Maybe<Scalars['String']>;
  unitsAndRange?: Maybe<Scalars['String']>;
  unitsRequired?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  validHl7AttachmentRequest?: Maybe<Scalars['String']>;
  versionFirstRelease?: Maybe<Scalars['String']>;
  versionLastChanged?: Maybe<Scalars['String']>;
};

export type LoincCodesPayload = {
  __typename?: 'LoincCodesPayload';
  loincCodes?: Maybe<Array<LoincCodes>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

/** The patient's maritial status type assigned */
export enum Maritialstatus {
  Divorced = 'DIVORCED',
  Maried = 'MARIED',
  Separated = 'SEPARATED',
  Single = 'SINGLE',
  Widowed = 'WIDOWED'
}

export type Mutation = {
  __typename?: 'Mutation';
  achPayment: TransactionPayload;
  activateUser: UserPayload;
  addPatientAllergy: PatientAllergyPayload;
  addPatientProblem: PatientProblemPayload;
  addPatientVital: PatientVitalPayload;
  assignPermissionToRole: PermissionPayload;
  cancelAppointment: AppointmentPayload;
  chargeAfterAppointment: AppointmentPayload;
  chargePayment: TransactionPayload;
  createAgreement: AgreementPayload;
  createAppointment: AppointmentPayload;
  createAttachmentData: AttachmentPayload;
  createBilling: BillingPayload;
  createContact: ContactPayload;
  createCopay: Copay;
  createDoctor: DoctorPayload;
  createElement: Element;
  createExternalAppointment: AppointmentPayload;
  createExternalInvoice: InvoicePayload;
  createFacility: FacilityPayload;
  createForm: FormPayload;
  createFormTemplate: FormPayload;
  createInvoice: InvoicePayload;
  createLabTest: LabTestPayload;
  createLabTestObservation: LabTestObservationPayload;
  createLoincCode: LoincCodePayload;
  createPatient: PatientPayload;
  createPermission: PermissionPayload;
  createPolicy: PolicyPayload;
  createPolicyHolder: PolicyHolder;
  createPractice: PracticePayload;
  createRole: RolePayload;
  createSchedule: SchedulePayload;
  createService: ServicePayload;
  createStaff: StaffPayload;
  deactivateUser: UserPayload;
  disableDoctor: DoctorPayload;
  disableStaff: StaffPayload;
  forgotPassword: ForgotPasswordPayload;
  getAllTransactions: TransactionsPayload;
  getFormPublicMediaUrl: FormMediaPayload;
  login: AccessUserPayload;
  patientInfo: PatientPayload;
  registerUser: UserPayload;
  removeAgreement: AgreementPayload;
  removeAppointment: AppointmentPayload;
  removeAttachmentData: AttachmentPayload;
  removeAttachmentMedia: AttachmentPayload;
  removeContact: ContactPayload;
  removeDoctor: DoctorPayload;
  removeFacility: FacilityPayload;
  removeForm: FormPayload;
  removeLabTest: LabTestPayload;
  removeLabTestObservation: LabTestObservationPayload;
  removePatient: PatientPayload;
  removePatientAllergy: PatientAllergyPayload;
  removePatientProblem: PatientProblemPayload;
  removePatientVital: PatientVitalPayload;
  removePermission: PermissionPayload;
  removePractice: PracticePayload;
  removeRole: RolePayload;
  removeSchedule: SchedulePayload;
  removeService: ServicePayload;
  removeStaff: StaffPayload;
  removeUser: UserPayload;
  resendVerificationEmail: UserPayload;
  resentOTP: UserPayload;
  resetPassword: UserPayload;
  saveUserFormValues: UserFormPayload;
  sendInviteToPatient: PatientPayload;
  update2FactorAuth: UserPayload;
  updateAgreement: AgreementPayload;
  updateAppointment: AppointmentPayload;
  updateAppointmentBillingStatus: AppointmentPayload;
  updateAppointmentStatus: AppointmentPayload;
  updateAttachmentData: AttachmentPayload;
  updateAutoLogoutTime: UserPayload;
  updateContact: ContactPayload;
  updateDoctor: DoctorPayload;
  updateFacility: FacilityPayload;
  updateFacilityTimeZone: FacilityPayload;
  updateForm: FormPayload;
  updateInvoiceStatus: InvoicePayload;
  updateLabTest: LabTestPayload;
  updateLabTestObservation: LabTestObservationPayload;
  updateLabTestsByOrderNum: LabTestsPayload;
  updateLoincCode: LoincCodePayload;
  updatePassword: UserPayload;
  updatePatient: PatientPayload;
  updatePatientAllergy: PatientAllergyPayload;
  updatePatientNoteInfo: PatientPayload;
  updatePatientProblem: PatientProblemPayload;
  updatePatientProfile: PatientPayload;
  updatePatientProvider: PatientPayload;
  updatePatientProviderRelation: PatientDoctorPayload;
  updatePatientVital: PatientVitalPayload;
  updatePermission: PermissionPayload;
  updatePolicy: PolicyPayload;
  updatePractice: PracticePayload;
  updateRole: RolePayload;
  updateSchedule: SchedulePayload;
  updateService: ServicePayload;
  updateStaff: StaffPayload;
  updateUser: UserPayload;
  updateUserRole: UserPayload;
  verifyEmail: UserPayload;
  verifyOTP: UserPayload;
};


export type MutationAchPaymentArgs = {
  achPaymentInputs: AchPaymentInputs;
};


export type MutationActivateUserArgs = {
  user: UserIdInput;
};


export type MutationAddPatientAllergyArgs = {
  createPatientAllergyInput: CreatePatientAllergyInput;
};


export type MutationAddPatientProblemArgs = {
  createProblemInput: CreateProblemInput;
};


export type MutationAddPatientVitalArgs = {
  createVitalInput: CreateVitalInput;
};


export type MutationAssignPermissionToRoleArgs = {
  rolePermissionItemInput: RolePermissionItemInput;
};


export type MutationCancelAppointmentArgs = {
  cancelAppointment: CancelAppointment;
};


export type MutationChargeAfterAppointmentArgs = {
  paymentInput: PaymentInputsAfterAppointment;
};


export type MutationChargePaymentArgs = {
  paymentInput: PaymentInput;
};


export type MutationCreateAgreementArgs = {
  createAgreementInput: AgreementInput;
};


export type MutationCreateAppointmentArgs = {
  createAppointmentInput: CreateAppointmentInput;
};


export type MutationCreateAttachmentDataArgs = {
  createAttachmentInput: CreateAttachmentInput;
};


export type MutationCreateBillingArgs = {
  createBillingInput: BillingInput;
};


export type MutationCreateContactArgs = {
  createContactInput: CreateContactInput;
};


export type MutationCreateCopayArgs = {
  createCopayInput: CopayInput;
};


export type MutationCreateDoctorArgs = {
  createDoctorInput: CreateDoctorInput;
};


export type MutationCreateElementArgs = {
  inputs: ElementInputs;
};


export type MutationCreateExternalAppointmentArgs = {
  createExternalAppointmentInput: CreateExternalAppointmentInput;
};


export type MutationCreateExternalInvoiceArgs = {
  createExternalInvoiceInputs: CreateExternalInvoiceInputs;
};


export type MutationCreateFacilityArgs = {
  createFacilityInput: CreateFacilityInput;
};


export type MutationCreateFormArgs = {
  createFormInput: CreateFormInput;
};


export type MutationCreateFormTemplateArgs = {
  createFormInput: CreateFormInput;
};


export type MutationCreateInvoiceArgs = {
  createInvoiceInputs: CreateInvoiceInputs;
};


export type MutationCreateLabTestArgs = {
  createLabTestInput: CreateLabTestInput;
};


export type MutationCreateLabTestObservationArgs = {
  createLabTestObservationInput: CreateLabTestObservationInput;
};


export type MutationCreateLoincCodeArgs = {
  loincCodeInput: LoincCodeInput;
};


export type MutationCreatePatientArgs = {
  createPatientInput: CreatePatientInput;
};


export type MutationCreatePermissionArgs = {
  permissionItemInput: PermissionItemInput;
};


export type MutationCreatePolicyArgs = {
  createPolicyInput: CreatePolicyInput;
};


export type MutationCreatePolicyHolderArgs = {
  createPolicyHolderInput: PolicyHolderInput;
};


export type MutationCreatePracticeArgs = {
  createPracticeInput: CreatePracticeInput;
};


export type MutationCreateRoleArgs = {
  roleItemInput: RoleItemInput;
};


export type MutationCreateScheduleArgs = {
  createScheduleInput: Array<CreateScheduleInput>;
};


export type MutationCreateServiceArgs = {
  createServiceInput: CreateServiceInput;
};


export type MutationCreateStaffArgs = {
  createStaffInput: CreateStaffInput;
};


export type MutationDeactivateUserArgs = {
  user: UserIdInput;
};


export type MutationDisableDoctorArgs = {
  disableDoctor: DisableDoctor;
};


export type MutationDisableStaffArgs = {
  disableStaff: DisableStaff;
};


export type MutationForgotPasswordArgs = {
  forgotPassword: ForgotPasswordInput;
};


export type MutationGetAllTransactionsArgs = {
  transactionInputs: GetAllTransactionsInputs;
};


export type MutationGetFormPublicMediaUrlArgs = {
  getPublicMediaInput: GetPublicMediaInput;
};


export type MutationLoginArgs = {
  loginUser: LoginUserInput;
};


export type MutationPatientInfoArgs = {
  patientInfoInput: PatientInfoInput;
};


export type MutationRegisterUserArgs = {
  user: RegisterUserInput;
};


export type MutationRemoveAgreementArgs = {
  agreementId: Scalars['String'];
};


export type MutationRemoveAppointmentArgs = {
  removeAppointment: RemoveAppointment;
};


export type MutationRemoveAttachmentDataArgs = {
  removeAttachment: RemoveAttachment;
};


export type MutationRemoveAttachmentMediaArgs = {
  id: Scalars['String'];
};


export type MutationRemoveContactArgs = {
  removeContact: RemoveContact;
};


export type MutationRemoveDoctorArgs = {
  removeDoctor: RemoveDoctor;
};


export type MutationRemoveFacilityArgs = {
  removeFacility: RemoveFacility;
};


export type MutationRemoveFormArgs = {
  removeForm: RemoveForm;
};


export type MutationRemoveLabTestArgs = {
  removeLabTest: RemoveLabTest;
};


export type MutationRemoveLabTestObservationArgs = {
  removeLabTestObservation: RemoveLabTestObservation;
};


export type MutationRemovePatientArgs = {
  removePatient: RemovePatient;
};


export type MutationRemovePatientAllergyArgs = {
  removePatientAllergy: RemovePatientAllergy;
};


export type MutationRemovePatientProblemArgs = {
  removeProblem: RemoveProblem;
};


export type MutationRemovePatientVitalArgs = {
  removeVital: RemoveVital;
};


export type MutationRemovePermissionArgs = {
  removePermission: RemovePermission;
};


export type MutationRemovePracticeArgs = {
  removePractice: RemovePractice;
};


export type MutationRemoveRoleArgs = {
  removeRole: RemoveRole;
};


export type MutationRemoveScheduleArgs = {
  removeSchedule: RemoveSchedule;
};


export type MutationRemoveServiceArgs = {
  removeService: RemoveService;
};


export type MutationRemoveStaffArgs = {
  removeStaff: RemoveStaff;
};


export type MutationRemoveUserArgs = {
  userIdInput: UserIdInput;
};


export type MutationResendVerificationEmailArgs = {
  resendVerificationEmail: ResendVerificationEmail;
};


export type MutationResetPasswordArgs = {
  resetPassword: ResetPasswordInput;
};


export type MutationSaveUserFormValuesArgs = {
  createUserFormInput: CreateUserFormInput;
};


export type MutationSendInviteToPatientArgs = {
  patientInviteInput: PatientInviteInput;
};


export type MutationUpdate2FactorAuthArgs = {
  twoFactorInput: TwoFactorInput;
};


export type MutationUpdateAgreementArgs = {
  updateAgreementInput: UpdateAgreementInput;
};


export type MutationUpdateAppointmentArgs = {
  updateAppointmentInput: UpdateAppointmentInput;
};


export type MutationUpdateAppointmentBillingStatusArgs = {
  updateAppointmentBillingStatusInput: UpdateAppointmentBillingStatusInput;
};


export type MutationUpdateAppointmentStatusArgs = {
  appointmentStatusInput: UpdateAppointmentStatusInput;
};


export type MutationUpdateAttachmentDataArgs = {
  updateAttachmentInput: UpdateAttachmentInput;
};


export type MutationUpdateAutoLogoutTimeArgs = {
  userInfoInput: UserInfoInput;
};


export type MutationUpdateContactArgs = {
  updateContactInput: UpdateContactInput;
};


export type MutationUpdateDoctorArgs = {
  updateDoctorInput: UpdateDoctorInput;
};


export type MutationUpdateFacilityArgs = {
  updateFacilityInput: UpdateFacilityInput;
};


export type MutationUpdateFacilityTimeZoneArgs = {
  updateFacilityTimeZoneInput: UpdateFacilityTimeZoneInput;
};


export type MutationUpdateFormArgs = {
  updateFormInput: UpdateFormInput;
};


export type MutationUpdateInvoiceStatusArgs = {
  invoiceStatusInputs: InvoiceStatusInputs;
};


export type MutationUpdateLabTestArgs = {
  updateLabTestInput: UpdateLabTestInput;
};


export type MutationUpdateLabTestObservationArgs = {
  updateLabTestObservationInput: UpdateLabTestObservationInput;
};


export type MutationUpdateLabTestsByOrderNumArgs = {
  updateLabTestItemInput: CreateLabTestItemInput;
};


export type MutationUpdateLoincCodeArgs = {
  updateLoincCodeInput: UpdateLoincCodeInput;
};


export type MutationUpdatePasswordArgs = {
  updatePasswordInput: UpdatePasswordInput;
};


export type MutationUpdatePatientArgs = {
  updatePatientInput: UpdatePatientInput;
};


export type MutationUpdatePatientAllergyArgs = {
  updateAllergyInput: UpdateAllergyInput;
};


export type MutationUpdatePatientNoteInfoArgs = {
  updatePatientNoteInfoInputs: UpdatePatientNoteInfoInputs;
};


export type MutationUpdatePatientProblemArgs = {
  updateProblemInput: UpdateProblemInput;
};


export type MutationUpdatePatientProfileArgs = {
  updatePatientProfileInput: UpdatePatientProfileInput;
};


export type MutationUpdatePatientProviderArgs = {
  updatePatientProvider: UpdatePatientProvider;
};


export type MutationUpdatePatientProviderRelationArgs = {
  updatePatientProviderRelationInputs: UpdatePatientProviderRelationInputs;
};


export type MutationUpdatePatientVitalArgs = {
  updateVitalInput: UpdateVitalInput;
};


export type MutationUpdatePermissionArgs = {
  updatePermissionItemInput: UpdatePermissionItemInput;
};


export type MutationUpdatePolicyArgs = {
  updatePolicyInput: UpdatePolicyInput;
};


export type MutationUpdatePracticeArgs = {
  updatePracticeInput: UpdatePracticeInput;
};


export type MutationUpdateRoleArgs = {
  updateRoleItemInput: UpdateRoleItemInput;
};


export type MutationUpdateScheduleArgs = {
  updateScheduleInput: UpdateScheduleInput;
};


export type MutationUpdateServiceArgs = {
  updateServiceInput: UpdateServiceInput;
};


export type MutationUpdateStaffArgs = {
  updateStaffInput: UpdateStaffInput;
};


export type MutationUpdateUserArgs = {
  user: UpdateUserInput;
};


export type MutationUpdateUserRoleArgs = {
  user: UpdateRoleInput;
};


export type MutationVerifyEmailArgs = {
  verifyEmail: VerifyEmailInput;
};


export type MutationVerifyOtpArgs = {
  verifyCodeInput: VerifyCodeInput;
};

export type Observations = {
  __typename?: 'Observations';
  abnormalFlag: AbnormalFlag;
  attachments?: Maybe<Array<Attachment>>;
  createdAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  doctorsSignOff?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  labTest?: Maybe<LabTests>;
  labTestId?: Maybe<Scalars['String']>;
  loincCodes?: Maybe<LoincCodes>;
  normalRange?: Maybe<Scalars['String']>;
  normalRangeUnit?: Maybe<Scalars['String']>;
  resultUnit?: Maybe<Scalars['String']>;
  resultValue?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

/** The patient billing status assigned */
export enum OnsetDateType {
  DateOfAccident = 'DATE_OF_ACCIDENT',
  LastMenstrualPeriod = 'LAST_MENSTRUAL_PERIOD',
  OnsetOfCurrentSymptomsOrIllness = 'ONSET_OF_CURRENT_SYMPTOMS_OR_ILLNESS'
}

/** The order of benefit type */
export enum OrderOfBenefitType {
  Primary = 'PRIMARY',
  Secondary = 'SECONDARY',
  Tertiary = 'TERTIARY'
}

/** The patient billing status assigned */
export enum OtherDateType {
  InitialTreatmentDate = 'INITIAL_TREATMENT_DATE',
  InitialVisitDate = 'INITIAL_VISIT_DATE',
  LastRelatedVisit = 'LAST_RELATED_VISIT'
}

/** The Policy Holder gender Type */
export enum Policy_Holder_Gender_Identity {
  Female = 'FEMALE',
  Male = 'MALE',
  None = 'NONE',
  NotExclusive = 'NOT_EXCLUSIVE',
  TransgenderFemale = 'TRANSGENDER_FEMALE',
  TransgenderMale = 'TRANSGENDER_MALE'
}

/** The patient's pronouns type assigned */
export enum Pronouns {
  He = 'HE',
  None = 'NONE',
  She = 'SHE'
}

export type PaginationInput = {
  limit: Scalars['Int'];
  page: Scalars['Int'];
};

export type PaginationPayload = {
  __typename?: 'PaginationPayload';
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
  totalPages?: Maybe<Scalars['Int']>;
};

export type Patient = {
  __typename?: 'Patient';
  appointments?: Maybe<Array<Appointment>>;
  attachments?: Maybe<Array<Attachment>>;
  billings?: Maybe<Array<Billing>>;
  callToConsent: Scalars['Boolean'];
  contacts?: Maybe<Array<Contact>>;
  createdAt: Scalars['String'];
  deceasedDate?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['String']>;
  doctorPatients?: Maybe<Array<DoctorPatient>>;
  email?: Maybe<Scalars['String']>;
  employer?: Maybe<Employer>;
  ethnicity?: Maybe<Ethnicity>;
  facility?: Maybe<Facility>;
  facilityId?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  firstNameUsed?: Maybe<Scalars['String']>;
  gender: Genderidentity;
  genderIdentity?: Maybe<Genderidentity>;
  holdStatement?: Maybe<Holdstatement>;
  homeBound?: Maybe<Homebound>;
  id: Scalars['String'];
  inviteAccepted?: Maybe<Scalars['Boolean']>;
  labTests?: Maybe<Array<LabTests>>;
  language?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  maritialStatus?: Maybe<Maritialstatus>;
  medicationHistoryAuthority: Scalars['Boolean'];
  middleName?: Maybe<Scalars['String']>;
  motherMaidenName?: Maybe<Scalars['String']>;
  patientAllergies?: Maybe<Array<PatientAllergies>>;
  patientNote?: Maybe<Scalars['String']>;
  patientNoteOpen?: Maybe<Scalars['Boolean']>;
  patientProblems?: Maybe<Array<PatientProblems>>;
  patientRecord?: Maybe<Scalars['String']>;
  patientVitals?: Maybe<Array<PatientVitals>>;
  pharmacy?: Maybe<Scalars['String']>;
  phonePermission?: Maybe<Scalars['Boolean']>;
  policies?: Maybe<Array<Policy>>;
  policyHolder?: Maybe<PolicyHolder>;
  policyHolderId?: Maybe<Scalars['String']>;
  practiceId?: Maybe<Scalars['String']>;
  preferredCommunicationMethod: Communicationtype;
  prefferedName?: Maybe<Scalars['String']>;
  previousFirstName?: Maybe<Scalars['String']>;
  previouslastName?: Maybe<Scalars['String']>;
  privacyNotice: Scalars['Boolean'];
  profileAttachment?: Maybe<Scalars['String']>;
  pronouns?: Maybe<Pronouns>;
  race?: Maybe<Race>;
  registrationDate?: Maybe<Scalars['String']>;
  releaseOfInfoBill: Scalars['Boolean'];
  sexAtBirth?: Maybe<Genderidentity>;
  sexualOrientation?: Maybe<Sexualorientation>;
  smsPermission?: Maybe<Scalars['Boolean']>;
  ssn?: Maybe<Scalars['String']>;
  statementDelivereOnline?: Maybe<Scalars['Boolean']>;
  statementNote?: Maybe<Scalars['String']>;
  statementNoteDateFrom?: Maybe<Scalars['String']>;
  statementNoteDateTo?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  transaction?: Maybe<Array<Transactions>>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
};

export type PatientAllergies = {
  __typename?: 'PatientAllergies';
  allergy?: Maybe<Allergies>;
  allergyOnset: AllergyOnset;
  allergySeverity: AllergySeverity;
  allergyStartDate?: Maybe<Scalars['String']>;
  appointment?: Maybe<Appointment>;
  appointmentId?: Maybe<Scalars['String']>;
  comments?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  doctor?: Maybe<Doctor>;
  doctorId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isActive?: Maybe<Scalars['Boolean']>;
  patient?: Maybe<Patient>;
  patientId?: Maybe<Scalars['String']>;
  reactions?: Maybe<Array<Maybe<Reactions>>>;
  staff?: Maybe<Staff>;
  staffId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type PatientAllergiesPayload = {
  __typename?: 'PatientAllergiesPayload';
  pagination?: Maybe<PaginationPayload>;
  patientAllergies?: Maybe<Array<Maybe<PatientAllergies>>>;
  response?: Maybe<ResponsePayload>;
};

export type PatientAllergyInput = {
  appointmentId?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
  patientId?: Maybe<Scalars['String']>;
};

export type PatientAllergyPayload = {
  __typename?: 'PatientAllergyPayload';
  patientAllergy?: Maybe<PatientAllergies>;
  response?: Maybe<ResponsePayload>;
};

export type PatientAttachmentsInput = {
  AttachmentModuleType?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
  searchString?: Maybe<Scalars['String']>;
  typeId?: Maybe<Scalars['String']>;
};

export type PatientAttachmentsPayload = {
  __typename?: 'PatientAttachmentsPayload';
  attachments?: Maybe<Array<Maybe<Attachment>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

/** The patient billing status assigned */
export enum PatientBillingStatus {
  AutoAccidentClaim = 'AUTO_ACCIDENT_CLAIM',
  BalanceDue = 'BALANCE_DUE',
  BillInsurance = 'BILL_INSURANCE',
  BillSecondaryInsurance = 'BILL_SECONDARY_INSURANCE',
  DurableMedicalEquipmentClaim = 'DURABLE_MEDICAL_EQUIPMENT_CLAIM',
  InternalReview = 'INTERNAL_REVIEW',
  PaidInFull = 'PAID_IN_FULL',
  Settled = 'SETTLED',
  WorkersCompClaim = 'WORKERS_COMP_CLAIM'
}

export type PatientDoctorPayload = {
  __typename?: 'PatientDoctorPayload';
  provider?: Maybe<DoctorPatient>;
  response?: Maybe<ResponsePayload>;
};

export type PatientInfoInput = {
  createContactInput: CreateContactInput;
  createEmergencyContactInput: CreateContactInput;
  patientInfoItemInput: PatientInfoItemInput;
};

export type PatientInfoItemInput = {
  ethnicity?: Maybe<Ethnicity>;
  id: Scalars['String'];
  language?: Maybe<Scalars['String']>;
  maritialStatus?: Maybe<Maritialstatus>;
  pharmacy?: Maybe<Scalars['String']>;
  phonePermission?: Maybe<Scalars['Boolean']>;
  preferredCommunicationMethod?: Maybe<Communicationtype>;
  race?: Maybe<Race>;
  smsPermission?: Maybe<Scalars['Boolean']>;
  ssn?: Maybe<Scalars['String']>;
};

export type PatientInput = {
  appointmentDate?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['String']>;
  doctorId?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
  patientRecord?: Maybe<Scalars['String']>;
  practiceId?: Maybe<Scalars['String']>;
  searchString?: Maybe<Scalars['String']>;
};

export type PatientInviteInput = {
  adminId: Scalars['String'];
  id: Scalars['String'];
};

export type PatientPastUpcomingAppointment = {
  __typename?: 'PatientPastUpcomingAppointment';
  pastAppointment?: Maybe<Appointment>;
  upcomingAppointment?: Maybe<Appointment>;
};

export type PatientPastUpcomingAppointmentPayload = {
  __typename?: 'PatientPastUpcomingAppointmentPayload';
  appointments?: Maybe<PatientPastUpcomingAppointment>;
  response?: Maybe<ResponsePayload>;
};

export type PatientPayload = {
  __typename?: 'PatientPayload';
  patient?: Maybe<Patient>;
  response?: Maybe<ResponsePayload>;
};

/** The patient payment type used to billing */
export enum PatientPaymentType {
  Insurance = 'INSURANCE',
  NoInsurance = 'NO_INSURANCE'
}

export type PatientProblemInput = {
  paginationOptions: PaginationInput;
  patientId?: Maybe<Scalars['String']>;
};

export type PatientProblemPayload = {
  __typename?: 'PatientProblemPayload';
  patientProblem?: Maybe<PatientProblems>;
  response?: Maybe<ResponsePayload>;
};

export type PatientProblems = {
  __typename?: 'PatientProblems';
  ICDCode?: Maybe<IcdCodes>;
  appointment?: Maybe<Appointment>;
  createdAt?: Maybe<Scalars['String']>;
  doctor?: Maybe<Doctor>;
  id: Scalars['String'];
  note?: Maybe<Scalars['String']>;
  patient?: Maybe<Patient>;
  patientId?: Maybe<Scalars['String']>;
  problemSeverity: ProblemSeverity;
  problemStartDate?: Maybe<Scalars['String']>;
  problemType: ProblemType;
  snowMedCode?: Maybe<SnoMedCodes>;
  staff?: Maybe<Staff>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type PatientProblemsPayload = {
  __typename?: 'PatientProblemsPayload';
  pagination?: Maybe<PaginationPayload>;
  patientProblems?: Maybe<Array<Maybe<PatientProblems>>>;
  response?: Maybe<ResponsePayload>;
};

export type PatientProviderInputs = {
  patientId: Scalars['String'];
  providerId?: Maybe<Scalars['String']>;
};

export type PatientProviderPayload = {
  __typename?: 'PatientProviderPayload';
  providers?: Maybe<Array<DoctorPatient>>;
  response?: Maybe<ResponsePayload>;
};

export type PatientVitalInput = {
  appointmentId?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
  patientId?: Maybe<Scalars['String']>;
};

export type PatientVitalPayload = {
  __typename?: 'PatientVitalPayload';
  patientVital?: Maybe<PatientVitals>;
  response?: Maybe<ResponsePayload>;
};

export type PatientVitals = {
  __typename?: 'PatientVitals';
  PainRange?: Maybe<Scalars['String']>;
  PatientBMI?: Maybe<Scalars['String']>;
  PatientHeight?: Maybe<Scalars['String']>;
  PatientWeight?: Maybe<Scalars['String']>;
  addedBy?: Maybe<Staff>;
  appointment?: Maybe<Appointment>;
  appointmentId?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  diastolicBloodPressure?: Maybe<Scalars['String']>;
  headCircumference: HeadCircumferenceType;
  id: Scalars['String'];
  oxygenSaturation?: Maybe<Scalars['String']>;
  patient?: Maybe<Patient>;
  patientHeadCircumference?: Maybe<Scalars['String']>;
  patientId?: Maybe<Scalars['String']>;
  patientTemperature?: Maybe<Scalars['String']>;
  pulseRate?: Maybe<Scalars['String']>;
  respiratoryRate?: Maybe<Scalars['String']>;
  smokingStatus: SmokingStatus;
  systolicBloodPressure?: Maybe<Scalars['String']>;
  temperatureUnitType: TempUnitType;
  unitType: UnitType;
  updatedAt?: Maybe<Scalars['String']>;
  vitalCreationDate?: Maybe<Scalars['String']>;
  weightUnit: WeightType;
};

export type PatientVitalsPayload = {
  __typename?: 'PatientVitalsPayload';
  pagination?: Maybe<PaginationPayload>;
  patientVitals?: Maybe<Array<Maybe<PatientVitals>>>;
  response?: Maybe<ResponsePayload>;
};

export type PatientsPayload = {
  __typename?: 'PatientsPayload';
  facilityId?: Maybe<Scalars['String']>;
  pagination?: Maybe<PaginationPayload>;
  patients?: Maybe<Array<Maybe<Patient>>>;
  response?: Maybe<ResponsePayload>;
};

export type PaymentInput = {
  appointmentId?: Maybe<Scalars['String']>;
  clientIntent?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  patientId?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
  providerId?: Maybe<Scalars['String']>;
  serviceId?: Maybe<Scalars['String']>;
};

export type PaymentInputsAfterAppointment = {
  appointmentId: Scalars['String'];
  clientIntent: Scalars['String'];
  facilityId?: Maybe<Scalars['String']>;
  patientId: Scalars['String'];
  price: Scalars['String'];
  providerId?: Maybe<Scalars['String']>;
};

/** The patient payment type assigned */
export enum PaymentType {
  Contract = 'CONTRACT',
  Insurance = 'INSURANCE',
  Self = 'SELF'
}

export type Permission = {
  __typename?: 'Permission';
  createdAt: Scalars['String'];
  id: Scalars['String'];
  moduleType?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  rolePermissions?: Maybe<Array<RolePermission>>;
  status?: Maybe<Scalars['Boolean']>;
  updatedAt: Scalars['String'];
};

export type PermissionInput = {
  paginationOptions: PaginationInput;
};

export type PermissionItemInput = {
  moduleType: Scalars['String'];
  name: Scalars['String'];
  roleId?: Maybe<Scalars['String']>;
};

export type PermissionPayload = {
  __typename?: 'PermissionPayload';
  permission?: Maybe<Permission>;
  response?: Maybe<ResponsePayload>;
};

export type PermissionsPayload = {
  __typename?: 'PermissionsPayload';
  pagination?: Maybe<PaginationPayload>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
  response?: Maybe<ResponsePayload>;
};

export type PoliciesPayload = {
  __typename?: 'PoliciesPayload';
  pagination?: Maybe<PaginationPayload>;
  policies: Array<Policy>;
  response?: Maybe<Response>;
};

export type Policy = {
  __typename?: 'Policy';
  coinsurancePercentage?: Maybe<Scalars['String']>;
  copays?: Maybe<Array<Copay>>;
  createdAt: Scalars['String'];
  expirationDate?: Maybe<Scalars['String']>;
  groupNumber?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  insurance?: Maybe<Insurance>;
  insuranceId?: Maybe<Scalars['String']>;
  issueDate?: Maybe<Scalars['String']>;
  memberId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  orderOfBenefit?: Maybe<OrderOfBenefitType>;
  patient?: Maybe<Patient>;
  patientId?: Maybe<Scalars['String']>;
  policyHolder?: Maybe<PolicyHolder>;
  policyHolderId?: Maybe<Scalars['String']>;
  policyHolderRelationship?: Maybe<PolicyHolderRelationshipType>;
  pricingProductType?: Maybe<PricingProductType>;
  primaryCareProvider?: Maybe<Doctor>;
  primaryCareProviderId?: Maybe<Scalars['String']>;
  referringProvider?: Maybe<Doctor>;
  referringProviderId?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type PolicyHolder = {
  __typename?: 'PolicyHolder';
  address?: Maybe<Scalars['String']>;
  addressCTD?: Maybe<Scalars['String']>;
  certificationNumber?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  dob?: Maybe<Scalars['String']>;
  employer?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
  patients?: Maybe<Array<Patient>>;
  policies?: Maybe<Array<Policy>>;
  sex?: Maybe<Policy_Holder_Gender_Identity>;
  ssn?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  zipCode?: Maybe<Scalars['String']>;
};

export type PolicyHolderInput = {
  address?: Maybe<Scalars['String']>;
  addressCTD?: Maybe<Scalars['String']>;
  certificationNumber?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['String']>;
  employer?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
  sex?: Maybe<Policy_Holder_Gender_Identity>;
  ssn?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
};

export type PolicyHolderPaginationInput = {
  paginationOptions: PaginationInput;
};

/** The Policy Holder Relationship Type */
export enum PolicyHolderRelationshipType {
  CadaverDonor = 'CADAVER_DONOR',
  Child = 'CHILD',
  ChildFatherInsurance = 'CHILD_FATHER_INSURANCE',
  ChildFatherInsNotFinanciallyResponse = 'CHILD_FATHER_INS_NOT_FINANCIALLY_RESPONSE',
  ChildInsNotFinanciallyResponse = 'CHILD_INS_NOT_FINANCIALLY_RESPONSE',
  ChildMotherInsurance = 'CHILD_MOTHER_INSURANCE',
  ChildMotherInsNotFinanciallyResponse = 'CHILD_MOTHER_INS_NOT_FINANCIALLY_RESPONSE',
  DependentOfMinorDependent = 'DEPENDENT_OF_MINOR_DEPENDENT',
  EmancipatedMinor = 'EMANCIPATED_MINOR',
  Employee = 'EMPLOYEE',
  Father = 'FATHER',
  FosterChild = 'FOSTER_CHILD',
  Grandchild = 'GRANDCHILD',
  Grandparent = 'GRANDPARENT',
  HandicappedDependent = 'HANDICAPPED_DEPENDENT',
  InjuredPlaintiff = 'INJURED_PLAINTIFF',
  LifePartner = 'LIFE_PARTNER',
  Mother = 'MOTHER',
  NephewOrNiece = 'NEPHEW_OR_NIECE',
  OrganDonor = 'ORGAN_DONOR',
  Other = 'OTHER',
  Self = 'SELF',
  SignificantOther = 'SIGNIFICANT_OTHER',
  SponsoredDependent = 'SPONSORED_DEPENDENT',
  Spouse = 'SPOUSE',
  StepsonOrStepdaugter = 'STEPSON_OR_STEPDAUGTER',
  StepsonOrStepdaugterStepfatherInsurance = 'STEPSON_OR_STEPDAUGTER_STEPFATHER_INSURANCE',
  StepsonOrStepdaugterStepmotherInsurance = 'STEPSON_OR_STEPDAUGTER_STEPMOTHER_INSURANCE',
  Unknown = 'UNKNOWN',
  Ward = 'WARD'
}

export type PolicyHoldersPayload = {
  __typename?: 'PolicyHoldersPayload';
  pagination?: Maybe<PaginationPayload>;
  policyHolders: Array<PolicyHolder>;
  response?: Maybe<Response>;
};

export type PolicyPaginationInput = {
  paginationOptions: PaginationInput;
  patientId?: Maybe<Scalars['String']>;
};

export type PolicyPayload = {
  __typename?: 'PolicyPayload';
  pagination?: Maybe<PaginationPayload>;
  policy: Policy;
  response?: Maybe<Response>;
};

export type Practice = {
  __typename?: 'Practice';
  active?: Maybe<Scalars['Boolean']>;
  attachments?: Maybe<Array<Attachment>>;
  champus?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  documentTypes?: Maybe<Array<DocumentType>>;
  ein?: Maybe<Scalars['String']>;
  facilities?: Maybe<Array<Facility>>;
  fax?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  medicaid?: Maybe<Scalars['String']>;
  medicare?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  practiceId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  upin?: Maybe<Scalars['String']>;
};

export type PracticeFacilities = {
  __typename?: 'PracticeFacilities';
  facility?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type PracticeFacilitiesPayload = {
  __typename?: 'PracticeFacilitiesPayload';
  practiceFacilities?: Maybe<Array<PracticeFacilities>>;
  response?: Maybe<ResponsePayloadResponse>;
};

export type PracticeFacilitiesUsersInputs = {
  practiceId?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<PracticeRolesTypes>>;
};

export type PracticeFacilityAppointment = {
  __typename?: 'PracticeFacilityAppointment';
  count: Scalars['Float'];
  facility?: Maybe<Scalars['String']>;
};

export type PracticeFacilityAppointmentsInputs = {
  practiceId?: Maybe<Scalars['String']>;
};

export type PracticeFacilityAppointmentsPayload = {
  __typename?: 'PracticeFacilityAppointmentsPayload';
  facilitiesAppointments?: Maybe<Array<PracticeFacilityAppointment>>;
  response?: Maybe<ResponsePayloadResponse>;
};

export type PracticeInput = {
  paginationOptions: PaginationInput;
  practiceName?: Maybe<Scalars['String']>;
};

export type PracticePayload = {
  __typename?: 'PracticePayload';
  practice?: Maybe<Practice>;
  response?: Maybe<ResponsePayload>;
};

/** The type is assigned */
export enum PracticeRolesTypes {
  Doctor = 'DOCTOR',
  Patient = 'PATIENT'
}

/** The facility practice type assigned type */
export enum PracticeType {
  Clinic = 'CLINIC',
  Hospital = 'HOSPITAL',
  Lab = 'LAB'
}

export type PracticeUserRoles = {
  __typename?: 'PracticeUserRoles';
  count: Scalars['Float'];
  role?: Maybe<Scalars['String']>;
};

export type PracticeUserRolesPayload = {
  __typename?: 'PracticeUserRolesPayload';
  response?: Maybe<ResponsePayloadResponse>;
  userRoles?: Maybe<Array<PracticeUserRoles>>;
};

export type PracticeUsers = {
  __typename?: 'PracticeUsers';
  facilities?: Maybe<Array<FacilitiesUser>>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  userCount?: Maybe<Scalars['Float']>;
};

export type PracticeUsersPayload = {
  __typename?: 'PracticeUsersPayload';
  practiceUsers?: Maybe<Array<PracticeUsers>>;
  response?: Maybe<ResponsePayloadResponse>;
};

export type PracticeUsersWithRoles = {
  __typename?: 'PracticeUsersWithRoles';
  facilities?: Maybe<Array<FacilitiesUserWithRoles>>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  userCount?: Maybe<Scalars['Float']>;
};

export type PracticeUsersWithRolesPayload = {
  __typename?: 'PracticeUsersWithRolesPayload';
  practiceUsers?: Maybe<Array<PracticeUsersWithRoles>>;
  response?: Maybe<ResponsePayloadResponse>;
};

export type PracticesPayload = {
  __typename?: 'PracticesPayload';
  pagination?: Maybe<PaginationPayload>;
  practices?: Maybe<Array<Maybe<Practice>>>;
  response?: Maybe<ResponsePayload>;
};

export type PracticesViaDate = {
  __typename?: 'PracticesViaDate';
  count?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

export type PracticesViaDateInputs = {
  date: Scalars['Float'];
};

export type PracticesViaDatePayload = {
  __typename?: 'PracticesViaDatePayload';
  practices?: Maybe<Array<PracticesViaDate>>;
  response?: Maybe<ResponsePayloadResponse>;
};

/** The Policy Holder Relationship Type */
export enum PricingProductType {
  AutomobileMedical = 'AUTOMOBILE_MEDICAL',
  BlueCrossBlueShield = 'BLUE_CROSS_BLUE_SHIELD',
  Champus = 'CHAMPUS',
  CommercialInsuranceCo = 'COMMERCIAL_INSURANCE_CO',
  DentalMaintenanceOrganization = 'DENTAL_MAINTENANCE_ORGANIZATION',
  Disability = 'DISABILITY',
  ExclusiveProviderOrganizationEpo = 'EXCLUSIVE_PROVIDER_ORGANIZATION_EPO',
  FederalEmployeesProgram = 'FEDERAL_EMPLOYEES_PROGRAM',
  HealthMaintenanceOrganization = 'HEALTH_MAINTENANCE_ORGANIZATION',
  HealthMaintenanceOrganizationHmoMedicareRisk = 'HEALTH_MAINTENANCE_ORGANIZATION_HMO_MEDICARE_RISK',
  IndemnityInsurance = 'INDEMNITY_INSURANCE',
  LiabilityMedical = 'LIABILITY_MEDICAL',
  Medicaid = 'MEDICAID',
  MedicarePartA = 'MEDICARE_PART_A',
  MedicarePartB = 'MEDICARE_PART_B',
  MutuallyDefined = 'MUTUALLY_DEFINED',
  OtherFederalProgram = 'OTHER_FEDERAL_PROGRAM',
  OtherNonFederalProgram = 'OTHER_NON_FEDERAL_PROGRAM',
  PointOfServicePos = 'POINT_OF_SERVICE_POS',
  PreferredProviderOrganizationPpo = 'PREFERRED_PROVIDER_ORGANIZATION_PPO',
  TitleV = 'TITLE_V',
  VeteransAffairsPlan = 'VETERANS_AFFAIRS_PLAN',
  WorkersCompensationHealthClaim = 'WORKERS_COMPENSATION_HEALTH_CLAIM'
}

/** The patient's problem severity type assigned */
export enum ProblemSeverity {
  Acute = 'ACUTE',
  Chronic = 'CHRONIC'
}

/** The patient's problem type assigned */
export enum ProblemType {
  Active = 'ACTIVE',
  Historic = 'HISTORIC'
}

export type Query = {
  __typename?: 'Query';
  GetPermission: PermissionPayload;
  fetchAgreement: AgreementPayload;
  fetchAllAgreements: AgreementsPayload;
  fetchAllInsurances: InsurancesPayload;
  fetchAllPatients: PatientsPayload;
  fetchAllPolicies: PoliciesPayload;
  fetchAllPolicyHolders: PolicyHoldersPayload;
  fetchAllRoles: RolesPayload;
  fetchAllUsers: UsersPayload;
  fetchBillingDetailsByAppointmentId: BillingPayload;
  fetchDocumentType: DocumentTypesPayload;
  fetchDocumentTypeByName: DocumentTypePayload;
  fetchDocumentTypes: DocumentTypesPayload;
  fetchEmergencyAccessUsers: EmergencyAccessUserPayload;
  fetchICDCodes: IcdCodesPayload;
  fetchInsurance: InsurancesPayload;
  fetchPatientInsurances: PoliciesPayload;
  fetchPolicy: PolicyPayload;
  fetchPolicyHolder: PolicyHolder;
  fetchUser: UserPayload;
  findAllAllergies: AllergiesPayload;
  findAllAppointments: AppointmentsPayload;
  findAllContacts: ContactsPayload;
  findAllDoctor: AllDoctorPayload;
  findAllDoctorPatients: DoctorPatientsPayload;
  findAllFacility: FacilitiesPayload;
  findAllForms: FormsPayload;
  findAllLabTest: LabTestsPayload;
  findAllLoincCodes: LoincCodesPayload;
  findAllPatient: PatientsPayload;
  findAllPatientAllergies: PatientAllergiesPayload;
  findAllPatientProblem: PatientProblemsPayload;
  findAllPatientVitals: PatientVitalsPayload;
  findAllPermissions: PermissionsPayload;
  findAllPractices: PracticesPayload;
  findAllReactions: ReactionsPayload;
  findAllSchedules: SchedulesPayload;
  findAllServices: ServicesPayload;
  findAllStaff: AllStaffPayload;
  findAllTestSpecimenTypes: TestSpecimenTypesPayload;
  findAllUpcomingAppointments: AppointmentsPayload;
  findAllUsersForms: UserFormsPayload;
  findLabTestsByOrderNum: LabTestsPayload;
  findLoincCode: LoincCodes;
  findPatientAttachments: PatientAttachmentsPayload;
  getActiveInactivePractices: ActiveInactivePracticesPayload;
  getAllInvoices: InvoicesPayload;
  getAllRoles: RolesPayload;
  getAppointment: AppointmentPayload;
  getAppointments: AppointmentsPayload;
  getAttachment: AttachmentMediaPayload;
  getAttachments: AttachmentsPayload;
  getAttachmentsByAgreementId: AttachmentWithPreSignedUrlPayload;
  getAttachmentsByLabOrder: AttachmentsPayload;
  getAttachmentsByPolicyId: AttachmentsPayload;
  getContact: ContactPayload;
  getDoctor: DoctorPayload;
  getDoctorSchedule: SchedulesPayload;
  getFacility: FacilityPayload;
  getFacilitySchedule: SchedulesPayload;
  getForm: FormPayload;
  getLabTest: LabTestPayload;
  getPatient: PatientPayload;
  getPatientAllergy: PatientAllergyPayload;
  getPatientAppointment: AppointmentsPayload;
  getPatientPastUpcomingAppointment: PatientPastUpcomingAppointmentPayload;
  getPatientProblem: PatientProblemPayload;
  getPatientProvider: PatientDoctorPayload;
  getPatientProviders: PatientProviderPayload;
  getPatientVital: PatientVitalPayload;
  getPractice: PracticePayload;
  getPracticeFacilitiesUsersWithRoles: PracticeUsersWithRolesPayload;
  getPracticeFacilityAppointments: PracticeFacilityAppointmentsPayload;
  getPracticesByYear: PracticesViaDatePayload;
  getPracticesFacilities: PracticeFacilitiesPayload;
  getPracticesUser: PracticeUsersPayload;
  getPublicForm: FormPayload;
  getRole: RolePayload;
  getSchedule: SchedulePayload;
  getService: ServicePayload;
  getSlots: SlotsPayload;
  getSpecimenTypeByName: SpecimenTypes;
  getStaff: StaffPayload;
  getToken: BraintreePayload;
  getTransaction: TransactionPayload;
  getUser: UserPayload;
  getUsersWithRoles: PracticeUserRolesPayload;
  me: UserPayload;
  searchIcdCodes: IcdCodesPayload;
  searchSnoMedCodeByIcdCodes: SnoMedCodesPayload;
  searchUser: UsersPayload;
};


export type QueryGetPermissionArgs = {
  getPermission: GetPermission;
};


export type QueryFetchAgreementArgs = {
  agreementId: Scalars['String'];
};


export type QueryFetchAllAgreementsArgs = {
  agreementPaginationInput: AgreementPaginationInput;
};


export type QueryFetchAllInsurancesArgs = {
  insuranceInput: InsurancePaginationInput;
};


export type QueryFetchAllPatientsArgs = {
  patientInput: PatientInput;
};


export type QueryFetchAllPoliciesArgs = {
  policyInput: PolicyPaginationInput;
};


export type QueryFetchAllPolicyHoldersArgs = {
  policyHolderPaginationInput: PolicyHolderPaginationInput;
};


export type QueryFetchAllUsersArgs = {
  userInput: UsersInput;
};


export type QueryFetchBillingDetailsByAppointmentIdArgs = {
  appointmentId: Scalars['String'];
};


export type QueryFetchDocumentTypeArgs = {
  id: Scalars['String'];
};


export type QueryFetchDocumentTypeByNameArgs = {
  name: Scalars['String'];
};


export type QueryFetchDocumentTypesArgs = {
  documentTypeInput: DocumentTypeInput;
};


export type QueryFetchEmergencyAccessUsersArgs = {
  emergencyAccessUsersInput: EmergencyAccessUserInput;
};


export type QueryFetchIcdCodesArgs = {
  searchIcdCodesInput: SearchIcdCodesInput;
};


export type QueryFetchInsuranceArgs = {
  searchTerm: Scalars['String'];
};


export type QueryFetchPatientInsurancesArgs = {
  id: Scalars['String'];
};


export type QueryFetchPolicyArgs = {
  id: Scalars['String'];
};


export type QueryFetchPolicyHolderArgs = {
  id: Scalars['String'];
};


export type QueryFindAllAllergiesArgs = {
  allergyInput: AllergyInput;
};


export type QueryFindAllAppointmentsArgs = {
  appointmentInput: AppointmentInput;
};


export type QueryFindAllContactsArgs = {
  contactInput: ContactInput;
};


export type QueryFindAllDoctorArgs = {
  doctorInput: DoctorInput;
};


export type QueryFindAllDoctorPatientsArgs = {
  doctorPatientsInput: DoctorPatientsInput;
};


export type QueryFindAllFacilityArgs = {
  facilityInput: FacilityInput;
};


export type QueryFindAllFormsArgs = {
  formInput: FormInput;
};


export type QueryFindAllLabTestArgs = {
  labTestInput: LabTestInput;
};


export type QueryFindAllLoincCodesArgs = {
  searchLoincCodesInput: SearchLoincCodesInput;
};


export type QueryFindAllPatientArgs = {
  patientInput: PatientInput;
};


export type QueryFindAllPatientAllergiesArgs = {
  patientAllergyInput: PatientAllergyInput;
};


export type QueryFindAllPatientProblemArgs = {
  patientProblemInput: PatientProblemInput;
};


export type QueryFindAllPatientVitalsArgs = {
  patientVitalInput: PatientVitalInput;
};


export type QueryFindAllPermissionsArgs = {
  permissionInput: PermissionInput;
};


export type QueryFindAllPracticesArgs = {
  practiceInput: PracticeInput;
};


export type QueryFindAllReactionsArgs = {
  reactionInput: ReactionInput;
};


export type QueryFindAllSchedulesArgs = {
  scheduleInput: ScheduleInput;
};


export type QueryFindAllServicesArgs = {
  serviceInput: ServiceInput;
};


export type QueryFindAllStaffArgs = {
  staffInput: StaffInput;
};


export type QueryFindAllTestSpecimenTypesArgs = {
  testSpecimenTypeInput: TestSpecimenTypeInput;
};


export type QueryFindAllUpcomingAppointmentsArgs = {
  upComingAppointmentsInput: UpComingAppointmentsInput;
};


export type QueryFindAllUsersFormsArgs = {
  userFormInput: UserFormInput;
};


export type QueryFindLabTestsByOrderNumArgs = {
  labTestByOrderNumInput: LabTestByOrderNumInput;
};


export type QueryFindLoincCodeArgs = {
  id: Scalars['String'];
};


export type QueryFindPatientAttachmentsArgs = {
  patientAttachmentsInput: PatientAttachmentsInput;
};


export type QueryGetAllInvoicesArgs = {
  invoiceInput: InvoiceInputs;
};


export type QueryGetAllRolesArgs = {
  roleInput: RoleInput;
};


export type QueryGetAppointmentArgs = {
  getAppointment: GetAppointment;
};


export type QueryGetAppointmentsArgs = {
  getAppointments: GetAppointments;
};


export type QueryGetAttachmentArgs = {
  getMedia: GetMedia;
};


export type QueryGetAttachmentsArgs = {
  getAttachment: GetAttachment;
};


export type QueryGetAttachmentsByAgreementIdArgs = {
  getAttachmentsByAgreementId: GetAttachmentsByAgreementId;
};


export type QueryGetAttachmentsByLabOrderArgs = {
  getAttachmentsByLabOrder: GetAttachmentsByLabOrder;
};


export type QueryGetAttachmentsByPolicyIdArgs = {
  getAttachmentsByPolicyId: GetAttachmentsByPolicyId;
};


export type QueryGetContactArgs = {
  getContact: GetContact;
};


export type QueryGetDoctorArgs = {
  getDoctor: GetDoctor;
};


export type QueryGetDoctorScheduleArgs = {
  getDoctorSchedule: GetDoctorSchedule;
};


export type QueryGetFacilityArgs = {
  getFacility: GetFacility;
};


export type QueryGetFacilityScheduleArgs = {
  getFacilitySchedule: GetFacilitySchedule;
};


export type QueryGetFormArgs = {
  getForm: GetForm;
};


export type QueryGetLabTestArgs = {
  getLabTest: GetLabTest;
};


export type QueryGetPatientArgs = {
  getPatient: GetPatient;
};


export type QueryGetPatientAllergyArgs = {
  getPatientAllergy: GetPatientAllergy;
};


export type QueryGetPatientAppointmentArgs = {
  getPatientAppointmentInput: GetPatientAppointmentInput;
};


export type QueryGetPatientPastUpcomingAppointmentArgs = {
  getPatientAppointmentInput: GetPatientAppointmentInput;
};


export type QueryGetPatientProblemArgs = {
  getPatientProblem: GetPatientProblem;
};


export type QueryGetPatientProviderArgs = {
  patientProviderInputs: PatientProviderInputs;
};


export type QueryGetPatientProvidersArgs = {
  getPatient: GetPatient;
};


export type QueryGetPatientVitalArgs = {
  getPatientVital: GetPatientVital;
};


export type QueryGetPracticeArgs = {
  getPractice: GetPractice;
};


export type QueryGetPracticeFacilitiesUsersWithRolesArgs = {
  practiceFacilitiesUsersInputs: PracticeFacilitiesUsersInputs;
};


export type QueryGetPracticeFacilityAppointmentsArgs = {
  practiceFacilityAppointmentsInputs: PracticeFacilityAppointmentsInputs;
};


export type QueryGetPracticesByYearArgs = {
  practicesViaDateInputs: PracticesViaDateInputs;
};


export type QueryGetPublicFormArgs = {
  getForm: GetForm;
};


export type QueryGetRoleArgs = {
  getRole: GetRole;
};


export type QueryGetScheduleArgs = {
  getSchedule: GetSchedule;
};


export type QueryGetServiceArgs = {
  getService: GetService;
};


export type QueryGetSlotsArgs = {
  getSlots: GetSlots;
};


export type QueryGetSpecimenTypeByNameArgs = {
  name: Scalars['String'];
};


export type QueryGetStaffArgs = {
  getStaff: GetStaff;
};


export type QueryGetTransactionArgs = {
  id: Scalars['String'];
};


export type QueryGetUserArgs = {
  getUser: GetUser;
};


export type QueryGetUsersWithRolesArgs = {
  usersWithRolesInputs: UsersWithRolesInputs;
};


export type QuerySearchIcdCodesArgs = {
  searchIcdCodesInput: SearchIcdCodesInput;
};


export type QuerySearchSnoMedCodeByIcdCodesArgs = {
  searchSnoMedCodesInput: SearchSnoMedCodesInput;
};


export type QuerySearchUserArgs = {
  search: Scalars['String'];
};

/** The user race assigned */
export enum Race {
  AmericanIndianAlaskaNative = 'AMERICAN_INDIAN_ALASKA_NATIVE',
  Asian = 'ASIAN',
  BlackAfricanAmerican = 'BLACK_AFRICAN_AMERICAN',
  NativeHawaiianPacificIslander = 'NATIVE_HAWAIIAN_PACIFIC_ISLANDER',
  Other = 'OTHER',
  White = 'WHITE'
}

export type ReactionInput = {
  paginationOptions: PaginationInput;
  reactionName?: Maybe<Scalars['String']>;
};

export type Reactions = {
  __typename?: 'Reactions';
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
  patientAllergies?: Maybe<PatientAllergies>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type ReactionsPayload = {
  __typename?: 'ReactionsPayload';
  pagination?: Maybe<PaginationPayload>;
  reactions?: Maybe<Array<Maybe<Reactions>>>;
  response?: Maybe<ResponsePayload>;
};

export type RegisterUserInput = {
  adminId?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  facilityId?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  isAdmin?: Maybe<Scalars['Boolean']>;
  lastName?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  /** string type role - Sign-up */
  roleType?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
};

/** The user's relationship assigned */
export enum RelationshipType {
  CadaverDonor = 'CADAVER_DONOR',
  Child = 'CHILD',
  ChildFatherInsurance = 'CHILD_FATHER_INSURANCE',
  ChildMotherInsurance = 'CHILD_MOTHER_INSURANCE',
  DependentOfMinorDependent = 'DEPENDENT_OF_MINOR_DEPENDENT',
  EmancipatedMinor = 'EMANCIPATED_MINOR',
  Employee = 'EMPLOYEE',
  Father = 'FATHER',
  FostherChild = 'FOSTHER_CHILD',
  Grandchild = 'GRANDCHILD',
  Grandparent = 'GRANDPARENT',
  HandicappedDependent = 'HANDICAPPED_DEPENDENT',
  InjuredPlaintiiff = 'INJURED_PLAINTIIFF',
  LifePartner = 'LIFE_PARTNER',
  Mother = 'MOTHER',
  NephewNiece = 'NEPHEW_NIECE',
  OrganDonor = 'ORGAN_DONOR',
  Other = 'OTHER',
  Self = 'SELF',
  SignificantOther = 'SIGNIFICANT_OTHER',
  SponsoredDependent = 'SPONSORED_DEPENDENT',
  Spouse = 'SPOUSE',
  StepsonStepdaughter = 'STEPSON_STEPDAUGHTER',
  StepsonStepdaughterStepfatherInsrtance = 'STEPSON_STEPDAUGHTER_STEPFATHER_INSRTANCE',
  StepsonStepdaughterStepmotherInsrtance = 'STEPSON_STEPDAUGHTER_STEPMOTHER_INSRTANCE',
  Unknown = 'UNKNOWN',
  Ward = 'WARD'
}

export type RemoveAppointment = {
  id: Scalars['String'];
};

export type RemoveAttachment = {
  id?: Maybe<Scalars['String']>;
};

export type RemoveContact = {
  id?: Maybe<Scalars['String']>;
};

export type RemoveDoctor = {
  id: Scalars['String'];
};

export type RemoveFacility = {
  id: Scalars['String'];
};

export type RemoveForm = {
  id: Scalars['String'];
};

export type RemoveLabTest = {
  id?: Maybe<Scalars['String']>;
};

export type RemoveLabTestObservation = {
  id: Scalars['String'];
};

export type RemovePatient = {
  id: Scalars['String'];
};

export type RemovePatientAllergy = {
  id: Scalars['String'];
};

export type RemovePermission = {
  id?: Maybe<Scalars['String']>;
};

export type RemovePractice = {
  id?: Maybe<Scalars['String']>;
};

export type RemoveProblem = {
  id: Scalars['String'];
};

export type RemoveRole = {
  id?: Maybe<Scalars['String']>;
};

export type RemoveSchedule = {
  id: Scalars['String'];
};

export type RemoveService = {
  id: Scalars['String'];
};

export type RemoveStaff = {
  id: Scalars['String'];
};

export type RemoveVital = {
  id: Scalars['String'];
};

export type ResendVerificationEmail = {
  email?: Maybe<Scalars['String']>;
};

export type ResetPasswordInput = {
  password: Scalars['String'];
  token: Scalars['String'];
};

export type Response = {
  __typename?: 'Response';
  message?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Int']>;
};

export type ResponsePayload = {
  __typename?: 'ResponsePayload';
  error?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Float']>;
};

export type ResponsePayloadResponse = {
  __typename?: 'ResponsePayloadResponse';
  error?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Float']>;
};

export type Role = {
  __typename?: 'Role';
  createdAt?: Maybe<Scalars['String']>;
  customRole?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  role?: Maybe<Scalars['String']>;
  rolePermissions?: Maybe<Array<RolePermission>>;
  updatedAt?: Maybe<Scalars['String']>;
  users?: Maybe<User>;
};

export type RoleInput = {
  customRole?: Maybe<Scalars['Boolean']>;
  paginationOptions: PaginationInput;
  role?: Maybe<Scalars['String']>;
  roleName?: Maybe<Scalars['String']>;
};

export type RoleItemInput = {
  customRole?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  role: Scalars['String'];
};

export type RolePayload = {
  __typename?: 'RolePayload';
  response?: Maybe<ResponsePayload>;
  role?: Maybe<Role>;
};

export type RolePermission = {
  __typename?: 'RolePermission';
  createdAt: Scalars['String'];
  id: Scalars['String'];
  isMutable?: Maybe<Scalars['Boolean']>;
  permission?: Maybe<Permission>;
  permissionId?: Maybe<Scalars['String']>;
  role?: Maybe<Role>;
  roleId?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type RolePermissionItemInput = {
  permissionsId?: Maybe<Array<Scalars['String']>>;
  roleId: Scalars['String'];
};

export type RolesPayload = {
  __typename?: 'RolesPayload';
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
  roles?: Maybe<Array<Maybe<Role>>>;
};

/** The patient's sexual orientation type assigned */
export enum Sexualorientation {
  Bisexual = 'BISEXUAL',
  DontKnow = 'DONT_KNOW',
  Heterosexual = 'HETEROSEXUAL',
  Homosexual = 'HOMOSEXUAL',
  None = 'NONE'
}

/** The invoice status */
export enum Status {
  InsuranceClaim = 'INSURANCE_CLAIM',
  Paid = 'PAID',
  Pending = 'PENDING'
}

export type Schedule = {
  __typename?: 'Schedule';
  createdAt: Scalars['String'];
  day?: Maybe<Scalars['String']>;
  doctor?: Maybe<Doctor>;
  doctorId?: Maybe<Scalars['String']>;
  endAt: Scalars['String'];
  facility?: Maybe<Facility>;
  facilityId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  recurringEndDate?: Maybe<Scalars['DateTime']>;
  scheduleServices?: Maybe<Array<ScheduleServices>>;
  startAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type ScheduleInput = {
  doctorId?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
};

export type SchedulePayload = {
  __typename?: 'SchedulePayload';
  response?: Maybe<ResponsePayload>;
  schedule?: Maybe<Schedule>;
};

export type ScheduleServices = {
  __typename?: 'ScheduleServices';
  createdAt: Scalars['String'];
  id: Scalars['String'];
  scheduleId?: Maybe<Scalars['String']>;
  service?: Maybe<Service>;
  serviceId?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type SchedulesPayload = {
  __typename?: 'SchedulesPayload';
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
  schedules?: Maybe<Array<Maybe<Schedule>>>;
};

export type SearchIcdCodesInput = {
  paginationOptions: PaginationInput;
  searchTerm: Scalars['String'];
};

export type SearchLoincCodesInput = {
  component?: Maybe<Scalars['String']>;
  loincNum?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
  searchTerm?: Maybe<Scalars['String']>;
};

export type SearchSnoMedCodesInput = {
  paginationOptions: PaginationInput;
  searchTerm: Scalars['String'];
};

export type SectionsInputs = {
  col: Scalars['Int'];
  fields: Array<FieldsInputs>;
  id: Scalars['String'];
  name: Scalars['String'];
};

export type SectionsTypes = {
  __typename?: 'SectionsTypes';
  col: Scalars['Int'];
  fields: Array<FieldsTypes>;
  id: Scalars['String'];
  name: Scalars['String'];
};

export type Service = {
  __typename?: 'Service';
  color?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  duration: Scalars['String'];
  facility?: Maybe<Facility>;
  facilityId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isActive?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  price: Scalars['String'];
  scheduleServices?: Maybe<Array<ScheduleServices>>;
  serviceType: ServiceType;
  updatedAt?: Maybe<Scalars['String']>;
};

/** The facility service code type assigned */
export enum ServiceCode {
  Ambulance_24 = 'AMBULANCE_24',
  Ambulance_41 = 'AMBULANCE_41',
  Ambulance_42 = 'AMBULANCE_42',
  AmbulanceLand_41 = 'AMBULANCE_LAND_41',
  AmbulatorySurgicalCenter_24 = 'AMBULATORY_SURGICAL_CENTER_24',
  AssistedLiving_13 = 'ASSISTED_LIVING_13',
  BirthingCenter_25 = 'BIRTHING_CENTER_25',
  CommunityMentalHealthCenter_53 = 'COMMUNITY_MENTAL_HEALTH_CENTER_53',
  ComprehensiveInpatientRehabilitationFacility_61 = 'COMPREHENSIVE_INPATIENT_REHABILITATION_FACILITY_61',
  ComprehensiveOutpatientRehabilitationFacility_62 = 'COMPREHENSIVE_OUTPATIENT_REHABILITATION_FACILITY_62',
  CustodialCareFacility_33 = 'CUSTODIAL_CARE_FACILITY_33',
  EmergencyRoom_23 = 'EMERGENCY_ROOM_23',
  EmergencyRoomHospital_23 = 'EMERGENCY_ROOM_HOSPITAL_23',
  EndStageRenalDiseaseTreatmentFacility_65 = 'END_STAGE_RENAL_DISEASE_TREATMENT_FACILITY_65',
  FederallyQualifiedHealthCenter_50 = 'FEDERALLY_QUALIFIED_HEALTH_CENTER_50',
  GroupHome_14 = 'GROUP_HOME_14',
  HomelessShelter_04 = 'HOMELESS_SHELTER_04',
  Home_12 = 'HOME_12',
  Hospice_34 = 'HOSPICE_34',
  IndependentClinic_49 = 'INDEPENDENT_CLINIC_49',
  IndependentLaboratory_81 = 'INDEPENDENT_LABORATORY_81',
  IndianHealthServiceFreeStandingFacility_05 = 'INDIAN_HEALTH_SERVICE_FREE_STANDING_FACILITY_05',
  IndianHealthServiceProviderBasedFacility_06 = 'INDIAN_HEALTH_SERVICE_PROVIDER_BASED_FACILITY_06',
  InpatientHospital_21 = 'INPATIENT_HOSPITAL_21',
  InpatientPsychiatricFacility_51 = 'INPATIENT_PSYCHIATRIC_FACILITY_51',
  IntermediateCareFacilityMentallyRetarded_54 = 'INTERMEDIATE_CARE_FACILITY_MENTALLY_RETARDED_54',
  MassImmunizationCenter_60 = 'MASS_IMMUNIZATION_CENTER_60',
  MilitaryTreatmentFacility_26 = 'MILITARY_TREATMENT_FACILITY_26',
  MobileUnit_15 = 'MOBILE_UNIT_15',
  NonResidentialOpioidTreatmentFacility_58 = 'NON_RESIDENTIAL_OPIOID_TREATMENT_FACILITY_58',
  NonResidentialSubstanceAbuseTreatmentFacility_57 = 'NON_RESIDENTIAL_SUBSTANCE_ABUSE_TREATMENT_FACILITY_57',
  NursingFacility_32 = 'NURSING_FACILITY_32',
  Office_11 = 'OFFICE_11',
  OffCampusOutpatientHospital_19 = 'OFF_CAMPUS_OUTPATIENT_HOSPITAL_19',
  OutpatientHospital_22 = 'OUTPATIENT_HOSPITAL_22',
  Pharmacy_01 = 'PHARMACY_01',
  PlaceOfEmployment_18 = 'PLACE_OF_EMPLOYMENT_18',
  Prison_09 = 'PRISON_09',
  Prison_10 = 'PRISON_10',
  PsychiatricFacilityPartialHospitilization_52 = 'PSYCHIATRIC_FACILITY_PARTIAL_HOSPITILIZATION_52',
  PsychiatricResidentialTreatmentCenter_56 = 'PSYCHIATRIC_RESIDENTIAL_TREATMENT_CENTER_56',
  ResidentialSubstanceAbuseTreatmenmtFacility_55 = 'RESIDENTIAL_SUBSTANCE_ABUSE_TREATMENMT_FACILITY_55',
  RuralHealthClinic_72 = 'RURAL_HEALTH_CLINIC_72',
  School_03 = 'SCHOOL_03',
  SkilledNursingFacility_31 = 'SKILLED_NURSING_FACILITY_31',
  StateOrLocalPublicHealthClinic_71 = 'STATE_OR_LOCAL_PUBLIC_HEALTH_CLINIC_71',
  Telehealth_02 = 'TELEHEALTH_02',
  Telehealth_10 = 'TELEHEALTH_10',
  TelehealthOtherThanPatientHome_02 = 'TELEHEALTH_OTHER_THAN_PATIENT_HOME_02',
  TemporaryLoOgoing_16 = 'TEMPORARY_LoOGOING_16',
  Tribal_07 = 'TRIBAL_07',
  Tribal_08 = 'TRIBAL_08',
  UrgentCare_20 = 'URGENT_CARE_20',
  WalkInRetailHealthClinic = 'WALK_IN_RETAIL_HEALTH_CLINIC'
}

/** The facility service code type assigned */
export enum ServiceCodes {
  Ambulance_24 = 'AMBULANCE_24',
  Ambulance_41 = 'AMBULANCE_41',
  Ambulance_42 = 'AMBULANCE_42',
  AssistedLiving_13 = 'ASSISTED_LIVING_13',
  BirthingCenter_25 = 'BIRTHING_CENTER_25',
  CommunityMentalHealthCenter_53 = 'COMMUNITY_MENTAL_HEALTH_CENTER_53',
  ComprehensiveInpatientRehabilitationFacility_61 = 'COMPREHENSIVE_INPATIENT_REHABILITATION_FACILITY_61',
  ComprehensiveOutpatientRehabilitationFacility_62 = 'COMPREHENSIVE_OUTPATIENT_REHABILITATION_FACILITY_62',
  CustodialCareFacility_33 = 'CUSTODIAL_CARE_FACILITY_33',
  EmergencyRoom_23 = 'EMERGENCY_ROOM_23',
  EndStageRenalDiseaseTreatmentFacility_65 = 'END_STAGE_RENAL_DISEASE_TREATMENT_FACILITY_65',
  FederallyQualifiedHealthCenter_50 = 'FEDERALLY_QUALIFIED_HEALTH_CENTER_50',
  GroupHome_14 = 'GROUP_HOME_14',
  HomelessShelter_04 = 'HOMELESS_SHELTER_04',
  Hospice_34 = 'HOSPICE_34',
  IndependentClinic_49 = 'INDEPENDENT_CLINIC_49',
  IndependentLaboratory_81 = 'INDEPENDENT_LABORATORY_81',
  IndianHealthServiceFreeStandingFacility_05 = 'INDIAN_HEALTH_SERVICE_FREE_STANDING_FACILITY_05',
  IndianHealthServiceProviderBasedFacility_06 = 'INDIAN_HEALTH_SERVICE_PROVIDER_BASED_FACILITY_06'
}

export type ServiceInput = {
  facilityId?: Maybe<Scalars['String']>;
  isActive?: Maybe<Scalars['Boolean']>;
  paginationOptions: PaginationInput;
  practiceId?: Maybe<Scalars['String']>;
  serviceName?: Maybe<Scalars['String']>;
};

export type ServicePayload = {
  __typename?: 'ServicePayload';
  response?: Maybe<ResponsePayload>;
  service?: Maybe<Service>;
};

/** The service type assigned type */
export enum ServiceType {
  External = 'EXTERNAL',
  Internal = 'INTERNAL'
}

export type ServicesPayload = {
  __typename?: 'ServicesPayload';
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
  services?: Maybe<Array<Maybe<Service>>>;
};

export type Slots = {
  __typename?: 'Slots';
  endTime?: Maybe<Scalars['String']>;
  startTime?: Maybe<Scalars['String']>;
};

export type SlotsPayload = {
  __typename?: 'SlotsPayload';
  response?: Maybe<ResponsePayload>;
  slots?: Maybe<Array<Slots>>;
};

/** The patient's smoking status type assigned */
export enum SmokingStatus {
  CurrentEverydaySmoker = 'CURRENT_EVERYDAY_SMOKER',
  CurrentSomedaySmoker = 'CURRENT_SOMEDAY_SMOKER',
  FormerSmoker = 'FORMER_SMOKER',
  NeverSmoked = 'NEVER_SMOKED',
  SmokerCurrentStatusUnknown = 'SMOKER_CURRENT_STATUS_UNKNOWN',
  UnknownIfEverSmoked = 'UNKNOWN_IF_EVER_SMOKED'
}

export type SnoMedCodes = {
  __typename?: 'SnoMedCodes';
  active?: Maybe<Scalars['String']>;
  correlationId?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  effectiveTime?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  mapAdvice?: Maybe<Scalars['String']>;
  mapCategoryId?: Maybe<Scalars['String']>;
  mapGroup?: Maybe<Scalars['String']>;
  mapPriority?: Maybe<Scalars['String']>;
  mapRule?: Maybe<Scalars['String']>;
  mapTarget?: Maybe<Scalars['String']>;
  moduleId?: Maybe<Scalars['String']>;
  patientProblem?: Maybe<Array<PatientProblems>>;
  recordId?: Maybe<Scalars['String']>;
  referencedComponentId?: Maybe<Scalars['String']>;
  refsetId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

/** The doctor's speciality */
export enum Speciality {
  AllergyOrImmunology = 'ALLERGY_OR_IMMUNOLOGY',
  Anesthesiology = 'ANESTHESIOLOGY',
  Cardiology = 'CARDIOLOGY',
  Dermatology = 'DERMATOLOGY',
  FamilyPractice = 'FAMILY_PRACTICE',
  Gastroenterology = 'GASTROENTEROLOGY',
  GeneralPractice = 'GENERAL_PRACTICE',
  GeneralSurgery = 'GENERAL_SURGERY',
  InternalMedicine = 'INTERNAL_MEDICINE',
  InterventionalPainManagement = 'INTERVENTIONAL_PAIN_MANAGEMENT',
  Neurology = 'NEUROLOGY',
  Neurosurgery = 'NEUROSURGERY',
  ObstetricsOrGynecology = 'OBSTETRICS_OR_GYNECOLOGY',
  Ophthalmology = 'OPHTHALMOLOGY',
  OralSurgery = 'ORAL_SURGERY',
  OrthopedicSurgery = 'ORTHOPEDIC_SURGERY',
  OsteopathicManipulativeTherapy = 'OSTEOPATHIC_MANIPULATIVE_THERAPY',
  Otolaryngology = 'OTOLARYNGOLOGY',
  Pathology = 'PATHOLOGY',
  PediatricDentist = 'PEDIATRIC_DENTIST',
  PediatricDermatology = 'PEDIATRIC_DERMATOLOGY',
  Periodontics = 'PERIODONTICS',
  Pharmacist = 'PHARMACIST',
  PhysicalMedicineAndRehabilitation = 'PHYSICAL_MEDICINE_AND_REHABILITATION',
  PhysicianAssistant = 'PHYSICIAN_ASSISTANT',
  PlasticAndReconstructiveSurgery = 'PLASTIC_AND_RECONSTRUCTIVE_SURGERY',
  Psychiatry = 'PSYCHIATRY'
}

export type SpecimenTypes = {
  __typename?: 'SpecimenTypes';
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  testSpecimens?: Maybe<Array<TestSpecimens>>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type Staff = {
  __typename?: 'Staff';
  attachments?: Maybe<Array<Attachment>>;
  createdAt: Scalars['String'];
  dob?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  facility?: Maybe<Facility>;
  facilityId?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  gender: Gender;
  id: Scalars['String'];
  lastName: Scalars['String'];
  mobile?: Maybe<Scalars['String']>;
  patientAllergies?: Maybe<Array<PatientAllergies>>;
  patientProblem?: Maybe<Array<PatientProblems>>;
  patientVitals?: Maybe<PatientVitals>;
  phone?: Maybe<Scalars['String']>;
  practiceId?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
  username?: Maybe<Scalars['String']>;
};

export type StaffInput = {
  facilityId?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
  practiceId?: Maybe<Scalars['String']>;
  searchString?: Maybe<Scalars['String']>;
};

export type StaffPayload = {
  __typename?: 'StaffPayload';
  response?: Maybe<ResponsePayload>;
  staff?: Maybe<Staff>;
};

/** The transaction payment status type assigned */
export enum Transactionstatus {
  Due = 'DUE',
  Paid = 'PAID',
  Refund = 'REFUND'
}

/** The patient's temperature unit type assigned */
export enum TempUnitType {
  DegC = 'DEG_C',
  DegF = 'DEG_F'
}

export type TestSpecimenTypeInput = {
  paginationOptions: PaginationInput;
  specimenTypeName?: Maybe<Scalars['String']>;
};

export type TestSpecimenTypesPayload = {
  __typename?: 'TestSpecimenTypesPayload';
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
  specimenTypes?: Maybe<Array<SpecimenTypes>>;
};

export type TestSpecimens = {
  __typename?: 'TestSpecimens';
  collectionDate?: Maybe<Scalars['String']>;
  collectionTime?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  labTest?: Maybe<LabTests>;
  labTestId?: Maybe<Scalars['String']>;
  specimenNotes?: Maybe<Scalars['String']>;
  specimenTypes?: Maybe<SpecimenTypes>;
  specimenTypesId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type TransactionPayload = {
  __typename?: 'TransactionPayload';
  response?: Maybe<ResponsePayload>;
  transaction: Transactions;
};

export type Transactions = {
  __typename?: 'Transactions';
  appointment?: Maybe<Appointment>;
  appointmentId?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  doctor?: Maybe<Doctor>;
  doctorId?: Maybe<Scalars['String']>;
  facility?: Maybe<Facility>;
  facilityId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  invoice?: Maybe<Array<Invoice>>;
  patient?: Maybe<Patient>;
  patientId?: Maybe<Scalars['String']>;
  status: Transactionstatus;
  transactionId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type TransactionsPayload = {
  __typename?: 'TransactionsPayload';
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
  transactions?: Maybe<Array<Maybe<Transactions>>>;
};

export type TwoFactorInput = {
  isTwoFactorEnabled: Scalars['Boolean'];
  password?: Maybe<Scalars['String']>;
  userId: Scalars['String'];
};

/** The patient's vital unit type assigned */
export enum UnitType {
  Centimeter = 'CENTIMETER',
  Inch = 'INCH'
}

export type UpComingAppointmentsInput = {
  facilityId?: Maybe<Scalars['String']>;
  patientId?: Maybe<Scalars['String']>;
  practiceId?: Maybe<Scalars['String']>;
  providerId?: Maybe<Scalars['String']>;
};

export type UpdateAgreementInput = {
  body?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  signatureRequired?: Maybe<Scalars['Boolean']>;
  title?: Maybe<Scalars['String']>;
  viewAgreementBeforeAgreeing?: Maybe<Scalars['Boolean']>;
};

export type UpdateAllergyInput = {
  allergyId?: Maybe<Scalars['String']>;
  appointmentId?: Maybe<Scalars['String']>;
  patientId?: Maybe<Scalars['String']>;
  providerId?: Maybe<Scalars['String']>;
  reactionsIds: Array<Scalars['String']>;
  staffId?: Maybe<Scalars['String']>;
  updatePatientAllergyInput: UpdatePatientAllergyInput;
};

export type UpdateAppointmentBillingStatusInput = {
  billingStatus: Scalars['String'];
  id: Scalars['String'];
};

export type UpdateAppointmentInput = {
  appointmentCreateType?: Maybe<AppointmentCreateType>;
  appointmentTypeId?: Maybe<Scalars['String']>;
  autoAccident?: Maybe<Scalars['Boolean']>;
  billingStatus?: Maybe<BillingStatus>;
  checkInActiveStep?: Maybe<Scalars['String']>;
  checkedInAt?: Maybe<Scalars['String']>;
  checkedOutAt?: Maybe<Scalars['String']>;
  contractNumber?: Maybe<Scalars['String']>;
  employment?: Maybe<Scalars['Boolean']>;
  facilityId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  insuranceCompany?: Maybe<Scalars['String']>;
  isExternal?: Maybe<Scalars['Boolean']>;
  membershipID?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  organizationName?: Maybe<Scalars['String']>;
  otherAccident?: Maybe<Scalars['Boolean']>;
  otherPartyResponsible?: Maybe<Scalars['Boolean']>;
  patientId?: Maybe<Scalars['String']>;
  paymentStatus?: Maybe<Scalars['String']>;
  paymentType?: Maybe<PaymentType>;
  practiceId?: Maybe<Scalars['String']>;
  primaryInsurance?: Maybe<Scalars['String']>;
  providerId?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
  scheduleEndDateTime?: Maybe<Scalars['String']>;
  scheduleStartDateTime?: Maybe<Scalars['String']>;
  secondaryInsurance?: Maybe<Scalars['String']>;
  selfCheckIn?: Maybe<Scalars['Boolean']>;
  status?: Maybe<AppointmentStatus>;
};

export type UpdateAppointmentStatusInput = {
  id: Scalars['String'];
  status: AppointmentStatus;
};

export type UpdateAttachmentInput = {
  agreementId?: Maybe<Scalars['String']>;
  attachmentName?: Maybe<Scalars['String']>;
  comments?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  documentDate?: Maybe<Scalars['String']>;
  documentTypeId?: Maybe<Scalars['String']>;
  documentTypeName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  labOrderNum?: Maybe<Scalars['String']>;
  policyId?: Maybe<Scalars['String']>;
  practiceId?: Maybe<Scalars['String']>;
  signedAt?: Maybe<Scalars['String']>;
  signedBy?: Maybe<Scalars['String']>;
  signedByProvider?: Maybe<Scalars['Boolean']>;
  subTitle?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  /** enum type for module type - Upload Media */
  type?: Maybe<AttachmentType>;
  typeId?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type UpdateBillingAddressInput = {
  address?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  bankAccount?: Maybe<Scalars['String']>;
  checkPayableTo?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  doctorId?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  pager?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
};

export type UpdateContactInput = {
  address?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  contactType?: Maybe<ContactType>;
  country?: Maybe<Scalars['String']>;
  doctorId?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  employerName?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  insuranceId?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  locationLink?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  pager?: Maybe<Scalars['String']>;
  patientId?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  primaryContact?: Maybe<Scalars['Boolean']>;
  relationship?: Maybe<RelationshipType>;
  serviceCode?: Maybe<ServiceCodes>;
  ssn?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
};

export type UpdateCopayInput = {
  amount?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  policy?: Maybe<CreatePolicyInput>;
  policyId?: Maybe<Scalars['String']>;
  type?: Maybe<CopayType>;
};

export type UpdateDoctorInput = {
  updateBillingAddressInput: UpdateBillingAddressInput;
  updateContactInput: UpdateContactInput;
  updateDoctorItemInput: UpdateDoctorItemInput;
};

export type UpdateDoctorItemInput = {
  adminId?: Maybe<Scalars['String']>;
  anesthesiaLicense?: Maybe<Scalars['String']>;
  billingFacility?: Maybe<Scalars['String']>;
  blueShildNumber?: Maybe<Scalars['String']>;
  campusGrpNumber?: Maybe<Scalars['String']>;
  deaActiveDate?: Maybe<Scalars['String']>;
  deaNumber?: Maybe<Scalars['String']>;
  deaTermDate?: Maybe<Scalars['String']>;
  degreeCredentials?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['String']>;
  dpsCtpNumber?: Maybe<Scalars['String']>;
  emcProviderId?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  languagesSpoken?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  licenseActiveDate?: Maybe<Scalars['String']>;
  licenseTermDate?: Maybe<Scalars['String']>;
  meammographyCertNumber?: Maybe<Scalars['String']>;
  medicaidGrpNumber?: Maybe<Scalars['String']>;
  medicareGrpNumber?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
  npi?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  practiceId?: Maybe<Scalars['String']>;
  prefix?: Maybe<Scalars['String']>;
  prescriptiveAuthNumber?: Maybe<Scalars['String']>;
  providerIntials?: Maybe<Scalars['String']>;
  /** Send doctor Type from the string - Sign-up */
  roleType?: Maybe<Scalars['String']>;
  /** Doctor speciality */
  speciality?: Maybe<Speciality>;
  specialityLicense?: Maybe<Scalars['String']>;
  ssn?: Maybe<Scalars['String']>;
  stateLicense?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  taxId?: Maybe<Scalars['String']>;
  taxIdStuff?: Maybe<Scalars['String']>;
  taxonomyCode?: Maybe<Scalars['String']>;
  timeZone?: Maybe<Scalars['String']>;
  upin?: Maybe<Scalars['String']>;
};

export type UpdateEmployerItemInput = {
  address?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  industry?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  patientId?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  usualOccupation?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
};

export type UpdateFacilityInput = {
  updateBillingAddressInput: UpdateBillingAddressInput;
  updateContactInput: UpdateContactInput;
  updateFacilityItemInput: UpdateFacilityItemInput;
};

export type UpdateFacilityItemInput = {
  cliaIdNumber?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  endTime?: Maybe<Scalars['String']>;
  federalTaxId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  mammographyCertificationNumber?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  npi?: Maybe<Scalars['String']>;
  practiceId?: Maybe<Scalars['String']>;
  /** Facility type */
  practiceType?: Maybe<PracticeType>;
  /** Service Code type */
  serviceCode?: Maybe<ServiceCode>;
  startTime?: Maybe<Scalars['String']>;
  stateImmunizationId?: Maybe<Scalars['String']>;
  tamxonomyCode?: Maybe<Scalars['String']>;
  timeZone?: Maybe<Scalars['String']>;
};

export type UpdateFacilityTimeZoneInput = {
  id: Scalars['String'];
  timeZone?: Maybe<Scalars['String']>;
};

export type UpdateFormInput = {
  facilityId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isActive?: Maybe<Scalars['Boolean']>;
  isSystemForm?: Maybe<Scalars['Boolean']>;
  layout?: Maybe<LayoutJsonInputType>;
  name?: Maybe<Scalars['String']>;
  practiceId?: Maybe<Scalars['String']>;
  type?: Maybe<FormType>;
};

export type UpdateLabTestInput = {
  diagnoses?: Maybe<Array<Scalars['String']>>;
  test?: Maybe<Scalars['String']>;
  updateLabTestItemInput?: Maybe<UpdateLabTestItemInput>;
  updateSpecimenItemInput?: Maybe<Array<UpdateSpecimenItemInput>>;
};

export type UpdateLabTestItemInput = {
  accessionNumber?: Maybe<Scalars['String']>;
  appointmentId?: Maybe<Scalars['String']>;
  collectedDate?: Maybe<Scalars['String']>;
  doctorId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  labName?: Maybe<Scalars['String']>;
  orderNumber?: Maybe<Scalars['String']>;
  patientId?: Maybe<Scalars['String']>;
  primaryProviderId?: Maybe<Scalars['String']>;
  providerNotes?: Maybe<Scalars['String']>;
  receivedDate?: Maybe<Scalars['String']>;
  referringProviderId?: Maybe<Scalars['String']>;
  status?: Maybe<LabTestStatus>;
  testDate?: Maybe<Scalars['String']>;
  testNotes?: Maybe<Scalars['String']>;
  testTime?: Maybe<Scalars['String']>;
  vendorName?: Maybe<Scalars['String']>;
};

export type UpdateLabTestObservationInput = {
  labTestId: Scalars['String'];
  updateLabTestObservationItemInput?: Maybe<Array<UpdateLabTestObservationItemInput>>;
};

export type UpdateLabTestObservationItemInput = {
  abnormalFlag?: Maybe<AbnormalFlag>;
  description?: Maybe<Scalars['String']>;
  doctorsSignOff?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  normalRange?: Maybe<Scalars['String']>;
  normalRangeUnit?: Maybe<Scalars['String']>;
  resultUnit?: Maybe<Scalars['String']>;
  resultValue?: Maybe<Scalars['String']>;
};

export type UpdateLoincCodeInput = {
  component?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  loincNum?: Maybe<Scalars['String']>;
};

export type UpdatePasswordInput = {
  id: Scalars['String'];
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};

export type UpdatePatientAllergyInput = {
  allergyOnset?: Maybe<AllergyOnset>;
  allergySeverity?: Maybe<AllergySeverity>;
  allergyStartDate?: Maybe<Scalars['String']>;
  comments?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isActive?: Maybe<Scalars['Boolean']>;
};

export type UpdatePatientInput = {
  updateContactInput: UpdateContactInput;
  updateEmergencyContactInput: UpdateContactInput;
  updateEmployerInput: UpdateEmployerItemInput;
  updateGuarantorContactInput: UpdateContactInput;
  updateGuardianContactInput: UpdateContactInput;
  updateNextOfKinContactInput: UpdateContactInput;
  updatePatientItemInput: UpdatePatientItemInput;
};

export type UpdatePatientItemInput = {
  adminId?: Maybe<Scalars['String']>;
  callToConsent?: Maybe<Scalars['Boolean']>;
  deceasedDate?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  ethnicity?: Maybe<Ethnicity>;
  facilityId?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  firstNameUsed?: Maybe<Scalars['String']>;
  gender?: Maybe<Genderidentity>;
  genderIdentity?: Maybe<Genderidentity>;
  holdStatement?: Maybe<Holdstatement>;
  homeBound?: Maybe<Homebound>;
  id: Scalars['String'];
  inviteAccepted?: Maybe<Scalars['Boolean']>;
  language?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  maritialStatus?: Maybe<Maritialstatus>;
  medicationHistoryAuthority?: Maybe<Scalars['Boolean']>;
  middleName?: Maybe<Scalars['String']>;
  motherMaidenName?: Maybe<Scalars['String']>;
  patientNote?: Maybe<Scalars['String']>;
  patientRecord?: Maybe<Scalars['String']>;
  pharmacy?: Maybe<Scalars['String']>;
  phonePermission?: Maybe<Scalars['Boolean']>;
  practiceId?: Maybe<Scalars['String']>;
  preferredCommunicationMethod?: Maybe<Communicationtype>;
  prefferedName?: Maybe<Scalars['String']>;
  previousFirstName?: Maybe<Scalars['String']>;
  previouslastName?: Maybe<Scalars['String']>;
  primaryDepartment?: Maybe<Scalars['String']>;
  privacyNotice?: Maybe<Scalars['Boolean']>;
  pronouns?: Maybe<Pronouns>;
  race?: Maybe<Race>;
  registrationDate?: Maybe<Scalars['String']>;
  registrationDepartment?: Maybe<Scalars['String']>;
  releaseOfInfoBill?: Maybe<Scalars['Boolean']>;
  sexAtBirth?: Maybe<Genderidentity>;
  sexualOrientation?: Maybe<Sexualorientation>;
  smsPermission?: Maybe<Scalars['Boolean']>;
  ssn?: Maybe<Scalars['String']>;
  statementDelivereOnline?: Maybe<Scalars['Boolean']>;
  statementNote?: Maybe<Scalars['String']>;
  statementNoteDateFrom?: Maybe<Scalars['String']>;
  statementNoteDateTo?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  usualProviderId?: Maybe<Scalars['String']>;
};

export type UpdatePatientNoteInfoInputs = {
  id: Scalars['String'];
  patientNote?: Maybe<Scalars['String']>;
  patientNoteOpen?: Maybe<Scalars['Boolean']>;
};

export type UpdatePatientProfileInput = {
  updateContactInput: UpdateContactInput;
  updatePatientProfileItemInput: UpdatePatientProfileItemInput;
};

export type UpdatePatientProfileItemInput = {
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
};

export type UpdatePatientProvider = {
  otherRelation?: Maybe<Scalars['String']>;
  patientId: Scalars['String'];
  providerId: Scalars['String'];
  relation?: Maybe<DoctorPatientRelationType>;
};

export type UpdatePatientProviderRelationInputs = {
  id: Scalars['String'];
  otherRelation?: Maybe<Scalars['String']>;
  relation?: Maybe<DoctorPatientRelationType>;
};

export type UpdatePermissionItemInput = {
  id?: Maybe<Scalars['String']>;
  moduleType?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  roleId?: Maybe<Scalars['String']>;
};

export type UpdatePolicyHolderInput = {
  address?: Maybe<Scalars['String']>;
  addressCTD?: Maybe<Scalars['String']>;
  certificationNumber?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['String']>;
  employer?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
  sex?: Maybe<Policy_Holder_Gender_Identity>;
  ssn?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
};

export type UpdatePolicyInput = {
  coinsurancePercentage?: Maybe<Scalars['String']>;
  copays?: Maybe<Array<UpdateCopayInput>>;
  expirationDate?: Maybe<Scalars['String']>;
  groupNumber?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  insuranceId?: Maybe<Scalars['String']>;
  issueDate?: Maybe<Scalars['String']>;
  memberId?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  orderOfBenefit?: Maybe<OrderOfBenefitType>;
  patientId?: Maybe<Scalars['String']>;
  policyHolderInfo?: Maybe<UpdatePolicyHolderInput>;
  policyHolderRelationship?: Maybe<PolicyHolderRelationshipType>;
  pricingProductType?: Maybe<PricingProductType>;
  primaryCareProviderId?: Maybe<Scalars['String']>;
  referringProviderId?: Maybe<Scalars['String']>;
};

export type UpdatePracticeInput = {
  champus?: Maybe<Scalars['String']>;
  ein?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  medicaid?: Maybe<Scalars['String']>;
  medicare?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  upin?: Maybe<Scalars['String']>;
};

export type UpdateProblemInput = {
  appointmentId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  note?: Maybe<Scalars['String']>;
  problemSeverity?: Maybe<ProblemSeverity>;
  problemStartDate?: Maybe<Scalars['String']>;
  problemType?: Maybe<ProblemType>;
};

export type UpdateRoleInput = {
  id: Scalars['String'];
  roles: Array<Scalars['String']>;
};

export type UpdateRoleItemInput = {
  customRole?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
};

export type UpdateScheduleInput = {
  day?: Maybe<Scalars['String']>;
  doctorId?: Maybe<Scalars['String']>;
  endAt?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  recurringEndDate?: Maybe<Scalars['DateTime']>;
  servicesIds?: Maybe<Array<Scalars['String']>>;
  startAt?: Maybe<Scalars['String']>;
};

export type UpdateServiceInput = {
  color?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isActive?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
  /** Service type */
  serviceType?: Maybe<ServiceType>;
};

export type UpdateSpecimenItemInput = {
  collectionDate?: Maybe<Scalars['String']>;
  collectionTime?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  specimenNotes?: Maybe<Scalars['String']>;
  testSpecimen?: Maybe<Scalars['String']>;
};

export type UpdateStaffInput = {
  providers?: Maybe<Array<Scalars['String']>>;
  updateStaffItemInput: UpdateStaffItemInput;
};

export type UpdateStaffItemInput = {
  adminId?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  /** Staff gender */
  gender?: Maybe<Gender>;
  id: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  practiceId?: Maybe<Scalars['String']>;
  /** Send Investor Type from the ENUM - Sign-up */
  roleType?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type UpdateUserInput = {
  adminId?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  emailVerified?: Maybe<Scalars['Boolean']>;
  facilityId?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isAdmin?: Maybe<Scalars['Boolean']>;
  lastName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
};

export type UpdateVitalInput = {
  PainRange?: Maybe<Scalars['String']>;
  PatientBMI?: Maybe<Scalars['String']>;
  PatientHeight?: Maybe<Scalars['String']>;
  PatientWeight?: Maybe<Scalars['String']>;
  diastolicBloodPressure?: Maybe<Scalars['String']>;
  headCircumference?: Maybe<HeadCircumferenceType>;
  id: Scalars['String'];
  oxygenSaturation?: Maybe<Scalars['String']>;
  patientHeadCircumference?: Maybe<Scalars['String']>;
  patientTemperature?: Maybe<Scalars['String']>;
  pulseRate?: Maybe<Scalars['String']>;
  respiratoryRate?: Maybe<Scalars['String']>;
  smokingStatus?: Maybe<SmokingStatus>;
  systolicBloodPressure?: Maybe<Scalars['String']>;
  temperatureUnitType?: Maybe<TempUnitType>;
  unitType?: Maybe<UnitType>;
  vitalCreationDate?: Maybe<Scalars['String']>;
  weightUnit?: Maybe<WeightType>;
};

export type User = {
  __typename?: 'User';
  attachments?: Maybe<Array<Attachment>>;
  autoLogoutTime?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  email: Scalars['String'];
  emailVerified: Scalars['Boolean'];
  facility?: Maybe<Facility>;
  facilityId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  inviteAcceptedAt: Scalars['String'];
  inviteSentAt: Scalars['String'];
  isTwoFactorEnabled: Scalars['Boolean'];
  phone?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<Maybe<Role>>>;
  status: UserStatus;
  token?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  userId: Scalars['String'];
  userType: Scalars['String'];
};

export type UserFormElementInputs = {
  FormsElementsId: Scalars['String'];
  arrayOfObjects: Array<ArrayOfStringsTypeInput>;
  arrayOfStrings: Array<Scalars['String']>;
  value: Scalars['String'];
};

export type UserFormInput = {
  FormId: Scalars['String'];
  paginationOptions: PaginationInput;
};

export type UserFormPayload = {
  __typename?: 'UserFormPayload';
  appointment?: Maybe<Appointment>;
  response?: Maybe<ResponsePayloadResponse>;
  userForm?: Maybe<UserForms>;
};

export type UserForms = {
  __typename?: 'UserForms';
  DoctorId?: Maybe<Scalars['String']>;
  FormId: Scalars['String'];
  PatientId?: Maybe<Scalars['String']>;
  StaffId?: Maybe<Scalars['String']>;
  SubmitterId?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  form?: Maybe<Form>;
  id: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  userFormElements?: Maybe<Array<UsersFormsElements>>;
};

export type UserFormsPayload = {
  __typename?: 'UserFormsPayload';
  form?: Maybe<Form>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayloadResponse>;
};

export type UserIdInput = {
  adminId?: Maybe<Scalars['String']>;
  isEnabled?: Maybe<Scalars['Boolean']>;
  userId: Scalars['String'];
};

export type UserInfoInput = {
  autoLogoutTime?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
};

export type UserPayload = {
  __typename?: 'UserPayload';
  access_token?: Maybe<Scalars['String']>;
  response?: Maybe<ResponsePayload>;
  user?: Maybe<User>;
};

/** The user status */
export enum UserStatus {
  Active = 'ACTIVE',
  Deactivated = 'DEACTIVATED'
}

export type UserWithRoles = {
  __typename?: 'UserWithRoles';
  count?: Maybe<Scalars['Float']>;
  role?: Maybe<Scalars['String']>;
};

export type UsersFormsElements = {
  __typename?: 'UsersFormsElements';
  FormsElementsId: Scalars['String'];
  UsersFormsId: Scalars['String'];
  arrayOfObjects: Array<ArrayOfStringsType>;
  arrayOfStrings: Array<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  userForm?: Maybe<UserForms>;
  value?: Maybe<Scalars['String']>;
};

export type UsersInput = {
  paginationOptions: PaginationInput;
  role?: Maybe<Scalars['String']>;
  status?: Maybe<UserStatus>;
};

export type UsersPayload = {
  __typename?: 'UsersPayload';
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type UsersWithRolesInputs = {
  practiceId?: Maybe<Scalars['String']>;
};

export type VerifyCodeInput = {
  id?: Maybe<Scalars['String']>;
  otpCode: Scalars['String'];
};

export type VerifyEmailInput = {
  token: Scalars['String'];
};

/** The patient's weight unit type assigned */
export enum WeightType {
  Kg = 'KG',
  Pound = 'POUND',
  PoundOunce = 'POUND_OUNCE'
}

export type SnoMedCodesPayload = {
  __typename?: 'snoMedCodesPayload';
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
  snoMedCodes?: Maybe<Array<Maybe<SnoMedCodes>>>;
};

export type FetchAllAgreementsQueryVariables = Exact<{
  agreementPaginationInput: AgreementPaginationInput;
}>;


export type FetchAllAgreementsQuery = { __typename?: 'Query', fetchAllAgreements: { __typename?: 'AgreementsPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null, agreements: Array<{ __typename?: 'Agreement', id: string, title?: string | null, body?: string | null, createdAt?: string | null }> } };

export type FetchAgreementQueryVariables = Exact<{
  agreementId: Scalars['String'];
}>;


export type FetchAgreementQuery = { __typename?: 'Query', fetchAgreement: { __typename?: 'AgreementPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, agreement: { __typename?: 'Agreement', id: string, title?: string | null, body?: string | null, viewAgreementBeforeAgreeing?: boolean | null, signatureRequired?: boolean | null, createdAt?: string | null } } };

export type CreateAgreementMutationVariables = Exact<{
  createAgreementInput: AgreementInput;
}>;


export type CreateAgreementMutation = { __typename?: 'Mutation', createAgreement: { __typename?: 'AgreementPayload', agreement: { __typename?: 'Agreement', id: string }, response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type UpdateAgreementMutationVariables = Exact<{
  updateAgreementInput: UpdateAgreementInput;
}>;


export type UpdateAgreementMutation = { __typename?: 'Mutation', updateAgreement: { __typename?: 'AgreementPayload', agreement: { __typename?: 'Agreement', id: string }, response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type RemoveAgreementMutationVariables = Exact<{
  agreementId: Scalars['String'];
}>;


export type RemoveAgreementMutation = { __typename?: 'Mutation', removeAgreement: { __typename?: 'AgreementPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type FindAllAppointmentsQueryVariables = Exact<{
  appointmentInput: AppointmentInput;
}>;


export type FindAllAppointmentsQuery = { __typename?: 'Query', findAllAppointments: { __typename?: 'AppointmentsPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null, appointments?: Array<{ __typename?: 'Appointment', id: string, status: AppointmentStatus, scheduleEndDateTime?: string | null, scheduleStartDateTime?: string | null, token?: string | null, reason?: string | null, primaryInsurance?: string | null, billingStatus: BillingStatus, checkInActiveStep?: string | null, appointmentCreateType?: AppointmentCreateType | null, provider?: { __typename?: 'Doctor', id: string, firstName?: string | null, lastName?: string | null } | null, patient?: { __typename?: 'Patient', id: string, firstName?: string | null, lastName?: string | null } | null, facility?: { __typename?: 'Facility', id: string, name: string } | null, appointmentType?: { __typename?: 'Service', id: string, name: string, price: string, color?: string | null } | null } | null> | null } };

export type GetAppointmentQueryVariables = Exact<{
  getAppointment: GetAppointment;
}>;


export type GetAppointmentQuery = { __typename?: 'Query', getAppointment: { __typename?: 'AppointmentPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, appointment?: { __typename?: 'Appointment', id: string, notes?: string | null, reason?: string | null, token?: string | null, status: AppointmentStatus, patientId?: string | null, employment?: boolean | null, paymentType: PaymentType, autoAccident?: boolean | null, otherAccident?: boolean | null, primaryInsurance?: string | null, secondaryInsurance?: string | null, scheduleEndDateTime?: string | null, scheduleStartDateTime?: string | null, createdAt?: string | null, updatedAt?: string | null, billingStatus: BillingStatus, checkedInAt?: string | null, selfCheckIn?: boolean | null, checkInActiveStep?: string | null, appointmentCreateType?: AppointmentCreateType | null, appointmentType?: { __typename?: 'Service', id: string, name: string, price: string, duration: string, serviceType: ServiceType } | null, provider?: { __typename?: 'Doctor', id: string, lastName?: string | null, firstName?: string | null } | null, patient?: { __typename?: 'Patient', id: string, firstName?: string | null, lastName?: string | null } | null, facility?: { __typename?: 'Facility', id: string, name: string, practiceType?: PracticeType | null, serviceCode: ServiceCode } | null, invoice?: { __typename?: 'Invoice', invoiceNo: string } | null } | null } };

export type RemoveAppointmentMutationVariables = Exact<{
  removeAppointment: RemoveAppointment;
}>;


export type RemoveAppointmentMutation = { __typename?: 'Mutation', removeAppointment: { __typename?: 'AppointmentPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type CreateAppointmentMutationVariables = Exact<{
  createAppointmentInput: CreateAppointmentInput;
}>;


export type CreateAppointmentMutation = { __typename?: 'Mutation', createAppointment: { __typename?: 'AppointmentPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type UpdateAppointmentMutationVariables = Exact<{
  updateAppointmentInput: UpdateAppointmentInput;
}>;


export type UpdateAppointmentMutation = { __typename?: 'Mutation', updateAppointment: { __typename?: 'AppointmentPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, appointment?: { __typename?: 'Appointment', id: string, status: AppointmentStatus } | null } };

export type CreateExternalAppointmentMutationVariables = Exact<{
  createExternalAppointmentInput: CreateExternalAppointmentInput;
}>;


export type CreateExternalAppointmentMutation = { __typename?: 'Mutation', createExternalAppointment: { __typename?: 'AppointmentPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, appointment?: { __typename?: 'Appointment', id: string, token?: string | null, providerId?: string | null, patientId?: string | null, facilityId?: string | null, appointmentType?: { __typename?: 'Service', id: string, name: string, price: string, duration: string } | null } | null } };

export type CancelAppointmentMutationVariables = Exact<{
  cancelAppointment: CancelAppointment;
}>;


export type CancelAppointmentMutation = { __typename?: 'Mutation', cancelAppointment: { __typename?: 'AppointmentPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null, error?: string | null } | null } };

export type GetAppointmentsQueryVariables = Exact<{
  getAppointments: GetAppointments;
}>;


export type GetAppointmentsQuery = { __typename?: 'Query', getAppointments: { __typename?: 'AppointmentsPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null, totalCount?: number | null } | null, appointments?: Array<{ __typename?: 'Appointment', id: string, status: AppointmentStatus, scheduleStartDateTime?: string | null, scheduleEndDateTime?: string | null, createdAt?: string | null, updatedAt?: string | null, appointmentType?: { __typename?: 'Service', id: string, name: string, duration: string } | null, provider?: { __typename?: 'Doctor', id: string, firstName?: string | null, lastName?: string | null } | null, patient?: { __typename?: 'Patient', id: string, firstName?: string | null, lastName?: string | null } | null, facility?: { __typename?: 'Facility', id: string, name: string } | null } | null> | null } };

export type UpdateAppointmentStatusMutationVariables = Exact<{
  appointmentStatusInput: UpdateAppointmentStatusInput;
}>;


export type UpdateAppointmentStatusMutation = { __typename?: 'Mutation', updateAppointmentStatus: { __typename?: 'AppointmentPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, appointment?: { __typename?: 'Appointment', id: string, status: AppointmentStatus } | null } };

export type GetPatientNearestAppointmentsQueryVariables = Exact<{
  getPatientAppointmentInput: GetPatientAppointmentInput;
}>;


export type GetPatientNearestAppointmentsQuery = { __typename?: 'Query', getPatientPastUpcomingAppointment: { __typename?: 'PatientPastUpcomingAppointmentPayload', response?: { __typename?: 'ResponsePayload', status?: number | null } | null, appointments?: { __typename?: 'PatientPastUpcomingAppointment', pastAppointment?: { __typename?: 'Appointment', id: string, scheduleStartDateTime?: string | null } | null, upcomingAppointment?: { __typename?: 'Appointment', id: string, scheduleStartDateTime?: string | null } | null } | null } };

export type FindAllUpcomingAppointmentsQueryVariables = Exact<{
  upComingAppointmentsInput: UpComingAppointmentsInput;
}>;


export type FindAllUpcomingAppointmentsQuery = { __typename?: 'Query', findAllUpcomingAppointments: { __typename?: 'AppointmentsPayload', response?: { __typename?: 'ResponsePayload', status?: number | null } | null, appointments?: Array<{ __typename?: 'Appointment', id: string, status: AppointmentStatus, scheduleStartDateTime?: string | null, scheduleEndDateTime?: string | null, appointmentType?: { __typename?: 'Service', id: string, name: string, duration: string } | null, provider?: { __typename?: 'Doctor', id: string, firstName?: string | null, lastName?: string | null } | null, patient?: { __typename?: 'Patient', id: string, firstName?: string | null, lastName?: string | null } | null } | null> | null } };

export type GetAttachmentsQueryVariables = Exact<{
  getAttachment: GetAttachment;
}>;


export type GetAttachmentsQuery = { __typename?: 'Query', getAttachments: { __typename?: 'AttachmentsPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, attachments?: Array<{ __typename?: 'Attachment', id: string, key?: string | null, url?: string | null, type: AttachmentType, title?: string | null, typeId: string, attachmentName?: string | null, createdAt: string, updatedAt: string, attachmentMetadata?: { __typename?: 'AttachmentMetadata', signedAt?: string | null, signedBy?: string | null, providerName?: string | null, comments?: string | null, documentDate?: string | null, documentType?: { __typename?: 'DocumentType', id: string, type?: string | null } | null } | null } | null> | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null } };

export type UpdateAttachmentDataMutationVariables = Exact<{
  updateAttachmentInput: UpdateAttachmentInput;
}>;


export type UpdateAttachmentDataMutation = { __typename?: 'Mutation', updateAttachmentData: { __typename?: 'AttachmentPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null, attachment?: { __typename?: 'Attachment', id: string, key?: string | null, url?: string | null, type: AttachmentType, title?: string | null, typeId: string, attachmentName?: string | null, createdAt: string, updatedAt: string } | null } };

export type CreateAttachmentDataMutationVariables = Exact<{
  createAttachmentInput: CreateAttachmentInput;
}>;


export type CreateAttachmentDataMutation = { __typename?: 'Mutation', createAttachmentData: { __typename?: 'AttachmentPayload', response?: { __typename?: 'ResponsePayload', name?: string | null, status?: number | null, message?: string | null, error?: string | null } | null, attachment?: { __typename?: 'Attachment', id: string, url?: string | null, key?: string | null, type: AttachmentType, typeId: string, createdAt: string, updatedAt: string } | null } };

export type RemoveAttachmentDataMutationVariables = Exact<{
  removeAttachment: RemoveAttachment;
}>;


export type RemoveAttachmentDataMutation = { __typename?: 'Mutation', removeAttachmentData: { __typename?: 'AttachmentPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null } };

export type RemoveAttachmentMediaMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type RemoveAttachmentMediaMutation = { __typename?: 'Mutation', removeAttachmentMedia: { __typename?: 'AttachmentPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null } };

export type GetAttachmentQueryVariables = Exact<{
  getMedia: GetMedia;
}>;


export type GetAttachmentQuery = { __typename?: 'Query', getAttachment: { __typename?: 'AttachmentMediaPayload', preSignedUrl?: string | null, response?: { __typename?: 'ResponsePayload', message?: string | null } | null } };

export type GetAttachmentsByLabOrderQueryVariables = Exact<{
  getAttachmentsByLabOrder: GetAttachmentsByLabOrder;
}>;


export type GetAttachmentsByLabOrderQuery = { __typename?: 'Query', getAttachmentsByLabOrder: { __typename?: 'AttachmentsPayload', attachments?: Array<{ __typename?: 'Attachment', id: string, title?: string | null, attachmentName?: string | null, url?: string | null, type: AttachmentType, attachmentMetadataId?: string | null, attachmentMetadata?: { __typename?: 'AttachmentMetadata', comments?: string | null, labOrderNum?: string | null } | null } | null> | null } };

export type GetAttachmentsByPolicyIdQueryVariables = Exact<{
  getAttachmentsByPolicyId: GetAttachmentsByPolicyId;
}>;


export type GetAttachmentsByPolicyIdQuery = { __typename?: 'Query', getAttachmentsByPolicyId: { __typename?: 'AttachmentsPayload', attachments?: Array<{ __typename?: 'Attachment', id: string, title?: string | null, attachmentName?: string | null, url?: string | null, type: AttachmentType, attachmentMetadataId?: string | null, attachmentMetadata?: { __typename?: 'AttachmentMetadata', comments?: string | null, policyId?: string | null } | null } | null> | null } };

export type GetAttachmentsByAgreementIdQueryVariables = Exact<{
  getAttachmentsByAgreementId: GetAttachmentsByAgreementId;
}>;


export type GetAttachmentsByAgreementIdQuery = { __typename?: 'Query', getAttachmentsByAgreementId: { __typename?: 'AttachmentWithPreSignedUrlPayload', attachmentsWithPreSignedUrl?: Array<{ __typename?: 'AttachmentWithPreSignedUrl', id: string, title?: string | null, attachmentName?: string | null, url?: string | null, preSignedUrl?: string | null, type: AttachmentType, attachmentMetadata?: { __typename?: 'AttachmentMetadata', comments?: string | null, agreementId?: string | null } | null }> | null } };

export type FetchDocumentTypeByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type FetchDocumentTypeByNameQuery = { __typename?: 'Query', fetchDocumentTypeByName: { __typename?: 'DocumentTypePayload', documentType?: { __typename?: 'DocumentType', type?: string | null, id: string } | null } };

export type FetchDocumentTypesQueryVariables = Exact<{
  documentTypeInput: DocumentTypeInput;
}>;


export type FetchDocumentTypesQuery = { __typename?: 'Query', fetchDocumentTypes: { __typename?: 'DocumentTypesPayload', documentTypes?: Array<{ __typename?: 'DocumentType', type?: string | null, id: string, practiceId?: string | null } | null> | null, response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null } };

export type LoginMutationVariables = Exact<{
  loginUser: LoginUserInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AccessUserPayload', access_token?: string | null, isTwoFactorEnabled?: boolean | null, userId?: string | null, access_2fa_token?: string | null, response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null, roles?: Array<{ __typename?: 'Role', id: string, role?: string | null, createdAt?: string | null, updatedAt?: string | null }> | null } };

export type GetLoggedInUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLoggedInUserQuery = { __typename?: 'Query', me: { __typename?: 'UserPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, error?: string | null, message?: string | null } | null, user?: { __typename?: 'User', id: string, email: string, phone?: string | null, isTwoFactorEnabled: boolean, token?: string | null, userId: string, userType: string, autoLogoutTime?: string | null, roles?: Array<{ __typename?: 'Role', id: string, role?: string | null, rolePermissions?: Array<{ __typename?: 'RolePermission', permission?: { __typename?: 'Permission', id: string, name?: string | null } | null }> | null } | null> | null, facility?: { __typename?: 'Facility', id: string, name: string, practiceId?: string | null, practice?: { __typename?: 'Practice', id: string, name: string } | null } | null, attachments?: Array<{ __typename?: 'Attachment', id: string, key?: string | null, url?: string | null, type: AttachmentType, title?: string | null, typeId: string, createdAt: string, updatedAt: string }> | null } | null } };

export type ForgetPasswordMutationVariables = Exact<{
  forgotPasswordInput: ForgotPasswordInput;
}>;


export type ForgetPasswordMutation = { __typename?: 'Mutation', forgotPassword: { __typename?: 'ForgotPasswordPayload', response?: { __typename?: 'ResponsePayload', name?: string | null, message?: string | null, status?: number | null } | null } };

export type ResetPasswordMutationVariables = Exact<{
  resetPassword: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'UserPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type UpdatePasswordMutationVariables = Exact<{
  updatePasswordInput: UpdatePasswordInput;
}>;


export type UpdatePasswordMutation = { __typename?: 'Mutation', updatePassword: { __typename?: 'UserPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type GetDoctorUserQueryVariables = Exact<{
  getDoctor: GetDoctor;
}>;


export type GetDoctorUserQuery = { __typename?: 'Query', getDoctor: { __typename?: 'DoctorPayload', doctor?: { __typename: 'Doctor', id: string, firstName?: string | null, lastName?: string | null, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null, phone?: string | null, address?: string | null, zipCode?: string | null, city?: string | null, state?: string | null, country?: string | null, primaryContact?: boolean | null }> | null, attachments?: Array<{ __typename?: 'Attachment', id: string, key?: string | null, url?: string | null, type: AttachmentType, title?: string | null, typeId: string, createdAt: string, updatedAt: string }> | null } | null, response?: { __typename?: 'ResponsePayload', status?: number | null } | null } };

export type GetStaffUserQueryVariables = Exact<{
  getStaff: GetStaff;
}>;


export type GetStaffUserQuery = { __typename?: 'Query', getStaff: { __typename?: 'StaffPayload', response?: { __typename?: 'ResponsePayload', status?: number | null } | null, staff?: { __typename: 'Staff', id: string, email: string, lastName: string, firstName: string, phone?: string | null, practiceId?: string | null, attachments?: Array<{ __typename?: 'Attachment', id: string, key?: string | null, url?: string | null, type: AttachmentType, title?: string | null, typeId: string, createdAt: string, updatedAt: string }> | null } | null } };

export type Update2FactorAuthMutationVariables = Exact<{
  twoFactorInput: TwoFactorInput;
}>;


export type Update2FactorAuthMutation = { __typename?: 'Mutation', update2FactorAuth: { __typename?: 'UserPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type ResentOtpMutationVariables = Exact<{ [key: string]: never; }>;


export type ResentOtpMutation = { __typename?: 'Mutation', resentOTP: { __typename?: 'UserPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type VerifyOtpMutationVariables = Exact<{
  verifyCodeInput: VerifyCodeInput;
}>;


export type VerifyOtpMutation = { __typename?: 'Mutation', verifyOTP: { __typename?: 'UserPayload', access_token?: string | null, response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type UpdateAutoLogoutTimeMutationVariables = Exact<{
  userInfoInput: UserInfoInput;
}>;


export type UpdateAutoLogoutTimeMutation = { __typename?: 'Mutation', updateAutoLogoutTime: { __typename?: 'UserPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, error?: string | null, message?: string | null } | null, user?: { __typename?: 'User', id: string, autoLogoutTime?: string | null } | null } };

export type CreateBillingMutationVariables = Exact<{
  createBillingInput: BillingInput;
}>;


export type CreateBillingMutation = { __typename?: 'Mutation', createBilling: { __typename?: 'BillingPayload', response?: { __typename?: 'Response', status?: number | null, message?: string | null } | null, billing: { __typename?: 'Billing', id: string } } };

export type FetchBillingDetailsByAppointmentIdQueryVariables = Exact<{
  appointmentId: Scalars['String'];
}>;


export type FetchBillingDetailsByAppointmentIdQuery = { __typename?: 'Query', fetchBillingDetailsByAppointmentId: { __typename?: 'BillingPayload', response?: { __typename?: 'Response', status?: number | null, message?: string | null } | null, billing: { __typename?: 'Billing', id: string, patientPaymentType: PatientPaymentType, patientBillingStatus: PatientBillingStatus, onsetDateType: OnsetDateType, onsetDate?: string | null, otherDateType: OtherDateType, employment?: boolean | null, autoAccident?: boolean | null, otherAccident?: boolean | null, otherDate?: string | null, amount?: string | null, codes?: Array<{ __typename?: 'Code', id: string, code?: string | null, description?: string | null, price?: string | null, codeType: CodeType }> | null } } };

export type FindAllPatientAllergiesQueryVariables = Exact<{
  patientAllergyInput: PatientAllergyInput;
}>;


export type FindAllPatientAllergiesQuery = { __typename?: 'Query', findAllPatientAllergies: { __typename?: 'PatientAllergiesPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null, patientAllergies?: Array<{ __typename?: 'PatientAllergies', id: string, allergySeverity: AllergySeverity, allergyOnset: AllergyOnset, allergyStartDate?: string | null, comments?: string | null, isActive?: boolean | null, allergy?: { __typename: 'Allergies', id: string, name?: string | null, allergyType: AllergyType } | null, reactions?: Array<{ __typename?: 'Reactions', id: string, name: string } | null> | null } | null> | null, pagination?: { __typename?: 'PaginationPayload', totalPages?: number | null, page?: number | null } | null } };

export type GetPatientAllergyQueryVariables = Exact<{
  getPatientAllergy: GetPatientAllergy;
}>;


export type GetPatientAllergyQuery = { __typename?: 'Query', getPatientAllergy: { __typename?: 'PatientAllergyPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null, patientAllergy?: { __typename?: 'PatientAllergies', id: string, allergySeverity: AllergySeverity, allergyOnset: AllergyOnset, allergyStartDate?: string | null, comments?: string | null, isActive?: boolean | null, allergy?: { __typename?: 'Allergies', id: string, name?: string | null } | null, reactions?: Array<{ __typename?: 'Reactions', id: string, name: string } | null> | null } | null } };

export type AddPatientAllergyMutationVariables = Exact<{
  createPatientAllergyInput: CreatePatientAllergyInput;
}>;


export type AddPatientAllergyMutation = { __typename?: 'Mutation', addPatientAllergy: { __typename?: 'PatientAllergyPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null } };

export type UpdatePatientAllergyMutationVariables = Exact<{
  updateAllergyInput: UpdateAllergyInput;
}>;


export type UpdatePatientAllergyMutation = { __typename?: 'Mutation', updatePatientAllergy: { __typename?: 'PatientAllergyPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null } };

export type RemovePatientAllergyMutationVariables = Exact<{
  removePatientAllergy: RemovePatientAllergy;
}>;


export type RemovePatientAllergyMutation = { __typename?: 'Mutation', removePatientAllergy: { __typename?: 'PatientAllergyPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null } };

export type FindAllAllergiesQueryVariables = Exact<{
  allergyInput: AllergyInput;
}>;


export type FindAllAllergiesQuery = { __typename?: 'Query', findAllAllergies: { __typename?: 'AllergiesPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null, allergies?: Array<{ __typename?: 'Allergies', id: string, name?: string | null } | null> | null } };

export type FindAllPatientProblemsQueryVariables = Exact<{
  patientProblemInput: PatientProblemInput;
}>;


export type FindAllPatientProblemsQuery = { __typename?: 'Query', findAllPatientProblem: { __typename?: 'PatientProblemsPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null, pagination?: { __typename?: 'PaginationPayload', totalPages?: number | null, page?: number | null } | null, patientProblems?: Array<{ __typename?: 'PatientProblems', id: string, problemType: ProblemType, problemSeverity: ProblemSeverity, problemStartDate?: string | null, note?: string | null, ICDCode?: { __typename: 'ICDCodes', id: string, code: string, description?: string | null } | null, snowMedCode?: { __typename?: 'SnoMedCodes', id: string, referencedComponentId?: string | null } | null } | null> | null } };

export type GetPatientProblemQueryVariables = Exact<{
  getPatientProblem: GetPatientProblem;
}>;


export type GetPatientProblemQuery = { __typename?: 'Query', getPatientProblem: { __typename?: 'PatientProblemPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null, patientProblem?: { __typename?: 'PatientProblems', id: string, problemType: ProblemType, problemSeverity: ProblemSeverity, problemStartDate?: string | null, note?: string | null, snowMedCode?: { __typename?: 'SnoMedCodes', id: string, referencedComponentId?: string | null } | null, appointment?: { __typename?: 'Appointment', id: string, appointmentType?: { __typename?: 'Service', id: string, serviceType: ServiceType } | null } | null } | null } };

export type AddPatientProblemMutationVariables = Exact<{
  createProblemInput: CreateProblemInput;
}>;


export type AddPatientProblemMutation = { __typename?: 'Mutation', addPatientProblem: { __typename?: 'PatientProblemPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null } };

export type UpdatePatientProblemMutationVariables = Exact<{
  updateProblemInput: UpdateProblemInput;
}>;


export type UpdatePatientProblemMutation = { __typename?: 'Mutation', updatePatientProblem: { __typename?: 'PatientProblemPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null } };

export type RemovePatientProblemMutationVariables = Exact<{
  removeProblem: RemoveProblem;
}>;


export type RemovePatientProblemMutation = { __typename?: 'Mutation', removePatientProblem: { __typename?: 'PatientProblemPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null } };

export type SearchSnoMedCodesQueryVariables = Exact<{
  searchSnoMedCodesInput: SearchSnoMedCodesInput;
}>;


export type SearchSnoMedCodesQuery = { __typename?: 'Query', searchSnoMedCodeByIcdCodes: { __typename?: 'snoMedCodesPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null, snoMedCodes?: Array<{ __typename: 'SnoMedCodes', id: string, referencedComponentId?: string | null } | null> | null } };

export type GetPatientVitalQueryVariables = Exact<{
  getPatientVital: GetPatientVital;
}>;


export type GetPatientVitalQuery = { __typename?: 'Query', getPatientVital: { __typename?: 'PatientVitalPayload', response?: { __typename?: 'ResponsePayload', name?: string | null, error?: string | null, status?: number | null, message?: string | null } | null, patientVital?: { __typename?: 'PatientVitals', id: string, unitType: UnitType, weightUnit: WeightType, headCircumference: HeadCircumferenceType, temperatureUnitType: TempUnitType, smokingStatus: SmokingStatus, patientTemperature?: string | null, diastolicBloodPressure?: string | null, systolicBloodPressure?: string | null, respiratoryRate?: string | null, oxygenSaturation?: string | null, PatientHeight?: string | null, PatientWeight?: string | null, PatientBMI?: string | null, PainRange?: string | null, patientHeadCircumference?: string | null, vitalCreationDate?: string | null, patientId?: string | null, appointmentId?: string | null, createdAt?: string | null, updatedAt?: string | null } | null } };

export type FindAllPatientVitalsQueryVariables = Exact<{
  patientVitalInput: PatientVitalInput;
}>;


export type FindAllPatientVitalsQuery = { __typename?: 'Query', findAllPatientVitals: { __typename?: 'PatientVitalsPayload', response?: { __typename?: 'ResponsePayload', name?: string | null, error?: string | null, status?: number | null, message?: string | null } | null, pagination?: { __typename?: 'PaginationPayload', totalPages?: number | null, page?: number | null } | null, patientVitals?: Array<{ __typename?: 'PatientVitals', id: string, unitType: UnitType, weightUnit: WeightType, headCircumference: HeadCircumferenceType, temperatureUnitType: TempUnitType, smokingStatus: SmokingStatus, patientTemperature?: string | null, diastolicBloodPressure?: string | null, systolicBloodPressure?: string | null, respiratoryRate?: string | null, oxygenSaturation?: string | null, PatientHeight?: string | null, PatientWeight?: string | null, PatientBMI?: string | null, PainRange?: string | null, patientHeadCircumference?: string | null, vitalCreationDate?: string | null, patientId?: string | null, appointmentId?: string | null, pulseRate?: string | null, createdAt?: string | null, updatedAt?: string | null } | null> | null } };

export type AddPatientVitalMutationVariables = Exact<{
  createVitalInput: CreateVitalInput;
}>;


export type AddPatientVitalMutation = { __typename?: 'Mutation', addPatientVital: { __typename?: 'PatientVitalPayload', response?: { __typename?: 'ResponsePayload', name?: string | null, error?: string | null, status?: number | null, message?: string | null } | null, patientVital?: { __typename?: 'PatientVitals', id: string } | null } };

export type UpdatePatientVitalMutationVariables = Exact<{
  updateVitalInput: UpdateVitalInput;
}>;


export type UpdatePatientVitalMutation = { __typename?: 'Mutation', updatePatientVital: { __typename?: 'PatientVitalPayload', response?: { __typename?: 'ResponsePayload', name?: string | null, error?: string | null, status?: number | null, message?: string | null } | null, patientVital?: { __typename?: 'PatientVitals', id: string, unitType: UnitType, weightUnit: WeightType, headCircumference: HeadCircumferenceType, temperatureUnitType: TempUnitType, smokingStatus: SmokingStatus, patientTemperature?: string | null, diastolicBloodPressure?: string | null, systolicBloodPressure?: string | null, respiratoryRate?: string | null, oxygenSaturation?: string | null, PatientHeight?: string | null, PatientWeight?: string | null, PatientBMI?: string | null, PainRange?: string | null, patientHeadCircumference?: string | null, vitalCreationDate?: string | null, patientId?: string | null, appointmentId?: string | null, pulseRate?: string | null, createdAt?: string | null, updatedAt?: string | null } | null } };

export type FindAllRoleListQueryVariables = Exact<{
  roleInput: RoleInput;
}>;


export type FindAllRoleListQuery = { __typename?: 'Query', getAllRoles: { __typename?: 'RolesPayload', pagination?: { __typename?: 'PaginationPayload', totalPages?: number | null } | null, roles?: Array<{ __typename?: 'Role', id: string, role?: string | null, description?: string | null } | null> | null } };

export type FindAllPracticeListQueryVariables = Exact<{
  practiceInput: PracticeInput;
}>;


export type FindAllPracticeListQuery = { __typename?: 'Query', findAllPractices: { __typename?: 'PracticesPayload', pagination?: { __typename?: 'PaginationPayload', totalPages?: number | null } | null, practices?: Array<{ __typename?: 'Practice', id: string, name: string } | null> | null } };

export type FindAllFacilityListQueryVariables = Exact<{
  facilityInput: FacilityInput;
}>;


export type FindAllFacilityListQuery = { __typename?: 'Query', findAllFacility: { __typename?: 'FacilitiesPayload', facilities?: Array<{ __typename?: 'Facility', id: string, name: string, practiceId?: string | null } | null> | null, pagination?: { __typename?: 'PaginationPayload', totalPages?: number | null } | null } };

export type FindAllDoctorListQueryVariables = Exact<{
  doctorInput: DoctorInput;
}>;


export type FindAllDoctorListQuery = { __typename?: 'Query', findAllDoctor: { __typename?: 'AllDoctorPayload', doctors?: Array<{ __typename?: 'Doctor', id: string, lastName?: string | null, firstName?: string | null } | null> | null, pagination?: { __typename?: 'PaginationPayload', totalPages?: number | null } | null } };

export type FetchAllPatientListQueryVariables = Exact<{
  patientInput: PatientInput;
}>;


export type FetchAllPatientListQuery = { __typename?: 'Query', fetchAllPatients: { __typename?: 'PatientsPayload', pagination?: { __typename?: 'PaginationPayload', totalPages?: number | null } | null, patients?: Array<{ __typename?: 'Patient', id: string, lastName?: string | null, firstName?: string | null } | null> | null } };

export type FindAllPatientListQueryVariables = Exact<{
  patientInput: PatientInput;
}>;


export type FindAllPatientListQuery = { __typename?: 'Query', findAllPatient: { __typename?: 'PatientsPayload', pagination?: { __typename?: 'PaginationPayload', totalPages?: number | null } | null, patients?: Array<{ __typename?: 'Patient', id: string, lastName?: string | null, firstName?: string | null } | null> | null } };

export type FindAllServiceListQueryVariables = Exact<{
  serviceInput: ServiceInput;
}>;


export type FindAllServiceListQuery = { __typename?: 'Query', findAllServices: { __typename?: 'ServicesPayload', pagination?: { __typename?: 'PaginationPayload', totalPages?: number | null } | null, services?: Array<{ __typename?: 'Service', id: string, name: string, duration: string } | null> | null } };

export type FindAllDoctorPatientQueryVariables = Exact<{
  doctorPatientsInput: DoctorPatientsInput;
}>;


export type FindAllDoctorPatientQuery = { __typename?: 'Query', findAllDoctorPatients: { __typename?: 'DoctorPatientsPayload', pagination?: { __typename?: 'PaginationPayload', totalPages?: number | null } | null, doctorPatients?: Array<{ __typename?: 'DoctorPatient', patient?: { __typename?: 'Patient', id: string, lastName?: string | null, firstName?: string | null, dob?: string | null, profileAttachment?: string | null } | null } | null> | null } };

export type FindAllDoctorUpcomingAppointmentsQueryVariables = Exact<{
  upComingAppointmentsInput: UpComingAppointmentsInput;
}>;


export type FindAllDoctorUpcomingAppointmentsQuery = { __typename?: 'Query', findAllUpcomingAppointments: { __typename?: 'AppointmentsPayload', response?: { __typename?: 'ResponsePayload', status?: number | null } | null, appointments?: Array<{ __typename?: 'Appointment', id: string, status: AppointmentStatus, scheduleStartDateTime?: string | null, scheduleEndDateTime?: string | null, appointmentType?: { __typename?: 'Service', id: string, name: string, duration: string } | null, provider?: { __typename?: 'Doctor', id: string, firstName?: string | null, lastName?: string | null } | null, patient?: { __typename?: 'Patient', id: string, firstName?: string | null, lastName?: string | null, profileAttachment?: string | null } | null } | null> | null } };

export type GetPracticeUsersWithRolesQueryVariables = Exact<{
  practiceFacilitiesUsersInputs: PracticeFacilitiesUsersInputs;
}>;


export type GetPracticeUsersWithRolesQuery = { __typename?: 'Query', getPracticeFacilitiesUsersWithRoles: { __typename?: 'PracticeUsersWithRolesPayload', response?: { __typename?: 'ResponsePayloadResponse', status?: number | null } | null, practiceUsers?: Array<{ __typename?: 'PracticeUsersWithRoles', id?: string | null, name?: string | null, facilities?: Array<{ __typename?: 'FacilitiesUserWithRoles', name?: string | null, users?: Array<{ __typename?: 'UserWithRoles', count?: number | null, role?: string | null }> | null }> | null }> | null } };

export type GetPracticeUserRolesCountQueryVariables = Exact<{
  usersWithRolesInputs: UsersWithRolesInputs;
}>;


export type GetPracticeUserRolesCountQuery = { __typename?: 'Query', getUsersWithRoles: { __typename?: 'PracticeUserRolesPayload', response?: { __typename?: 'ResponsePayloadResponse', status?: number | null, message?: string | null } | null, userRoles?: Array<{ __typename?: 'PracticeUserRoles', role?: string | null, count: number }> | null } };

export type GetPracticeFacilityAppointmentsQueryVariables = Exact<{
  practiceFacilityAppointmentsInputs: PracticeFacilityAppointmentsInputs;
}>;


export type GetPracticeFacilityAppointmentsQuery = { __typename?: 'Query', getPracticeFacilityAppointments: { __typename?: 'PracticeFacilityAppointmentsPayload', response?: { __typename?: 'ResponsePayloadResponse', status?: number | null } | null, facilitiesAppointments?: Array<{ __typename?: 'PracticeFacilityAppointment', facility?: string | null, count: number }> | null } };

export type GetPracticeFacilitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPracticeFacilitiesQuery = { __typename?: 'Query', getPracticesFacilities: { __typename?: 'PracticeFacilitiesPayload', response?: { __typename?: 'ResponsePayloadResponse', status?: number | null } | null, practiceFacilities?: Array<{ __typename?: 'PracticeFacilities', id?: string | null, name?: string | null, facility?: number | null }> | null } };

export type GetPracticeUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPracticeUserQuery = { __typename?: 'Query', getPracticesUser: { __typename?: 'PracticeUsersPayload', response?: { __typename?: 'ResponsePayloadResponse', status?: number | null } | null, practiceUsers?: Array<{ __typename?: 'PracticeUsers', id?: string | null, name?: string | null, userCount?: number | null }> | null } };

export type GetPracticeByYearQueryVariables = Exact<{
  practicesViaDateInputs: PracticesViaDateInputs;
}>;


export type GetPracticeByYearQuery = { __typename?: 'Query', getPracticesByYear: { __typename?: 'PracticesViaDatePayload', response?: { __typename?: 'ResponsePayloadResponse', status?: number | null } | null, practices?: Array<{ __typename?: 'PracticesViaDate', id?: number | null, name?: string | null, count?: number | null }> | null } };

export type FindAllDoctorQueryVariables = Exact<{
  doctorInput: DoctorInput;
}>;


export type FindAllDoctorQuery = { __typename?: 'Query', findAllDoctor: { __typename?: 'AllDoctorPayload', doctors?: Array<{ __typename?: 'Doctor', id: string, email?: string | null, lastName?: string | null, firstName?: string | null, speciality?: Speciality | null, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null, phone?: string | null, primaryContact?: boolean | null }> | null, facility?: { __typename?: 'Facility', id: string, name: string } | null } | null> | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null, response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type CreateDoctorMutationVariables = Exact<{
  createDoctorInput: CreateDoctorInput;
}>;


export type CreateDoctorMutation = { __typename?: 'Mutation', createDoctor: { __typename?: 'DoctorPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type RemoveDoctorMutationVariables = Exact<{
  removeDoctor: RemoveDoctor;
}>;


export type RemoveDoctorMutation = { __typename?: 'Mutation', removeDoctor: { __typename?: 'DoctorPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type GetDoctorQueryVariables = Exact<{
  getDoctor: GetDoctor;
}>;


export type GetDoctorQuery = { __typename?: 'Query', getDoctor: { __typename?: 'DoctorPayload', doctor?: { __typename?: 'Doctor', id: string, firstName?: string | null, middleName?: string | null, lastName?: string | null, prefix?: string | null, suffix?: string | null, email?: string | null, providerIntials?: string | null, degreeCredentials?: string | null, speciality?: Speciality | null, dob?: string | null, taxId?: string | null, facilityId?: string | null, ssn?: string | null, taxonomyCode?: string | null, deaNumber?: string | null, prescriptiveAuthNumber?: string | null, licenseTermDate?: string | null, stateLicense?: string | null, languagesSpoken?: string | null, dpsCtpNumber?: string | null, anesthesiaLicense?: string | null, specialityLicense?: string | null, taxIdStuff?: string | null, blueShildNumber?: string | null, campusGrpNumber?: string | null, medicareGrpNumber?: string | null, billingFacility?: string | null, emcProviderId?: string | null, upin?: string | null, npi?: string | null, practiceId?: string | null, licenseActiveDate?: string | null, meammographyCertNumber?: string | null, medicaidGrpNumber?: string | null, deaActiveDate?: string | null, deaTermDate?: string | null, createdAt: string, updatedAt: string, billingAddress?: Array<{ __typename?: 'BillingAddress', id: string, email?: string | null, mobile?: string | null, phone?: string | null, fax?: string | null, address?: string | null, address2?: string | null, zipCode?: string | null, city?: string | null, state?: string | null, country?: string | null, userId?: string | null, createdAt: string, updatedAt: string }> | null, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null, phone?: string | null, mobile?: string | null, pager?: string | null, fax?: string | null, address?: string | null, address2?: string | null, serviceCode: ServiceCodes, zipCode?: string | null, city?: string | null, state?: string | null, country?: string | null, userId?: string | null, primaryContact?: boolean | null, createdAt: string, updatedAt: string }> | null, attachments?: Array<{ __typename?: 'Attachment', id: string, key?: string | null, url?: string | null, type: AttachmentType, title?: string | null, typeId: string, createdAt: string, updatedAt: string }> | null, facility?: { __typename?: 'Facility', id: string, name: string, isPrivate?: boolean | null, createdAt?: string | null, updatedAt?: string | null } | null } | null, response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type UpdateDoctorMutationVariables = Exact<{
  updateDoctorInput: UpdateDoctorInput;
}>;


export type UpdateDoctorMutation = { __typename?: 'Mutation', updateDoctor: { __typename?: 'DoctorPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type FindAllFacilitiesQueryVariables = Exact<{
  facilityInput: FacilityInput;
}>;


export type FindAllFacilitiesQuery = { __typename?: 'Query', findAllFacility: { __typename?: 'FacilitiesPayload', facilities?: Array<{ __typename?: 'Facility', id: string, name: string, practice?: { __typename?: 'Practice', id: string, name: string } | null, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null, phone?: string | null, zipCode?: string | null, city?: string | null, state?: string | null, primaryContact?: boolean | null }> | null } | null> | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null, response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type GetFacilityQueryVariables = Exact<{
  getFacility: GetFacility;
}>;


export type GetFacilityQuery = { __typename?: 'Query', getFacility: { __typename?: 'FacilityPayload', facility?: { __typename?: 'Facility', id: string, name: string, practiceType?: PracticeType | null, cliaIdNumber?: string | null, federalTaxId?: string | null, isPrivate?: boolean | null, tamxonomyCode?: string | null, timeZone?: string | null, mammographyCertificationNumber?: string | null, npi?: string | null, practiceId?: string | null, serviceCode: ServiceCode, startTime?: string | null, endTime?: string | null, createdAt?: string | null, updatedAt?: string | null, practice?: { __typename?: 'Practice', id: string, name: string } | null, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null, phone?: string | null, mobile?: string | null, fax?: string | null, address?: string | null, address2?: string | null, zipCode?: string | null, city?: string | null, state?: string | null, country?: string | null, primaryContact?: boolean | null, createdAt: string, updatedAt: string }> | null, billingAddress?: Array<{ __typename?: 'BillingAddress', id: string, email?: string | null, mobile?: string | null, phone?: string | null, fax?: string | null, address?: string | null, address2?: string | null, zipCode?: string | null, city?: string | null, state?: string | null, country?: string | null, createdAt: string, updatedAt: string }> | null } | null, response?: { __typename?: 'ResponsePayload', name?: string | null, status?: number | null, message?: string | null } | null } };

export type RemoveFacilityMutationVariables = Exact<{
  removeFacility: RemoveFacility;
}>;


export type RemoveFacilityMutation = { __typename?: 'Mutation', removeFacility: { __typename?: 'FacilityPayload', response?: { __typename?: 'ResponsePayload', name?: string | null, status?: number | null, message?: string | null } | null } };

export type UpdateFacilityMutationVariables = Exact<{
  updateFacilityInput: UpdateFacilityInput;
}>;


export type UpdateFacilityMutation = { __typename?: 'Mutation', updateFacility: { __typename?: 'FacilityPayload', response?: { __typename?: 'ResponsePayload', name?: string | null, status?: number | null, message?: string | null } | null, facility?: { __typename?: 'Facility', id: string, name: string } | null } };

export type CreateFacilityMutationVariables = Exact<{
  createFacilityInput: CreateFacilityInput;
}>;


export type CreateFacilityMutation = { __typename?: 'Mutation', createFacility: { __typename?: 'FacilityPayload', response?: { __typename?: 'ResponsePayload', name?: string | null, status?: number | null, message?: string | null } | null, facility?: { __typename?: 'Facility', id: string, name: string } | null } };

export type CreateFormMutationVariables = Exact<{
  createFormInput: CreateFormInput;
}>;


export type CreateFormMutation = { __typename?: 'Mutation', createForm: { __typename?: 'FormPayload', response?: { __typename?: 'ResponsePayload', status?: number | null } | null, form?: { __typename?: 'Form', id: string, name?: string | null } | null } };

export type FindAllFormsQueryVariables = Exact<{
  formInput: FormInput;
}>;


export type FindAllFormsQuery = { __typename?: 'Query', findAllForms: { __typename?: 'FormsPayload', response?: { __typename?: 'ResponsePayload', status?: number | null } | null, forms: Array<{ __typename?: 'Form', id: string, type: FormType, facilityId?: string | null, practiceId?: string | null, name?: string | null, createdAt?: string | null, isActive?: boolean | null, layout: { __typename?: 'LayoutJSONType', tabs: Array<{ __typename?: 'FormTabs', id?: string | null, name?: string | null, sections: Array<{ __typename?: 'SectionsTypes', id: string, col: number, name: string, fields: Array<{ __typename?: 'FieldsTypes', label: string, name: string, type: ElementType, css: string, column: number, placeholder: string, defaultValue: string, required: boolean, errorMsg: string, tableName?: string | null, columnName?: string | null, fieldId: string, textArea: boolean, isMultiSelect?: boolean | null, apiCall?: string | null, tableContactType?: string | null, options: Array<{ __typename?: 'FieldOptionsType', name: string, value: string }> }> }> }> } }>, pagination?: { __typename?: 'PaginationPayload', page?: number | null, limit?: number | null, totalCount?: number | null, totalPages?: number | null } | null } };

export type RemoveFormMutationVariables = Exact<{
  removeForm: RemoveForm;
}>;


export type RemoveFormMutation = { __typename?: 'Mutation', removeForm: { __typename?: 'FormPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null } };

export type GetFormQueryVariables = Exact<{
  getForm: GetForm;
}>;


export type GetFormQuery = { __typename?: 'Query', getForm: { __typename?: 'FormPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null, form?: { __typename?: 'Form', id: string, name?: string | null, type: FormType, facilityId?: string | null, practiceId?: string | null, isActive?: boolean | null, layout: { __typename?: 'LayoutJSONType', tabs: Array<{ __typename?: 'FormTabs', id?: string | null, name?: string | null, sections: Array<{ __typename?: 'SectionsTypes', id: string, col: number, name: string, fields: Array<{ __typename?: 'FieldsTypes', label: string, name: string, type: ElementType, css: string, column: number, placeholder: string, defaultValue: string, required: boolean, errorMsg: string, tableName?: string | null, columnName?: string | null, fieldId: string, textArea: boolean, isMultiSelect?: boolean | null, tableContactType?: string | null, apiCall?: string | null, options: Array<{ __typename?: 'FieldOptionsType', name: string, value: string }> }> }> }> } } | null } };

export type UpdateFormMutationVariables = Exact<{
  updateFormInput: UpdateFormInput;
}>;


export type UpdateFormMutation = { __typename?: 'Mutation', updateForm: { __typename?: 'FormPayload', response?: { __typename?: 'ResponsePayload', status?: number | null } | null, form?: { __typename?: 'Form', id: string, name?: string | null } | null } };

export type GetPublicFormQueryVariables = Exact<{
  getForm: GetForm;
}>;


export type GetPublicFormQuery = { __typename?: 'Query', getPublicForm: { __typename?: 'FormPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null, form?: { __typename?: 'Form', id: string, type: FormType, facilityId?: string | null, practiceId?: string | null, name?: string | null, isActive?: boolean | null, layout: { __typename?: 'LayoutJSONType', tabs: Array<{ __typename?: 'FormTabs', id?: string | null, name?: string | null, sections: Array<{ __typename?: 'SectionsTypes', id: string, col: number, name: string, fields: Array<{ __typename?: 'FieldsTypes', label: string, name: string, type: ElementType, css: string, column: number, placeholder: string, defaultValue: string, required: boolean, errorMsg: string, tableName?: string | null, columnName?: string | null, fieldId: string, textArea: boolean, isMultiSelect?: boolean | null, apiCall?: string | null, tableContactType?: string | null, options: Array<{ __typename?: 'FieldOptionsType', name: string, value: string }> }> }> }> } } | null } };

export type FindAllUsersFormsQueryVariables = Exact<{
  userFormInput: UserFormInput;
}>;


export type FindAllUsersFormsQuery = { __typename?: 'Query', findAllUsersForms: { __typename?: 'UserFormsPayload', response?: { __typename?: 'ResponsePayloadResponse', status?: number | null, message?: string | null } | null, form?: { __typename?: 'Form', id: string, name?: string | null, formElements?: Array<{ __typename?: 'FormElement', id: string, name: string, label?: string | null, fieldId: string, sectionId: string, isDeleted: boolean }> | null, userForms?: Array<{ __typename?: 'UserForms', id: string, FormId: string, DoctorId?: string | null, PatientId?: string | null, StaffId?: string | null, SubmitterId?: string | null, userFormElements?: Array<{ __typename?: 'UsersFormsElements', id: string, value?: string | null, UsersFormsId: string, FormsElementsId: string, arrayOfStrings: Array<string>, arrayOfObjects: Array<{ __typename?: 'ArrayOfStringsType', name: string, value: boolean }> }> | null }> | null } | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, limit?: number | null, totalCount?: number | null, totalPages?: number | null } | null } };

export type SaveUserFormValuesMutationVariables = Exact<{
  createUserFormInput: CreateUserFormInput;
}>;


export type SaveUserFormValuesMutation = { __typename?: 'Mutation', saveUserFormValues: { __typename?: 'UserFormPayload', response?: { __typename?: 'ResponsePayloadResponse', status?: number | null, message?: string | null, error?: string | null } | null, userForm?: { __typename?: 'UserForms', id: string } | null, appointment?: { __typename?: 'Appointment', id: string } | null } };

export type GetFormPublicMediaUrlMutationVariables = Exact<{
  getPublicMediaInput: GetPublicMediaInput;
}>;


export type GetFormPublicMediaUrlMutation = { __typename?: 'Mutation', getFormPublicMediaUrl: { __typename?: 'FormMediaPayload', publicUrl?: string | null, response?: { __typename?: 'ResponsePayloadResponse', status?: number | null, error?: string | null, message?: string | null } | null } };

export type CreateFormTemplateMutationVariables = Exact<{
  createFormInput: CreateFormInput;
}>;


export type CreateFormTemplateMutation = { __typename?: 'Mutation', createFormTemplate: { __typename?: 'FormPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null, error?: string | null } | null, form?: { __typename?: 'Form', id: string } | null } };

export type FetchAllInsurancesQueryVariables = Exact<{
  insuranceInput: InsurancePaginationInput;
}>;


export type FetchAllInsurancesQuery = { __typename?: 'Query', fetchAllInsurances: { __typename?: 'InsurancesPayload', insurances: Array<{ __typename?: 'Insurance', payerName: string, payerId: string, id: string }>, response?: { __typename?: 'Response', status?: number | null, message?: string | null } | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null } };

export type FetchAllPoliciesQueryVariables = Exact<{
  policyInput: PolicyPaginationInput;
}>;


export type FetchAllPoliciesQuery = { __typename?: 'Query', fetchAllPolicies: { __typename?: 'PoliciesPayload', policies: Array<{ __typename?: 'Policy', id: string, orderOfBenefit?: OrderOfBenefitType | null, expirationDate?: string | null, issueDate?: string | null, memberId?: string | null, groupNumber?: string | null, copays?: Array<{ __typename?: 'Copay', type?: CopayType | null, amount?: string | null }> | null, policyHolder?: { __typename?: 'PolicyHolder', firstName?: string | null, lastName?: string | null } | null, patient?: { __typename?: 'Patient', email?: string | null } | null, insurance?: { __typename?: 'Insurance', payerName: string, payerId: string } | null }>, pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null, response?: { __typename?: 'Response', status?: number | null, message?: string | null } | null } };

export type FetchPolicyQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type FetchPolicyQuery = { __typename?: 'Query', fetchPolicy: { __typename?: 'PolicyPayload', policy: { __typename?: 'Policy', id: string, policyHolderRelationship?: PolicyHolderRelationshipType | null, coinsurancePercentage?: string | null, expirationDate?: string | null, pricingProductType?: PricingProductType | null, issueDate?: string | null, memberId?: string | null, groupNumber?: string | null, notes?: string | null, orderOfBenefit?: OrderOfBenefitType | null, referringProvider?: { __typename?: 'Doctor', firstName?: string | null, lastName?: string | null, id: string } | null, primaryCareProvider?: { __typename?: 'Doctor', firstName?: string | null, lastName?: string | null, id: string } | null, copays?: Array<{ __typename?: 'Copay', id: string, type?: CopayType | null, amount?: string | null }> | null, policyHolder?: { __typename?: 'PolicyHolder', id: string, address?: string | null, addressCTD?: string | null, city?: string | null, dob?: string | null, employer?: string | null, firstName?: string | null, middleName?: string | null, lastName?: string | null, certificationNumber?: string | null, ssn?: string | null, state?: string | null, suffix?: string | null, zipCode?: string | null, sex?: Policy_Holder_Gender_Identity | null } | null, patient?: { __typename?: 'Patient', id: string } | null, insurance?: { __typename?: 'Insurance', payerName: string, payerId: string, id: string } | null }, response?: { __typename?: 'Response', status?: number | null, message?: string | null } | null } };

export type FetchPatientInsurancesQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type FetchPatientInsurancesQuery = { __typename?: 'Query', fetchPatientInsurances: { __typename?: 'PoliciesPayload', policies: Array<{ __typename?: 'Policy', id: string, policyHolderRelationship?: PolicyHolderRelationshipType | null, coinsurancePercentage?: string | null, expirationDate?: string | null, pricingProductType?: PricingProductType | null, issueDate?: string | null, memberId?: string | null, groupNumber?: string | null, notes?: string | null, orderOfBenefit?: OrderOfBenefitType | null, referringProvider?: { __typename?: 'Doctor', firstName?: string | null, lastName?: string | null, id: string } | null, primaryCareProvider?: { __typename?: 'Doctor', firstName?: string | null, lastName?: string | null, id: string } | null, copays?: Array<{ __typename?: 'Copay', id: string, type?: CopayType | null, amount?: string | null }> | null, policyHolder?: { __typename?: 'PolicyHolder', id: string, address?: string | null, addressCTD?: string | null, city?: string | null, dob?: string | null, employer?: string | null, firstName?: string | null, middleName?: string | null, lastName?: string | null, certificationNumber?: string | null, ssn?: string | null, state?: string | null, suffix?: string | null, zipCode?: string | null, sex?: Policy_Holder_Gender_Identity | null } | null, patient?: { __typename?: 'Patient', id: string } | null, insurance?: { __typename?: 'Insurance', payerName: string, payerId: string, id: string } | null }>, response?: { __typename?: 'Response', status?: number | null, message?: string | null } | null } };

export type CreatePolicyMutationVariables = Exact<{
  createPolicyInput: CreatePolicyInput;
}>;


export type CreatePolicyMutation = { __typename?: 'Mutation', createPolicy: { __typename?: 'PolicyPayload', response?: { __typename?: 'Response', status?: number | null, message?: string | null } | null, policy: { __typename?: 'Policy', id: string } } };

export type CreateCopayMutationVariables = Exact<{
  createCopayInput: CopayInput;
}>;


export type CreateCopayMutation = { __typename?: 'Mutation', createCopay: { __typename?: 'Copay', id: string } };

export type UpdatePolicyMutationVariables = Exact<{
  updatePolicyInput: UpdatePolicyInput;
}>;


export type UpdatePolicyMutation = { __typename?: 'Mutation', updatePolicy: { __typename?: 'PolicyPayload', response?: { __typename?: 'Response', status?: number | null, message?: string | null } | null, policy: { __typename?: 'Policy', id: string } } };

export type CreateInvoiceMutationVariables = Exact<{
  createInvoiceInputs: CreateInvoiceInputs;
}>;


export type CreateInvoiceMutation = { __typename?: 'Mutation', createInvoice: { __typename?: 'InvoicePayload', response?: { __typename?: 'ResponsePayload', name?: string | null, status?: number | null, message?: string | null } | null, invoice?: { __typename?: 'Invoice', invoiceNo: string } | null } };

export type FindAllLabTestQueryVariables = Exact<{
  labTestInput: LabTestInput;
}>;


export type FindAllLabTestQuery = { __typename?: 'Query', findAllLabTest: { __typename?: 'LabTestsPayload', labTests?: Array<{ __typename?: 'LabTests', id: string, orderNumber?: string | null, labTestStatus: LabTestStatus, testDate?: string | null, testTime?: string | null, patientId?: string | null, createdAt?: string | null, testNotes?: string | null, patient?: { __typename?: 'Patient', firstName?: string | null, doctorPatients?: Array<{ __typename?: 'DoctorPatient', currentProvider?: boolean | null, doctor?: { __typename?: 'Doctor', firstName?: string | null, lastName?: string | null } | null }> | null } | null, diagnoses?: Array<{ __typename?: 'ICDCodes', code: string, description?: string | null } | null> | null, test?: { __typename?: 'LoincCodes', id: string, loincNum?: string | null, component?: string | null } | null, testObservations?: Array<{ __typename?: 'Observations', createdAt?: string | null, doctorsSignOff?: boolean | null, attachments?: Array<{ __typename?: 'Attachment', title?: string | null, id: string, attachmentName?: string | null, url?: string | null }> | null }> | null, appointment?: { __typename?: 'Appointment', id: string, scheduleStartDateTime?: string | null, appointmentType?: { __typename?: 'Service', name: string } | null } | null } | null> | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null, response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type FindAllLoincCodesQueryVariables = Exact<{
  searchLoincCodesInput: SearchLoincCodesInput;
}>;


export type FindAllLoincCodesQuery = { __typename?: 'Query', findAllLoincCodes: { __typename?: 'LoincCodesPayload', loincCodes?: Array<{ __typename?: 'LoincCodes', id: string, loincNum?: string | null, component?: string | null }> | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null, response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type FindAllTestSpecimenTypesQueryVariables = Exact<{
  testSpecimenTypeInput: TestSpecimenTypeInput;
}>;


export type FindAllTestSpecimenTypesQuery = { __typename?: 'Query', findAllTestSpecimenTypes: { __typename?: 'TestSpecimenTypesPayload', specimenTypes?: Array<{ __typename?: 'SpecimenTypes', id: string, name?: string | null }> | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null, response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type GetSpecimenTypeByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetSpecimenTypeByNameQuery = { __typename?: 'Query', getSpecimenTypeByName: { __typename?: 'SpecimenTypes', id: string, name?: string | null } };

export type FindLabTestsByOrderNumQueryVariables = Exact<{
  labTestByOrderNumInput: LabTestByOrderNumInput;
}>;


export type FindLabTestsByOrderNumQuery = { __typename?: 'Query', findLabTestsByOrderNum: { __typename?: 'LabTestsPayload', labTests?: Array<{ __typename?: 'LabTests', id: string, labTestStatus: LabTestStatus, testDate?: string | null, testTime?: string | null, patientId?: string | null, createdAt?: string | null, testNotes?: string | null, receivedDate?: string | null, labName?: string | null, vendorName?: string | null, accessionNumber?: string | null, collectedDate?: string | null, doctor?: { __typename?: 'Doctor', firstName?: string | null, lastName?: string | null, id: string } | null, patient?: { __typename?: 'Patient', firstName?: string | null, doctorPatients?: Array<{ __typename?: 'DoctorPatient', currentProvider?: boolean | null, doctor?: { __typename?: 'Doctor', firstName?: string | null, lastName?: string | null } | null }> | null } | null, diagnoses?: Array<{ __typename?: 'ICDCodes', id: string, code: string, description?: string | null } | null> | null, test?: { __typename?: 'LoincCodes', id: string, loincNum?: string | null, component?: string | null, unitsRequired?: string | null } | null, testSpecimens?: Array<{ __typename?: 'TestSpecimens', id: string, collectionDate?: string | null, collectionTime?: string | null, specimenNotes?: string | null, specimenTypes?: { __typename?: 'SpecimenTypes', id: string, name?: string | null } | null }> | null, testObservations?: Array<{ __typename?: 'Observations', id: string, doctorsSignOff?: boolean | null, resultUnit?: string | null, resultValue?: string | null, normalRange?: string | null, normalRangeUnit?: string | null, abnormalFlag: AbnormalFlag, attachments?: Array<{ __typename?: 'Attachment', title?: string | null, id: string, attachmentName?: string | null, url?: string | null }> | null }> | null, appointment?: { __typename?: 'Appointment', id: string, scheduleStartDateTime?: string | null, appointmentType?: { __typename?: 'Service', name: string } | null } | null } | null> | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null, response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type CreateLabTestMutationVariables = Exact<{
  createLabTestInput: CreateLabTestInput;
}>;


export type CreateLabTestMutation = { __typename?: 'Mutation', createLabTest: { __typename?: 'LabTestPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, labTest?: { __typename?: 'LabTests', orderNumber?: string | null } | null } };

export type UpdateLabTestMutationVariables = Exact<{
  updateLabTestInput: UpdateLabTestInput;
}>;


export type UpdateLabTestMutation = { __typename?: 'Mutation', updateLabTest: { __typename?: 'LabTestPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type UpdateLabTestsByOrderNumMutationVariables = Exact<{
  updateLabTestItemInput: CreateLabTestItemInput;
}>;


export type UpdateLabTestsByOrderNumMutation = { __typename?: 'Mutation', updateLabTestsByOrderNum: { __typename?: 'LabTestsPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type RemoveLabTestMutationVariables = Exact<{
  removeLabTest: RemoveLabTest;
}>;


export type RemoveLabTestMutation = { __typename?: 'Mutation', removeLabTest: { __typename?: 'LabTestPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type RemoveLabTestObservationMutationVariables = Exact<{
  removeLabTestObservation: RemoveLabTestObservation;
}>;


export type RemoveLabTestObservationMutation = { __typename?: 'Mutation', removeLabTestObservation: { __typename?: 'LabTestObservationPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type UpdateLabTestObservationMutationVariables = Exact<{
  updateLabTestObservationInput: UpdateLabTestObservationInput;
}>;


export type UpdateLabTestObservationMutation = { __typename?: 'Mutation', updateLabTestObservation: { __typename?: 'LabTestObservationPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type FindAllPatientQueryVariables = Exact<{
  patientInput: PatientInput;
}>;


export type FindAllPatientQuery = { __typename?: 'Query', findAllPatient: { __typename?: 'PatientsPayload', pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null, response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, patients?: Array<{ __typename?: 'Patient', id: string, email?: string | null, lastName?: string | null, firstName?: string | null, patientRecord?: string | null, contacts?: Array<{ __typename?: 'Contact', id: string, name?: string | null, city?: string | null, email?: string | null, phone?: string | null, primaryContact?: boolean | null }> | null } | null> | null } };

export type FetchAllPatientQueryVariables = Exact<{
  patientInput: PatientInput;
}>;


export type FetchAllPatientQuery = { __typename?: 'Query', fetchAllPatients: { __typename?: 'PatientsPayload', pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null, response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, patients?: Array<{ __typename?: 'Patient', id: string, email?: string | null, dob?: string | null, lastName?: string | null, firstName?: string | null, patientRecord?: string | null, contacts?: Array<{ __typename?: 'Contact', id: string, name?: string | null, city?: string | null, email?: string | null, phone?: string | null, primaryContact?: boolean | null }> | null } | null> | null } };

export type GetPatientQueryVariables = Exact<{
  getPatient: GetPatient;
}>;


export type GetPatientQuery = { __typename?: 'Query', getPatient: { __typename?: 'PatientPayload', response?: { __typename?: 'ResponsePayload', name?: string | null, error?: string | null, status?: number | null, message?: string | null } | null, patient?: { __typename?: 'Patient', id: string, email?: string | null, firstName?: string | null, middleName?: string | null, lastName?: string | null, suffix?: string | null, facilityId?: string | null, inviteAccepted?: boolean | null, patientRecord?: string | null, firstNameUsed?: string | null, prefferedName?: string | null, previousFirstName?: string | null, previouslastName?: string | null, motherMaidenName?: string | null, registrationDate?: string | null, ssn?: string | null, gender: Genderidentity, dob?: string | null, phonePermission?: boolean | null, pharmacy?: string | null, medicationHistoryAuthority: boolean, releaseOfInfoBill: boolean, smsPermission?: boolean | null, deceasedDate?: string | null, privacyNotice: boolean, callToConsent: boolean, preferredCommunicationMethod: Communicationtype, patientNote?: string | null, language?: string | null, race?: Race | null, ethnicity?: Ethnicity | null, maritialStatus?: Maritialstatus | null, sexualOrientation?: Sexualorientation | null, genderIdentity?: Genderidentity | null, sexAtBirth?: Genderidentity | null, pronouns?: Pronouns | null, homeBound?: Homebound | null, holdStatement?: Holdstatement | null, statementDelivereOnline?: boolean | null, statementNote?: string | null, statementNoteDateFrom?: string | null, statementNoteDateTo?: string | null, patientNoteOpen?: boolean | null, createdAt: string, updatedAt: string, doctorPatients?: Array<{ __typename?: 'DoctorPatient', id: string, doctorId?: string | null, currentProvider?: boolean | null, otherRelation?: string | null, relation?: DoctorPatientRelationType | null, doctor?: { __typename?: 'Doctor', id: string, firstName?: string | null, lastName?: string | null, createdAt: string, updatedAt: string } | null }> | null, attachments?: Array<{ __typename?: 'Attachment', id: string, key?: string | null, url?: string | null, type: AttachmentType, title?: string | null, typeId: string, createdAt: string, updatedAt: string }> | null, contacts?: Array<{ __typename?: 'Contact', id: string, fax?: string | null, ssn?: string | null, city?: string | null, email?: string | null, pager?: string | null, phone?: string | null, mobile?: string | null, address?: string | null, address2?: string | null, state?: string | null, zipCode?: string | null, country?: string | null, name?: string | null, suffix?: string | null, firstName?: string | null, primaryContact?: boolean | null, middleName?: string | null, lastName?: string | null, serviceCode: ServiceCodes, employerName?: string | null, relationship?: RelationshipType | null, contactType?: ContactType | null, createdAt: string, updatedAt: string }> | null, employer?: { __typename?: 'Employer', id: string, name?: string | null, email?: string | null, phone?: string | null, mobile?: string | null, industry?: string | null, usualOccupation?: string | null, city?: string | null, state?: string | null, zipCode?: string | null, address?: string | null, createdAt: string, updatedAt: string } | null, facility?: { __typename?: 'Facility', id: string, name: string, isPrivate?: boolean | null, serviceCode: ServiceCode, updatedAt?: string | null } | null } | null } };

export type RemovePatientMutationVariables = Exact<{
  removePatient: RemovePatient;
}>;


export type RemovePatientMutation = { __typename?: 'Mutation', removePatient: { __typename?: 'PatientPayload', response?: { __typename?: 'ResponsePayload', name?: string | null, status?: number | null, message?: string | null } | null } };

export type CreatePatientMutationVariables = Exact<{
  createPatientInput: CreatePatientInput;
}>;


export type CreatePatientMutation = { __typename?: 'Mutation', createPatient: { __typename?: 'PatientPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, patient?: { __typename?: 'Patient', id: string } | null } };

export type UpdatePatientMutationVariables = Exact<{
  updatePatientInput: UpdatePatientInput;
}>;


export type UpdatePatientMutation = { __typename?: 'Mutation', updatePatient: { __typename?: 'PatientPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type SendInviteToPatientMutationVariables = Exact<{
  patientInviteInput: PatientInviteInput;
}>;


export type SendInviteToPatientMutation = { __typename?: 'Mutation', sendInviteToPatient: { __typename?: 'PatientPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, error?: string | null, message?: string | null } | null, patient?: { __typename?: 'Patient', id: string, firstName?: string | null, middleName?: string | null, lastName?: string | null, suffix?: string | null, firstNameUsed?: string | null, prefferedName?: string | null, previousFirstName?: string | null, previouslastName?: string | null, motherMaidenName?: string | null, inviteAccepted?: boolean | null, ssn?: string | null, gender: Genderidentity, dob?: string | null, phonePermission?: boolean | null, pharmacy?: string | null, medicationHistoryAuthority: boolean, releaseOfInfoBill: boolean, smsPermission?: boolean | null, deceasedDate?: string | null, privacyNotice: boolean, callToConsent: boolean, preferredCommunicationMethod: Communicationtype, patientNote?: string | null, language?: string | null, race?: Race | null, ethnicity?: Ethnicity | null, maritialStatus?: Maritialstatus | null, sexualOrientation?: Sexualorientation | null, genderIdentity?: Genderidentity | null, sexAtBirth?: Genderidentity | null, pronouns?: Pronouns | null, homeBound?: Homebound | null, holdStatement?: Holdstatement | null, statementDelivereOnline?: boolean | null, statementNote?: string | null, statementNoteDateFrom?: string | null, statementNoteDateTo?: string | null, createdAt: string, updatedAt: string, doctorPatients?: Array<{ __typename?: 'DoctorPatient', id: string, doctorId?: string | null, currentProvider?: boolean | null, otherRelation?: string | null, relation?: DoctorPatientRelationType | null, doctor?: { __typename?: 'Doctor', id: string, firstName?: string | null, lastName?: string | null, createdAt: string, updatedAt: string } | null }> | null, attachments?: Array<{ __typename?: 'Attachment', id: string, key?: string | null, url?: string | null, type: AttachmentType, title?: string | null, typeId: string, createdAt: string, updatedAt: string }> | null, contacts?: Array<{ __typename?: 'Contact', id: string, fax?: string | null, ssn?: string | null, city?: string | null, email?: string | null, pager?: string | null, phone?: string | null, mobile?: string | null, address?: string | null, address2?: string | null, state?: string | null, zipCode?: string | null, country?: string | null, name?: string | null, suffix?: string | null, firstName?: string | null, primaryContact?: boolean | null, middleName?: string | null, lastName?: string | null, serviceCode: ServiceCodes, employerName?: string | null, relationship?: RelationshipType | null, contactType?: ContactType | null, createdAt: string, updatedAt: string }> | null, employer?: { __typename?: 'Employer', id: string, name?: string | null, email?: string | null, phone?: string | null, mobile?: string | null, industry?: string | null, usualOccupation?: string | null, createdAt: string, updatedAt: string } | null, facility?: { __typename?: 'Facility', id: string, name: string, isPrivate?: boolean | null, serviceCode: ServiceCode, updatedAt?: string | null } | null } | null } };

export type UpdatePatientNoteInfoMutationVariables = Exact<{
  updatePatientNoteInfoInputs: UpdatePatientNoteInfoInputs;
}>;


export type UpdatePatientNoteInfoMutation = { __typename?: 'Mutation', updatePatientNoteInfo: { __typename?: 'PatientPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, error?: string | null, message?: string | null } | null, patient?: { __typename?: 'Patient', id: string, patientNote?: string | null, patientNoteOpen?: boolean | null } | null } };

export type UpdatePatientProviderMutationVariables = Exact<{
  updatePatientProvider: UpdatePatientProvider;
}>;


export type UpdatePatientProviderMutation = { __typename?: 'Mutation', updatePatientProvider: { __typename?: 'PatientPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null } };

export type UpdatePatientProviderRelationMutationVariables = Exact<{
  updatePatientProviderRelationInputs: UpdatePatientProviderRelationInputs;
}>;


export type UpdatePatientProviderRelationMutation = { __typename?: 'Mutation', updatePatientProviderRelation: { __typename?: 'PatientDoctorPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, message?: string | null } | null } };

export type GetPatientProvidersQueryVariables = Exact<{
  getPatient: GetPatient;
}>;


export type GetPatientProvidersQuery = { __typename?: 'Query', getPatientProviders: { __typename?: 'PatientProviderPayload', response?: { __typename?: 'ResponsePayload', name?: string | null, error?: string | null, status?: number | null, message?: string | null } | null, providers?: Array<{ __typename?: 'DoctorPatient', id: string, doctorId?: string | null, patientId?: string | null, currentProvider?: boolean | null, otherRelation?: string | null, relation?: DoctorPatientRelationType | null, createdAt: string, updatedAt: string, doctor?: { __typename?: 'Doctor', id: string, firstName?: string | null, lastName?: string | null, email?: string | null, speciality?: Speciality | null, contacts?: Array<{ __typename?: 'Contact', id: string, name?: string | null, city?: string | null, email?: string | null, phone?: string | null, primaryContact?: boolean | null }> | null } | null }> | null } };

export type GetPatientProviderQueryVariables = Exact<{
  patientProviderInputs: PatientProviderInputs;
}>;


export type GetPatientProviderQuery = { __typename?: 'Query', getPatientProvider: { __typename?: 'PatientDoctorPayload', response?: { __typename?: 'ResponsePayload', name?: string | null, error?: string | null, status?: number | null, message?: string | null } | null, provider?: { __typename?: 'DoctorPatient', id: string, doctorId?: string | null, patientId?: string | null, currentProvider?: boolean | null, otherRelation?: string | null, relation?: DoctorPatientRelationType | null, createdAt: string, updatedAt: string, doctor?: { __typename?: 'Doctor', id: string, firstName?: string | null, lastName?: string | null, email?: string | null, speciality?: Speciality | null, contacts?: Array<{ __typename?: 'Contact', id: string, name?: string | null, city?: string | null, email?: string | null, phone?: string | null, primaryContact?: boolean | null }> | null } | null } | null } };

export type GetTokenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTokenQuery = { __typename?: 'Query', getToken: { __typename?: 'BraintreePayload', clientToken: string } };

export type ChargeAfterAppointmentMutationVariables = Exact<{
  paymentInput: PaymentInputsAfterAppointment;
}>;


export type ChargeAfterAppointmentMutation = { __typename?: 'Mutation', chargeAfterAppointment: { __typename?: 'AppointmentPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null, name?: string | null } | null, appointment?: { __typename?: 'Appointment', id: string, billingStatus: BillingStatus } | null } };

export type ChargePaymentMutationVariables = Exact<{
  paymentInput: PaymentInput;
}>;


export type ChargePaymentMutation = { __typename?: 'Mutation', chargePayment: { __typename?: 'TransactionPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null, name?: string | null } | null, transaction: { __typename?: 'Transactions', id: string, status: Transactionstatus } } };

export type AchPaymentMutationVariables = Exact<{
  achPaymentInputs: AchPaymentInputs;
}>;


export type AchPaymentMutation = { __typename?: 'Mutation', achPayment: { __typename?: 'TransactionPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null, name?: string | null } | null, transaction: { __typename?: 'Transactions', id: string, status: Transactionstatus } } };

export type FindAllPermissionsQueryVariables = Exact<{
  permissionInput: PermissionInput;
}>;


export type FindAllPermissionsQuery = { __typename?: 'Query', findAllPermissions: { __typename?: 'PermissionsPayload', pagination?: { __typename?: 'PaginationPayload', totalPages?: number | null } | null, permissions?: Array<{ __typename?: 'Permission', id: string, name?: string | null, moduleType?: string | null, status?: boolean | null } | null> | null } };

export type AssignPermissionToRoleMutationVariables = Exact<{
  rolePermissionItemInput: RolePermissionItemInput;
}>;


export type AssignPermissionToRoleMutation = { __typename?: 'Mutation', assignPermissionToRole: { __typename?: 'PermissionPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type FindAllPracticesQueryVariables = Exact<{
  practiceInput: PracticeInput;
}>;


export type FindAllPracticesQuery = { __typename?: 'Query', findAllPractices: { __typename?: 'PracticesPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null, practices?: Array<{ __typename?: 'Practice', id: string, name: string, phone?: string | null, createdAt?: string | null } | null> | null } };

export type GetPracticeQueryVariables = Exact<{
  getPractice: GetPractice;
}>;


export type GetPracticeQuery = { __typename?: 'Query', getPractice: { __typename?: 'PracticePayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, practice?: { __typename?: 'Practice', id: string, name: string, phone?: string | null, practiceId?: string | null, ein?: string | null, fax?: string | null, upin?: string | null, medicare?: string | null, medicaid?: string | null, champus?: string | null, createdAt?: string | null, updatedAt?: string | null, attachments?: Array<{ __typename?: 'Attachment', id: string, key?: string | null, url?: string | null, type: AttachmentType, title?: string | null, typeId: string, createdAt: string, updatedAt: string }> | null } | null } };

export type CreatePracticeMutationVariables = Exact<{
  createPracticeInput: CreatePracticeInput;
}>;


export type CreatePracticeMutation = { __typename?: 'Mutation', createPractice: { __typename?: 'PracticePayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, practice?: { __typename?: 'Practice', id: string, name: string } | null } };

export type UpdatePracticeMutationVariables = Exact<{
  updatePracticeInput: UpdatePracticeInput;
}>;


export type UpdatePracticeMutation = { __typename?: 'Mutation', updatePractice: { __typename?: 'PracticePayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, practice?: { __typename?: 'Practice', id: string, name: string } | null } };

export type RemovePracticeMutationVariables = Exact<{
  removePractice: RemovePractice;
}>;


export type RemovePracticeMutation = { __typename?: 'Mutation', removePractice: { __typename?: 'PracticePayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type SearchIcdCodesQueryVariables = Exact<{
  searchIcdCodesInput: SearchIcdCodesInput;
}>;


export type SearchIcdCodesQuery = { __typename?: 'Query', searchIcdCodes: { __typename?: 'IcdCodesPayload', icdCodes?: Array<{ __typename?: 'ICDCodesWithSnowMedCode', id: string, code: string, description?: string | null, snoMedCode?: { __typename?: 'SnoMedCodes', id: string, referencedComponentId?: string | null } | null } | null> | null } };

export type FetchIcdCodesQueryVariables = Exact<{
  searchIcdCodesInput: SearchIcdCodesInput;
}>;


export type FetchIcdCodesQuery = { __typename?: 'Query', fetchICDCodes: { __typename?: 'IcdCodesPayload', icdCodes?: Array<{ __typename?: 'ICDCodesWithSnowMedCode', id: string, code: string, description?: string | null } | null> | null } };

export type FindAllReactionsQueryVariables = Exact<{
  reactionInput: ReactionInput;
}>;


export type FindAllReactionsQuery = { __typename?: 'Query', findAllReactions: { __typename?: 'ReactionsPayload', reactions?: Array<{ __typename?: 'Reactions', id: string, name: string } | null> | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, limit?: number | null, totalCount?: number | null, totalPages?: number | null } | null } };

export type FindAllRolesQueryVariables = Exact<{
  roleInput: RoleInput;
}>;


export type FindAllRolesQuery = { __typename?: 'Query', getAllRoles: { __typename?: 'RolesPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, error?: string | null, message?: string | null } | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null, roles?: Array<{ __typename?: 'Role', id: string, role?: string | null, description?: string | null, customRole?: boolean | null, rolePermissions?: Array<{ __typename?: 'RolePermission', id: string, permission?: { __typename?: 'Permission', id: string, name?: string | null } | null }> | null } | null> | null } };

export type GetRoleQueryVariables = Exact<{
  getRole: GetRole;
}>;


export type GetRoleQuery = { __typename?: 'Query', getRole: { __typename?: 'RolePayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, role?: { __typename?: 'Role', id: string, role?: string | null, customRole?: boolean | null, description?: string | null, rolePermissions?: Array<{ __typename?: 'RolePermission', id: string, permission?: { __typename?: 'Permission', id: string, name?: string | null, moduleType?: string | null, status?: boolean | null } | null }> | null } | null } };

export type CreateRoleMutationVariables = Exact<{
  roleItemInput: RoleItemInput;
}>;


export type CreateRoleMutation = { __typename?: 'Mutation', createRole: { __typename?: 'RolePayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, role?: { __typename?: 'Role', id: string, role?: string | null } | null } };

export type UpdateRoleMutationVariables = Exact<{
  updateRoleItemInput: UpdateRoleItemInput;
}>;


export type UpdateRoleMutation = { __typename?: 'Mutation', updateRole: { __typename?: 'RolePayload', response?: { __typename?: 'ResponsePayload', status?: number | null, error?: string | null, message?: string | null } | null, role?: { __typename?: 'Role', id: string, role?: string | null, description?: string | null } | null } };

export type UpdateUserRoleMutationVariables = Exact<{
  updateUserRoleItemInput: UpdateRoleInput;
}>;


export type UpdateUserRoleMutation = { __typename?: 'Mutation', updateUserRole: { __typename?: 'UserPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, error?: string | null, message?: string | null } | null, user?: { __typename?: 'User', id: string, roles?: Array<{ __typename?: 'Role', id: string, role?: string | null, rolePermissions?: Array<{ __typename?: 'RolePermission', id: string, permission?: { __typename?: 'Permission', id: string, name?: string | null } | null }> | null } | null> | null } | null } };

export type RemoveRoleMutationVariables = Exact<{
  removeRole: RemoveRole;
}>;


export type RemoveRoleMutation = { __typename?: 'Mutation', removeRole: { __typename?: 'RolePayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type FindAllPermissionQueryVariables = Exact<{
  permissionInput: PermissionInput;
}>;


export type FindAllPermissionQuery = { __typename?: 'Query', findAllPermissions: { __typename?: 'PermissionsPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, permissions?: Array<{ __typename?: 'Permission', id: string, name?: string | null, moduleType?: string | null, status?: boolean | null } | null> | null } };

export type CreateScheduleMutationVariables = Exact<{
  createScheduleInput: Array<CreateScheduleInput> | CreateScheduleInput;
}>;


export type CreateScheduleMutation = { __typename?: 'Mutation', createSchedule: { __typename?: 'SchedulePayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type UpdateScheduleMutationVariables = Exact<{
  updateScheduleInput: UpdateScheduleInput;
}>;


export type UpdateScheduleMutation = { __typename?: 'Mutation', updateSchedule: { __typename?: 'SchedulePayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type GetScheduleQueryVariables = Exact<{
  getSchedule: GetSchedule;
}>;


export type GetScheduleQuery = { __typename?: 'Query', getSchedule: { __typename?: 'SchedulePayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, schedule?: { __typename?: 'Schedule', id: string, recurringEndDate?: any | null, startAt: string, endAt: string, createdAt: string, updatedAt: string, doctor?: { __typename?: 'Doctor', id: string, firstName?: string | null, lastName?: string | null } | null, scheduleServices?: Array<{ __typename?: 'ScheduleServices', id: string, service?: { __typename?: 'Service', id: string, name: string, duration: string } | null }> | null } | null } };

export type FindAllSchedulesQueryVariables = Exact<{
  scheduleInput: ScheduleInput;
}>;


export type FindAllSchedulesQuery = { __typename?: 'Query', findAllSchedules: { __typename?: 'SchedulesPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, limit?: number | null, totalPages?: number | null } | null, schedules?: Array<{ __typename?: 'Schedule', id: string, startAt: string, endAt: string, recurringEndDate?: any | null, createdAt: string, updatedAt: string, doctor?: { __typename?: 'Doctor', id: string, firstName?: string | null, lastName?: string | null } | null } | null> | null } };

export type GetDoctorScheduleQueryVariables = Exact<{
  getDoctorSchedule: GetDoctorSchedule;
}>;


export type GetDoctorScheduleQuery = { __typename?: 'Query', getDoctorSchedule: { __typename?: 'SchedulesPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, schedules?: Array<{ __typename?: 'Schedule', id: string, startAt: string, endAt: string, createdAt: string, updatedAt: string, scheduleServices?: Array<{ __typename?: 'ScheduleServices', id: string, service?: { __typename?: 'Service', id: string, name: string } | null }> | null } | null> | null } };

export type GetSlotsQueryVariables = Exact<{
  getSlots: GetSlots;
}>;


export type GetSlotsQuery = { __typename?: 'Query', getSlots: { __typename?: 'SlotsPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, slots?: Array<{ __typename?: 'Slots', startTime?: string | null, endTime?: string | null }> | null } };

export type RemoveScheduleMutationVariables = Exact<{
  removeSchedule: RemoveSchedule;
}>;


export type RemoveScheduleMutation = { __typename?: 'Mutation', removeSchedule: { __typename?: 'SchedulePayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type GetFacilityScheduleQueryVariables = Exact<{
  getFacilitySchedule: GetFacilitySchedule;
}>;


export type GetFacilityScheduleQuery = { __typename?: 'Query', getFacilitySchedule: { __typename?: 'SchedulesPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, schedules?: Array<{ __typename?: 'Schedule', id: string, startAt: string, endAt: string, createdAt: string, updatedAt: string, scheduleServices?: Array<{ __typename?: 'ScheduleServices', id: string, service?: { __typename?: 'Service', id: string, name: string } | null }> | null } | null> | null } };

export type FindAllServicesQueryVariables = Exact<{
  serviceInput: ServiceInput;
}>;


export type FindAllServicesQuery = { __typename?: 'Query', findAllServices: { __typename?: 'ServicesPayload', pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalCount?: number | null, totalPages?: number | null } | null, response?: { __typename?: 'ResponsePayload', name?: string | null, error?: string | null, status?: number | null, message?: string | null } | null, services?: Array<{ __typename?: 'Service', id: string, name: string, duration: string, price: string, isActive?: boolean | null, facilityId?: string | null, createdAt?: string | null, updatedAt?: string | null } | null> | null } };

export type GetServiceQueryVariables = Exact<{
  getService: GetService;
}>;


export type GetServiceQuery = { __typename?: 'Query', getService: { __typename?: 'ServicePayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, service?: { __typename?: 'Service', id: string, name: string, duration: string, price: string, isActive?: boolean | null, color?: string | null, facilityId?: string | null, createdAt?: string | null, updatedAt?: string | null, facility?: { __typename?: 'Facility', id: string, name: string, createdAt?: string | null, updatedAt?: string | null } | null } | null } };

export type RemoveServiceMutationVariables = Exact<{
  removeService: RemoveService;
}>;


export type RemoveServiceMutation = { __typename?: 'Mutation', removeService: { __typename?: 'ServicePayload', response?: { __typename?: 'ResponsePayload', name?: string | null, status?: number | null, message?: string | null } | null } };

export type CreateServiceMutationVariables = Exact<{
  createServiceInput: CreateServiceInput;
}>;


export type CreateServiceMutation = { __typename?: 'Mutation', createService: { __typename?: 'ServicePayload', response?: { __typename?: 'ResponsePayload', name?: string | null, status?: number | null, message?: string | null } | null } };

export type UpdateServiceMutationVariables = Exact<{
  updateServiceInput: UpdateServiceInput;
}>;


export type UpdateServiceMutation = { __typename?: 'Mutation', updateService: { __typename?: 'ServicePayload', response?: { __typename?: 'ResponsePayload', name?: string | null, status?: number | null, message?: string | null } | null } };

export type UpdateFacilityTimeZoneMutationVariables = Exact<{
  updateFacilityTimeZoneInput: UpdateFacilityTimeZoneInput;
}>;


export type UpdateFacilityTimeZoneMutation = { __typename?: 'Mutation', updateFacilityTimeZone: { __typename?: 'FacilityPayload', facility?: { __typename?: 'Facility', id: string, timeZone?: string | null } | null, response?: { __typename?: 'ResponsePayload', name?: string | null, status?: number | null, message?: string | null } | null } };

export type FindAllStaffQueryVariables = Exact<{
  staffInput: StaffInput;
}>;


export type FindAllStaffQuery = { __typename?: 'Query', findAllStaff: { __typename?: 'AllStaffPayload', pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null, response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null, allstaff?: Array<{ __typename?: 'Staff', id: string, email: string, firstName: string, lastName: string, username?: string | null, phone?: string | null, user?: { __typename?: 'User', id: string } | null } | null> | null } };

export type GetStaffQueryVariables = Exact<{
  getStaff: GetStaff;
}>;


export type GetStaffQuery = { __typename?: 'Query', getStaff: { __typename?: 'StaffPayload', response?: { __typename?: 'ResponsePayload', name?: string | null, error?: string | null, status?: number | null, message?: string | null } | null, staff?: { __typename?: 'Staff', id: string, dob?: string | null, email: string, phone?: string | null, mobile?: string | null, gender: Gender, lastName: string, username?: string | null, firstName: string, facilityId?: string | null, createdAt: string, updatedAt: string, user?: { __typename?: 'User', roles?: Array<{ __typename?: 'Role', id: string, role?: string | null } | null> | null } | null, facility?: { __typename?: 'Facility', id: string, name: string } | null } | null } };

export type RemoveStaffMutationVariables = Exact<{
  removeStaff: RemoveStaff;
}>;


export type RemoveStaffMutation = { __typename?: 'Mutation', removeStaff: { __typename?: 'StaffPayload', response?: { __typename?: 'ResponsePayload', name?: string | null, status?: number | null, message?: string | null } | null } };

export type UpdateStaffMutationVariables = Exact<{
  updateStaffInput: UpdateStaffInput;
}>;


export type UpdateStaffMutation = { __typename?: 'Mutation', updateStaff: { __typename?: 'StaffPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type CreateStaffMutationVariables = Exact<{
  createStaffInput: CreateStaffInput;
}>;


export type CreateStaffMutation = { __typename?: 'Mutation', createStaff: { __typename?: 'StaffPayload', response?: { __typename?: 'ResponsePayload', error?: string | null, status?: number | null, message?: string | null } | null } };

export type FetchEmergencyAccessUserQueryVariables = Exact<{
  emergencyAccessUsersInput: EmergencyAccessUserInput;
}>;


export type FetchEmergencyAccessUserQuery = { __typename?: 'Query', fetchEmergencyAccessUsers: { __typename?: 'EmergencyAccessUserPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, error?: string | null, message?: string | null } | null, pagination?: { __typename?: 'PaginationPayload', page?: number | null, totalPages?: number | null } | null, emergencyAccessUsers?: Array<{ __typename?: 'User', id: string, email: string, facilityId?: string | null, roles?: Array<{ __typename?: 'Role', role?: string | null, rolePermissions?: Array<{ __typename?: 'RolePermission', permission?: { __typename?: 'Permission', id: string, name?: string | null } | null }> | null } | null> | null }> | null } };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', me: { __typename?: 'UserPayload', response?: { __typename?: 'ResponsePayload', status?: number | null, error?: string | null, message?: string | null } | null, user?: { __typename?: 'User', id: string, userId: string, userType: string, attachments?: Array<{ __typename?: 'Attachment', id: string, key?: string | null, url?: string | null, type: AttachmentType, title?: string | null, typeId: string, createdAt: string, updatedAt: string }> | null } | null } };


export const FetchAllAgreementsDocument = gql`
    query FetchAllAgreements($agreementPaginationInput: AgreementPaginationInput!) {
  fetchAllAgreements(agreementPaginationInput: $agreementPaginationInput) {
    response {
      error
      status
      message
    }
    pagination {
      page
      totalPages
    }
    agreements {
      id
      title
      body
      createdAt
    }
  }
}
    `;

/**
 * __useFetchAllAgreementsQuery__
 *
 * To run a query within a React component, call `useFetchAllAgreementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchAllAgreementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchAllAgreementsQuery({
 *   variables: {
 *      agreementPaginationInput: // value for 'agreementPaginationInput'
 *   },
 * });
 */
export function useFetchAllAgreementsQuery(baseOptions: Apollo.QueryHookOptions<FetchAllAgreementsQuery, FetchAllAgreementsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchAllAgreementsQuery, FetchAllAgreementsQueryVariables>(FetchAllAgreementsDocument, options);
      }
export function useFetchAllAgreementsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchAllAgreementsQuery, FetchAllAgreementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchAllAgreementsQuery, FetchAllAgreementsQueryVariables>(FetchAllAgreementsDocument, options);
        }
export type FetchAllAgreementsQueryHookResult = ReturnType<typeof useFetchAllAgreementsQuery>;
export type FetchAllAgreementsLazyQueryHookResult = ReturnType<typeof useFetchAllAgreementsLazyQuery>;
export type FetchAllAgreementsQueryResult = Apollo.QueryResult<FetchAllAgreementsQuery, FetchAllAgreementsQueryVariables>;
export const FetchAgreementDocument = gql`
    query FetchAgreement($agreementId: String!) {
  fetchAgreement(agreementId: $agreementId) {
    response {
      error
      status
      message
    }
    agreement {
      id
      title
      body
      viewAgreementBeforeAgreeing
      signatureRequired
      createdAt
    }
  }
}
    `;

/**
 * __useFetchAgreementQuery__
 *
 * To run a query within a React component, call `useFetchAgreementQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchAgreementQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchAgreementQuery({
 *   variables: {
 *      agreementId: // value for 'agreementId'
 *   },
 * });
 */
export function useFetchAgreementQuery(baseOptions: Apollo.QueryHookOptions<FetchAgreementQuery, FetchAgreementQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchAgreementQuery, FetchAgreementQueryVariables>(FetchAgreementDocument, options);
      }
export function useFetchAgreementLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchAgreementQuery, FetchAgreementQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchAgreementQuery, FetchAgreementQueryVariables>(FetchAgreementDocument, options);
        }
export type FetchAgreementQueryHookResult = ReturnType<typeof useFetchAgreementQuery>;
export type FetchAgreementLazyQueryHookResult = ReturnType<typeof useFetchAgreementLazyQuery>;
export type FetchAgreementQueryResult = Apollo.QueryResult<FetchAgreementQuery, FetchAgreementQueryVariables>;
export const CreateAgreementDocument = gql`
    mutation CreateAgreement($createAgreementInput: AgreementInput!) {
  createAgreement(createAgreementInput: $createAgreementInput) {
    agreement {
      id
    }
    response {
      error
      status
      message
    }
  }
}
    `;
export type CreateAgreementMutationFn = Apollo.MutationFunction<CreateAgreementMutation, CreateAgreementMutationVariables>;

/**
 * __useCreateAgreementMutation__
 *
 * To run a mutation, you first call `useCreateAgreementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAgreementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAgreementMutation, { data, loading, error }] = useCreateAgreementMutation({
 *   variables: {
 *      createAgreementInput: // value for 'createAgreementInput'
 *   },
 * });
 */
export function useCreateAgreementMutation(baseOptions?: Apollo.MutationHookOptions<CreateAgreementMutation, CreateAgreementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAgreementMutation, CreateAgreementMutationVariables>(CreateAgreementDocument, options);
      }
export type CreateAgreementMutationHookResult = ReturnType<typeof useCreateAgreementMutation>;
export type CreateAgreementMutationResult = Apollo.MutationResult<CreateAgreementMutation>;
export type CreateAgreementMutationOptions = Apollo.BaseMutationOptions<CreateAgreementMutation, CreateAgreementMutationVariables>;
export const UpdateAgreementDocument = gql`
    mutation UpdateAgreement($updateAgreementInput: UpdateAgreementInput!) {
  updateAgreement(updateAgreementInput: $updateAgreementInput) {
    agreement {
      id
    }
    response {
      error
      status
      message
    }
  }
}
    `;
export type UpdateAgreementMutationFn = Apollo.MutationFunction<UpdateAgreementMutation, UpdateAgreementMutationVariables>;

/**
 * __useUpdateAgreementMutation__
 *
 * To run a mutation, you first call `useUpdateAgreementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAgreementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAgreementMutation, { data, loading, error }] = useUpdateAgreementMutation({
 *   variables: {
 *      updateAgreementInput: // value for 'updateAgreementInput'
 *   },
 * });
 */
export function useUpdateAgreementMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAgreementMutation, UpdateAgreementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAgreementMutation, UpdateAgreementMutationVariables>(UpdateAgreementDocument, options);
      }
export type UpdateAgreementMutationHookResult = ReturnType<typeof useUpdateAgreementMutation>;
export type UpdateAgreementMutationResult = Apollo.MutationResult<UpdateAgreementMutation>;
export type UpdateAgreementMutationOptions = Apollo.BaseMutationOptions<UpdateAgreementMutation, UpdateAgreementMutationVariables>;
export const RemoveAgreementDocument = gql`
    mutation RemoveAgreement($agreementId: String!) {
  removeAgreement(agreementId: $agreementId) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type RemoveAgreementMutationFn = Apollo.MutationFunction<RemoveAgreementMutation, RemoveAgreementMutationVariables>;

/**
 * __useRemoveAgreementMutation__
 *
 * To run a mutation, you first call `useRemoveAgreementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveAgreementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeAgreementMutation, { data, loading, error }] = useRemoveAgreementMutation({
 *   variables: {
 *      agreementId: // value for 'agreementId'
 *   },
 * });
 */
export function useRemoveAgreementMutation(baseOptions?: Apollo.MutationHookOptions<RemoveAgreementMutation, RemoveAgreementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveAgreementMutation, RemoveAgreementMutationVariables>(RemoveAgreementDocument, options);
      }
export type RemoveAgreementMutationHookResult = ReturnType<typeof useRemoveAgreementMutation>;
export type RemoveAgreementMutationResult = Apollo.MutationResult<RemoveAgreementMutation>;
export type RemoveAgreementMutationOptions = Apollo.BaseMutationOptions<RemoveAgreementMutation, RemoveAgreementMutationVariables>;
export const FindAllAppointmentsDocument = gql`
    query FindAllAppointments($appointmentInput: AppointmentInput!) {
  findAllAppointments(appointmentInput: $appointmentInput) {
    response {
      error
      status
      message
    }
    pagination {
      page
      totalPages
    }
    appointments {
      id
      status
      scheduleEndDateTime
      scheduleStartDateTime
      token
      reason
      primaryInsurance
      billingStatus
      checkInActiveStep
      appointmentCreateType
      provider {
        id
        firstName
        lastName
      }
      patient {
        id
        firstName
        lastName
      }
      facility {
        id
        name
      }
      appointmentType {
        id
        name
        price
        color
      }
    }
  }
}
    `;

/**
 * __useFindAllAppointmentsQuery__
 *
 * To run a query within a React component, call `useFindAllAppointmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllAppointmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllAppointmentsQuery({
 *   variables: {
 *      appointmentInput: // value for 'appointmentInput'
 *   },
 * });
 */
export function useFindAllAppointmentsQuery(baseOptions: Apollo.QueryHookOptions<FindAllAppointmentsQuery, FindAllAppointmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllAppointmentsQuery, FindAllAppointmentsQueryVariables>(FindAllAppointmentsDocument, options);
      }
export function useFindAllAppointmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllAppointmentsQuery, FindAllAppointmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllAppointmentsQuery, FindAllAppointmentsQueryVariables>(FindAllAppointmentsDocument, options);
        }
export type FindAllAppointmentsQueryHookResult = ReturnType<typeof useFindAllAppointmentsQuery>;
export type FindAllAppointmentsLazyQueryHookResult = ReturnType<typeof useFindAllAppointmentsLazyQuery>;
export type FindAllAppointmentsQueryResult = Apollo.QueryResult<FindAllAppointmentsQuery, FindAllAppointmentsQueryVariables>;
export const GetAppointmentDocument = gql`
    query GetAppointment($getAppointment: GetAppointment!) {
  getAppointment(getAppointment: $getAppointment) {
    response {
      error
      status
      message
    }
    appointment {
      id
      notes
      reason
      token
      status
      patientId
      employment
      paymentType
      autoAccident
      otherAccident
      primaryInsurance
      secondaryInsurance
      scheduleEndDateTime
      scheduleStartDateTime
      createdAt
      updatedAt
      billingStatus
      checkedInAt
      selfCheckIn
      checkInActiveStep
      appointmentCreateType
      appointmentType {
        id
        name
        price
        duration
        serviceType
      }
      provider {
        id
        lastName
        firstName
      }
      patient {
        id
        firstName
        lastName
      }
      facility {
        id
        name
        practiceType
        serviceCode
      }
      invoice {
        invoiceNo
      }
    }
  }
}
    `;

/**
 * __useGetAppointmentQuery__
 *
 * To run a query within a React component, call `useGetAppointmentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppointmentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppointmentQuery({
 *   variables: {
 *      getAppointment: // value for 'getAppointment'
 *   },
 * });
 */
export function useGetAppointmentQuery(baseOptions: Apollo.QueryHookOptions<GetAppointmentQuery, GetAppointmentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAppointmentQuery, GetAppointmentQueryVariables>(GetAppointmentDocument, options);
      }
export function useGetAppointmentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAppointmentQuery, GetAppointmentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAppointmentQuery, GetAppointmentQueryVariables>(GetAppointmentDocument, options);
        }
export type GetAppointmentQueryHookResult = ReturnType<typeof useGetAppointmentQuery>;
export type GetAppointmentLazyQueryHookResult = ReturnType<typeof useGetAppointmentLazyQuery>;
export type GetAppointmentQueryResult = Apollo.QueryResult<GetAppointmentQuery, GetAppointmentQueryVariables>;
export const RemoveAppointmentDocument = gql`
    mutation RemoveAppointment($removeAppointment: RemoveAppointment!) {
  removeAppointment(removeAppointment: $removeAppointment) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type RemoveAppointmentMutationFn = Apollo.MutationFunction<RemoveAppointmentMutation, RemoveAppointmentMutationVariables>;

/**
 * __useRemoveAppointmentMutation__
 *
 * To run a mutation, you first call `useRemoveAppointmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveAppointmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeAppointmentMutation, { data, loading, error }] = useRemoveAppointmentMutation({
 *   variables: {
 *      removeAppointment: // value for 'removeAppointment'
 *   },
 * });
 */
export function useRemoveAppointmentMutation(baseOptions?: Apollo.MutationHookOptions<RemoveAppointmentMutation, RemoveAppointmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveAppointmentMutation, RemoveAppointmentMutationVariables>(RemoveAppointmentDocument, options);
      }
export type RemoveAppointmentMutationHookResult = ReturnType<typeof useRemoveAppointmentMutation>;
export type RemoveAppointmentMutationResult = Apollo.MutationResult<RemoveAppointmentMutation>;
export type RemoveAppointmentMutationOptions = Apollo.BaseMutationOptions<RemoveAppointmentMutation, RemoveAppointmentMutationVariables>;
export const CreateAppointmentDocument = gql`
    mutation CreateAppointment($createAppointmentInput: CreateAppointmentInput!) {
  createAppointment(createAppointmentInput: $createAppointmentInput) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type CreateAppointmentMutationFn = Apollo.MutationFunction<CreateAppointmentMutation, CreateAppointmentMutationVariables>;

/**
 * __useCreateAppointmentMutation__
 *
 * To run a mutation, you first call `useCreateAppointmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAppointmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAppointmentMutation, { data, loading, error }] = useCreateAppointmentMutation({
 *   variables: {
 *      createAppointmentInput: // value for 'createAppointmentInput'
 *   },
 * });
 */
export function useCreateAppointmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateAppointmentMutation, CreateAppointmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAppointmentMutation, CreateAppointmentMutationVariables>(CreateAppointmentDocument, options);
      }
export type CreateAppointmentMutationHookResult = ReturnType<typeof useCreateAppointmentMutation>;
export type CreateAppointmentMutationResult = Apollo.MutationResult<CreateAppointmentMutation>;
export type CreateAppointmentMutationOptions = Apollo.BaseMutationOptions<CreateAppointmentMutation, CreateAppointmentMutationVariables>;
export const UpdateAppointmentDocument = gql`
    mutation UpdateAppointment($updateAppointmentInput: UpdateAppointmentInput!) {
  updateAppointment(updateAppointmentInput: $updateAppointmentInput) {
    response {
      error
      status
      message
    }
    appointment {
      id
      status
    }
  }
}
    `;
export type UpdateAppointmentMutationFn = Apollo.MutationFunction<UpdateAppointmentMutation, UpdateAppointmentMutationVariables>;

/**
 * __useUpdateAppointmentMutation__
 *
 * To run a mutation, you first call `useUpdateAppointmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAppointmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAppointmentMutation, { data, loading, error }] = useUpdateAppointmentMutation({
 *   variables: {
 *      updateAppointmentInput: // value for 'updateAppointmentInput'
 *   },
 * });
 */
export function useUpdateAppointmentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAppointmentMutation, UpdateAppointmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAppointmentMutation, UpdateAppointmentMutationVariables>(UpdateAppointmentDocument, options);
      }
export type UpdateAppointmentMutationHookResult = ReturnType<typeof useUpdateAppointmentMutation>;
export type UpdateAppointmentMutationResult = Apollo.MutationResult<UpdateAppointmentMutation>;
export type UpdateAppointmentMutationOptions = Apollo.BaseMutationOptions<UpdateAppointmentMutation, UpdateAppointmentMutationVariables>;
export const CreateExternalAppointmentDocument = gql`
    mutation CreateExternalAppointment($createExternalAppointmentInput: CreateExternalAppointmentInput!) {
  createExternalAppointment(
    createExternalAppointmentInput: $createExternalAppointmentInput
  ) {
    response {
      error
      status
      message
    }
    appointment {
      id
      token
      providerId
      patientId
      facilityId
      appointmentType {
        id
        name
        price
        duration
      }
    }
  }
}
    `;
export type CreateExternalAppointmentMutationFn = Apollo.MutationFunction<CreateExternalAppointmentMutation, CreateExternalAppointmentMutationVariables>;

/**
 * __useCreateExternalAppointmentMutation__
 *
 * To run a mutation, you first call `useCreateExternalAppointmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateExternalAppointmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createExternalAppointmentMutation, { data, loading, error }] = useCreateExternalAppointmentMutation({
 *   variables: {
 *      createExternalAppointmentInput: // value for 'createExternalAppointmentInput'
 *   },
 * });
 */
export function useCreateExternalAppointmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateExternalAppointmentMutation, CreateExternalAppointmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateExternalAppointmentMutation, CreateExternalAppointmentMutationVariables>(CreateExternalAppointmentDocument, options);
      }
export type CreateExternalAppointmentMutationHookResult = ReturnType<typeof useCreateExternalAppointmentMutation>;
export type CreateExternalAppointmentMutationResult = Apollo.MutationResult<CreateExternalAppointmentMutation>;
export type CreateExternalAppointmentMutationOptions = Apollo.BaseMutationOptions<CreateExternalAppointmentMutation, CreateExternalAppointmentMutationVariables>;
export const CancelAppointmentDocument = gql`
    mutation CancelAppointment($cancelAppointment: CancelAppointment!) {
  cancelAppointment(cancelAppointment: $cancelAppointment) {
    response {
      status
      message
      error
    }
  }
}
    `;
export type CancelAppointmentMutationFn = Apollo.MutationFunction<CancelAppointmentMutation, CancelAppointmentMutationVariables>;

/**
 * __useCancelAppointmentMutation__
 *
 * To run a mutation, you first call `useCancelAppointmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelAppointmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelAppointmentMutation, { data, loading, error }] = useCancelAppointmentMutation({
 *   variables: {
 *      cancelAppointment: // value for 'cancelAppointment'
 *   },
 * });
 */
export function useCancelAppointmentMutation(baseOptions?: Apollo.MutationHookOptions<CancelAppointmentMutation, CancelAppointmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelAppointmentMutation, CancelAppointmentMutationVariables>(CancelAppointmentDocument, options);
      }
export type CancelAppointmentMutationHookResult = ReturnType<typeof useCancelAppointmentMutation>;
export type CancelAppointmentMutationResult = Apollo.MutationResult<CancelAppointmentMutation>;
export type CancelAppointmentMutationOptions = Apollo.BaseMutationOptions<CancelAppointmentMutation, CancelAppointmentMutationVariables>;
export const GetAppointmentsDocument = gql`
    query GetAppointments($getAppointments: GetAppointments!) {
  getAppointments(getAppointments: $getAppointments) {
    response {
      error
      status
      message
    }
    pagination {
      page
      totalPages
      totalCount
    }
    appointments {
      id
      status
      scheduleStartDateTime
      scheduleEndDateTime
      createdAt
      updatedAt
      appointmentType {
        id
        name
        duration
      }
      provider {
        id
        firstName
        lastName
      }
      patient {
        id
        firstName
        lastName
      }
      facility {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetAppointmentsQuery__
 *
 * To run a query within a React component, call `useGetAppointmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppointmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppointmentsQuery({
 *   variables: {
 *      getAppointments: // value for 'getAppointments'
 *   },
 * });
 */
export function useGetAppointmentsQuery(baseOptions: Apollo.QueryHookOptions<GetAppointmentsQuery, GetAppointmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAppointmentsQuery, GetAppointmentsQueryVariables>(GetAppointmentsDocument, options);
      }
export function useGetAppointmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAppointmentsQuery, GetAppointmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAppointmentsQuery, GetAppointmentsQueryVariables>(GetAppointmentsDocument, options);
        }
export type GetAppointmentsQueryHookResult = ReturnType<typeof useGetAppointmentsQuery>;
export type GetAppointmentsLazyQueryHookResult = ReturnType<typeof useGetAppointmentsLazyQuery>;
export type GetAppointmentsQueryResult = Apollo.QueryResult<GetAppointmentsQuery, GetAppointmentsQueryVariables>;
export const UpdateAppointmentStatusDocument = gql`
    mutation UpdateAppointmentStatus($appointmentStatusInput: UpdateAppointmentStatusInput!) {
  updateAppointmentStatus(appointmentStatusInput: $appointmentStatusInput) {
    response {
      error
      status
      message
    }
    appointment {
      id
      status
    }
  }
}
    `;
export type UpdateAppointmentStatusMutationFn = Apollo.MutationFunction<UpdateAppointmentStatusMutation, UpdateAppointmentStatusMutationVariables>;

/**
 * __useUpdateAppointmentStatusMutation__
 *
 * To run a mutation, you first call `useUpdateAppointmentStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAppointmentStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAppointmentStatusMutation, { data, loading, error }] = useUpdateAppointmentStatusMutation({
 *   variables: {
 *      appointmentStatusInput: // value for 'appointmentStatusInput'
 *   },
 * });
 */
export function useUpdateAppointmentStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAppointmentStatusMutation, UpdateAppointmentStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAppointmentStatusMutation, UpdateAppointmentStatusMutationVariables>(UpdateAppointmentStatusDocument, options);
      }
export type UpdateAppointmentStatusMutationHookResult = ReturnType<typeof useUpdateAppointmentStatusMutation>;
export type UpdateAppointmentStatusMutationResult = Apollo.MutationResult<UpdateAppointmentStatusMutation>;
export type UpdateAppointmentStatusMutationOptions = Apollo.BaseMutationOptions<UpdateAppointmentStatusMutation, UpdateAppointmentStatusMutationVariables>;
export const GetPatientNearestAppointmentsDocument = gql`
    query GetPatientNearestAppointments($getPatientAppointmentInput: GetPatientAppointmentInput!) {
  getPatientPastUpcomingAppointment(
    getPatientAppointmentInput: $getPatientAppointmentInput
  ) {
    response {
      status
    }
    appointments {
      pastAppointment {
        id
        scheduleStartDateTime
      }
      upcomingAppointment {
        id
        scheduleStartDateTime
      }
    }
  }
}
    `;

/**
 * __useGetPatientNearestAppointmentsQuery__
 *
 * To run a query within a React component, call `useGetPatientNearestAppointmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPatientNearestAppointmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPatientNearestAppointmentsQuery({
 *   variables: {
 *      getPatientAppointmentInput: // value for 'getPatientAppointmentInput'
 *   },
 * });
 */
export function useGetPatientNearestAppointmentsQuery(baseOptions: Apollo.QueryHookOptions<GetPatientNearestAppointmentsQuery, GetPatientNearestAppointmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPatientNearestAppointmentsQuery, GetPatientNearestAppointmentsQueryVariables>(GetPatientNearestAppointmentsDocument, options);
      }
export function useGetPatientNearestAppointmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPatientNearestAppointmentsQuery, GetPatientNearestAppointmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPatientNearestAppointmentsQuery, GetPatientNearestAppointmentsQueryVariables>(GetPatientNearestAppointmentsDocument, options);
        }
export type GetPatientNearestAppointmentsQueryHookResult = ReturnType<typeof useGetPatientNearestAppointmentsQuery>;
export type GetPatientNearestAppointmentsLazyQueryHookResult = ReturnType<typeof useGetPatientNearestAppointmentsLazyQuery>;
export type GetPatientNearestAppointmentsQueryResult = Apollo.QueryResult<GetPatientNearestAppointmentsQuery, GetPatientNearestAppointmentsQueryVariables>;
export const FindAllUpcomingAppointmentsDocument = gql`
    query FindAllUpcomingAppointments($upComingAppointmentsInput: UpComingAppointmentsInput!) {
  findAllUpcomingAppointments(
    upComingAppointmentsInput: $upComingAppointmentsInput
  ) {
    response {
      status
    }
    appointments {
      id
      status
      scheduleStartDateTime
      scheduleEndDateTime
      appointmentType {
        id
        name
        duration
      }
      provider {
        id
        firstName
        lastName
      }
      patient {
        id
        firstName
        lastName
      }
    }
  }
}
    `;

/**
 * __useFindAllUpcomingAppointmentsQuery__
 *
 * To run a query within a React component, call `useFindAllUpcomingAppointmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllUpcomingAppointmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllUpcomingAppointmentsQuery({
 *   variables: {
 *      upComingAppointmentsInput: // value for 'upComingAppointmentsInput'
 *   },
 * });
 */
export function useFindAllUpcomingAppointmentsQuery(baseOptions: Apollo.QueryHookOptions<FindAllUpcomingAppointmentsQuery, FindAllUpcomingAppointmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllUpcomingAppointmentsQuery, FindAllUpcomingAppointmentsQueryVariables>(FindAllUpcomingAppointmentsDocument, options);
      }
export function useFindAllUpcomingAppointmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllUpcomingAppointmentsQuery, FindAllUpcomingAppointmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllUpcomingAppointmentsQuery, FindAllUpcomingAppointmentsQueryVariables>(FindAllUpcomingAppointmentsDocument, options);
        }
export type FindAllUpcomingAppointmentsQueryHookResult = ReturnType<typeof useFindAllUpcomingAppointmentsQuery>;
export type FindAllUpcomingAppointmentsLazyQueryHookResult = ReturnType<typeof useFindAllUpcomingAppointmentsLazyQuery>;
export type FindAllUpcomingAppointmentsQueryResult = Apollo.QueryResult<FindAllUpcomingAppointmentsQuery, FindAllUpcomingAppointmentsQueryVariables>;
export const GetAttachmentsDocument = gql`
    query GetAttachments($getAttachment: GetAttachment!) {
  getAttachments(getAttachment: $getAttachment) {
    response {
      error
      status
      message
    }
    attachments {
      id
      key
      url
      type
      title
      typeId
      attachmentName
      createdAt
      updatedAt
      attachmentMetadata {
        signedAt
        signedBy
        providerName
        comments
        documentDate
        documentType {
          id
          type
        }
      }
    }
    pagination {
      page
      totalPages
    }
  }
}
    `;

/**
 * __useGetAttachmentsQuery__
 *
 * To run a query within a React component, call `useGetAttachmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttachmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttachmentsQuery({
 *   variables: {
 *      getAttachment: // value for 'getAttachment'
 *   },
 * });
 */
export function useGetAttachmentsQuery(baseOptions: Apollo.QueryHookOptions<GetAttachmentsQuery, GetAttachmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttachmentsQuery, GetAttachmentsQueryVariables>(GetAttachmentsDocument, options);
      }
export function useGetAttachmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttachmentsQuery, GetAttachmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttachmentsQuery, GetAttachmentsQueryVariables>(GetAttachmentsDocument, options);
        }
export type GetAttachmentsQueryHookResult = ReturnType<typeof useGetAttachmentsQuery>;
export type GetAttachmentsLazyQueryHookResult = ReturnType<typeof useGetAttachmentsLazyQuery>;
export type GetAttachmentsQueryResult = Apollo.QueryResult<GetAttachmentsQuery, GetAttachmentsQueryVariables>;
export const UpdateAttachmentDataDocument = gql`
    mutation UpdateAttachmentData($updateAttachmentInput: UpdateAttachmentInput!) {
  updateAttachmentData(updateAttachmentInput: $updateAttachmentInput) {
    response {
      status
      message
    }
    attachment {
      id
      key
      url
      type
      title
      typeId
      attachmentName
      createdAt
      updatedAt
    }
  }
}
    `;
export type UpdateAttachmentDataMutationFn = Apollo.MutationFunction<UpdateAttachmentDataMutation, UpdateAttachmentDataMutationVariables>;

/**
 * __useUpdateAttachmentDataMutation__
 *
 * To run a mutation, you first call `useUpdateAttachmentDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAttachmentDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAttachmentDataMutation, { data, loading, error }] = useUpdateAttachmentDataMutation({
 *   variables: {
 *      updateAttachmentInput: // value for 'updateAttachmentInput'
 *   },
 * });
 */
export function useUpdateAttachmentDataMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAttachmentDataMutation, UpdateAttachmentDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAttachmentDataMutation, UpdateAttachmentDataMutationVariables>(UpdateAttachmentDataDocument, options);
      }
export type UpdateAttachmentDataMutationHookResult = ReturnType<typeof useUpdateAttachmentDataMutation>;
export type UpdateAttachmentDataMutationResult = Apollo.MutationResult<UpdateAttachmentDataMutation>;
export type UpdateAttachmentDataMutationOptions = Apollo.BaseMutationOptions<UpdateAttachmentDataMutation, UpdateAttachmentDataMutationVariables>;
export const CreateAttachmentDataDocument = gql`
    mutation CreateAttachmentData($createAttachmentInput: CreateAttachmentInput!) {
  createAttachmentData(createAttachmentInput: $createAttachmentInput) {
    response {
      name
      status
      message
      error
    }
    attachment {
      id
      url
      key
      type
      typeId
      createdAt
      updatedAt
    }
  }
}
    `;
export type CreateAttachmentDataMutationFn = Apollo.MutationFunction<CreateAttachmentDataMutation, CreateAttachmentDataMutationVariables>;

/**
 * __useCreateAttachmentDataMutation__
 *
 * To run a mutation, you first call `useCreateAttachmentDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAttachmentDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAttachmentDataMutation, { data, loading, error }] = useCreateAttachmentDataMutation({
 *   variables: {
 *      createAttachmentInput: // value for 'createAttachmentInput'
 *   },
 * });
 */
export function useCreateAttachmentDataMutation(baseOptions?: Apollo.MutationHookOptions<CreateAttachmentDataMutation, CreateAttachmentDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAttachmentDataMutation, CreateAttachmentDataMutationVariables>(CreateAttachmentDataDocument, options);
      }
export type CreateAttachmentDataMutationHookResult = ReturnType<typeof useCreateAttachmentDataMutation>;
export type CreateAttachmentDataMutationResult = Apollo.MutationResult<CreateAttachmentDataMutation>;
export type CreateAttachmentDataMutationOptions = Apollo.BaseMutationOptions<CreateAttachmentDataMutation, CreateAttachmentDataMutationVariables>;
export const RemoveAttachmentDataDocument = gql`
    mutation RemoveAttachmentData($removeAttachment: RemoveAttachment!) {
  removeAttachmentData(removeAttachment: $removeAttachment) {
    response {
      status
      message
    }
  }
}
    `;
export type RemoveAttachmentDataMutationFn = Apollo.MutationFunction<RemoveAttachmentDataMutation, RemoveAttachmentDataMutationVariables>;

/**
 * __useRemoveAttachmentDataMutation__
 *
 * To run a mutation, you first call `useRemoveAttachmentDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveAttachmentDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeAttachmentDataMutation, { data, loading, error }] = useRemoveAttachmentDataMutation({
 *   variables: {
 *      removeAttachment: // value for 'removeAttachment'
 *   },
 * });
 */
export function useRemoveAttachmentDataMutation(baseOptions?: Apollo.MutationHookOptions<RemoveAttachmentDataMutation, RemoveAttachmentDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveAttachmentDataMutation, RemoveAttachmentDataMutationVariables>(RemoveAttachmentDataDocument, options);
      }
export type RemoveAttachmentDataMutationHookResult = ReturnType<typeof useRemoveAttachmentDataMutation>;
export type RemoveAttachmentDataMutationResult = Apollo.MutationResult<RemoveAttachmentDataMutation>;
export type RemoveAttachmentDataMutationOptions = Apollo.BaseMutationOptions<RemoveAttachmentDataMutation, RemoveAttachmentDataMutationVariables>;
export const RemoveAttachmentMediaDocument = gql`
    mutation RemoveAttachmentMedia($id: String!) {
  removeAttachmentMedia(id: $id) {
    response {
      status
      message
    }
  }
}
    `;
export type RemoveAttachmentMediaMutationFn = Apollo.MutationFunction<RemoveAttachmentMediaMutation, RemoveAttachmentMediaMutationVariables>;

/**
 * __useRemoveAttachmentMediaMutation__
 *
 * To run a mutation, you first call `useRemoveAttachmentMediaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveAttachmentMediaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeAttachmentMediaMutation, { data, loading, error }] = useRemoveAttachmentMediaMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveAttachmentMediaMutation(baseOptions?: Apollo.MutationHookOptions<RemoveAttachmentMediaMutation, RemoveAttachmentMediaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveAttachmentMediaMutation, RemoveAttachmentMediaMutationVariables>(RemoveAttachmentMediaDocument, options);
      }
export type RemoveAttachmentMediaMutationHookResult = ReturnType<typeof useRemoveAttachmentMediaMutation>;
export type RemoveAttachmentMediaMutationResult = Apollo.MutationResult<RemoveAttachmentMediaMutation>;
export type RemoveAttachmentMediaMutationOptions = Apollo.BaseMutationOptions<RemoveAttachmentMediaMutation, RemoveAttachmentMediaMutationVariables>;
export const GetAttachmentDocument = gql`
    query GetAttachment($getMedia: GetMedia!) {
  getAttachment(getMedia: $getMedia) {
    preSignedUrl
    response {
      message
    }
  }
}
    `;

/**
 * __useGetAttachmentQuery__
 *
 * To run a query within a React component, call `useGetAttachmentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttachmentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttachmentQuery({
 *   variables: {
 *      getMedia: // value for 'getMedia'
 *   },
 * });
 */
export function useGetAttachmentQuery(baseOptions: Apollo.QueryHookOptions<GetAttachmentQuery, GetAttachmentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttachmentQuery, GetAttachmentQueryVariables>(GetAttachmentDocument, options);
      }
export function useGetAttachmentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttachmentQuery, GetAttachmentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttachmentQuery, GetAttachmentQueryVariables>(GetAttachmentDocument, options);
        }
export type GetAttachmentQueryHookResult = ReturnType<typeof useGetAttachmentQuery>;
export type GetAttachmentLazyQueryHookResult = ReturnType<typeof useGetAttachmentLazyQuery>;
export type GetAttachmentQueryResult = Apollo.QueryResult<GetAttachmentQuery, GetAttachmentQueryVariables>;
export const GetAttachmentsByLabOrderDocument = gql`
    query GetAttachmentsByLabOrder($getAttachmentsByLabOrder: GetAttachmentsByLabOrder!) {
  getAttachmentsByLabOrder(getAttachmentsByLabOrder: $getAttachmentsByLabOrder) {
    attachments {
      id
      title
      attachmentName
      url
      type
      attachmentMetadata {
        comments
        labOrderNum
      }
      attachmentMetadataId
    }
  }
}
    `;

/**
 * __useGetAttachmentsByLabOrderQuery__
 *
 * To run a query within a React component, call `useGetAttachmentsByLabOrderQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttachmentsByLabOrderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttachmentsByLabOrderQuery({
 *   variables: {
 *      getAttachmentsByLabOrder: // value for 'getAttachmentsByLabOrder'
 *   },
 * });
 */
export function useGetAttachmentsByLabOrderQuery(baseOptions: Apollo.QueryHookOptions<GetAttachmentsByLabOrderQuery, GetAttachmentsByLabOrderQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttachmentsByLabOrderQuery, GetAttachmentsByLabOrderQueryVariables>(GetAttachmentsByLabOrderDocument, options);
      }
export function useGetAttachmentsByLabOrderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttachmentsByLabOrderQuery, GetAttachmentsByLabOrderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttachmentsByLabOrderQuery, GetAttachmentsByLabOrderQueryVariables>(GetAttachmentsByLabOrderDocument, options);
        }
export type GetAttachmentsByLabOrderQueryHookResult = ReturnType<typeof useGetAttachmentsByLabOrderQuery>;
export type GetAttachmentsByLabOrderLazyQueryHookResult = ReturnType<typeof useGetAttachmentsByLabOrderLazyQuery>;
export type GetAttachmentsByLabOrderQueryResult = Apollo.QueryResult<GetAttachmentsByLabOrderQuery, GetAttachmentsByLabOrderQueryVariables>;
export const GetAttachmentsByPolicyIdDocument = gql`
    query GetAttachmentsByPolicyId($getAttachmentsByPolicyId: GetAttachmentsByPolicyId!) {
  getAttachmentsByPolicyId(getAttachmentsByPolicyId: $getAttachmentsByPolicyId) {
    attachments {
      id
      title
      attachmentName
      url
      type
      attachmentMetadata {
        comments
        policyId
      }
      attachmentMetadataId
    }
  }
}
    `;

/**
 * __useGetAttachmentsByPolicyIdQuery__
 *
 * To run a query within a React component, call `useGetAttachmentsByPolicyIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttachmentsByPolicyIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttachmentsByPolicyIdQuery({
 *   variables: {
 *      getAttachmentsByPolicyId: // value for 'getAttachmentsByPolicyId'
 *   },
 * });
 */
export function useGetAttachmentsByPolicyIdQuery(baseOptions: Apollo.QueryHookOptions<GetAttachmentsByPolicyIdQuery, GetAttachmentsByPolicyIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttachmentsByPolicyIdQuery, GetAttachmentsByPolicyIdQueryVariables>(GetAttachmentsByPolicyIdDocument, options);
      }
export function useGetAttachmentsByPolicyIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttachmentsByPolicyIdQuery, GetAttachmentsByPolicyIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttachmentsByPolicyIdQuery, GetAttachmentsByPolicyIdQueryVariables>(GetAttachmentsByPolicyIdDocument, options);
        }
export type GetAttachmentsByPolicyIdQueryHookResult = ReturnType<typeof useGetAttachmentsByPolicyIdQuery>;
export type GetAttachmentsByPolicyIdLazyQueryHookResult = ReturnType<typeof useGetAttachmentsByPolicyIdLazyQuery>;
export type GetAttachmentsByPolicyIdQueryResult = Apollo.QueryResult<GetAttachmentsByPolicyIdQuery, GetAttachmentsByPolicyIdQueryVariables>;
export const GetAttachmentsByAgreementIdDocument = gql`
    query GetAttachmentsByAgreementId($getAttachmentsByAgreementId: GetAttachmentsByAgreementId!) {
  getAttachmentsByAgreementId(
    getAttachmentsByAgreementId: $getAttachmentsByAgreementId
  ) {
    attachmentsWithPreSignedUrl {
      id
      title
      attachmentName
      url
      preSignedUrl
      type
      attachmentMetadata {
        comments
        agreementId
      }
    }
  }
}
    `;

/**
 * __useGetAttachmentsByAgreementIdQuery__
 *
 * To run a query within a React component, call `useGetAttachmentsByAgreementIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttachmentsByAgreementIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttachmentsByAgreementIdQuery({
 *   variables: {
 *      getAttachmentsByAgreementId: // value for 'getAttachmentsByAgreementId'
 *   },
 * });
 */
export function useGetAttachmentsByAgreementIdQuery(baseOptions: Apollo.QueryHookOptions<GetAttachmentsByAgreementIdQuery, GetAttachmentsByAgreementIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttachmentsByAgreementIdQuery, GetAttachmentsByAgreementIdQueryVariables>(GetAttachmentsByAgreementIdDocument, options);
      }
export function useGetAttachmentsByAgreementIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttachmentsByAgreementIdQuery, GetAttachmentsByAgreementIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttachmentsByAgreementIdQuery, GetAttachmentsByAgreementIdQueryVariables>(GetAttachmentsByAgreementIdDocument, options);
        }
export type GetAttachmentsByAgreementIdQueryHookResult = ReturnType<typeof useGetAttachmentsByAgreementIdQuery>;
export type GetAttachmentsByAgreementIdLazyQueryHookResult = ReturnType<typeof useGetAttachmentsByAgreementIdLazyQuery>;
export type GetAttachmentsByAgreementIdQueryResult = Apollo.QueryResult<GetAttachmentsByAgreementIdQuery, GetAttachmentsByAgreementIdQueryVariables>;
export const FetchDocumentTypeByNameDocument = gql`
    query FetchDocumentTypeByName($name: String!) {
  fetchDocumentTypeByName(name: $name) {
    documentType {
      type
      id
    }
  }
}
    `;

/**
 * __useFetchDocumentTypeByNameQuery__
 *
 * To run a query within a React component, call `useFetchDocumentTypeByNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchDocumentTypeByNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchDocumentTypeByNameQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useFetchDocumentTypeByNameQuery(baseOptions: Apollo.QueryHookOptions<FetchDocumentTypeByNameQuery, FetchDocumentTypeByNameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchDocumentTypeByNameQuery, FetchDocumentTypeByNameQueryVariables>(FetchDocumentTypeByNameDocument, options);
      }
export function useFetchDocumentTypeByNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchDocumentTypeByNameQuery, FetchDocumentTypeByNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchDocumentTypeByNameQuery, FetchDocumentTypeByNameQueryVariables>(FetchDocumentTypeByNameDocument, options);
        }
export type FetchDocumentTypeByNameQueryHookResult = ReturnType<typeof useFetchDocumentTypeByNameQuery>;
export type FetchDocumentTypeByNameLazyQueryHookResult = ReturnType<typeof useFetchDocumentTypeByNameLazyQuery>;
export type FetchDocumentTypeByNameQueryResult = Apollo.QueryResult<FetchDocumentTypeByNameQuery, FetchDocumentTypeByNameQueryVariables>;
export const FetchDocumentTypesDocument = gql`
    query FetchDocumentTypes($documentTypeInput: DocumentTypeInput!) {
  fetchDocumentTypes(documentTypeInput: $documentTypeInput) {
    documentTypes {
      type
      id
      practiceId
    }
    response {
      error
      status
      message
    }
    pagination {
      page
      totalPages
    }
  }
}
    `;

/**
 * __useFetchDocumentTypesQuery__
 *
 * To run a query within a React component, call `useFetchDocumentTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchDocumentTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchDocumentTypesQuery({
 *   variables: {
 *      documentTypeInput: // value for 'documentTypeInput'
 *   },
 * });
 */
export function useFetchDocumentTypesQuery(baseOptions: Apollo.QueryHookOptions<FetchDocumentTypesQuery, FetchDocumentTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchDocumentTypesQuery, FetchDocumentTypesQueryVariables>(FetchDocumentTypesDocument, options);
      }
export function useFetchDocumentTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchDocumentTypesQuery, FetchDocumentTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchDocumentTypesQuery, FetchDocumentTypesQueryVariables>(FetchDocumentTypesDocument, options);
        }
export type FetchDocumentTypesQueryHookResult = ReturnType<typeof useFetchDocumentTypesQuery>;
export type FetchDocumentTypesLazyQueryHookResult = ReturnType<typeof useFetchDocumentTypesLazyQuery>;
export type FetchDocumentTypesQueryResult = Apollo.QueryResult<FetchDocumentTypesQuery, FetchDocumentTypesQueryVariables>;
export const LoginDocument = gql`
    mutation Login($loginUser: LoginUserInput!) {
  login(loginUser: $loginUser) {
    access_token
    isTwoFactorEnabled
    userId
    access_2fa_token
    response {
      status
      message
    }
    roles {
      id
      role
      createdAt
      updatedAt
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      loginUser: // value for 'loginUser'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const GetLoggedInUserDocument = gql`
    query GetLoggedInUser {
  me {
    response {
      status
      error
      message
    }
    user {
      id
      email
      phone
      isTwoFactorEnabled
      token
      userId
      userType
      phone
      autoLogoutTime
      roles {
        id
        role
        rolePermissions {
          permission {
            id
            name
          }
        }
      }
      facility {
        id
        name
        practiceId
        practice {
          id
          name
        }
      }
      attachments {
        id
        key
        url
        type
        title
        typeId
        createdAt
        updatedAt
      }
    }
  }
}
    `;

/**
 * __useGetLoggedInUserQuery__
 *
 * To run a query within a React component, call `useGetLoggedInUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLoggedInUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLoggedInUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLoggedInUserQuery(baseOptions?: Apollo.QueryHookOptions<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>(GetLoggedInUserDocument, options);
      }
export function useGetLoggedInUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>(GetLoggedInUserDocument, options);
        }
export type GetLoggedInUserQueryHookResult = ReturnType<typeof useGetLoggedInUserQuery>;
export type GetLoggedInUserLazyQueryHookResult = ReturnType<typeof useGetLoggedInUserLazyQuery>;
export type GetLoggedInUserQueryResult = Apollo.QueryResult<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>;
export const ForgetPasswordDocument = gql`
    mutation ForgetPassword($forgotPasswordInput: ForgotPasswordInput!) {
  forgotPassword(forgotPassword: $forgotPasswordInput) {
    response {
      name
      message
      status
    }
  }
}
    `;
export type ForgetPasswordMutationFn = Apollo.MutationFunction<ForgetPasswordMutation, ForgetPasswordMutationVariables>;

/**
 * __useForgetPasswordMutation__
 *
 * To run a mutation, you first call `useForgetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgetPasswordMutation, { data, loading, error }] = useForgetPasswordMutation({
 *   variables: {
 *      forgotPasswordInput: // value for 'forgotPasswordInput'
 *   },
 * });
 */
export function useForgetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgetPasswordMutation, ForgetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgetPasswordMutation, ForgetPasswordMutationVariables>(ForgetPasswordDocument, options);
      }
export type ForgetPasswordMutationHookResult = ReturnType<typeof useForgetPasswordMutation>;
export type ForgetPasswordMutationResult = Apollo.MutationResult<ForgetPasswordMutation>;
export type ForgetPasswordMutationOptions = Apollo.BaseMutationOptions<ForgetPasswordMutation, ForgetPasswordMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($resetPassword: ResetPasswordInput!) {
  resetPassword(resetPassword: $resetPassword) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      resetPassword: // value for 'resetPassword'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const UpdatePasswordDocument = gql`
    mutation updatePassword($updatePasswordInput: UpdatePasswordInput!) {
  updatePassword(updatePasswordInput: $updatePasswordInput) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type UpdatePasswordMutationFn = Apollo.MutationFunction<UpdatePasswordMutation, UpdatePasswordMutationVariables>;

/**
 * __useUpdatePasswordMutation__
 *
 * To run a mutation, you first call `useUpdatePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePasswordMutation, { data, loading, error }] = useUpdatePasswordMutation({
 *   variables: {
 *      updatePasswordInput: // value for 'updatePasswordInput'
 *   },
 * });
 */
export function useUpdatePasswordMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePasswordMutation, UpdatePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePasswordMutation, UpdatePasswordMutationVariables>(UpdatePasswordDocument, options);
      }
export type UpdatePasswordMutationHookResult = ReturnType<typeof useUpdatePasswordMutation>;
export type UpdatePasswordMutationResult = Apollo.MutationResult<UpdatePasswordMutation>;
export type UpdatePasswordMutationOptions = Apollo.BaseMutationOptions<UpdatePasswordMutation, UpdatePasswordMutationVariables>;
export const GetDoctorUserDocument = gql`
    query GetDoctorUser($getDoctor: GetDoctor!) {
  getDoctor(getDoctor: $getDoctor) {
    doctor {
      __typename
      id
      firstName
      lastName
      contacts {
        id
        email
        phone
        address
        zipCode
        city
        state
        country
        primaryContact
      }
      attachments {
        id
        key
        url
        type
        title
        typeId
        createdAt
        updatedAt
      }
    }
    response {
      status
    }
  }
}
    `;

/**
 * __useGetDoctorUserQuery__
 *
 * To run a query within a React component, call `useGetDoctorUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDoctorUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDoctorUserQuery({
 *   variables: {
 *      getDoctor: // value for 'getDoctor'
 *   },
 * });
 */
export function useGetDoctorUserQuery(baseOptions: Apollo.QueryHookOptions<GetDoctorUserQuery, GetDoctorUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDoctorUserQuery, GetDoctorUserQueryVariables>(GetDoctorUserDocument, options);
      }
export function useGetDoctorUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDoctorUserQuery, GetDoctorUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDoctorUserQuery, GetDoctorUserQueryVariables>(GetDoctorUserDocument, options);
        }
export type GetDoctorUserQueryHookResult = ReturnType<typeof useGetDoctorUserQuery>;
export type GetDoctorUserLazyQueryHookResult = ReturnType<typeof useGetDoctorUserLazyQuery>;
export type GetDoctorUserQueryResult = Apollo.QueryResult<GetDoctorUserQuery, GetDoctorUserQueryVariables>;
export const GetStaffUserDocument = gql`
    query GetStaffUser($getStaff: GetStaff!) {
  getStaff(getStaff: $getStaff) {
    response {
      status
    }
    staff {
      __typename
      id
      email
      lastName
      firstName
      phone
      practiceId
      attachments {
        id
        key
        url
        type
        title
        typeId
        createdAt
        updatedAt
      }
    }
  }
}
    `;

/**
 * __useGetStaffUserQuery__
 *
 * To run a query within a React component, call `useGetStaffUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStaffUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStaffUserQuery({
 *   variables: {
 *      getStaff: // value for 'getStaff'
 *   },
 * });
 */
export function useGetStaffUserQuery(baseOptions: Apollo.QueryHookOptions<GetStaffUserQuery, GetStaffUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStaffUserQuery, GetStaffUserQueryVariables>(GetStaffUserDocument, options);
      }
export function useGetStaffUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStaffUserQuery, GetStaffUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStaffUserQuery, GetStaffUserQueryVariables>(GetStaffUserDocument, options);
        }
export type GetStaffUserQueryHookResult = ReturnType<typeof useGetStaffUserQuery>;
export type GetStaffUserLazyQueryHookResult = ReturnType<typeof useGetStaffUserLazyQuery>;
export type GetStaffUserQueryResult = Apollo.QueryResult<GetStaffUserQuery, GetStaffUserQueryVariables>;
export const Update2FactorAuthDocument = gql`
    mutation update2FactorAuth($twoFactorInput: TwoFactorInput!) {
  update2FactorAuth(twoFactorInput: $twoFactorInput) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type Update2FactorAuthMutationFn = Apollo.MutationFunction<Update2FactorAuthMutation, Update2FactorAuthMutationVariables>;

/**
 * __useUpdate2FactorAuthMutation__
 *
 * To run a mutation, you first call `useUpdate2FactorAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdate2FactorAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [update2FactorAuthMutation, { data, loading, error }] = useUpdate2FactorAuthMutation({
 *   variables: {
 *      twoFactorInput: // value for 'twoFactorInput'
 *   },
 * });
 */
export function useUpdate2FactorAuthMutation(baseOptions?: Apollo.MutationHookOptions<Update2FactorAuthMutation, Update2FactorAuthMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Update2FactorAuthMutation, Update2FactorAuthMutationVariables>(Update2FactorAuthDocument, options);
      }
export type Update2FactorAuthMutationHookResult = ReturnType<typeof useUpdate2FactorAuthMutation>;
export type Update2FactorAuthMutationResult = Apollo.MutationResult<Update2FactorAuthMutation>;
export type Update2FactorAuthMutationOptions = Apollo.BaseMutationOptions<Update2FactorAuthMutation, Update2FactorAuthMutationVariables>;
export const ResentOtpDocument = gql`
    mutation resentOTP {
  resentOTP {
    response {
      error
      status
      message
    }
  }
}
    `;
export type ResentOtpMutationFn = Apollo.MutationFunction<ResentOtpMutation, ResentOtpMutationVariables>;

/**
 * __useResentOtpMutation__
 *
 * To run a mutation, you first call `useResentOtpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResentOtpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resentOtpMutation, { data, loading, error }] = useResentOtpMutation({
 *   variables: {
 *   },
 * });
 */
export function useResentOtpMutation(baseOptions?: Apollo.MutationHookOptions<ResentOtpMutation, ResentOtpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResentOtpMutation, ResentOtpMutationVariables>(ResentOtpDocument, options);
      }
export type ResentOtpMutationHookResult = ReturnType<typeof useResentOtpMutation>;
export type ResentOtpMutationResult = Apollo.MutationResult<ResentOtpMutation>;
export type ResentOtpMutationOptions = Apollo.BaseMutationOptions<ResentOtpMutation, ResentOtpMutationVariables>;
export const VerifyOtpDocument = gql`
    mutation verifyOTP($verifyCodeInput: VerifyCodeInput!) {
  verifyOTP(verifyCodeInput: $verifyCodeInput) {
    access_token
    response {
      error
      status
      message
    }
  }
}
    `;
export type VerifyOtpMutationFn = Apollo.MutationFunction<VerifyOtpMutation, VerifyOtpMutationVariables>;

/**
 * __useVerifyOtpMutation__
 *
 * To run a mutation, you first call `useVerifyOtpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyOtpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyOtpMutation, { data, loading, error }] = useVerifyOtpMutation({
 *   variables: {
 *      verifyCodeInput: // value for 'verifyCodeInput'
 *   },
 * });
 */
export function useVerifyOtpMutation(baseOptions?: Apollo.MutationHookOptions<VerifyOtpMutation, VerifyOtpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyOtpMutation, VerifyOtpMutationVariables>(VerifyOtpDocument, options);
      }
export type VerifyOtpMutationHookResult = ReturnType<typeof useVerifyOtpMutation>;
export type VerifyOtpMutationResult = Apollo.MutationResult<VerifyOtpMutation>;
export type VerifyOtpMutationOptions = Apollo.BaseMutationOptions<VerifyOtpMutation, VerifyOtpMutationVariables>;
export const UpdateAutoLogoutTimeDocument = gql`
    mutation updateAutoLogoutTime($userInfoInput: UserInfoInput!) {
  updateAutoLogoutTime(userInfoInput: $userInfoInput) {
    response {
      status
      error
      message
    }
    user {
      id
      autoLogoutTime
    }
  }
}
    `;
export type UpdateAutoLogoutTimeMutationFn = Apollo.MutationFunction<UpdateAutoLogoutTimeMutation, UpdateAutoLogoutTimeMutationVariables>;

/**
 * __useUpdateAutoLogoutTimeMutation__
 *
 * To run a mutation, you first call `useUpdateAutoLogoutTimeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAutoLogoutTimeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAutoLogoutTimeMutation, { data, loading, error }] = useUpdateAutoLogoutTimeMutation({
 *   variables: {
 *      userInfoInput: // value for 'userInfoInput'
 *   },
 * });
 */
export function useUpdateAutoLogoutTimeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAutoLogoutTimeMutation, UpdateAutoLogoutTimeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAutoLogoutTimeMutation, UpdateAutoLogoutTimeMutationVariables>(UpdateAutoLogoutTimeDocument, options);
      }
export type UpdateAutoLogoutTimeMutationHookResult = ReturnType<typeof useUpdateAutoLogoutTimeMutation>;
export type UpdateAutoLogoutTimeMutationResult = Apollo.MutationResult<UpdateAutoLogoutTimeMutation>;
export type UpdateAutoLogoutTimeMutationOptions = Apollo.BaseMutationOptions<UpdateAutoLogoutTimeMutation, UpdateAutoLogoutTimeMutationVariables>;
export const CreateBillingDocument = gql`
    mutation CreateBilling($createBillingInput: BillingInput!) {
  createBilling(createBillingInput: $createBillingInput) {
    response {
      status
      message
    }
    billing {
      id
    }
  }
}
    `;
export type CreateBillingMutationFn = Apollo.MutationFunction<CreateBillingMutation, CreateBillingMutationVariables>;

/**
 * __useCreateBillingMutation__
 *
 * To run a mutation, you first call `useCreateBillingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBillingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBillingMutation, { data, loading, error }] = useCreateBillingMutation({
 *   variables: {
 *      createBillingInput: // value for 'createBillingInput'
 *   },
 * });
 */
export function useCreateBillingMutation(baseOptions?: Apollo.MutationHookOptions<CreateBillingMutation, CreateBillingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBillingMutation, CreateBillingMutationVariables>(CreateBillingDocument, options);
      }
export type CreateBillingMutationHookResult = ReturnType<typeof useCreateBillingMutation>;
export type CreateBillingMutationResult = Apollo.MutationResult<CreateBillingMutation>;
export type CreateBillingMutationOptions = Apollo.BaseMutationOptions<CreateBillingMutation, CreateBillingMutationVariables>;
export const FetchBillingDetailsByAppointmentIdDocument = gql`
    query FetchBillingDetailsByAppointmentId($appointmentId: String!) {
  fetchBillingDetailsByAppointmentId(appointmentId: $appointmentId) {
    response {
      status
      message
    }
    billing {
      id
      patientPaymentType
      patientBillingStatus
      onsetDateType
      onsetDate
      otherDateType
      employment
      autoAccident
      otherAccident
      otherDate
      amount
      codes {
        id
        code
        description
        price
        codeType
      }
    }
  }
}
    `;

/**
 * __useFetchBillingDetailsByAppointmentIdQuery__
 *
 * To run a query within a React component, call `useFetchBillingDetailsByAppointmentIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchBillingDetailsByAppointmentIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchBillingDetailsByAppointmentIdQuery({
 *   variables: {
 *      appointmentId: // value for 'appointmentId'
 *   },
 * });
 */
export function useFetchBillingDetailsByAppointmentIdQuery(baseOptions: Apollo.QueryHookOptions<FetchBillingDetailsByAppointmentIdQuery, FetchBillingDetailsByAppointmentIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchBillingDetailsByAppointmentIdQuery, FetchBillingDetailsByAppointmentIdQueryVariables>(FetchBillingDetailsByAppointmentIdDocument, options);
      }
export function useFetchBillingDetailsByAppointmentIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchBillingDetailsByAppointmentIdQuery, FetchBillingDetailsByAppointmentIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchBillingDetailsByAppointmentIdQuery, FetchBillingDetailsByAppointmentIdQueryVariables>(FetchBillingDetailsByAppointmentIdDocument, options);
        }
export type FetchBillingDetailsByAppointmentIdQueryHookResult = ReturnType<typeof useFetchBillingDetailsByAppointmentIdQuery>;
export type FetchBillingDetailsByAppointmentIdLazyQueryHookResult = ReturnType<typeof useFetchBillingDetailsByAppointmentIdLazyQuery>;
export type FetchBillingDetailsByAppointmentIdQueryResult = Apollo.QueryResult<FetchBillingDetailsByAppointmentIdQuery, FetchBillingDetailsByAppointmentIdQueryVariables>;
export const FindAllPatientAllergiesDocument = gql`
    query FindAllPatientAllergies($patientAllergyInput: PatientAllergyInput!) {
  findAllPatientAllergies(patientAllergyInput: $patientAllergyInput) {
    response {
      status
      message
    }
    patientAllergies {
      id
      allergySeverity
      allergyOnset
      allergyStartDate
      comments
      isActive
      allergy {
        __typename
        id
        name
        allergyType
      }
      reactions {
        id
        name
      }
    }
    pagination {
      totalPages
      page
    }
  }
}
    `;

/**
 * __useFindAllPatientAllergiesQuery__
 *
 * To run a query within a React component, call `useFindAllPatientAllergiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllPatientAllergiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllPatientAllergiesQuery({
 *   variables: {
 *      patientAllergyInput: // value for 'patientAllergyInput'
 *   },
 * });
 */
export function useFindAllPatientAllergiesQuery(baseOptions: Apollo.QueryHookOptions<FindAllPatientAllergiesQuery, FindAllPatientAllergiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllPatientAllergiesQuery, FindAllPatientAllergiesQueryVariables>(FindAllPatientAllergiesDocument, options);
      }
export function useFindAllPatientAllergiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllPatientAllergiesQuery, FindAllPatientAllergiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllPatientAllergiesQuery, FindAllPatientAllergiesQueryVariables>(FindAllPatientAllergiesDocument, options);
        }
export type FindAllPatientAllergiesQueryHookResult = ReturnType<typeof useFindAllPatientAllergiesQuery>;
export type FindAllPatientAllergiesLazyQueryHookResult = ReturnType<typeof useFindAllPatientAllergiesLazyQuery>;
export type FindAllPatientAllergiesQueryResult = Apollo.QueryResult<FindAllPatientAllergiesQuery, FindAllPatientAllergiesQueryVariables>;
export const GetPatientAllergyDocument = gql`
    query GetPatientAllergy($getPatientAllergy: GetPatientAllergy!) {
  getPatientAllergy(getPatientAllergy: $getPatientAllergy) {
    response {
      status
      message
    }
    patientAllergy {
      id
      allergySeverity
      allergyOnset
      allergyStartDate
      comments
      isActive
      allergy {
        id
        name
      }
      reactions {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetPatientAllergyQuery__
 *
 * To run a query within a React component, call `useGetPatientAllergyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPatientAllergyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPatientAllergyQuery({
 *   variables: {
 *      getPatientAllergy: // value for 'getPatientAllergy'
 *   },
 * });
 */
export function useGetPatientAllergyQuery(baseOptions: Apollo.QueryHookOptions<GetPatientAllergyQuery, GetPatientAllergyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPatientAllergyQuery, GetPatientAllergyQueryVariables>(GetPatientAllergyDocument, options);
      }
export function useGetPatientAllergyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPatientAllergyQuery, GetPatientAllergyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPatientAllergyQuery, GetPatientAllergyQueryVariables>(GetPatientAllergyDocument, options);
        }
export type GetPatientAllergyQueryHookResult = ReturnType<typeof useGetPatientAllergyQuery>;
export type GetPatientAllergyLazyQueryHookResult = ReturnType<typeof useGetPatientAllergyLazyQuery>;
export type GetPatientAllergyQueryResult = Apollo.QueryResult<GetPatientAllergyQuery, GetPatientAllergyQueryVariables>;
export const AddPatientAllergyDocument = gql`
    mutation AddPatientAllergy($createPatientAllergyInput: CreatePatientAllergyInput!) {
  addPatientAllergy(createPatientAllergyInput: $createPatientAllergyInput) {
    response {
      status
      message
    }
  }
}
    `;
export type AddPatientAllergyMutationFn = Apollo.MutationFunction<AddPatientAllergyMutation, AddPatientAllergyMutationVariables>;

/**
 * __useAddPatientAllergyMutation__
 *
 * To run a mutation, you first call `useAddPatientAllergyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPatientAllergyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPatientAllergyMutation, { data, loading, error }] = useAddPatientAllergyMutation({
 *   variables: {
 *      createPatientAllergyInput: // value for 'createPatientAllergyInput'
 *   },
 * });
 */
export function useAddPatientAllergyMutation(baseOptions?: Apollo.MutationHookOptions<AddPatientAllergyMutation, AddPatientAllergyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddPatientAllergyMutation, AddPatientAllergyMutationVariables>(AddPatientAllergyDocument, options);
      }
export type AddPatientAllergyMutationHookResult = ReturnType<typeof useAddPatientAllergyMutation>;
export type AddPatientAllergyMutationResult = Apollo.MutationResult<AddPatientAllergyMutation>;
export type AddPatientAllergyMutationOptions = Apollo.BaseMutationOptions<AddPatientAllergyMutation, AddPatientAllergyMutationVariables>;
export const UpdatePatientAllergyDocument = gql`
    mutation UpdatePatientAllergy($updateAllergyInput: UpdateAllergyInput!) {
  updatePatientAllergy(updateAllergyInput: $updateAllergyInput) {
    response {
      status
      message
    }
  }
}
    `;
export type UpdatePatientAllergyMutationFn = Apollo.MutationFunction<UpdatePatientAllergyMutation, UpdatePatientAllergyMutationVariables>;

/**
 * __useUpdatePatientAllergyMutation__
 *
 * To run a mutation, you first call `useUpdatePatientAllergyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePatientAllergyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePatientAllergyMutation, { data, loading, error }] = useUpdatePatientAllergyMutation({
 *   variables: {
 *      updateAllergyInput: // value for 'updateAllergyInput'
 *   },
 * });
 */
export function useUpdatePatientAllergyMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePatientAllergyMutation, UpdatePatientAllergyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePatientAllergyMutation, UpdatePatientAllergyMutationVariables>(UpdatePatientAllergyDocument, options);
      }
export type UpdatePatientAllergyMutationHookResult = ReturnType<typeof useUpdatePatientAllergyMutation>;
export type UpdatePatientAllergyMutationResult = Apollo.MutationResult<UpdatePatientAllergyMutation>;
export type UpdatePatientAllergyMutationOptions = Apollo.BaseMutationOptions<UpdatePatientAllergyMutation, UpdatePatientAllergyMutationVariables>;
export const RemovePatientAllergyDocument = gql`
    mutation RemovePatientAllergy($removePatientAllergy: RemovePatientAllergy!) {
  removePatientAllergy(removePatientAllergy: $removePatientAllergy) {
    response {
      status
      message
    }
  }
}
    `;
export type RemovePatientAllergyMutationFn = Apollo.MutationFunction<RemovePatientAllergyMutation, RemovePatientAllergyMutationVariables>;

/**
 * __useRemovePatientAllergyMutation__
 *
 * To run a mutation, you first call `useRemovePatientAllergyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePatientAllergyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePatientAllergyMutation, { data, loading, error }] = useRemovePatientAllergyMutation({
 *   variables: {
 *      removePatientAllergy: // value for 'removePatientAllergy'
 *   },
 * });
 */
export function useRemovePatientAllergyMutation(baseOptions?: Apollo.MutationHookOptions<RemovePatientAllergyMutation, RemovePatientAllergyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemovePatientAllergyMutation, RemovePatientAllergyMutationVariables>(RemovePatientAllergyDocument, options);
      }
export type RemovePatientAllergyMutationHookResult = ReturnType<typeof useRemovePatientAllergyMutation>;
export type RemovePatientAllergyMutationResult = Apollo.MutationResult<RemovePatientAllergyMutation>;
export type RemovePatientAllergyMutationOptions = Apollo.BaseMutationOptions<RemovePatientAllergyMutation, RemovePatientAllergyMutationVariables>;
export const FindAllAllergiesDocument = gql`
    query FindAllAllergies($allergyInput: AllergyInput!) {
  findAllAllergies(allergyInput: $allergyInput) {
    response {
      status
      message
    }
    allergies {
      id
      name
    }
  }
}
    `;

/**
 * __useFindAllAllergiesQuery__
 *
 * To run a query within a React component, call `useFindAllAllergiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllAllergiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllAllergiesQuery({
 *   variables: {
 *      allergyInput: // value for 'allergyInput'
 *   },
 * });
 */
export function useFindAllAllergiesQuery(baseOptions: Apollo.QueryHookOptions<FindAllAllergiesQuery, FindAllAllergiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllAllergiesQuery, FindAllAllergiesQueryVariables>(FindAllAllergiesDocument, options);
      }
export function useFindAllAllergiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllAllergiesQuery, FindAllAllergiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllAllergiesQuery, FindAllAllergiesQueryVariables>(FindAllAllergiesDocument, options);
        }
export type FindAllAllergiesQueryHookResult = ReturnType<typeof useFindAllAllergiesQuery>;
export type FindAllAllergiesLazyQueryHookResult = ReturnType<typeof useFindAllAllergiesLazyQuery>;
export type FindAllAllergiesQueryResult = Apollo.QueryResult<FindAllAllergiesQuery, FindAllAllergiesQueryVariables>;
export const FindAllPatientProblemsDocument = gql`
    query FindAllPatientProblems($patientProblemInput: PatientProblemInput!) {
  findAllPatientProblem(patientProblemInput: $patientProblemInput) {
    response {
      status
      message
    }
    pagination {
      totalPages
      page
    }
    patientProblems {
      id
      problemType
      problemSeverity
      problemStartDate
      note
      ICDCode {
        __typename
        id
        code
        description
      }
      snowMedCode {
        id
        referencedComponentId
      }
    }
  }
}
    `;

/**
 * __useFindAllPatientProblemsQuery__
 *
 * To run a query within a React component, call `useFindAllPatientProblemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllPatientProblemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllPatientProblemsQuery({
 *   variables: {
 *      patientProblemInput: // value for 'patientProblemInput'
 *   },
 * });
 */
export function useFindAllPatientProblemsQuery(baseOptions: Apollo.QueryHookOptions<FindAllPatientProblemsQuery, FindAllPatientProblemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllPatientProblemsQuery, FindAllPatientProblemsQueryVariables>(FindAllPatientProblemsDocument, options);
      }
export function useFindAllPatientProblemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllPatientProblemsQuery, FindAllPatientProblemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllPatientProblemsQuery, FindAllPatientProblemsQueryVariables>(FindAllPatientProblemsDocument, options);
        }
export type FindAllPatientProblemsQueryHookResult = ReturnType<typeof useFindAllPatientProblemsQuery>;
export type FindAllPatientProblemsLazyQueryHookResult = ReturnType<typeof useFindAllPatientProblemsLazyQuery>;
export type FindAllPatientProblemsQueryResult = Apollo.QueryResult<FindAllPatientProblemsQuery, FindAllPatientProblemsQueryVariables>;
export const GetPatientProblemDocument = gql`
    query GetPatientProblem($getPatientProblem: GetPatientProblem!) {
  getPatientProblem(getPatientProblem: $getPatientProblem) {
    response {
      status
      message
    }
    patientProblem {
      id
      problemType
      problemSeverity
      problemStartDate
      note
      snowMedCode {
        id
        referencedComponentId
      }
      appointment {
        id
        appointmentType {
          id
          serviceType
        }
      }
    }
  }
}
    `;

/**
 * __useGetPatientProblemQuery__
 *
 * To run a query within a React component, call `useGetPatientProblemQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPatientProblemQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPatientProblemQuery({
 *   variables: {
 *      getPatientProblem: // value for 'getPatientProblem'
 *   },
 * });
 */
export function useGetPatientProblemQuery(baseOptions: Apollo.QueryHookOptions<GetPatientProblemQuery, GetPatientProblemQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPatientProblemQuery, GetPatientProblemQueryVariables>(GetPatientProblemDocument, options);
      }
export function useGetPatientProblemLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPatientProblemQuery, GetPatientProblemQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPatientProblemQuery, GetPatientProblemQueryVariables>(GetPatientProblemDocument, options);
        }
export type GetPatientProblemQueryHookResult = ReturnType<typeof useGetPatientProblemQuery>;
export type GetPatientProblemLazyQueryHookResult = ReturnType<typeof useGetPatientProblemLazyQuery>;
export type GetPatientProblemQueryResult = Apollo.QueryResult<GetPatientProblemQuery, GetPatientProblemQueryVariables>;
export const AddPatientProblemDocument = gql`
    mutation AddPatientProblem($createProblemInput: CreateProblemInput!) {
  addPatientProblem(createProblemInput: $createProblemInput) {
    response {
      status
      message
    }
  }
}
    `;
export type AddPatientProblemMutationFn = Apollo.MutationFunction<AddPatientProblemMutation, AddPatientProblemMutationVariables>;

/**
 * __useAddPatientProblemMutation__
 *
 * To run a mutation, you first call `useAddPatientProblemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPatientProblemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPatientProblemMutation, { data, loading, error }] = useAddPatientProblemMutation({
 *   variables: {
 *      createProblemInput: // value for 'createProblemInput'
 *   },
 * });
 */
export function useAddPatientProblemMutation(baseOptions?: Apollo.MutationHookOptions<AddPatientProblemMutation, AddPatientProblemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddPatientProblemMutation, AddPatientProblemMutationVariables>(AddPatientProblemDocument, options);
      }
export type AddPatientProblemMutationHookResult = ReturnType<typeof useAddPatientProblemMutation>;
export type AddPatientProblemMutationResult = Apollo.MutationResult<AddPatientProblemMutation>;
export type AddPatientProblemMutationOptions = Apollo.BaseMutationOptions<AddPatientProblemMutation, AddPatientProblemMutationVariables>;
export const UpdatePatientProblemDocument = gql`
    mutation UpdatePatientProblem($updateProblemInput: UpdateProblemInput!) {
  updatePatientProblem(updateProblemInput: $updateProblemInput) {
    response {
      status
      message
    }
  }
}
    `;
export type UpdatePatientProblemMutationFn = Apollo.MutationFunction<UpdatePatientProblemMutation, UpdatePatientProblemMutationVariables>;

/**
 * __useUpdatePatientProblemMutation__
 *
 * To run a mutation, you first call `useUpdatePatientProblemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePatientProblemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePatientProblemMutation, { data, loading, error }] = useUpdatePatientProblemMutation({
 *   variables: {
 *      updateProblemInput: // value for 'updateProblemInput'
 *   },
 * });
 */
export function useUpdatePatientProblemMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePatientProblemMutation, UpdatePatientProblemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePatientProblemMutation, UpdatePatientProblemMutationVariables>(UpdatePatientProblemDocument, options);
      }
export type UpdatePatientProblemMutationHookResult = ReturnType<typeof useUpdatePatientProblemMutation>;
export type UpdatePatientProblemMutationResult = Apollo.MutationResult<UpdatePatientProblemMutation>;
export type UpdatePatientProblemMutationOptions = Apollo.BaseMutationOptions<UpdatePatientProblemMutation, UpdatePatientProblemMutationVariables>;
export const RemovePatientProblemDocument = gql`
    mutation RemovePatientProblem($removeProblem: RemoveProblem!) {
  removePatientProblem(removeProblem: $removeProblem) {
    response {
      status
      message
    }
  }
}
    `;
export type RemovePatientProblemMutationFn = Apollo.MutationFunction<RemovePatientProblemMutation, RemovePatientProblemMutationVariables>;

/**
 * __useRemovePatientProblemMutation__
 *
 * To run a mutation, you first call `useRemovePatientProblemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePatientProblemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePatientProblemMutation, { data, loading, error }] = useRemovePatientProblemMutation({
 *   variables: {
 *      removeProblem: // value for 'removeProblem'
 *   },
 * });
 */
export function useRemovePatientProblemMutation(baseOptions?: Apollo.MutationHookOptions<RemovePatientProblemMutation, RemovePatientProblemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemovePatientProblemMutation, RemovePatientProblemMutationVariables>(RemovePatientProblemDocument, options);
      }
export type RemovePatientProblemMutationHookResult = ReturnType<typeof useRemovePatientProblemMutation>;
export type RemovePatientProblemMutationResult = Apollo.MutationResult<RemovePatientProblemMutation>;
export type RemovePatientProblemMutationOptions = Apollo.BaseMutationOptions<RemovePatientProblemMutation, RemovePatientProblemMutationVariables>;
export const SearchSnoMedCodesDocument = gql`
    query SearchSnoMedCodes($searchSnoMedCodesInput: SearchSnoMedCodesInput!) {
  searchSnoMedCodeByIcdCodes(searchSnoMedCodesInput: $searchSnoMedCodesInput) {
    response {
      status
      message
    }
    snoMedCodes {
      id
      __typename
      referencedComponentId
    }
  }
}
    `;

/**
 * __useSearchSnoMedCodesQuery__
 *
 * To run a query within a React component, call `useSearchSnoMedCodesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchSnoMedCodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchSnoMedCodesQuery({
 *   variables: {
 *      searchSnoMedCodesInput: // value for 'searchSnoMedCodesInput'
 *   },
 * });
 */
export function useSearchSnoMedCodesQuery(baseOptions: Apollo.QueryHookOptions<SearchSnoMedCodesQuery, SearchSnoMedCodesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchSnoMedCodesQuery, SearchSnoMedCodesQueryVariables>(SearchSnoMedCodesDocument, options);
      }
export function useSearchSnoMedCodesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchSnoMedCodesQuery, SearchSnoMedCodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchSnoMedCodesQuery, SearchSnoMedCodesQueryVariables>(SearchSnoMedCodesDocument, options);
        }
export type SearchSnoMedCodesQueryHookResult = ReturnType<typeof useSearchSnoMedCodesQuery>;
export type SearchSnoMedCodesLazyQueryHookResult = ReturnType<typeof useSearchSnoMedCodesLazyQuery>;
export type SearchSnoMedCodesQueryResult = Apollo.QueryResult<SearchSnoMedCodesQuery, SearchSnoMedCodesQueryVariables>;
export const GetPatientVitalDocument = gql`
    query getPatientVital($getPatientVital: GetPatientVital!) {
  getPatientVital(getPatientVital: $getPatientVital) {
    response {
      name
      error
      status
      message
    }
    patientVital {
      id
      unitType
      weightUnit
      headCircumference
      temperatureUnitType
      smokingStatus
      patientTemperature
      diastolicBloodPressure
      systolicBloodPressure
      respiratoryRate
      oxygenSaturation
      PatientHeight
      PatientWeight
      PatientBMI
      PainRange
      patientHeadCircumference
      vitalCreationDate
      patientId
      appointmentId
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useGetPatientVitalQuery__
 *
 * To run a query within a React component, call `useGetPatientVitalQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPatientVitalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPatientVitalQuery({
 *   variables: {
 *      getPatientVital: // value for 'getPatientVital'
 *   },
 * });
 */
export function useGetPatientVitalQuery(baseOptions: Apollo.QueryHookOptions<GetPatientVitalQuery, GetPatientVitalQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPatientVitalQuery, GetPatientVitalQueryVariables>(GetPatientVitalDocument, options);
      }
export function useGetPatientVitalLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPatientVitalQuery, GetPatientVitalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPatientVitalQuery, GetPatientVitalQueryVariables>(GetPatientVitalDocument, options);
        }
export type GetPatientVitalQueryHookResult = ReturnType<typeof useGetPatientVitalQuery>;
export type GetPatientVitalLazyQueryHookResult = ReturnType<typeof useGetPatientVitalLazyQuery>;
export type GetPatientVitalQueryResult = Apollo.QueryResult<GetPatientVitalQuery, GetPatientVitalQueryVariables>;
export const FindAllPatientVitalsDocument = gql`
    query findAllPatientVitals($patientVitalInput: PatientVitalInput!) {
  findAllPatientVitals(patientVitalInput: $patientVitalInput) {
    response {
      name
      error
      status
      message
    }
    pagination {
      totalPages
      page
    }
    patientVitals {
      id
      unitType
      weightUnit
      headCircumference
      temperatureUnitType
      smokingStatus
      patientTemperature
      diastolicBloodPressure
      systolicBloodPressure
      respiratoryRate
      oxygenSaturation
      PatientHeight
      PatientWeight
      PatientBMI
      PainRange
      patientHeadCircumference
      vitalCreationDate
      patientId
      appointmentId
      pulseRate
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useFindAllPatientVitalsQuery__
 *
 * To run a query within a React component, call `useFindAllPatientVitalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllPatientVitalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllPatientVitalsQuery({
 *   variables: {
 *      patientVitalInput: // value for 'patientVitalInput'
 *   },
 * });
 */
export function useFindAllPatientVitalsQuery(baseOptions: Apollo.QueryHookOptions<FindAllPatientVitalsQuery, FindAllPatientVitalsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllPatientVitalsQuery, FindAllPatientVitalsQueryVariables>(FindAllPatientVitalsDocument, options);
      }
export function useFindAllPatientVitalsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllPatientVitalsQuery, FindAllPatientVitalsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllPatientVitalsQuery, FindAllPatientVitalsQueryVariables>(FindAllPatientVitalsDocument, options);
        }
export type FindAllPatientVitalsQueryHookResult = ReturnType<typeof useFindAllPatientVitalsQuery>;
export type FindAllPatientVitalsLazyQueryHookResult = ReturnType<typeof useFindAllPatientVitalsLazyQuery>;
export type FindAllPatientVitalsQueryResult = Apollo.QueryResult<FindAllPatientVitalsQuery, FindAllPatientVitalsQueryVariables>;
export const AddPatientVitalDocument = gql`
    mutation addPatientVital($createVitalInput: CreateVitalInput!) {
  addPatientVital(createVitalInput: $createVitalInput) {
    response {
      name
      error
      status
      message
    }
    patientVital {
      id
    }
  }
}
    `;
export type AddPatientVitalMutationFn = Apollo.MutationFunction<AddPatientVitalMutation, AddPatientVitalMutationVariables>;

/**
 * __useAddPatientVitalMutation__
 *
 * To run a mutation, you first call `useAddPatientVitalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPatientVitalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPatientVitalMutation, { data, loading, error }] = useAddPatientVitalMutation({
 *   variables: {
 *      createVitalInput: // value for 'createVitalInput'
 *   },
 * });
 */
export function useAddPatientVitalMutation(baseOptions?: Apollo.MutationHookOptions<AddPatientVitalMutation, AddPatientVitalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddPatientVitalMutation, AddPatientVitalMutationVariables>(AddPatientVitalDocument, options);
      }
export type AddPatientVitalMutationHookResult = ReturnType<typeof useAddPatientVitalMutation>;
export type AddPatientVitalMutationResult = Apollo.MutationResult<AddPatientVitalMutation>;
export type AddPatientVitalMutationOptions = Apollo.BaseMutationOptions<AddPatientVitalMutation, AddPatientVitalMutationVariables>;
export const UpdatePatientVitalDocument = gql`
    mutation updatePatientVital($updateVitalInput: UpdateVitalInput!) {
  updatePatientVital(updateVitalInput: $updateVitalInput) {
    response {
      name
      error
      status
      message
    }
    patientVital {
      id
      unitType
      weightUnit
      headCircumference
      temperatureUnitType
      smokingStatus
      patientTemperature
      diastolicBloodPressure
      systolicBloodPressure
      respiratoryRate
      oxygenSaturation
      PatientHeight
      PatientWeight
      PatientBMI
      PainRange
      patientHeadCircumference
      vitalCreationDate
      patientId
      appointmentId
      pulseRate
      createdAt
      updatedAt
    }
  }
}
    `;
export type UpdatePatientVitalMutationFn = Apollo.MutationFunction<UpdatePatientVitalMutation, UpdatePatientVitalMutationVariables>;

/**
 * __useUpdatePatientVitalMutation__
 *
 * To run a mutation, you first call `useUpdatePatientVitalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePatientVitalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePatientVitalMutation, { data, loading, error }] = useUpdatePatientVitalMutation({
 *   variables: {
 *      updateVitalInput: // value for 'updateVitalInput'
 *   },
 * });
 */
export function useUpdatePatientVitalMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePatientVitalMutation, UpdatePatientVitalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePatientVitalMutation, UpdatePatientVitalMutationVariables>(UpdatePatientVitalDocument, options);
      }
export type UpdatePatientVitalMutationHookResult = ReturnType<typeof useUpdatePatientVitalMutation>;
export type UpdatePatientVitalMutationResult = Apollo.MutationResult<UpdatePatientVitalMutation>;
export type UpdatePatientVitalMutationOptions = Apollo.BaseMutationOptions<UpdatePatientVitalMutation, UpdatePatientVitalMutationVariables>;
export const FindAllRoleListDocument = gql`
    query FindAllRoleList($roleInput: RoleInput!) {
  getAllRoles(roleInput: $roleInput) {
    pagination {
      totalPages
    }
    roles {
      id
      role
      description
    }
  }
}
    `;

/**
 * __useFindAllRoleListQuery__
 *
 * To run a query within a React component, call `useFindAllRoleListQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllRoleListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllRoleListQuery({
 *   variables: {
 *      roleInput: // value for 'roleInput'
 *   },
 * });
 */
export function useFindAllRoleListQuery(baseOptions: Apollo.QueryHookOptions<FindAllRoleListQuery, FindAllRoleListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllRoleListQuery, FindAllRoleListQueryVariables>(FindAllRoleListDocument, options);
      }
export function useFindAllRoleListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllRoleListQuery, FindAllRoleListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllRoleListQuery, FindAllRoleListQueryVariables>(FindAllRoleListDocument, options);
        }
export type FindAllRoleListQueryHookResult = ReturnType<typeof useFindAllRoleListQuery>;
export type FindAllRoleListLazyQueryHookResult = ReturnType<typeof useFindAllRoleListLazyQuery>;
export type FindAllRoleListQueryResult = Apollo.QueryResult<FindAllRoleListQuery, FindAllRoleListQueryVariables>;
export const FindAllPracticeListDocument = gql`
    query FindAllPracticeList($practiceInput: PracticeInput!) {
  findAllPractices(practiceInput: $practiceInput) {
    pagination {
      totalPages
    }
    practices {
      id
      name
    }
  }
}
    `;

/**
 * __useFindAllPracticeListQuery__
 *
 * To run a query within a React component, call `useFindAllPracticeListQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllPracticeListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllPracticeListQuery({
 *   variables: {
 *      practiceInput: // value for 'practiceInput'
 *   },
 * });
 */
export function useFindAllPracticeListQuery(baseOptions: Apollo.QueryHookOptions<FindAllPracticeListQuery, FindAllPracticeListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllPracticeListQuery, FindAllPracticeListQueryVariables>(FindAllPracticeListDocument, options);
      }
export function useFindAllPracticeListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllPracticeListQuery, FindAllPracticeListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllPracticeListQuery, FindAllPracticeListQueryVariables>(FindAllPracticeListDocument, options);
        }
export type FindAllPracticeListQueryHookResult = ReturnType<typeof useFindAllPracticeListQuery>;
export type FindAllPracticeListLazyQueryHookResult = ReturnType<typeof useFindAllPracticeListLazyQuery>;
export type FindAllPracticeListQueryResult = Apollo.QueryResult<FindAllPracticeListQuery, FindAllPracticeListQueryVariables>;
export const FindAllFacilityListDocument = gql`
    query FindAllFacilityList($facilityInput: FacilityInput!) {
  findAllFacility(facilityInput: $facilityInput) {
    facilities {
      id
      name
      practiceId
    }
    pagination {
      totalPages
    }
  }
}
    `;

/**
 * __useFindAllFacilityListQuery__
 *
 * To run a query within a React component, call `useFindAllFacilityListQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllFacilityListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllFacilityListQuery({
 *   variables: {
 *      facilityInput: // value for 'facilityInput'
 *   },
 * });
 */
export function useFindAllFacilityListQuery(baseOptions: Apollo.QueryHookOptions<FindAllFacilityListQuery, FindAllFacilityListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllFacilityListQuery, FindAllFacilityListQueryVariables>(FindAllFacilityListDocument, options);
      }
export function useFindAllFacilityListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllFacilityListQuery, FindAllFacilityListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllFacilityListQuery, FindAllFacilityListQueryVariables>(FindAllFacilityListDocument, options);
        }
export type FindAllFacilityListQueryHookResult = ReturnType<typeof useFindAllFacilityListQuery>;
export type FindAllFacilityListLazyQueryHookResult = ReturnType<typeof useFindAllFacilityListLazyQuery>;
export type FindAllFacilityListQueryResult = Apollo.QueryResult<FindAllFacilityListQuery, FindAllFacilityListQueryVariables>;
export const FindAllDoctorListDocument = gql`
    query FindAllDoctorList($doctorInput: DoctorInput!) {
  findAllDoctor(doctorInput: $doctorInput) {
    doctors {
      id
      lastName
      firstName
    }
    pagination {
      totalPages
    }
  }
}
    `;

/**
 * __useFindAllDoctorListQuery__
 *
 * To run a query within a React component, call `useFindAllDoctorListQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllDoctorListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllDoctorListQuery({
 *   variables: {
 *      doctorInput: // value for 'doctorInput'
 *   },
 * });
 */
export function useFindAllDoctorListQuery(baseOptions: Apollo.QueryHookOptions<FindAllDoctorListQuery, FindAllDoctorListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllDoctorListQuery, FindAllDoctorListQueryVariables>(FindAllDoctorListDocument, options);
      }
export function useFindAllDoctorListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllDoctorListQuery, FindAllDoctorListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllDoctorListQuery, FindAllDoctorListQueryVariables>(FindAllDoctorListDocument, options);
        }
export type FindAllDoctorListQueryHookResult = ReturnType<typeof useFindAllDoctorListQuery>;
export type FindAllDoctorListLazyQueryHookResult = ReturnType<typeof useFindAllDoctorListLazyQuery>;
export type FindAllDoctorListQueryResult = Apollo.QueryResult<FindAllDoctorListQuery, FindAllDoctorListQueryVariables>;
export const FetchAllPatientListDocument = gql`
    query FetchAllPatientList($patientInput: PatientInput!) {
  fetchAllPatients(patientInput: $patientInput) {
    pagination {
      totalPages
    }
    patients {
      id
      lastName
      firstName
    }
  }
}
    `;

/**
 * __useFetchAllPatientListQuery__
 *
 * To run a query within a React component, call `useFetchAllPatientListQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchAllPatientListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchAllPatientListQuery({
 *   variables: {
 *      patientInput: // value for 'patientInput'
 *   },
 * });
 */
export function useFetchAllPatientListQuery(baseOptions: Apollo.QueryHookOptions<FetchAllPatientListQuery, FetchAllPatientListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchAllPatientListQuery, FetchAllPatientListQueryVariables>(FetchAllPatientListDocument, options);
      }
export function useFetchAllPatientListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchAllPatientListQuery, FetchAllPatientListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchAllPatientListQuery, FetchAllPatientListQueryVariables>(FetchAllPatientListDocument, options);
        }
export type FetchAllPatientListQueryHookResult = ReturnType<typeof useFetchAllPatientListQuery>;
export type FetchAllPatientListLazyQueryHookResult = ReturnType<typeof useFetchAllPatientListLazyQuery>;
export type FetchAllPatientListQueryResult = Apollo.QueryResult<FetchAllPatientListQuery, FetchAllPatientListQueryVariables>;
export const FindAllPatientListDocument = gql`
    query FindAllPatientList($patientInput: PatientInput!) {
  findAllPatient(patientInput: $patientInput) {
    pagination {
      totalPages
    }
    patients {
      id
      lastName
      firstName
    }
  }
}
    `;

/**
 * __useFindAllPatientListQuery__
 *
 * To run a query within a React component, call `useFindAllPatientListQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllPatientListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllPatientListQuery({
 *   variables: {
 *      patientInput: // value for 'patientInput'
 *   },
 * });
 */
export function useFindAllPatientListQuery(baseOptions: Apollo.QueryHookOptions<FindAllPatientListQuery, FindAllPatientListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllPatientListQuery, FindAllPatientListQueryVariables>(FindAllPatientListDocument, options);
      }
export function useFindAllPatientListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllPatientListQuery, FindAllPatientListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllPatientListQuery, FindAllPatientListQueryVariables>(FindAllPatientListDocument, options);
        }
export type FindAllPatientListQueryHookResult = ReturnType<typeof useFindAllPatientListQuery>;
export type FindAllPatientListLazyQueryHookResult = ReturnType<typeof useFindAllPatientListLazyQuery>;
export type FindAllPatientListQueryResult = Apollo.QueryResult<FindAllPatientListQuery, FindAllPatientListQueryVariables>;
export const FindAllServiceListDocument = gql`
    query FindAllServiceList($serviceInput: ServiceInput!) {
  findAllServices(serviceInput: $serviceInput) {
    pagination {
      totalPages
    }
    services {
      id
      name
      duration
    }
  }
}
    `;

/**
 * __useFindAllServiceListQuery__
 *
 * To run a query within a React component, call `useFindAllServiceListQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllServiceListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllServiceListQuery({
 *   variables: {
 *      serviceInput: // value for 'serviceInput'
 *   },
 * });
 */
export function useFindAllServiceListQuery(baseOptions: Apollo.QueryHookOptions<FindAllServiceListQuery, FindAllServiceListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllServiceListQuery, FindAllServiceListQueryVariables>(FindAllServiceListDocument, options);
      }
export function useFindAllServiceListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllServiceListQuery, FindAllServiceListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllServiceListQuery, FindAllServiceListQueryVariables>(FindAllServiceListDocument, options);
        }
export type FindAllServiceListQueryHookResult = ReturnType<typeof useFindAllServiceListQuery>;
export type FindAllServiceListLazyQueryHookResult = ReturnType<typeof useFindAllServiceListLazyQuery>;
export type FindAllServiceListQueryResult = Apollo.QueryResult<FindAllServiceListQuery, FindAllServiceListQueryVariables>;
export const FindAllDoctorPatientDocument = gql`
    query FindAllDoctorPatient($doctorPatientsInput: DoctorPatientsInput!) {
  findAllDoctorPatients(doctorPatientsInput: $doctorPatientsInput) {
    pagination {
      totalPages
    }
    doctorPatients {
      patient {
        id
        lastName
        firstName
        dob
        profileAttachment
      }
    }
  }
}
    `;

/**
 * __useFindAllDoctorPatientQuery__
 *
 * To run a query within a React component, call `useFindAllDoctorPatientQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllDoctorPatientQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllDoctorPatientQuery({
 *   variables: {
 *      doctorPatientsInput: // value for 'doctorPatientsInput'
 *   },
 * });
 */
export function useFindAllDoctorPatientQuery(baseOptions: Apollo.QueryHookOptions<FindAllDoctorPatientQuery, FindAllDoctorPatientQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllDoctorPatientQuery, FindAllDoctorPatientQueryVariables>(FindAllDoctorPatientDocument, options);
      }
export function useFindAllDoctorPatientLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllDoctorPatientQuery, FindAllDoctorPatientQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllDoctorPatientQuery, FindAllDoctorPatientQueryVariables>(FindAllDoctorPatientDocument, options);
        }
export type FindAllDoctorPatientQueryHookResult = ReturnType<typeof useFindAllDoctorPatientQuery>;
export type FindAllDoctorPatientLazyQueryHookResult = ReturnType<typeof useFindAllDoctorPatientLazyQuery>;
export type FindAllDoctorPatientQueryResult = Apollo.QueryResult<FindAllDoctorPatientQuery, FindAllDoctorPatientQueryVariables>;
export const FindAllDoctorUpcomingAppointmentsDocument = gql`
    query FindAllDoctorUpcomingAppointments($upComingAppointmentsInput: UpComingAppointmentsInput!) {
  findAllUpcomingAppointments(
    upComingAppointmentsInput: $upComingAppointmentsInput
  ) {
    response {
      status
    }
    appointments {
      id
      status
      scheduleStartDateTime
      scheduleEndDateTime
      appointmentType {
        id
        name
        duration
      }
      provider {
        id
        firstName
        lastName
      }
      patient {
        id
        firstName
        lastName
        profileAttachment
      }
    }
  }
}
    `;

/**
 * __useFindAllDoctorUpcomingAppointmentsQuery__
 *
 * To run a query within a React component, call `useFindAllDoctorUpcomingAppointmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllDoctorUpcomingAppointmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllDoctorUpcomingAppointmentsQuery({
 *   variables: {
 *      upComingAppointmentsInput: // value for 'upComingAppointmentsInput'
 *   },
 * });
 */
export function useFindAllDoctorUpcomingAppointmentsQuery(baseOptions: Apollo.QueryHookOptions<FindAllDoctorUpcomingAppointmentsQuery, FindAllDoctorUpcomingAppointmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllDoctorUpcomingAppointmentsQuery, FindAllDoctorUpcomingAppointmentsQueryVariables>(FindAllDoctorUpcomingAppointmentsDocument, options);
      }
export function useFindAllDoctorUpcomingAppointmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllDoctorUpcomingAppointmentsQuery, FindAllDoctorUpcomingAppointmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllDoctorUpcomingAppointmentsQuery, FindAllDoctorUpcomingAppointmentsQueryVariables>(FindAllDoctorUpcomingAppointmentsDocument, options);
        }
export type FindAllDoctorUpcomingAppointmentsQueryHookResult = ReturnType<typeof useFindAllDoctorUpcomingAppointmentsQuery>;
export type FindAllDoctorUpcomingAppointmentsLazyQueryHookResult = ReturnType<typeof useFindAllDoctorUpcomingAppointmentsLazyQuery>;
export type FindAllDoctorUpcomingAppointmentsQueryResult = Apollo.QueryResult<FindAllDoctorUpcomingAppointmentsQuery, FindAllDoctorUpcomingAppointmentsQueryVariables>;
export const GetPracticeUsersWithRolesDocument = gql`
    query GetPracticeUsersWithRoles($practiceFacilitiesUsersInputs: PracticeFacilitiesUsersInputs!) {
  getPracticeFacilitiesUsersWithRoles(
    practiceFacilitiesUsersInputs: $practiceFacilitiesUsersInputs
  ) {
    response {
      status
    }
    practiceUsers {
      id
      name
      facilities {
        name
        users {
          count
          role
        }
      }
    }
  }
}
    `;

/**
 * __useGetPracticeUsersWithRolesQuery__
 *
 * To run a query within a React component, call `useGetPracticeUsersWithRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPracticeUsersWithRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPracticeUsersWithRolesQuery({
 *   variables: {
 *      practiceFacilitiesUsersInputs: // value for 'practiceFacilitiesUsersInputs'
 *   },
 * });
 */
export function useGetPracticeUsersWithRolesQuery(baseOptions: Apollo.QueryHookOptions<GetPracticeUsersWithRolesQuery, GetPracticeUsersWithRolesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPracticeUsersWithRolesQuery, GetPracticeUsersWithRolesQueryVariables>(GetPracticeUsersWithRolesDocument, options);
      }
export function useGetPracticeUsersWithRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPracticeUsersWithRolesQuery, GetPracticeUsersWithRolesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPracticeUsersWithRolesQuery, GetPracticeUsersWithRolesQueryVariables>(GetPracticeUsersWithRolesDocument, options);
        }
export type GetPracticeUsersWithRolesQueryHookResult = ReturnType<typeof useGetPracticeUsersWithRolesQuery>;
export type GetPracticeUsersWithRolesLazyQueryHookResult = ReturnType<typeof useGetPracticeUsersWithRolesLazyQuery>;
export type GetPracticeUsersWithRolesQueryResult = Apollo.QueryResult<GetPracticeUsersWithRolesQuery, GetPracticeUsersWithRolesQueryVariables>;
export const GetPracticeUserRolesCountDocument = gql`
    query GetPracticeUserRolesCount($usersWithRolesInputs: UsersWithRolesInputs!) {
  getUsersWithRoles(usersWithRolesInputs: $usersWithRolesInputs) {
    response {
      status
      message
    }
    userRoles {
      role
      count
    }
  }
}
    `;

/**
 * __useGetPracticeUserRolesCountQuery__
 *
 * To run a query within a React component, call `useGetPracticeUserRolesCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPracticeUserRolesCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPracticeUserRolesCountQuery({
 *   variables: {
 *      usersWithRolesInputs: // value for 'usersWithRolesInputs'
 *   },
 * });
 */
export function useGetPracticeUserRolesCountQuery(baseOptions: Apollo.QueryHookOptions<GetPracticeUserRolesCountQuery, GetPracticeUserRolesCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPracticeUserRolesCountQuery, GetPracticeUserRolesCountQueryVariables>(GetPracticeUserRolesCountDocument, options);
      }
export function useGetPracticeUserRolesCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPracticeUserRolesCountQuery, GetPracticeUserRolesCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPracticeUserRolesCountQuery, GetPracticeUserRolesCountQueryVariables>(GetPracticeUserRolesCountDocument, options);
        }
export type GetPracticeUserRolesCountQueryHookResult = ReturnType<typeof useGetPracticeUserRolesCountQuery>;
export type GetPracticeUserRolesCountLazyQueryHookResult = ReturnType<typeof useGetPracticeUserRolesCountLazyQuery>;
export type GetPracticeUserRolesCountQueryResult = Apollo.QueryResult<GetPracticeUserRolesCountQuery, GetPracticeUserRolesCountQueryVariables>;
export const GetPracticeFacilityAppointmentsDocument = gql`
    query GetPracticeFacilityAppointments($practiceFacilityAppointmentsInputs: PracticeFacilityAppointmentsInputs!) {
  getPracticeFacilityAppointments(
    practiceFacilityAppointmentsInputs: $practiceFacilityAppointmentsInputs
  ) {
    response {
      status
    }
    facilitiesAppointments {
      facility
      count
    }
  }
}
    `;

/**
 * __useGetPracticeFacilityAppointmentsQuery__
 *
 * To run a query within a React component, call `useGetPracticeFacilityAppointmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPracticeFacilityAppointmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPracticeFacilityAppointmentsQuery({
 *   variables: {
 *      practiceFacilityAppointmentsInputs: // value for 'practiceFacilityAppointmentsInputs'
 *   },
 * });
 */
export function useGetPracticeFacilityAppointmentsQuery(baseOptions: Apollo.QueryHookOptions<GetPracticeFacilityAppointmentsQuery, GetPracticeFacilityAppointmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPracticeFacilityAppointmentsQuery, GetPracticeFacilityAppointmentsQueryVariables>(GetPracticeFacilityAppointmentsDocument, options);
      }
export function useGetPracticeFacilityAppointmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPracticeFacilityAppointmentsQuery, GetPracticeFacilityAppointmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPracticeFacilityAppointmentsQuery, GetPracticeFacilityAppointmentsQueryVariables>(GetPracticeFacilityAppointmentsDocument, options);
        }
export type GetPracticeFacilityAppointmentsQueryHookResult = ReturnType<typeof useGetPracticeFacilityAppointmentsQuery>;
export type GetPracticeFacilityAppointmentsLazyQueryHookResult = ReturnType<typeof useGetPracticeFacilityAppointmentsLazyQuery>;
export type GetPracticeFacilityAppointmentsQueryResult = Apollo.QueryResult<GetPracticeFacilityAppointmentsQuery, GetPracticeFacilityAppointmentsQueryVariables>;
export const GetPracticeFacilitiesDocument = gql`
    query GetPracticeFacilities {
  getPracticesFacilities {
    response {
      status
    }
    practiceFacilities {
      id
      name
      facility
    }
  }
}
    `;

/**
 * __useGetPracticeFacilitiesQuery__
 *
 * To run a query within a React component, call `useGetPracticeFacilitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPracticeFacilitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPracticeFacilitiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPracticeFacilitiesQuery(baseOptions?: Apollo.QueryHookOptions<GetPracticeFacilitiesQuery, GetPracticeFacilitiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPracticeFacilitiesQuery, GetPracticeFacilitiesQueryVariables>(GetPracticeFacilitiesDocument, options);
      }
export function useGetPracticeFacilitiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPracticeFacilitiesQuery, GetPracticeFacilitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPracticeFacilitiesQuery, GetPracticeFacilitiesQueryVariables>(GetPracticeFacilitiesDocument, options);
        }
export type GetPracticeFacilitiesQueryHookResult = ReturnType<typeof useGetPracticeFacilitiesQuery>;
export type GetPracticeFacilitiesLazyQueryHookResult = ReturnType<typeof useGetPracticeFacilitiesLazyQuery>;
export type GetPracticeFacilitiesQueryResult = Apollo.QueryResult<GetPracticeFacilitiesQuery, GetPracticeFacilitiesQueryVariables>;
export const GetPracticeUserDocument = gql`
    query GetPracticeUser {
  getPracticesUser {
    response {
      status
    }
    practiceUsers {
      id
      name
      userCount
    }
  }
}
    `;

/**
 * __useGetPracticeUserQuery__
 *
 * To run a query within a React component, call `useGetPracticeUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPracticeUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPracticeUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPracticeUserQuery(baseOptions?: Apollo.QueryHookOptions<GetPracticeUserQuery, GetPracticeUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPracticeUserQuery, GetPracticeUserQueryVariables>(GetPracticeUserDocument, options);
      }
export function useGetPracticeUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPracticeUserQuery, GetPracticeUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPracticeUserQuery, GetPracticeUserQueryVariables>(GetPracticeUserDocument, options);
        }
export type GetPracticeUserQueryHookResult = ReturnType<typeof useGetPracticeUserQuery>;
export type GetPracticeUserLazyQueryHookResult = ReturnType<typeof useGetPracticeUserLazyQuery>;
export type GetPracticeUserQueryResult = Apollo.QueryResult<GetPracticeUserQuery, GetPracticeUserQueryVariables>;
export const GetPracticeByYearDocument = gql`
    query GetPracticeByYear($practicesViaDateInputs: PracticesViaDateInputs!) {
  getPracticesByYear(practicesViaDateInputs: $practicesViaDateInputs) {
    response {
      status
    }
    practices {
      id
      name
      count
    }
  }
}
    `;

/**
 * __useGetPracticeByYearQuery__
 *
 * To run a query within a React component, call `useGetPracticeByYearQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPracticeByYearQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPracticeByYearQuery({
 *   variables: {
 *      practicesViaDateInputs: // value for 'practicesViaDateInputs'
 *   },
 * });
 */
export function useGetPracticeByYearQuery(baseOptions: Apollo.QueryHookOptions<GetPracticeByYearQuery, GetPracticeByYearQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPracticeByYearQuery, GetPracticeByYearQueryVariables>(GetPracticeByYearDocument, options);
      }
export function useGetPracticeByYearLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPracticeByYearQuery, GetPracticeByYearQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPracticeByYearQuery, GetPracticeByYearQueryVariables>(GetPracticeByYearDocument, options);
        }
export type GetPracticeByYearQueryHookResult = ReturnType<typeof useGetPracticeByYearQuery>;
export type GetPracticeByYearLazyQueryHookResult = ReturnType<typeof useGetPracticeByYearLazyQuery>;
export type GetPracticeByYearQueryResult = Apollo.QueryResult<GetPracticeByYearQuery, GetPracticeByYearQueryVariables>;
export const FindAllDoctorDocument = gql`
    query FindAllDoctor($doctorInput: DoctorInput!) {
  findAllDoctor(doctorInput: $doctorInput) {
    doctors {
      id
      email
      lastName
      firstName
      speciality
      contacts {
        id
        email
        phone
        primaryContact
      }
      facility {
        id
        name
      }
    }
    pagination {
      page
      totalPages
    }
    response {
      error
      status
      message
    }
  }
}
    `;

/**
 * __useFindAllDoctorQuery__
 *
 * To run a query within a React component, call `useFindAllDoctorQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllDoctorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllDoctorQuery({
 *   variables: {
 *      doctorInput: // value for 'doctorInput'
 *   },
 * });
 */
export function useFindAllDoctorQuery(baseOptions: Apollo.QueryHookOptions<FindAllDoctorQuery, FindAllDoctorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllDoctorQuery, FindAllDoctorQueryVariables>(FindAllDoctorDocument, options);
      }
export function useFindAllDoctorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllDoctorQuery, FindAllDoctorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllDoctorQuery, FindAllDoctorQueryVariables>(FindAllDoctorDocument, options);
        }
export type FindAllDoctorQueryHookResult = ReturnType<typeof useFindAllDoctorQuery>;
export type FindAllDoctorLazyQueryHookResult = ReturnType<typeof useFindAllDoctorLazyQuery>;
export type FindAllDoctorQueryResult = Apollo.QueryResult<FindAllDoctorQuery, FindAllDoctorQueryVariables>;
export const CreateDoctorDocument = gql`
    mutation CreateDoctor($createDoctorInput: CreateDoctorInput!) {
  createDoctor(createDoctorInput: $createDoctorInput) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type CreateDoctorMutationFn = Apollo.MutationFunction<CreateDoctorMutation, CreateDoctorMutationVariables>;

/**
 * __useCreateDoctorMutation__
 *
 * To run a mutation, you first call `useCreateDoctorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDoctorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDoctorMutation, { data, loading, error }] = useCreateDoctorMutation({
 *   variables: {
 *      createDoctorInput: // value for 'createDoctorInput'
 *   },
 * });
 */
export function useCreateDoctorMutation(baseOptions?: Apollo.MutationHookOptions<CreateDoctorMutation, CreateDoctorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDoctorMutation, CreateDoctorMutationVariables>(CreateDoctorDocument, options);
      }
export type CreateDoctorMutationHookResult = ReturnType<typeof useCreateDoctorMutation>;
export type CreateDoctorMutationResult = Apollo.MutationResult<CreateDoctorMutation>;
export type CreateDoctorMutationOptions = Apollo.BaseMutationOptions<CreateDoctorMutation, CreateDoctorMutationVariables>;
export const RemoveDoctorDocument = gql`
    mutation RemoveDoctor($removeDoctor: RemoveDoctor!) {
  removeDoctor(removeDoctor: $removeDoctor) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type RemoveDoctorMutationFn = Apollo.MutationFunction<RemoveDoctorMutation, RemoveDoctorMutationVariables>;

/**
 * __useRemoveDoctorMutation__
 *
 * To run a mutation, you first call `useRemoveDoctorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveDoctorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeDoctorMutation, { data, loading, error }] = useRemoveDoctorMutation({
 *   variables: {
 *      removeDoctor: // value for 'removeDoctor'
 *   },
 * });
 */
export function useRemoveDoctorMutation(baseOptions?: Apollo.MutationHookOptions<RemoveDoctorMutation, RemoveDoctorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveDoctorMutation, RemoveDoctorMutationVariables>(RemoveDoctorDocument, options);
      }
export type RemoveDoctorMutationHookResult = ReturnType<typeof useRemoveDoctorMutation>;
export type RemoveDoctorMutationResult = Apollo.MutationResult<RemoveDoctorMutation>;
export type RemoveDoctorMutationOptions = Apollo.BaseMutationOptions<RemoveDoctorMutation, RemoveDoctorMutationVariables>;
export const GetDoctorDocument = gql`
    query GetDoctor($getDoctor: GetDoctor!) {
  getDoctor(getDoctor: $getDoctor) {
    doctor {
      id
      firstName
      middleName
      lastName
      prefix
      suffix
      email
      providerIntials
      degreeCredentials
      speciality
      dob
      taxId
      facilityId
      ssn
      taxonomyCode
      deaNumber
      prescriptiveAuthNumber
      licenseTermDate
      stateLicense
      languagesSpoken
      dpsCtpNumber
      anesthesiaLicense
      specialityLicense
      taxIdStuff
      blueShildNumber
      campusGrpNumber
      medicareGrpNumber
      billingFacility
      emcProviderId
      upin
      npi
      taxId
      practiceId
      prescriptiveAuthNumber
      licenseActiveDate
      meammographyCertNumber
      medicaidGrpNumber
      deaActiveDate
      deaTermDate
      createdAt
      updatedAt
      billingAddress {
        id
        email
        mobile
        phone
        fax
        address
        address2
        zipCode
        city
        state
        country
        userId
        createdAt
        updatedAt
      }
      contacts {
        id
        email
        phone
        mobile
        pager
        fax
        address
        address2
        serviceCode
        zipCode
        city
        state
        country
        userId
        primaryContact
        createdAt
        updatedAt
      }
      attachments {
        id
        key
        url
        type
        title
        typeId
        createdAt
        updatedAt
      }
      facility {
        id
        name
        isPrivate
        createdAt
        updatedAt
      }
    }
    response {
      error
      status
      message
    }
  }
}
    `;

/**
 * __useGetDoctorQuery__
 *
 * To run a query within a React component, call `useGetDoctorQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDoctorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDoctorQuery({
 *   variables: {
 *      getDoctor: // value for 'getDoctor'
 *   },
 * });
 */
export function useGetDoctorQuery(baseOptions: Apollo.QueryHookOptions<GetDoctorQuery, GetDoctorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDoctorQuery, GetDoctorQueryVariables>(GetDoctorDocument, options);
      }
export function useGetDoctorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDoctorQuery, GetDoctorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDoctorQuery, GetDoctorQueryVariables>(GetDoctorDocument, options);
        }
export type GetDoctorQueryHookResult = ReturnType<typeof useGetDoctorQuery>;
export type GetDoctorLazyQueryHookResult = ReturnType<typeof useGetDoctorLazyQuery>;
export type GetDoctorQueryResult = Apollo.QueryResult<GetDoctorQuery, GetDoctorQueryVariables>;
export const UpdateDoctorDocument = gql`
    mutation UpdateDoctor($updateDoctorInput: UpdateDoctorInput!) {
  updateDoctor(updateDoctorInput: $updateDoctorInput) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type UpdateDoctorMutationFn = Apollo.MutationFunction<UpdateDoctorMutation, UpdateDoctorMutationVariables>;

/**
 * __useUpdateDoctorMutation__
 *
 * To run a mutation, you first call `useUpdateDoctorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDoctorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDoctorMutation, { data, loading, error }] = useUpdateDoctorMutation({
 *   variables: {
 *      updateDoctorInput: // value for 'updateDoctorInput'
 *   },
 * });
 */
export function useUpdateDoctorMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDoctorMutation, UpdateDoctorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDoctorMutation, UpdateDoctorMutationVariables>(UpdateDoctorDocument, options);
      }
export type UpdateDoctorMutationHookResult = ReturnType<typeof useUpdateDoctorMutation>;
export type UpdateDoctorMutationResult = Apollo.MutationResult<UpdateDoctorMutation>;
export type UpdateDoctorMutationOptions = Apollo.BaseMutationOptions<UpdateDoctorMutation, UpdateDoctorMutationVariables>;
export const FindAllFacilitiesDocument = gql`
    query FindAllFacilities($facilityInput: FacilityInput!) {
  findAllFacility(facilityInput: $facilityInput) {
    facilities {
      id
      name
      practice {
        id
        name
      }
      contacts {
        id
        email
        phone
        zipCode
        city
        state
        primaryContact
      }
    }
    pagination {
      page
      totalPages
    }
    response {
      error
      status
      message
    }
  }
}
    `;

/**
 * __useFindAllFacilitiesQuery__
 *
 * To run a query within a React component, call `useFindAllFacilitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllFacilitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllFacilitiesQuery({
 *   variables: {
 *      facilityInput: // value for 'facilityInput'
 *   },
 * });
 */
export function useFindAllFacilitiesQuery(baseOptions: Apollo.QueryHookOptions<FindAllFacilitiesQuery, FindAllFacilitiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllFacilitiesQuery, FindAllFacilitiesQueryVariables>(FindAllFacilitiesDocument, options);
      }
export function useFindAllFacilitiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllFacilitiesQuery, FindAllFacilitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllFacilitiesQuery, FindAllFacilitiesQueryVariables>(FindAllFacilitiesDocument, options);
        }
export type FindAllFacilitiesQueryHookResult = ReturnType<typeof useFindAllFacilitiesQuery>;
export type FindAllFacilitiesLazyQueryHookResult = ReturnType<typeof useFindAllFacilitiesLazyQuery>;
export type FindAllFacilitiesQueryResult = Apollo.QueryResult<FindAllFacilitiesQuery, FindAllFacilitiesQueryVariables>;
export const GetFacilityDocument = gql`
    query GetFacility($getFacility: GetFacility!) {
  getFacility(getFacility: $getFacility) {
    facility {
      id
      name
      practiceType
      cliaIdNumber
      federalTaxId
      isPrivate
      tamxonomyCode
      timeZone
      mammographyCertificationNumber
      npi
      practiceId
      serviceCode
      startTime
      endTime
      createdAt
      updatedAt
      practice {
        id
        name
      }
      contacts {
        id
        email
        phone
        mobile
        fax
        address
        address2
        zipCode
        city
        state
        country
        primaryContact
        createdAt
        updatedAt
      }
      billingAddress {
        id
        email
        mobile
        phone
        fax
        address
        address2
        zipCode
        city
        state
        country
        createdAt
        updatedAt
      }
    }
    response {
      name
      status
      message
    }
  }
}
    `;

/**
 * __useGetFacilityQuery__
 *
 * To run a query within a React component, call `useGetFacilityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFacilityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFacilityQuery({
 *   variables: {
 *      getFacility: // value for 'getFacility'
 *   },
 * });
 */
export function useGetFacilityQuery(baseOptions: Apollo.QueryHookOptions<GetFacilityQuery, GetFacilityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFacilityQuery, GetFacilityQueryVariables>(GetFacilityDocument, options);
      }
export function useGetFacilityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFacilityQuery, GetFacilityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFacilityQuery, GetFacilityQueryVariables>(GetFacilityDocument, options);
        }
export type GetFacilityQueryHookResult = ReturnType<typeof useGetFacilityQuery>;
export type GetFacilityLazyQueryHookResult = ReturnType<typeof useGetFacilityLazyQuery>;
export type GetFacilityQueryResult = Apollo.QueryResult<GetFacilityQuery, GetFacilityQueryVariables>;
export const RemoveFacilityDocument = gql`
    mutation RemoveFacility($removeFacility: RemoveFacility!) {
  removeFacility(removeFacility: $removeFacility) {
    response {
      name
      status
      message
    }
  }
}
    `;
export type RemoveFacilityMutationFn = Apollo.MutationFunction<RemoveFacilityMutation, RemoveFacilityMutationVariables>;

/**
 * __useRemoveFacilityMutation__
 *
 * To run a mutation, you first call `useRemoveFacilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFacilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFacilityMutation, { data, loading, error }] = useRemoveFacilityMutation({
 *   variables: {
 *      removeFacility: // value for 'removeFacility'
 *   },
 * });
 */
export function useRemoveFacilityMutation(baseOptions?: Apollo.MutationHookOptions<RemoveFacilityMutation, RemoveFacilityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveFacilityMutation, RemoveFacilityMutationVariables>(RemoveFacilityDocument, options);
      }
export type RemoveFacilityMutationHookResult = ReturnType<typeof useRemoveFacilityMutation>;
export type RemoveFacilityMutationResult = Apollo.MutationResult<RemoveFacilityMutation>;
export type RemoveFacilityMutationOptions = Apollo.BaseMutationOptions<RemoveFacilityMutation, RemoveFacilityMutationVariables>;
export const UpdateFacilityDocument = gql`
    mutation UpdateFacility($updateFacilityInput: UpdateFacilityInput!) {
  updateFacility(updateFacilityInput: $updateFacilityInput) {
    response {
      name
      status
      message
    }
    facility {
      id
      name
    }
  }
}
    `;
export type UpdateFacilityMutationFn = Apollo.MutationFunction<UpdateFacilityMutation, UpdateFacilityMutationVariables>;

/**
 * __useUpdateFacilityMutation__
 *
 * To run a mutation, you first call `useUpdateFacilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFacilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFacilityMutation, { data, loading, error }] = useUpdateFacilityMutation({
 *   variables: {
 *      updateFacilityInput: // value for 'updateFacilityInput'
 *   },
 * });
 */
export function useUpdateFacilityMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFacilityMutation, UpdateFacilityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFacilityMutation, UpdateFacilityMutationVariables>(UpdateFacilityDocument, options);
      }
export type UpdateFacilityMutationHookResult = ReturnType<typeof useUpdateFacilityMutation>;
export type UpdateFacilityMutationResult = Apollo.MutationResult<UpdateFacilityMutation>;
export type UpdateFacilityMutationOptions = Apollo.BaseMutationOptions<UpdateFacilityMutation, UpdateFacilityMutationVariables>;
export const CreateFacilityDocument = gql`
    mutation CreateFacility($createFacilityInput: CreateFacilityInput!) {
  createFacility(createFacilityInput: $createFacilityInput) {
    response {
      name
      status
      message
    }
    facility {
      id
      name
    }
  }
}
    `;
export type CreateFacilityMutationFn = Apollo.MutationFunction<CreateFacilityMutation, CreateFacilityMutationVariables>;

/**
 * __useCreateFacilityMutation__
 *
 * To run a mutation, you first call `useCreateFacilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFacilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFacilityMutation, { data, loading, error }] = useCreateFacilityMutation({
 *   variables: {
 *      createFacilityInput: // value for 'createFacilityInput'
 *   },
 * });
 */
export function useCreateFacilityMutation(baseOptions?: Apollo.MutationHookOptions<CreateFacilityMutation, CreateFacilityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFacilityMutation, CreateFacilityMutationVariables>(CreateFacilityDocument, options);
      }
export type CreateFacilityMutationHookResult = ReturnType<typeof useCreateFacilityMutation>;
export type CreateFacilityMutationResult = Apollo.MutationResult<CreateFacilityMutation>;
export type CreateFacilityMutationOptions = Apollo.BaseMutationOptions<CreateFacilityMutation, CreateFacilityMutationVariables>;
export const CreateFormDocument = gql`
    mutation createForm($createFormInput: CreateFormInput!) {
  createForm(createFormInput: $createFormInput) {
    response {
      status
    }
    form {
      id
      name
    }
  }
}
    `;
export type CreateFormMutationFn = Apollo.MutationFunction<CreateFormMutation, CreateFormMutationVariables>;

/**
 * __useCreateFormMutation__
 *
 * To run a mutation, you first call `useCreateFormMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFormMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFormMutation, { data, loading, error }] = useCreateFormMutation({
 *   variables: {
 *      createFormInput: // value for 'createFormInput'
 *   },
 * });
 */
export function useCreateFormMutation(baseOptions?: Apollo.MutationHookOptions<CreateFormMutation, CreateFormMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFormMutation, CreateFormMutationVariables>(CreateFormDocument, options);
      }
export type CreateFormMutationHookResult = ReturnType<typeof useCreateFormMutation>;
export type CreateFormMutationResult = Apollo.MutationResult<CreateFormMutation>;
export type CreateFormMutationOptions = Apollo.BaseMutationOptions<CreateFormMutation, CreateFormMutationVariables>;
export const FindAllFormsDocument = gql`
    query findAllForms($formInput: FormInput!) {
  findAllForms(formInput: $formInput) {
    response {
      status
    }
    forms {
      id
      type
      facilityId
      practiceId
      name
      createdAt
      isActive
      layout {
        tabs {
          id
          name
          sections {
            id
            col
            name
            fields {
              label
              name
              type
              css
              column
              placeholder
              defaultValue
              required
              errorMsg
              tableName
              columnName
              fieldId
              textArea
              isMultiSelect
              apiCall
              tableContactType
              options {
                name
                value
              }
            }
          }
        }
      }
    }
    pagination {
      page
      limit
      totalCount
      totalPages
    }
  }
}
    `;

/**
 * __useFindAllFormsQuery__
 *
 * To run a query within a React component, call `useFindAllFormsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllFormsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllFormsQuery({
 *   variables: {
 *      formInput: // value for 'formInput'
 *   },
 * });
 */
export function useFindAllFormsQuery(baseOptions: Apollo.QueryHookOptions<FindAllFormsQuery, FindAllFormsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllFormsQuery, FindAllFormsQueryVariables>(FindAllFormsDocument, options);
      }
export function useFindAllFormsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllFormsQuery, FindAllFormsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllFormsQuery, FindAllFormsQueryVariables>(FindAllFormsDocument, options);
        }
export type FindAllFormsQueryHookResult = ReturnType<typeof useFindAllFormsQuery>;
export type FindAllFormsLazyQueryHookResult = ReturnType<typeof useFindAllFormsLazyQuery>;
export type FindAllFormsQueryResult = Apollo.QueryResult<FindAllFormsQuery, FindAllFormsQueryVariables>;
export const RemoveFormDocument = gql`
    mutation removeForm($removeForm: RemoveForm!) {
  removeForm(removeForm: $removeForm) {
    response {
      status
      message
    }
  }
}
    `;
export type RemoveFormMutationFn = Apollo.MutationFunction<RemoveFormMutation, RemoveFormMutationVariables>;

/**
 * __useRemoveFormMutation__
 *
 * To run a mutation, you first call `useRemoveFormMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFormMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFormMutation, { data, loading, error }] = useRemoveFormMutation({
 *   variables: {
 *      removeForm: // value for 'removeForm'
 *   },
 * });
 */
export function useRemoveFormMutation(baseOptions?: Apollo.MutationHookOptions<RemoveFormMutation, RemoveFormMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveFormMutation, RemoveFormMutationVariables>(RemoveFormDocument, options);
      }
export type RemoveFormMutationHookResult = ReturnType<typeof useRemoveFormMutation>;
export type RemoveFormMutationResult = Apollo.MutationResult<RemoveFormMutation>;
export type RemoveFormMutationOptions = Apollo.BaseMutationOptions<RemoveFormMutation, RemoveFormMutationVariables>;
export const GetFormDocument = gql`
    query getForm($getForm: GetForm!) {
  getForm(getForm: $getForm) {
    response {
      status
      message
    }
    form {
      id
      name
      type
      facilityId
      practiceId
      isActive
      layout {
        tabs {
          id
          name
          sections {
            id
            col
            name
            fields {
              label
              name
              type
              css
              column
              placeholder
              defaultValue
              required
              errorMsg
              tableName
              columnName
              fieldId
              textArea
              isMultiSelect
              tableContactType
              apiCall
              options {
                name
                value
              }
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetFormQuery__
 *
 * To run a query within a React component, call `useGetFormQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFormQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFormQuery({
 *   variables: {
 *      getForm: // value for 'getForm'
 *   },
 * });
 */
export function useGetFormQuery(baseOptions: Apollo.QueryHookOptions<GetFormQuery, GetFormQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFormQuery, GetFormQueryVariables>(GetFormDocument, options);
      }
export function useGetFormLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFormQuery, GetFormQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFormQuery, GetFormQueryVariables>(GetFormDocument, options);
        }
export type GetFormQueryHookResult = ReturnType<typeof useGetFormQuery>;
export type GetFormLazyQueryHookResult = ReturnType<typeof useGetFormLazyQuery>;
export type GetFormQueryResult = Apollo.QueryResult<GetFormQuery, GetFormQueryVariables>;
export const UpdateFormDocument = gql`
    mutation updateForm($updateFormInput: UpdateFormInput!) {
  updateForm(updateFormInput: $updateFormInput) {
    response {
      status
    }
    form {
      id
      name
    }
  }
}
    `;
export type UpdateFormMutationFn = Apollo.MutationFunction<UpdateFormMutation, UpdateFormMutationVariables>;

/**
 * __useUpdateFormMutation__
 *
 * To run a mutation, you first call `useUpdateFormMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFormMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFormMutation, { data, loading, error }] = useUpdateFormMutation({
 *   variables: {
 *      updateFormInput: // value for 'updateFormInput'
 *   },
 * });
 */
export function useUpdateFormMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFormMutation, UpdateFormMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFormMutation, UpdateFormMutationVariables>(UpdateFormDocument, options);
      }
export type UpdateFormMutationHookResult = ReturnType<typeof useUpdateFormMutation>;
export type UpdateFormMutationResult = Apollo.MutationResult<UpdateFormMutation>;
export type UpdateFormMutationOptions = Apollo.BaseMutationOptions<UpdateFormMutation, UpdateFormMutationVariables>;
export const GetPublicFormDocument = gql`
    query getPublicForm($getForm: GetForm!) {
  getPublicForm(getForm: $getForm) {
    response {
      status
      message
    }
    form {
      id
      type
      facilityId
      practiceId
      name
      isActive
      layout {
        tabs {
          id
          name
          sections {
            id
            col
            name
            fields {
              label
              name
              type
              css
              column
              placeholder
              defaultValue
              required
              errorMsg
              tableName
              columnName
              fieldId
              textArea
              isMultiSelect
              apiCall
              tableContactType
              options {
                name
                value
              }
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetPublicFormQuery__
 *
 * To run a query within a React component, call `useGetPublicFormQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPublicFormQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPublicFormQuery({
 *   variables: {
 *      getForm: // value for 'getForm'
 *   },
 * });
 */
export function useGetPublicFormQuery(baseOptions: Apollo.QueryHookOptions<GetPublicFormQuery, GetPublicFormQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPublicFormQuery, GetPublicFormQueryVariables>(GetPublicFormDocument, options);
      }
export function useGetPublicFormLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPublicFormQuery, GetPublicFormQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPublicFormQuery, GetPublicFormQueryVariables>(GetPublicFormDocument, options);
        }
export type GetPublicFormQueryHookResult = ReturnType<typeof useGetPublicFormQuery>;
export type GetPublicFormLazyQueryHookResult = ReturnType<typeof useGetPublicFormLazyQuery>;
export type GetPublicFormQueryResult = Apollo.QueryResult<GetPublicFormQuery, GetPublicFormQueryVariables>;
export const FindAllUsersFormsDocument = gql`
    query findAllUsersForms($userFormInput: UserFormInput!) {
  findAllUsersForms(userFormInput: $userFormInput) {
    response {
      status
      message
    }
    form {
      id
      name
      formElements {
        id
        name
        label
        fieldId
        sectionId
        isDeleted
      }
      userForms {
        id
        FormId
        DoctorId
        PatientId
        StaffId
        SubmitterId
        userFormElements {
          id
          value
          UsersFormsId
          FormsElementsId
          arrayOfStrings
          arrayOfObjects {
            name
            value
          }
        }
      }
    }
    pagination {
      page
      limit
      totalCount
      totalPages
    }
  }
}
    `;

/**
 * __useFindAllUsersFormsQuery__
 *
 * To run a query within a React component, call `useFindAllUsersFormsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllUsersFormsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllUsersFormsQuery({
 *   variables: {
 *      userFormInput: // value for 'userFormInput'
 *   },
 * });
 */
export function useFindAllUsersFormsQuery(baseOptions: Apollo.QueryHookOptions<FindAllUsersFormsQuery, FindAllUsersFormsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllUsersFormsQuery, FindAllUsersFormsQueryVariables>(FindAllUsersFormsDocument, options);
      }
export function useFindAllUsersFormsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllUsersFormsQuery, FindAllUsersFormsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllUsersFormsQuery, FindAllUsersFormsQueryVariables>(FindAllUsersFormsDocument, options);
        }
export type FindAllUsersFormsQueryHookResult = ReturnType<typeof useFindAllUsersFormsQuery>;
export type FindAllUsersFormsLazyQueryHookResult = ReturnType<typeof useFindAllUsersFormsLazyQuery>;
export type FindAllUsersFormsQueryResult = Apollo.QueryResult<FindAllUsersFormsQuery, FindAllUsersFormsQueryVariables>;
export const SaveUserFormValuesDocument = gql`
    mutation saveUserFormValues($createUserFormInput: CreateUserFormInput!) {
  saveUserFormValues(createUserFormInput: $createUserFormInput) {
    response {
      status
      message
      error
    }
    userForm {
      id
    }
    appointment {
      id
    }
  }
}
    `;
export type SaveUserFormValuesMutationFn = Apollo.MutationFunction<SaveUserFormValuesMutation, SaveUserFormValuesMutationVariables>;

/**
 * __useSaveUserFormValuesMutation__
 *
 * To run a mutation, you first call `useSaveUserFormValuesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveUserFormValuesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveUserFormValuesMutation, { data, loading, error }] = useSaveUserFormValuesMutation({
 *   variables: {
 *      createUserFormInput: // value for 'createUserFormInput'
 *   },
 * });
 */
export function useSaveUserFormValuesMutation(baseOptions?: Apollo.MutationHookOptions<SaveUserFormValuesMutation, SaveUserFormValuesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveUserFormValuesMutation, SaveUserFormValuesMutationVariables>(SaveUserFormValuesDocument, options);
      }
export type SaveUserFormValuesMutationHookResult = ReturnType<typeof useSaveUserFormValuesMutation>;
export type SaveUserFormValuesMutationResult = Apollo.MutationResult<SaveUserFormValuesMutation>;
export type SaveUserFormValuesMutationOptions = Apollo.BaseMutationOptions<SaveUserFormValuesMutation, SaveUserFormValuesMutationVariables>;
export const GetFormPublicMediaUrlDocument = gql`
    mutation getFormPublicMediaUrl($getPublicMediaInput: GetPublicMediaInput!) {
  getFormPublicMediaUrl(getPublicMediaInput: $getPublicMediaInput) {
    publicUrl
    response {
      status
      error
      message
    }
  }
}
    `;
export type GetFormPublicMediaUrlMutationFn = Apollo.MutationFunction<GetFormPublicMediaUrlMutation, GetFormPublicMediaUrlMutationVariables>;

/**
 * __useGetFormPublicMediaUrlMutation__
 *
 * To run a mutation, you first call `useGetFormPublicMediaUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetFormPublicMediaUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getFormPublicMediaUrlMutation, { data, loading, error }] = useGetFormPublicMediaUrlMutation({
 *   variables: {
 *      getPublicMediaInput: // value for 'getPublicMediaInput'
 *   },
 * });
 */
export function useGetFormPublicMediaUrlMutation(baseOptions?: Apollo.MutationHookOptions<GetFormPublicMediaUrlMutation, GetFormPublicMediaUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GetFormPublicMediaUrlMutation, GetFormPublicMediaUrlMutationVariables>(GetFormPublicMediaUrlDocument, options);
      }
export type GetFormPublicMediaUrlMutationHookResult = ReturnType<typeof useGetFormPublicMediaUrlMutation>;
export type GetFormPublicMediaUrlMutationResult = Apollo.MutationResult<GetFormPublicMediaUrlMutation>;
export type GetFormPublicMediaUrlMutationOptions = Apollo.BaseMutationOptions<GetFormPublicMediaUrlMutation, GetFormPublicMediaUrlMutationVariables>;
export const CreateFormTemplateDocument = gql`
    mutation CreateFormTemplate($createFormInput: CreateFormInput!) {
  createFormTemplate(createFormInput: $createFormInput) {
    response {
      status
      message
      error
    }
    form {
      id
    }
  }
}
    `;
export type CreateFormTemplateMutationFn = Apollo.MutationFunction<CreateFormTemplateMutation, CreateFormTemplateMutationVariables>;

/**
 * __useCreateFormTemplateMutation__
 *
 * To run a mutation, you first call `useCreateFormTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFormTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFormTemplateMutation, { data, loading, error }] = useCreateFormTemplateMutation({
 *   variables: {
 *      createFormInput: // value for 'createFormInput'
 *   },
 * });
 */
export function useCreateFormTemplateMutation(baseOptions?: Apollo.MutationHookOptions<CreateFormTemplateMutation, CreateFormTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFormTemplateMutation, CreateFormTemplateMutationVariables>(CreateFormTemplateDocument, options);
      }
export type CreateFormTemplateMutationHookResult = ReturnType<typeof useCreateFormTemplateMutation>;
export type CreateFormTemplateMutationResult = Apollo.MutationResult<CreateFormTemplateMutation>;
export type CreateFormTemplateMutationOptions = Apollo.BaseMutationOptions<CreateFormTemplateMutation, CreateFormTemplateMutationVariables>;
export const FetchAllInsurancesDocument = gql`
    query FetchAllInsurances($insuranceInput: InsurancePaginationInput!) {
  fetchAllInsurances(insuranceInput: $insuranceInput) {
    insurances {
      payerName
      payerId
      id
    }
    response {
      status
      message
    }
    pagination {
      page
      totalPages
    }
  }
}
    `;

/**
 * __useFetchAllInsurancesQuery__
 *
 * To run a query within a React component, call `useFetchAllInsurancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchAllInsurancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchAllInsurancesQuery({
 *   variables: {
 *      insuranceInput: // value for 'insuranceInput'
 *   },
 * });
 */
export function useFetchAllInsurancesQuery(baseOptions: Apollo.QueryHookOptions<FetchAllInsurancesQuery, FetchAllInsurancesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchAllInsurancesQuery, FetchAllInsurancesQueryVariables>(FetchAllInsurancesDocument, options);
      }
export function useFetchAllInsurancesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchAllInsurancesQuery, FetchAllInsurancesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchAllInsurancesQuery, FetchAllInsurancesQueryVariables>(FetchAllInsurancesDocument, options);
        }
export type FetchAllInsurancesQueryHookResult = ReturnType<typeof useFetchAllInsurancesQuery>;
export type FetchAllInsurancesLazyQueryHookResult = ReturnType<typeof useFetchAllInsurancesLazyQuery>;
export type FetchAllInsurancesQueryResult = Apollo.QueryResult<FetchAllInsurancesQuery, FetchAllInsurancesQueryVariables>;
export const FetchAllPoliciesDocument = gql`
    query FetchAllPolicies($policyInput: PolicyPaginationInput!) {
  fetchAllPolicies(policyInput: $policyInput) {
    policies {
      id
      orderOfBenefit
      expirationDate
      issueDate
      memberId
      groupNumber
      copays {
        type
        amount
      }
      policyHolder {
        firstName
        lastName
      }
      patient {
        email
      }
      insurance {
        payerName
        payerId
      }
    }
    pagination {
      page
      totalPages
    }
    response {
      status
      message
    }
  }
}
    `;

/**
 * __useFetchAllPoliciesQuery__
 *
 * To run a query within a React component, call `useFetchAllPoliciesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchAllPoliciesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchAllPoliciesQuery({
 *   variables: {
 *      policyInput: // value for 'policyInput'
 *   },
 * });
 */
export function useFetchAllPoliciesQuery(baseOptions: Apollo.QueryHookOptions<FetchAllPoliciesQuery, FetchAllPoliciesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchAllPoliciesQuery, FetchAllPoliciesQueryVariables>(FetchAllPoliciesDocument, options);
      }
export function useFetchAllPoliciesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchAllPoliciesQuery, FetchAllPoliciesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchAllPoliciesQuery, FetchAllPoliciesQueryVariables>(FetchAllPoliciesDocument, options);
        }
export type FetchAllPoliciesQueryHookResult = ReturnType<typeof useFetchAllPoliciesQuery>;
export type FetchAllPoliciesLazyQueryHookResult = ReturnType<typeof useFetchAllPoliciesLazyQuery>;
export type FetchAllPoliciesQueryResult = Apollo.QueryResult<FetchAllPoliciesQuery, FetchAllPoliciesQueryVariables>;
export const FetchPolicyDocument = gql`
    query FetchPolicy($id: String!) {
  fetchPolicy(id: $id) {
    policy {
      id
      policyHolderRelationship
      coinsurancePercentage
      expirationDate
      pricingProductType
      issueDate
      memberId
      groupNumber
      notes
      orderOfBenefit
      referringProvider {
        firstName
        lastName
        id
      }
      primaryCareProvider {
        firstName
        lastName
        id
      }
      copays {
        id
        type
        amount
      }
      policyHolder {
        id
        address
        addressCTD
        city
        dob
        employer
        firstName
        middleName
        lastName
        certificationNumber
        ssn
        state
        suffix
        zipCode
        sex
      }
      patient {
        id
      }
      insurance {
        payerName
        payerId
        id
      }
    }
    response {
      status
      message
    }
  }
}
    `;

/**
 * __useFetchPolicyQuery__
 *
 * To run a query within a React component, call `useFetchPolicyQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchPolicyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchPolicyQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFetchPolicyQuery(baseOptions: Apollo.QueryHookOptions<FetchPolicyQuery, FetchPolicyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchPolicyQuery, FetchPolicyQueryVariables>(FetchPolicyDocument, options);
      }
export function useFetchPolicyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchPolicyQuery, FetchPolicyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchPolicyQuery, FetchPolicyQueryVariables>(FetchPolicyDocument, options);
        }
export type FetchPolicyQueryHookResult = ReturnType<typeof useFetchPolicyQuery>;
export type FetchPolicyLazyQueryHookResult = ReturnType<typeof useFetchPolicyLazyQuery>;
export type FetchPolicyQueryResult = Apollo.QueryResult<FetchPolicyQuery, FetchPolicyQueryVariables>;
export const FetchPatientInsurancesDocument = gql`
    query FetchPatientInsurances($id: String!) {
  fetchPatientInsurances(id: $id) {
    policies {
      id
      policyHolderRelationship
      coinsurancePercentage
      expirationDate
      pricingProductType
      issueDate
      memberId
      groupNumber
      notes
      orderOfBenefit
      referringProvider {
        firstName
        lastName
        id
      }
      primaryCareProvider {
        firstName
        lastName
        id
      }
      copays {
        id
        type
        amount
      }
      policyHolder {
        id
        address
        addressCTD
        city
        dob
        employer
        firstName
        middleName
        lastName
        certificationNumber
        ssn
        state
        suffix
        zipCode
        sex
      }
      patient {
        id
      }
      insurance {
        payerName
        payerId
        id
      }
    }
    response {
      status
      message
    }
  }
}
    `;

/**
 * __useFetchPatientInsurancesQuery__
 *
 * To run a query within a React component, call `useFetchPatientInsurancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchPatientInsurancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchPatientInsurancesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFetchPatientInsurancesQuery(baseOptions: Apollo.QueryHookOptions<FetchPatientInsurancesQuery, FetchPatientInsurancesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchPatientInsurancesQuery, FetchPatientInsurancesQueryVariables>(FetchPatientInsurancesDocument, options);
      }
export function useFetchPatientInsurancesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchPatientInsurancesQuery, FetchPatientInsurancesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchPatientInsurancesQuery, FetchPatientInsurancesQueryVariables>(FetchPatientInsurancesDocument, options);
        }
export type FetchPatientInsurancesQueryHookResult = ReturnType<typeof useFetchPatientInsurancesQuery>;
export type FetchPatientInsurancesLazyQueryHookResult = ReturnType<typeof useFetchPatientInsurancesLazyQuery>;
export type FetchPatientInsurancesQueryResult = Apollo.QueryResult<FetchPatientInsurancesQuery, FetchPatientInsurancesQueryVariables>;
export const CreatePolicyDocument = gql`
    mutation CreatePolicy($createPolicyInput: CreatePolicyInput!) {
  createPolicy(createPolicyInput: $createPolicyInput) {
    response {
      status
      message
    }
    policy {
      id
    }
  }
}
    `;
export type CreatePolicyMutationFn = Apollo.MutationFunction<CreatePolicyMutation, CreatePolicyMutationVariables>;

/**
 * __useCreatePolicyMutation__
 *
 * To run a mutation, you first call `useCreatePolicyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePolicyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPolicyMutation, { data, loading, error }] = useCreatePolicyMutation({
 *   variables: {
 *      createPolicyInput: // value for 'createPolicyInput'
 *   },
 * });
 */
export function useCreatePolicyMutation(baseOptions?: Apollo.MutationHookOptions<CreatePolicyMutation, CreatePolicyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePolicyMutation, CreatePolicyMutationVariables>(CreatePolicyDocument, options);
      }
export type CreatePolicyMutationHookResult = ReturnType<typeof useCreatePolicyMutation>;
export type CreatePolicyMutationResult = Apollo.MutationResult<CreatePolicyMutation>;
export type CreatePolicyMutationOptions = Apollo.BaseMutationOptions<CreatePolicyMutation, CreatePolicyMutationVariables>;
export const CreateCopayDocument = gql`
    mutation CreateCopay($createCopayInput: CopayInput!) {
  createCopay(createCopayInput: $createCopayInput) {
    id
  }
}
    `;
export type CreateCopayMutationFn = Apollo.MutationFunction<CreateCopayMutation, CreateCopayMutationVariables>;

/**
 * __useCreateCopayMutation__
 *
 * To run a mutation, you first call `useCreateCopayMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCopayMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCopayMutation, { data, loading, error }] = useCreateCopayMutation({
 *   variables: {
 *      createCopayInput: // value for 'createCopayInput'
 *   },
 * });
 */
export function useCreateCopayMutation(baseOptions?: Apollo.MutationHookOptions<CreateCopayMutation, CreateCopayMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCopayMutation, CreateCopayMutationVariables>(CreateCopayDocument, options);
      }
export type CreateCopayMutationHookResult = ReturnType<typeof useCreateCopayMutation>;
export type CreateCopayMutationResult = Apollo.MutationResult<CreateCopayMutation>;
export type CreateCopayMutationOptions = Apollo.BaseMutationOptions<CreateCopayMutation, CreateCopayMutationVariables>;
export const UpdatePolicyDocument = gql`
    mutation UpdatePolicy($updatePolicyInput: UpdatePolicyInput!) {
  updatePolicy(updatePolicyInput: $updatePolicyInput) {
    response {
      status
      message
    }
    policy {
      id
    }
  }
}
    `;
export type UpdatePolicyMutationFn = Apollo.MutationFunction<UpdatePolicyMutation, UpdatePolicyMutationVariables>;

/**
 * __useUpdatePolicyMutation__
 *
 * To run a mutation, you first call `useUpdatePolicyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePolicyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePolicyMutation, { data, loading, error }] = useUpdatePolicyMutation({
 *   variables: {
 *      updatePolicyInput: // value for 'updatePolicyInput'
 *   },
 * });
 */
export function useUpdatePolicyMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePolicyMutation, UpdatePolicyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePolicyMutation, UpdatePolicyMutationVariables>(UpdatePolicyDocument, options);
      }
export type UpdatePolicyMutationHookResult = ReturnType<typeof useUpdatePolicyMutation>;
export type UpdatePolicyMutationResult = Apollo.MutationResult<UpdatePolicyMutation>;
export type UpdatePolicyMutationOptions = Apollo.BaseMutationOptions<UpdatePolicyMutation, UpdatePolicyMutationVariables>;
export const CreateInvoiceDocument = gql`
    mutation CreateInvoice($createInvoiceInputs: CreateInvoiceInputs!) {
  createInvoice(createInvoiceInputs: $createInvoiceInputs) {
    response {
      name
      status
      message
    }
    invoice {
      invoiceNo
    }
  }
}
    `;
export type CreateInvoiceMutationFn = Apollo.MutationFunction<CreateInvoiceMutation, CreateInvoiceMutationVariables>;

/**
 * __useCreateInvoiceMutation__
 *
 * To run a mutation, you first call `useCreateInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInvoiceMutation, { data, loading, error }] = useCreateInvoiceMutation({
 *   variables: {
 *      createInvoiceInputs: // value for 'createInvoiceInputs'
 *   },
 * });
 */
export function useCreateInvoiceMutation(baseOptions?: Apollo.MutationHookOptions<CreateInvoiceMutation, CreateInvoiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInvoiceMutation, CreateInvoiceMutationVariables>(CreateInvoiceDocument, options);
      }
export type CreateInvoiceMutationHookResult = ReturnType<typeof useCreateInvoiceMutation>;
export type CreateInvoiceMutationResult = Apollo.MutationResult<CreateInvoiceMutation>;
export type CreateInvoiceMutationOptions = Apollo.BaseMutationOptions<CreateInvoiceMutation, CreateInvoiceMutationVariables>;
export const FindAllLabTestDocument = gql`
    query FindAllLabTest($labTestInput: LabTestInput!) {
  findAllLabTest(labTestInput: $labTestInput) {
    labTests {
      id
      orderNumber
      labTestStatus
      testDate
      testTime
      patientId
      createdAt
      testNotes
      patient {
        doctorPatients {
          doctor {
            firstName
            lastName
          }
          currentProvider
        }
        firstName
      }
      diagnoses {
        code
        description
      }
      test {
        id
        loincNum
        component
      }
      testObservations {
        createdAt
        doctorsSignOff
        attachments {
          title
          id
          attachmentName
          url
        }
      }
      appointment {
        id
        appointmentType {
          name
        }
        scheduleStartDateTime
      }
    }
    pagination {
      page
      totalPages
    }
    response {
      error
      status
      message
    }
  }
}
    `;

/**
 * __useFindAllLabTestQuery__
 *
 * To run a query within a React component, call `useFindAllLabTestQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllLabTestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllLabTestQuery({
 *   variables: {
 *      labTestInput: // value for 'labTestInput'
 *   },
 * });
 */
export function useFindAllLabTestQuery(baseOptions: Apollo.QueryHookOptions<FindAllLabTestQuery, FindAllLabTestQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllLabTestQuery, FindAllLabTestQueryVariables>(FindAllLabTestDocument, options);
      }
export function useFindAllLabTestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllLabTestQuery, FindAllLabTestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllLabTestQuery, FindAllLabTestQueryVariables>(FindAllLabTestDocument, options);
        }
export type FindAllLabTestQueryHookResult = ReturnType<typeof useFindAllLabTestQuery>;
export type FindAllLabTestLazyQueryHookResult = ReturnType<typeof useFindAllLabTestLazyQuery>;
export type FindAllLabTestQueryResult = Apollo.QueryResult<FindAllLabTestQuery, FindAllLabTestQueryVariables>;
export const FindAllLoincCodesDocument = gql`
    query FindAllLoincCodes($searchLoincCodesInput: SearchLoincCodesInput!) {
  findAllLoincCodes(searchLoincCodesInput: $searchLoincCodesInput) {
    loincCodes {
      id
      loincNum
      component
    }
    pagination {
      page
      totalPages
    }
    response {
      error
      status
      message
    }
  }
}
    `;

/**
 * __useFindAllLoincCodesQuery__
 *
 * To run a query within a React component, call `useFindAllLoincCodesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllLoincCodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllLoincCodesQuery({
 *   variables: {
 *      searchLoincCodesInput: // value for 'searchLoincCodesInput'
 *   },
 * });
 */
export function useFindAllLoincCodesQuery(baseOptions: Apollo.QueryHookOptions<FindAllLoincCodesQuery, FindAllLoincCodesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllLoincCodesQuery, FindAllLoincCodesQueryVariables>(FindAllLoincCodesDocument, options);
      }
export function useFindAllLoincCodesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllLoincCodesQuery, FindAllLoincCodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllLoincCodesQuery, FindAllLoincCodesQueryVariables>(FindAllLoincCodesDocument, options);
        }
export type FindAllLoincCodesQueryHookResult = ReturnType<typeof useFindAllLoincCodesQuery>;
export type FindAllLoincCodesLazyQueryHookResult = ReturnType<typeof useFindAllLoincCodesLazyQuery>;
export type FindAllLoincCodesQueryResult = Apollo.QueryResult<FindAllLoincCodesQuery, FindAllLoincCodesQueryVariables>;
export const FindAllTestSpecimenTypesDocument = gql`
    query FindAllTestSpecimenTypes($testSpecimenTypeInput: TestSpecimenTypeInput!) {
  findAllTestSpecimenTypes(testSpecimenTypeInput: $testSpecimenTypeInput) {
    specimenTypes {
      id
      name
    }
    pagination {
      page
      totalPages
    }
    response {
      error
      status
      message
    }
  }
}
    `;

/**
 * __useFindAllTestSpecimenTypesQuery__
 *
 * To run a query within a React component, call `useFindAllTestSpecimenTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllTestSpecimenTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllTestSpecimenTypesQuery({
 *   variables: {
 *      testSpecimenTypeInput: // value for 'testSpecimenTypeInput'
 *   },
 * });
 */
export function useFindAllTestSpecimenTypesQuery(baseOptions: Apollo.QueryHookOptions<FindAllTestSpecimenTypesQuery, FindAllTestSpecimenTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllTestSpecimenTypesQuery, FindAllTestSpecimenTypesQueryVariables>(FindAllTestSpecimenTypesDocument, options);
      }
export function useFindAllTestSpecimenTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllTestSpecimenTypesQuery, FindAllTestSpecimenTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllTestSpecimenTypesQuery, FindAllTestSpecimenTypesQueryVariables>(FindAllTestSpecimenTypesDocument, options);
        }
export type FindAllTestSpecimenTypesQueryHookResult = ReturnType<typeof useFindAllTestSpecimenTypesQuery>;
export type FindAllTestSpecimenTypesLazyQueryHookResult = ReturnType<typeof useFindAllTestSpecimenTypesLazyQuery>;
export type FindAllTestSpecimenTypesQueryResult = Apollo.QueryResult<FindAllTestSpecimenTypesQuery, FindAllTestSpecimenTypesQueryVariables>;
export const GetSpecimenTypeByNameDocument = gql`
    query getSpecimenTypeByName($name: String!) {
  getSpecimenTypeByName(name: $name) {
    id
    name
  }
}
    `;

/**
 * __useGetSpecimenTypeByNameQuery__
 *
 * To run a query within a React component, call `useGetSpecimenTypeByNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSpecimenTypeByNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSpecimenTypeByNameQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useGetSpecimenTypeByNameQuery(baseOptions: Apollo.QueryHookOptions<GetSpecimenTypeByNameQuery, GetSpecimenTypeByNameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSpecimenTypeByNameQuery, GetSpecimenTypeByNameQueryVariables>(GetSpecimenTypeByNameDocument, options);
      }
export function useGetSpecimenTypeByNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSpecimenTypeByNameQuery, GetSpecimenTypeByNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSpecimenTypeByNameQuery, GetSpecimenTypeByNameQueryVariables>(GetSpecimenTypeByNameDocument, options);
        }
export type GetSpecimenTypeByNameQueryHookResult = ReturnType<typeof useGetSpecimenTypeByNameQuery>;
export type GetSpecimenTypeByNameLazyQueryHookResult = ReturnType<typeof useGetSpecimenTypeByNameLazyQuery>;
export type GetSpecimenTypeByNameQueryResult = Apollo.QueryResult<GetSpecimenTypeByNameQuery, GetSpecimenTypeByNameQueryVariables>;
export const FindLabTestsByOrderNumDocument = gql`
    query FindLabTestsByOrderNum($labTestByOrderNumInput: LabTestByOrderNumInput!) {
  findLabTestsByOrderNum(labTestByOrderNumInput: $labTestByOrderNumInput) {
    labTests {
      id
      labTestStatus
      testDate
      testTime
      patientId
      createdAt
      testNotes
      doctor {
        firstName
        lastName
        id
      }
      receivedDate
      labName
      vendorName
      accessionNumber
      collectedDate
      patient {
        doctorPatients {
          doctor {
            firstName
            lastName
          }
          currentProvider
        }
        firstName
      }
      diagnoses {
        id
        code
        description
      }
      test {
        id
        loincNum
        component
        unitsRequired
      }
      testSpecimens {
        id
        collectionDate
        collectionTime
        specimenNotes
        specimenTypes {
          id
          name
        }
      }
      testObservations {
        id
        doctorsSignOff
        resultUnit
        resultValue
        normalRange
        normalRangeUnit
        abnormalFlag
        attachments {
          title
          id
          attachmentName
          url
        }
      }
      appointment {
        id
        appointmentType {
          name
        }
        scheduleStartDateTime
      }
    }
    pagination {
      page
      totalPages
    }
    response {
      error
      status
      message
    }
  }
}
    `;

/**
 * __useFindLabTestsByOrderNumQuery__
 *
 * To run a query within a React component, call `useFindLabTestsByOrderNumQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindLabTestsByOrderNumQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindLabTestsByOrderNumQuery({
 *   variables: {
 *      labTestByOrderNumInput: // value for 'labTestByOrderNumInput'
 *   },
 * });
 */
export function useFindLabTestsByOrderNumQuery(baseOptions: Apollo.QueryHookOptions<FindLabTestsByOrderNumQuery, FindLabTestsByOrderNumQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindLabTestsByOrderNumQuery, FindLabTestsByOrderNumQueryVariables>(FindLabTestsByOrderNumDocument, options);
      }
export function useFindLabTestsByOrderNumLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindLabTestsByOrderNumQuery, FindLabTestsByOrderNumQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindLabTestsByOrderNumQuery, FindLabTestsByOrderNumQueryVariables>(FindLabTestsByOrderNumDocument, options);
        }
export type FindLabTestsByOrderNumQueryHookResult = ReturnType<typeof useFindLabTestsByOrderNumQuery>;
export type FindLabTestsByOrderNumLazyQueryHookResult = ReturnType<typeof useFindLabTestsByOrderNumLazyQuery>;
export type FindLabTestsByOrderNumQueryResult = Apollo.QueryResult<FindLabTestsByOrderNumQuery, FindLabTestsByOrderNumQueryVariables>;
export const CreateLabTestDocument = gql`
    mutation CreateLabTest($createLabTestInput: CreateLabTestInput!) {
  createLabTest(createLabTestInput: $createLabTestInput) {
    response {
      error
      status
      message
    }
    labTest {
      orderNumber
    }
  }
}
    `;
export type CreateLabTestMutationFn = Apollo.MutationFunction<CreateLabTestMutation, CreateLabTestMutationVariables>;

/**
 * __useCreateLabTestMutation__
 *
 * To run a mutation, you first call `useCreateLabTestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLabTestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLabTestMutation, { data, loading, error }] = useCreateLabTestMutation({
 *   variables: {
 *      createLabTestInput: // value for 'createLabTestInput'
 *   },
 * });
 */
export function useCreateLabTestMutation(baseOptions?: Apollo.MutationHookOptions<CreateLabTestMutation, CreateLabTestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLabTestMutation, CreateLabTestMutationVariables>(CreateLabTestDocument, options);
      }
export type CreateLabTestMutationHookResult = ReturnType<typeof useCreateLabTestMutation>;
export type CreateLabTestMutationResult = Apollo.MutationResult<CreateLabTestMutation>;
export type CreateLabTestMutationOptions = Apollo.BaseMutationOptions<CreateLabTestMutation, CreateLabTestMutationVariables>;
export const UpdateLabTestDocument = gql`
    mutation UpdateLabTest($updateLabTestInput: UpdateLabTestInput!) {
  updateLabTest(updateLabTestInput: $updateLabTestInput) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type UpdateLabTestMutationFn = Apollo.MutationFunction<UpdateLabTestMutation, UpdateLabTestMutationVariables>;

/**
 * __useUpdateLabTestMutation__
 *
 * To run a mutation, you first call `useUpdateLabTestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLabTestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLabTestMutation, { data, loading, error }] = useUpdateLabTestMutation({
 *   variables: {
 *      updateLabTestInput: // value for 'updateLabTestInput'
 *   },
 * });
 */
export function useUpdateLabTestMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLabTestMutation, UpdateLabTestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLabTestMutation, UpdateLabTestMutationVariables>(UpdateLabTestDocument, options);
      }
export type UpdateLabTestMutationHookResult = ReturnType<typeof useUpdateLabTestMutation>;
export type UpdateLabTestMutationResult = Apollo.MutationResult<UpdateLabTestMutation>;
export type UpdateLabTestMutationOptions = Apollo.BaseMutationOptions<UpdateLabTestMutation, UpdateLabTestMutationVariables>;
export const UpdateLabTestsByOrderNumDocument = gql`
    mutation UpdateLabTestsByOrderNum($updateLabTestItemInput: CreateLabTestItemInput!) {
  updateLabTestsByOrderNum(updateLabTestItemInput: $updateLabTestItemInput) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type UpdateLabTestsByOrderNumMutationFn = Apollo.MutationFunction<UpdateLabTestsByOrderNumMutation, UpdateLabTestsByOrderNumMutationVariables>;

/**
 * __useUpdateLabTestsByOrderNumMutation__
 *
 * To run a mutation, you first call `useUpdateLabTestsByOrderNumMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLabTestsByOrderNumMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLabTestsByOrderNumMutation, { data, loading, error }] = useUpdateLabTestsByOrderNumMutation({
 *   variables: {
 *      updateLabTestItemInput: // value for 'updateLabTestItemInput'
 *   },
 * });
 */
export function useUpdateLabTestsByOrderNumMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLabTestsByOrderNumMutation, UpdateLabTestsByOrderNumMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLabTestsByOrderNumMutation, UpdateLabTestsByOrderNumMutationVariables>(UpdateLabTestsByOrderNumDocument, options);
      }
export type UpdateLabTestsByOrderNumMutationHookResult = ReturnType<typeof useUpdateLabTestsByOrderNumMutation>;
export type UpdateLabTestsByOrderNumMutationResult = Apollo.MutationResult<UpdateLabTestsByOrderNumMutation>;
export type UpdateLabTestsByOrderNumMutationOptions = Apollo.BaseMutationOptions<UpdateLabTestsByOrderNumMutation, UpdateLabTestsByOrderNumMutationVariables>;
export const RemoveLabTestDocument = gql`
    mutation RemoveLabTest($removeLabTest: RemoveLabTest!) {
  removeLabTest(removeLabTest: $removeLabTest) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type RemoveLabTestMutationFn = Apollo.MutationFunction<RemoveLabTestMutation, RemoveLabTestMutationVariables>;

/**
 * __useRemoveLabTestMutation__
 *
 * To run a mutation, you first call `useRemoveLabTestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveLabTestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeLabTestMutation, { data, loading, error }] = useRemoveLabTestMutation({
 *   variables: {
 *      removeLabTest: // value for 'removeLabTest'
 *   },
 * });
 */
export function useRemoveLabTestMutation(baseOptions?: Apollo.MutationHookOptions<RemoveLabTestMutation, RemoveLabTestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveLabTestMutation, RemoveLabTestMutationVariables>(RemoveLabTestDocument, options);
      }
export type RemoveLabTestMutationHookResult = ReturnType<typeof useRemoveLabTestMutation>;
export type RemoveLabTestMutationResult = Apollo.MutationResult<RemoveLabTestMutation>;
export type RemoveLabTestMutationOptions = Apollo.BaseMutationOptions<RemoveLabTestMutation, RemoveLabTestMutationVariables>;
export const RemoveLabTestObservationDocument = gql`
    mutation RemoveLabTestObservation($removeLabTestObservation: RemoveLabTestObservation!) {
  removeLabTestObservation(removeLabTestObservation: $removeLabTestObservation) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type RemoveLabTestObservationMutationFn = Apollo.MutationFunction<RemoveLabTestObservationMutation, RemoveLabTestObservationMutationVariables>;

/**
 * __useRemoveLabTestObservationMutation__
 *
 * To run a mutation, you first call `useRemoveLabTestObservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveLabTestObservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeLabTestObservationMutation, { data, loading, error }] = useRemoveLabTestObservationMutation({
 *   variables: {
 *      removeLabTestObservation: // value for 'removeLabTestObservation'
 *   },
 * });
 */
export function useRemoveLabTestObservationMutation(baseOptions?: Apollo.MutationHookOptions<RemoveLabTestObservationMutation, RemoveLabTestObservationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveLabTestObservationMutation, RemoveLabTestObservationMutationVariables>(RemoveLabTestObservationDocument, options);
      }
export type RemoveLabTestObservationMutationHookResult = ReturnType<typeof useRemoveLabTestObservationMutation>;
export type RemoveLabTestObservationMutationResult = Apollo.MutationResult<RemoveLabTestObservationMutation>;
export type RemoveLabTestObservationMutationOptions = Apollo.BaseMutationOptions<RemoveLabTestObservationMutation, RemoveLabTestObservationMutationVariables>;
export const UpdateLabTestObservationDocument = gql`
    mutation UpdateLabTestObservation($updateLabTestObservationInput: UpdateLabTestObservationInput!) {
  updateLabTestObservation(
    updateLabTestObservationInput: $updateLabTestObservationInput
  ) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type UpdateLabTestObservationMutationFn = Apollo.MutationFunction<UpdateLabTestObservationMutation, UpdateLabTestObservationMutationVariables>;

/**
 * __useUpdateLabTestObservationMutation__
 *
 * To run a mutation, you first call `useUpdateLabTestObservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLabTestObservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLabTestObservationMutation, { data, loading, error }] = useUpdateLabTestObservationMutation({
 *   variables: {
 *      updateLabTestObservationInput: // value for 'updateLabTestObservationInput'
 *   },
 * });
 */
export function useUpdateLabTestObservationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLabTestObservationMutation, UpdateLabTestObservationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLabTestObservationMutation, UpdateLabTestObservationMutationVariables>(UpdateLabTestObservationDocument, options);
      }
export type UpdateLabTestObservationMutationHookResult = ReturnType<typeof useUpdateLabTestObservationMutation>;
export type UpdateLabTestObservationMutationResult = Apollo.MutationResult<UpdateLabTestObservationMutation>;
export type UpdateLabTestObservationMutationOptions = Apollo.BaseMutationOptions<UpdateLabTestObservationMutation, UpdateLabTestObservationMutationVariables>;
export const FindAllPatientDocument = gql`
    query FindAllPatient($patientInput: PatientInput!) {
  findAllPatient(patientInput: $patientInput) {
    pagination {
      page
      totalPages
    }
    response {
      error
      status
      message
    }
    patients {
      id
      email
      lastName
      firstName
      patientRecord
      contacts {
        id
        name
        city
        email
        phone
        primaryContact
      }
    }
  }
}
    `;

/**
 * __useFindAllPatientQuery__
 *
 * To run a query within a React component, call `useFindAllPatientQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllPatientQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllPatientQuery({
 *   variables: {
 *      patientInput: // value for 'patientInput'
 *   },
 * });
 */
export function useFindAllPatientQuery(baseOptions: Apollo.QueryHookOptions<FindAllPatientQuery, FindAllPatientQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllPatientQuery, FindAllPatientQueryVariables>(FindAllPatientDocument, options);
      }
export function useFindAllPatientLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllPatientQuery, FindAllPatientQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllPatientQuery, FindAllPatientQueryVariables>(FindAllPatientDocument, options);
        }
export type FindAllPatientQueryHookResult = ReturnType<typeof useFindAllPatientQuery>;
export type FindAllPatientLazyQueryHookResult = ReturnType<typeof useFindAllPatientLazyQuery>;
export type FindAllPatientQueryResult = Apollo.QueryResult<FindAllPatientQuery, FindAllPatientQueryVariables>;
export const FetchAllPatientDocument = gql`
    query FetchAllPatient($patientInput: PatientInput!) {
  fetchAllPatients(patientInput: $patientInput) {
    pagination {
      page
      totalPages
    }
    response {
      error
      status
      message
    }
    patients {
      id
      email
      dob
      lastName
      firstName
      patientRecord
      contacts {
        id
        name
        city
        email
        phone
        primaryContact
      }
    }
  }
}
    `;

/**
 * __useFetchAllPatientQuery__
 *
 * To run a query within a React component, call `useFetchAllPatientQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchAllPatientQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchAllPatientQuery({
 *   variables: {
 *      patientInput: // value for 'patientInput'
 *   },
 * });
 */
export function useFetchAllPatientQuery(baseOptions: Apollo.QueryHookOptions<FetchAllPatientQuery, FetchAllPatientQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchAllPatientQuery, FetchAllPatientQueryVariables>(FetchAllPatientDocument, options);
      }
export function useFetchAllPatientLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchAllPatientQuery, FetchAllPatientQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchAllPatientQuery, FetchAllPatientQueryVariables>(FetchAllPatientDocument, options);
        }
export type FetchAllPatientQueryHookResult = ReturnType<typeof useFetchAllPatientQuery>;
export type FetchAllPatientLazyQueryHookResult = ReturnType<typeof useFetchAllPatientLazyQuery>;
export type FetchAllPatientQueryResult = Apollo.QueryResult<FetchAllPatientQuery, FetchAllPatientQueryVariables>;
export const GetPatientDocument = gql`
    query GetPatient($getPatient: GetPatient!) {
  getPatient(getPatient: $getPatient) {
    response {
      name
      error
      status
      message
    }
    patient {
      id
      email
      firstName
      middleName
      lastName
      suffix
      facilityId
      inviteAccepted
      patientRecord
      firstNameUsed
      prefferedName
      previousFirstName
      previouslastName
      motherMaidenName
      registrationDate
      ssn
      gender
      dob
      phonePermission
      pharmacy
      medicationHistoryAuthority
      releaseOfInfoBill
      smsPermission
      deceasedDate
      privacyNotice
      releaseOfInfoBill
      callToConsent
      medicationHistoryAuthority
      preferredCommunicationMethod
      patientNote
      language
      race
      ethnicity
      maritialStatus
      sexualOrientation
      genderIdentity
      sexAtBirth
      pronouns
      homeBound
      holdStatement
      statementDelivereOnline
      statementNote
      statementNoteDateFrom
      statementNoteDateTo
      patientNoteOpen
      createdAt
      updatedAt
      doctorPatients {
        id
        doctorId
        currentProvider
        otherRelation
        relation
        doctor {
          id
          firstName
          lastName
          createdAt
          updatedAt
        }
      }
      attachments {
        id
        key
        url
        type
        title
        typeId
        createdAt
        updatedAt
      }
      contacts {
        id
        fax
        ssn
        city
        email
        pager
        phone
        mobile
        address
        address2
        state
        zipCode
        country
        name
        suffix
        firstName
        primaryContact
        middleName
        lastName
        serviceCode
        employerName
        relationship
        contactType
        createdAt
        updatedAt
      }
      employer {
        id
        name
        email
        phone
        mobile
        industry
        usualOccupation
        city
        state
        zipCode
        address
        createdAt
        updatedAt
      }
      facility {
        id
        name
        isPrivate
        serviceCode
        updatedAt
      }
    }
  }
}
    `;

/**
 * __useGetPatientQuery__
 *
 * To run a query within a React component, call `useGetPatientQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPatientQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPatientQuery({
 *   variables: {
 *      getPatient: // value for 'getPatient'
 *   },
 * });
 */
export function useGetPatientQuery(baseOptions: Apollo.QueryHookOptions<GetPatientQuery, GetPatientQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPatientQuery, GetPatientQueryVariables>(GetPatientDocument, options);
      }
export function useGetPatientLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPatientQuery, GetPatientQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPatientQuery, GetPatientQueryVariables>(GetPatientDocument, options);
        }
export type GetPatientQueryHookResult = ReturnType<typeof useGetPatientQuery>;
export type GetPatientLazyQueryHookResult = ReturnType<typeof useGetPatientLazyQuery>;
export type GetPatientQueryResult = Apollo.QueryResult<GetPatientQuery, GetPatientQueryVariables>;
export const RemovePatientDocument = gql`
    mutation RemovePatient($removePatient: RemovePatient!) {
  removePatient(removePatient: $removePatient) {
    response {
      name
      status
      message
    }
  }
}
    `;
export type RemovePatientMutationFn = Apollo.MutationFunction<RemovePatientMutation, RemovePatientMutationVariables>;

/**
 * __useRemovePatientMutation__
 *
 * To run a mutation, you first call `useRemovePatientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePatientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePatientMutation, { data, loading, error }] = useRemovePatientMutation({
 *   variables: {
 *      removePatient: // value for 'removePatient'
 *   },
 * });
 */
export function useRemovePatientMutation(baseOptions?: Apollo.MutationHookOptions<RemovePatientMutation, RemovePatientMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemovePatientMutation, RemovePatientMutationVariables>(RemovePatientDocument, options);
      }
export type RemovePatientMutationHookResult = ReturnType<typeof useRemovePatientMutation>;
export type RemovePatientMutationResult = Apollo.MutationResult<RemovePatientMutation>;
export type RemovePatientMutationOptions = Apollo.BaseMutationOptions<RemovePatientMutation, RemovePatientMutationVariables>;
export const CreatePatientDocument = gql`
    mutation CreatePatient($createPatientInput: CreatePatientInput!) {
  createPatient(createPatientInput: $createPatientInput) {
    response {
      error
      status
      message
    }
    patient {
      id
    }
  }
}
    `;
export type CreatePatientMutationFn = Apollo.MutationFunction<CreatePatientMutation, CreatePatientMutationVariables>;

/**
 * __useCreatePatientMutation__
 *
 * To run a mutation, you first call `useCreatePatientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePatientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPatientMutation, { data, loading, error }] = useCreatePatientMutation({
 *   variables: {
 *      createPatientInput: // value for 'createPatientInput'
 *   },
 * });
 */
export function useCreatePatientMutation(baseOptions?: Apollo.MutationHookOptions<CreatePatientMutation, CreatePatientMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePatientMutation, CreatePatientMutationVariables>(CreatePatientDocument, options);
      }
export type CreatePatientMutationHookResult = ReturnType<typeof useCreatePatientMutation>;
export type CreatePatientMutationResult = Apollo.MutationResult<CreatePatientMutation>;
export type CreatePatientMutationOptions = Apollo.BaseMutationOptions<CreatePatientMutation, CreatePatientMutationVariables>;
export const UpdatePatientDocument = gql`
    mutation UpdatePatient($updatePatientInput: UpdatePatientInput!) {
  updatePatient(updatePatientInput: $updatePatientInput) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type UpdatePatientMutationFn = Apollo.MutationFunction<UpdatePatientMutation, UpdatePatientMutationVariables>;

/**
 * __useUpdatePatientMutation__
 *
 * To run a mutation, you first call `useUpdatePatientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePatientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePatientMutation, { data, loading, error }] = useUpdatePatientMutation({
 *   variables: {
 *      updatePatientInput: // value for 'updatePatientInput'
 *   },
 * });
 */
export function useUpdatePatientMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePatientMutation, UpdatePatientMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePatientMutation, UpdatePatientMutationVariables>(UpdatePatientDocument, options);
      }
export type UpdatePatientMutationHookResult = ReturnType<typeof useUpdatePatientMutation>;
export type UpdatePatientMutationResult = Apollo.MutationResult<UpdatePatientMutation>;
export type UpdatePatientMutationOptions = Apollo.BaseMutationOptions<UpdatePatientMutation, UpdatePatientMutationVariables>;
export const SendInviteToPatientDocument = gql`
    mutation SendInviteToPatient($patientInviteInput: PatientInviteInput!) {
  sendInviteToPatient(patientInviteInput: $patientInviteInput) {
    response {
      status
      error
      message
    }
    patient {
      id
      firstName
      middleName
      lastName
      suffix
      firstNameUsed
      prefferedName
      previousFirstName
      previouslastName
      motherMaidenName
      inviteAccepted
      ssn
      gender
      dob
      phonePermission
      pharmacy
      medicationHistoryAuthority
      releaseOfInfoBill
      smsPermission
      deceasedDate
      privacyNotice
      releaseOfInfoBill
      callToConsent
      medicationHistoryAuthority
      preferredCommunicationMethod
      patientNote
      language
      race
      ethnicity
      maritialStatus
      sexualOrientation
      genderIdentity
      sexAtBirth
      pronouns
      homeBound
      holdStatement
      statementDelivereOnline
      statementNote
      statementNoteDateFrom
      statementNoteDateTo
      createdAt
      updatedAt
      doctorPatients {
        id
        doctorId
        currentProvider
        otherRelation
        relation
        doctor {
          id
          firstName
          lastName
          createdAt
          updatedAt
        }
      }
      attachments {
        id
        key
        url
        type
        title
        typeId
        createdAt
        updatedAt
      }
      contacts {
        id
        fax
        ssn
        city
        email
        pager
        phone
        mobile
        address
        address2
        state
        zipCode
        country
        name
        suffix
        firstName
        primaryContact
        middleName
        lastName
        serviceCode
        employerName
        relationship
        contactType
        createdAt
        updatedAt
      }
      employer {
        id
        name
        email
        phone
        mobile
        industry
        usualOccupation
        createdAt
        updatedAt
      }
      facility {
        id
        name
        isPrivate
        serviceCode
        updatedAt
      }
    }
  }
}
    `;
export type SendInviteToPatientMutationFn = Apollo.MutationFunction<SendInviteToPatientMutation, SendInviteToPatientMutationVariables>;

/**
 * __useSendInviteToPatientMutation__
 *
 * To run a mutation, you first call `useSendInviteToPatientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendInviteToPatientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendInviteToPatientMutation, { data, loading, error }] = useSendInviteToPatientMutation({
 *   variables: {
 *      patientInviteInput: // value for 'patientInviteInput'
 *   },
 * });
 */
export function useSendInviteToPatientMutation(baseOptions?: Apollo.MutationHookOptions<SendInviteToPatientMutation, SendInviteToPatientMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendInviteToPatientMutation, SendInviteToPatientMutationVariables>(SendInviteToPatientDocument, options);
      }
export type SendInviteToPatientMutationHookResult = ReturnType<typeof useSendInviteToPatientMutation>;
export type SendInviteToPatientMutationResult = Apollo.MutationResult<SendInviteToPatientMutation>;
export type SendInviteToPatientMutationOptions = Apollo.BaseMutationOptions<SendInviteToPatientMutation, SendInviteToPatientMutationVariables>;
export const UpdatePatientNoteInfoDocument = gql`
    mutation UpdatePatientNoteInfo($updatePatientNoteInfoInputs: UpdatePatientNoteInfoInputs!) {
  updatePatientNoteInfo(updatePatientNoteInfoInputs: $updatePatientNoteInfoInputs) {
    response {
      status
      error
      message
    }
    patient {
      id
      patientNote
      patientNoteOpen
    }
  }
}
    `;
export type UpdatePatientNoteInfoMutationFn = Apollo.MutationFunction<UpdatePatientNoteInfoMutation, UpdatePatientNoteInfoMutationVariables>;

/**
 * __useUpdatePatientNoteInfoMutation__
 *
 * To run a mutation, you first call `useUpdatePatientNoteInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePatientNoteInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePatientNoteInfoMutation, { data, loading, error }] = useUpdatePatientNoteInfoMutation({
 *   variables: {
 *      updatePatientNoteInfoInputs: // value for 'updatePatientNoteInfoInputs'
 *   },
 * });
 */
export function useUpdatePatientNoteInfoMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePatientNoteInfoMutation, UpdatePatientNoteInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePatientNoteInfoMutation, UpdatePatientNoteInfoMutationVariables>(UpdatePatientNoteInfoDocument, options);
      }
export type UpdatePatientNoteInfoMutationHookResult = ReturnType<typeof useUpdatePatientNoteInfoMutation>;
export type UpdatePatientNoteInfoMutationResult = Apollo.MutationResult<UpdatePatientNoteInfoMutation>;
export type UpdatePatientNoteInfoMutationOptions = Apollo.BaseMutationOptions<UpdatePatientNoteInfoMutation, UpdatePatientNoteInfoMutationVariables>;
export const UpdatePatientProviderDocument = gql`
    mutation UpdatePatientProvider($updatePatientProvider: UpdatePatientProvider!) {
  updatePatientProvider(updatePatientProvider: $updatePatientProvider) {
    response {
      status
      message
    }
  }
}
    `;
export type UpdatePatientProviderMutationFn = Apollo.MutationFunction<UpdatePatientProviderMutation, UpdatePatientProviderMutationVariables>;

/**
 * __useUpdatePatientProviderMutation__
 *
 * To run a mutation, you first call `useUpdatePatientProviderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePatientProviderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePatientProviderMutation, { data, loading, error }] = useUpdatePatientProviderMutation({
 *   variables: {
 *      updatePatientProvider: // value for 'updatePatientProvider'
 *   },
 * });
 */
export function useUpdatePatientProviderMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePatientProviderMutation, UpdatePatientProviderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePatientProviderMutation, UpdatePatientProviderMutationVariables>(UpdatePatientProviderDocument, options);
      }
export type UpdatePatientProviderMutationHookResult = ReturnType<typeof useUpdatePatientProviderMutation>;
export type UpdatePatientProviderMutationResult = Apollo.MutationResult<UpdatePatientProviderMutation>;
export type UpdatePatientProviderMutationOptions = Apollo.BaseMutationOptions<UpdatePatientProviderMutation, UpdatePatientProviderMutationVariables>;
export const UpdatePatientProviderRelationDocument = gql`
    mutation UpdatePatientProviderRelation($updatePatientProviderRelationInputs: UpdatePatientProviderRelationInputs!) {
  updatePatientProviderRelation(
    updatePatientProviderRelationInputs: $updatePatientProviderRelationInputs
  ) {
    response {
      status
      message
    }
  }
}
    `;
export type UpdatePatientProviderRelationMutationFn = Apollo.MutationFunction<UpdatePatientProviderRelationMutation, UpdatePatientProviderRelationMutationVariables>;

/**
 * __useUpdatePatientProviderRelationMutation__
 *
 * To run a mutation, you first call `useUpdatePatientProviderRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePatientProviderRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePatientProviderRelationMutation, { data, loading, error }] = useUpdatePatientProviderRelationMutation({
 *   variables: {
 *      updatePatientProviderRelationInputs: // value for 'updatePatientProviderRelationInputs'
 *   },
 * });
 */
export function useUpdatePatientProviderRelationMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePatientProviderRelationMutation, UpdatePatientProviderRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePatientProviderRelationMutation, UpdatePatientProviderRelationMutationVariables>(UpdatePatientProviderRelationDocument, options);
      }
export type UpdatePatientProviderRelationMutationHookResult = ReturnType<typeof useUpdatePatientProviderRelationMutation>;
export type UpdatePatientProviderRelationMutationResult = Apollo.MutationResult<UpdatePatientProviderRelationMutation>;
export type UpdatePatientProviderRelationMutationOptions = Apollo.BaseMutationOptions<UpdatePatientProviderRelationMutation, UpdatePatientProviderRelationMutationVariables>;
export const GetPatientProvidersDocument = gql`
    query GetPatientProviders($getPatient: GetPatient!) {
  getPatientProviders(getPatient: $getPatient) {
    response {
      name
      error
      status
      message
    }
    providers {
      id
      doctorId
      patientId
      currentProvider
      otherRelation
      relation
      createdAt
      updatedAt
      doctor {
        id
        firstName
        lastName
        email
        speciality
        contacts {
          id
          name
          city
          email
          phone
          primaryContact
        }
      }
    }
  }
}
    `;

/**
 * __useGetPatientProvidersQuery__
 *
 * To run a query within a React component, call `useGetPatientProvidersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPatientProvidersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPatientProvidersQuery({
 *   variables: {
 *      getPatient: // value for 'getPatient'
 *   },
 * });
 */
export function useGetPatientProvidersQuery(baseOptions: Apollo.QueryHookOptions<GetPatientProvidersQuery, GetPatientProvidersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPatientProvidersQuery, GetPatientProvidersQueryVariables>(GetPatientProvidersDocument, options);
      }
export function useGetPatientProvidersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPatientProvidersQuery, GetPatientProvidersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPatientProvidersQuery, GetPatientProvidersQueryVariables>(GetPatientProvidersDocument, options);
        }
export type GetPatientProvidersQueryHookResult = ReturnType<typeof useGetPatientProvidersQuery>;
export type GetPatientProvidersLazyQueryHookResult = ReturnType<typeof useGetPatientProvidersLazyQuery>;
export type GetPatientProvidersQueryResult = Apollo.QueryResult<GetPatientProvidersQuery, GetPatientProvidersQueryVariables>;
export const GetPatientProviderDocument = gql`
    query GetPatientProvider($patientProviderInputs: PatientProviderInputs!) {
  getPatientProvider(patientProviderInputs: $patientProviderInputs) {
    response {
      name
      error
      status
      message
    }
    provider {
      id
      doctorId
      patientId
      currentProvider
      otherRelation
      relation
      createdAt
      updatedAt
      doctor {
        id
        firstName
        lastName
        email
        speciality
        contacts {
          id
          name
          city
          email
          phone
          primaryContact
        }
      }
    }
  }
}
    `;

/**
 * __useGetPatientProviderQuery__
 *
 * To run a query within a React component, call `useGetPatientProviderQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPatientProviderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPatientProviderQuery({
 *   variables: {
 *      patientProviderInputs: // value for 'patientProviderInputs'
 *   },
 * });
 */
export function useGetPatientProviderQuery(baseOptions: Apollo.QueryHookOptions<GetPatientProviderQuery, GetPatientProviderQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPatientProviderQuery, GetPatientProviderQueryVariables>(GetPatientProviderDocument, options);
      }
export function useGetPatientProviderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPatientProviderQuery, GetPatientProviderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPatientProviderQuery, GetPatientProviderQueryVariables>(GetPatientProviderDocument, options);
        }
export type GetPatientProviderQueryHookResult = ReturnType<typeof useGetPatientProviderQuery>;
export type GetPatientProviderLazyQueryHookResult = ReturnType<typeof useGetPatientProviderLazyQuery>;
export type GetPatientProviderQueryResult = Apollo.QueryResult<GetPatientProviderQuery, GetPatientProviderQueryVariables>;
export const GetTokenDocument = gql`
    query GetToken {
  getToken {
    clientToken
  }
}
    `;

/**
 * __useGetTokenQuery__
 *
 * To run a query within a React component, call `useGetTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTokenQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTokenQuery(baseOptions?: Apollo.QueryHookOptions<GetTokenQuery, GetTokenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTokenQuery, GetTokenQueryVariables>(GetTokenDocument, options);
      }
export function useGetTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTokenQuery, GetTokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTokenQuery, GetTokenQueryVariables>(GetTokenDocument, options);
        }
export type GetTokenQueryHookResult = ReturnType<typeof useGetTokenQuery>;
export type GetTokenLazyQueryHookResult = ReturnType<typeof useGetTokenLazyQuery>;
export type GetTokenQueryResult = Apollo.QueryResult<GetTokenQuery, GetTokenQueryVariables>;
export const ChargeAfterAppointmentDocument = gql`
    mutation ChargeAfterAppointment($paymentInput: PaymentInputsAfterAppointment!) {
  chargeAfterAppointment(paymentInput: $paymentInput) {
    response {
      error
      status
      message
      name
    }
    appointment {
      id
      billingStatus
    }
  }
}
    `;
export type ChargeAfterAppointmentMutationFn = Apollo.MutationFunction<ChargeAfterAppointmentMutation, ChargeAfterAppointmentMutationVariables>;

/**
 * __useChargeAfterAppointmentMutation__
 *
 * To run a mutation, you first call `useChargeAfterAppointmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChargeAfterAppointmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chargeAfterAppointmentMutation, { data, loading, error }] = useChargeAfterAppointmentMutation({
 *   variables: {
 *      paymentInput: // value for 'paymentInput'
 *   },
 * });
 */
export function useChargeAfterAppointmentMutation(baseOptions?: Apollo.MutationHookOptions<ChargeAfterAppointmentMutation, ChargeAfterAppointmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChargeAfterAppointmentMutation, ChargeAfterAppointmentMutationVariables>(ChargeAfterAppointmentDocument, options);
      }
export type ChargeAfterAppointmentMutationHookResult = ReturnType<typeof useChargeAfterAppointmentMutation>;
export type ChargeAfterAppointmentMutationResult = Apollo.MutationResult<ChargeAfterAppointmentMutation>;
export type ChargeAfterAppointmentMutationOptions = Apollo.BaseMutationOptions<ChargeAfterAppointmentMutation, ChargeAfterAppointmentMutationVariables>;
export const ChargePaymentDocument = gql`
    mutation ChargePayment($paymentInput: PaymentInput!) {
  chargePayment(paymentInput: $paymentInput) {
    response {
      error
      status
      message
      name
    }
    transaction {
      id
      status
    }
  }
}
    `;
export type ChargePaymentMutationFn = Apollo.MutationFunction<ChargePaymentMutation, ChargePaymentMutationVariables>;

/**
 * __useChargePaymentMutation__
 *
 * To run a mutation, you first call `useChargePaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChargePaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chargePaymentMutation, { data, loading, error }] = useChargePaymentMutation({
 *   variables: {
 *      paymentInput: // value for 'paymentInput'
 *   },
 * });
 */
export function useChargePaymentMutation(baseOptions?: Apollo.MutationHookOptions<ChargePaymentMutation, ChargePaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChargePaymentMutation, ChargePaymentMutationVariables>(ChargePaymentDocument, options);
      }
export type ChargePaymentMutationHookResult = ReturnType<typeof useChargePaymentMutation>;
export type ChargePaymentMutationResult = Apollo.MutationResult<ChargePaymentMutation>;
export type ChargePaymentMutationOptions = Apollo.BaseMutationOptions<ChargePaymentMutation, ChargePaymentMutationVariables>;
export const AchPaymentDocument = gql`
    mutation AchPayment($achPaymentInputs: ACHPaymentInputs!) {
  achPayment(achPaymentInputs: $achPaymentInputs) {
    response {
      error
      status
      message
      name
    }
    transaction {
      id
      status
    }
  }
}
    `;
export type AchPaymentMutationFn = Apollo.MutationFunction<AchPaymentMutation, AchPaymentMutationVariables>;

/**
 * __useAchPaymentMutation__
 *
 * To run a mutation, you first call `useAchPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAchPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [achPaymentMutation, { data, loading, error }] = useAchPaymentMutation({
 *   variables: {
 *      achPaymentInputs: // value for 'achPaymentInputs'
 *   },
 * });
 */
export function useAchPaymentMutation(baseOptions?: Apollo.MutationHookOptions<AchPaymentMutation, AchPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AchPaymentMutation, AchPaymentMutationVariables>(AchPaymentDocument, options);
      }
export type AchPaymentMutationHookResult = ReturnType<typeof useAchPaymentMutation>;
export type AchPaymentMutationResult = Apollo.MutationResult<AchPaymentMutation>;
export type AchPaymentMutationOptions = Apollo.BaseMutationOptions<AchPaymentMutation, AchPaymentMutationVariables>;
export const FindAllPermissionsDocument = gql`
    query FindAllPermissions($permissionInput: PermissionInput!) {
  findAllPermissions(permissionInput: $permissionInput) {
    pagination {
      totalPages
    }
    permissions {
      id
      name
      moduleType
      status
    }
  }
}
    `;

/**
 * __useFindAllPermissionsQuery__
 *
 * To run a query within a React component, call `useFindAllPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllPermissionsQuery({
 *   variables: {
 *      permissionInput: // value for 'permissionInput'
 *   },
 * });
 */
export function useFindAllPermissionsQuery(baseOptions: Apollo.QueryHookOptions<FindAllPermissionsQuery, FindAllPermissionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllPermissionsQuery, FindAllPermissionsQueryVariables>(FindAllPermissionsDocument, options);
      }
export function useFindAllPermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllPermissionsQuery, FindAllPermissionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllPermissionsQuery, FindAllPermissionsQueryVariables>(FindAllPermissionsDocument, options);
        }
export type FindAllPermissionsQueryHookResult = ReturnType<typeof useFindAllPermissionsQuery>;
export type FindAllPermissionsLazyQueryHookResult = ReturnType<typeof useFindAllPermissionsLazyQuery>;
export type FindAllPermissionsQueryResult = Apollo.QueryResult<FindAllPermissionsQuery, FindAllPermissionsQueryVariables>;
export const AssignPermissionToRoleDocument = gql`
    mutation AssignPermissionToRole($rolePermissionItemInput: RolePermissionItemInput!) {
  assignPermissionToRole(rolePermissionItemInput: $rolePermissionItemInput) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type AssignPermissionToRoleMutationFn = Apollo.MutationFunction<AssignPermissionToRoleMutation, AssignPermissionToRoleMutationVariables>;

/**
 * __useAssignPermissionToRoleMutation__
 *
 * To run a mutation, you first call `useAssignPermissionToRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignPermissionToRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignPermissionToRoleMutation, { data, loading, error }] = useAssignPermissionToRoleMutation({
 *   variables: {
 *      rolePermissionItemInput: // value for 'rolePermissionItemInput'
 *   },
 * });
 */
export function useAssignPermissionToRoleMutation(baseOptions?: Apollo.MutationHookOptions<AssignPermissionToRoleMutation, AssignPermissionToRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AssignPermissionToRoleMutation, AssignPermissionToRoleMutationVariables>(AssignPermissionToRoleDocument, options);
      }
export type AssignPermissionToRoleMutationHookResult = ReturnType<typeof useAssignPermissionToRoleMutation>;
export type AssignPermissionToRoleMutationResult = Apollo.MutationResult<AssignPermissionToRoleMutation>;
export type AssignPermissionToRoleMutationOptions = Apollo.BaseMutationOptions<AssignPermissionToRoleMutation, AssignPermissionToRoleMutationVariables>;
export const FindAllPracticesDocument = gql`
    query FindAllPractices($practiceInput: PracticeInput!) {
  findAllPractices(practiceInput: $practiceInput) {
    response {
      error
      status
      message
    }
    pagination {
      page
      totalPages
    }
    practices {
      id
      name
      phone
      createdAt
    }
  }
}
    `;

/**
 * __useFindAllPracticesQuery__
 *
 * To run a query within a React component, call `useFindAllPracticesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllPracticesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllPracticesQuery({
 *   variables: {
 *      practiceInput: // value for 'practiceInput'
 *   },
 * });
 */
export function useFindAllPracticesQuery(baseOptions: Apollo.QueryHookOptions<FindAllPracticesQuery, FindAllPracticesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllPracticesQuery, FindAllPracticesQueryVariables>(FindAllPracticesDocument, options);
      }
export function useFindAllPracticesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllPracticesQuery, FindAllPracticesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllPracticesQuery, FindAllPracticesQueryVariables>(FindAllPracticesDocument, options);
        }
export type FindAllPracticesQueryHookResult = ReturnType<typeof useFindAllPracticesQuery>;
export type FindAllPracticesLazyQueryHookResult = ReturnType<typeof useFindAllPracticesLazyQuery>;
export type FindAllPracticesQueryResult = Apollo.QueryResult<FindAllPracticesQuery, FindAllPracticesQueryVariables>;
export const GetPracticeDocument = gql`
    query GetPractice($getPractice: GetPractice!) {
  getPractice(getPractice: $getPractice) {
    response {
      error
      status
      message
    }
    practice {
      id
      name
      phone
      practiceId
      ein
      fax
      upin
      medicare
      medicaid
      champus
      createdAt
      updatedAt
      attachments {
        id
        key
        url
        type
        title
        typeId
        createdAt
        updatedAt
      }
    }
  }
}
    `;

/**
 * __useGetPracticeQuery__
 *
 * To run a query within a React component, call `useGetPracticeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPracticeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPracticeQuery({
 *   variables: {
 *      getPractice: // value for 'getPractice'
 *   },
 * });
 */
export function useGetPracticeQuery(baseOptions: Apollo.QueryHookOptions<GetPracticeQuery, GetPracticeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPracticeQuery, GetPracticeQueryVariables>(GetPracticeDocument, options);
      }
export function useGetPracticeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPracticeQuery, GetPracticeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPracticeQuery, GetPracticeQueryVariables>(GetPracticeDocument, options);
        }
export type GetPracticeQueryHookResult = ReturnType<typeof useGetPracticeQuery>;
export type GetPracticeLazyQueryHookResult = ReturnType<typeof useGetPracticeLazyQuery>;
export type GetPracticeQueryResult = Apollo.QueryResult<GetPracticeQuery, GetPracticeQueryVariables>;
export const CreatePracticeDocument = gql`
    mutation CreatePractice($createPracticeInput: CreatePracticeInput!) {
  createPractice(createPracticeInput: $createPracticeInput) {
    response {
      error
      status
      message
    }
    practice {
      id
      name
    }
  }
}
    `;
export type CreatePracticeMutationFn = Apollo.MutationFunction<CreatePracticeMutation, CreatePracticeMutationVariables>;

/**
 * __useCreatePracticeMutation__
 *
 * To run a mutation, you first call `useCreatePracticeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePracticeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPracticeMutation, { data, loading, error }] = useCreatePracticeMutation({
 *   variables: {
 *      createPracticeInput: // value for 'createPracticeInput'
 *   },
 * });
 */
export function useCreatePracticeMutation(baseOptions?: Apollo.MutationHookOptions<CreatePracticeMutation, CreatePracticeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePracticeMutation, CreatePracticeMutationVariables>(CreatePracticeDocument, options);
      }
export type CreatePracticeMutationHookResult = ReturnType<typeof useCreatePracticeMutation>;
export type CreatePracticeMutationResult = Apollo.MutationResult<CreatePracticeMutation>;
export type CreatePracticeMutationOptions = Apollo.BaseMutationOptions<CreatePracticeMutation, CreatePracticeMutationVariables>;
export const UpdatePracticeDocument = gql`
    mutation UpdatePractice($updatePracticeInput: UpdatePracticeInput!) {
  updatePractice(updatePracticeInput: $updatePracticeInput) {
    response {
      error
      status
      message
    }
    practice {
      id
      name
    }
  }
}
    `;
export type UpdatePracticeMutationFn = Apollo.MutationFunction<UpdatePracticeMutation, UpdatePracticeMutationVariables>;

/**
 * __useUpdatePracticeMutation__
 *
 * To run a mutation, you first call `useUpdatePracticeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePracticeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePracticeMutation, { data, loading, error }] = useUpdatePracticeMutation({
 *   variables: {
 *      updatePracticeInput: // value for 'updatePracticeInput'
 *   },
 * });
 */
export function useUpdatePracticeMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePracticeMutation, UpdatePracticeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePracticeMutation, UpdatePracticeMutationVariables>(UpdatePracticeDocument, options);
      }
export type UpdatePracticeMutationHookResult = ReturnType<typeof useUpdatePracticeMutation>;
export type UpdatePracticeMutationResult = Apollo.MutationResult<UpdatePracticeMutation>;
export type UpdatePracticeMutationOptions = Apollo.BaseMutationOptions<UpdatePracticeMutation, UpdatePracticeMutationVariables>;
export const RemovePracticeDocument = gql`
    mutation RemovePractice($removePractice: RemovePractice!) {
  removePractice(removePractice: $removePractice) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type RemovePracticeMutationFn = Apollo.MutationFunction<RemovePracticeMutation, RemovePracticeMutationVariables>;

/**
 * __useRemovePracticeMutation__
 *
 * To run a mutation, you first call `useRemovePracticeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePracticeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePracticeMutation, { data, loading, error }] = useRemovePracticeMutation({
 *   variables: {
 *      removePractice: // value for 'removePractice'
 *   },
 * });
 */
export function useRemovePracticeMutation(baseOptions?: Apollo.MutationHookOptions<RemovePracticeMutation, RemovePracticeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemovePracticeMutation, RemovePracticeMutationVariables>(RemovePracticeDocument, options);
      }
export type RemovePracticeMutationHookResult = ReturnType<typeof useRemovePracticeMutation>;
export type RemovePracticeMutationResult = Apollo.MutationResult<RemovePracticeMutation>;
export type RemovePracticeMutationOptions = Apollo.BaseMutationOptions<RemovePracticeMutation, RemovePracticeMutationVariables>;
export const SearchIcdCodesDocument = gql`
    query SearchIcdCodes($searchIcdCodesInput: SearchIcdCodesInput!) {
  searchIcdCodes(searchIcdCodesInput: $searchIcdCodesInput) {
    icdCodes {
      id
      code
      description
      snoMedCode {
        id
        referencedComponentId
      }
    }
  }
}
    `;

/**
 * __useSearchIcdCodesQuery__
 *
 * To run a query within a React component, call `useSearchIcdCodesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchIcdCodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchIcdCodesQuery({
 *   variables: {
 *      searchIcdCodesInput: // value for 'searchIcdCodesInput'
 *   },
 * });
 */
export function useSearchIcdCodesQuery(baseOptions: Apollo.QueryHookOptions<SearchIcdCodesQuery, SearchIcdCodesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchIcdCodesQuery, SearchIcdCodesQueryVariables>(SearchIcdCodesDocument, options);
      }
export function useSearchIcdCodesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchIcdCodesQuery, SearchIcdCodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchIcdCodesQuery, SearchIcdCodesQueryVariables>(SearchIcdCodesDocument, options);
        }
export type SearchIcdCodesQueryHookResult = ReturnType<typeof useSearchIcdCodesQuery>;
export type SearchIcdCodesLazyQueryHookResult = ReturnType<typeof useSearchIcdCodesLazyQuery>;
export type SearchIcdCodesQueryResult = Apollo.QueryResult<SearchIcdCodesQuery, SearchIcdCodesQueryVariables>;
export const FetchIcdCodesDocument = gql`
    query FetchICDCodes($searchIcdCodesInput: SearchIcdCodesInput!) {
  fetchICDCodes(searchIcdCodesInput: $searchIcdCodesInput) {
    icdCodes {
      id
      code
      description
    }
  }
}
    `;

/**
 * __useFetchIcdCodesQuery__
 *
 * To run a query within a React component, call `useFetchIcdCodesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchIcdCodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchIcdCodesQuery({
 *   variables: {
 *      searchIcdCodesInput: // value for 'searchIcdCodesInput'
 *   },
 * });
 */
export function useFetchIcdCodesQuery(baseOptions: Apollo.QueryHookOptions<FetchIcdCodesQuery, FetchIcdCodesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchIcdCodesQuery, FetchIcdCodesQueryVariables>(FetchIcdCodesDocument, options);
      }
export function useFetchIcdCodesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchIcdCodesQuery, FetchIcdCodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchIcdCodesQuery, FetchIcdCodesQueryVariables>(FetchIcdCodesDocument, options);
        }
export type FetchIcdCodesQueryHookResult = ReturnType<typeof useFetchIcdCodesQuery>;
export type FetchIcdCodesLazyQueryHookResult = ReturnType<typeof useFetchIcdCodesLazyQuery>;
export type FetchIcdCodesQueryResult = Apollo.QueryResult<FetchIcdCodesQuery, FetchIcdCodesQueryVariables>;
export const FindAllReactionsDocument = gql`
    query FindAllReactions($reactionInput: ReactionInput!) {
  findAllReactions(reactionInput: $reactionInput) {
    reactions {
      id
      name
    }
    pagination {
      page
      limit
      totalCount
      totalPages
    }
  }
}
    `;

/**
 * __useFindAllReactionsQuery__
 *
 * To run a query within a React component, call `useFindAllReactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllReactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllReactionsQuery({
 *   variables: {
 *      reactionInput: // value for 'reactionInput'
 *   },
 * });
 */
export function useFindAllReactionsQuery(baseOptions: Apollo.QueryHookOptions<FindAllReactionsQuery, FindAllReactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllReactionsQuery, FindAllReactionsQueryVariables>(FindAllReactionsDocument, options);
      }
export function useFindAllReactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllReactionsQuery, FindAllReactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllReactionsQuery, FindAllReactionsQueryVariables>(FindAllReactionsDocument, options);
        }
export type FindAllReactionsQueryHookResult = ReturnType<typeof useFindAllReactionsQuery>;
export type FindAllReactionsLazyQueryHookResult = ReturnType<typeof useFindAllReactionsLazyQuery>;
export type FindAllReactionsQueryResult = Apollo.QueryResult<FindAllReactionsQuery, FindAllReactionsQueryVariables>;
export const FindAllRolesDocument = gql`
    query FindAllRoles($roleInput: RoleInput!) {
  getAllRoles(roleInput: $roleInput) {
    response {
      status
      error
      message
    }
    pagination {
      page
      totalPages
    }
    roles {
      id
      role
      description
      customRole
      rolePermissions {
        id
        permission {
          id
          name
        }
      }
    }
  }
}
    `;

/**
 * __useFindAllRolesQuery__
 *
 * To run a query within a React component, call `useFindAllRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllRolesQuery({
 *   variables: {
 *      roleInput: // value for 'roleInput'
 *   },
 * });
 */
export function useFindAllRolesQuery(baseOptions: Apollo.QueryHookOptions<FindAllRolesQuery, FindAllRolesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllRolesQuery, FindAllRolesQueryVariables>(FindAllRolesDocument, options);
      }
export function useFindAllRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllRolesQuery, FindAllRolesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllRolesQuery, FindAllRolesQueryVariables>(FindAllRolesDocument, options);
        }
export type FindAllRolesQueryHookResult = ReturnType<typeof useFindAllRolesQuery>;
export type FindAllRolesLazyQueryHookResult = ReturnType<typeof useFindAllRolesLazyQuery>;
export type FindAllRolesQueryResult = Apollo.QueryResult<FindAllRolesQuery, FindAllRolesQueryVariables>;
export const GetRoleDocument = gql`
    query GetRole($getRole: GetRole!) {
  getRole(getRole: $getRole) {
    response {
      error
      status
      message
    }
    role {
      id
      role
      customRole
      description
      rolePermissions {
        id
        permission {
          id
          name
          moduleType
          status
        }
      }
    }
  }
}
    `;

/**
 * __useGetRoleQuery__
 *
 * To run a query within a React component, call `useGetRoleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoleQuery({
 *   variables: {
 *      getRole: // value for 'getRole'
 *   },
 * });
 */
export function useGetRoleQuery(baseOptions: Apollo.QueryHookOptions<GetRoleQuery, GetRoleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRoleQuery, GetRoleQueryVariables>(GetRoleDocument, options);
      }
export function useGetRoleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoleQuery, GetRoleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRoleQuery, GetRoleQueryVariables>(GetRoleDocument, options);
        }
export type GetRoleQueryHookResult = ReturnType<typeof useGetRoleQuery>;
export type GetRoleLazyQueryHookResult = ReturnType<typeof useGetRoleLazyQuery>;
export type GetRoleQueryResult = Apollo.QueryResult<GetRoleQuery, GetRoleQueryVariables>;
export const CreateRoleDocument = gql`
    mutation CreateRole($roleItemInput: RoleItemInput!) {
  createRole(roleItemInput: $roleItemInput) {
    response {
      error
      status
      message
    }
    role {
      id
      role
    }
  }
}
    `;
export type CreateRoleMutationFn = Apollo.MutationFunction<CreateRoleMutation, CreateRoleMutationVariables>;

/**
 * __useCreateRoleMutation__
 *
 * To run a mutation, you first call `useCreateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoleMutation, { data, loading, error }] = useCreateRoleMutation({
 *   variables: {
 *      roleItemInput: // value for 'roleItemInput'
 *   },
 * });
 */
export function useCreateRoleMutation(baseOptions?: Apollo.MutationHookOptions<CreateRoleMutation, CreateRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRoleMutation, CreateRoleMutationVariables>(CreateRoleDocument, options);
      }
export type CreateRoleMutationHookResult = ReturnType<typeof useCreateRoleMutation>;
export type CreateRoleMutationResult = Apollo.MutationResult<CreateRoleMutation>;
export type CreateRoleMutationOptions = Apollo.BaseMutationOptions<CreateRoleMutation, CreateRoleMutationVariables>;
export const UpdateRoleDocument = gql`
    mutation UpdateRole($updateRoleItemInput: UpdateRoleItemInput!) {
  updateRole(updateRoleItemInput: $updateRoleItemInput) {
    response {
      status
      error
      message
    }
    role {
      id
      role
      description
    }
  }
}
    `;
export type UpdateRoleMutationFn = Apollo.MutationFunction<UpdateRoleMutation, UpdateRoleMutationVariables>;

/**
 * __useUpdateRoleMutation__
 *
 * To run a mutation, you first call `useUpdateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRoleMutation, { data, loading, error }] = useUpdateRoleMutation({
 *   variables: {
 *      updateRoleItemInput: // value for 'updateRoleItemInput'
 *   },
 * });
 */
export function useUpdateRoleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRoleMutation, UpdateRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRoleMutation, UpdateRoleMutationVariables>(UpdateRoleDocument, options);
      }
export type UpdateRoleMutationHookResult = ReturnType<typeof useUpdateRoleMutation>;
export type UpdateRoleMutationResult = Apollo.MutationResult<UpdateRoleMutation>;
export type UpdateRoleMutationOptions = Apollo.BaseMutationOptions<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const UpdateUserRoleDocument = gql`
    mutation UpdateUserRole($updateUserRoleItemInput: UpdateRoleInput!) {
  updateUserRole(user: $updateUserRoleItemInput) {
    response {
      status
      error
      message
    }
    user {
      id
      roles {
        id
        role
        rolePermissions {
          id
          permission {
            id
            name
          }
        }
      }
    }
  }
}
    `;
export type UpdateUserRoleMutationFn = Apollo.MutationFunction<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>;

/**
 * __useUpdateUserRoleMutation__
 *
 * To run a mutation, you first call `useUpdateUserRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserRoleMutation, { data, loading, error }] = useUpdateUserRoleMutation({
 *   variables: {
 *      updateUserRoleItemInput: // value for 'updateUserRoleItemInput'
 *   },
 * });
 */
export function useUpdateUserRoleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>(UpdateUserRoleDocument, options);
      }
export type UpdateUserRoleMutationHookResult = ReturnType<typeof useUpdateUserRoleMutation>;
export type UpdateUserRoleMutationResult = Apollo.MutationResult<UpdateUserRoleMutation>;
export type UpdateUserRoleMutationOptions = Apollo.BaseMutationOptions<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>;
export const RemoveRoleDocument = gql`
    mutation RemoveRole($removeRole: RemoveRole!) {
  removeRole(removeRole: $removeRole) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type RemoveRoleMutationFn = Apollo.MutationFunction<RemoveRoleMutation, RemoveRoleMutationVariables>;

/**
 * __useRemoveRoleMutation__
 *
 * To run a mutation, you first call `useRemoveRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeRoleMutation, { data, loading, error }] = useRemoveRoleMutation({
 *   variables: {
 *      removeRole: // value for 'removeRole'
 *   },
 * });
 */
export function useRemoveRoleMutation(baseOptions?: Apollo.MutationHookOptions<RemoveRoleMutation, RemoveRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveRoleMutation, RemoveRoleMutationVariables>(RemoveRoleDocument, options);
      }
export type RemoveRoleMutationHookResult = ReturnType<typeof useRemoveRoleMutation>;
export type RemoveRoleMutationResult = Apollo.MutationResult<RemoveRoleMutation>;
export type RemoveRoleMutationOptions = Apollo.BaseMutationOptions<RemoveRoleMutation, RemoveRoleMutationVariables>;
export const FindAllPermissionDocument = gql`
    query FindAllPermission($permissionInput: PermissionInput!) {
  findAllPermissions(permissionInput: $permissionInput) {
    response {
      error
      status
      message
    }
    permissions {
      id
      name
      moduleType
      status
    }
  }
}
    `;

/**
 * __useFindAllPermissionQuery__
 *
 * To run a query within a React component, call `useFindAllPermissionQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllPermissionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllPermissionQuery({
 *   variables: {
 *      permissionInput: // value for 'permissionInput'
 *   },
 * });
 */
export function useFindAllPermissionQuery(baseOptions: Apollo.QueryHookOptions<FindAllPermissionQuery, FindAllPermissionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllPermissionQuery, FindAllPermissionQueryVariables>(FindAllPermissionDocument, options);
      }
export function useFindAllPermissionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllPermissionQuery, FindAllPermissionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllPermissionQuery, FindAllPermissionQueryVariables>(FindAllPermissionDocument, options);
        }
export type FindAllPermissionQueryHookResult = ReturnType<typeof useFindAllPermissionQuery>;
export type FindAllPermissionLazyQueryHookResult = ReturnType<typeof useFindAllPermissionLazyQuery>;
export type FindAllPermissionQueryResult = Apollo.QueryResult<FindAllPermissionQuery, FindAllPermissionQueryVariables>;
export const CreateScheduleDocument = gql`
    mutation CreateSchedule($createScheduleInput: [CreateScheduleInput!]!) {
  createSchedule(createScheduleInput: $createScheduleInput) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type CreateScheduleMutationFn = Apollo.MutationFunction<CreateScheduleMutation, CreateScheduleMutationVariables>;

/**
 * __useCreateScheduleMutation__
 *
 * To run a mutation, you first call `useCreateScheduleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateScheduleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createScheduleMutation, { data, loading, error }] = useCreateScheduleMutation({
 *   variables: {
 *      createScheduleInput: // value for 'createScheduleInput'
 *   },
 * });
 */
export function useCreateScheduleMutation(baseOptions?: Apollo.MutationHookOptions<CreateScheduleMutation, CreateScheduleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateScheduleMutation, CreateScheduleMutationVariables>(CreateScheduleDocument, options);
      }
export type CreateScheduleMutationHookResult = ReturnType<typeof useCreateScheduleMutation>;
export type CreateScheduleMutationResult = Apollo.MutationResult<CreateScheduleMutation>;
export type CreateScheduleMutationOptions = Apollo.BaseMutationOptions<CreateScheduleMutation, CreateScheduleMutationVariables>;
export const UpdateScheduleDocument = gql`
    mutation UpdateSchedule($updateScheduleInput: UpdateScheduleInput!) {
  updateSchedule(updateScheduleInput: $updateScheduleInput) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type UpdateScheduleMutationFn = Apollo.MutationFunction<UpdateScheduleMutation, UpdateScheduleMutationVariables>;

/**
 * __useUpdateScheduleMutation__
 *
 * To run a mutation, you first call `useUpdateScheduleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateScheduleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateScheduleMutation, { data, loading, error }] = useUpdateScheduleMutation({
 *   variables: {
 *      updateScheduleInput: // value for 'updateScheduleInput'
 *   },
 * });
 */
export function useUpdateScheduleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateScheduleMutation, UpdateScheduleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateScheduleMutation, UpdateScheduleMutationVariables>(UpdateScheduleDocument, options);
      }
export type UpdateScheduleMutationHookResult = ReturnType<typeof useUpdateScheduleMutation>;
export type UpdateScheduleMutationResult = Apollo.MutationResult<UpdateScheduleMutation>;
export type UpdateScheduleMutationOptions = Apollo.BaseMutationOptions<UpdateScheduleMutation, UpdateScheduleMutationVariables>;
export const GetScheduleDocument = gql`
    query GetSchedule($getSchedule: GetSchedule!) {
  getSchedule(getSchedule: $getSchedule) {
    response {
      error
      status
      message
    }
    schedule {
      id
      recurringEndDate
      startAt
      endAt
      createdAt
      updatedAt
      doctor {
        id
        firstName
        lastName
      }
      scheduleServices {
        id
        service {
          id
          name
          duration
        }
      }
    }
  }
}
    `;

/**
 * __useGetScheduleQuery__
 *
 * To run a query within a React component, call `useGetScheduleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetScheduleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetScheduleQuery({
 *   variables: {
 *      getSchedule: // value for 'getSchedule'
 *   },
 * });
 */
export function useGetScheduleQuery(baseOptions: Apollo.QueryHookOptions<GetScheduleQuery, GetScheduleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetScheduleQuery, GetScheduleQueryVariables>(GetScheduleDocument, options);
      }
export function useGetScheduleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetScheduleQuery, GetScheduleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetScheduleQuery, GetScheduleQueryVariables>(GetScheduleDocument, options);
        }
export type GetScheduleQueryHookResult = ReturnType<typeof useGetScheduleQuery>;
export type GetScheduleLazyQueryHookResult = ReturnType<typeof useGetScheduleLazyQuery>;
export type GetScheduleQueryResult = Apollo.QueryResult<GetScheduleQuery, GetScheduleQueryVariables>;
export const FindAllSchedulesDocument = gql`
    query FindAllSchedules($scheduleInput: ScheduleInput!) {
  findAllSchedules(scheduleInput: $scheduleInput) {
    response {
      error
      status
      message
    }
    pagination {
      page
      limit
      totalPages
    }
    schedules {
      id
      startAt
      endAt
      recurringEndDate
      createdAt
      updatedAt
      doctor {
        id
        firstName
        lastName
      }
    }
  }
}
    `;

/**
 * __useFindAllSchedulesQuery__
 *
 * To run a query within a React component, call `useFindAllSchedulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllSchedulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllSchedulesQuery({
 *   variables: {
 *      scheduleInput: // value for 'scheduleInput'
 *   },
 * });
 */
export function useFindAllSchedulesQuery(baseOptions: Apollo.QueryHookOptions<FindAllSchedulesQuery, FindAllSchedulesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllSchedulesQuery, FindAllSchedulesQueryVariables>(FindAllSchedulesDocument, options);
      }
export function useFindAllSchedulesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllSchedulesQuery, FindAllSchedulesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllSchedulesQuery, FindAllSchedulesQueryVariables>(FindAllSchedulesDocument, options);
        }
export type FindAllSchedulesQueryHookResult = ReturnType<typeof useFindAllSchedulesQuery>;
export type FindAllSchedulesLazyQueryHookResult = ReturnType<typeof useFindAllSchedulesLazyQuery>;
export type FindAllSchedulesQueryResult = Apollo.QueryResult<FindAllSchedulesQuery, FindAllSchedulesQueryVariables>;
export const GetDoctorScheduleDocument = gql`
    query GetDoctorSchedule($getDoctorSchedule: GetDoctorSchedule!) {
  getDoctorSchedule(getDoctorSchedule: $getDoctorSchedule) {
    response {
      error
      status
      message
    }
    schedules {
      id
      startAt
      endAt
      createdAt
      updatedAt
      scheduleServices {
        id
        service {
          id
          name
        }
      }
    }
  }
}
    `;

/**
 * __useGetDoctorScheduleQuery__
 *
 * To run a query within a React component, call `useGetDoctorScheduleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDoctorScheduleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDoctorScheduleQuery({
 *   variables: {
 *      getDoctorSchedule: // value for 'getDoctorSchedule'
 *   },
 * });
 */
export function useGetDoctorScheduleQuery(baseOptions: Apollo.QueryHookOptions<GetDoctorScheduleQuery, GetDoctorScheduleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDoctorScheduleQuery, GetDoctorScheduleQueryVariables>(GetDoctorScheduleDocument, options);
      }
export function useGetDoctorScheduleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDoctorScheduleQuery, GetDoctorScheduleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDoctorScheduleQuery, GetDoctorScheduleQueryVariables>(GetDoctorScheduleDocument, options);
        }
export type GetDoctorScheduleQueryHookResult = ReturnType<typeof useGetDoctorScheduleQuery>;
export type GetDoctorScheduleLazyQueryHookResult = ReturnType<typeof useGetDoctorScheduleLazyQuery>;
export type GetDoctorScheduleQueryResult = Apollo.QueryResult<GetDoctorScheduleQuery, GetDoctorScheduleQueryVariables>;
export const GetSlotsDocument = gql`
    query GetSlots($getSlots: GetSlots!) {
  getSlots(getSlots: $getSlots) {
    response {
      error
      status
      message
    }
    slots {
      startTime
      endTime
    }
  }
}
    `;

/**
 * __useGetSlotsQuery__
 *
 * To run a query within a React component, call `useGetSlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSlotsQuery({
 *   variables: {
 *      getSlots: // value for 'getSlots'
 *   },
 * });
 */
export function useGetSlotsQuery(baseOptions: Apollo.QueryHookOptions<GetSlotsQuery, GetSlotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSlotsQuery, GetSlotsQueryVariables>(GetSlotsDocument, options);
      }
export function useGetSlotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSlotsQuery, GetSlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSlotsQuery, GetSlotsQueryVariables>(GetSlotsDocument, options);
        }
export type GetSlotsQueryHookResult = ReturnType<typeof useGetSlotsQuery>;
export type GetSlotsLazyQueryHookResult = ReturnType<typeof useGetSlotsLazyQuery>;
export type GetSlotsQueryResult = Apollo.QueryResult<GetSlotsQuery, GetSlotsQueryVariables>;
export const RemoveScheduleDocument = gql`
    mutation RemoveSchedule($removeSchedule: RemoveSchedule!) {
  removeSchedule(removeSchedule: $removeSchedule) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type RemoveScheduleMutationFn = Apollo.MutationFunction<RemoveScheduleMutation, RemoveScheduleMutationVariables>;

/**
 * __useRemoveScheduleMutation__
 *
 * To run a mutation, you first call `useRemoveScheduleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveScheduleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeScheduleMutation, { data, loading, error }] = useRemoveScheduleMutation({
 *   variables: {
 *      removeSchedule: // value for 'removeSchedule'
 *   },
 * });
 */
export function useRemoveScheduleMutation(baseOptions?: Apollo.MutationHookOptions<RemoveScheduleMutation, RemoveScheduleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveScheduleMutation, RemoveScheduleMutationVariables>(RemoveScheduleDocument, options);
      }
export type RemoveScheduleMutationHookResult = ReturnType<typeof useRemoveScheduleMutation>;
export type RemoveScheduleMutationResult = Apollo.MutationResult<RemoveScheduleMutation>;
export type RemoveScheduleMutationOptions = Apollo.BaseMutationOptions<RemoveScheduleMutation, RemoveScheduleMutationVariables>;
export const GetFacilityScheduleDocument = gql`
    query GetFacilitySchedule($getFacilitySchedule: GetFacilitySchedule!) {
  getFacilitySchedule(getFacilitySchedule: $getFacilitySchedule) {
    response {
      error
      status
      message
    }
    schedules {
      id
      startAt
      endAt
      createdAt
      updatedAt
      scheduleServices {
        id
        service {
          id
          name
        }
      }
    }
  }
}
    `;

/**
 * __useGetFacilityScheduleQuery__
 *
 * To run a query within a React component, call `useGetFacilityScheduleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFacilityScheduleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFacilityScheduleQuery({
 *   variables: {
 *      getFacilitySchedule: // value for 'getFacilitySchedule'
 *   },
 * });
 */
export function useGetFacilityScheduleQuery(baseOptions: Apollo.QueryHookOptions<GetFacilityScheduleQuery, GetFacilityScheduleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFacilityScheduleQuery, GetFacilityScheduleQueryVariables>(GetFacilityScheduleDocument, options);
      }
export function useGetFacilityScheduleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFacilityScheduleQuery, GetFacilityScheduleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFacilityScheduleQuery, GetFacilityScheduleQueryVariables>(GetFacilityScheduleDocument, options);
        }
export type GetFacilityScheduleQueryHookResult = ReturnType<typeof useGetFacilityScheduleQuery>;
export type GetFacilityScheduleLazyQueryHookResult = ReturnType<typeof useGetFacilityScheduleLazyQuery>;
export type GetFacilityScheduleQueryResult = Apollo.QueryResult<GetFacilityScheduleQuery, GetFacilityScheduleQueryVariables>;
export const FindAllServicesDocument = gql`
    query findAllServices($serviceInput: ServiceInput!) {
  findAllServices(serviceInput: $serviceInput) {
    pagination {
      page
      totalCount
      totalPages
    }
    response {
      name
      error
      status
      message
    }
    services {
      id
      name
      duration
      price
      isActive
      facilityId
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useFindAllServicesQuery__
 *
 * To run a query within a React component, call `useFindAllServicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllServicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllServicesQuery({
 *   variables: {
 *      serviceInput: // value for 'serviceInput'
 *   },
 * });
 */
export function useFindAllServicesQuery(baseOptions: Apollo.QueryHookOptions<FindAllServicesQuery, FindAllServicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllServicesQuery, FindAllServicesQueryVariables>(FindAllServicesDocument, options);
      }
export function useFindAllServicesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllServicesQuery, FindAllServicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllServicesQuery, FindAllServicesQueryVariables>(FindAllServicesDocument, options);
        }
export type FindAllServicesQueryHookResult = ReturnType<typeof useFindAllServicesQuery>;
export type FindAllServicesLazyQueryHookResult = ReturnType<typeof useFindAllServicesLazyQuery>;
export type FindAllServicesQueryResult = Apollo.QueryResult<FindAllServicesQuery, FindAllServicesQueryVariables>;
export const GetServiceDocument = gql`
    query getService($getService: GetService!) {
  getService(getService: $getService) {
    response {
      error
      status
      message
    }
    service {
      id
      name
      duration
      price
      isActive
      color
      facilityId
      createdAt
      updatedAt
      facility {
        id
        name
        createdAt
        updatedAt
      }
    }
  }
}
    `;

/**
 * __useGetServiceQuery__
 *
 * To run a query within a React component, call `useGetServiceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetServiceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetServiceQuery({
 *   variables: {
 *      getService: // value for 'getService'
 *   },
 * });
 */
export function useGetServiceQuery(baseOptions: Apollo.QueryHookOptions<GetServiceQuery, GetServiceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetServiceQuery, GetServiceQueryVariables>(GetServiceDocument, options);
      }
export function useGetServiceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetServiceQuery, GetServiceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetServiceQuery, GetServiceQueryVariables>(GetServiceDocument, options);
        }
export type GetServiceQueryHookResult = ReturnType<typeof useGetServiceQuery>;
export type GetServiceLazyQueryHookResult = ReturnType<typeof useGetServiceLazyQuery>;
export type GetServiceQueryResult = Apollo.QueryResult<GetServiceQuery, GetServiceQueryVariables>;
export const RemoveServiceDocument = gql`
    mutation RemoveService($removeService: RemoveService!) {
  removeService(removeService: $removeService) {
    response {
      name
      status
      message
    }
  }
}
    `;
export type RemoveServiceMutationFn = Apollo.MutationFunction<RemoveServiceMutation, RemoveServiceMutationVariables>;

/**
 * __useRemoveServiceMutation__
 *
 * To run a mutation, you first call `useRemoveServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeServiceMutation, { data, loading, error }] = useRemoveServiceMutation({
 *   variables: {
 *      removeService: // value for 'removeService'
 *   },
 * });
 */
export function useRemoveServiceMutation(baseOptions?: Apollo.MutationHookOptions<RemoveServiceMutation, RemoveServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveServiceMutation, RemoveServiceMutationVariables>(RemoveServiceDocument, options);
      }
export type RemoveServiceMutationHookResult = ReturnType<typeof useRemoveServiceMutation>;
export type RemoveServiceMutationResult = Apollo.MutationResult<RemoveServiceMutation>;
export type RemoveServiceMutationOptions = Apollo.BaseMutationOptions<RemoveServiceMutation, RemoveServiceMutationVariables>;
export const CreateServiceDocument = gql`
    mutation CreateService($createServiceInput: CreateServiceInput!) {
  createService(createServiceInput: $createServiceInput) {
    response {
      name
      status
      message
    }
  }
}
    `;
export type CreateServiceMutationFn = Apollo.MutationFunction<CreateServiceMutation, CreateServiceMutationVariables>;

/**
 * __useCreateServiceMutation__
 *
 * To run a mutation, you first call `useCreateServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createServiceMutation, { data, loading, error }] = useCreateServiceMutation({
 *   variables: {
 *      createServiceInput: // value for 'createServiceInput'
 *   },
 * });
 */
export function useCreateServiceMutation(baseOptions?: Apollo.MutationHookOptions<CreateServiceMutation, CreateServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateServiceMutation, CreateServiceMutationVariables>(CreateServiceDocument, options);
      }
export type CreateServiceMutationHookResult = ReturnType<typeof useCreateServiceMutation>;
export type CreateServiceMutationResult = Apollo.MutationResult<CreateServiceMutation>;
export type CreateServiceMutationOptions = Apollo.BaseMutationOptions<CreateServiceMutation, CreateServiceMutationVariables>;
export const UpdateServiceDocument = gql`
    mutation UpdateService($updateServiceInput: UpdateServiceInput!) {
  updateService(updateServiceInput: $updateServiceInput) {
    response {
      name
      status
      message
    }
  }
}
    `;
export type UpdateServiceMutationFn = Apollo.MutationFunction<UpdateServiceMutation, UpdateServiceMutationVariables>;

/**
 * __useUpdateServiceMutation__
 *
 * To run a mutation, you first call `useUpdateServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateServiceMutation, { data, loading, error }] = useUpdateServiceMutation({
 *   variables: {
 *      updateServiceInput: // value for 'updateServiceInput'
 *   },
 * });
 */
export function useUpdateServiceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateServiceMutation, UpdateServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateServiceMutation, UpdateServiceMutationVariables>(UpdateServiceDocument, options);
      }
export type UpdateServiceMutationHookResult = ReturnType<typeof useUpdateServiceMutation>;
export type UpdateServiceMutationResult = Apollo.MutationResult<UpdateServiceMutation>;
export type UpdateServiceMutationOptions = Apollo.BaseMutationOptions<UpdateServiceMutation, UpdateServiceMutationVariables>;
export const UpdateFacilityTimeZoneDocument = gql`
    mutation UpdateFacilityTimeZone($updateFacilityTimeZoneInput: UpdateFacilityTimeZoneInput!) {
  updateFacilityTimeZone(
    updateFacilityTimeZoneInput: $updateFacilityTimeZoneInput
  ) {
    facility {
      id
      timeZone
    }
    response {
      name
      status
      message
    }
  }
}
    `;
export type UpdateFacilityTimeZoneMutationFn = Apollo.MutationFunction<UpdateFacilityTimeZoneMutation, UpdateFacilityTimeZoneMutationVariables>;

/**
 * __useUpdateFacilityTimeZoneMutation__
 *
 * To run a mutation, you first call `useUpdateFacilityTimeZoneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFacilityTimeZoneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFacilityTimeZoneMutation, { data, loading, error }] = useUpdateFacilityTimeZoneMutation({
 *   variables: {
 *      updateFacilityTimeZoneInput: // value for 'updateFacilityTimeZoneInput'
 *   },
 * });
 */
export function useUpdateFacilityTimeZoneMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFacilityTimeZoneMutation, UpdateFacilityTimeZoneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFacilityTimeZoneMutation, UpdateFacilityTimeZoneMutationVariables>(UpdateFacilityTimeZoneDocument, options);
      }
export type UpdateFacilityTimeZoneMutationHookResult = ReturnType<typeof useUpdateFacilityTimeZoneMutation>;
export type UpdateFacilityTimeZoneMutationResult = Apollo.MutationResult<UpdateFacilityTimeZoneMutation>;
export type UpdateFacilityTimeZoneMutationOptions = Apollo.BaseMutationOptions<UpdateFacilityTimeZoneMutation, UpdateFacilityTimeZoneMutationVariables>;
export const FindAllStaffDocument = gql`
    query FindAllStaff($staffInput: StaffInput!) {
  findAllStaff(staffInput: $staffInput) {
    pagination {
      page
      totalPages
    }
    response {
      error
      status
      message
    }
    allstaff {
      id
      email
      firstName
      lastName
      username
      phone
      user {
        id
      }
    }
  }
}
    `;

/**
 * __useFindAllStaffQuery__
 *
 * To run a query within a React component, call `useFindAllStaffQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllStaffQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllStaffQuery({
 *   variables: {
 *      staffInput: // value for 'staffInput'
 *   },
 * });
 */
export function useFindAllStaffQuery(baseOptions: Apollo.QueryHookOptions<FindAllStaffQuery, FindAllStaffQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllStaffQuery, FindAllStaffQueryVariables>(FindAllStaffDocument, options);
      }
export function useFindAllStaffLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllStaffQuery, FindAllStaffQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllStaffQuery, FindAllStaffQueryVariables>(FindAllStaffDocument, options);
        }
export type FindAllStaffQueryHookResult = ReturnType<typeof useFindAllStaffQuery>;
export type FindAllStaffLazyQueryHookResult = ReturnType<typeof useFindAllStaffLazyQuery>;
export type FindAllStaffQueryResult = Apollo.QueryResult<FindAllStaffQuery, FindAllStaffQueryVariables>;
export const GetStaffDocument = gql`
    query GetStaff($getStaff: GetStaff!) {
  getStaff(getStaff: $getStaff) {
    response {
      name
      error
      status
      message
    }
    staff {
      id
      dob
      email
      phone
      mobile
      gender
      lastName
      username
      firstName
      facilityId
      createdAt
      updatedAt
      user {
        roles {
          id
          role
        }
      }
      facility {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetStaffQuery__
 *
 * To run a query within a React component, call `useGetStaffQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStaffQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStaffQuery({
 *   variables: {
 *      getStaff: // value for 'getStaff'
 *   },
 * });
 */
export function useGetStaffQuery(baseOptions: Apollo.QueryHookOptions<GetStaffQuery, GetStaffQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStaffQuery, GetStaffQueryVariables>(GetStaffDocument, options);
      }
export function useGetStaffLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStaffQuery, GetStaffQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStaffQuery, GetStaffQueryVariables>(GetStaffDocument, options);
        }
export type GetStaffQueryHookResult = ReturnType<typeof useGetStaffQuery>;
export type GetStaffLazyQueryHookResult = ReturnType<typeof useGetStaffLazyQuery>;
export type GetStaffQueryResult = Apollo.QueryResult<GetStaffQuery, GetStaffQueryVariables>;
export const RemoveStaffDocument = gql`
    mutation RemoveStaff($removeStaff: RemoveStaff!) {
  removeStaff(removeStaff: $removeStaff) {
    response {
      name
      status
      message
    }
  }
}
    `;
export type RemoveStaffMutationFn = Apollo.MutationFunction<RemoveStaffMutation, RemoveStaffMutationVariables>;

/**
 * __useRemoveStaffMutation__
 *
 * To run a mutation, you first call `useRemoveStaffMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveStaffMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeStaffMutation, { data, loading, error }] = useRemoveStaffMutation({
 *   variables: {
 *      removeStaff: // value for 'removeStaff'
 *   },
 * });
 */
export function useRemoveStaffMutation(baseOptions?: Apollo.MutationHookOptions<RemoveStaffMutation, RemoveStaffMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveStaffMutation, RemoveStaffMutationVariables>(RemoveStaffDocument, options);
      }
export type RemoveStaffMutationHookResult = ReturnType<typeof useRemoveStaffMutation>;
export type RemoveStaffMutationResult = Apollo.MutationResult<RemoveStaffMutation>;
export type RemoveStaffMutationOptions = Apollo.BaseMutationOptions<RemoveStaffMutation, RemoveStaffMutationVariables>;
export const UpdateStaffDocument = gql`
    mutation UpdateStaff($updateStaffInput: UpdateStaffInput!) {
  updateStaff(updateStaffInput: $updateStaffInput) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type UpdateStaffMutationFn = Apollo.MutationFunction<UpdateStaffMutation, UpdateStaffMutationVariables>;

/**
 * __useUpdateStaffMutation__
 *
 * To run a mutation, you first call `useUpdateStaffMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStaffMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStaffMutation, { data, loading, error }] = useUpdateStaffMutation({
 *   variables: {
 *      updateStaffInput: // value for 'updateStaffInput'
 *   },
 * });
 */
export function useUpdateStaffMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStaffMutation, UpdateStaffMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStaffMutation, UpdateStaffMutationVariables>(UpdateStaffDocument, options);
      }
export type UpdateStaffMutationHookResult = ReturnType<typeof useUpdateStaffMutation>;
export type UpdateStaffMutationResult = Apollo.MutationResult<UpdateStaffMutation>;
export type UpdateStaffMutationOptions = Apollo.BaseMutationOptions<UpdateStaffMutation, UpdateStaffMutationVariables>;
export const CreateStaffDocument = gql`
    mutation CreateStaff($createStaffInput: CreateStaffInput!) {
  createStaff(createStaffInput: $createStaffInput) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type CreateStaffMutationFn = Apollo.MutationFunction<CreateStaffMutation, CreateStaffMutationVariables>;

/**
 * __useCreateStaffMutation__
 *
 * To run a mutation, you first call `useCreateStaffMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStaffMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStaffMutation, { data, loading, error }] = useCreateStaffMutation({
 *   variables: {
 *      createStaffInput: // value for 'createStaffInput'
 *   },
 * });
 */
export function useCreateStaffMutation(baseOptions?: Apollo.MutationHookOptions<CreateStaffMutation, CreateStaffMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateStaffMutation, CreateStaffMutationVariables>(CreateStaffDocument, options);
      }
export type CreateStaffMutationHookResult = ReturnType<typeof useCreateStaffMutation>;
export type CreateStaffMutationResult = Apollo.MutationResult<CreateStaffMutation>;
export type CreateStaffMutationOptions = Apollo.BaseMutationOptions<CreateStaffMutation, CreateStaffMutationVariables>;
export const FetchEmergencyAccessUserDocument = gql`
    query fetchEmergencyAccessUser($emergencyAccessUsersInput: EmergencyAccessUserInput!) {
  fetchEmergencyAccessUsers(emergencyAccessUsersInput: $emergencyAccessUsersInput) {
    response {
      status
      error
      message
    }
    pagination {
      page
      totalPages
    }
    emergencyAccessUsers {
      id
      email
      facilityId
      roles {
        role
        rolePermissions {
          permission {
            id
            name
          }
        }
      }
    }
  }
}
    `;

/**
 * __useFetchEmergencyAccessUserQuery__
 *
 * To run a query within a React component, call `useFetchEmergencyAccessUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchEmergencyAccessUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchEmergencyAccessUserQuery({
 *   variables: {
 *      emergencyAccessUsersInput: // value for 'emergencyAccessUsersInput'
 *   },
 * });
 */
export function useFetchEmergencyAccessUserQuery(baseOptions: Apollo.QueryHookOptions<FetchEmergencyAccessUserQuery, FetchEmergencyAccessUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchEmergencyAccessUserQuery, FetchEmergencyAccessUserQueryVariables>(FetchEmergencyAccessUserDocument, options);
      }
export function useFetchEmergencyAccessUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchEmergencyAccessUserQuery, FetchEmergencyAccessUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchEmergencyAccessUserQuery, FetchEmergencyAccessUserQueryVariables>(FetchEmergencyAccessUserDocument, options);
        }
export type FetchEmergencyAccessUserQueryHookResult = ReturnType<typeof useFetchEmergencyAccessUserQuery>;
export type FetchEmergencyAccessUserLazyQueryHookResult = ReturnType<typeof useFetchEmergencyAccessUserLazyQuery>;
export type FetchEmergencyAccessUserQueryResult = Apollo.QueryResult<FetchEmergencyAccessUserQuery, FetchEmergencyAccessUserQueryVariables>;
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  me {
    response {
      status
      error
      message
    }
    user {
      id
      userId
      userType
      attachments {
        id
        key
        url
        type
        title
        typeId
        createdAt
        updatedAt
      }
    }
  }
}
    `;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
      }
export function useGetCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;