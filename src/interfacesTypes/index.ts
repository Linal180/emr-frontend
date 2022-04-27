// packages block
import { ComponentType, Dispatch, ReactNode, ElementType, SetStateAction } from "react";
import { AppointmentTooltip } from "@devexpress/dx-react-scheduler-material-ui";
import { GridSize } from "@material-ui/core";
import { RouteProps } from "react-router-dom";
import { usStreet, usZipcode } from "smartystreets-javascript-sdk";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import {
  Control, ValidationRule, FieldValues, Ref, ControllerRenderProps,
} from "react-hook-form";
// graphql block
import { Action } from "../reducers/mediaReducer";
import { serviceAction } from "../reducers/serviceReducer";
import { Action as ChartAction } from "../reducers/chartReducer";
import { Action as DoctorAction } from "../reducers/doctorReducer";
import { Action as PatientAction } from "../reducers/patientReducer";
import { Action as FacilityAction } from "../reducers/facilityReducer";
import {
  LoginUserInput, User, UpdateContactInput, CreateScheduleInput, CreateAppointmentInput, Staff,
  UpdateFacilityItemInput, FacilitiesPayload, CreateContactInput, CreateDoctorItemInput, Gender,
  CreatePatientItemInput, ServicesPayload, CreateExternalAppointmentItemInput, CreatePracticeItemInput,
  CreateServiceInput, AllDoctorPayload, Attachment, AttachmentType, Patient, PatientsPayload, Schedule,
  UpdateAppointmentInput, AppointmentsPayload, RolesPayload, PermissionsPayload, SectionsInputs, Doctor,
  UpdateFacilityTimeZoneInput, PracticesPayload, CreateStaffItemInput, AttachmentsPayload, FieldsInputs,
  ResponsePayloadResponse, UsersFormsElements, FormElement, AllergiesPayload, ReactionsPayload,
  CreatePatientAllergyInput, Allergies
} from "../generated/graphql";

export interface PrivateRouteProps extends RouteProps {
  component: ComponentType<any>;
  permission?: string;
}

type Key = string | number | undefined;

export interface CloseSnackbarProps {
  id: Key;
}

export interface BackdropInputType {
  loading: boolean;
}

export interface CalendarChart {
  isCalendar: boolean;
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
  setGetCall: (call: boolean) => void
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
  practiceList: PracticesPayload["practices"];
  setPracticeList: Function;
  fetchAllPracticeList: Function;
  facilityList: FacilitiesPayload["facilities"];
  setFacilityList: Function;
  fetchAllFacilityList: Function;
  deletePracticeList: Function;
  deleteRoleList: Function;
  deleteFacilityList: Function;
  addPracticeList: Function;
  addRoleList: Function;
  addFacilityList: Function;
  updatePracticeList: Function;
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
  success?: boolean;
  actionText?: string;
  isLoading?: boolean;
  description?: string;
  handleDelete: () => void;
  learnMoreText?: string
}

export interface ConfirmationDaysTypes extends DialogTypes {
  title?: string;
  id?: string;
  isEdit?: boolean;
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

export interface SelectorProps {
  name: string
  label: string
  error?: string
  disabled?: boolean
  addEmpty?: boolean
  isRequired?: boolean
  isMultiple?: boolean
  value?: SelectorOption
  options: SelectorOption[]
}

export interface PatientSelectorProps {
  name: string
  label: string
  error?: string
  disabled?: boolean
  addEmpty?: boolean
  isRequired?: boolean
  isMultiple?: boolean
  value?: SelectorOption
  options: SelectorOption[]
  isModal?: boolean
  handlePatientModal?: Function
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

export type updatePasswordInputs = ResetPasswordInputs & {
  oldPassword: string;
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
  className?: string;
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
}

export interface TooltipData {
  name: string;
  format: string;
}


export interface SearchComponentProps {
  search: Function;
  info?: boolean;
  tooltipData?: TooltipData[]
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
  | "voiceCallPermission"
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

export type extendedContactInput = Omit<
  CreateContactInput,
  "facilityId" | "serviceCode" | "state"
> & { facilityId: SelectorOption } & { serviceCode: SelectorOption } & {
  state: SelectorOption;
};

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
}

export interface DropzoneImageType {
  ref?: Ref;
  itemId: string;
  title?: string;
  isEdit?: boolean;
  isProfile?: boolean;
  description?: string;
  attachmentId: string;
  isDisabled?: boolean;
  hasHighlight?: boolean;
  attachment?: Attachment;
  imageModuleType: AttachmentType;
  reload: Function;
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
  buttonText?: string;
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
}

export interface MediaCardsType {
  itemId: string;
  buttonText?: string;
  title?: string;
  button?: boolean;
  imageSide: string;
  hasCollage?: boolean;
  hasHighlights?: boolean;
  notDescription?: boolean;
  moduleType: AttachmentType;
  attachmentData?: Attachment;
  reload: Function;
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

export interface AddPatientModalProps {
  isOpen: boolean;
  setIsOpen: Function;
  facilityId: string | undefined;
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
  RegisterUserInputs &
  Pick<
    CreateContactInput,
    "city" | "address" | "address2" | "zipCode" | "email"
  > & { facilityName: string } & { roleType: SelectorOption } & {
    country: SelectorOption;
  } & { state: SelectorOption } & { isAdmin: boolean };

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

export interface DocumentTableProps {
  dispatcher: Dispatch<Action>;
  attachments: AttachmentsPayload["attachments"];
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
  info?: string;
  options: SelectOptions[];
}

export interface FieldEditModalProps {
  open?: boolean;
  closeModalHandler?: () => void;
  setFieldValuesHandler: (values: any) => void;
  selected: FormInitialType;
}

export interface DropContainerPropsTypes {
  formValues: FormValuesTypes[];
  changeValues: (id: string, item: FieldsInputs) => void;
  delFieldHandler: (id: number, index: number) => void;
  delColHandler: (index: number) => void;
  setFormValues: Dispatch<SetStateAction<SectionsInputs[]>>;
}

export interface FormBuilderFormInitial {
  name: string;
  type: SelectorOption;
  facilityId: SelectorOption;
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
}

export interface ShareModalTypes extends DialogTypes {
  title?: string;
  actionText?: string;
  description?: string;
  handleCopy: () => void;
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

export interface CardLayoutProps {
  cardId: string;
  hasAdd?: boolean;
  cardTitle: string;
  isMenuOpen: boolean;
  children: ReactNode;
  filterTabs: string[];
  searchLoading: boolean;
  disableAddIcon?: boolean;
  openSearch: HTMLElement | null;
  dispatcher: Dispatch<ChartAction>;
  searchComponent: ComponentType<any>;
  searchData: AllergiesPayload['allergies'];
  fetch: () => void;
  handleMenuClose: () => void;
  onClickAddIcon: (event: any) => void;
  onSearch: (tab: string, query: string) => void;
}

export interface AddModalProps {
  item?: Allergies;
  isEdit?: boolean;
  patientAllergyId?: string;
  dispatcher: Dispatch<ChartAction>;
  fetch: () => void;
}

export type CreatePatientAllergyProps = Pick<CreatePatientAllergyInput, | 'comments' | 'allergyStartDate'>
  & { reactionIds: SelectorOption } & { severityId: SelectorOption }

export interface CreateTemplateTypes extends DialogTypes {
  title?: string;
  success?: boolean;
  actionText?: string;
  isLoading?: boolean;
  description?: string;
  handleDelete: () => void;
  setFormName: Dispatch<SetStateAction<string>>
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
