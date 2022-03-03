// packages block
import { ComponentType, Dispatch, ReactNode, ElementType, SetStateAction } from "react";
import { GridSize } from "@material-ui/core";
import { RouteProps } from "react-router-dom";
import { Control, ValidationRule, FieldValues } from "react-hook-form";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
// graphql block
import { Action } from "../reducers/locationReducer";
import { serviceAction } from "../reducers/serviceReducer";
import { Action as DoctorAction } from "../reducers/doctorReducer";
import {
  LoginUserInput, User, CreateStaffInput, UpdateContactInput, CreateScheduleInput, ContactsPayload,
  UpdateFacilityItemInput, FacilitiesPayload, CreateContactInput, CreateDoctorItemInput, Gender,
  CreatePatientItemInput, ServicesPayload, CreateExternalAppointmentItemInput, CreatePracticeItemInput,
  CreateServiceInput, AllDoctorPayload, Attachment, AttachmentType, Patient, PatientsPayload, Schedule,
  UpdateFacilityTimeZoneInput, CreateAppointmentInput,
} from "../generated/graphql";
import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";

export interface PrivateRouteProps extends RouteProps {
  component: ComponentType<any>;
}

type Key = string | number | undefined;

export interface CloseSnackbarProps { id: Key; }

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
  facilityList: FacilitiesPayload['facilities'];
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
  isOpen: boolean;
  isEdit?: boolean;
  setOpen?: Function;
  refetch?: Function;
  handleClose?: Function;
}

export interface ConfirmationTypes extends DialogTypes {
  title?: string;
  success?: boolean;
  actionText?: string;
  isLoading?: boolean;
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

export type MediaControlTypes = "title" | "subTitle" | "description";

export interface LoginInputControlProps extends ControlLabel {
  error?: string;
  fieldType: string;
  isPassword?: boolean;
  controllerName: LoginControlTypes;
  control: Control<LoginUserInput, object>;
  pattern?: ValidationRule<RegExp> | undefined;
}

export interface CardComponentType extends Children {
  link?: string;
  isEdit?: boolean;
  hasEdit?: boolean;
  cardTitle: string;
  requestLink?: string
  hideSaveIcon?: boolean;
  disableSaveIcon?: boolean;
  disableEditIcon?: boolean;
  onEditClick?: () => void;
}

export interface ChartingCardComponentType {
  link?: string;
  hasAdd?: boolean;
  cardTitle: string;
  requestLink?: string
  vitalsCard?: boolean;
  hideSaveIcon?: boolean;
  onAddClick?: () => void;
  disableAddIcon?: boolean;
  cardChartingData: CardChartingOption[];
}

export interface PageHeaderProps {
  id?: string;
  path?: Path[];
  title: string;
  noAdd?: boolean;
  isIcon?: boolean;
  isOpen?: boolean;
  subTitle?: string;
  setOpen?: Function;
  linkToPage?: string;
  buttonText?: string;
  openModel?: boolean;
  hasComponent?: boolean;
  openModal?: () => void;
  setTableData?: Function;
  tableData?: ServicesPayload['services'];
}

export interface IDropzoneImage {
  error?: string
  optionId: string;
  isDisabled?: boolean;
  imageForView?: string;
  imageModuleType: string;
  updateImageData?: string;
  image?: { url?: string; id?: string };
  imageLoading: (loader: boolean) => void;
}

export interface IFieldTypes {
  fieldType?: string;
  isRequired?: boolean;
  isMultiline?: boolean;
  label: string | JSX.Element
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
  hasMedia?: boolean;
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
  date: string
  title: string
  description: string
}

export interface SelectorProps {
  name: string
  label: string
  error?: string
  disabled?: boolean
  isRequired?: boolean
  isMultiple?: boolean
  value?: SelectorOption
  options: SelectorOption[]
}

export interface CardSelectorProps {
  name: string
  error?: string
  disabled?: boolean
  value?: SelectorOption
  options: SelectorOption[]
}

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
  placeholder?: string;
  controllerLabel?: string;
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
  error?: string;
  fieldType: string;
  isRequired?: boolean;
  controllerName: string;
  controllerLabel: string;
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

export type PatientInputProps = BasicContactControlInputs & EmergencyContactControlInputs & KinContactControlInputs
  & GuardianContactControlInputs & GuarantorContactControlInputs & EmployerControlInputs & RegisterUserInputs
  & Omit<CreatePatientItemInput, "gender" | "race" | "genderIdentity" | "maritialStatus" | "sexAtBirth"
    | "primaryDepartment" | "registrationDepartment" | "pronouns" | "ethnicity" | "sexualOrientation"
    | "facilityId" | "usualProviderId" | "sexualOrientation" | "genderIdentity" | "homeBound">
  & { usualProviderId: SelectorOption } & { gender: SelectorOption } & { race: SelectorOption }
  & { sexualOrientation: SelectorOption } & { sexualOrientation: SelectorOption }
  & { pronouns: SelectorOption } & { ethnicity: SelectorOption } & { facilityId: SelectorOption }
  & { genderIdentity: SelectorOption } & { sexAtBirth: SelectorOption } & { primaryDepartment: SelectorOption }
  & { genderIdentity: SelectorOption } & { maritialStatus: SelectorOption }
  & { registrationDepartment: SelectorOption } & { homeBound: boolean }

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
  | "kinPhone" | "kinMobile" | "employerPhone" | "guarantorPhone" | "pager" | "userPhone"

export interface PhoneInputProps {
  label: string
  error?: string
  isRequired?: boolean
  name: PhoneInputTypes
}

export interface DropzoneImageType {
  itemId: string;
  isEdit?: boolean;
  isProfile?: boolean;
  attachmentId: string;
  isDisabled?: boolean;
  hasHighlight?: boolean;
  attachment?: Attachment;
  imageModuleType: AttachmentType;
  reset: Function;
  handleClose: Function;
  setActiveStep?: Function;
  setAttachments: Function;
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
  itemId: string;
  isProfile?: boolean;
  preSignedUrl?: string;
  attachment?: Attachment;
  attachments?: Attachment[];
  imageModuleType: AttachmentType;
  setEdit: Function
  setAttachments: Function;
}

export interface MediaCardsType {
  itemId: string;
  imageSide: string;
  isProfile?: boolean;
  hasCollage?: boolean;
  hasHighlights?: boolean
  notDescription?: boolean;
  moduleType: AttachmentType;
  attachmentData?: Attachment;
}

export interface DropDownItems {
  itemName?: string;
  current?: boolean;
  avatarIcon?: boolean;
  menuItem: DropDownOption[];
}

export interface IMediaControl extends IFieldTypes {
  isDisabled?: boolean;
  fieldName: MediaControlTypes;
  control: Control<ICreateMediaInput, object>;
}

export interface MediaCardComponentType {
  title: string;
  isEdit: boolean;
  isOpen: boolean;
  imageSide: string;
  imageModuleType?: string;
  notDescription?: boolean;
  attachments?: Attachment[];
  allAttachments: Attachment[];
  setOpen: Function;
  setEdit: Function;
  setAttachment?: Function;
  setAttachments: Function;
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

export type CustomPracticeInputProps = CreatePracticeItemInput & RegisterUserInputs
  & Pick<CreateContactInput, "city" | "address" | "address2" | "zipCode"> & { facilityName: string }
  & { roleType: SelectorOption } & { country: SelectorOption } & { state: SelectorOption } & { isAdmin: boolean }