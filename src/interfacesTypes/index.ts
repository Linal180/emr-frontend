// packages block
import { ComponentType, Dispatch, ReactNode, ElementType, SetStateAction } from "react";
import { GridSize } from "@material-ui/core";
import { RouteProps } from "react-router-dom";
import { Control, ValidationRule, FieldValues } from "react-hook-form";
// graphql block
import {
  LoginUserInput, User, UpdateUserInput, CreateStaffInput, UpdateContactInput,
  UpdateFacilityItemInput, FacilitiesPayload, CreateContactInput, CreateDoctorItemInput, Gender,
  CreatePatientItemInput, Ethnicity, Genderidentity, Homebound, Maritialstatus, PrimaryDepartment,
  Pronouns, Race, RegDepartment, RelationshipType, Sexualorientation, ServicesPayload,
  CreateServiceInput, AllDoctorPayload, Attachment, AttachmentType, Patient,
  UpdateFacilityTimeZoneInput, CreateAppointmentInput, ContactsPayload, PatientsPayload,
  CreateScheduleInput, Schedule, CreateExternalAppointmentItemInput
} from "../generated/graphql";
import { Action } from "../reducers/locationReducer";
import { serviceAction } from "../reducers/serviceReducer";
import { Action as DoctorAction } from "../reducers/doctorReducer";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

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

export interface DoctorScheduleSlotProps {
  doctorFacilityId?: string;
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
  locationList: ContactsPayload['contacts'];
  setLocationList: Function;
  fetchAllLocationList: Function;
  serviceList: ServicesPayload['services'];
  setServicesList: Function;
  fetchAllServicesList: Function;
  patientList: PatientsPayload['patients'];
  setPatientList: Function;
  fetchAllPatientList: Function;
}

export interface FacilityContextInterface {
  doctorList: AllDoctorPayload['doctors'];
  setDoctorList: Function;
  fetchAllDoctorList: Function;
  locationList: ContactsPayload['contacts'];
  setLocationList: Function;
  fetchAllLocationList: Function;
  serviceList: ServicesPayload['services'];
  setServicesList: Function;
  fetchAllServicesList: Function;
  patientList: PatientsPayload['patients'];
  setPatientList: Function;
  fetchAllPatientList: Function;
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

export interface ViewAppointmentCardProps {
  isLoading?: boolean;
  isOpen: boolean;
  title?: string;
  setIsOpen: Function;
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

export interface ChartingCardComponentType {
  link?: string;
  hasAdd?: boolean;
  cardTitle: string;
  requestLink?: string
  hideSaveIcon?: boolean;
  onAddClick?: () => void;
  disableAddIcon?: boolean;
  cardChartingData: CardChartingOption[];
  vitalsCard?: boolean;
}

export interface PageHeaderProps {
  isOpen?: boolean;
  setOpen?: Function;
  hasComponent?: boolean;
  linkToPage?: string;
  title: string;
  subTitle?: string;
  buttonText?: string;
  noAdd?: boolean;
  path?: Path[];
  openModel?: boolean;
  openModal?: () => void;
  setTableData?: Function;
  tableData?: ServicesPayload['services'];
  isIcon?: boolean;
  id?: string;
}

export interface FacilityServicesProps {
  setTableData?: Function;
  tableData?: ServicesPayload['services'];
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
  name: string | undefined | null
}

export interface DropDownOption {
  name: string
  link: string
}

export interface CardChartingOption {
  title: string
  description: string
  date: string
}

export interface SelectorProps {
  name: string
  label: string
  error?: string
  disabled?: boolean
  isRequired?: boolean
  value?: SelectorOption
  options: SelectorOption[]
  isMultiple?: boolean
}

export interface CardSelectorProps {
  name: string
  error?: string
  disabled?: boolean
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
  error?: string;
  fieldType?: string;
  disabled?: boolean;
  isRequired?: boolean;
  multiline?: boolean;
  isPassword?: boolean;
  controllerLabel?: string;
  pattern?: ValidationRule<RegExp> | undefined;
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

export interface CustomInputControlProps extends IControlLabel {
  controllerName: string;
  info?: string;
}

export interface SearchComponentProps {
  search: Function;
}

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

export interface PickerProps {
  name: string;
  label: string;
  error?: string;
  isRequired?: boolean
}

export interface TimePickerProps {
  controllerName: string;
  controllerLabel: string;
  error?: string;
  isRequired?: boolean;
  fieldType: string;
}

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
  id: string;
  facilityId?: string;
}

export type ExtendedStaffInputProps = Omit<CreateStaffInput, "facilityId" | "roleType" | "gender">
  & { facilityId: SelectorOption } & { roleType: SelectorOption } & { gender: SelectorOption };

export type ScheduleInputProps = Omit<CreateScheduleInput, "servicesIds">
  & { serviceId: SelectorOption } & { day: SelectorOption };

interface CustomBillingAddressInputs {
  billingFax: string;
  billingCity: string;
  billingPager: string;
  billingEmail: string;
  billingPhone: string;
  billingUserId: string;
  billingMobile: string;
  billingZipCode: string;
  billingAddress: string;
  billingAddress2: string;
  billingFacility: string;
  billingState: SelectorOption;
  billingCountry: SelectorOption;
}

export type CustomFacilityInputProps = Omit<UpdateContactInput, "serviceCode" | "state" | "country">
  & Omit<UpdateFacilityItemInput, "practiceType" | "serviceCode" | "timeZone"> & CustomBillingAddressInputs
  & { serviceCode: SelectorOption } & { practiceType: SelectorOption } & { timeZone: SelectorOption }
  & { state: SelectorOption } & { country: SelectorOption };

type UpdateFacilityTimeZoneControlTypes = | "timeZone" | "facilityId";

export interface UpdateFacilityTimeZoneControlProps extends IControlLabel {
  controllerName: UpdateFacilityTimeZoneControlTypes;
}

export type CustomUpdateFacilityTimeZoneInputProps = Omit<UpdateFacilityTimeZoneInput, "timeZone">
  & { timeZone: SelectorOption } & { facilityId: SelectorOption };

export type DoctorInputProps = Omit<CreateDoctorItemInput, "facilityId" | "speciality">
  & Omit<CreateContactInput, "facilityId" | "state" | "country"> & CustomBillingAddressInputs
  & { facilityId: SelectorOption } & { country: SelectorOption }
  & { speciality: SelectorOption } & { state: SelectorOption };

export type ServiceInputProps = Omit<CreateServiceInput, "facilityId"> & { facilityId: SelectorOption };

export interface RenderInputFieldProps {
  name: string
  label: string
  control?: Control<FieldValues, object> | undefined
}

export interface StepLabelType {
  title: string
  subTitle: string
}

export interface FormVerification {
  imageSide: string;
}

export interface StepperComponentProps {
  activeStep: number
}

interface BasicContactControlInputs {
  basicCity: string;
  basicEmail: string;
  basicPhone: string;
  basicMobile: string;
  basicAddress: string;
  basicAddress2: string;
  basicZipCode: string;
  basicCountry: SelectorOption;
  basicState: SelectorOption;
}

interface EmergencyContactControlInputs {
  emergencyName: string;
  emergencyPhone: string;
  emergencyCity?: string;
  emergencyMobile: string;
  emergencyAddress?: string;
  emergencyZipCode?: string;
  emergencyAddress2?: string;
  emergencyState?: SelectorOption;
  emergencyCountry?: SelectorOption;
  emergencyRelationship: SelectorOption;
}

interface KinContactControlInputs {
  kinName: string;
  kinRelationship: SelectorOption;
  kinPhone: string;
  kinMobile: string;
}

interface GuardianContactControlInputs {
  guardianFirstName: string;
  guardianMiddleName: string;
  guardianLastName: string;
  guardianSuffix: string;
  guardianName: string;
  guardianRelationship: SelectorOption;
}

interface GuarantorContactControlInputs {
  guarantorDob: string;
  guarantorSsn: string;
  guarantorCity: string;
  guarantorEmail: string;
  guarantorPhone: string;
  guarantorSuffix: string;
  guarantorAddress: string;
  guarantorZipCode: string;
  guarantorLastName: string;
  guarantorAddress2: string;
  guarantorFirstName: string;
  guarantorMiddleName: string;
  guarantorEmployerName: string;
  guarantorState: SelectorOption;
  guarantorCountry: SelectorOption;
  guarantorRelationship: SelectorOption;
}

interface EmployerControlInputs {
  employerName: string;
  employerEmail: string;
  employerPhone: string;
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

export type PatientInputProps =
  Omit<CreatePatientItemInput, "gender" | "race" | "genderIdentity" | "maritialStatus" | "sexAtBirth"
    | "primaryDepartment" | "registrationDepartment" | "pronouns" | "ethnicity" | "sexualOrientation"
    | "facilityId" | "usualProviderId" | "sexualOrientation" | "genderIdentity" | "homeBound">
  & { usualProviderId: SelectorOption } & { gender: SelectorOption } & { race: SelectorOption }
  & { sexualOrientation: SelectorOption } & { sexualOrientation: SelectorOption }
  & { pronouns: SelectorOption } & { ethnicity: SelectorOption } & { facilityId: SelectorOption }
  & { genderIdentity: SelectorOption } & { sexAtBirth: SelectorOption } & { primaryDepartment: SelectorOption }
  & { genderIdentity: SelectorOption } & { maritialStatus: SelectorOption }
  & { registrationDepartment: SelectorOption } & { homeBound: boolean }
  & BasicContactControlInputs
  & EmergencyContactControlInputs & KinContactControlInputs
  & GuardianContactControlInputs & GuarantorContactControlInputs
  & EmployerControlInputs & RegisterUserInputs;

export type ExternalPatientInputProps =
  { preferredCommunicationMethod: SelectorOption } & { providerId: SelectorOption } & { race: SelectorOption }
  & { ethnicity: SelectorOption } & { providerId: SelectorOption } & { genderIdentity: SelectorOption }
  & { state: SelectorOption } & { maritialStatus: SelectorOption } & { country: SelectorOption }
  & { emergencyCountry: SelectorOption } & { emergencyState: SelectorOption }
  & Pick<CreatePatientItemInput, 'dob' | 'pharmacy' | 'voiceCallPermission' | 'phonePermission' | 'language'
    | 'callToConsent' | 'releaseOfInfoBill'>
  & Pick<CreateContactInput, 'address' | 'address2' | 'city' | 'zipCode' | 'ssn'>
  & Pick<EmergencyContactControlInputs, 'emergencyName' | 'emergencyRelationship' | 'emergencyPhone' |
    'emergencyCity' | 'emergencyZipCode' | 'emergencyAddress' |
    'emergencyAddress2'>

export type extendedServiceInput = Omit<CreateServiceInput, "facilityId">
  & { facilityId: SelectorOption };

export interface ServiceTableProps {
  serviceDispatch: Dispatch<serviceAction>
  openModal: boolean;
}

export interface ServiceModalProps extends DialogTypes {
  serviceId?: string;
  reload: () => void;
}

export interface CustomInputControlProps extends IControlLabel {
  controllerName: string
}

export type extendedContactInput = Omit<CreateContactInput, "facilityId" | "serviceCode" | "state">
  & { facilityId: SelectorOption } & { serviceCode: SelectorOption } & { state: SelectorOption }

export interface LocationTableProps {
  openModal: boolean;
  locationDispatch: Dispatch<Action>;
}

export interface LocationModalProps extends DialogTypes {
  locationId?: string;
  reload: () => void;
}

export interface GeneralFormProps {
  id?: string
  isEdit?: boolean
}

type PhoneInputTypes = | "phone" | "fax" | "mobile" | "basicPhone" | "basicMobile" | "basicFax"
  | "billingPhone" | "billingFax" | "billingMobile" | "emergencyPhone" | "emergencyMobile"
  | "kinPhone" | "kinMobile" | "employerPhone" | "guarantorPhone" | "pager"

export interface PhoneInputProps {
  label: string
  error?: string
  isRequired?: boolean
  name: PhoneInputTypes
}

export interface DropzoneImageType {
  imageModuleType: AttachmentType;
  isEdit?: boolean;
  isProfile?: boolean;
  attachmentId: string;
  itemId: string;
  isDisabled?: boolean;
  attachment?: Attachment;
  handleClose: Function;
  setAttachments: Function;
  setActiveStep?: Function
  reset: Function;
  hasHighlight?: boolean
}

interface Message {
  message: string;
}

export interface MediaPatientDataType extends Message {
  patient: Patient;
}

export interface ICreateMediaInput {
  title?: string;
  subTitle?: string;
  description?: string;
}

export interface MediaModalTypes extends DialogTypes {
  imageModuleType: AttachmentType;
  itemId: string;
  setEdit: Function
  isProfile?: boolean;
  setAttachments: Function;
  attachment?: Attachment;
  preSignedUrl?: string;
  attachments?: Attachment[]
}

export interface MediaCardsType {
  itemId: string;
  isProfile?: boolean;
  moduleType: AttachmentType;
  hasCollage?: boolean;
  attachmentData?: Attachment
  hasHighlights?: boolean
  imageSide: string;
  notDescription?: boolean;
}

export interface DropDownItems {
  itemName?: string;
  current?: boolean;
  menuItem: DropDownOption[];
  avatarIcon?: boolean;
}

export interface IMediaControl extends IFieldTypes {
  fieldName: MediaControlTypes;
  isDisabled?: boolean;
  control: Control<ICreateMediaInput, object>;
}

export interface MediaCardComponentType {
  title: string;
  setOpen: Function;
  isOpen: boolean;
  imageModuleType?: string;
  setAttachment?: Function;
  setAttachments: Function;
  setEdit: Function;
  isEdit: boolean;
  attachments?: Attachment[];
  allAttachments: Attachment[];
  imageSide: string;
  notDescription?: boolean;
}

export interface DocumentModalComponentType {
  setOpen: Function;
  isOpen: boolean;
}

export type ExtendedAppointmentInputProps = Omit<CreateAppointmentInput, "patientId" | "facilityId" |
  "serviceId" | "providerId"> & { facilityId: SelectorOption } & { patientId: SelectorOption }
  & { serviceId: SelectorOption } & { providerId: SelectorOption };

export type ExtendedExternalAppointmentInputProps = Omit<CreateExternalAppointmentItemInput, "serviceId"
  | "providerId" | "paymentType"> & { serviceId: SelectorOption } & { providerId: SelectorOption }
  & Omit<CreatePatientItemInput, "sexAtBirth"> & { paymentType: SelectorOption } &
{ sexAtBirth: SelectorOption } & GuardianContactControlInputs;

type Days = | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"

export interface DoctorScheduleModalProps extends GeneralFormProps {
  isOpen: boolean;
  reload: Function;
  doctorDispatcher: Dispatch<DoctorAction>;
  doctorFacilityId: string | undefined;
}

export interface DaySchedule {
  day: Days;
  slots: Schedule[];
}

export interface DoctorScheduleProps {
  schedule: Schedule;
  dispatcher: Dispatch<DoctorAction>;
}

export interface AppointmentsTableProps {
  doctorId?: string;
}

export interface AppointmentDatePickerProps {
  date: MaterialUiPickersDate,
  setDate: Dispatch<SetStateAction<MaterialUiPickersDate>>
}