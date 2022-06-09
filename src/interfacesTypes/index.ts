// packages block
import { ComponentType, Dispatch, ElementType, ReactNode, SetStateAction } from "react";
import { RouteProps } from "react-router-dom";
import { usStreet, usZipcode } from "smartystreets-javascript-sdk";
import { AppointmentTooltip } from "@devexpress/dx-react-scheduler-material-ui";
import { GridSize, PropTypes as MuiPropsTypes } from "@material-ui/core";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import {
  Control, ControllerFieldState, ControllerRenderProps, FieldValues, UseFormSetValue, ValidationRule
} from "react-hook-form";
import { CARD_LAYOUT_MODAL, ITEM_MODULE } from "../constants";
import {
  AllDoctorPayload, Allergies, AllergiesPayload, AppointmentsPayload, AppointmentStatus,
  Attachment, AttachmentPayload, AttachmentType, Code, CodeType, CreateAppointmentInput, CreateContactInput,
  CreateDoctorItemInput, CreateExternalAppointmentItemInput, CreatePatientAllergyInput,
  CreatePatientItemInput, CreatePracticeItemInput, CreateProblemInput, CreateScheduleInput,
  CreateServiceInput, CreateStaffItemInput, Doctor, DoctorPatient, FacilitiesPayload, FieldsInputs,
  FormElement, Gender, IcdCodes, IcdCodesPayload, LoginUserInput, Maybe, Patient, PatientPayload, PatientProviderPayload, PatientsPayload, PatientVitals, PatientVitalsPayload, PermissionsPayload, Practice, PracticePayload,
  PracticesPayload, ReactionsPayload, ResponsePayloadResponse, RolesPayload, Schedule, SectionsInputs,
  ServicesPayload, SnoMedCodesPayload, Staff, TwoFactorInput, UpdateAppointmentInput, UpdateAttachmentInput,
  UpdateContactInput, UpdateFacilityItemInput, UpdateFacilityTimeZoneInput, User, UsersFormsElements,
  VerifyCodeInput
} from "../generated/graphql";
import { Action as AppointmentAction, State as AppointmentState } from "../reducers/appointmentReducer";
import { Action as ChartAction } from "../reducers/chartReducer";
import { Action as DoctorAction } from "../reducers/doctorReducer";
import { Action as PublicFormBuilderAction, State as ExternalFormBuilderState } from "../reducers/externalFormBuilderReducer";
import { Action as ExternalPaymentAction, State as ExternalPaymentState } from "../reducers/externalPaymentReducer";
import { Action as FacilityAction, State as FacilityState } from "../reducers/facilityReducer";
import { Action as FormBuilderAction, State as FormBuilderState } from "../reducers/formBuilderReducer";
// constants, reducers, graphql block
import { Action } from "../reducers/mediaReducer";
import { Action as PatientAction, State as PatientState } from "../reducers/patientReducer";
import { Action as PracticeAction } from "../reducers/practiceReducer";
import { serviceAction } from "../reducers/serviceReducer";

export interface PrivateRouteProps extends RouteProps {
  component: ComponentType<any>;
  permission?: string;
}

type Key = string | number | undefined;
export interface CloseSnackbarProps { id: Key }

export interface BackdropInputType {
  loading: boolean;
}

export interface CalendarChart {
  isCalendar: boolean;
  shouldDisableEdit?: boolean;
}

export interface AuthContextProps {
  user: User | null;
  userRoles: string[];
  isLoggedIn: boolean;
  practiceName: string;
  userPermissions: string[];
  currentUser: Doctor | Staff | null;
  currentDoctor: Doctor | null;
  currentStaff: Staff | null;
  setUser: (user: User | null) => void;
  setPracticeName: (name: string) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setCurrentUser: (user: Doctor | Staff | null) => void;
  setCurrentDoctor: (doctor: Doctor | null) => void;
  setCurrentStaff: (staff: Staff | null) => void;
  setUserRoles: (roles: string[]) => void;
  setUserPermissions: (permissions: string[]) => void;
  setProfileUrl: (url: string) => void;
  profileUrl: string;
  fetchUser: () => void
  fetchAttachment: () => void,
  profileAttachment: null | Attachment
}

export interface DoctorScheduleSlotProps {
  doctorFacilityId?: string;
}

export interface AppContextProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<React.SetStateAction<boolean>>;
}

export interface ListContextInterface {
  roleList: RolesPayload["roles"];
  setRoleList: Function;
  fetchAllRoleList: Function;
  facilityList: FacilitiesPayload["facilities"];
  setFacilityList: Function;
  fetchAllFacilityList: Function;
  deleteRoleList: Function;
  deleteFacilityList: Function;
  addRoleList: Function;
  addFacilityList: Function;
  updateRoleList: Function;
  updateFacilityList: Function;
}

export interface FacilityContextInterface {
  doctorList: AllDoctorPayload["doctors"];
  setDoctorList: Function;
  fetchAllDoctorList: Function;
  serviceList: ServicesPayload["services"];
  setServicesList: Function;
  fetchAllServicesList: Function;
  patientList: PatientsPayload["patients"];
  setPatientList: Function;
  fetchAllPatientList: Function;
}

export interface PermissionContextInterface {
  permissionLoading: boolean;
  permissions: PermissionsPayload["permissions"];
}

export interface AppointmentContextInterface {
  appointmentList: AppointmentsPayload["appointments"];
  setAppointmentList: Function;
  fetchAllAppointmentList: Function;
}

export interface ChartContextInterface {
  reactionList: ReactionsPayload['reactions'];
  fetchAllReactionList: Function;
}

export interface Children {
  children: ReactNode;
}

type Path = { text: string; link: string };

export interface BreadcrumbProps {
  path: Path[];
}

export interface MainLayoutProps {
  children: ReactNode;
}

export interface TableLoaderType {
  numberOfRows: number;
  numberOfColumns: number;
}

export interface ActionLayoutType extends Children {
  hasBorder: boolean;
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
  isSign?: boolean;
  success?: boolean;
  actionText?: string;
  isLoading?: boolean;
  description?: string;
  handleDelete: () => void;
  learnMoreText?: string
  aboutToText?: string
}

export interface ConfirmationDaysTypes extends DialogTypes {
  title?: string;
  id?: string;
  isEdit?: boolean;
}

export interface ConfirmationAuthenticationTypes extends DialogTypes {
  title?: string;
  isLoading?: boolean;
  actionText?: string;
  success?: boolean;
  description?: string;
}

export interface GraphModalProps extends DialogTypes {
  dispatcher: Dispatch<PatientAction>;
}

export interface ViewAppointmentCardProps {
  isLoading?: boolean;
  isOpen: boolean;
  title?: string;
  setIsOpen: Function;
}

interface ControlLabel {
  controllerLabel: string | JSX.Element;
  disabled?: boolean;
}

type LoginControlTypes = "email" | "password";

export type MediaControlTypes = "title" | "subTitle" | "description";

export type FormForwardRef = {
  submit: () => void,
}

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
  requestLink?: string;
  hideSaveIcon?: boolean;
  disableSaveIcon?: boolean;
  disableEditIcon?: boolean;
  onEditClick?: () => void;
  isFullHeight?: boolean;
}

export interface ChartingCardComponentType {
  link?: string;
  hasAdd?: boolean;
  cardTitle: string;
  requestLink?: string;
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
  tableData?: ServicesPayload["services"];
  startIcon?: JSX.Element;
}

export interface IDropzoneImage {
  error?: string;
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
  label: string | JSX.Element;
}

export type RecordType = {
  id: string;
  name: string;
};

export type OptionType = {
  value: string;
  label: string;
};

interface TextLoaderRow {
  column: number
  size: GridSize
}

export interface TextLoaderInterface {
  rows: TextLoaderRow[]
}

export interface DataLoaderInterface {
  rows: number;
  hasMedia?: boolean;
  columns: GridSize;
}

export type TableAlignType =
  | "left"
  | "center"
  | "right"
  | "justify"
  | "inherit"
  | undefined;

export interface IDetailCellProps {
  description: string;
}

export interface SelectorOption {
  id: string;
  name: string | undefined | null;
}

export interface AsyncSelectorOption {
  value: string
  label: string | undefined | null
}

export interface DropDownOption {
  name: string;
  link: string;
}

export interface CardChartingOption {
  date: string;
  title: string;
  description: string;
}

export interface TableCodesProps {
  id: string;
  code: string;
  description: string;
  price?: string;
}

export interface CodeTablesData {
  [CodeType.Icd_10Code]?: TableCodesProps[]
  [CodeType.CptCode]?: TableCodesProps[]
  [CodeType.HcpcsCode]?: TableCodesProps[]
  [CodeType.CustomCode]?: TableCodesProps[]
}

export interface SelectorProps {
  name: string
  label: string
  error?: string
  isEdit?: boolean
  disabled?: boolean
  addEmpty?: boolean
  isRequired?: boolean
  isMultiple?: boolean
  value?: SelectorOption
  options?: SelectorOption[]
  margin?: MuiPropsTypes.Margin
  onBlur?: Function
  onSelect?: Function
}

export interface PatientSelectorProps extends SelectorProps {
  isOpen?: boolean
  isModal?: boolean
  handlePatientModal?: Function
  setValue: UseFormSetValue<ExtendedAppointmentInputProps>
}

export interface FacilitySelectorProps extends SelectorProps {
  patientId?: string
}

export interface DoctorSelectorProps extends FacilitySelectorProps {
  facilityId?: string
  shouldOmitFacilityId?: boolean
  careProviderData?: DoctorPatient[];
}

export interface CardSelectorProps {
  name: string;
  error?: string;
  disabled?: boolean;
  value?: SelectorOption;
  options: SelectorOption[];
}

type ResetPasswordControlTypes = "password" | "repeatPassword";

export type ForgetPasswordInputs = {
  email: string;
};

export type ResetPasswordInputs = {
  password: string;
  repeatPassword: string;
};

export type ChangePasswordInputs = {
  oldPassword: string;
  password: string;
  repeatPassword: string;
};

export type updatePasswordInputs = ResetPasswordInputs & {
  oldPassword: string;
};

interface IControlLabel {
  info?: string;
  error?: string;
  fieldType?: string;
  disabled?: boolean;
  className?: string;
  multiline?: boolean;
  isPassword?: boolean;
  isRequired?: boolean;
  placeholder?: string;
  controllerLabel?: string;
  margin?: MuiPropsTypes.Margin
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
  isSearch?: boolean;
  info?: string;
  clearable?: boolean
  handleClearField?: (fieldName: any) => void
  endAdornment?: ReactNode;
  onBlur?: Function;
  notStep?: boolean;
  isHelperText?: boolean;
  autoFocus?: boolean;
  isHtmlValidate?: boolean
}

export interface TooltipData {
  name: string;
  format: string;
}


export interface SearchComponentProps {
  search: Function;
  info?: boolean;
  tooltipData?: TooltipData[]
  placeHolder?: string;
}

export interface AppMenuItemTypes {
  name: string;
  link?: string;
  Icon?: ElementType;
  items?: SubMenuTypes[];
  index?: number;
  activeCollapse?: number;
  setActiveCollapse?: (item: number) => void;
  sectionName?: boolean;
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
  isRequired?: boolean;
  clearable?: boolean
  disableFuture?: boolean
  disabled?: boolean
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
  templateId?: string;
  orderNum?: string;
  patientId?: string;
  tabValue?: string
  appointmentId?: string
}

export interface PreSignedUrlInterface {
  attachmentId: string
  preSignedUrl?: string
}

export type ExtendedStaffInputProps = Omit<
  CreateStaffItemInput,
  "facilityId" | "roleType" | "gender"
> & { facilityId: SelectorOption } & { roleType: SelectorOption } & {
  gender: SelectorOption;
} & { providerIds: SelectorOption };

export type ScheduleInputProps = Omit<CreateScheduleInput, "servicesIds" | "day">
  & { serviceId: SelectorOption } & { day: SelectorOption };

export type FacilityScheduleInputProps = Omit<CreateScheduleInput, "day"> & { day: SelectorOption };

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

export type CustomFacilityInputProps = Omit<
  UpdateContactInput,
  "serviceCode" | "state" | "country"
> &
  Omit<
    UpdateFacilityItemInput,
    "practiceType" | "serviceCode" | "timeZone" | "practiceId"
  > &
  CustomBillingAddressInputs & { serviceCode: SelectorOption } & {
    practiceType: SelectorOption;
  } & { timeZone: SelectorOption } & { state: SelectorOption } & {
    country: SelectorOption;
  } & { practice: SelectorOption };

type UpdateFacilityTimeZoneControlTypes = "timeZone" | "facilityId";

export interface UpdateFacilityTimeZoneControlProps extends IControlLabel {
  controllerName: UpdateFacilityTimeZoneControlTypes;
}

export type CustomUpdateFacilityTimeZoneInputProps = Omit<
  UpdateFacilityTimeZoneInput,
  "timeZone"
> & { timeZone: SelectorOption } & { facilityId: SelectorOption };

export type DoctorInputProps = Omit<
  CreateDoctorItemInput,
  "facilityId" | "speciality"
> &
  Omit<CreateContactInput, "facilityId" | "state" | "country"> &
  CustomBillingAddressInputs & { facilityId: SelectorOption } & {
    country: SelectorOption;
  } & { speciality: SelectorOption } & { state: SelectorOption };

export type ServiceInputProps = Omit<CreateServiceInput, "facilityId"> & {
  facilityId: SelectorOption;
};

export interface RenderInputFieldProps {
  name: string;
  label: string;
  control?: Control<FieldValues, object> | undefined;
}

export interface StepLabelType {
  title: string;
}

export interface FormVerification {
  imageSide: string;
}

export interface StepperComponentProps {
  activeStep: number;
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
  userFirstName: string;
  userLastName: string;
  userPassword: string;
  userEmail: string;
  userPhone: string;
  userZipCode: string;
}

export type PatientInputProps = BasicContactControlInputs &
  EmergencyContactControlInputs &
  KinContactControlInputs &
  GuardianContactControlInputs &
  GuarantorContactControlInputs &
  EmployerControlInputs &
  RegisterUserInputs &
  Omit<
    CreatePatientItemInput,
    | "gender"
    | "race"
    | "genderIdentity"
    | "maritialStatus"
    | "sexAtBirth"
    | "pronouns"
    | "ethnicity"
    | "sexualOrientation"
    | "facilityId"
    | "usualProviderId"
    | "sexualOrientation"
    | "genderIdentity"
    | "homeBound"
  > & { usualProviderId: SelectorOption } & { gender: SelectorOption } & {
    race: SelectorOption;
  } & { sexualOrientation: SelectorOption } & {
    sexualOrientation: SelectorOption;
  } & { pronouns: SelectorOption } & { ethnicity: SelectorOption } & {
    facilityId: SelectorOption;
  } & { genderIdentity: SelectorOption } & { sexAtBirth: SelectorOption } & {
    homeBound: boolean;
  } & { genderIdentity: SelectorOption } & { maritialStatus: SelectorOption };

export type ExternalPatientInputProps = {
  preferredCommunicationMethod: SelectorOption;
} & { providerId: SelectorOption } & { state: SelectorOption } & {
  country: SelectorOption;
} & { emergencyCountry: SelectorOption } & {
  emergencyState: SelectorOption;
} & Pick<
  CreatePatientItemInput,
  | "pharmacy"
  | "smsPermission"
  | "phonePermission"
  | "callToConsent"
  | "releaseOfInfoBill"
> &
  Pick<
    CreateContactInput,
    "address" | "address2" | "city" | "zipCode" | "ssn"
  > &
  Pick<
    EmergencyContactControlInputs,
    | "emergencyName"
    | "emergencyRelationship"
    | "emergencyPhone"
    | "emergencyCity"
    | "emergencyZipCode"
    | "emergencyAddress"
    | "emergencyAddress2"
  >;

export type ExtendedAppointmentInputProps = Omit<
  CreateAppointmentInput,
  "patientId" | "facilityId" | "serviceId" | "providerId"
> & { facilityId: SelectorOption } & { patientId: SelectorOption } & {
  serviceId: SelectorOption;
} & { providerId: SelectorOption };

export type ExtendedExternalAppointmentInputProps = Pick<
  CreateExternalAppointmentItemInput,
  "scheduleEndDateTime" | "scheduleStartDateTime"
> & { serviceId: SelectorOption } & { providerId: SelectorOption } & Pick<
  CreatePatientItemInput,
  "firstName" | "lastName" | "email" | "dob"
> & { phone: string } & { sexAtBirth: SelectorOption };

export type extendedServiceInput = Omit<CreateServiceInput, "facilityId"> & {
  facilityId: SelectorOption;
};

export interface ServiceTableProps {
  serviceDispatch: Dispatch<serviceAction>;
  openModal: boolean;
}

export interface ServiceModalProps extends DialogTypes {
  serviceId?: string;
  reload: () => void;
}

export interface CustomInputControlProps extends IControlLabel {
  controllerName: string;
}

export type extendedContactInput = Omit<CreateContactInput, "facilityId" | "serviceCode" | "state">
  & { facilityId: SelectorOption } & { serviceCode: SelectorOption } & { state: SelectorOption };

export interface LocationTableProps {
  openModal: boolean;
  locationDispatch: Dispatch<Action>;
}

export interface LocationModalProps extends DialogTypes {
  locationId?: string;
  reload: () => void;
}

export interface GeneralFormProps {
  id?: string;
  isEdit?: boolean;
}

export interface TableSelectorProps {
  title: string
  shouldShowPrice?: boolean
  moduleName: ITEM_MODULE
  handleCodes: Function
}

export interface PolicyCardProps extends GeneralFormProps {
  handleReload?: Function
  filteredOrderOfBenefitOptions?: SelectorOption[]
  setPolicyToEdit?: Function
}

export interface CheckInComponentProps {
  appointmentState: AppointmentState,
  appointmentDispatcher: Dispatch<AppointmentAction>
  handleStep: Function
}

export interface PolicyAttachmentProps {
  policyId?: string
  handleReload: Function
}

export interface LabOrderCreateProps {
  appointmentInfo?: SelectorOption
  handleStep?: Function
  shouldDisableEdit?: boolean
}

export interface LabOrderProviderProps {
  labOrderNumber?: string
  handleStep?: Function
}

export interface CreateBillingProps {
  billingStatus: SelectorOption
  paymentType: SelectorOption
  amount: string
  employment?: boolean
  autoAccident?: boolean
  otherAccident: boolean
  onsetDateType?: SelectorOption
  onsetDate?: string
  otherDateType?: SelectorOption
  otherDate?: string
}

export interface CreateLabTestProviderProps {
  referringProviderId?: SelectorOption
  primaryProviderId?: SelectorOption
  providerNotes?: string
}

type PhoneInputTypes =
  | "phone"
  | "fax"
  | "mobile"
  | "basicPhone"
  | "basicMobile"
  | "basicFax"
  | "billingPhone"
  | "billingFax"
  | "billingMobile"
  | "emergencyPhone"
  | "emergencyMobile"
  | "kinPhone"
  | "kinMobile"
  | "employerPhone"
  | "guarantorPhone"
  | "pager"
  | "userPhone";

export interface PhoneInputProps {
  label: string;
  error?: string;
  isRequired?: boolean;
  name: PhoneInputTypes;
  disabled?: boolean;
}

export interface DropzoneImageType {
  itemId: string;
  title?: string;
  isEdit?: boolean;
  filesLimit: number;
  isProfile?: boolean;
  ref: FormForwardRef;
  providerName: string;
  description?: string;
  attachmentId: string;
  isDisabled?: boolean;
  hasHighlight?: boolean;
  attachment?: Attachment;
  attachmentName?: string;
  attachmentMetadata?: any;
  imageModuleType: AttachmentType;
  reload: Function;
  handleClose: Function;
  setActiveStep?: Function;
  setAttachments: Function;
  acceptableFilesType?: string[]
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
export interface SpecimenTypeOption {
  id?: string
  specimenType: SelectorOption,
  collectionDate: string
  collectionTime: string,
  specimenNotes: string
}

export interface TestOption {
  testId?: string
  test: SelectorOption,
  testDate: string
  testTime: string
  testNotes: string
  newTest?: boolean
  specimenTypeField?: SpecimenTypeOption[]
}

export interface LabOrdersCreateFormInput {
  appointment?: SelectorOption,
  labTestStatus?: SelectorOption,
  diagnosesIds: multiOptionType[]
  testField: TestOption[]
};

export interface LabOrdersSpecimenTypeInput {
  index: number
};

export interface LabOrdersResultOption1 {
  observationId?: string
  resultValue?: string
  resultUnits?: string
  normalRange?: string
  normalRangeUnits?: string
  abnormalFlag?: SelectorOption
}

export interface LabOrdersResultOption2 {
  observationId?: string
  resultValue?: SelectorOption
}

export interface LoinsCodeFields {
  testId: string
  loinccode: string
  description: string
  resultsField: (LabOrdersResultOption1 | LabOrdersResultOption2)[]
}

export interface LabOrderResultsFormInput {
  labName?: SelectorOption
  assignedProvider?: SelectorOption
  accessionNumber?: string
  venderName?: string
  collectedDate?: string
  receivedDate?: string
  loinsCodeFields: LoinsCodeFields[]
};

export interface LabOrderResultsAttachmentInput {
  attachmentId: string
  attachmentName: string
  comments?: string
};

export interface LabOrderInput {
  orderNum: string
  status?: SelectorOption
};

export interface LabOrdersResultSubFormProps {
  index: number
  setResultsToRemove: Function
}

export interface CopayFields {
  copayId?: string
  copayType?: SelectorOption
  amount?: string
}

export interface InsuranceCreateInput {
  insuranceId?: SelectorOption
  orderOfBenefit?: SelectorOption
  patientRelationship?: SelectorOption
  certificationNumber?: string
  policyNumber?: string
  issueDate?: string
  expirationDate?: string
  copayFields?: CopayFields[]
  coInsurancePercentage?: string
  referringProvider?: SelectorOption
  primaryCareProvider?: SelectorOption
  pricingProductType?: SelectorOption
  notes?: string
  policyHolderId?: string
  employer?: string
  suffix?: string
  firstName?: string
  middleName?: string
  lastName?: string
  zipCode?: string
  address?: string
  addressCTD?: string
  city?: string
  state?: SelectorOption
  ssn?: string
  sex?: SelectorOption
  dob?: string
};

export interface MediaModalTypes extends DialogTypes {
  buttonText?: string;
  providerName?: string;
  itemId: string;
  title?: string;
  isProfile?: boolean;
  description?: string;
  preSignedUrl?: string;
  attachment?: Attachment;
  attachments?: Attachment[];
  imageModuleType: AttachmentType;
  reload: Function;
  setEdit: Function;
  setAttachments: Function;
  filesLimit?: number;
  attachmentMetadata?: any
}

export interface MediaCardsType {
  itemId: string;
  title?: string;
  button?: boolean;
  imageSide: string;
  buttonText?: string;
  hasCollage?: boolean;
  providerName?: string;
  hasHighlights?: boolean;
  notDescription?: boolean;
  moduleType: AttachmentType;
  attachmentData?: Attachment;
  reload: Function;
  filesLimit?: number;
  attachmentMetadata?: any
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
  button?: boolean;
  imageModuleType?: string;
  notDescription?: boolean;
  attachment?: Attachment;
  attachments?: Attachment[];
  allAttachments: Attachment[];
  setOpen: Function;
  setEdit: Function;
  setAttachment?: Function;
  setAttachments: Function;
  buttonText?: string;
}

export interface DocumentModalComponentType {
  setOpen: Function;
  isOpen: boolean;
}

type Days =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface DoctorScheduleModalProps extends GeneralFormProps {
  isOpen: boolean;
  reload: Function;
  doctorDispatcher: Dispatch<DoctorAction>;
  doctorFacilityId: string | undefined;
}

export interface PatientCardsProps extends GeneralFormProps {
  getPatientLoading: boolean;
  isEdit?: boolean
  dispatch?: Dispatch<PatientAction>
  state?: PatientState
  shouldShowBread?: boolean
  shouldDisableEdit?: boolean
}

export interface FacilityCardsProps extends GeneralFormProps {
  getFacilityLoading: boolean;
  dispatch?: Dispatch<FacilityAction>
  state?: FacilityState
  isSuper?: boolean
}

export interface PatientFormProps extends GeneralFormProps {
  shouldShowBread?: boolean
  shouldDisableEdit?: boolean
}

export interface AddPatientModalProps {
  isOpen: boolean;
  setIsOpen: Function;
  facilityId: string | undefined;
}

export interface AddDocumentModalProps extends GeneralFormProps {
  patientId: string;
  facilityId: string;
  patientName: string;
  attachmentId: string;
  attachment: AttachmentPayload['attachment'];
  submitUpdate: Function;
  fetchDocuments: Function;
  toggleSideDrawer: Function;
}

export interface CopayModalProps {
  isOpen: boolean;
  setIsOpen: Function;
  insuranceId?: string;
  billingStatus?: string
}

export interface FacilityScheduleModalProps extends GeneralFormProps {
  isOpen: boolean;
  reload: Function;
  facilityDispatcher: Dispatch<FacilityAction>;
  facilityId: string | undefined;
}

export interface DaySchedule {
  day: Days;
  slots: Schedule[];
}

export interface DoctorScheduleProps {
  schedule: Schedule;
  dispatcher: Dispatch<DoctorAction>;
}

export interface FacilityScheduleProps {
  schedule: Schedule;
  dispatcher: Dispatch<FacilityAction>;
}

export interface AppointmentsTableProps {
  doctorId?: string;
}

export interface AppointmentDatePickerProps {
  date: MaterialUiPickersDate;
  setDate: Dispatch<SetStateAction<MaterialUiPickersDate>>;
}

export type CustomPracticeInputProps = CreatePracticeItemInput &
  RegisterUserInputs & Pick<CreateContactInput, "city" | "address" | "address2" | "zipCode" | "email">
  & { facilityName: string } & { roleType: SelectorOption } & { country: SelectorOption }
  & { state: SelectorOption } & { isAdmin: boolean };

export interface PaymentProps {
  clientToken: string;
  amount: string;
  chargePayment: (token: string) => void;
}

export interface CountrySelectorInterface {
  countryLabel: string;
  stateLabel: string;
  countryName: string;
  stateName: string;
  cityName: string;
}

export interface PortalTableProps {
  inviteAccepted: boolean;
}

export type UpdateStatusInputProps = UpdateAppointmentInput & {
  appointmentStatus: SelectorOption;
};

export interface ColumnTypes {
  COL_1: string;
  COL_2: string;
  COL_3: string;
}

export interface ItemsTypes extends FieldsInputs {
  icon: ElementType;
}
export interface FormInitialType extends FieldsInputs {
  list: string;
}

export interface FormValuesTypes {
  id: string;
  col: number;
  name: string;
  fields: FieldsInputs[];
}

export interface SelectOptions {
  id: number;
  name: number;
}

export interface CustomSelectControlProps extends IControlLabel {
  controllerName: string;
  options: SelectOptions[];
}

export interface ItemSelectorProps extends SelectorProps {
  modalName: ITEM_MODULE;
  searchQuery?: string;
}

export interface FieldEditModalProps {
  open?: boolean;
  closeModalHandler?: () => void;
  setFieldValuesHandler: (values: any) => void;
  selected: FormInitialType;
}

export interface DropContainerPropsTypes {
  formState: FormBuilderState;
  changeValues: (id: string, item: FieldsInputs) => void;
  delFieldHandler: (id: number, index: number) => void;
  delColHandler: (index: number) => void;
  dispatch: Dispatch<FormBuilderAction>
}

export interface FormBuilderFormInitial {
  name: string;
  type: SelectorOption;
  facilityId: SelectorOption;
  practiceId: SelectorOption;
  isPractice: boolean;
}

export interface LoaderProps {
  open: boolean;
}

export interface FormBuilderPreviewProps {
  open: Boolean;
  closeModalHandler: () => void;
  data: SectionsInputs[];
  formName: string;
}

export interface FieldComponentProps {
  item: FieldsInputs;
  field?: ControllerRenderProps;
  isCreating?: boolean;
  facilityId?: string;
  practiceId?: string;
  state?: ExternalFormBuilderState;
  dispatcher?: Dispatch<PublicFormBuilderAction>;
  fieldState?: ControllerFieldState
}

export interface ShareModalTypes extends DialogTypes {
  title?: string;
  actionText?: string;
  description?: string;
  handleCopy: () => void;
}

export interface ConfirmModalTypes extends DialogTypes {
  title?: string;
  actionText?: string;
  description?: string;
  handleSave: () => void;
}
export interface SmartyUserData {
  street: string;
  address: string;
}

export interface SmartyModalComponentType {
  setOpen: Function;
  isOpen: boolean;
  data: usStreet.Candidate[];
  userData: SmartyUserData;
  verifiedAddressHandler: (
    deliveryLine1: string,
    zipCode: string,
    plus4Code: string,
    cityName: string
  ) => void;
}

export interface GetAddressResponse {
  zipCode: usZipcode.ZipCode;
  status: boolean;
  message: string;
}

export interface VerifyResponse {
  status: boolean;
  message: string;
  options: usStreet.Candidate[];
}

export interface AutoCompleteResponse {
  status: boolean;
  message: string;
  options: any;
}

export interface UserFormType {
  attachmentId: string;
  title: string;
  file: File;
}

export interface FormAttachmentPayload {
  attachment?: String | null | undefined;
  response?: ResponsePayloadResponse;
}

export interface FormMediaPreviewProps {
  open: Boolean;
  closeModalHandler: () => void;
  url: string;
  formId: string;
}

export interface UserFormPreviewModalProps {
  open: Boolean;
  closeModalHandler: () => void;
  formId: string;
  userForms: UsersFormsElements[];
  formLabels: FormElement[];
  imagePreviewHandler: (id: string) => void;
}

export interface RolesTableProps {
  customRole?: boolean
}

export interface CardLayoutProps {
  modal: CARD_LAYOUT_MODAL.Allergies | CARD_LAYOUT_MODAL.ICDCodes
  cardId: string;
  hasAdd?: boolean;
  cardTitle: string;
  isMenuOpen: boolean;
  children: ReactNode;
  filterTabs?: string[];
  searchLoading: boolean;
  disableAddIcon?: boolean;
  openSearch: HTMLElement | null;
  dispatcher: Dispatch<ChartAction>;
  searchComponent: ComponentType<any>;
  searchData: AllergiesPayload['allergies'] | IcdCodesPayload['icdCodes'];
  fetch: () => void;
  handleMenuClose: () => void;
  onClickAddIcon: (event: any) => void;
  onSearch: (tab: string, query: string) => void;
}

export interface AddModalProps {
  newAllergy?: string;
  allergyType?: string;
  isOpen?: boolean;
  isEdit?: boolean;
  recordId?: string;
  item?: Allergies | IcdCodes;
  dispatcher: Dispatch<ChartAction>;
  fetch: () => void;
}

export type CreatePatientAllergyProps = Pick<CreatePatientAllergyInput, | 'comments' | 'allergyStartDate'>
  & { reactionIds: multiOptionType[] } & { severityId: SelectorOption }

export type PatientProblemInputs = Pick<CreateProblemInput, | 'note' | 'problemStartDate'>
  & { appointmentId: SelectorOption } & { snowMedCodeId: SelectorOption }

export interface CreateTemplateTypes extends DialogTypes {
  title?: string;
  success?: boolean;
  actionText?: string;
  isLoading?: boolean;
  description?: string;
  handleDelete: () => void;
  dispatch: Dispatch<FormBuilderAction>
  formName: string
}

export interface AppointmentCardProps {
  tooltip: AppointmentTooltip.LayoutProps
  setCurrentView: Function
  setCurrentDate: Function
}

export interface ProfileEditFormType {
  firstName: string
  lastName: string
  email: string
  phone: string
  addressNumber: string
  city: string
  state: SelectorOption
  country: SelectorOption
  zipCode: string
  contactId: string
}

export interface RolePayloadInterface {
  id: string
  roles?: RolesPayload['roles']
}

export type multiOptionType = {
  value: string,
  label: string
}

export interface ReactionSelectorInterface {
  name: string
  label: string
  isEdit?: boolean;
  disable?: boolean
  isRequired?: boolean
  selectDisabled?: boolean
  selectedOptions?: string
  defaultValues?: multiOptionType[]
  margin?: MuiPropsTypes.Margin
  setFieldValue?: Function
}

export interface MediaDoctorDataType extends Message {
  doctor: Doctor;
}

export interface MediaStaffDataType extends Message {
  staff: Staff;
}

export interface MediaUserDataType extends Message {
  user: User;
}

export interface MediaPracticeDataType extends Message {
  practice: Practice;
}

export interface BackButtonProps {
  to: string;
}

export interface AppointmentsComponentProps {
  title: string;
  isMinWidth?: boolean;
}

export interface PatientSearchInputProps {
  dob: string;
  dos: string;
  location: SelectorOption;
  provider: SelectorOption;
}

export type TwoFactorInputProps = Omit<TwoFactorInput, "userId">;

export type VerifyCodeInputProps = Omit<VerifyCodeInput, "id">;

export interface OTPInputProps {
  value: number | string;
  onChange: any;
  numInputs: number;
  separator?: JSX.Element | undefined;
  isDisabled?: boolean | undefined;
  shouldAutoFocus?: boolean | undefined;
  hasErrored?: boolean | undefined;
  isInputNum?: boolean | undefined;
  containerStyle?: string | React.CSSProperties | undefined;
  inputStyle?: string | React.CSSProperties | undefined;
  focusStyle?: string | React.CSSProperties | undefined;
  disabledStyle?: string | React.CSSProperties | undefined;
  errorStyle?: string | React.CSSProperties | undefined;
}

export interface FilterSearchProps {
  tabs?: string[];
  loading: boolean;
  dispatcher: Dispatch<ChartAction>;
  modal: CARD_LAYOUT_MODAL.Allergies | CARD_LAYOUT_MODAL.ICDCodes;
  searchData: AllergiesPayload['allergies'] | IcdCodesPayload['icdCodes'];
  fetch: () => void;
  searchItem: (tab: string, query: string) => void;
}

export interface PatientProfileHeroProps {
  isChart?: boolean;
  isCheckIn?: boolean;
  setPatient: Function;
  setAttachmentsData: Function;
}

export interface DoctorProfileHeroProps {
  setDoctor: Function;
  setAttachmentsData: Function;
}

export interface VitalListingTableProps {
  patientVitals: PatientVitalsPayload['patientVitals'];
  patientStates: PatientState;
  setPatientVitals: Dispatch<SetStateAction<Maybe<Maybe<PatientVitals>[]> | undefined>>
  shouldDisableEdit?: boolean
}

export interface VitalFormInput {
  smokingStatus: SelectorOption
  respiratoryRate: string
  systolicBloodPressure: string
  diastolicBloodPressure: string
  oxygenSaturation: string
  PatientHeight: string
  PatientWeight: string
  PatientBMI: string
  PainRange: string
  pulseRate: string
  patientHeadCircumference: string
  patientTemperature: string
}

export interface AddPatientVitalsProps {
  fetchPatientAllVitals: Function;
  patientStates: PatientState;
  dispatcher: Dispatch<PatientAction>;
}

export interface PatientVitalsListingProps {
  patientStates: PatientState;
  dispatcher: Dispatch<PatientAction>;
  shouldDisableEdit?: boolean
}

export interface VitalsLabelsProps {
  patientStates: PatientState
}

export interface VitalListComponentProps {
  title: string;
  description: string;
  isError?: boolean
}

export interface SelectStringOptions {
  id: string;
  name: string;
}

export interface AutoLogoutInputTypes {
  autoLogoutTime: SelectStringOptions
}

export interface FormSidebarProps {
  formState: FormBuilderState;
  dispatch: Dispatch<FormBuilderAction>
}

export interface PredefinedComponentsProps {
  formState: FormBuilderState;
  dispatch: Dispatch<FormBuilderAction>
}

export type UpdateAttachmentDataInputs = Pick<UpdateAttachmentInput, 'attachmentName' | 'comments'>
  & { documentType: SelectorOption }

export type DocumentInputProps = UpdateAttachmentDataInputs
  & { provider: SelectorOption } & { date: string } & { patientName: string }

export interface PatientNoteModalProps {
  patientStates: PatientState;
  dispatcher: Dispatch<PatientAction>;
}
export interface PracticesTableProps {
  dispatch: Dispatch<PracticeAction>
}

export interface PieChartProps {
  practices?: PracticesPayload['practices']
}

export interface CalenderProps {
  showHeader?: boolean;
}

export type RenderListOptionTypes = SnoMedCodesPayload['snoMedCodes']
export type AchAccountType = 'personal' | 'business'

export interface AccountPaymentInputs {
  routingNumber: string;
  accountNumber: string
  accountType: SelectorOption
  businessName: string
  firstName: string
  lastName: string
  streetAddress: string
  locality: string
  region: SelectorOption
  postalCode: string,
  authority: boolean
}

export interface ACHPaymentComponentProps {
  token: string;
  dispatcher: Dispatch<ExternalPaymentAction>;
  states: ExternalPaymentState;
  moveNext: Function
}

export interface CheckboxControllerProps extends IControlLabel {
  controllerName: string;
  isHelperText?: boolean;
  autoFocus?: boolean;
  title?: string
}
export interface AppointmentListProps {
  appointments?: AppointmentsPayload['appointments'];
  type?: AppointmentStatus;
  reload?: Function;
  showHeader?: boolean;
};

export interface PatientProviderSelectorProps {
  patientId: string;
}

export interface SlotsComponentProps {
  facilityId: string;
  state?: ExternalFormBuilderState
}
export interface dashboardInputsProps {
  year: SelectorOption
}

export interface UpdatePatientProviderInputsProps {
  providerId: SelectorOption;
  speciality: SelectorOption;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relation: string;
  otherRelation?: string;
}

export interface CareTeamsProps {
  loading?: boolean;
  isEdit?: boolean;
  patientId?: string;
  doctorId?: string;
  doctorPatientId?: string;
  doctorName?: string;
  drawerOpened?: boolean;
  patientProvidersData?: PatientProviderPayload['providers']
  onEdit?: Function;
  reload?: Function;
  toggleSideDrawer?: Function;
  patientDispatcher?: Dispatch<PatientAction>
}

export interface SideDrawerProps {
  drawerOpened: boolean;
  toggleSideDrawer?: Function;
}

export interface PracticeChartProps {
  practiceId: string;
}

export interface AppointmentSlotsProps {
  facilityId?: string;
  providerId?: string;
  dispatcher: Dispatch<AppointmentAction>
}

export type StatusInputProps = { status: SelectorOption }

export interface PracticeDataProps {
  practiceData: PracticePayload['practice'];
}

export interface SwitchControllerProps extends IControlLabel {
  controllerName: string;
  isHelperText?: boolean;
  autoFocus?: boolean
}

export interface FormBuilderFacilitySelectorProps extends SelectorProps {
  patientId?: string
  practiceId: string
  dispatcher?: Dispatch<PublicFormBuilderAction>
  state?: ExternalFormBuilderState
}
export interface ChartComponentProps {
  shouldDisableEdit?: boolean
}

export interface BillingComponentProps extends GeneralFormProps {
  shouldDisableEdit?: boolean
  submitButtonText?: string
  labOrderNumber?: string
}

export interface CodeTypeInterface {
  icdCodes?: Code[]
  hcpcsCode?: Code[]
  customCode?: Code[]
  cptCode?: Code[]
}

export interface CodesTableProps {
  title: string
  tableData?: TableCodesProps[]
  shouldShowPrice?: boolean
}

export interface DocumentsTableProps {
  patient: PatientPayload['patient']
}
