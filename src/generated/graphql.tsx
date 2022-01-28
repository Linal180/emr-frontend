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

export type AccessUserPayload = {
  __typename?: 'AccessUserPayload';
  access_token?: Maybe<Scalars['String']>;
  response?: Maybe<ResponsePayload>;
  roles?: Maybe<Array<Role>>;
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

export type Attachment = {
  __typename?: 'Attachment';
  createdAt: Scalars['String'];
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
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

export type AttachmentPayload = {
  __typename?: 'AttachmentPayload';
  attachment?: Maybe<Attachment>;
  response?: Maybe<ResponsePayload>;
};

/** The type is assigned */
export enum AttachmentType {
  Doctor = 'DOCTOR',
  Patient = 'PATIENT',
  Lab = 'lab'
}

export type AttachmentsPayload = {
  __typename?: 'AttachmentsPayload';
  attachments?: Maybe<Array<Maybe<Attachment>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
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
  email?: Maybe<Scalars['String']>;
  employerName?: Maybe<Scalars['String']>;
  facility?: Maybe<Facility>;
  facilityId?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  pager?: Maybe<Scalars['String']>;
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

export type CreateAttachmentInput = {
  description?: Maybe<Scalars['String']>;
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
  lastName?: Maybe<Scalars['String']>;
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
  email: Scalars['String'];
  emcProviderId?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
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
  prefix?: Maybe<Scalars['String']>;
  prescriptiveAuthNumber?: Maybe<Scalars['String']>;
  providerIntials?: Maybe<Scalars['String']>;
  /** Send doctor Type from the ENUM - Sign-up */
  roleType?: Maybe<UserRole>;
  /** Doctor speciality */
  speciality?: Maybe<Speciality>;
  specialityLicense?: Maybe<Scalars['String']>;
  ssn?: Maybe<Scalars['String']>;
  /** Doctor ssn type */
  ssnType?: Maybe<SsnType>;
  stateLicense?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  taxId?: Maybe<Scalars['String']>;
  taxIdStuff?: Maybe<Scalars['String']>;
  taxonomyCode?: Maybe<Scalars['String']>;
  timeZone?: Maybe<Scalars['String']>;
  upin?: Maybe<Scalars['String']>;
};

export type CreateEmployerInput = {
  email?: Maybe<Scalars['String']>;
  industry?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  patientId?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  usualOccupation?: Maybe<Scalars['String']>;
};

export type CreateFacilityInput = {
  createBillingAddressInput: CreateBillingAddressInput;
  createContactInput: CreateContactInput;
  createFacilityItemInput: CreateFacilityItemInput;
};

export type CreateFacilityItemInput = {
  cliaIdNumber?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  federalTaxId?: Maybe<Scalars['String']>;
  insurancePlanType?: Maybe<Scalars['String']>;
  mammographyCertificationNumber?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  npi?: Maybe<Scalars['String']>;
  /** Facility type */
  practiceType?: Maybe<PracticeType>;
  revenueCode?: Maybe<Scalars['String']>;
  /** Service Code type */
  serviceCode?: Maybe<ServiceCode>;
  stateImmunizationId?: Maybe<Scalars['String']>;
  tamxonomyCode?: Maybe<Scalars['String']>;
  timeZone?: Maybe<Scalars['String']>;
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
  facilityId: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  firstNameUsed?: Maybe<Scalars['String']>;
  gender?: Maybe<Genderidentity>;
  genderIdentity?: Maybe<Genderidentity>;
  holdStatement?: Maybe<Holdstatement>;
  homeBound?: Maybe<Homebound>;
  language?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  maritialStatus?: Maybe<Maritialstatus>;
  medicationHistoryAuthority?: Maybe<Scalars['Boolean']>;
  middleName?: Maybe<Scalars['String']>;
  motherMaidenName?: Maybe<Scalars['String']>;
  patientNote?: Maybe<Scalars['String']>;
  prefferedName?: Maybe<Scalars['String']>;
  previousFirstName?: Maybe<Scalars['String']>;
  previouslastName?: Maybe<Scalars['String']>;
  primaryDepartment?: Maybe<PrimaryDepartment>;
  privacyNotice?: Maybe<Scalars['Boolean']>;
  pronouns?: Maybe<Pronouns>;
  race?: Maybe<Race>;
  registrationDate?: Maybe<Scalars['String']>;
  registrationDepartment?: Maybe<RegDepartment>;
  releaseOfInfoBill?: Maybe<Scalars['Boolean']>;
  sexAtBirth?: Maybe<Genderidentity>;
  sexualOrientation?: Maybe<Sexualorientation>;
  ssn?: Maybe<Scalars['String']>;
  statementDelivereOnline?: Maybe<Scalars['Boolean']>;
  statementNote?: Maybe<Scalars['String']>;
  statementNoteDateFrom?: Maybe<Scalars['String']>;
  statementNoteDateTo?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  usualProviderId?: Maybe<Scalars['String']>;
};

export type CreateScheduleInput = {
  doctorId: Scalars['String'];
  endAt: Scalars['DateTime'];
  recurringEndDate?: Maybe<Scalars['DateTime']>;
  startAt: Scalars['DateTime'];
};

export type CreateServiceInput = {
  duration: Scalars['String'];
  facilityId: Scalars['String'];
  isActive?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  price: Scalars['String'];
};

export type CreateStaffInput = {
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
  primaryProvider?: Maybe<Scalars['String']>;
  /** Send Investor Type from the ENUM - Sign-up */
  roleType?: Maybe<UserRole>;
  username: Scalars['String'];
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
  billingAddress?: Maybe<Array<BillingAddress>>;
  billingFacility?: Maybe<Scalars['String']>;
  blueShildNumber?: Maybe<Scalars['String']>;
  campusGrpNumber?: Maybe<Scalars['String']>;
  contacts?: Maybe<Array<Contact>>;
  createdAt: Scalars['String'];
  deaActiveDate: Scalars['String'];
  deaNumber?: Maybe<Scalars['String']>;
  deaTermDate: Scalars['String'];
  degreeCredentials?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['String']>;
  dpsCtpNumber?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  emcProviderId?: Maybe<Scalars['String']>;
  facility?: Maybe<Facility>;
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
  prefix?: Maybe<Scalars['String']>;
  prescriptiveAuthNumber?: Maybe<Scalars['String']>;
  providerIntials?: Maybe<Scalars['String']>;
  schedule?: Maybe<Array<Schedule>>;
  speciality?: Maybe<Speciality>;
  specialityLicense?: Maybe<Scalars['String']>;
  ssn?: Maybe<Scalars['String']>;
  ssnType?: Maybe<SsnType>;
  stateLicense?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  taxId?: Maybe<Scalars['String']>;
  taxIdStuff?: Maybe<Scalars['String']>;
  taxonomyCode?: Maybe<Scalars['String']>;
  timeZone?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  upin?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type DoctorInput = {
  facilityId?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
};

export type DoctorPayload = {
  __typename?: 'DoctorPayload';
  doctor?: Maybe<Doctor>;
  response?: Maybe<ResponsePayload>;
};

/** The patient's ethnicity type assigned */
export enum Ethnicity {
  CenteralAmerican = 'CENTERAL_AMERICAN',
  CenteralAmericanIndian = 'CENTERAL_AMERICAN_INDIAN',
  None = 'NONE'
}

export type Employer = {
  __typename?: 'Employer';
  createdAt: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  industry?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  usualOccupation?: Maybe<Scalars['String']>;
};

export type FacilitiesPayload = {
  __typename?: 'FacilitiesPayload';
  facility?: Maybe<Array<Maybe<Facility>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type Facility = {
  __typename?: 'Facility';
  billingAddress?: Maybe<Array<BillingAddress>>;
  cliaIdNumber?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  contacts?: Maybe<Array<Contact>>;
  createdAt?: Maybe<Scalars['String']>;
  doctors?: Maybe<Array<Doctor>>;
  federalTaxId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  insurancePlanType?: Maybe<Scalars['String']>;
  isPrivate?: Maybe<Scalars['Boolean']>;
  mammographyCertificationNumber?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  npi?: Maybe<Scalars['String']>;
  practiceType: PracticeType;
  revenueCode?: Maybe<Scalars['String']>;
  serviceCode: ServiceCode;
  services?: Maybe<Array<Service>>;
  staff?: Maybe<Array<Staff>>;
  tamxonomyCode?: Maybe<Scalars['String']>;
  timeZone?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<Array<User>>;
};

export type FacilityInput = {
  isPrivate?: Maybe<Scalars['Boolean']>;
  paginationOptions: PaginationInput;
};

export type FacilityPayload = {
  __typename?: 'FacilityPayload';
  facility?: Maybe<Facility>;
  response?: Maybe<ResponsePayload>;
};

export type ForgotPasswordInput = {
  email: Scalars['String'];
};

export type ForgotPasswordPayload = {
  __typename?: 'ForgotPasswordPayload';
  response?: Maybe<ResponsePayload>;
};

/** The patient's sexual orientation type assigned */
export enum Genderidentity {
  Female = 'FEMALE',
  Male = 'MALE',
  None = 'NONE',
  NotExclusive = 'NOT_EXCLUSIVE',
  TransgenderFemale = 'TRANSGENDER_FEMALE',
  TransgenderMale = 'TRANSGENDER_MALE'
}

/** The user gender assigned */
export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER'
}

export type GetAttachment = {
  typeId: Scalars['String'];
};

export type GetContact = {
  id: Scalars['String'];
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

export type GetMedia = {
  id?: Maybe<Scalars['String']>;
};

export type GetPatient = {
  id: Scalars['String'];
};

export type GetSchedule = {
  id: Scalars['String'];
};

export type GetService = {
  id: Scalars['String'];
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

export type LoginUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
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
  activateUser: UserPayload;
  createAttachmentData: AttachmentPayload;
  createContact: ContactPayload;
  createDoctor: DoctorPayload;
  createFacility: FacilityPayload;
  createPatient: PatientPayload;
  createSchedule: SchedulePayload;
  createService: ServicePayload;
  createStaff: StaffPayload;
  deactivateUser: UserPayload;
  disableDoctor: DoctorPayload;
  disableStaff: StaffPayload;
  forgotPassword: ForgotPasswordPayload;
  login: AccessUserPayload;
  registerUser: UserPayload;
  removeAttachmentData: AttachmentPayload;
  removeContact: ContactPayload;
  removeDoctor: DoctorPayload;
  removeFacility: FacilityPayload;
  removePatient: PatientPayload;
  removeSchedule: SchedulePayload;
  removeService: ServicePayload;
  removeStaff: StaffPayload;
  removeUser: UserPayload;
  resendVerificationEmail: UserPayload;
  resetPassword: UserPayload;
  updateAttachmentData: AttachmentPayload;
  updateContact: ContactPayload;
  updateDoctor: DoctorPayload;
  updateFacility: FacilityPayload;
  updateFacilityTimeZone: FacilityPayload;
  updatePassword: UserPayload;
  updatePatient: PatientPayload;
  updatePatientProvider: PatientPayload;
  updateRole: UserPayload;
  updateSchedule: SchedulePayload;
  updateService: ServicePayload;
  updateStaff: StaffPayload;
  updateUser: UserPayload;
  verifyEmail: UserPayload;
};


export type MutationActivateUserArgs = {
  user: UserIdInput;
};


export type MutationCreateAttachmentDataArgs = {
  createAttachmentInput: CreateAttachmentInput;
};


export type MutationCreateContactArgs = {
  createContactInput: CreateContactInput;
};


export type MutationCreateDoctorArgs = {
  createDoctorInput: CreateDoctorInput;
};


export type MutationCreateFacilityArgs = {
  createFacilityInput: CreateFacilityInput;
};


export type MutationCreatePatientArgs = {
  createPatientInput: CreatePatientInput;
};


export type MutationCreateScheduleArgs = {
  createScheduleInput: CreateScheduleInput;
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


export type MutationLoginArgs = {
  loginUser: LoginUserInput;
};


export type MutationRegisterUserArgs = {
  user: RegisterUserInput;
};


export type MutationRemoveAttachmentDataArgs = {
  removeAttachment: RemoveAttachment;
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


export type MutationRemovePatientArgs = {
  removePatient: RemovePatient;
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


export type MutationUpdateAttachmentDataArgs = {
  updateAttachmentInput: UpdateAttachmentInput;
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


export type MutationUpdatePasswordArgs = {
  updatePasswordInput: UpdatePasswordInput;
};


export type MutationUpdatePatientArgs = {
  updatePatientInput: UpdatePatientInput;
};


export type MutationUpdatePatientProviderArgs = {
  updatePatientProvider: UpdatePatientProvider;
};


export type MutationUpdateRoleArgs = {
  user: UpdateRoleInput;
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


export type MutationVerifyEmailArgs = {
  verifyEmail: VerifyEmailInput;
};

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
  attachments?: Maybe<Array<Attachment>>;
  callToConsent: Scalars['Boolean'];
  contacts?: Maybe<Array<Contact>>;
  createdAt: Scalars['String'];
  deceasedDate: Scalars['DateTime'];
  dob?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  employer?: Maybe<Array<Employer>>;
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
  language?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  maritialStatus?: Maybe<Maritialstatus>;
  medicationHistoryAuthority: Scalars['Boolean'];
  middleName?: Maybe<Scalars['String']>;
  motherMaidenName?: Maybe<Scalars['String']>;
  patientNote?: Maybe<Scalars['String']>;
  prefferedName?: Maybe<Scalars['String']>;
  previousFirstName?: Maybe<Scalars['String']>;
  previouslastName?: Maybe<Scalars['String']>;
  primaryDepartment: PrimaryDepartment;
  privacyNotice: Scalars['Boolean'];
  pronouns?: Maybe<Pronouns>;
  race?: Maybe<Race>;
  registrationDate: Scalars['DateTime'];
  registrationDepartment: RegDepartment;
  releaseOfInfoBill: Scalars['Boolean'];
  sexAtBirth?: Maybe<Genderidentity>;
  sexualOrientation?: Maybe<Sexualorientation>;
  ssn?: Maybe<Scalars['String']>;
  statementDelivereOnline: Scalars['Boolean'];
  statementNote: Scalars['String'];
  statementNoteDateFrom: Scalars['String'];
  statementNoteDateTo: Scalars['String'];
  suffix?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
  usualProvider?: Maybe<Array<Maybe<Doctor>>>;
};

export type PatientInput = {
  facilityId?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
};

export type PatientPayload = {
  __typename?: 'PatientPayload';
  patient?: Maybe<Patient>;
  response?: Maybe<ResponsePayload>;
};

export type PatientsPayload = {
  __typename?: 'PatientsPayload';
  facilityId?: Maybe<Scalars['String']>;
  pagination?: Maybe<PaginationPayload>;
  patients?: Maybe<Array<Maybe<Patient>>>;
  response?: Maybe<ResponsePayload>;
};

/** The facility practice type assigned type */
export enum PracticeType {
  Clinic = 'CLINIC',
  Hospital = 'HOSPITAL',
  Lab = 'LAB'
}

/** The facility Primary Department type assigned type */
export enum PrimaryDepartment {
  Clinic = 'CLINIC',
  Hospital = 'HOSPITAL',
  Lab = 'LAB'
}

export type Query = {
  __typename?: 'Query';
  fetchAllRoles: RolesPayload;
  fetchAllUsers: UsersPayload;
  fetchUser: UserPayload;
  findAllContacts: ContactsPayload;
  findAllDoctor: AllDoctorPayload;
  findAllFacility: FacilitiesPayload;
  findAllPatient: PatientsPayload;
  findAllSchedules: SchedulesPayload;
  findAllServices: ServicesPayload;
  findAllStaff: AllStaffPayload;
  getAttachment: AttachmentMediaPayload;
  getAttachments: AttachmentsPayload;
  getContact: ContactPayload;
  getDoctor: DoctorPayload;
  getDoctorSchedules: SchedulesPayload;
  getFacility: FacilityPayload;
  getPatient: PatientPayload;
  getSchedule: SchedulePayload;
  getService: ServicePayload;
  getStaff: StaffPayload;
  getUser: UserPayload;
  me: UserPayload;
  searchUser: UsersPayload;
};


export type QueryFetchAllUsersArgs = {
  userInput: UsersInput;
};


export type QueryFindAllContactsArgs = {
  contactInput: ContactInput;
};


export type QueryFindAllDoctorArgs = {
  doctorInput: DoctorInput;
};


export type QueryFindAllFacilityArgs = {
  facilityInput: FacilityInput;
};


export type QueryFindAllPatientArgs = {
  patientInput: PatientInput;
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


export type QueryGetAttachmentArgs = {
  getMedia: GetMedia;
};


export type QueryGetAttachmentsArgs = {
  getAttachment: GetAttachment;
};


export type QueryGetContactArgs = {
  getContact: GetContact;
};


export type QueryGetDoctorArgs = {
  getDoctor: GetDoctor;
};


export type QueryGetDoctorSchedulesArgs = {
  getDoctorSchedule: GetDoctorSchedule;
};


export type QueryGetFacilityArgs = {
  getFacility: GetFacility;
};


export type QueryGetPatientArgs = {
  getPatient: GetPatient;
};


export type QueryGetScheduleArgs = {
  getSchedule: GetSchedule;
};


export type QueryGetServiceArgs = {
  getService: GetService;
};


export type QueryGetStaffArgs = {
  getStaff: GetStaff;
};


export type QueryGetUserArgs = {
  getUser: GetUser;
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

/** The facility Registration Department type assigned type */
export enum RegDepartment {
  Clinic = 'CLINIC',
  Hospital = 'HOSPITAL',
  Lab = 'LAB'
}

export type RegisterUserInput = {
  adminId?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  facilityId?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  /** Send Investor Type from the ENUM - Sign-up */
  roleType?: Maybe<UserRole>;
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

export type RemoveAttachment = {
  id?: Maybe<Scalars['String']>;
};

export type RemoveContact = {
  id: Scalars['String'];
};

export type RemoveDoctor = {
  id: Scalars['String'];
};

export type RemoveFacility = {
  id: Scalars['String'];
};

export type RemovePatient = {
  id: Scalars['String'];
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

export type ResendVerificationEmail = {
  email?: Maybe<Scalars['String']>;
};

export type ResetPasswordInput = {
  password: Scalars['String'];
  token: Scalars['String'];
};

export type ResponsePayload = {
  __typename?: 'ResponsePayload';
  error?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Float']>;
};

export type Role = {
  __typename?: 'Role';
  createdAt: Scalars['String'];
  id: Scalars['String'];
  role: UserRole;
  updatedAt: Scalars['String'];
};

export type RolesPayload = {
  __typename?: 'RolesPayload';
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

export type Schedule = {
  __typename?: 'Schedule';
  createdAt: Scalars['String'];
  doctor?: Maybe<Doctor>;
  endAt: Scalars['DateTime'];
  id: Scalars['String'];
  recurringEndDate?: Maybe<Scalars['DateTime']>;
  startAt: Scalars['DateTime'];
  updatedAt: Scalars['String'];
};

export type ScheduleInput = {
  facilityId?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
};

export type SchedulePayload = {
  __typename?: 'SchedulePayload';
  response?: Maybe<ResponsePayload>;
  schedule?: Maybe<Schedule>;
};

export type SchedulesPayload = {
  __typename?: 'SchedulesPayload';
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
  schedules?: Maybe<Array<Maybe<Schedule>>>;
};

export type Service = {
  __typename?: 'Service';
  createdAt?: Maybe<Scalars['String']>;
  duration: Scalars['String'];
  facility?: Maybe<Facility>;
  facilityId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isActive?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  price: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
};

/** The facility service code type assigned */
export enum ServiceCode {
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
  paginationOptions: PaginationInput;
};

export type ServicePayload = {
  __typename?: 'ServicePayload';
  response?: Maybe<ResponsePayload>;
  service?: Maybe<Service>;
};

export type ServicesPayload = {
  __typename?: 'ServicesPayload';
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
  services?: Maybe<Array<Maybe<Service>>>;
};

/** The doctor's speciality */
export enum Speciality {
  Gastroenterology = 'GASTROENTEROLOGY',
  Neurology = 'NEUROLOGY',
  PediatricDentist = 'PEDIATRIC_DENTIST',
  PediatricDermatology = 'PEDIATRIC_DERMATOLOGY',
  Periodontics = 'PERIODONTICS',
  Pharmacist = 'PHARMACIST',
  PhysicianAssistant = 'PHYSICIAN_ASSISTANT'
}

/** The doctor's SsnType */
export enum SsnType {
  Medicaid = 'MEDICAID',
  Medicare = 'MEDICARE',
  Oasdi = 'OASDI',
  Tanf = 'TANF'
}

export type Staff = {
  __typename?: 'Staff';
  createdAt: Scalars['String'];
  dob: Scalars['String'];
  email: Scalars['String'];
  facility?: Maybe<Facility>;
  facilityId?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  gender: Gender;
  id: Scalars['String'];
  lastName: Scalars['String'];
  mobile?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  primaryProvider?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
  username: Scalars['String'];
};

export type StaffInput = {
  facilityId?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
};

export type StaffPayload = {
  __typename?: 'StaffPayload';
  response?: Maybe<ResponsePayload>;
  staff?: Maybe<Staff>;
};

export type UpdateAttachmentInput = {
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
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
  id: Scalars['String'];
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
  id: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
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
  email?: Maybe<Scalars['String']>;
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
  prefix?: Maybe<Scalars['String']>;
  prescriptiveAuthNumber?: Maybe<Scalars['String']>;
  providerIntials?: Maybe<Scalars['String']>;
  /** Send doctor Type from the ENUM - Sign-up */
  roleType?: Maybe<UserRole>;
  /** Doctor speciality */
  speciality?: Maybe<Speciality>;
  specialityLicense?: Maybe<Scalars['String']>;
  ssn?: Maybe<Scalars['String']>;
  /** Doctor ssn type */
  ssnType?: Maybe<SsnType>;
  stateLicense?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  taxId?: Maybe<Scalars['String']>;
  taxIdStuff?: Maybe<Scalars['String']>;
  taxonomyCode?: Maybe<Scalars['String']>;
  timeZone?: Maybe<Scalars['String']>;
  upin?: Maybe<Scalars['String']>;
};

export type UpdateEmployerItemInput = {
  email?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  industry?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  patientId?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  usualOccupation?: Maybe<Scalars['String']>;
};

export type UpdateFacilityInput = {
  updateBillingAddressInput: UpdateBillingAddressInput;
  updateContactInput: UpdateContactInput;
  updateFacilityItemInput: UpdateFacilityItemInput;
};

export type UpdateFacilityItemInput = {
  cliaIdNumber?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  federalTaxId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  insurancePlanType?: Maybe<Scalars['String']>;
  mammographyCertificationNumber?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  npi?: Maybe<Scalars['String']>;
  /** Facility type */
  practiceType?: Maybe<PracticeType>;
  revenueCode?: Maybe<Scalars['String']>;
  /** Service Code type */
  serviceCode?: Maybe<ServiceCode>;
  stateImmunizationId?: Maybe<Scalars['String']>;
  tamxonomyCode?: Maybe<Scalars['String']>;
  timeZone?: Maybe<Scalars['String']>;
};

export type UpdateFacilityTimeZoneInput = {
  id: Scalars['String'];
  timeZone?: Maybe<Scalars['String']>;
};

export type UpdatePasswordInput = {
  id: Scalars['String'];
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
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
  language?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  maritialStatus?: Maybe<Maritialstatus>;
  medicationHistoryAuthority?: Maybe<Scalars['Boolean']>;
  middleName?: Maybe<Scalars['String']>;
  motherMaidenName?: Maybe<Scalars['String']>;
  patientNote?: Maybe<Scalars['String']>;
  prefferedName?: Maybe<Scalars['String']>;
  previousFirstName?: Maybe<Scalars['String']>;
  previouslastName?: Maybe<Scalars['String']>;
  primaryDepartment?: Maybe<PrimaryDepartment>;
  privacyNotice?: Maybe<Scalars['Boolean']>;
  pronouns?: Maybe<Pronouns>;
  race?: Maybe<Race>;
  registrationDate?: Maybe<Scalars['String']>;
  registrationDepartment?: Maybe<RegDepartment>;
  releaseOfInfoBill?: Maybe<Scalars['Boolean']>;
  sexAtBirth?: Maybe<Genderidentity>;
  sexualOrientation?: Maybe<Sexualorientation>;
  ssn?: Maybe<Scalars['String']>;
  statementDelivereOnline?: Maybe<Scalars['Boolean']>;
  statementNote?: Maybe<Scalars['String']>;
  statementNoteDateFrom?: Maybe<Scalars['String']>;
  statementNoteDateTo?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  usualProviderId?: Maybe<Scalars['String']>;
};

export type UpdatePatientProvider = {
  patientId: Scalars['String'];
  providerId: Scalars['String'];
};

export type UpdateRoleInput = {
  id: Scalars['String'];
  roles: Array<UserRole>;
};

export type UpdateScheduleInput = {
  doctorId?: Maybe<Scalars['String']>;
  endAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  recurringEndDate?: Maybe<Scalars['DateTime']>;
  startAt?: Maybe<Scalars['DateTime']>;
};

export type UpdateServiceInput = {
  duration?: Maybe<Scalars['String']>;
  facilityId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isActive?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
};

export type UpdateStaffInput = {
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
  primaryProvider?: Maybe<Scalars['String']>;
  /** Send Investor Type from the ENUM - Sign-up */
  roleType?: Maybe<UserRole>;
  username?: Maybe<Scalars['String']>;
};

export type UpdateUserInput = {
  adminId?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  emailVerified?: Maybe<Scalars['Boolean']>;
  facilityId?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  emailVerified: Scalars['Boolean'];
  facility?: Maybe<Array<Facility>>;
  id: Scalars['String'];
  inviteAcceptedAt: Scalars['String'];
  inviteSentAt: Scalars['String'];
  roles?: Maybe<Array<Maybe<Role>>>;
  status: UserStatus;
  token?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  userId: Scalars['String'];
  userType: Scalars['String'];
};

export type UserIdInput = {
  adminId?: Maybe<Scalars['String']>;
  isEnabled?: Maybe<Scalars['Boolean']>;
  userId: Scalars['String'];
};

export type UserPayload = {
  __typename?: 'UserPayload';
  response?: Maybe<ResponsePayload>;
  user?: Maybe<User>;
};

/** The user role assigned */
export enum UserRole {
  Admin = 'ADMIN',
  Billing = 'BILLING',
  Doctor = 'DOCTOR',
  Nurse = 'NURSE',
  Patient = 'PATIENT',
  Staff = 'STAFF',
  SuperAdmin = 'SUPER_ADMIN'
}

/** The user status */
export enum UserStatus {
  Active = 'ACTIVE',
  Deactivated = 'DEACTIVATED'
}

export type UsersInput = {
  paginationOptions: PaginationInput;
  role?: Maybe<UserRole>;
  status?: Maybe<UserStatus>;
};

export type UsersPayload = {
  __typename?: 'UsersPayload';
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type VerifyEmailInput = {
  token: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  loginUser: LoginUserInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AccessUserPayload', access_token?: string | null | undefined, response?: { __typename?: 'ResponsePayload', message?: string | null | undefined, status?: number | null | undefined } | null | undefined, roles?: Array<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string }> | null | undefined } };

export type GetLoggedInUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLoggedInUserQuery = { __typename?: 'Query', me: { __typename?: 'UserPayload', response?: { __typename?: 'ResponsePayload', status?: number | null | undefined, error?: string | null | undefined, message?: string | null | undefined } | null | undefined, user?: { __typename?: 'User', id: string, email: string, token?: string | null | undefined, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string, roles?: Array<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string } | null | undefined> | null | undefined, facility?: Array<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: string | null | undefined, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, isPrivate?: boolean | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, createdAt?: string | null | undefined, updatedAt?: string | null | undefined, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null | undefined, mobile?: string | null | undefined, pager?: string | null | undefined, fax?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, state?: string | null | undefined, serviceCode: ServiceCodes, country?: string | null | undefined, userId?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, staff?: Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: string | null | undefined, mobile?: string | null | undefined, gender: Gender, createdAt: string, updatedAt: string }> | null | undefined }> | null | undefined } | null | undefined } };

export type ForgetPasswordMutationVariables = Exact<{
  forgotPasswordInput: ForgotPasswordInput;
}>;


export type ForgetPasswordMutation = { __typename?: 'Mutation', forgotPassword: { __typename?: 'ForgotPasswordPayload', response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, message?: string | null | undefined, status?: number | null | undefined } | null | undefined } };

export type ResetPasswordMutationVariables = Exact<{
  resetPassword: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'UserPayload', user?: { __typename?: 'User', id: string, email: string, token?: string | null | undefined, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string, roles?: Array<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string } | null | undefined> | null | undefined, facility?: Array<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: string | null | undefined, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, isPrivate?: boolean | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, createdAt?: string | null | undefined, updatedAt?: string | null | undefined, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null | undefined, mobile?: string | null | undefined, pager?: string | null | undefined, fax?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, state?: string | null | undefined, country?: string | null | undefined, serviceCode: ServiceCodes, userId?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, staff?: Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: string | null | undefined, mobile?: string | null | undefined, gender: Gender, createdAt: string, updatedAt: string }> | null | undefined }> | null | undefined } | null | undefined, response?: { __typename?: 'ResponsePayload', status?: number | null | undefined, message?: string | null | undefined, error?: string | null | undefined } | null | undefined } };

export type RegisterUserMutationVariables = Exact<{
  user: RegisterUserInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'UserPayload', user?: { __typename?: 'User', id: string, email: string, token?: string | null | undefined, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string, roles?: Array<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string } | null | undefined> | null | undefined, facility?: Array<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: string | null | undefined, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, isPrivate?: boolean | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, createdAt?: string | null | undefined, updatedAt?: string | null | undefined, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null | undefined, mobile?: string | null | undefined, pager?: string | null | undefined, fax?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, state?: string | null | undefined, country?: string | null | undefined, userId?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, staff?: Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: string | null | undefined, mobile?: string | null | undefined, gender: Gender, createdAt: string, updatedAt: string }> | null | undefined }> | null | undefined } | null | undefined, response?: { __typename?: 'ResponsePayload', status?: number | null | undefined, message?: string | null | undefined, error?: string | null | undefined } | null | undefined } };

export type EmailVerificationMutationVariables = Exact<{
  verifyEmail: VerifyEmailInput;
}>;


export type EmailVerificationMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'UserPayload', user?: { __typename?: 'User', id: string, email: string, token?: string | null | undefined, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string, roles?: Array<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string } | null | undefined> | null | undefined, facility?: Array<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: string | null | undefined, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, isPrivate?: boolean | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, createdAt?: string | null | undefined, updatedAt?: string | null | undefined, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null | undefined, mobile?: string | null | undefined, pager?: string | null | undefined, fax?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, state?: string | null | undefined, country?: string | null | undefined, userId?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, staff?: Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: string | null | undefined, mobile?: string | null | undefined, gender: Gender, createdAt: string, updatedAt: string }> | null | undefined }> | null | undefined } | null | undefined, response?: { __typename?: 'ResponsePayload', error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type ResendVerificationEmailMutationVariables = Exact<{
  resendVerificationEmail: ResendVerificationEmail;
}>;


export type ResendVerificationEmailMutation = { __typename?: 'Mutation', resendVerificationEmail: { __typename?: 'UserPayload', user?: { __typename?: 'User', id: string, email: string, token?: string | null | undefined, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string, roles?: Array<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string } | null | undefined> | null | undefined, facility?: Array<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: string | null | undefined, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, isPrivate?: boolean | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, createdAt?: string | null | undefined, updatedAt?: string | null | undefined, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null | undefined, mobile?: string | null | undefined, pager?: string | null | undefined, fax?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, state?: string | null | undefined, country?: string | null | undefined, userId?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, staff?: Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: string | null | undefined, mobile?: string | null | undefined, gender: Gender, createdAt: string, updatedAt: string }> | null | undefined }> | null | undefined } | null | undefined, response?: { __typename?: 'ResponsePayload', error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type FindAllDoctorQueryVariables = Exact<{
  doctorInput: DoctorInput;
}>;


export type FindAllDoctorQuery = { __typename?: 'Query', findAllDoctor: { __typename?: 'AllDoctorPayload', doctors?: Array<{ __typename?: 'Doctor', id: string, ssn?: string | null | undefined, dob?: string | null | undefined, npi?: string | null | undefined, upin?: string | null | undefined, email?: string | null | undefined, taxId?: string | null | undefined, prefix?: string | null | undefined, suffix?: string | null | undefined, ssnType?: SsnType | null | undefined, lastName?: string | null | undefined, firstName?: string | null | undefined, deaNumber?: string | null | undefined, middleName?: string | null | undefined, speciality?: Speciality | null | undefined, taxIdStuff?: string | null | undefined, stateLicense?: string | null | undefined, dpsCtpNumber?: string | null | undefined, taxonomyCode?: string | null | undefined, emcProviderId?: string | null | undefined, providerIntials?: string | null | undefined, languagesSpoken?: string | null | undefined, blueShildNumber?: string | null | undefined, billingFacility?: string | null | undefined, campusGrpNumber?: string | null | undefined, licenseTermDate?: string | null | undefined, degreeCredentials?: string | null | undefined, anesthesiaLicense?: string | null | undefined, specialityLicense?: string | null | undefined, medicareGrpNumber?: string | null | undefined, prescriptiveAuthNumber?: string | null | undefined, licenseActiveDate?: string | null | undefined, meammographyCertNumber?: string | null | undefined, medicaidGrpNumber?: string | null | undefined, deaActiveDate: string, deaTermDate: string, createdAt: string, updatedAt: string, billingAddress?: Array<{ __typename?: 'BillingAddress', id: string, fax?: string | null | undefined, email?: string | null | undefined, phone?: string | null | undefined, mobile?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, state?: string | null | undefined, country?: string | null | undefined, userId?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null | undefined, phone?: string | null | undefined, mobile?: string | null | undefined, pager?: string | null | undefined, fax?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, zipCode?: string | null | undefined, serviceCode: ServiceCodes, city?: string | null | undefined, state?: string | null | undefined, country?: string | null | undefined, userId?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, facility?: { __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: string | null | undefined, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, isPrivate?: boolean | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, createdAt?: string | null | undefined, updatedAt?: string | null | undefined } | null | undefined, user?: { __typename?: 'User', id: string, email: string, token?: string | null | undefined, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string } | null | undefined } | null | undefined> | null | undefined, pagination?: { __typename?: 'PaginationPayload', totalPages?: number | null | undefined } | null | undefined, response?: { __typename?: 'ResponsePayload', error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type CreateDoctorMutationVariables = Exact<{
  createDoctorInput: CreateDoctorInput;
}>;


export type CreateDoctorMutation = { __typename?: 'Mutation', createDoctor: { __typename?: 'DoctorPayload', response?: { __typename?: 'ResponsePayload', error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type RemoveDoctorMutationVariables = Exact<{
  removeDoctor: RemoveDoctor;
}>;


export type RemoveDoctorMutation = { __typename?: 'Mutation', removeDoctor: { __typename?: 'DoctorPayload', response?: { __typename?: 'ResponsePayload', error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type GetDoctorQueryVariables = Exact<{
  getDoctor: GetDoctor;
}>;


export type GetDoctorQuery = { __typename?: 'Query', getDoctor: { __typename?: 'DoctorPayload', doctor?: { __typename?: 'Doctor', id: string, firstName?: string | null | undefined, middleName?: string | null | undefined, lastName?: string | null | undefined, prefix?: string | null | undefined, suffix?: string | null | undefined, email?: string | null | undefined, ssnType?: SsnType | null | undefined, providerIntials?: string | null | undefined, degreeCredentials?: string | null | undefined, speciality?: Speciality | null | undefined, dob?: string | null | undefined, taxId?: string | null | undefined, ssn?: string | null | undefined, taxonomyCode?: string | null | undefined, deaNumber?: string | null | undefined, prescriptiveAuthNumber?: string | null | undefined, licenseTermDate?: string | null | undefined, stateLicense?: string | null | undefined, languagesSpoken?: string | null | undefined, dpsCtpNumber?: string | null | undefined, anesthesiaLicense?: string | null | undefined, specialityLicense?: string | null | undefined, taxIdStuff?: string | null | undefined, blueShildNumber?: string | null | undefined, campusGrpNumber?: string | null | undefined, medicareGrpNumber?: string | null | undefined, billingFacility?: string | null | undefined, emcProviderId?: string | null | undefined, upin?: string | null | undefined, npi?: string | null | undefined, licenseActiveDate?: string | null | undefined, meammographyCertNumber?: string | null | undefined, medicaidGrpNumber?: string | null | undefined, deaActiveDate: string, deaTermDate: string, createdAt: string, updatedAt: string, billingAddress?: Array<{ __typename?: 'BillingAddress', id: string, email?: string | null | undefined, mobile?: string | null | undefined, phone?: string | null | undefined, fax?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, state?: string | null | undefined, country?: string | null | undefined, userId?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null | undefined, phone?: string | null | undefined, mobile?: string | null | undefined, pager?: string | null | undefined, fax?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, serviceCode: ServiceCodes, zipCode?: string | null | undefined, city?: string | null | undefined, state?: string | null | undefined, country?: string | null | undefined, userId?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, facility?: { __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: string | null | undefined, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, isPrivate?: boolean | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, createdAt?: string | null | undefined, updatedAt?: string | null | undefined } | null | undefined, user?: { __typename?: 'User', id: string, email: string, token?: string | null | undefined, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string } | null | undefined } | null | undefined, response?: { __typename?: 'ResponsePayload', error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type UpdateDoctorMutationVariables = Exact<{
  updateDoctorInput: UpdateDoctorInput;
}>;


export type UpdateDoctorMutation = { __typename?: 'Mutation', updateDoctor: { __typename?: 'DoctorPayload', response?: { __typename?: 'ResponsePayload', error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type FindAllFacilitiesQueryVariables = Exact<{
  facilityInput: FacilityInput;
}>;


export type FindAllFacilitiesQuery = { __typename?: 'Query', findAllFacility: { __typename?: 'FacilitiesPayload', facility?: Array<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: string | null | undefined, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, isPrivate?: boolean | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, createdAt?: string | null | undefined, updatedAt?: string | null | undefined, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null | undefined, mobile?: string | null | undefined, phone?: string | null | undefined, pager?: string | null | undefined, fax?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, zipCode?: string | null | undefined, serviceCode: ServiceCodes, city?: string | null | undefined, state?: string | null | undefined, country?: string | null | undefined, userId?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, staff?: Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: string | null | undefined, mobile?: string | null | undefined, gender: Gender, createdAt: string, updatedAt: string, user?: { __typename?: 'User', id: string, email: string, token?: string | null | undefined, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string } | null | undefined }> | null | undefined } | null | undefined> | null | undefined, pagination?: { __typename?: 'PaginationPayload', page?: number | null | undefined, totalCount?: number | null | undefined, totalPages?: number | null | undefined } | null | undefined, response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type GetFacilityQueryVariables = Exact<{
  getFacility: GetFacility;
}>;


export type GetFacilityQuery = { __typename?: 'Query', getFacility: { __typename?: 'FacilityPayload', facility?: { __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: string | null | undefined, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, isPrivate?: boolean | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, createdAt?: string | null | undefined, updatedAt?: string | null | undefined, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null | undefined, phone?: string | null | undefined, mobile?: string | null | undefined, fax?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, zipCode?: string | null | undefined, serviceCode: ServiceCodes, city?: string | null | undefined, state?: string | null | undefined, country?: string | null | undefined, userId?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, billingAddress?: Array<{ __typename?: 'BillingAddress', id: string, email?: string | null | undefined, mobile?: string | null | undefined, phone?: string | null | undefined, fax?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, state?: string | null | undefined, country?: string | null | undefined, userId?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, staff?: Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: string | null | undefined, mobile?: string | null | undefined, gender: Gender, createdAt: string, updatedAt: string, user?: { __typename?: 'User', id: string, email: string, token?: string | null | undefined, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string } | null | undefined }> | null | undefined } | null | undefined, response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type RemoveFacilityMutationVariables = Exact<{
  removeFacility: RemoveFacility;
}>;


export type RemoveFacilityMutation = { __typename?: 'Mutation', removeFacility: { __typename?: 'FacilityPayload', response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type UpdateFacilityMutationVariables = Exact<{
  updateFacilityInput: UpdateFacilityInput;
}>;


export type UpdateFacilityMutation = { __typename?: 'Mutation', updateFacility: { __typename?: 'FacilityPayload', facility?: { __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: string | null | undefined, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, isPrivate?: boolean | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null | undefined, phone?: string | null | undefined, mobile?: string | null | undefined, pager?: string | null | undefined, fax?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, zipCode?: string | null | undefined, serviceCode: ServiceCodes, city?: string | null | undefined, state?: string | null | undefined, country?: string | null | undefined, userId?: string | null | undefined }> | null | undefined, staff?: Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: string | null | undefined, mobile?: string | null | undefined, gender: Gender, user?: { __typename?: 'User', id: string, email: string, token?: string | null | undefined, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string } | null | undefined }> | null | undefined } | null | undefined, response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type CreateFacilityMutationVariables = Exact<{
  createFacilityInput: CreateFacilityInput;
}>;


export type CreateFacilityMutation = { __typename?: 'Mutation', createFacility: { __typename?: 'FacilityPayload', facility?: { __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: string | null | undefined, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, isPrivate?: boolean | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, createdAt?: string | null | undefined, updatedAt?: string | null | undefined, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null | undefined, mobile?: string | null | undefined, phone?: string | null | undefined, pager?: string | null | undefined, fax?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, serviceCode: ServiceCodes, zipCode?: string | null | undefined, city?: string | null | undefined, state?: string | null | undefined, country?: string | null | undefined, userId?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, staff?: Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: string | null | undefined, mobile?: string | null | undefined, gender: Gender, createdAt: string, updatedAt: string, user?: { __typename?: 'User', id: string, email: string, token?: string | null | undefined, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string } | null | undefined }> | null | undefined } | null | undefined, response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type FindAllServicesQueryVariables = Exact<{
  serviceInput: ServiceInput;
}>;


export type FindAllServicesQuery = { __typename?: 'Query', findAllServices: { __typename?: 'ServicesPayload', pagination?: { __typename?: 'PaginationPayload', page?: number | null | undefined, totalCount?: number | null | undefined, totalPages?: number | null | undefined } | null | undefined, response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined, services?: Array<{ __typename?: 'Service', id: string, name: string, duration: string, price: string, isActive?: boolean | null | undefined, facilityId?: string | null | undefined, createdAt?: string | null | undefined, updatedAt?: string | null | undefined } | null | undefined> | null | undefined } };

export type GetServiceQueryVariables = Exact<{
  getService: GetService;
}>;


export type GetServiceQuery = { __typename?: 'Query', getService: { __typename?: 'ServicePayload', response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined, service?: { __typename?: 'Service', id: string, name: string, duration: string, price: string, isActive?: boolean | null | undefined, facilityId?: string | null | undefined, createdAt?: string | null | undefined, updatedAt?: string | null | undefined, facility?: { __typename?: 'Facility', id: string, name: string, createdAt?: string | null | undefined, updatedAt?: string | null | undefined } | null | undefined } | null | undefined } };

export type RemoveServiceMutationVariables = Exact<{
  removeService: RemoveService;
}>;


export type RemoveServiceMutation = { __typename?: 'Mutation', removeService: { __typename?: 'ServicePayload', response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type CreateServiceMutationVariables = Exact<{
  createServiceInput: CreateServiceInput;
}>;


export type CreateServiceMutation = { __typename?: 'Mutation', createService: { __typename?: 'ServicePayload', service?: { __typename?: 'Service', id: string, name: string, duration: string, price: string, isActive?: boolean | null | undefined, facilityId?: string | null | undefined, createdAt?: string | null | undefined, updatedAt?: string | null | undefined } | null | undefined, response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type UpdateServiceMutationVariables = Exact<{
  updateServiceInput: UpdateServiceInput;
}>;


export type UpdateServiceMutation = { __typename?: 'Mutation', updateService: { __typename?: 'ServicePayload', service?: { __typename?: 'Service', id: string, name: string, duration: string, price: string, isActive?: boolean | null | undefined, facilityId?: string | null | undefined, createdAt?: string | null | undefined, updatedAt?: string | null | undefined } | null | undefined, response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type CreateContactMutationVariables = Exact<{
  createContactInput: CreateContactInput;
}>;


export type CreateContactMutation = { __typename?: 'Mutation', createContact: { __typename?: 'ContactPayload', response?: { __typename?: 'ResponsePayload', error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type UpdateContactMutationVariables = Exact<{
  updateContactInput: UpdateContactInput;
}>;


export type UpdateContactMutation = { __typename?: 'Mutation', updateContact: { __typename?: 'ContactPayload', response?: { __typename?: 'ResponsePayload', error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type FindAllContactsQueryVariables = Exact<{
  contactInput: ContactInput;
}>;


export type FindAllContactsQuery = { __typename?: 'Query', findAllContacts: { __typename?: 'ContactsPayload', response?: { __typename?: 'ResponsePayload', error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined, pagination?: { __typename?: 'PaginationPayload', page?: number | null | undefined, limit?: number | null | undefined, totalPages?: number | null | undefined } | null | undefined, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null | undefined, name?: string | null | undefined, firstName?: string | null | undefined, lastName?: string | null | undefined, middleName?: string | null | undefined, suffix?: string | null | undefined, phone?: string | null | undefined, mobile?: string | null | undefined, pager?: string | null | undefined, fax?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, serviceCode: ServiceCodes, zipCode?: string | null | undefined, city?: string | null | undefined, state?: string | null | undefined, country?: string | null | undefined, createdAt: string, updatedAt: string, facility?: { __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, timeZone?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, createdAt?: string | null | undefined, updatedAt?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } };

export type RemoveContactMutationVariables = Exact<{
  removeContact: RemoveContact;
}>;


export type RemoveContactMutation = { __typename?: 'Mutation', removeContact: { __typename?: 'ContactPayload', response?: { __typename?: 'ResponsePayload', error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type FindContactQueryVariables = Exact<{
  getContact: GetContact;
}>;


export type FindContactQuery = { __typename?: 'Query', getContact: { __typename?: 'ContactPayload', response?: { __typename?: 'ResponsePayload', error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined, contact?: { __typename?: 'Contact', id: string, email?: string | null | undefined, name?: string | null | undefined, fax?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, phone?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, state?: string | null | undefined, country?: string | null | undefined, facilityId?: string | null | undefined, primaryContact?: boolean | null | undefined, serviceCode: ServiceCodes, createdAt: string, updatedAt: string, facility?: { __typename?: 'Facility', id: string, name: string, createdAt?: string | null | undefined, updatedAt?: string | null | undefined } | null | undefined } | null | undefined } };

export type CreateAttachmentDataMutationVariables = Exact<{
  createAttachmentInput: CreateAttachmentInput;
}>;


export type CreateAttachmentDataMutation = { __typename?: 'Mutation', createAttachmentData: { __typename?: 'AttachmentPayload', response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined, error?: string | null | undefined } | null | undefined, attachment?: { __typename?: 'Attachment', id: string, type: AttachmentType, typeId: string, key?: string | null | undefined, url?: string | null | undefined, createdAt: string, updatedAt: string } | null | undefined } };

export type RemoveAttachmentDataMutationVariables = Exact<{
  removeAttachment: RemoveAttachment;
}>;


export type RemoveAttachmentDataMutation = { __typename?: 'Mutation', removeAttachmentData: { __typename?: 'AttachmentPayload', response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined, error?: string | null | undefined } | null | undefined } };

export type UpdateAttachmentDataMutationVariables = Exact<{
  updateAttachmentInput: UpdateAttachmentInput;
}>;


export type UpdateAttachmentDataMutation = { __typename?: 'Mutation', updateAttachmentData: { __typename?: 'AttachmentPayload', response?: { __typename?: 'ResponsePayload', status?: number | null | undefined, name?: string | null | undefined, message?: string | null | undefined } | null | undefined, attachment?: { __typename?: 'Attachment', id: string, type: AttachmentType, typeId: string, key?: string | null | undefined, url?: string | null | undefined, createdAt: string, updatedAt: string } | null | undefined } };

export type GetAttachmentQueryVariables = Exact<{
  getMedia: GetMedia;
}>;


export type GetAttachmentQuery = { __typename?: 'Query', getAttachment: { __typename?: 'AttachmentMediaPayload', preSignedUrl?: string | null | undefined, response?: { __typename?: 'ResponsePayload', message?: string | null | undefined } | null | undefined } };

export type FindAllPatientQueryVariables = Exact<{
  patientInput: PatientInput;
}>;


export type FindAllPatientQuery = { __typename?: 'Query', findAllPatient: { __typename?: 'PatientsPayload', pagination?: { __typename?: 'PaginationPayload', page?: number | null | undefined, totalCount?: number | null | undefined, totalPages?: number | null | undefined } | null | undefined, response?: { __typename?: 'ResponsePayload', error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined, patients?: Array<{ __typename?: 'Patient', id: string, firstName?: string | null | undefined, middleName?: string | null | undefined, email?: string | null | undefined, lastName?: string | null | undefined, firstNameUsed?: string | null | undefined, prefferedName?: string | null | undefined, previousFirstName?: string | null | undefined, previouslastName?: string | null | undefined, motherMaidenName?: string | null | undefined, ssn?: string | null | undefined, gender: Genderidentity, dob?: string | null | undefined, registrationDepartment: RegDepartment, primaryDepartment: PrimaryDepartment, registrationDate: any, deceasedDate: any, privacyNotice: boolean, releaseOfInfoBill: boolean, callToConsent: boolean, medicationHistoryAuthority: boolean, patientNote?: string | null | undefined, language?: string | null | undefined, race?: Race | null | undefined, ethnicity?: Ethnicity | null | undefined, maritialStatus?: Maritialstatus | null | undefined, sexualOrientation?: Sexualorientation | null | undefined, genderIdentity?: Genderidentity | null | undefined, sexAtBirth?: Genderidentity | null | undefined, pronouns?: Pronouns | null | undefined, homeBound?: Homebound | null | undefined, holdStatement?: Holdstatement | null | undefined, statementDelivereOnline: boolean, statementNote: string, statementNoteDateFrom: string, statementNoteDateTo: string, createdAt: string, updatedAt: string, attachments?: Array<{ __typename?: 'Attachment', id: string, type: AttachmentType, typeId: string, key?: string | null | undefined, url?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null | undefined, phone?: string | null | undefined, mobile?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, city?: string | null | undefined, state?: string | null | undefined, zipCode?: string | null | undefined, country?: string | null | undefined, name?: string | null | undefined, suffix?: string | null | undefined, firstName?: string | null | undefined, primaryContact?: boolean | null | undefined, middleName?: string | null | undefined, lastName?: string | null | undefined, serviceCode: ServiceCodes, pager?: string | null | undefined, fax?: string | null | undefined, ssn?: string | null | undefined, employerName?: string | null | undefined, relationship?: RelationshipType | null | undefined, contactType?: ContactType | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, employer?: Array<{ __typename?: 'Employer', id: string, name?: string | null | undefined, email?: string | null | undefined, phone?: string | null | undefined, mobile?: string | null | undefined, industry?: string | null | undefined, usualOccupation?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, facility?: { __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: string | null | undefined, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, isPrivate?: boolean | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, createdAt?: string | null | undefined, updatedAt?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } };

export type GetPatientQueryVariables = Exact<{
  getPatient: GetPatient;
}>;


export type GetPatientQuery = { __typename?: 'Query', getPatient: { __typename?: 'PatientPayload', response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined, patient?: { __typename?: 'Patient', id: string, firstName?: string | null | undefined, middleName?: string | null | undefined, lastName?: string | null | undefined, suffix?: string | null | undefined, firstNameUsed?: string | null | undefined, prefferedName?: string | null | undefined, previousFirstName?: string | null | undefined, previouslastName?: string | null | undefined, motherMaidenName?: string | null | undefined, ssn?: string | null | undefined, gender: Genderidentity, dob?: string | null | undefined, registrationDepartment: RegDepartment, primaryDepartment: PrimaryDepartment, registrationDate: any, deceasedDate: any, privacyNotice: boolean, releaseOfInfoBill: boolean, callToConsent: boolean, medicationHistoryAuthority: boolean, patientNote?: string | null | undefined, language?: string | null | undefined, race?: Race | null | undefined, ethnicity?: Ethnicity | null | undefined, maritialStatus?: Maritialstatus | null | undefined, sexualOrientation?: Sexualorientation | null | undefined, genderIdentity?: Genderidentity | null | undefined, sexAtBirth?: Genderidentity | null | undefined, pronouns?: Pronouns | null | undefined, homeBound?: Homebound | null | undefined, holdStatement?: Holdstatement | null | undefined, statementDelivereOnline: boolean, statementNote: string, statementNoteDateFrom: string, statementNoteDateTo: string, createdAt: string, updatedAt: string, attachments?: Array<{ __typename?: 'Attachment', id: string, type: AttachmentType, typeId: string, key?: string | null | undefined, url?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, contacts?: Array<{ __typename?: 'Contact', id: string, email?: string | null | undefined, name?: string | null | undefined, suffix?: string | null | undefined, firstName?: string | null | undefined, middleName?: string | null | undefined, lastName?: string | null | undefined, phone?: string | null | undefined, serviceCode: ServiceCodes, primaryContact?: boolean | null | undefined, mobile?: string | null | undefined, pager?: string | null | undefined, fax?: string | null | undefined, address?: string | null | undefined, address2?: string | null | undefined, zipCode?: string | null | undefined, city?: string | null | undefined, state?: string | null | undefined, country?: string | null | undefined, ssn?: string | null | undefined, employerName?: string | null | undefined, relationship?: RelationshipType | null | undefined, contactType?: ContactType | null | undefined }> | null | undefined, employer?: Array<{ __typename?: 'Employer', id: string, name?: string | null | undefined, email?: string | null | undefined, phone?: string | null | undefined, mobile?: string | null | undefined, industry?: string | null | undefined, usualOccupation?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, facility?: { __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: string | null | undefined, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, isPrivate?: boolean | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, updatedAt?: string | null | undefined } | null | undefined, usualProvider?: Array<{ __typename?: 'Doctor', id: string, firstName?: string | null | undefined, lastName?: string | null | undefined, createdAt: string, updatedAt: string, schedule?: Array<{ __typename?: 'Schedule', id: string, startAt: any, endAt: any, recurringEndDate?: any | null | undefined, createdAt: string, updatedAt: string }> | null | undefined } | null | undefined> | null | undefined } | null | undefined } };

export type RemovePatientMutationVariables = Exact<{
  removePatient: RemovePatient;
}>;


export type RemovePatientMutation = { __typename?: 'Mutation', removePatient: { __typename?: 'PatientPayload', response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type CreatePatientMutationVariables = Exact<{
  createPatientInput: CreatePatientInput;
}>;


export type CreatePatientMutation = { __typename?: 'Mutation', createPatient: { __typename?: 'PatientPayload', response?: { __typename?: 'ResponsePayload', error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type UpdatePatientMutationVariables = Exact<{
  updatePatientInput: UpdatePatientInput;
}>;


export type UpdatePatientMutation = { __typename?: 'Mutation', updatePatient: { __typename?: 'PatientPayload', response?: { __typename?: 'ResponsePayload', error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type FindAllStaffQueryVariables = Exact<{
  staffInput: StaffInput;
}>;


export type FindAllStaffQuery = { __typename?: 'Query', findAllStaff: { __typename?: 'AllStaffPayload', pagination?: { __typename?: 'PaginationPayload', page?: number | null | undefined, totalCount?: number | null | undefined, totalPages?: number | null | undefined } | null | undefined, response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined, allstaff?: Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: string | null | undefined, mobile?: string | null | undefined, gender: Gender, createdAt: string, updatedAt: string, user?: { __typename?: 'User', id: string, email: string, token?: string | null | undefined, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string } | null | undefined, facility?: { __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: string | null | undefined, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, isPrivate?: boolean | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, createdAt?: string | null | undefined, updatedAt?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } };

export type GetStaffQueryVariables = Exact<{
  getStaff: GetStaff;
}>;


export type GetStaffQuery = { __typename?: 'Query', getStaff: { __typename?: 'StaffPayload', response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined, staff?: { __typename?: 'Staff', id: string, dob: string, email: string, phone?: string | null | undefined, mobile?: string | null | undefined, gender: Gender, lastName: string, username: string, firstName: string, facilityId?: string | null | undefined, createdAt: string, updatedAt: string, user?: { __typename?: 'User', id: string, email: string, token?: string | null | undefined, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string, roles?: Array<{ __typename?: 'Role', id: string, role: UserRole } | null | undefined> | null | undefined } | null | undefined, facility?: { __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: string | null | undefined, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, isPrivate?: boolean | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, createdAt?: string | null | undefined, updatedAt?: string | null | undefined } | null | undefined } | null | undefined } };

export type RemoveStaffMutationVariables = Exact<{
  removeStaff: RemoveStaff;
}>;


export type RemoveStaffMutation = { __typename?: 'Mutation', removeStaff: { __typename?: 'StaffPayload', response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined } };

export type UpdateStaffMutationVariables = Exact<{
  updateStaffInput: UpdateStaffInput;
}>;


export type UpdateStaffMutation = { __typename?: 'Mutation', updateStaff: { __typename?: 'StaffPayload', response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined, staff?: { __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: string | null | undefined, mobile?: string | null | undefined, gender: Gender, createdAt: string, updatedAt: string, user?: { __typename?: 'User', id: string, email: string, token?: string | null | undefined, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string, roles?: Array<{ __typename?: 'Role', id: string, role: UserRole } | null | undefined> | null | undefined } | null | undefined, facility?: { __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: string | null | undefined, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, isPrivate?: boolean | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, createdAt?: string | null | undefined, updatedAt?: string | null | undefined } | null | undefined } | null | undefined } };

export type CreateStaffMutationVariables = Exact<{
  createStaffInput: CreateStaffInput;
}>;


export type CreateStaffMutation = { __typename?: 'Mutation', createStaff: { __typename?: 'StaffPayload', response?: { __typename?: 'ResponsePayload', name?: string | null | undefined, error?: string | null | undefined, status?: number | null | undefined, message?: string | null | undefined } | null | undefined, staff?: { __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: string | null | undefined, mobile?: string | null | undefined, gender: Gender, createdAt: string, updatedAt: string, user?: { __typename?: 'User', id: string, email: string, token?: string | null | undefined, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string } | null | undefined, facility?: { __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: string | null | undefined, cliaIdNumber?: string | null | undefined, federalTaxId?: string | null | undefined, isPrivate?: boolean | null | undefined, revenueCode?: string | null | undefined, tamxonomyCode?: string | null | undefined, insurancePlanType?: string | null | undefined, mammographyCertificationNumber?: string | null | undefined, npi?: string | null | undefined, serviceCode: ServiceCode, createdAt?: string | null | undefined, updatedAt?: string | null | undefined } | null | undefined } | null | undefined } };


export const LoginDocument = gql`
    mutation Login($loginUser: LoginUserInput!) {
  login(loginUser: $loginUser) {
    access_token
    response {
      message
      status
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
      token
      status
      userId
      userType
      inviteSentAt
      emailVerified
      inviteAcceptedAt
      createdAt
      updatedAt
      roles {
        id
        role
        createdAt
        updatedAt
      }
      facility {
        id
        name
        practiceType
        code
        cliaIdNumber
        federalTaxId
        isPrivate
        revenueCode
        tamxonomyCode
        insurancePlanType
        mammographyCertificationNumber
        npi
        serviceCode
        createdAt
        updatedAt
        contacts {
          id
          email
          mobile
          pager
          fax
          address
          address2
          zipCode
          city
          state
          serviceCode
          country
          userId
          serviceCode
          createdAt
          updatedAt
        }
        staff {
          id
          firstName
          lastName
          email
          username
          dob
          phone
          mobile
          gender
          createdAt
          updatedAt
        }
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
    user {
      id
      email
      token
      status
      userId
      userType
      inviteSentAt
      emailVerified
      inviteAcceptedAt
      createdAt
      updatedAt
      roles {
        id
        role
        createdAt
        updatedAt
      }
      facility {
        id
        name
        practiceType
        code
        cliaIdNumber
        federalTaxId
        isPrivate
        revenueCode
        tamxonomyCode
        insurancePlanType
        mammographyCertificationNumber
        npi
        serviceCode
        createdAt
        updatedAt
        contacts {
          id
          email
          mobile
          pager
          fax
          address
          address2
          zipCode
          city
          state
          country
          serviceCode
          userId
          createdAt
          updatedAt
        }
        staff {
          id
          firstName
          lastName
          email
          username
          dob
          phone
          mobile
          gender
          createdAt
          updatedAt
        }
      }
    }
    response {
      status
      message
      error
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
export const RegisterUserDocument = gql`
    mutation RegisterUser($user: RegisterUserInput!) {
  registerUser(user: $user) {
    user {
      id
      email
      token
      status
      userId
      userType
      inviteSentAt
      emailVerified
      inviteAcceptedAt
      createdAt
      updatedAt
      roles {
        id
        role
        createdAt
        updatedAt
      }
      facility {
        id
        name
        practiceType
        code
        cliaIdNumber
        federalTaxId
        isPrivate
        revenueCode
        tamxonomyCode
        insurancePlanType
        mammographyCertificationNumber
        npi
        serviceCode
        createdAt
        updatedAt
        contacts {
          id
          email
          mobile
          pager
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
        staff {
          id
          firstName
          lastName
          email
          username
          dob
          phone
          mobile
          gender
          createdAt
          updatedAt
        }
      }
    }
    response {
      status
      message
      error
    }
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const EmailVerificationDocument = gql`
    mutation EmailVerification($verifyEmail: VerifyEmailInput!) {
  verifyEmail(verifyEmail: $verifyEmail) {
    user {
      id
      email
      token
      status
      userId
      userType
      inviteSentAt
      emailVerified
      inviteAcceptedAt
      createdAt
      updatedAt
      roles {
        id
        role
        createdAt
        updatedAt
      }
      facility {
        id
        name
        practiceType
        code
        cliaIdNumber
        federalTaxId
        isPrivate
        revenueCode
        tamxonomyCode
        insurancePlanType
        mammographyCertificationNumber
        npi
        serviceCode
        createdAt
        updatedAt
        contacts {
          id
          email
          mobile
          pager
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
        staff {
          id
          firstName
          lastName
          email
          username
          dob
          phone
          mobile
          gender
          createdAt
          updatedAt
        }
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
export type EmailVerificationMutationFn = Apollo.MutationFunction<EmailVerificationMutation, EmailVerificationMutationVariables>;

/**
 * __useEmailVerificationMutation__
 *
 * To run a mutation, you first call `useEmailVerificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEmailVerificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [emailVerificationMutation, { data, loading, error }] = useEmailVerificationMutation({
 *   variables: {
 *      verifyEmail: // value for 'verifyEmail'
 *   },
 * });
 */
export function useEmailVerificationMutation(baseOptions?: Apollo.MutationHookOptions<EmailVerificationMutation, EmailVerificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EmailVerificationMutation, EmailVerificationMutationVariables>(EmailVerificationDocument, options);
      }
export type EmailVerificationMutationHookResult = ReturnType<typeof useEmailVerificationMutation>;
export type EmailVerificationMutationResult = Apollo.MutationResult<EmailVerificationMutation>;
export type EmailVerificationMutationOptions = Apollo.BaseMutationOptions<EmailVerificationMutation, EmailVerificationMutationVariables>;
export const ResendVerificationEmailDocument = gql`
    mutation ResendVerificationEmail($resendVerificationEmail: ResendVerificationEmail!) {
  resendVerificationEmail(resendVerificationEmail: $resendVerificationEmail) {
    user {
      id
      email
      token
      status
      userId
      userType
      inviteSentAt
      emailVerified
      inviteAcceptedAt
      createdAt
      updatedAt
      roles {
        id
        role
        createdAt
        updatedAt
      }
      facility {
        id
        name
        practiceType
        code
        cliaIdNumber
        federalTaxId
        isPrivate
        revenueCode
        tamxonomyCode
        insurancePlanType
        mammographyCertificationNumber
        npi
        serviceCode
        createdAt
        updatedAt
        contacts {
          id
          email
          mobile
          pager
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
        staff {
          id
          firstName
          lastName
          email
          username
          dob
          phone
          mobile
          gender
          createdAt
          updatedAt
        }
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
export type ResendVerificationEmailMutationFn = Apollo.MutationFunction<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;

/**
 * __useResendVerificationEmailMutation__
 *
 * To run a mutation, you first call `useResendVerificationEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendVerificationEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendVerificationEmailMutation, { data, loading, error }] = useResendVerificationEmailMutation({
 *   variables: {
 *      resendVerificationEmail: // value for 'resendVerificationEmail'
 *   },
 * });
 */
export function useResendVerificationEmailMutation(baseOptions?: Apollo.MutationHookOptions<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>(ResendVerificationEmailDocument, options);
      }
export type ResendVerificationEmailMutationHookResult = ReturnType<typeof useResendVerificationEmailMutation>;
export type ResendVerificationEmailMutationResult = Apollo.MutationResult<ResendVerificationEmailMutation>;
export type ResendVerificationEmailMutationOptions = Apollo.BaseMutationOptions<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;
export const FindAllDoctorDocument = gql`
    query FindAllDoctor($doctorInput: DoctorInput!) {
  findAllDoctor(doctorInput: $doctorInput) {
    doctors {
      id
      ssn
      dob
      npi
      upin
      email
      taxId
      taxId
      prefix
      suffix
      ssnType
      lastName
      firstName
      deaNumber
      middleName
      middleName
      speciality
      taxIdStuff
      stateLicense
      dpsCtpNumber
      taxonomyCode
      emcProviderId
      providerIntials
      languagesSpoken
      blueShildNumber
      billingFacility
      campusGrpNumber
      licenseTermDate
      degreeCredentials
      anesthesiaLicense
      specialityLicense
      medicareGrpNumber
      prescriptiveAuthNumber
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
        fax
        email
        phone
        mobile
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
        zipCode
        serviceCode
        city
        state
        country
        userId
        serviceCode
        createdAt
        updatedAt
      }
      facility {
        id
        name
        practiceType
        code
        cliaIdNumber
        federalTaxId
        isPrivate
        revenueCode
        tamxonomyCode
        insurancePlanType
        mammographyCertificationNumber
        npi
        serviceCode
        createdAt
        updatedAt
      }
      user {
        id
        email
        token
        status
        userId
        userType
        inviteSentAt
        emailVerified
        inviteAcceptedAt
        createdAt
        updatedAt
      }
    }
    pagination {
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
      ssnType
      providerIntials
      degreeCredentials
      speciality
      dob
      taxId
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
        serviceCode
        createdAt
        updatedAt
      }
      facility {
        id
        name
        practiceType
        code
        cliaIdNumber
        federalTaxId
        isPrivate
        revenueCode
        tamxonomyCode
        insurancePlanType
        mammographyCertificationNumber
        npi
        serviceCode
        createdAt
        updatedAt
      }
      user {
        id
        email
        token
        status
        userId
        userType
        inviteSentAt
        emailVerified
        inviteAcceptedAt
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
    facility {
      id
      name
      practiceType
      code
      cliaIdNumber
      federalTaxId
      isPrivate
      revenueCode
      tamxonomyCode
      insurancePlanType
      mammographyCertificationNumber
      npi
      serviceCode
      createdAt
      updatedAt
      contacts {
        id
        email
        mobile
        phone
        pager
        fax
        address
        address2
        zipCode
        serviceCode
        city
        state
        serviceCode
        country
        userId
        createdAt
        updatedAt
      }
      staff {
        id
        firstName
        lastName
        email
        username
        dob
        phone
        mobile
        gender
        createdAt
        updatedAt
        user {
          id
          email
          token
          status
          userId
          userType
          inviteSentAt
          emailVerified
          inviteAcceptedAt
          createdAt
          updatedAt
        }
      }
    }
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
      code
      cliaIdNumber
      federalTaxId
      isPrivate
      revenueCode
      tamxonomyCode
      insurancePlanType
      mammographyCertificationNumber
      npi
      serviceCode
      createdAt
      updatedAt
      contacts {
        id
        email
        phone
        mobile
        fax
        address
        address2
        zipCode
        serviceCode
        city
        state
        serviceCode
        country
        userId
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
        userId
        createdAt
        updatedAt
      }
      staff {
        id
        firstName
        lastName
        email
        username
        dob
        phone
        mobile
        gender
        createdAt
        updatedAt
        user {
          id
          email
          token
          status
          userId
          userType
          inviteSentAt
          emailVerified
          inviteAcceptedAt
          createdAt
          updatedAt
        }
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
    facility {
      id
      name
      practiceType
      code
      cliaIdNumber
      federalTaxId
      isPrivate
      revenueCode
      tamxonomyCode
      insurancePlanType
      mammographyCertificationNumber
      npi
      serviceCode
      contacts {
        id
        email
        phone
        mobile
        pager
        fax
        address
        address2
        zipCode
        serviceCode
        city
        serviceCode
        state
        country
        userId
      }
      staff {
        id
        firstName
        lastName
        email
        username
        dob
        phone
        mobile
        gender
        user {
          id
          email
          token
          status
          userId
          userType
          inviteSentAt
          emailVerified
          inviteAcceptedAt
        }
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
    facility {
      id
      name
      practiceType
      code
      cliaIdNumber
      federalTaxId
      isPrivate
      revenueCode
      tamxonomyCode
      insurancePlanType
      mammographyCertificationNumber
      npi
      serviceCode
      createdAt
      updatedAt
      contacts {
        id
        email
        mobile
        phone
        pager
        fax
        address
        address2
        serviceCode
        zipCode
        serviceCode
        city
        state
        country
        userId
        createdAt
        updatedAt
      }
      staff {
        id
        firstName
        lastName
        email
        username
        dob
        phone
        mobile
        gender
        createdAt
        updatedAt
        user {
          id
          email
          token
          status
          userId
          userType
          inviteSentAt
          emailVerified
          inviteAcceptedAt
          createdAt
          updatedAt
        }
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
      name
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
    service {
      id
      name
      duration
      price
      isActive
      facilityId
      createdAt
      updatedAt
    }
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
    service {
      id
      name
      duration
      price
      isActive
      facilityId
      createdAt
      updatedAt
    }
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
export const CreateContactDocument = gql`
    mutation CreateContact($createContactInput: CreateContactInput!) {
  createContact(createContactInput: $createContactInput) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type CreateContactMutationFn = Apollo.MutationFunction<CreateContactMutation, CreateContactMutationVariables>;

/**
 * __useCreateContactMutation__
 *
 * To run a mutation, you first call `useCreateContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createContactMutation, { data, loading, error }] = useCreateContactMutation({
 *   variables: {
 *      createContactInput: // value for 'createContactInput'
 *   },
 * });
 */
export function useCreateContactMutation(baseOptions?: Apollo.MutationHookOptions<CreateContactMutation, CreateContactMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateContactMutation, CreateContactMutationVariables>(CreateContactDocument, options);
      }
export type CreateContactMutationHookResult = ReturnType<typeof useCreateContactMutation>;
export type CreateContactMutationResult = Apollo.MutationResult<CreateContactMutation>;
export type CreateContactMutationOptions = Apollo.BaseMutationOptions<CreateContactMutation, CreateContactMutationVariables>;
export const UpdateContactDocument = gql`
    mutation UpdateContact($updateContactInput: UpdateContactInput!) {
  updateContact(updateContactInput: $updateContactInput) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type UpdateContactMutationFn = Apollo.MutationFunction<UpdateContactMutation, UpdateContactMutationVariables>;

/**
 * __useUpdateContactMutation__
 *
 * To run a mutation, you first call `useUpdateContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateContactMutation, { data, loading, error }] = useUpdateContactMutation({
 *   variables: {
 *      updateContactInput: // value for 'updateContactInput'
 *   },
 * });
 */
export function useUpdateContactMutation(baseOptions?: Apollo.MutationHookOptions<UpdateContactMutation, UpdateContactMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateContactMutation, UpdateContactMutationVariables>(UpdateContactDocument, options);
      }
export type UpdateContactMutationHookResult = ReturnType<typeof useUpdateContactMutation>;
export type UpdateContactMutationResult = Apollo.MutationResult<UpdateContactMutation>;
export type UpdateContactMutationOptions = Apollo.BaseMutationOptions<UpdateContactMutation, UpdateContactMutationVariables>;
export const FindAllContactsDocument = gql`
    query FindAllContacts($contactInput: ContactInput!) {
  findAllContacts(contactInput: $contactInput) {
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
    contacts {
      id
      email
      name
      firstName
      lastName
      middleName
      suffix
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
      createdAt
      updatedAt
      facility {
        id
        name
        practiceType
        cliaIdNumber
        federalTaxId
        revenueCode
        tamxonomyCode
        insurancePlanType
        timeZone
        mammographyCertificationNumber
        npi
        serviceCode
        createdAt
        updatedAt
      }
    }
  }
}
    `;

/**
 * __useFindAllContactsQuery__
 *
 * To run a query within a React component, call `useFindAllContactsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllContactsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllContactsQuery({
 *   variables: {
 *      contactInput: // value for 'contactInput'
 *   },
 * });
 */
export function useFindAllContactsQuery(baseOptions: Apollo.QueryHookOptions<FindAllContactsQuery, FindAllContactsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllContactsQuery, FindAllContactsQueryVariables>(FindAllContactsDocument, options);
      }
export function useFindAllContactsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllContactsQuery, FindAllContactsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllContactsQuery, FindAllContactsQueryVariables>(FindAllContactsDocument, options);
        }
export type FindAllContactsQueryHookResult = ReturnType<typeof useFindAllContactsQuery>;
export type FindAllContactsLazyQueryHookResult = ReturnType<typeof useFindAllContactsLazyQuery>;
export type FindAllContactsQueryResult = Apollo.QueryResult<FindAllContactsQuery, FindAllContactsQueryVariables>;
export const RemoveContactDocument = gql`
    mutation RemoveContact($removeContact: RemoveContact!) {
  removeContact(removeContact: $removeContact) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type RemoveContactMutationFn = Apollo.MutationFunction<RemoveContactMutation, RemoveContactMutationVariables>;

/**
 * __useRemoveContactMutation__
 *
 * To run a mutation, you first call `useRemoveContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeContactMutation, { data, loading, error }] = useRemoveContactMutation({
 *   variables: {
 *      removeContact: // value for 'removeContact'
 *   },
 * });
 */
export function useRemoveContactMutation(baseOptions?: Apollo.MutationHookOptions<RemoveContactMutation, RemoveContactMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveContactMutation, RemoveContactMutationVariables>(RemoveContactDocument, options);
      }
export type RemoveContactMutationHookResult = ReturnType<typeof useRemoveContactMutation>;
export type RemoveContactMutationResult = Apollo.MutationResult<RemoveContactMutation>;
export type RemoveContactMutationOptions = Apollo.BaseMutationOptions<RemoveContactMutation, RemoveContactMutationVariables>;
export const FindContactDocument = gql`
    query FindContact($getContact: GetContact!) {
  getContact(getContact: $getContact) {
    response {
      error
      status
      message
    }
    contact {
      id
      email
      name
      fax
      address
      address2
      phone
      zipCode
      city
      state
      country
      facilityId
      primaryContact
      serviceCode
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
 * __useFindContactQuery__
 *
 * To run a query within a React component, call `useFindContactQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindContactQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindContactQuery({
 *   variables: {
 *      getContact: // value for 'getContact'
 *   },
 * });
 */
export function useFindContactQuery(baseOptions: Apollo.QueryHookOptions<FindContactQuery, FindContactQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindContactQuery, FindContactQueryVariables>(FindContactDocument, options);
      }
export function useFindContactLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindContactQuery, FindContactQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindContactQuery, FindContactQueryVariables>(FindContactDocument, options);
        }
export type FindContactQueryHookResult = ReturnType<typeof useFindContactQuery>;
export type FindContactLazyQueryHookResult = ReturnType<typeof useFindContactLazyQuery>;
export type FindContactQueryResult = Apollo.QueryResult<FindContactQuery, FindContactQueryVariables>;
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
      type
      typeId
      key
      url
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
      name
      status
      message
      error
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
export const UpdateAttachmentDataDocument = gql`
    mutation UpdateAttachmentData($updateAttachmentInput: UpdateAttachmentInput!) {
  updateAttachmentData(updateAttachmentInput: $updateAttachmentInput) {
    response {
      status
      name
      message
    }
    attachment {
      id
      type
      typeId
      key
      url
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
export const FindAllPatientDocument = gql`
    query FindAllPatient($patientInput: PatientInput!) {
  findAllPatient(patientInput: $patientInput) {
    pagination {
      page
      totalCount
      totalPages
    }
    response {
      error
      status
      message
    }
    patients {
      id
      firstName
      middleName
      email
      lastName
      firstNameUsed
      prefferedName
      previousFirstName
      previouslastName
      motherMaidenName
      ssn
      gender
      dob
      registrationDepartment
      primaryDepartment
      registrationDate
      deceasedDate
      privacyNotice
      releaseOfInfoBill
      callToConsent
      medicationHistoryAuthority
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
      attachments {
        id
        type
        typeId
        key
        url
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      contacts {
        id
        email
        phone
        mobile
        address
        address2
        city
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
        pager
        fax
        ssn
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
        practiceType
        code
        cliaIdNumber
        federalTaxId
        isPrivate
        revenueCode
        tamxonomyCode
        insurancePlanType
        mammographyCertificationNumber
        npi
        serviceCode
        createdAt
        updatedAt
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
      firstName
      middleName
      lastName
      suffix
      firstNameUsed
      prefferedName
      previousFirstName
      previouslastName
      motherMaidenName
      ssn
      gender
      dob
      registrationDepartment
      primaryDepartment
      registrationDate
      deceasedDate
      privacyNotice
      releaseOfInfoBill
      callToConsent
      medicationHistoryAuthority
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
      attachments {
        id
        type
        typeId
        key
        url
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      contacts {
        id
        email
        name
        suffix
        firstName
        middleName
        lastName
        phone
        serviceCode
        primaryContact
        mobile
        pager
        fax
        address
        address2
        zipCode
        city
        state
        country
        ssn
        employerName
        relationship
        contactType
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
        practiceType
        code
        cliaIdNumber
        federalTaxId
        isPrivate
        revenueCode
        tamxonomyCode
        insurancePlanType
        mammographyCertificationNumber
        npi
        serviceCode
        updatedAt
      }
      usualProvider {
        id
        firstName
        lastName
        createdAt
        updatedAt
        schedule {
          id
          startAt
          endAt
          recurringEndDate
          createdAt
          updatedAt
        }
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
export const FindAllStaffDocument = gql`
    query FindAllStaff($staffInput: StaffInput!) {
  findAllStaff(staffInput: $staffInput) {
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
    allstaff {
      id
      firstName
      lastName
      email
      username
      dob
      phone
      mobile
      gender
      createdAt
      updatedAt
      user {
        id
        email
        token
        status
        userId
        userType
        inviteSentAt
        emailVerified
        inviteAcceptedAt
        createdAt
        updatedAt
      }
      facility {
        id
        name
        practiceType
        code
        cliaIdNumber
        federalTaxId
        isPrivate
        revenueCode
        tamxonomyCode
        insurancePlanType
        mammographyCertificationNumber
        npi
        serviceCode
        createdAt
        updatedAt
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
        id
        email
        token
        status
        userId
        userType
        inviteSentAt
        emailVerified
        inviteAcceptedAt
        createdAt
        updatedAt
        roles {
          id
          role
        }
      }
      facility {
        id
        name
        practiceType
        code
        cliaIdNumber
        federalTaxId
        isPrivate
        revenueCode
        tamxonomyCode
        insurancePlanType
        mammographyCertificationNumber
        npi
        serviceCode
        createdAt
        updatedAt
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
      name
      error
      status
      message
    }
    staff {
      id
      firstName
      lastName
      email
      username
      dob
      phone
      mobile
      gender
      createdAt
      updatedAt
      user {
        id
        email
        token
        status
        userId
        userType
        inviteSentAt
        emailVerified
        inviteAcceptedAt
        createdAt
        updatedAt
        roles {
          id
          role
        }
      }
      facility {
        id
        name
        practiceType
        code
        cliaIdNumber
        federalTaxId
        isPrivate
        revenueCode
        tamxonomyCode
        insurancePlanType
        mammographyCertificationNumber
        npi
        serviceCode
        createdAt
        updatedAt
      }
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
      name
      error
      status
      message
    }
    staff {
      id
      firstName
      lastName
      email
      username
      dob
      phone
      mobile
      gender
      createdAt
      updatedAt
      user {
        id
        email
        token
        status
        userId
        userType
        inviteSentAt
        emailVerified
        inviteAcceptedAt
        createdAt
        updatedAt
      }
      facility {
        id
        name
        practiceType
        code
        cliaIdNumber
        federalTaxId
        isPrivate
        revenueCode
        tamxonomyCode
        insurancePlanType
        mammographyCertificationNumber
        npi
        serviceCode
        createdAt
        updatedAt
      }
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