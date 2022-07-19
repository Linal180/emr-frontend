import { usStreet } from "smartystreets-javascript-sdk";
import { formatValue } from "../utils";
import { IN_TEXT, KG_TEXT } from "../constants";
import {
  AttachmentPayload, AttachmentsPayload, HeadCircumferenceType, PatientPayload, PatientProviderPayload, PatientsPayload,
  PatientVitalPayload, PatientVitalsPayload, TempUnitType, UnitType, WeightType, AppointmentPayload
} from "../generated/graphql"

export interface State {
  page: number;
  isSms: boolean;
  tabValue: string;
  selection: string;
  patientId: string;
  employerId: string;
  totalPages: number;
  activeStep: number;
  isBilling: boolean;
  openGraph: boolean;
  facilityId: string;
  doctorName: string;
  openDelete: boolean;
  searchQuery: string;
  isEditCard: boolean;
  kinContactId: string;
  facilityName: string;
  sameAddress: boolean;
  paymentMethod: string;
  attachmentUrl: string;
  openMoreInfo: boolean;
  basicContactId: string;
  consentAgreed: boolean;
  isAppointment: boolean;
  optionalEmail: boolean;
  deletePatientId: string;
  guardianContactId: string;
  guarantorContactId: string;
  emergencyContactId: string;
  anchorEl: HTMLElement | null;
  attachmentId: string | undefined;
  patients: PatientsPayload['patients'];
  patientData: PatientPayload['patient'];
  attachmentData: AttachmentPayload['attachment'];
  attachmentsData: AttachmentsPayload['attachments'];
  isChecked: boolean;
  isVerified: boolean;
  addressOpen: boolean;
  data: usStreet.Candidate[];
  openUnits: HTMLElement | null;
  heightUnit: { id: UnitType, name: string };
  prevHeightUnit: UnitType;
  isHeightEdit: boolean;
  weightUnit: { id: WeightType, name: string };
  prevWeightUnit: WeightType;
  isWeightEdit: boolean;
  headCircumferenceUnit: { id: HeadCircumferenceType, name: string };
  prevHeadUnit: HeadCircumferenceType;
  isHeadEdit: boolean;
  feverUnit: { id: TempUnitType, name: string };
  prevFeverUnit: TempUnitType;
  isTempEdit: boolean;
  isNoteOpen: HTMLElement | null;
  patientNoteOpen: boolean
  patientProvidersData: PatientProviderPayload['providers'];
  privacyNotice: boolean
  releaseOfInfoBill: boolean
  callToConsent: boolean
  medicationHistoryAuthority: boolean
  smsPermission: boolean,
  doctorPatientId: string;
  doctorId: string;
  isEdit: boolean;
  nextAppointment: AppointmentPayload['appointment'],
  lastAppointment: AppointmentPayload['appointment'],
  openVital: boolean,
  vitalPage: number,
  vitalTotalPages: number,
  vitalToEdit: PatientVitalPayload['patientVital'],
  patientVitals: PatientVitalsPayload['patientVitals'],
}

export const initialState: State = {
  page: 1,
  data: [],
  doctorId: '',
  vitalPage: 1,
  patients: [],
  isEdit: false,
  totalPages: 0,
  isSms: false,
  activeStep: 0,
  tabValue: '1',
  patientId: '',
  facilityId: '',
  doctorName: '',
  employerId: '',
  anchorEl: null,
  selection: 'NO',
  searchQuery: '',
  isBilling: false,
  attachmentId: '',
  openUnits: null,
  isChecked: false,
  isNoteOpen: null,
  facilityName: '',
  kinContactId: '',
  isEditCard: false,
  paymentMethod: '',
  attachmentUrl: '',
  openDelete: false,
  openVital: false,
  openGraph: false,
  vitalToEdit: null,
  isHeadEdit: false,
  isVerified: false,
  patientVitals: [],
  isTempEdit: false,
  addressOpen: false,
  basicContactId: '',
  sameAddress: false,
  attachmentsData: [],
  deletePatientId: '',
  openMoreInfo: false,
  consentAgreed: false,
  optionalEmail: true,
  isAppointment: false,
  attachmentData: null,
  guardianContactId: '',
  emergencyContactId: '',
  guarantorContactId: '',
  patientData: undefined,
  isWeightEdit: false,
  isHeightEdit: false,
  vitalTotalPages: 0,
  doctorPatientId: '',
  privacyNotice: false,
  callToConsent: false,
  smsPermission: false,
  patientNoteOpen: false,
  patientProvidersData: [],
  releaseOfInfoBill: false,
  nextAppointment: undefined,
  lastAppointment: undefined,
  prevHeightUnit: UnitType.Inch,
  prevWeightUnit: WeightType.Kg,
  prevFeverUnit: TempUnitType.DegF,
  medicationHistoryAuthority: false,
  prevHeadUnit: HeadCircumferenceType.Inch,
  heightUnit: { id: UnitType.Inch, name: IN_TEXT },
  weightUnit: { id: WeightType.Kg, name: KG_TEXT },
  headCircumferenceUnit: { id: HeadCircumferenceType.Inch, name: IN_TEXT },
  feverUnit: { id: TempUnitType.DegF, name: formatValue(TempUnitType.DegF) },
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_DATA = 'setData',
  SET_IS_SMS = 'setIsSms',
  SET_IS_OPEN = "setIsOpen",
  SET_IS_EDIT = 'setIsEdit',
  SET_PATIENTS = 'setPatients',
  SET_EDIT_HEAD = 'setEditHead',
  SET_EDIT_TEMP = 'setEditTemp',
  SET_DOCTOR_ID = 'setDoctorId',
  SET_NOTE_OPEN = 'setNoteOpen',
  SET_TAB_VALUE = 'setTabValue',
  SET_ANCHOR_EL = 'setAnchorEl',
  SET_SELECTION = 'setSelection',
  SET_OPEN_GRAPH = "setOpenGraph",
  SET_IS_BILLING = 'setIsBilling',
  SET_PATIENT_ID = 'setPatientId',
  SET_OPEN_UNITS = 'setOpenUnits',
  SET_FEVER_UNIT = 'setFeverUnit',
  SET_IS_CHECKED = 'setIsChecked',
  SET_ACTIVE_STEP = 'setActiveStep',
  SET_FACILITY_ID = 'setFacilityId',
  SET_DOCTOR_NAME = 'setDoctorName',
  SET_IS_VERIFIED = 'setIsVerified',
  SET_HEIGHT_UNIT = 'setHeightUnit',
  SET_WEIGHT_UNIT = 'setWeightUnit',
  SET_EDIT_WEIGHT = 'setEditWeight',
  SET_EDIT_HEIGHT = 'setEditHeight',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_EMPLOYER_ID = 'setEmployerId',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_IS_EDIT_CARD = 'setIsEditCard',
  SET_ADDRESS_OPEN = 'setAddressOpen',
  SET_SAME_ADDRESS = 'setSameAddress',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_PATIENT_DATA = 'setPatientData',
  SET_PRIVACY_NOTICE = 'setPrivacyNote',
  SET_ATTACHMENT_ID = 'setAttachmentId',
  SET_FACILITY_NAME = 'setFacilityName',
  SET_OPEN_MORE_INFO = 'setOpenMoreInfo',
  SET_KIN_CONTACT_ID = 'setKinContactID',
  SET_SMS_PERMISSION = 'setSmsPermission',
  SET_IS_APPOINTMENT = 'setIsAppointment',
  SET_PAYMENT_METHOD = 'setPaymentMethod',
  SET_ATTACHMENT_URL = 'setAttachmentUrl',
  SET_OPTIONAL_EMAIL = 'setOptionalEmail',
  SET_CONSENT_AGREED = 'setConsentAgreed',
  SET_CALL_TO_CONSENT = 'setCallToConsent',
  SET_ATTACHMENT_DATA = 'setAttachmentData',
  SET_BASIC_CONTACT_ID = 'setBasicContactID',
  SET_NEXT_APPOINTMENT = 'setNextAppointment',
  SET_LAST_APPOINTMENT = 'setLastAppointment',
  SET_ATTACHMENTS_DATA = 'setAttachmentsData',
  SET_DOCTOR_PATIENT_ID = 'setDoctorPatientId',
  SET_DELETE_PATIENT_ID = 'setDeletePatientId',
  SET_PATIENT_NOTE_OPEN = 'setPatientNoteOpen',
  SET_PATIENT_PROVIDERS = 'setPatientProviders',
  SET_GUARDIAN_CONTACT_ID = 'setGuardianContactID',
  SET_RELEASE_OF_INFO_BILL = 'setReleaseOfInfoBill',
  SET_GUARANTOR_CONTACT_ID = 'setGuarantorContactId',
  SET_EMERGENCY_CONTACT_ID = 'setEmergencyContactID',
  SET_PATIENT_PROVIDERS_DATA = 'setPatientProviderData',
  SET_HEAD_CIRCUMFERENCE_UNIT = 'setHeadCircumferenceUnit',
  SET_MEDICATION_HISTORY_AUTHORITY = 'setMedicationHistoryAuthority',
  SET_OPEN_VITAL = 'setOpenVital',
  SET_VITAL_PAGE = 'setVitalPage',
  SET_VITAL_TOTAL_PAGES = 'setVitalTotalPages',
  SET_VITAL_TO_EDIT = 'setVitalToEdit',
  SET_PATIENT_VITALS = 'setPatientVitals',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_IS_SMS, isSms: boolean }
  | { type: ActionType.SET_IS_EDIT; isEdit: boolean }
  | { type: ActionType.SET_DOCTOR_ID; doctorId: string }
  | { type: ActionType.SET_TAB_VALUE; tabValue: string }
  | { type: ActionType.SET_SELECTION; selection: string }
  | { type: ActionType.SET_PATIENT_ID; patientId: string }
  | { type: ActionType.SET_IS_BILLING, isBilling: boolean }
  | { type: ActionType.SET_OPEN_GRAPH, openGraph: boolean }
  | { type: ActionType.SET_EDIT_TEMP; isTempEdit: boolean }
  | { type: ActionType.SET_EDIT_HEAD; isHeadEdit: boolean }
  | { type: ActionType.SET_IS_CHECKED; isChecked: boolean }
  | { type: ActionType.SET_FACILITY_ID; facilityId: string }
  | { type: ActionType.SET_DOCTOR_NAME; doctorName: string }
  | { type: ActionType.SET_EMPLOYER_ID; employerId: string }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_ACTIVE_STEP; activeStep: number }
  | { type: ActionType.SET_IS_VERIFIED; isVerified: boolean }
  | { type: ActionType.SET_DATA; data: usStreet.Candidate[] }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_IS_EDIT_CARD; isEditCard: boolean }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_EDIT_HEIGHT; isHeightEdit: boolean }
  | { type: ActionType.SET_ADDRESS_OPEN; addressOpen: boolean }
  | { type: ActionType.SET_EDIT_WEIGHT; isWeightEdit: boolean }
  | { type: ActionType.SET_SAME_ADDRESS, sameAddress: boolean }
  | { type: ActionType.SET_FACILITY_NAME; facilityName: string }
  | { type: ActionType.SET_KIN_CONTACT_ID; kinContactId: string }
  | { type: ActionType.SET_ATTACHMENT_URL; attachmentUrl: string }
  | { type: ActionType.SET_PAYMENT_METHOD, paymentMethod: string }
  | { type: ActionType.SET_SMS_PERMISSION; smsPermission: boolean }
  | { type: ActionType.SET_IS_APPOINTMENT, isAppointment: boolean }
  | { type: ActionType.SET_OPTIONAL_EMAIL, optionalEmail: boolean }
  | { type: ActionType.SET_CONSENT_AGREED, consentAgreed: boolean }
  | { type: ActionType.SET_PRIVACY_NOTICE; privacyNotice: boolean }
  | { type: ActionType.SET_SMS_PERMISSION; smsPermission: boolean }
  | { type: ActionType.SET_ANCHOR_EL; anchorEl: HTMLElement | null }
  | { type: ActionType.SET_CALL_TO_CONSENT; callToConsent: boolean }
  | { type: ActionType.SET_BASIC_CONTACT_ID; basicContactId: string }
  | { type: ActionType.SET_OPEN_UNITS; openUnits: HTMLElement | null }
  | { type: ActionType.SET_NOTE_OPEN; isNoteOpen: HTMLElement | null }
  | { type: ActionType.SET_DOCTOR_PATIENT_ID; doctorPatientId: string }
  | { type: ActionType.SET_DELETE_PATIENT_ID; deletePatientId: string }
  | { type: ActionType.SET_PATIENT_NOTE_OPEN; patientNoteOpen: boolean }
  | { type: ActionType.SET_GUARDIAN_CONTACT_ID; guardianContactId: string }
  | { type: ActionType.SET_PATIENTS, patients: PatientsPayload['patients'] }
  | { type: ActionType.SET_ATTACHMENT_ID; attachmentId: string | undefined }
  | { type: ActionType.SET_ATTACHMENT_ID; attachmentId: string | undefined }
  | { type: ActionType.SET_RELEASE_OF_INFO_BILL; releaseOfInfoBill: boolean }
  | { type: ActionType.SET_EMERGENCY_CONTACT_ID; emergencyContactId: string }
  | { type: ActionType.SET_GUARANTOR_CONTACT_ID; guarantorContactId: string }
  | { type: ActionType.SET_PATIENT_DATA; patientData: PatientPayload['patient'] }
  | { type: ActionType.SET_HEIGHT_UNIT; heightUnit: { id: UnitType, name: string } }
  | { type: ActionType.SET_WEIGHT_UNIT; weightUnit: { id: WeightType, name: string } }
  | { type: ActionType.SET_FEVER_UNIT; feverUnit: { id: TempUnitType, name: string } }
  | { type: ActionType.SET_ATTACHMENT_DATA; attachmentData: AttachmentPayload['attachment'] }
  | { type: ActionType.SET_MEDICATION_HISTORY_AUTHORITY; medicationHistoryAuthority: boolean }
  | { type: ActionType.SET_ATTACHMENTS_DATA; attachmentsData: AttachmentsPayload['attachments'] }
  | { type: ActionType.SET_LAST_APPOINTMENT, lastAppointment: AppointmentPayload['appointment'] }
  | { type: ActionType.SET_NEXT_APPOINTMENT, nextAppointment: AppointmentPayload['appointment'] }
  | { type: ActionType.SET_PATIENT_PROVIDERS_DATA, patientProvidersData: PatientProviderPayload['providers'] }
  | { type: ActionType.SET_HEAD_CIRCUMFERENCE_UNIT; headCircumferenceUnit: { id: HeadCircumferenceType, name: string } }
  | { type: ActionType.SET_OPEN_VITAL; openVital: boolean }
  | { type: ActionType.SET_VITAL_PAGE; vitalPage: number }
  | { type: ActionType.SET_OPEN_MORE_INFO; openMoreInfo: boolean }
  | { type: ActionType.SET_VITAL_TOTAL_PAGES; vitalTotalPages: number }
  | { type: ActionType.SET_VITAL_TO_EDIT; vitalToEdit: PatientVitalPayload['patientVital'] }
  | { type: ActionType.SET_PATIENT_VITALS; patientVitals: PatientVitalsPayload['patientVitals'] }

export const patientReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.paymentMethod
      }

    case ActionType.SET_CONSENT_AGREED:
      return {
        ...state,
        consentAgreed: action.consentAgreed
      }

    case ActionType.SET_OPTIONAL_EMAIL:
      return {
        ...state,
        optionalEmail: action.optionalEmail
      }

    case ActionType.SET_SAME_ADDRESS:
      return {
        ...state,
        sameAddress: action.sameAddress
      }

    case ActionType.SET_ACTIVE_STEP:
      return {
        ...state,
        activeStep: action.activeStep
      }

    case ActionType.SET_SELECTION:
      return {
        ...state,
        selection: action.selection
      }

    case ActionType.SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.totalPages
      }

    case ActionType.SET_PATIENT_ID:
      return {
        ...state,
        patientId: action.patientId
      }

    case ActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.searchQuery
      }

    case ActionType.SET_OPEN_DELETE:
      return {
        ...state,
        openDelete: action.openDelete
      }

    case ActionType.SET_OPEN_GRAPH:
      return {
        ...state,
        openGraph: action.openGraph
      }

    case ActionType.SET_PATIENTS:
      return {
        ...state,
        patients: action.patients
      }

    case ActionType.SET_DELETE_PATIENT_ID:
      return {
        ...state,
        deletePatientId: action.deletePatientId
      }

    case ActionType.SET_EMPLOYER_ID:
      return {
        ...state,
        employerId: action.employerId
      }

    case ActionType.SET_BASIC_CONTACT_ID:
      return {
        ...state,
        basicContactId: action.basicContactId
      }
    case ActionType.SET_KIN_CONTACT_ID:
      return {
        ...state,
        kinContactId: action.kinContactId
      }

    case ActionType.SET_GUARANTOR_CONTACT_ID:
      return {
        ...state,
        guarantorContactId: action.guarantorContactId
      }

    case ActionType.SET_GUARDIAN_CONTACT_ID:
      return {
        ...state,
        guardianContactId: action.guardianContactId
      }

    case ActionType.SET_EMERGENCY_CONTACT_ID:
      return {
        ...state,
        emergencyContactId: action.emergencyContactId
      }

    case ActionType.SET_ATTACHMENT_URL:
      return {
        ...state,
        attachmentUrl: action.attachmentUrl
      }

    case ActionType.SET_ATTACHMENT_DATA:
      return {
        ...state,
        attachmentData: action.attachmentData
      }

    case ActionType.SET_ATTACHMENTS_DATA:
      return {
        ...state,
        attachmentsData: action.attachmentsData
      }

    case ActionType.SET_TAB_VALUE:
      return {
        ...state,
        tabValue: action.tabValue
      }

    case ActionType.SET_PATIENT_DATA:
      return {
        ...state,
        patientData: action.patientData
      }

    case ActionType.SET_ANCHOR_EL:
      return {
        ...state,
        anchorEl: action.anchorEl
      }

    case ActionType.SET_ATTACHMENT_ID:
      return {
        ...state,
        attachmentId: action.attachmentId
      }

    case ActionType.SET_IS_EDIT_CARD:
      return {
        ...state,
        isEditCard: action.isEditCard
      }

    case ActionType.SET_IS_SMS:
      return {
        ...state,
        isSms: action.isSms
      }

    case ActionType.SET_IS_BILLING:
      return {
        ...state,
        isBilling: action.isBilling
      }

    case ActionType.SET_IS_APPOINTMENT:
      return {
        ...state,
        isAppointment: action.isAppointment
      }

    case ActionType.SET_FACILITY_NAME:
      return {
        ...state,
        facilityName: action.facilityName
      }

    case ActionType.SET_FACILITY_ID:
      return {
        ...state,
        facilityId: action.facilityId
      }

    case ActionType.SET_DOCTOR_NAME:
      return {
        ...state,
        doctorName: action.doctorName
      }

    case ActionType.SET_IS_CHECKED:
      return {
        ...state,
        isChecked: action.isChecked
      }

    case ActionType.SET_IS_VERIFIED:
      return {
        ...state,
        isVerified: action.isVerified
      }

    case ActionType.SET_ADDRESS_OPEN:
      return {
        ...state,
        addressOpen: action.addressOpen
      }

    case ActionType.SET_DATA:
      return {
        ...state,
        data: action.data
      }

    case ActionType.SET_OPEN_UNITS:
      return {
        ...state,
        openUnits: action.openUnits
      }

    case ActionType.SET_HEIGHT_UNIT:
      const { heightUnit: { id: prevHeightUnit } } = state;
      return {
        ...state,
        prevHeightUnit,
        isHeightEdit: true,
        heightUnit: action.heightUnit
      }

    case ActionType.SET_WEIGHT_UNIT:
      const { weightUnit: { id: prevWeightUnit } } = state
      return {
        ...state,
        prevWeightUnit,
        isWeightEdit: true,
        weightUnit: action.weightUnit
      }

    case ActionType.SET_HEAD_CIRCUMFERENCE_UNIT:
      const { headCircumferenceUnit: { id: prevHeadUnit } } = state
      return {
        ...state,
        prevHeadUnit,
        isHeadEdit: true,
        headCircumferenceUnit: action.headCircumferenceUnit
      }

    case ActionType.SET_FEVER_UNIT:
      const { feverUnit: { id: prevFeverUnit } } = state
      return {
        ...state,
        prevFeverUnit,
        isTempEdit: true,
        feverUnit: action.feverUnit
      }

    case ActionType.SET_EDIT_HEAD:
      return {
        ...state,
        isHeadEdit: action.isHeadEdit
      }

    case ActionType.SET_EDIT_HEIGHT:
      return {
        ...state,
        isHeightEdit: action.isHeightEdit
      }

    case ActionType.SET_EDIT_WEIGHT:
      return {
        ...state,
        isWeightEdit: action.isWeightEdit
      }

    case ActionType.SET_EDIT_TEMP:
      return {
        ...state,
        isTempEdit: action.isTempEdit
      }

    case ActionType.SET_NOTE_OPEN:
      return {
        ...state,
        isNoteOpen: action.isNoteOpen
      }

    case ActionType.SET_PATIENT_NOTE_OPEN:
      return {
        ...state,
        patientNoteOpen: action.patientNoteOpen
      }

    case ActionType.SET_PATIENT_PROVIDERS_DATA:
      return {
        ...state,
        patientProvidersData: action.patientProvidersData
      }

    case ActionType.SET_PRIVACY_NOTICE:
      return {
        ...state,
        privacyNotice: action.privacyNotice
      }

    case ActionType.SET_RELEASE_OF_INFO_BILL:
      return {
        ...state,
        releaseOfInfoBill: action.releaseOfInfoBill
      }

    case ActionType.SET_CALL_TO_CONSENT:
      return {
        ...state,
        callToConsent: action.callToConsent
      }

    case ActionType.SET_MEDICATION_HISTORY_AUTHORITY:
      return {
        ...state,
        medicationHistoryAuthority: action.medicationHistoryAuthority
      }

    case ActionType.SET_SMS_PERMISSION:
      return {
        ...state,
        smsPermission: action.smsPermission
      }

    case ActionType.SET_DOCTOR_PATIENT_ID:
      return {
        ...state,
        doctorPatientId: action.doctorPatientId
      }

    case ActionType.SET_DOCTOR_ID:
      return {
        ...state,
        doctorId: action.doctorId
      }

    case ActionType.SET_IS_EDIT:
      return {
        ...state,
        isEdit: action.isEdit
      }

    case ActionType.SET_NEXT_APPOINTMENT:
      return {
        ...state,
        nextAppointment: action.nextAppointment
      }

    case ActionType.SET_LAST_APPOINTMENT:
      return {
        ...state,
        lastAppointment: action.lastAppointment
      }

    case ActionType.SET_OPEN_VITAL:
      return {
        ...state,
        openVital: action.openVital
      }

    case ActionType.SET_VITAL_PAGE:
      return {
        ...state,
        vitalPage: action.vitalPage
      }

    case ActionType.SET_VITAL_TOTAL_PAGES:
      return {
        ...state,
        vitalTotalPages: action.vitalTotalPages
      }

    case ActionType.SET_VITAL_TO_EDIT:
      return {
        ...state,
        vitalToEdit: action.vitalToEdit
      }

    case ActionType.SET_PATIENT_VITALS:
      return {
        ...state,
        patientVitals: action.patientVitals
      }

    case ActionType.SET_OPEN_MORE_INFO:
      return {
        ...state,
        openMoreInfo: action.openMoreInfo
      }
  }
};
