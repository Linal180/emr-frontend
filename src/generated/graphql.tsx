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
};

export type AccessUserPayload = {
  __typename?: 'AccessUserPayload';
  access_token?: Maybe<Scalars['String']>;
  response?: Maybe<ResponsePayload>;
  roles?: Maybe<Array<Role>>;
};

export type AllStaffPayload = {
  __typename?: 'AllStaffPayload';
  allstaff?: Maybe<Array<Maybe<Staff>>>;
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
  faciltiy?: Maybe<Facility>;
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
  country?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  doctor?: Maybe<Doctor>;
  email?: Maybe<Scalars['String']>;
  faciltiy?: Maybe<Facility>;
  fax?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  mobile?: Maybe<Scalars['String']>;
  pager?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  userId?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
};

export type CreateBillingAddressInput = {
  address?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
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
  country?: Maybe<Scalars['String']>;
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

export type CreateFacilityInput = {
  createBillingAddressInput: CreateBillingAddressInput;
  createContactInput: CreateContactInput;
  createFacilityItemInput: CreateFacilityItemInput;
};

export type CreateFacilityItemInput = {
  cliaIdNumber?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
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
  /** Send Investor Type from the ENUM - Sign-up */
  roleType?: Maybe<UserRole>;
  username: Scalars['String'];
};

export type DisableStaff = {
  id: Scalars['String'];
};

export type Doctor = {
  __typename?: 'Doctor';
  anesthesiaLicense: Scalars['String'];
  billingAddress?: Maybe<Array<BillingAddress>>;
  billingFacility: Scalars['String'];
  blueShildNumber: Scalars['String'];
  campusGrpNumber: Scalars['String'];
  contacts?: Maybe<Array<Contact>>;
  createdAt: Scalars['String'];
  deaActiveDate: Scalars['String'];
  deaNumber: Scalars['String'];
  deaTermDate: Scalars['String'];
  degreeCredentials: Scalars['String'];
  dob: Scalars['String'];
  dpsCtpNumber: Scalars['String'];
  email: Scalars['String'];
  emcProviderId: Scalars['String'];
  facility?: Maybe<Facility>;
  firstName: Scalars['String'];
  id: Scalars['String'];
  languagesSpoken: Scalars['String'];
  lastName: Scalars['String'];
  licenseActiveDate: Scalars['String'];
  licenseTermDate: Scalars['String'];
  meammographyCertNumber: Scalars['String'];
  medicaidGrpNumber: Scalars['String'];
  medicareGrpNumber: Scalars['String'];
  middleName: Scalars['String'];
  npi: Scalars['String'];
  prefix: Scalars['String'];
  prescriptiveAuthNumber: Scalars['String'];
  providerIntials: Scalars['String'];
  speciality: Speciality;
  specialityLicense: Scalars['String'];
  ssn: Scalars['String'];
  ssnType: SsnType;
  stateLicense: Scalars['String'];
  suffix: Scalars['String'];
  taxId: Scalars['String'];
  taxIdStuff: Scalars['String'];
  taxonomyCode: Scalars['String'];
  updatedAt: Scalars['String'];
  upin: Scalars['String'];
  user?: Maybe<User>;
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
  contacts?: Maybe<Array<Contact>>;
  createdAt: Scalars['String'];
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
  staff?: Maybe<Array<Staff>>;
  tamxonomyCode?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
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

/** The user gender assigned */
export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER'
}

export type GetFacility = {
  id: Scalars['String'];
};

export type GetStaff = {
  id: Scalars['String'];
};

export type GetUser = {
  id: Scalars['String'];
};

export type LoginUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  activateUser: UserPayload;
  createFacility: FacilityPayload;
  createStaff: StaffPayload;
  deactivateUser: UserPayload;
  disableStaff: StaffPayload;
  forgotPassword: ForgotPasswordPayload;
  login: AccessUserPayload;
  registerUser: UserPayload;
  removeFacility: FacilityPayload;
  removeStaff: StaffPayload;
  removeUser: UserPayload;
  resendVerificationEmail: UserPayload;
  resetPassword: UserPayload;
  updateFacility: FacilityPayload;
  updatePassword: UserPayload;
  updateRole: UserPayload;
  updateStaff: StaffPayload;
  updateUser: UserPayload;
  verifyEmail: UserPayload;
};


export type MutationActivateUserArgs = {
  user: UserIdInput;
};


export type MutationCreateFacilityArgs = {
  createFacilityInput: CreateFacilityInput;
};


export type MutationCreateStaffArgs = {
  createStaffInput: CreateStaffInput;
};


export type MutationDeactivateUserArgs = {
  user: UserIdInput;
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


export type MutationRemoveFacilityArgs = {
  removeFacility: RemoveFacility;
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


export type MutationUpdateFacilityArgs = {
  updateFacilityInput: UpdateFacilityInput;
};


export type MutationUpdatePasswordArgs = {
  updatePasswordInput: UpdatePasswordInput;
};


export type MutationUpdateRoleArgs = {
  user: UpdateRoleInput;
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

/** The facility practice type assigned type */
export enum PracticeType {
  Clinic = 'CLINIC',
  Hospital = 'HOSPITAL',
  Lab = 'LAB'
}

export type Query = {
  __typename?: 'Query';
  fetchAllRoles: RolesPayload;
  fetchAllUsers: UsersPayload;
  fetchUser: UserPayload;
  findAllFacility: FacilitiesPayload;
  findAllStaff: AllStaffPayload;
  getFacility: FacilityPayload;
  getStaff: StaffPayload;
  getUser: UserPayload;
  me: UserPayload;
  searchUser: UsersPayload;
};


export type QueryFetchAllUsersArgs = {
  userInput: UsersInput;
};


export type QueryFindAllFacilityArgs = {
  facilityInput: FacilityInput;
};


export type QueryFindAllStaffArgs = {
  staffInput: StaffInput;
};


export type QueryGetFacilityArgs = {
  getFacility: GetFacility;
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

export type RegisterUserInput = {
  adminId: Scalars['String'];
  email: Scalars['String'];
  facilityId: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  phone: Scalars['String'];
  /** Send Investor Type from the ENUM - Sign-up */
  roleType?: Maybe<UserRole>;
  zipCode: Scalars['String'];
};

export type RemoveFacility = {
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
  firstName: Scalars['String'];
  gender: Gender;
  id: Scalars['String'];
  lastName: Scalars['String'];
  mobile?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
  username: Scalars['String'];
};

export type StaffInput = {
  paginationOptions: PaginationInput;
};

export type StaffPayload = {
  __typename?: 'StaffPayload';
  response?: Maybe<ResponsePayload>;
  staff?: Maybe<Staff>;
};

export type UpdateBillingAddressInput = {
  address?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
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
  country?: Maybe<Scalars['String']>;
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

export type UpdateFacilityInput = {
  updateBillingAddressInput: UpdateBillingAddressInput;
  updateContactInput: UpdateContactInput;
  updateFacilityItemInput: UpdateFacilityItemInput;
};

export type UpdateFacilityItemInput = {
  cliaIdNumber?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
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
};

export type UpdatePasswordInput = {
  id: Scalars['String'];
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};

export type UpdateRoleInput = {
  id: Scalars['String'];
  roles: Array<UserRole>;
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


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AccessUserPayload', access_token?: Maybe<string>, response?: Maybe<{ __typename?: 'ResponsePayload', message?: Maybe<string>, status?: Maybe<number> }>, roles?: Maybe<Array<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string }>> } };

export type GetLoggedInUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLoggedInUserQuery = { __typename?: 'Query', me: { __typename?: 'UserPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string> }>, user?: Maybe<{ __typename?: 'User', id: string, email: string, token?: Maybe<string>, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string }>>>, facility?: Maybe<Array<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: Maybe<string>, cliaIdNumber?: Maybe<string>, federalTaxId?: Maybe<string>, isPrivate?: Maybe<boolean>, revenueCode?: Maybe<string>, tamxonomyCode?: Maybe<string>, insurancePlanType?: Maybe<string>, mammographyCertificationNumber?: Maybe<string>, npi?: Maybe<string>, serviceCode: ServiceCode, createdAt: string, updatedAt: string, contacts?: Maybe<Array<{ __typename?: 'Contact', id: string, email?: Maybe<string>, mobile?: Maybe<string>, pager?: Maybe<string>, fax?: Maybe<string>, address?: Maybe<string>, address2?: Maybe<string>, zipCode?: Maybe<string>, city?: Maybe<string>, state?: Maybe<string>, country?: Maybe<string>, userId?: Maybe<string>, createdAt: string, updatedAt: string }>>, staff?: Maybe<Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: Maybe<string>, mobile?: Maybe<string>, gender: Gender, createdAt: string, updatedAt: string }>> }>> }> } };

export type ForgetPasswordMutationVariables = Exact<{
  forgotPasswordInput: ForgotPasswordInput;
}>;


export type ForgetPasswordMutation = { __typename?: 'Mutation', forgotPassword: { __typename?: 'ForgotPasswordPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, message?: Maybe<string>, status?: Maybe<number> }> } };

export type ResetPasswordMutationVariables = Exact<{
  resetPassword: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'UserPayload', user?: Maybe<{ __typename?: 'User', id: string, email: string, token?: Maybe<string>, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string }>>>, facility?: Maybe<Array<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: Maybe<string>, cliaIdNumber?: Maybe<string>, federalTaxId?: Maybe<string>, isPrivate?: Maybe<boolean>, revenueCode?: Maybe<string>, tamxonomyCode?: Maybe<string>, insurancePlanType?: Maybe<string>, mammographyCertificationNumber?: Maybe<string>, npi?: Maybe<string>, serviceCode: ServiceCode, createdAt: string, updatedAt: string, contacts?: Maybe<Array<{ __typename?: 'Contact', id: string, email?: Maybe<string>, mobile?: Maybe<string>, pager?: Maybe<string>, fax?: Maybe<string>, address?: Maybe<string>, address2?: Maybe<string>, zipCode?: Maybe<string>, city?: Maybe<string>, state?: Maybe<string>, country?: Maybe<string>, userId?: Maybe<string>, createdAt: string, updatedAt: string }>>, staff?: Maybe<Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: Maybe<string>, mobile?: Maybe<string>, gender: Gender, createdAt: string, updatedAt: string }>> }>> }>, response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }> } };

export type RegisterUserMutationVariables = Exact<{
  user: RegisterUserInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'UserPayload', user?: Maybe<{ __typename?: 'User', id: string, email: string, token?: Maybe<string>, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string }>>>, facility?: Maybe<Array<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: Maybe<string>, cliaIdNumber?: Maybe<string>, federalTaxId?: Maybe<string>, isPrivate?: Maybe<boolean>, revenueCode?: Maybe<string>, tamxonomyCode?: Maybe<string>, insurancePlanType?: Maybe<string>, mammographyCertificationNumber?: Maybe<string>, npi?: Maybe<string>, serviceCode: ServiceCode, createdAt: string, updatedAt: string, contacts?: Maybe<Array<{ __typename?: 'Contact', id: string, email?: Maybe<string>, mobile?: Maybe<string>, pager?: Maybe<string>, fax?: Maybe<string>, address?: Maybe<string>, address2?: Maybe<string>, zipCode?: Maybe<string>, city?: Maybe<string>, state?: Maybe<string>, country?: Maybe<string>, userId?: Maybe<string>, createdAt: string, updatedAt: string }>>, staff?: Maybe<Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: Maybe<string>, mobile?: Maybe<string>, gender: Gender, createdAt: string, updatedAt: string }>> }>> }>, response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }> } };

export type EmailVerificationMutationVariables = Exact<{
  verifyEmail: VerifyEmailInput;
}>;


export type EmailVerificationMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'UserPayload', user?: Maybe<{ __typename?: 'User', id: string, email: string, token?: Maybe<string>, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string }>>>, facility?: Maybe<Array<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: Maybe<string>, cliaIdNumber?: Maybe<string>, federalTaxId?: Maybe<string>, isPrivate?: Maybe<boolean>, revenueCode?: Maybe<string>, tamxonomyCode?: Maybe<string>, insurancePlanType?: Maybe<string>, mammographyCertificationNumber?: Maybe<string>, npi?: Maybe<string>, serviceCode: ServiceCode, createdAt: string, updatedAt: string, contacts?: Maybe<Array<{ __typename?: 'Contact', id: string, email?: Maybe<string>, mobile?: Maybe<string>, pager?: Maybe<string>, fax?: Maybe<string>, address?: Maybe<string>, address2?: Maybe<string>, zipCode?: Maybe<string>, city?: Maybe<string>, state?: Maybe<string>, country?: Maybe<string>, userId?: Maybe<string>, createdAt: string, updatedAt: string }>>, staff?: Maybe<Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: Maybe<string>, mobile?: Maybe<string>, gender: Gender, createdAt: string, updatedAt: string }>> }>> }>, response?: Maybe<{ __typename?: 'ResponsePayload', error?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string> }> } };

export type ResendVerificationEmailMutationVariables = Exact<{
  resendVerificationEmail: ResendVerificationEmail;
}>;


export type ResendVerificationEmailMutation = { __typename?: 'Mutation', resendVerificationEmail: { __typename?: 'UserPayload', user?: Maybe<{ __typename?: 'User', id: string, email: string, token?: Maybe<string>, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string }>>>, facility?: Maybe<Array<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: Maybe<string>, cliaIdNumber?: Maybe<string>, federalTaxId?: Maybe<string>, isPrivate?: Maybe<boolean>, revenueCode?: Maybe<string>, tamxonomyCode?: Maybe<string>, insurancePlanType?: Maybe<string>, mammographyCertificationNumber?: Maybe<string>, npi?: Maybe<string>, serviceCode: ServiceCode, createdAt: string, updatedAt: string, contacts?: Maybe<Array<{ __typename?: 'Contact', id: string, email?: Maybe<string>, mobile?: Maybe<string>, pager?: Maybe<string>, fax?: Maybe<string>, address?: Maybe<string>, address2?: Maybe<string>, zipCode?: Maybe<string>, city?: Maybe<string>, state?: Maybe<string>, country?: Maybe<string>, userId?: Maybe<string>, createdAt: string, updatedAt: string }>>, staff?: Maybe<Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: Maybe<string>, mobile?: Maybe<string>, gender: Gender, createdAt: string, updatedAt: string }>> }>> }>, response?: Maybe<{ __typename?: 'ResponsePayload', error?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string> }> } };

export type FindAllFacilitiesQueryVariables = Exact<{
  facilityInput: FacilityInput;
}>;


export type FindAllFacilitiesQuery = { __typename?: 'Query', findAllFacility: { __typename?: 'FacilitiesPayload', facility?: Maybe<Array<Maybe<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: Maybe<string>, cliaIdNumber?: Maybe<string>, federalTaxId?: Maybe<string>, isPrivate?: Maybe<boolean>, revenueCode?: Maybe<string>, tamxonomyCode?: Maybe<string>, insurancePlanType?: Maybe<string>, mammographyCertificationNumber?: Maybe<string>, npi?: Maybe<string>, serviceCode: ServiceCode, createdAt: string, updatedAt: string, contacts?: Maybe<Array<{ __typename?: 'Contact', id: string, email?: Maybe<string>, mobile?: Maybe<string>, phone?: Maybe<string>, pager?: Maybe<string>, fax?: Maybe<string>, address?: Maybe<string>, address2?: Maybe<string>, zipCode?: Maybe<string>, city?: Maybe<string>, state?: Maybe<string>, country?: Maybe<string>, userId?: Maybe<string>, createdAt: string, updatedAt: string }>>, staff?: Maybe<Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: Maybe<string>, mobile?: Maybe<string>, gender: Gender, createdAt: string, updatedAt: string, user?: Maybe<{ __typename?: 'User', id: string, email: string, token?: Maybe<string>, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string }> }>> }>>>, pagination?: Maybe<{ __typename?: 'PaginationPayload', page?: Maybe<number>, totalCount?: Maybe<number>, totalPages?: Maybe<number> }>, response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, error?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string> }> } };

export type GetFacilityQueryVariables = Exact<{
  getFacility: GetFacility;
}>;


export type GetFacilityQuery = { __typename?: 'Query', getFacility: { __typename?: 'FacilityPayload', facility?: Maybe<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: Maybe<string>, cliaIdNumber?: Maybe<string>, federalTaxId?: Maybe<string>, isPrivate?: Maybe<boolean>, revenueCode?: Maybe<string>, tamxonomyCode?: Maybe<string>, insurancePlanType?: Maybe<string>, mammographyCertificationNumber?: Maybe<string>, npi?: Maybe<string>, serviceCode: ServiceCode, createdAt: string, updatedAt: string, contacts?: Maybe<Array<{ __typename?: 'Contact', id: string, email?: Maybe<string>, phone?: Maybe<string>, mobile?: Maybe<string>, fax?: Maybe<string>, address?: Maybe<string>, address2?: Maybe<string>, zipCode?: Maybe<string>, city?: Maybe<string>, state?: Maybe<string>, country?: Maybe<string>, userId?: Maybe<string>, createdAt: string, updatedAt: string }>>, billingAddress?: Maybe<Array<{ __typename?: 'BillingAddress', id: string, email?: Maybe<string>, mobile?: Maybe<string>, fax?: Maybe<string>, address?: Maybe<string>, address2?: Maybe<string>, zipCode?: Maybe<string>, city?: Maybe<string>, state?: Maybe<string>, country?: Maybe<string>, userId?: Maybe<string>, createdAt: string, updatedAt: string }>>, staff?: Maybe<Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: Maybe<string>, mobile?: Maybe<string>, gender: Gender, createdAt: string, updatedAt: string, user?: Maybe<{ __typename?: 'User', id: string, email: string, token?: Maybe<string>, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string }> }>> }>, response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string> }> } };

export type RemoveFacilityMutationVariables = Exact<{
  removeFacility: RemoveFacility;
}>;


export type RemoveFacilityMutation = { __typename?: 'Mutation', removeFacility: { __typename?: 'FacilityPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string> }> } };

export type UpdateFacilityMutationVariables = Exact<{
  updateFacilityInput: UpdateFacilityInput;
}>;


export type UpdateFacilityMutation = { __typename?: 'Mutation', updateFacility: { __typename?: 'FacilityPayload', facility?: Maybe<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: Maybe<string>, cliaIdNumber?: Maybe<string>, federalTaxId?: Maybe<string>, isPrivate?: Maybe<boolean>, revenueCode?: Maybe<string>, tamxonomyCode?: Maybe<string>, insurancePlanType?: Maybe<string>, mammographyCertificationNumber?: Maybe<string>, npi?: Maybe<string>, serviceCode: ServiceCode, createdAt: string, updatedAt: string, contacts?: Maybe<Array<{ __typename?: 'Contact', id: string, email?: Maybe<string>, phone?: Maybe<string>, mobile?: Maybe<string>, pager?: Maybe<string>, fax?: Maybe<string>, address?: Maybe<string>, address2?: Maybe<string>, zipCode?: Maybe<string>, city?: Maybe<string>, state?: Maybe<string>, country?: Maybe<string>, userId?: Maybe<string>, createdAt: string, updatedAt: string }>>, staff?: Maybe<Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: Maybe<string>, mobile?: Maybe<string>, gender: Gender, createdAt: string, updatedAt: string, user?: Maybe<{ __typename?: 'User', id: string, email: string, token?: Maybe<string>, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string }> }>> }>, response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string> }> } };

export type CreateFacilityMutationVariables = Exact<{
  createFacilityInput: CreateFacilityInput;
}>;


export type CreateFacilityMutation = { __typename?: 'Mutation', createFacility: { __typename?: 'FacilityPayload', facility?: Maybe<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: Maybe<string>, cliaIdNumber?: Maybe<string>, federalTaxId?: Maybe<string>, isPrivate?: Maybe<boolean>, revenueCode?: Maybe<string>, tamxonomyCode?: Maybe<string>, insurancePlanType?: Maybe<string>, mammographyCertificationNumber?: Maybe<string>, npi?: Maybe<string>, serviceCode: ServiceCode, createdAt: string, updatedAt: string, contacts?: Maybe<Array<{ __typename?: 'Contact', id: string, email?: Maybe<string>, mobile?: Maybe<string>, phone?: Maybe<string>, pager?: Maybe<string>, fax?: Maybe<string>, address?: Maybe<string>, address2?: Maybe<string>, zipCode?: Maybe<string>, city?: Maybe<string>, state?: Maybe<string>, country?: Maybe<string>, userId?: Maybe<string>, createdAt: string, updatedAt: string }>>, staff?: Maybe<Array<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: Maybe<string>, mobile?: Maybe<string>, gender: Gender, createdAt: string, updatedAt: string, user?: Maybe<{ __typename?: 'User', id: string, email: string, token?: Maybe<string>, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string }> }>> }>, response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string> }> } };

export type FindAllStaffQueryVariables = Exact<{
  staffInput: StaffInput;
}>;


export type FindAllStaffQuery = { __typename?: 'Query', findAllStaff: { __typename?: 'AllStaffPayload', pagination?: Maybe<{ __typename?: 'PaginationPayload', page?: Maybe<number>, totalCount?: Maybe<number>, totalPages?: Maybe<number> }>, response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, error?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string> }>, allstaff?: Maybe<Array<Maybe<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: Maybe<string>, mobile?: Maybe<string>, gender: Gender, createdAt: string, updatedAt: string, user?: Maybe<{ __typename?: 'User', id: string, email: string, token?: Maybe<string>, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string }>, facility?: Maybe<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: Maybe<string>, cliaIdNumber?: Maybe<string>, federalTaxId?: Maybe<string>, isPrivate?: Maybe<boolean>, revenueCode?: Maybe<string>, tamxonomyCode?: Maybe<string>, insurancePlanType?: Maybe<string>, mammographyCertificationNumber?: Maybe<string>, npi?: Maybe<string>, serviceCode: ServiceCode, createdAt: string, updatedAt: string }> }>>> } };

export type GetStaffQueryVariables = Exact<{
  getStaff: GetStaff;
}>;


export type GetStaffQuery = { __typename?: 'Query', getStaff: { __typename?: 'StaffPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, error?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string> }>, staff?: Maybe<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: Maybe<string>, mobile?: Maybe<string>, gender: Gender, createdAt: string, updatedAt: string, user?: Maybe<{ __typename?: 'User', id: string, email: string, token?: Maybe<string>, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string }>, facility?: Maybe<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: Maybe<string>, cliaIdNumber?: Maybe<string>, federalTaxId?: Maybe<string>, isPrivate?: Maybe<boolean>, revenueCode?: Maybe<string>, tamxonomyCode?: Maybe<string>, insurancePlanType?: Maybe<string>, mammographyCertificationNumber?: Maybe<string>, npi?: Maybe<string>, serviceCode: ServiceCode, createdAt: string, updatedAt: string }> }> } };

export type RemoveStaffMutationVariables = Exact<{
  removeStaff: RemoveStaff;
}>;


export type RemoveStaffMutation = { __typename?: 'Mutation', removeStaff: { __typename?: 'StaffPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string> }> } };

export type UpdateStaffMutationVariables = Exact<{
  updateStaffInput: UpdateStaffInput;
}>;


export type UpdateStaffMutation = { __typename?: 'Mutation', updateStaff: { __typename?: 'StaffPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, error?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string> }>, staff?: Maybe<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: Maybe<string>, mobile?: Maybe<string>, gender: Gender, createdAt: string, updatedAt: string, user?: Maybe<{ __typename?: 'User', id: string, email: string, token?: Maybe<string>, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string }>, facility?: Maybe<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: Maybe<string>, cliaIdNumber?: Maybe<string>, federalTaxId?: Maybe<string>, isPrivate?: Maybe<boolean>, revenueCode?: Maybe<string>, tamxonomyCode?: Maybe<string>, insurancePlanType?: Maybe<string>, mammographyCertificationNumber?: Maybe<string>, npi?: Maybe<string>, serviceCode: ServiceCode, createdAt: string, updatedAt: string }> }> } };

export type CreateStaffMutationVariables = Exact<{
  createStaffInput: CreateStaffInput;
}>;


export type CreateStaffMutation = { __typename?: 'Mutation', createStaff: { __typename?: 'StaffPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, error?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string> }>, staff?: Maybe<{ __typename?: 'Staff', id: string, firstName: string, lastName: string, email: string, username: string, dob: string, phone?: Maybe<string>, mobile?: Maybe<string>, gender: Gender, createdAt: string, updatedAt: string, user?: Maybe<{ __typename?: 'User', id: string, email: string, token?: Maybe<string>, status: UserStatus, userId: string, userType: string, inviteSentAt: string, emailVerified: boolean, inviteAcceptedAt: string, createdAt: string, updatedAt: string }>, facility?: Maybe<{ __typename?: 'Facility', id: string, name: string, practiceType: PracticeType, code?: Maybe<string>, cliaIdNumber?: Maybe<string>, federalTaxId?: Maybe<string>, isPrivate?: Maybe<boolean>, revenueCode?: Maybe<string>, tamxonomyCode?: Maybe<string>, insurancePlanType?: Maybe<string>, mammographyCertificationNumber?: Maybe<string>, npi?: Maybe<string>, serviceCode: ServiceCode, createdAt: string, updatedAt: string }> }> } };


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
        city
        state
        country
        userId
        createdAt
        updatedAt
      }
      billingAddress {
        id
        email
        mobile
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
      createdAt
      updatedAt
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