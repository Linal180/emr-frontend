// packages block
import { ComponentType, Dispatch, ReactNode, ElementType } from "react";
import { GridSize } from "@material-ui/core";
import { RouteProps } from "react-router-dom";
import { Control, ValidationRule } from "react-hook-form";
// graphql block
import {
  LoginUserInput, User, UpdateUserInput, CreateStaffInput, UpdateStaffInput, UpdateContactInput,
  UpdateFacilityItemInput, FacilitiesPayload, CreateContactInput, CreateDoctorItemInput, Gender, AllDoctorPayload,
  CreatePatientItemInput, Ethnicity, Genderidentity, Homebound, Maritialstatus, PrimaryDepartment, Pronouns, Race,
  RegDepartment, RegisterUserInput, RelationshipType, Sexualorientation
} from "../generated/graphql";

export interface PrivateRouteProps extends RouteProps {
  component: ComponentType<any>;
}

type Key = string | number | undefined;
export interface CloseSnackbarProps {
  id: Key;
}
export interface BackdropInputType {
  loading: boolean
}

export interface AuthContextProps {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export interface AppContextProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<React.SetStateAction<boolean>>;
}

export interface ListContextInterface {
  facilityList: FacilitiesPayload['facility'];
  setFacilityList: Function;
  fetchAllFacilityList: Function;
  doctorList: AllDoctorPayload['doctors'];
  setDoctorList: Function;
  fetchAllDoctorList: Function;
}

export interface Children {
  children: ReactNode;
}

type Path = { text: string; link: string }

export interface BreadcrumbProps {
  path: Path[]
}

export interface MainLayoutProps {
  children: ReactNode,
}

export interface TableLoaderType {
  numberOfRows: number;
  numberOfColumns: number;
}

export interface ActionLayoutType extends Children {
  hasBorder: boolean
}

export interface OpenElement {
  isOpen: boolean;
  setOpen: Function;
}

export interface DialogTypes {
  isEdit?: boolean;
  refetch?: Function;
  handleClose?: Function;
  isOpen: boolean;
  setOpen?: Function;
}

export interface ConfirmationTypes extends DialogTypes {
  isLoading?: boolean;
  title?: string;
  success?: boolean;
  actionText?: string;
  description?: string;
  handleDelete: () => void;
}

interface ControlLabel {
  controllerLabel: string | JSX.Element;
}

type LoginControlTypes = "email" | "password";

type UserControlTypes = "email" | "firstName" | "lastName" | "phone" | "zipCode";

export type MediaControlTypes = "title" | "subTitle" | "description";

export interface LoginInputControlProps extends ControlLabel {
  control: Control<LoginUserInput, object>;
  controllerName: LoginControlTypes;
  fieldType: string;
  pattern?: ValidationRule<RegExp> | undefined;
  error?: string;
  isPassword?: boolean;
}

export interface UserUpdateInputControlProps extends ControlLabel {
  control: Control<UpdateUserInput, object>;
  controllerName: UserControlTypes;
  fieldType: string;
  pattern?: ValidationRule<RegExp> | undefined;
  error?: string;
  disable?: boolean
}

export interface CardComponentType extends Children {
  cardTitle: string;
  isEdit?: boolean;
  hideSaveIcon?: boolean;
  disableSaveIcon?: boolean;
  disableEditIcon?: boolean;
  hasEdit?: boolean;
  link?: string;
  onEditClick?: () => void;
  requestLink?: string
}

export interface IPageHeader {
  isOpen?: boolean;
  setOpen?: Function;
  hasComponent?: boolean;
  linkToPage?: string;
  title: string;
  buttonText?: string;
  noAdd?: boolean;
  path?: Path[];
  openModal?: () => void
}

export interface IStepperButtons {
  customActiveStep: number;
  handleNext?: () => void;
  handleBack?: () => void;
  setActiveStep: Function;
  hasBackButton?: boolean;
  isSubmitting?: boolean;
  totalSteps: number;
  module?: string;
}

export type multiOptionType = {
  value: string,
  label: string
}

export interface MultiSelectInterface {
  Options: multiOptionType[];
  label: string;
  name: string;
  placeHolder: string;
  selectedOptions?: string[];
  errors?: string;
}

export interface IDropzoneImage {
  isDisabled?: boolean;
  optionId: string;
  imageModuleType: string;
  image?: { url?: string; id?: string };
  imageLoading: (loader: boolean) => void;
  error?: string
  updateImageData?: string,
  imageForView?: string,
}

export interface IFieldTypes {
  label: string | JSX.Element
  isMultiline?: boolean;
  isRequired?: boolean;
  fieldType?: string;
}

export type RecordType = {
  id: string;
  name: string;
}

export type OptionType = {
  value: string;
  label: string;
}

export interface DataLoaderInterface {
  rows: number,
  hasMedia: boolean;
  columns: GridSize
}

export type TableAlignType = "left" | "center" | "right" | "justify" | "inherit" | undefined;

export interface IDetailCellProps {
  description: string
}

export interface SelectorOption {
  id: string
  name: string
}

export interface SelectorProps {
  name: string
  label: string
  error?: string
  value?: SelectorOption
  options: SelectorOption[]
}

export type notificationType = { url: string, type: string, message: string, channelName: string }
type ResetPasswordControlTypes = "password" | "repeatPassword";

export type ForgetPasswordInputs = {
  email: string
}

export type ResetPasswordInputs = {
  password: string;
  repeatPassword: string;
};

interface IControlLabel {
  controllerLabel: string | JSX.Element;
  fieldType?: string;
  pattern?: ValidationRule<RegExp> | undefined;
  error?: string;
  disabled?: boolean;
  isPassword?: boolean;
}

export interface ResetPasswordInputControlProps extends IControlLabel {
  control: Control<ResetPasswordInputs, object>;
  controllerName: ResetPasswordControlTypes;
}

export type PasswordType = "password" | "text";

export interface IShowPasswordProps {
  passwordType: string;
  isPassword: boolean | undefined;
  handleShowPassword: () => void;
}

export type SubMenuTypes = {
  name: string;
  link: string | null;
};

export interface AppMenuItemTypes {
  name: string;
  link?: string;
  Icon?: ElementType;
  items?: SubMenuTypes[];
  index?: number;
  activeCollapse?: number;
  setActiveCollapse?: (item: number) => void;
  sectionName?: boolean
}

export type AppMenuItemPropsWithoutItems = Omit<AppMenuItemTypes, "items">;

export type AppMenuItemProps = AppMenuItemPropsWithoutItems & {
  items?: AppMenuItemProps[];
};

export interface MappedGenderInterface {
  value: Gender;
  label: string;
}

export interface DatePickerProps {
  name: string;
  label: string;
  error: string;
}

type StaffControlTypes = "firstName" | "lastName" | "email" | "username" | "password"
  | "phone" | "mobile" | "dob" | "gender" | "roleType" | "adminId" | "facilityId";

export interface MappedGenderidentityInterface {
  value: Genderidentity;
  label: string;
}
export interface MappedRaceInterface {
  value: Race;
  label: string;
}

export interface MappedEthnicityInterface {
  value: Ethnicity;
  label: string;
}

export interface MappedSexualorientationInterface {
  value: Sexualorientation;
  label: string;
}

export interface MappedPronounsInterface {
  value: Pronouns;
  label: string;
}

export interface MappedHomeboundInterface {
  value: Homebound;
  label: string;
}

export interface MappedRelationshipTypeInterface {
  value: RelationshipType;
  label: string;
}

export interface MappedRegDepartmentInterface {
  value: RegDepartment;
  label: string;
}

export interface MappedPrimaryDepartmentInterface {
  value: PrimaryDepartment;
  label: string;
}

export interface MappedMaritialstatusInterface {
  value: Maritialstatus;
  label: string;
}

export type ParamsType = {
  id: string
}

export type ExtendedStaffInputProps = Omit<CreateStaffInput, "facilityId" | "roleType" | "gender"> & { facilityId: SelectorOption } & { roleType: SelectorOption } & { gender: SelectorOption };
export type ExtendedUpdateStaffInputProps = Omit<UpdateStaffInput, "facilityId" | "roleType" | "gender"> & { facilityId: SelectorOption } & { roleType: SelectorOption } & { gender: SelectorOption };

export interface AddStaffInputControlProps extends IControlLabel {
  control: Control<ExtendedStaffInputProps, object>;
  controllerName: StaffControlTypes;
}

export interface UpdateStaffInputControlProps extends IControlLabel {
  control: Control<ExtendedUpdateStaffInputProps, object>;
  controllerName: StaffControlTypes;
}

interface CustomBillingAddressInputs {
  billingEmail: string;
  billingPhone: string;
  billingMobile: string;
  billingFax: string;
  billingZipCode: string;
  billingAddress: string;
  billingAddress2: string;
  billingCity: string;
  billingState: string;
  billingCountry: string;
  billingPager: string;
  billingUserId: string;
  billingFacility: string;
}

type FacilityControlTypes = | "name" | "practiceType" | "code" | "email" | "phone" | "fax" | "zipCode" | "address"
  | "address2" | "city" | "state" | "country" | "billingEmail" | "billingPhone" | "billingFax" | "billingZipCode"
  | "billingAddress" | "billingAddress2" | "billingCity" | "billingState" | "billingCountry" | "billingBankAccount"
  | "cliaIdNumber" | "federalTaxId" | "revenueCode" | "tamxonomyCode" | "insurancePlanType"
  | "mammographyCertificationNumber" | "npi" | "merchantId" | "billingType" | "stateImmunizationId" | "locationId"
  | "serviceCode" | "mobile" | "pager";

export interface CreateFacilityInputControlProps extends IControlLabel {
  controllerName: FacilityControlTypes;
}

export interface UpdateFacilityInputControlProps extends IControlLabel {
  controllerName: FacilityControlTypes;
}

export type CustomFacilityInputProps = Omit<UpdateContactInput, "serviceCode"> & Omit<UpdateFacilityItemInput, "practiceType" | "serviceCode"> & CustomBillingAddressInputs & { serviceCode: SelectorOption } & { practiceType: SelectorOption };

type ContactInputTypes =
  | "name"
  | "fax"
  | "city"
  | "state"
  | "email"
  | "pager"
  | "phone"
  | "mobile"
  | "userId"
  | "address"
  | "zipCode"
  | "country"
  | "address2"
  | "facilityId"

type BillingInputTypes =
  | "billingFax"
  | "billingCity"
  | "billingState"
  | "billingEmail"
  | "billingPager"
  | "billingPhone"
  | "billingUserId"
  | "billingMobile"
  | "billingAddress"
  | "billingZipCode"
  | "billingCountry"
  | "billingAddress2"
  | "billingFacilityId"

type DoctorControlTypes =
  | "dob"
  | "ssn"
  | "email"
  | "prefix"
  | "suffix"
  | "adminId"
  | "ssnType"
  | "lastName"
  | "password"
  | "roleType"
  | "firstName"
  | "speciality"
  | "facilityId"
  | "middleName"
  | "providerIntials"
  | "degreeCredentials"
  | "languagesSpoken"
  | "deaNumber"
  | "deaActiveDate"
  | "deaTermDate"
  | "taxId"
  | "upin"
  | "npi"
  | "taxonomyCode"
  | "emcProviderId"
  | "medicareGrpNumber"
  | "medicaidGrpNumber"
  | "meammographyCertNumber"
  | "campusGrpNumber"
  | "blueShildNumber"
  | "taxIdStuff"
  | "specialityLicense"
  | "anesthesiaLicense"
  | "dpsCtpNumber"
  | "stateLicense"
  | "licenseActiveDate"
  | "licenseTermDate"
  | "prescriptiveAuthNumber"

export interface DoctorInputControlProps extends IControlLabel {
  controllerName: DoctorControlTypes | BillingInputTypes | ContactInputTypes
}

export type DoctorInputProps = Omit<CreateDoctorItemInput, "facilityId" | "speciality" | "ssnType"> & Omit<CreateContactInput, "facilityId"> & CustomBillingAddressInputs & { facilityId: SelectorOption } & { ssnType: SelectorOption } & { speciality: SelectorOption };

type PatientControlTypes =
  | "suffix"
  | "firstName"
  | "middleName"
  | "lastName"
  | "firstNameUsed"
  | "prefferedName"
  | "previousFirstName"
  | "previouslastName"
  | "motherMaidenName"
  | "ssn"
  | "dob"
  | "issueDate"
  | "expirationDate"
  | "registrationDepartment"
  | "primaryDepartment"
  | "registrationDate"
  | "deceasedDate"
  | "privacyNotice"
  | "releaseOfInfoBill"
  | "callToConsent"
  | "medicationHistoryAuthority"
  | "note"
  | "language"
  | "ethnicity"
  | "sexualOrientation"
  | "sexAtBirth"
  | "pronouns"
  | "homeBound"
  | "holdStatement"
  | "statementDelivereOnline"
  | "statementNote"
  | "statementNoteDateFrom"
  | "statementNoteDateTo"
  | "adminId"

  | "gender"
  | "race"
  | "genderIdentity"
  | "maritialStatus"
  | "facilityId"
  | "usualProviderId"

type RegisterUserControlTypes =
  | "userFirstName"
  | "userLastName"
  | "userPassword"
  | "userEmail"
  | "adminId"
  | "userPhone"
  | "userZipCode"

type BasicContactControlTypes =
  | "basicName"
  | "basicFirstName"
  | "basicMiddleName"
  | "basicLastName"
  | "basicEmail"
  | "basicContactType"
  | "basicRelationship"
  | "basicPager"
  | "basicPhone"
  | "basicSuffix"
  | "basicMobile"
  | "basicFax"
  | "basicSsn"
  | "basicAddress"
  | "basicAddress2"
  | "basicZipCode"
  | "basicCity"
  | "basicState"
  | "basicCountry"
  | "basicUserId"
  | "basicDoctorId"
  | "basicFacilityId"
  | "basicPatientId"
  | "basicEmployerName"

type EmergencyContactControlTypes =
  | "emergencyName"
  | "emergencyFirstName"
  | "emergencyMiddleName"
  | "emergencyLastName"
  | "emergencyEmail"
  | "emergencyContactType"
  | "emergencyRelationship"
  | "emergencyPager"
  | "emergencyPhone"
  | "emergencySuffix"
  | "emergencyMobile"
  | "emergencyFax"
  | "emergencySsn"
  | "emergencyAddress"
  | "emergencyAddress2"
  | "emergencyZipCode"
  | "emergencyCity"
  | "emergencyState"
  | "emergencyCountry"
  | "emergencyUserId"
  | "emergencyDoctorId"
  | "emergencyFacilityId"
  | "emergencyPatientId"
  | "emergencyEmployerName"

type KinContactControlTypes =
  | "kinName"
  | "kinFirstName"
  | "kinMiddleName"
  | "kinLastName"
  | "kinEmail"
  | "kinContactType"
  | "kinRelationship"
  | "kinPager"
  | "kinPhone"
  | "kinSuffix"
  | "kinMobile"
  | "kinFax"
  | "kinSsn"
  | "kinAddress"
  | "kinAddress2"
  | "kinZipCode"
  | "kinCity"
  | "kinState"
  | "kinCountry"
  | "kinUserId"
  | "kinDoctorId"
  | "kinFacilityId"
  | "kinPatientId"
  | "kinEmployerName"

type GuardianContactControlTypes =
  | "guardianName"
  | "guardianFirstName"
  | "guardianMiddleName"
  | "guardianLastName"
  | "guardianEmail"
  | "guardianContactType"
  | "guardianRelationship"
  | "guardianPager"
  | "guardianPhone"
  | "guardianSuffix"
  | "guardianMobile"
  | "guardianFax"
  | "guardianSsn"
  | "guardianAddress"
  | "guardianAddress2"
  | "guardianZipCode"
  | "guardianCity"
  | "guardianState"
  | "guardianCountry"
  | "guardianUserId"
  | "guardianDoctorId"
  | "guardianFacilityId"
  | "guardianPatientId"
  | "guardianEmployerName"

type GuarantorContactControlTypes =
  | "guarantorName"
  | "guarantorFirstName"
  | "guarantorMiddleName"
  | "guarantorLastName"
  | "guarantorEmail"
  | "guarantorContactType"
  | "guarantorRelationship"
  | "guarantorPager"
  | "guarantorPhone"
  | "guarantorSuffix"
  | "guarantorMobile"
  | "guarantorFax"
  | "guarantorSsn"
  | "guarantorAddress"
  | "guarantorAddress2"
  | "guarantorZipCode"
  | "guarantorCity"
  | "guarantorState"
  | "guarantorCountry"
  | "guarantorUserId"
  | "guarantorDoctorId"
  | "guarantorFacilityId"
  | "guarantorPatientId"
  | "guarantorEmployerName"


type EmployerControlTypes =
  | "employerName"
  | "employerEmail"
  | "employerPhone"
  | "employerMobile"
  | "employerIndustry"
  | "employerUsualOccupation"
  | "employerPatientId"


interface BasicContactControlInputs {
  basicName: string;
  basicFirstName: string;
  basicMiddleName: string;
  basicLastName: string;
  basicEmail: string;
  basicRelationship: string;
  basicPager: string;
  basicPhone: string;
  basicMobile: string;
  basicFax: string;
  basicSsn: string;
  basicSuffix: string,
  basicAddress: string;
  basicAddress2: string;
  basicZipCode: string;
  basicCity: string;
  basicState: string;
  basicCountry: string;
  basicEmployerName: string;
}

interface EmergencyContactControlInputs {
  emergencyName: string;
  emergencyFirstName: string;
  emergencyMiddleName: string;
  emergencyLastName: string;
  emergencyEmail: string;
  emergencyPager: string;
  emergencyPhone: string;
  emergencyMobile: string;
  emergencyFax: string;
  emergencySsn: string;
  emergencySuffix: string;
  emergencyAddress: string;
  emergencyAddress2: string;
  emergencyZipCode: string;
  emergencyCity: string;
  emergencyState: string;
  emergencyCountry: string;
  emergencyDoctorId: string;
  emergencyRelationship: string;
  emergencyEmployerName: string;
}

interface KinContactControlInputs {
  kinName: string;
  kinFirstName: string;
  kinMiddleName: string;
  kinLastName: string;
  kinEmail: string;
  kinRelationship: string;
  kinPager: string;
  kinPhone: string;
  kinMobile: string;
  kinFax: string;
  kinSsn: string;
  kinSuffix: string;
  kinAddress: string;
  kinAddress2: string;
  kinZipCode: string;
  kinCity: string;
  kinState: string;
  kinCountry: string;
  kinEmployerName: string;
}

interface GuardianContactControlInputs {
  guardianName: string;
  guardianFirstName: string;
  guardianMiddleName: string;
  guardianLastName: string;
  guardianEmail: string;
  guardianRelationship: string;
  guardianPager: string;
  guardianPhone: string;
  guardianMobile: string;
  guardianFax: string;
  guardianSsn: string;
  guardianSuffix: string;
  guardianAddress: string;
  guardianAddress2: string;
  guardianZipCode: string;
  guardianCity: string;
  guardianState: string;
  guardianCountry: string;
  guardianEmployerName: string;
}

interface GuarantorContactControlInputs {
  guarantorName: string;
  guarantorFirstName: string;
  guarantorMiddleName: string;
  guarantorLastName: string;
  guarantorEmail: string;
  guarantorRelationship: string;
  guarantorPager: string;
  guarantorPhone: string;
  guarantorMobile: string;
  guarantorFax: string;
  guarantorSsn: string;
  guarantorSuffix: string;
  guarantorAddress: string;
  guarantorAddress2: string;
  guarantorZipCode: string;
  guarantorCity: string;
  guarantorState: string;
  guarantorCountry: string;
  guarantorEmployerName: string;
}

interface EmployerControlInputs {
  employerName: string;
  employerEmail: string;
  employerPhone: string;
  employerMobile: string;
  employerIndustry: string;
  employerUsualOccupation: string;
}

interface RegisterUserInputs {
  userFirstName: string
  userLastName: string
  userPassword: string
  userEmail: string
  userPhone: string
  userZipCode: string
}
export interface PatientInputControlProps extends IControlLabel {
  controllerName: PatientControlTypes | RegisterUserControlTypes | BasicContactControlTypes | EmployerControlTypes | KinContactControlTypes | GuarantorContactControlTypes | GuardianContactControlTypes | EmergencyContactControlTypes
}

export type PatientInputProps =
  Omit<CreatePatientItemInput, "gender" | "race" | "genderIdentity" | "maritialStatus" | "sexAtBirth"
    | "primaryDepartment" | "registrationDepartment"
    | "facilityId" | "usualProviderId" | "sexualOrientation" | "pronouns" | "ethnicity" | "sexualOrientation" | "genderIdentity">
  & { usualProviderId: SelectorOption } & { gender: SelectorOption } & { race: SelectorOption } & { sexualOrientation: SelectorOption }
  & { pronouns: SelectorOption } & { ethnicity: SelectorOption } & { sexualOrientation: SelectorOption }
  & { genderIdentity: SelectorOption } & { sexAtBirth: SelectorOption } & { primaryDepartment: SelectorOption }
  & { genderIdentity: SelectorOption } & { maritialStatus: SelectorOption } & { facilityId: SelectorOption }
  & { registrationDepartment: SelectorOption }
  & Omit<RegisterUserInput, "facilityId" | "roleType"> & Omit<BasicContactControlInputs, "facilityId">
  & Omit<EmergencyContactControlInputs, "facilityId"> & Omit<KinContactControlInputs, "FacilityId">
  & Omit<GuardianContactControlInputs, "facilityId"> & Omit<GuarantorContactControlInputs, "facilityId">
  & EmployerControlInputs & RegisterUserInputs; 
