// packages block
import { AppointmentTooltip } from "@devexpress/dx-react-scheduler-material-ui";
import { GridSize, PropTypes as MuiPropsTypes } from "@material-ui/core";
import { AutocompleteRenderInputParams } from "@material-ui/lab";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { ChangeEventHandler, ComponentType, Dispatch, ElementType, ReactNode } from "react";
import {
  Control, ControllerFieldState, ControllerRenderProps, FieldValues, UseFormReturn,
  ValidationRule
} from "react-hook-form";
import { RouteProps } from "react-router-dom";
import { usStreet, usZipcode } from "smartystreets-javascript-sdk";
// constants, reducers, graphql block
import { ATTACHMENT_TITLES, CONFIRMATION_MODAL_TYPE, ITEM_MODULE, TemplateType, UPFRONT_PAYMENT_TYPES } from "../constants";
import {
  AddVaccineInput, AddVaccineProductInput, AllDoctorPayload, Allergies, AppointmentPayload, AppointmentsPayload,
  AppointmentStatus, Attachment, AttachmentPayload, AttachmentType, BillingPayload, CodeType, Copay,
  CreateAppointmentInput, CreateContactInput, CreateCptCodeInput, CreateCptFeeScheduleInput, CreateCvxCodeInput,
  CreateDoctorItemInput, CreateExternalAppointmentItemInput, CreateFeeScheduleInput, CreateIcdCodeInput, CreateMacroInput, CreateMvxCodeInput, CreatePatientAllergyInput, CreatePatientItemInput, CreatePatientMedicationInput,
  CreatePracticeItemInput, CreateProblemInput, CreateRoomInput, CreateServiceInput, CreateStaffItemInput, Cvx, DependentQuestions,
  Doctor, DoctorPatient, FacilitiesPayload, FamilyHistory, FetchBillingClaimStatusesInput, FieldsInputs,
  FormElement, FormTabsInputs, IcdCodes, IcdCodesWithSnowMedCode, ImagingTest, LabTests, LabTestsPayload, LoginUserInput,
  LoincCodePayload, LoincCodes, Medications, Patient, PatientAllergies, PatientIllnessHistoryPayload, PatientMedication,
  PatientPayload, PatientProblems, PatientProviderPayload, PatientsPayload, PatientVitals, PermissionsPayload, PhysicalExamPayload, PolicyEligibilityWithPatientPayload, Practice, PracticePayload, QuestionAnswers, Questions, ReactionsPayload,
  ResponsePayloadResponse, ReviewOfSystemPayload, RolesPayload, Schedule, SectionQuestions, SectionsInputs, ServicesPayload,
  SingleScheduleInput, Staff, SurgicalHistory, TriageNotes, TriageNotesPayload, TwoFactorInput, UpdateAttachmentInput, UpdateContactInput, UpdateFacilityItemInput, UpdateFacilityTimeZoneInput, User, UsersFormsElements, VaccineProduct, VerifyCodeInput
} from "../generated/graphql";
import { Action as AppointmentAction, State as AppointmentState } from "../reducers/appointmentReducer";
import { Action as BillingAction, State as BillingState } from "../reducers/billingReducer";
import { Action as ChartAction } from "../reducers/chartReducer";
import { Action as cptCodeAction } from "../reducers/cptCodeReducer";
import { Action as CvxCodeAction } from "../reducers/cvxCodeReducer";
import {
  Action as PublicFormBuilderAction, State as ExternalFormBuilderState
} from "../reducers/externalFormBuilderReducer";
import {
  Action as ExternalPaymentAction, State as ExternalPaymentState
} from "../reducers/externalPaymentReducer";
import { Action as FacilityAction, State as FacilityState } from "../reducers/facilityReducer";
import { Action as FeeScheduleAction, State as FeeScheduleState } from '../reducers/feeScheduleReducer';
import { Action as FormBuilderAction, State as FormBuilderState } from "../reducers/formBuilderReducer";
import { Action as IcdCodeAction } from "../reducers/icdTenReducer";
import { Action as ImagingTestAction } from "../reducers/imagingTestReducer";
import { Action as InsuranceAction } from "../reducers/insuranceReducer";
import { Action as MacroAction } from "../reducers/macrosReducer";
import { Action, State as MediaState } from "../reducers/mediaReducer";
import { Action as MvxCodeAction } from "../reducers/mvxCodeReducer";
import { Action as NdcCodeAction } from "../reducers/ndcCodeReducer";
import { Action as PatientAction, State as PatientState } from "../reducers/patientReducer";
import { Action as PracticeAction } from "../reducers/practiceReducer";
import { Action as RoomAction } from "../reducers/roomReducer";
import { Action as ScheduleAction, State as ScheduleState } from "../reducers/scheduleReducer";
import { Action as VaccineProductAction } from "../reducers/vaccineProductReducer";
import { Action as VaccineAction } from "../reducers/vaccinesReducer";

export type Order = 'ASC' | 'DESC';
type Key = string | number | undefined;
export interface PrivateRouteProps extends RouteProps {
  component: ComponentType<any>;
  permission?: string;
}

export interface CloseSnackbarProps { id: Key }

export interface BackdropInputType {
  loading: boolean;
}

export interface AuthContextProps {
  user: User | null;
  profileUrl: string;
  isLoggedIn: boolean;
  userRoles: string[];
  practiceName: string;
  userPermissions: string[];
  currentStaff: Staff | null;
  currentDoctor: Doctor | null;
  currentUser: Doctor | Staff | null;
  profileAttachment: null | Attachment
  fetchUser: () => void
  logoutUser: () => void
  fetchAttachment: () => void,
  setProfileUrl: (url: string) => void;
  setUser: (user: User | null) => void;
  setUserRoles: (roles: string[]) => void;
  setPracticeName: (name: string) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setCurrentStaff: (staff: Staff | null) => void;
  setCurrentDoctor: (doctor: Doctor | null) => void;
  setUserPermissions: (permissions: string[]) => void;
  setCurrentUser: (user: Doctor | Staff | null) => void;
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

export type ReviewTabProps = {
  shouldShowAdd?: boolean
  shouldShowCheckout?: boolean
  handleStepChange?: Function
  shouldShowExamDetails?: boolean
  shouldDisableEdit?: boolean
}

export type UserSearchModalProps = {
  isOpen: boolean,
  handleModalClose?: () => void,
  handleAdd?: Function,
  itemId?: string
  setScribeItem?: Function
}

export type AppointmentReasonProps = {
  shouldShowAdd?: boolean
  isInTake?: boolean
  handleStep?: Function
  shouldDisableEdit?: boolean
  shouldShowCheckout?: boolean
  handleStepChange?: Function
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
  modalType?: CONFIRMATION_MODAL_TYPE;
  isSign?: boolean;
  success?: boolean;
  actionText?: string;
  isLoading?: boolean;
  description?: string;
  handleDelete: () => void;
  learnMoreText?: string
  aboutToText?: string
  isCalendar?: boolean;
  cancelText?: string;
  shouldDisplayCancel?: boolean
  onSignatureEnd?: (file: File | null) => void;
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
  saveBtn?: boolean;
  state?: PatientState;
  disableSubmit?: boolean;
  className?: string
  onSubmitClick?: Function
  saveBtnText?: string
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
  height?: number
  width?: string;
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

export interface SelectorOption {
  id: string;
  name: string | undefined | null;
  statusName?: string | undefined | null;
}

export interface ItemSelectorOption extends SelectorOption {
  serviceFee?: string
  code?: string
  description?: string
}

export interface CptCodeSelectorOption extends SelectorOption {
  description: string | undefined | null;
  shortDescription: string | undefined | null;
  longDescription: string | undefined | null;
}

export interface ModifiersSelectorOption extends SelectorOption {
  description: string | undefined | null;
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
  id?: string
  codeId?: string;
  code: string;
  description: string;
  price?: number;
  codeType?: CodeType;
  m1?: SelectorOption;
  m2?: SelectorOption;
  m3?: SelectorOption;
  m4?: SelectorOption;
  diag1?: string;
  diag2?: string;
  diag3?: string;
  diag4?: string;
  unit?: string
  diagPointer?: string
}

export type UpFrontPaymentTypeProps = {
  id?: string
  paymentType: UPFRONT_PAYMENT_TYPES,
  amount: number
  type: SelectorOption
  notes: string
  copayType?: SelectorOption
  dueAmount?: string
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
  focus?: boolean
  isEdit?: boolean
  loading?: boolean
  disabled?: boolean
  addEmpty?: boolean
  isRequired?: boolean
  isMultiple?: boolean
  value?: SelectorOption
  options?: SelectorOption[]
  margin?: MuiPropsTypes.Margin
  onBlur?: Function;
  onSelect?: (data: SelectorOption) => void;
  onOutsideClick?: Function;
  freeSolo?: boolean
}

export interface CPTCodesSelectorProps extends SelectorProps {
  valueSetter?: (inputs: CptCodeSelectorOption) => void
}

export interface ModifierSelectorProps extends SelectorProps {
  shouldShowLabel?: boolean
}

export interface PatientSelectorProps extends SelectorProps {
  styles?: string;
  isOpen?: boolean
  isModal?: boolean
  placeholder?: boolean
  handlePatientModal?: Function
  setValue?: Function;
  addNewPatientOption?: boolean
  shouldReset?: boolean
  setShouldReset?: Function
}

export interface FacilitySelectorProps extends SelectorProps {
  patientId?: string;
  filteredOptions?: SelectorOption[]
  placeHolder?: string
}

export type ChartingTemplateSelectorProps = ReactionSelectorInterface & {
  templateType?: string
  onSelect?: Function
  addEmpty?: boolean
  disabled?: boolean
}


export interface NdcSelectorProps extends SelectorProps {
  filteredOptions?: SelectorOption[]
  placeHolder?: string;
}

export interface VaccineProductNdcSelectorProps extends SelectorProps {
  filteredOptions?: SelectorOption[]
  placeHolder?: string;
  vaccineProductId: string
}

export type ImagingTestSelectorProps = Pick<SelectorProps, 'name' | 'label' | 'disabled' | 'isRequired' | 'addEmpty' | 'onSelect' | 'loading' | 'margin'> & {
  placeHolder?: string;
}

export type RoomSelectorProps = Pick<SelectorProps, 'name' | 'label' | 'disabled' | 'isRequired' | 'addEmpty' | 'onSelect' | 'loading' | 'margin'> & {
  placeHolder?: string;
}


export interface MvxSelectorProps extends SelectorProps {
  filteredOptions?: SelectorOption[]
  placeHolder?: string;
  mvxCode?: string
}

export type CvxSelectorProps = SelectorProps & {
  filteredOptions?: SelectorOption[]
  placeHolder?: string;
}

export interface PracticeSelectorProps extends SelectorProps {
  patientId?: string;
  isLabelDisplay?: boolean;
  handleFeeSchedule?: Function;
}

export interface DoctorSelectorProps extends FacilitySelectorProps {
  facilityId?: string
  shouldOmitFacilityId?: boolean
  careProviderData?: DoctorPatient[];
  defaultValues?: SelectorOption[]
  loading?: boolean
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

interface IControlLabel {
  info?: string;
  error?: string;
  loading?: boolean;
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
  controllerName: ResetPasswordControlTypes;
}

export type PasswordType = "password" | "text" | "ssn";

export interface IShowPasswordProps {
  passwordType: string;
  isPassword: boolean | undefined;
  handleShowPassword: () => void;
}

export type SubMenuTypes = {
  name: string;
  link: string | null;
};

export interface PhoneInputProps {
  label: string;
  error?: string;
  loading?: boolean;
  isRequired?: boolean;
  name: PhoneInputTypes;
  disabled?: boolean;
}

export interface CustomInputControlProps extends IControlLabel {
  info?: string;
  isSSN?: boolean;
  onBlur?: Function;
  onChange?: Function;
  notStep?: boolean;
  isSearch?: boolean;
  clearable?: boolean;
  autoFocus?: boolean;
  controllerName: string;
  defaultValue?: string;
  isHelperText?: boolean;
  isHtmlValidate?: boolean;
  endAdornment?: ReactNode;
  handleClearField?: (fieldName: any) => void;
  rows?: number;
  toLowerCase?: boolean
  toUpperCase?: boolean
}

export interface TooltipData {
  name: string;
  format: string;
}

export interface StepperData {
  title: string;
  completed?: boolean
}

export interface SearchComponentProps {
  text?: string;
  info?: boolean;
  placeHolder?: string;
  tooltipData?: TooltipData[]
  search: Function;
  submit?: Function;
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

export interface PickerProps {
  name: string;
  label: string;
  error?: string;
  format?: string;
  loading?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  defaultValue?: Date;
  isRequired?: boolean;
  disablePast?: boolean;
  disableFuture?: boolean;
  onSelect?: Function;
}

export type ParamsType = {
  id: string;
  facilityId?: string;
  templateId?: string;
  orderNum?: string;
  patientId?: string;
  tabValue?: string
  appointmentId?: string;
  testId?: string
  shouldProceed?: string
}

export type MacroViewTypes = {
  itemId: string;
  setItemId: Function;
  notes: string
  type: TemplateType
  handleNotesUpdate?: Function
}

export type ExtendedStaffInputProps = Omit<
  CreateStaffItemInput, "facilityId" | "roleType" | "gender" | "practiceId">
  & { facilityId: SelectorOption } & { practiceId: SelectorOption } & { roleType: SelectorOption }
  & { gender: SelectorOption } & { providerIds: SelectorOption };

export type ScheduleInputProps = Omit<SingleScheduleInput, "servicesIds" | "day">
  & { serviceId: multiOptionType[] | multiOptionType } & { day: SelectorOption[] | SelectorOption }
  & { recurringEndDate: string };

export type PatientChartingInfo = {
  patientAllergies: PatientAllergies[]
  patientInfo: Patient
  patientMedications: PatientMedication[]
  patientProblems: PatientProblems[]
  patientVitals: PatientVitals[]
  surgicalHistories: SurgicalHistory[]
  triageNotes: TriageNotes[]
  familyHistories: FamilyHistory[]
  reviewOfSystem: ReviewOfSystemPayload['reviewOfSystem']
  patientIllnessHistory: PatientIllnessHistoryPayload['patientIllnessHistory']
  physicalExam: PhysicalExamPayload['physicalExam']
}

export type PatientChartingReview = {
  patientAllergies: PatientAllergies[]
  patientMedications: PatientMedication[]
  patientProblems: PatientProblems[]
  patientVitals: PatientVitals[]
}

interface CustomBillingAddressInputs {
  billingFax: string;
  billingCity: string;
  billingPager: string;
  billingEmail: string;
  billingPhone: string;
  billingUserId: string;
  billingMobile: string;
  billingZipCode: string;
  billingCountry: string;
  billingAddress: string;
  billingAddress2: string;
  billingFacility: string;
  billingState: SelectorOption;
}

export type CustomFacilityInputProps = Omit<
  UpdateContactInput, "serviceCode" | "state">
  & Omit<UpdateFacilityItemInput, "practiceType" | "serviceCode" | "timeZone" | "practiceId" | "tamxonomyCode">
  & CustomBillingAddressInputs & { serviceCode: SelectorOption } & { practiceType: SelectorOption; } & { tamxonomyCode: SelectorOption; }
  & { timeZone: SelectorOption } & { state: SelectorOption }
  & { practice: SelectorOption };

export type CustomUpdateFacilityTimeZoneInputProps = Omit<UpdateFacilityTimeZoneInput, "timeZone">
  & { timeZone: SelectorOption } & { facilityId: SelectorOption };

export type DoctorInputProps = Omit<CreateDoctorItemInput, "facilityId" | "speciality" | "taxonomyCode">
  & Omit<CreateContactInput, "facilityId" | "state"> & CustomBillingAddressInputs
  & { facilityId: SelectorOption } & { speciality: SelectorOption } & { state: SelectorOption }
  & { taxonomyCode: SelectorOption };

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
  stepperData?: StepperData[];
  handleStep?: Function
}

interface BasicContactControlInputs {
  basicCity: string;
  basicEmail: string;
  basicPhone: string;
  basicMobile: string;
  basicAddress: string;
  basicCountry: string;
  basicZipCode: string;
  basicAddress2: string;
  basicState: SelectorOption;
}

interface EmergencyContactControlInputs {
  emergencyName: string;
  emergencyPhone: string;
  emergencyCity?: string;
  emergencyMobile: string;
  emergencyAddress?: string;
  emergencyZipCode?: string;
  emergencyCountry?: string;
  emergencyAddress2?: string;
  emergencyState?: SelectorOption;
  emergencyRelationship: SelectorOption;
}

interface KinContactControlInputs {
  kinName: string;
  kinPhone: string;
  kinMobile: string;
  kinRelationship: SelectorOption;
}

interface GuardianContactControlInputs {
  guardianName: string;
  guardianSuffix: string;
  guardianLastName: string;
  guardianFirstName: string;
  guardianMiddleName: string;
  guardianRelationship: SelectorOption;
}

interface GuarantorContactControlInputs {
  guarantorDob: string;
  guarantorSsn: string;
  guarantorCity: string;
  guarantorEmail: string;
  guarantorPhone: string;
  guarantorSuffix: string;
  guarantorCountry: string;
  guarantorAddress: string;
  guarantorZipCode: string;
  guarantorLastName: string;
  guarantorAddress2: string;
  guarantorFirstName: string;
  guarantorMiddleName: string;
  guarantorEmployerName: string;
  guarantorState: SelectorOption;
  guarantorRelationship: SelectorOption;
}

interface EmployerControlInputs {
  employerCity: string;
  employerName: string;
  employerEmail: string;
  employerPhone: string;
  employerZipCode: string;
  employerAddress: string;
  employerIndustry: string;
  employerState: SelectorOption;
  employerCountry: string;
  employerUsualOccupation: string;
}

interface RegisterUserInputs {
  userEmail: string;
  userPhone: string;
  userZipCode: string;
  userLastName: string;
  userPassword: string;
  userFirstName: string;
}

export type PatientInputProps = BasicContactControlInputs &
  EmergencyContactControlInputs &
  KinContactControlInputs &
  GuardianContactControlInputs &
  GuarantorContactControlInputs &
  EmployerControlInputs &
  RegisterUserInputs &
  Omit<CreatePatientItemInput, | "gender" | "race" | "genderIdentity"
    | "maritialStatus" | "sexAtBirth" | "pronouns" | "ethnicity" | "sexualOrientation"
    | "facilityId" | "usualProviderId" | "sexualOrientation" | "genderIdentity" | "homeBound" | "language">
  & { usualProviderId: SelectorOption } & { gender: SelectorOption }
  & { race: SelectorOption; } & { sexualOrientation: SelectorOption }
  & { sexualOrientation: SelectorOption; } & { pronouns: SelectorOption }
  & { ethnicity: SelectorOption } & { facilityId: SelectorOption; }
  & { genderIdentity: SelectorOption } & { sexAtBirth: SelectorOption }
  & { homeBound: boolean; } & { genderIdentity: SelectorOption }
  & { maritialStatus: SelectorOption } & { language: SelectorOption };

export type ExternalPatientInputProps = {
  preferredCommunicationMethod: SelectorOption;
} & { providerId: SelectorOption } & { state: SelectorOption } & {
  country: SelectorOption;
} & { emergencyCountry: SelectorOption } & {
  emergencyState: SelectorOption;
} & Pick<
  CreatePatientItemInput,
  | "pharmacy"
  | "phoneEmailPermission"
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

export type PatientTriageNotesInputProps = {
  notes: string
}

export type ExtendedAppointmentInputProps = Omit<
  CreateAppointmentInput,
  "patientId" | "facilityId" | "serviceId" | "providerId"
> & { facilityId: SelectorOption } & { patientId: SelectorOption } & {
  serviceId: multiOptionType;
} & { providerId: SelectorOption };

export type ExtendedExternalAppointmentInputProps = Pick<
  CreateExternalAppointmentItemInput,
  "scheduleEndDateTime" | "scheduleStartDateTime"
> & { serviceId: multiOptionType } & { providerId: SelectorOption } & Pick<
  CreatePatientItemInput,
  "firstName" | "lastName" | "email" | "dob"
> & { phone: string } & { sexAtBirth: SelectorOption } & { signature: File | null };

export type extendedServiceInput = Omit<CreateServiceInput, "facilityId">;

export interface GeneralFormProps {
  id?: string;
  isEdit?: boolean;
  loading?: boolean;
}

export interface AutocompleteTextFieldProps {
  params: AutocompleteRenderInputParams;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  invalid: boolean
  loading: boolean
  placeHolder?: string
}

export interface EligibilityTableComponentProps extends GeneralFormProps {
  appointmentId?: string
}

export interface NoDataComponentProps {
  message?: string
}

export interface CoverageDetailsHeaderProps {
  patient: PolicyEligibilityWithPatientPayload['patient'] | undefined
  policyHolder: PolicyEligibilityWithPatientPayload['policyHolder'] | undefined
  primaryProvider: PolicyEligibilityWithPatientPayload['primaryProvider'] | undefined
  policyEligibility: PolicyEligibilityWithPatientPayload['policyEligibility'] | undefined
}

export type ViewerProps = {
  isOpen: boolean
  handleClose: () => void
}
export type DocumentViewerProps = ViewerProps & {
  url: string
  title?: string
}

export type ChartSelectionViewerProps = ViewerProps & {
  modulesToPrint: string[]
  setModulesToPrint: Function
  setIsChartPdfModalOpen: Function
}

export type ChartPrintModalProps = ViewerProps & {
  modulesToPrint: string[]
}

export type VisitModalProps = ViewerProps & {
  appointmentInfo: AppointmentPayload['appointment']
}

export type VisitModalPdfProps = {
  assessmentProblems: AssessmentProblemType[]
  reviewOfSystem: ReviewOfSystemPayload['reviewOfSystem']
  physicalExam: PhysicalExamPayload['physicalExam']
  patientIllnessHistory: PatientIllnessHistoryPayload['patientIllnessHistory']
  patientChartingReview: PatientChartingReview | null
  triageNotes: TriageNotesPayload['triageNotes']
  appointmentInfo: AppointmentPayload['appointment']
}

export type LabModalProps = ViewerProps & {
  labTests: LabTestsPayload['labTests']
}

export type PastAndUpcomingAppointmentListProps = {
  past?: boolean
  appointments: AppointmentsPayload['appointments'];
  reload?: Function;
};

export type AreYouSureModalProps = ViewerProps & {
  handleSubmit?: Function
  content?: string
}

export interface InsuranceCardsProps {
  isOpen: boolean
  handleClose: () => void
  policyId?: string
  setPolicyCardId?: Function
}

export interface AddAllergyModalProps extends GeneralFormProps {
  isOpen?: boolean
  handleModalClose: () => void
  fetch?: () => void
}

export type AddMedicationModalProps = {
  isOpen?: boolean
  handleModalClose: () => void
  fetch?: () => void
  handleAdd?: Function
  alreadyAddedMedications?: string[]
}

export type DiagnosesModalModalProps = {
  isOpen?: boolean
  handleModalClose: () => void
  fetch?: () => void
  handleAdd?: (item: Medications | ImagingTest | LoincCodes, type: AddDiagnoseType) => void
  alreadyAddedMedications?: string[]
}

export interface AddAppointmentReasonProps extends GeneralFormProps {
  isOpen?: boolean
  handleModalClose: () => void
  fetch?: () => void,
  title?: string
  handleAdd?: Function
  alreadyAddedProblems?: string[]
  searchPlaceholder?: string
}

export type AddVaccineProps = GeneralFormProps & {
  isOpen?: boolean
  handleModalClose: () => void
  fetch?: () => void
}

export interface TableSelectorProps {
  title: string
  shouldShowPrice?: boolean
  moduleName: ITEM_MODULE.cptFeeSchedule | ITEM_MODULE.icdCodes
  feeScheduleId?: string
}

export type UpFrontPaymentTypeCompProps = {
  moduleName: UPFRONT_PAYMENT_TYPES
  shouldDisableEdit?: boolean
  copays?: Copay[]
}

export interface PolicyCardProps extends GeneralFormProps {
  handleReload?: Function
  filteredOrderOfBenefitOptions?: SelectorOption[]
  setPolicyToEdit?: Function
  refetch?: Function
}

export interface CheckInComponentProps {
  appointmentState: AppointmentState,
  appointmentDispatcher: Dispatch<AppointmentAction>
  handleStep: Function
  shouldDisableEdit?: boolean
  activeStep?: number
  handleProceed?: Function
}

export interface PolicyAttachmentProps {
  policyId?: string
  numberOfFiles: number
  dispatch: Dispatch<InsuranceAction>
  handleReload: Function
}

export interface LabOrderCreateProps {
  appointmentInfo?: SelectorOption
  handleStep?: Function
  shouldDisableEdit?: boolean
  toggleSideDrawer?: Function
  isEdit?: boolean
  labTestsToEdit?: LabTests[]
  orderNumber?: string;
  setCurrentTest?: Function
  fetchData?: Function
}

export interface LabOrdersTableProps {
  appointmentInfo?: SelectorOption
  shouldDisableEdit?: boolean
  handleStep?: Function
}

export interface LabOrderInitialScreenProps extends LabOrderCreateProps {
  setTestsToRemove?: Function
}

export interface LabTestComponentProps {
  currentTest: number
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
  [ITEM_MODULE.icdCodes]: TableCodesProps[]
  [ITEM_MODULE.cptFeeSchedule]: TableCodesProps[]
  serviceDate: string
  claimDate: string
  servicingProvider: SelectorOption
  renderingProvider: SelectorOption
  claimStatus: SelectorOption
  facility: SelectorOption
  pos: SelectorOption
  uncoveredAmount: string
  to?: string
  from?: string
  practice: string
  feeSchedule: SelectorOption
}

export type CreateUpFrontPayment = {
  [UPFRONT_PAYMENT_TYPES.Copay]: UpFrontPaymentTypeProps[]
  [UPFRONT_PAYMENT_TYPES.Additional]: UpFrontPaymentTypeProps[]
  [UPFRONT_PAYMENT_TYPES.Previous]: UpFrontPaymentTypeProps[],
  totalCharges: string
  cptCodesAmount: string
  expected: string
  balance: string
  paid: string
  adjustments: string
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

export interface DropzoneImageType {
  itemId: string;
  title: string;
  isEdit?: boolean;
  filesLimit?: number;
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
  setFiles?: Function
  numberOfFiles?: number;
  cameraOpen: boolean
  setCameraOpen: (open: boolean) => void;
  onUploading?: (open: boolean, error?: string) => void
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
  diagnosesIds: multiOptionType[]
}

export interface LabOrdersCreateFormInput {
  appointment?: SelectorOption,
  labTestStatus?: SelectorOption,
  diagnosesIds: multiOptionType[]
  testField: SelectorOption
  testFieldValues: TestOption[]
  referringProviderId?: SelectorOption
  primaryProviderId?: SelectorOption
  providerNotes?: string
  orderNum?: string
  accessionNumber?: string
};

export type AssessmentMedication = Omit<Medications, 'patientMedications' | "__typename"> & {
  medicationId: string
  patientMedicationId?: string
  isSigned: boolean
}

export type AssessmentTest = LoincCodePayload['loincCode'] & {
  testId: string
  patientTestId?: string
  isSigned: boolean
}

export type AssessmentImagingOrder = ImagingTest & {
  testId: string
  patientTestId?: string
  isSigned: boolean
}

export type AssessmentProblemType = {
  problemId: string
  isSigned: boolean
  forOrders: boolean
  notes?: string
  icdCodes: {
    id: string,
    code: string,
    description: string
    snoMedCodeId: string
  },
  medications?: AssessmentMedication[]
  tests?: AssessmentTest[]
  imagingOrders?: AssessmentImagingOrder[]
}

export type AssessmentProblems = {
  problems: AssessmentProblemType[]
}

export type AssessmentPlanProblemsProps = {
  fetchProblems: Function
  assessmentProblems: AssessmentProblemType[]
  setAssessmentProblems: Function
  shouldDisableEdit?: boolean
  isSigned?: boolean
  notes?: string
  setNotes?: Function
}

export type AssessmentPlanMedicationProps = {
  index: number,
  problem: AssessmentProblemType
  assessmentProblems: AssessmentProblemType[]
  setAssessmentProblems: Function
  shouldDisableEdit?: boolean
  isSigned?: boolean
}

export type SignOffProps = {
  handleStepChange: Function
  appointmentInfo?: AppointmentPayload['appointment']
}

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
  isCovid: boolean
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

export interface ClaimStatusFields {
  statusName?: string
}

export type TemplateQuestionCardType = {
  question: SectionQuestions,
  handleSubmit?: Function,
  shouldDisableEdit?: boolean
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
  dob?: string,
  homeBound: string

};

export interface MediaModalTypes extends DialogTypes {
  buttonText?: string;
  providerName?: string;
  itemId: string;
  title: string;
  isProfile?: boolean;
  description?: string;
  preSignedUrl?: string;
  attachment?: Attachment;
  attachments?: Attachment[];
  imageModuleType: AttachmentType;
  reload: Function;
  setEdit: Function;
  setAttachments: Function;
  btnType?: "button" | "reset" | "submit" | undefined;
  filesLimit?: number;
  attachmentMetadata?: any
}

export interface MediaCardsType {
  itemId: string;
  title: string;
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
  btnType?: "button" | "reset" | "submit" | undefined;
  filesLimit?: number;
  attachmentMetadata?: any,
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

export type MediaCardComponentType = {
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

export interface PatientCardsProps extends GeneralFormProps {
  getPatientLoading: boolean;
  isEdit?: boolean
  dispatch?: Dispatch<PatientAction>
  state?: PatientState
  shouldShowBread?: boolean
  shouldDisableEdit?: boolean
  disableSubmit?: boolean
  loading?: boolean
  isAppointment: boolean
  refetch?: Function
}

export interface InsuranceSelectionProps extends GeneralFormProps {
  shouldShowBread?: boolean
  shouldDisableEdit?: boolean
  setSelection?: Function
  selection?: string
  dispatch?: Dispatch<PatientAction>
  state?: PatientState
}

export interface FacilityCardsProps extends GeneralFormProps {
  isEdit?: boolean
  isSuper?: boolean
  state?: FacilityState
  getFacilityLoading: boolean;
  dispatch?: Dispatch<FacilityAction>
}

export interface PatientFormProps extends GeneralFormProps {
  shouldShowBread?: boolean
  shouldDisableEdit?: boolean
  isAppointment?: boolean
  refetch?: Function
}

export type UpFrontPaymentProps = {
  cptCodes?: TableCodesProps[],
  handleStep?: Function
  shouldDisableEdit?: boolean
  setPrice?: (price: string | undefined) => void
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
  dispatch?: Dispatch<Action>
  state?: MediaState
}

export interface CopayModalProps {
  isOpen: boolean;
  setIsOpen: Function;
  insuranceId?: string;
  billingStatus?: string
}

export interface RejectedModalProps {
  isOpen: boolean;
  setIsOpen: Function;
  handleClose?: () => void;
  billingClaim: BillingPayload['billing'] | null
}

export type ClaimErrorModalProps = {
  isOpen: boolean;
  setIsOpen: Function;
  handleClose?: () => void;
  errorMessages?: string[]
}

export interface ClaimStatusModalProps extends GeneralFormProps {
  isOpen: boolean;
  setIsOpen: Function;
  setEditId: Function;
  refetch: Function
}

export interface CheckoutModalProps {
  isOpen: boolean;
  setIsOpen: Function;
  insuranceId?: string;
  billingStatus?: string
  handleSubmit: Function
}

export interface RejectedModalProps {
  isOpen: boolean;
  setIsOpen: Function;
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

export interface AppointmentDatePickerProps {
  date: MaterialUiPickersDate;
  setDate: (date: MaterialUiPickersDate) => void
}

export type CustomPracticeInputProps = Omit<CreatePracticeItemInput, "taxonomyCodeId"> &
  RegisterUserInputs & Pick<CreateContactInput, "city" | "address" | "address2" | "zipCode"
    | "email" | "country"> & { facilityName: string } & { roleType: SelectorOption }
  & { state: SelectorOption } & { isAdmin: boolean } & { taxonomyCodeId: SelectorOption };

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

export interface PortalCardProps {
  inviteAccepted: boolean;
}

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
  filteredOptions?: SelectorOption[]
  shouldFilter?: boolean
  practiceId?: string
  feeScheduleId?: string
  noCodeRenderer?: boolean
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
  dispatch: Dispatch<FormBuilderAction>
}

export interface FormBuilderFormInitial {
  name: string;
  isPractice: boolean;
  type: SelectorOption;
  facilityId: SelectorOption;
  practiceId: SelectorOption;
}

export interface LoaderProps {
  open: boolean;
}

export interface FormBuilderPreviewProps {
  open: Boolean;
  closeModalHandler: () => void;
  data: FormTabsInputs[];
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
  documentAttachment?: Attachment | undefined
  documentType?: ATTACHMENT_TITLES
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
  handleSave?: () => void;
  shouldShowSave?: boolean
}
export interface SmartyUserData {
  street: string;
  address: string;
}

export interface FacilityBillingType {
  billingFax: string;
  billingCity: string;
  billingPhone: string;
  billingEmail: string;
  billingState: string;
  billingAddress: string;
  billingZipCode: string;
  billingCountry: string;
  billingAddress2: string;
}

export interface ClaimFeedAdvanceSearchProps {
  claimFeedFacilityName: SelectorOption
  claimFeedPatientName: SelectorOption
  claimFeedPayerId: SelectorOption
  claimFeedFromDate?: string | null
  claimFeedToDate?: string | null
}

export interface ClaimFeedAdvanceSearchInputProps {
  claimFeedFacilityName: string
  claimFeedPatientName: string
  claimFeedPayerId: string
  claimFeedFromDate?: string | null
  claimFeedToDate?: string | null
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

export interface AddModalProps {
  newAllergy?: string;
  newProblem?: string
  allergyType?: string;
  isOpen?: boolean;
  isEdit?: boolean;
  recordId?: string;
  item?: Allergies | Medications | IcdCodesWithSnowMedCode | IcdCodes | SurgicalCode | Cvx;
  dispatcher: Dispatch<ChartAction>;
  fetch: () => void;
  handleClose?: () => void
}

export type VaccineModalProps = {
  newAllergy?: string;
  allergyType?: string;
  isOpen?: boolean;
  isEdit?: boolean;
  recordId?: string;
  item?: VaccineProduct;
  dispatcher: Dispatch<VaccineAction>;
  fetch: () => void;
  handleClose?: () => void
}


export type CreatePatientAllergyProps = Pick<CreatePatientAllergyInput, | 'comments' | 'allergyStartDate' | 'isActive'>

export type PatientProblemInputs = Pick<CreateProblemInput, | 'note' | 'problemStartDate'>
  & { appointmentId: SelectorOption } & { snowMedCodeId: SelectorOption }

export type PatientMedicationInputs = Pick<CreatePatientMedicationInput, "status" | "sig" | "note" | "startDate" | "stopDate" | "takeAmount" | "noOfDays">
  & { stopReason: SelectorOption } & { tabletUnit: SelectorOption } & { timeDuration: SelectorOption }
  & { structured: boolean } & { oralRoute: SelectorOption };

export type PatientVaccineFormType = Pick<
  AddVaccineInput,
  'administerBy' | 'administrationDate' | 'amount' | 'expiryDate' | 'lotNo' | "visDate" | 'visGiven'>
  & {
    mvx: SelectorOption, ndc: SelectorOption, route: SelectorOption, site: SelectorOption,
    units: SelectorOption
  }

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

export type SurgicalCode = {
  code: string
  description: string
  codeType: string
}

export interface AppointmentCardProps {
  tooltip: AppointmentTooltip.LayoutProps
  setCurrentView: Function
  setCurrentDate: Function,
  reload: Function,
  appOpen: boolean
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

export interface ServiceSelectorInterface extends ReactionSelectorInterface {
  facilityId?: string
  isMulti?: boolean
  shouldEmitFacilityId?: boolean,
  loading?: boolean
  onSelect?: Function
  userOptions?: multiOptionType[]
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

export interface EligibilitySearchInputProps {
  insurance: SelectorOption
}

export interface DoctorSearchInputProps {
  speciality: SelectorOption
  facilityId: SelectorOption
}


export type TwoFactorInputProps = Omit<TwoFactorInput, "userId">;
export type VerifyCodeInputProps = Omit<VerifyCodeInput, "id">;

export interface PatientProfileHeroProps {
  isChart?: boolean;
  isCheckIn?: boolean;
  setPatient: Function;
  setAttachmentsData: Function;
  patientProvidersData?: PatientProviderPayload['providers']
}

export interface AppointmentsTableProps {
  doctorId?: string;
}

export interface DoctorProfileHeroProps {
  setDoctor: Function;
  setAttachmentsData: Function;
}

export interface VitalListingTableProps {
  loading?: boolean;
  shouldDisableEdit?: boolean
  patientStates: PatientState;
  dispatcher: Dispatch<PatientAction>;
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
  vitalsDate: string
}

export interface AddPatientVitalsProps extends GeneralFormProps {
  fetchPatientAllVitals: Function;
  patientStates: PatientState;
  dispatcher: Dispatch<PatientAction>;
  handleClose?: () => void
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
  practices?: number
}

export interface CalenderProps {
  showHeader?: boolean;
}

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

export type ACHPaymentComponentProps = {
  token: string;
  moveNext?: Function;
  states: ExternalPaymentState;
  formState?: ExternalFormBuilderState;
  dispatcher: Dispatch<ExternalPaymentAction>;
  formDispatch?: Dispatch<PublicFormBuilderAction>;
}

export interface CheckboxControllerProps extends IControlLabel {
  title?: string;
  loading?: boolean
  defaultValue?: boolean;
  autoFocus?: boolean;
  isHelperText?: boolean;
  controllerName: string;
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
  providerId?: string
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
  patientDispatcher?: Dispatch<PatientAction>;
  providerBtn?: boolean;
  isEditable?: boolean
}

export type SideDrawerCloseReason = "backdropClick" | "escapeKeyDown";

export interface SideDrawerProps {
  drawerOpened: boolean;
  toggleSideDrawer?: Function;
  sideClickClose?: boolean
}

export interface PracticeChartProps {
  practiceId: string;
}

export interface AppointmentSlotsProps {
  facilityId?: string;
  providerId?: string;
  dispatcher: Dispatch<AppointmentAction>
}

export type StatusInputProps = {
  appointmentDate: string
  status: SelectorOption
  facilityId?: string
  serviceId?: multiOptionType
}

export interface PracticeDataProps {
  loading: boolean;
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
  status?: string;
  fetchAppointment?: Function
  appointmentInfo?: SelectorOption
  labOrderHandler?: Function
  isInTake?: boolean
  appointmentState?: AppointmentState
}

export type TriageNoteProps = {
  shouldDisableEdit?: boolean
  isInTake?: boolean
  handleStep?: Function
}

export type VitalTabProps = {
  shouldDisableEdit?: boolean
  isInTake?: boolean
  handleStep?: Function
  setShouldRefetch?: Function
}

export type ProblemTabProps = VitalTabProps & {}

export type AllergyTabProps = VitalTabProps & {}

export type MedicationTabProps = VitalTabProps & {}

export type SurgicalTabProps = VitalTabProps & {}

export interface BillingComponentProps extends GeneralFormProps {
  shouldDisableEdit?: boolean
  submitButtonText?: string
  labOrderNumber?: string
  refetch?: Function
}

export interface BillingFormProps extends BillingComponentProps {
  methods: UseFormReturn<CreateBillingProps, any>,
  onSubmit: (values: CreateBillingProps) => void
  createBillingLoading: boolean
  createClaimCallback: Function
  dispatch: Dispatch<BillingAction>
  state: BillingState
  claimNumber: string
  createClaimLoading: boolean
  refetch?: Function
}

export interface CodesTableProps {
  title: string
  tableData?: TableCodesProps[]
  shouldShowPrice?: boolean
}

export interface DocumentsTableProps {
  patient: PatientPayload['patient']
}

export interface TabPropertiesTypes {
  name: string;
}

export interface TabPropertiesProps {
  formState: FormBuilderState;
  dispatch: Dispatch<FormBuilderAction>
}

export interface StepContextProps {
  state: ExternalFormBuilderState;
  dispatch: Dispatch<PublicFormBuilderAction>
  sections: SectionsInputs[]
}

export interface DoctorPatientsProps {
  providerId?: string;
  facilityId?: string;
  setPatientCount?: Function;
}

export interface StageStatusType {
  stage: string;
  stageColor: string;
}

export interface ServiceSelectorProps extends FacilitySelectorProps {
  facilityId?: string
  shouldOmitFacilityId?: boolean
  careProviderData?: DoctorPatient[];
  defaultValues?: SelectorOption[]
  dispatcher?: Dispatch<PublicFormBuilderAction>
}

export interface CreateAgreementFormProps {
  title?: string
  agreementBody?: string
}

export interface ScheduleFormProps {
  id: string;
  isOpen: boolean;
  isEdit?: boolean;
  isDoctor?: boolean;
  state: ScheduleState;
  doctorFacilityId?: string;
  scheduleDispatch?: Dispatch<ScheduleAction>;
  reload: Function;
}

export interface ScheduleListingProps {
  isDoctor?: boolean;
  doctorId?: string;
  typeId?: string;
  doctorFacilityId?: string;
}

export interface ScheduleBoxProps {
  isDoctor?: boolean;
  schedule: Schedule;
  dispatcher: Dispatch<ScheduleAction>;
}

export interface FormDoctorSelectorProps extends FacilitySelectorProps {
  facilityId?: string
  defaultValues?: SelectorOption[]
  formState?: ExternalFormBuilderState;
  formDispatch?: Dispatch<PublicFormBuilderAction>
}

export type SignatureProps = {
  onSignatureEnd: (file: File | null) => void,
  controllerName: string;
  title?: string;
  isController?: boolean;
}

export interface EncounterPros {
  appointments: AppointmentsPayload['appointments']
}

export interface LogsPatientSelectorProps extends SelectorProps {
  styles?: string;
  isOpen?: boolean
  isModal?: boolean
  placeholder?: boolean
  handlePatientModal?: Function
  setValue?: Function
}

export type AuditLogsInputs = {
  endDate: string;
  startDate: string;
  user: SelectorOption;
  patient: SelectorOption;
  module: SelectorOption;
};

export type CreateFeeSchedule = Omit<CreateFeeScheduleInput, 'practiceId'> & { practiceId: SelectorOption }

export type CreateCptFeeSchedule = Omit<CreateCptFeeScheduleInput, 'code' | 'modifier'>
  & { code: CptCodeSelectorOption, modifier: SelectorOption }

export interface DoctorAppointmentsAndPatientsProps {
  patientId?: string;
  providerId?: string;
  setCount?: Function;
}

export interface FeeScheduleFormProps {
  state: FeeScheduleState;
  dispatcher: Dispatch<FeeScheduleAction>
  reload?: Function;
}

export interface CptFeeScheduleFormProps extends FeeScheduleFormProps {
  id: string;
}

export type ClaimStatusForm = Omit<FetchBillingClaimStatusesInput, 'paginationOptions' | 'facilityId' | 'patientId' | 'claimStatusId'> & {
  facility: SelectorOption, patient: SelectorOption, claimStatus: SelectorOption
}

export type SendSMSFormType = {
  mobile: string,
  message: string,
  template: SelectorOption,
}

export type ShortUrlFormType = {
  longUrl: string
}

export type SelfPayComponentProps = {
  state: BillingState;
  onCloseHandler: (open: boolean) => void
  isOpen: boolean;
  checkOutHandler: Function
}

export type CameraComponentProps = {
  sendFile: (blob: File | null | undefined) => void;
  invisibleHandler: (open: boolean) => void;
  open: boolean
}

export type CameraModalProps = {
  open: boolean;
}

export type AppointmentPaymentType = {
  lastFour: string;
  paymentType: string;
}

export type InsuranceComponentProps = {
  patientId?: string;
  viewInsuranceBtn?: boolean;
  shouldDisableEdit?: boolean;
  showAddInsuranceBtn?: boolean;
  showEditInsuranceBtn?: boolean;
  refetch?: Function
}

export type ItemSelectForwardRef = {
  resetSearchQuery: () => void,
}

export type FamilyHistoryProps = {
  shouldDisableEdit?: boolean
  handleStep?: Function
}

export type FamilyHistoryFormProps = {
  isOpen: boolean
  handleClose: (open: boolean) => void
  id?: string;
  isEdit?: boolean
  fetchFamilyHistory?: Function
}

type FamilyRelativeArrayFields = {
  id: string
  relative: SelectorOption
  onsetAge: string;
  died: string;
  notes: string;
}

export type SocialSwitchCardPropsType = {
  title: string;
  notesName: string;
  switchName: string;
  isDependentQ?: boolean
}

export type SocialInputCardPropsType = {
  title: string;
  notesName: string;
  inputName: string;
  inputFieldType?: string
  notStep?: boolean
  isDependentQ?: boolean
}

export type SocialSelectorCardPropsType = {
  title: string;
  notesName: string;
  selectorName: string;
  selectorOptions: SelectorOption[];
  isDependentQ?: boolean
}

export type FamilyHistoryFormType = {
  problem: SelectorOption;
  familyRelative: FamilyRelativeArrayFields[]
}

export type SocialHistoryProps = {
  shouldDisableEdit?: boolean
  handleStep?: Function
}

export type PatientHistoryProps = {
  shouldDisableEdit?: boolean
  handleStep?: Function
}


export type LatestVitalCardProps = {
  patientId: string
  shouldRefetch?: boolean
  setShouldRefetch?: Function
}

export type VaccinesProps = {
  shouldDisableEdit?: boolean
  handleStep?: Function
}

export type VaccinesTableProps = {
  shouldDisableEdit?: boolean
  handleStep?: Function
}

export type IcdCodesTableProps = {

}

export type ICD10FormType = Pick<CreateIcdCodeInput, 'code' | 'description'> & { priority: string };
export type CptCodeFormType = Pick<CreateCptCodeInput, 'code' | 'shortDescription'> & { priority: string };
export type NdcCodeFormType = { code: string, description: string };
export type ImagingTestFormType = { name: string };
export type MvxCodeFormType = Pick<CreateMvxCodeInput, 'manufacturerName' | 'mvxCode' | 'notes'> & { mvxStatus: SelectorOption }
export type RoomFormType = Pick<CreateRoomInput, 'name' | 'number'> & { facility: SelectorOption }
export type CvxCodeFormType = Pick<CreateCvxCodeInput, 'name' | 'cvxCode' | 'shortDescription' | 'notes'> & { cptCode: SelectorOption, status: SelectorOption }
export type VaccineProductFormType = Pick<AddVaccineProductInput, 'name'> & {
  cvx: SelectorOption, mvx: SelectorOption, ndcCode: SelectorOption, status: SelectorOption
}

export type MacroFormType = Pick<CreateMacroInput, 'expansion' | 'shortcut'> & { section: multiOptionType[] }

export type ICD10FormProps = {
  open: boolean;
  isEdit: boolean;
  fetch?: Function;
  id?: string;
  dispatcher?: Dispatch<IcdCodeAction>
  handleClose: (open: boolean) => void
  systematic?: boolean
  searchItem?: string
  handleReload?: Function
}

export type cptCodeFormProps = {
  open: boolean;
  isEdit: boolean;
  fetch?: Function;
  id?: string;
  dispatcher?: Dispatch<cptCodeAction>
  handleClose: (open: boolean) => void
  systematic: boolean
}


export type NdcCodeFormProps = {
  open: boolean;
  isEdit: boolean;
  fetch?: Function;
  id?: string;
  dispatcher?: Dispatch<NdcCodeAction>
  handleClose: (open: boolean) => void
}

export type ImagingTestFormProps = {
  open: boolean;
  isEdit: boolean;
  fetch?: Function;
  id?: string;
  dispatcher?: Dispatch<ImagingTestAction>
  handleClose: (open: boolean) => void
}

export type MvxCodeFormProps = {
  open: boolean;
  isEdit: boolean;
  fetch?: Function;
  id?: string;
  dispatcher?: Dispatch<MvxCodeAction>
  handleClose: (open: boolean) => void
  systematic?: boolean
}

export type RoomFormProps = {
  open: boolean;
  isEdit: boolean;
  fetch?: Function;
  id?: string;
  dispatcher?: Dispatch<RoomAction>
  handleClose: (open: boolean) => void
  systematic?: boolean
}

export type CvxCodeFormProps = {
  open: boolean;
  isEdit: boolean;
  fetch?: Function;
  id?: string;
  dispatcher?: Dispatch<CvxCodeAction>
  handleClose: (open: boolean) => void
  systematic?: boolean
}

export type MacroFormProps = {
  open: boolean;
  isEdit: boolean;
  fetch?: Function;
  id?: string;
  dispatcher?: Dispatch<MacroAction>
  handleClose: (open: boolean) => void
  systematic?: boolean
}

export type VaccineProductFormProps = {
  open: boolean;
  isEdit: boolean;
  fetch?: Function;
  id?: string;
  dispatcher?: Dispatch<VaccineProductAction>
  handleClose: (open: boolean) => void
}

export type QuestionCardType = {
  question: Questions
}

export type DependentQuestionCardType = {
  question: DependentQuestions
  QId: string,
  value?: string | undefined
}

export type AnswerChipsProps = {
  answers: QuestionAnswers[]
  colors: string[]
  handleSubmit?: Function
  shouldDisableEdit?: boolean
}

export type PatientPrimaryProviderProps = {
  patientId: string,
  setPrimaryProvider?: (provider: string) => void
  label?: string
}

export type AddDiagnoseType = 'medication' | 'test' | 'imaging';

export type AppointmentRoomProps = {
  appointmentId: string
}

export type RosType = 'section' | 'template'