// packages block
import { ComponentType, Dispatch, ReactNode, ElementType } from "react";
import { GridSize } from "@material-ui/core";
import { RouteProps } from "react-router-dom";
import { Control, ValidationRule } from "react-hook-form";
// graphql block
import { LoginUserInput, User, UpdateUserInput, CreateFacilityInput, FacilityPayload, FacilitiesPayload, UserRole, CreateStaffInput, Gender, StaffPayload, UpdateStaffInput } from "../generated/graphql";

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

export interface Children {
  children: ReactNode;
}

export interface BreadcrumbProps {
  link?: string;
  path?: string[];
  title?: string;
  hasButton?: boolean;
  buttonText?: string;
}

export interface MainLayoutProps {
  children: ReactNode,
  breadcrumb?: BreadcrumbProps
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
  noAdd?: boolean
}

export interface IMaterialStepper {
  activeStep: number;
  steps: string[];
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

export interface SelectStateType {
  name: string
  loading: boolean
  options: string[]
  value: string | undefined
  error: string | undefined
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
}

export type AppMenuItemPropsWithoutItems = Omit<AppMenuItemTypes, "items">;

export type AppMenuItemProps = AppMenuItemPropsWithoutItems & {
  items?: AppMenuItemProps[];
};

export type CreateFacilityInterface = CreateFacilityInput;

type CreateFacilityControlTypes = "address" | "address2" | "city" | "cliaIdNumber" | "code" | "country" | "email" | "facilityId" | "fax" | "federalTaxId" | "insurancePlanType" | "mammographyCertificationNumber" | "mobile" | "name" | "npi" | "pager" | "phone" | "practiceType" | "revenueCode" | "serviceCode" | "state" | "stateImmunizationId" | "tamxonomyCode" | "userId" | "zipCode";
export interface CreateFacilityInputControlProps extends IControlLabel {
  control: Control<CreateFacilityInterface, object>;
  controllerName: CreateFacilityControlTypes;
}
type AddStaffControlTypes = "firstName" | "lastName" | "email" | "username" | "password" | "phone" | "mobile" | "dob" | "gender" | "roleType" | "adminId" | "facilityId";
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
