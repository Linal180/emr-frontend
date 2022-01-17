// packages block
import { ComponentType, Dispatch, ReactNode, ElementType } from "react";
import { GridSize } from "@material-ui/core";
import { RouteProps } from "react-router-dom";
import { Control, ValidationRule } from "react-hook-form";
// graphql block
import { LoginUserInput, User, UpdateUserInput, UserRole, CreateStaffInput, Gender, UpdateStaffInput, UpdateBillingAddressInput, UpdateContactInput, UpdateFacilityItemInput, FacilitiesPayload, CreateDoctorInput, CreateContactInput, CreateDoctorItemInput } from "../generated/graphql";

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

interface SelectorOptionType {
  value: string;
  label: string
}

export interface SelectorProps {
  name: string
  label: string
  loading?: boolean
  options: SelectorOptionType[]
  value?: any
  error?: string | undefined
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

type AddStaffControlTypes = "firstName" | "lastName" | "email" | "username" | "password"
  | "phone" | "mobile" | "dob" | "gender" | "roleType" | "adminId" | "facilityId";

type UpdateStaffControlTypes = "firstName" | "lastName" | "email" | "username" | "phone" | "mobile" | "dob" | "gender" | "facilityId";

export interface AddStaffInputControlProps extends IControlLabel {
  control: Control<CreateStaffInput, object>;
  controllerName: AddStaffControlTypes;
}

export interface UpdateStaffInputControlProps extends IControlLabel {
  control: Control<UpdateStaffInput, object>;
  controllerName: UpdateStaffControlTypes;
}

export interface MappedRoleInterface {
  value: UserRole;
  label: string;
}

export interface MappedGenderInterface {
  value: Gender;
  label: string;
}

export type ParamsType = {
  id: string
}

export interface DatePickerProps {
  name: string;
  label: string;
  error: string;
}

type FacilityControlTypes = | "name" | "practiceType" | "code" | "email" | "phone" | "fax" | "zipCode" | "address"
  | "address2" | "city" | "state" | "country" | "billingEmail" | "billingPhone" | "billingFax" | "billingZipCode"
  | "billingAddress" | "billingAddress2" | "billingCity" | "billingState" | "billingCountry" | "billingBankAccount"
  | "cliaIdNumber" | "federalTaxId" | "revenueCode" | "tamxonomyCode" | "insurancePlanType"
  | "mammographyCertificationNumber" | "npi" | "merchantId" | "billingType" | "stateImmunizationId" | "locationId"
  | "serviceCode" | "mobile" | "pager" | "serviceCode";

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

export interface CreateFacilityInputControlProps extends IControlLabel {
  controllerName: FacilityControlTypes;
}

export interface UpdateFacilityInputControlProps extends IControlLabel {
  controllerName: FacilityControlTypes;
}

export type CustomUpdateFacilityInputProps = UpdateBillingAddressInput & UpdateContactInput & UpdateFacilityItemInput & CustomBillingAddressInputs;

type ContactInputTypes =
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

export type DoctorInputProps = CreateDoctorInput & CreateDoctorItemInput & CreateContactInput & CustomBillingAddressInputs;
