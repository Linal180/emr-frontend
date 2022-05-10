import { usStreet } from "smartystreets-javascript-sdk";
import { IN_TEXT, KG_TEXT } from "../constants";
import {
  AttachmentPayload, AttachmentsPayload, HeadCircumferenceType, PatientPayload, PatientsPayload,
  TempUnitType, UnitType, WeightType
} from "../generated/graphql"
import { formatValue } from "../utils";

export interface State {
  page: number;
  isVoice: boolean;
  tabValue: string;
  selection: string;
  patientId: string;
  employerId: string;
  totalPages: number;
  activeStep: number;
  isBilling: boolean;
  openGraph: boolean;
  openDelete: boolean;
  searchQuery: string;
  isEditCard: boolean;
  kinContactId: string;
  facilityName: string;
  facilityId: string;
  doctorName: string;
  paymentMethod: string;
  attachmentUrl: string;
  basicContactId: string;
  sameAddress: boolean;
  consentAgreed: boolean;
  isAppointment: boolean;
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
  weightUnit: { id: WeightType, name: string };
  headCircumferenceUnit: { id: HeadCircumferenceType, name: string };
  feverUnit: { id: TempUnitType, name: string };
}

export const initialState: State = {
  page: 1,
  patients: [],
  totalPages: 0,
  activeStep: 0,
  tabValue: '1',
  patientId: '',
  employerId: '',
  anchorEl: null,
  isVoice: false,
  selection: 'NO',
  searchQuery: '',
  isBilling: false,
  attachmentId: '',
  facilityName: '',
  facilityId: '',
  doctorName: '',
  kinContactId: '',
  isEditCard: false,
  paymentMethod: '',
  attachmentUrl: '',
  openDelete: false,
  openGraph: false,
  basicContactId: '',
  sameAddress: false,
  attachmentsData: [],
  deletePatientId: '',
  consentAgreed: false,
  isAppointment: false,
  attachmentData: null,
  guardianContactId: '',
  emergencyContactId: '',
  guarantorContactId: '',
  patientData: undefined,
  isChecked: false,
  isVerified: false,
  addressOpen: false,
  data: [],
  openUnits: null,
  heightUnit: { id: UnitType.Inch, name: IN_TEXT },
  weightUnit: { id: WeightType.Kg, name: KG_TEXT },
  headCircumferenceUnit: { id: HeadCircumferenceType.Inch, name: IN_TEXT },
  feverUnit: { id: TempUnitType.DegF, name: formatValue(TempUnitType.DegF) }
}


export enum ActionType {
  SET_PAGE = 'setPage',
  SET_IS_OPEN = "setIsOpen",
  SET_IS_VOICE = 'setIsVoice',
  SET_PATIENTS = 'setPatients',
  SET_TAB_VALUE = 'setTabValue',
  SET_ANCHOR_EL = 'setAnchorEl',
  SET_SELECTION = 'setSelection',
  SET_OPEN_GRAPH = "setOpenGraph",
  SET_IS_BILLING = 'setIsBilling',
  SET_PATIENT_ID = 'setPatientId',
  SET_ACTIVE_STEP = 'setActiveStep',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_EMPLOYER_ID = 'setEmployerId',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_IS_EDIT_CARD = 'setIsEditCard',
  SET_SAME_ADDRESS = 'setSameAddress',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_PATIENT_DATA = 'setPatientData',
  SET_ATTACHMENT_ID = 'setAttachmentId',
  SET_FACILITY_NAME = 'setFacilityName',
  SET_FACILITY_ID = 'setFacilityId',
  SET_DOCTOR_NAME = 'setDoctorName',
  SET_KIN_CONTACT_ID = 'setKinContactID',
  SET_IS_APPOINTMENT = 'setIsAppointment',
  SET_PAYMENT_METHOD = 'setPaymentMethod',
  SET_ATTACHMENT_URL = 'setAttachmentUrl',
  SET_CONSENT_AGREED = 'setConsentAgreed',
  SET_ATTACHMENT_DATA = 'setAttachmentData',
  SET_BASIC_CONTACT_ID = 'setBasicContactID',
  SET_ATTACHMENTS_DATA = 'setAttachmentsData',
  SET_DELETE_PATIENT_ID = 'setDeletePatientId',
  SET_GUARDIAN_CONTACT_ID = 'setGuardianContactID',
  SET_GUARANTOR_CONTACT_ID = 'setGuarantorContactId',
  SET_EMERGENCY_CONTACT_ID = 'setEmergencyContactID',
  SET_IS_CHECKED = 'setIschecked',
  SET_IS_VERIFIED = 'setIsVerified',
  SET_ADDRESS_OPEN = 'setAddressOpen',
  SET_DATA = 'setData',
  SET_OPEN_UNITS = 'setOpenUnits',
  SET_HEIGHT_UNIT = 'setHeightUnit',
  SET_WEIGHT_UNIT = 'setWeightUnit',
  SET_HEAD_CIRCUMFERENCE_UNIT = 'setHeadCircumferenceUnit',
  SET_FEVER_UNIT = 'setFeverUnit',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_IS_VOICE, isVoice: boolean }
  | { type: ActionType.SET_TAB_VALUE; tabValue: string }
  | { type: ActionType.SET_SELECTION; selection: string }
  | { type: ActionType.SET_PATIENT_ID; patientId: string }
  | { type: ActionType.SET_IS_BILLING, isBilling: boolean }
  | { type: ActionType.SET_OPEN_GRAPH, openGraph: boolean }
  | { type: ActionType.SET_EMPLOYER_ID; employerId: string }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_ACTIVE_STEP; activeStep: number }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_IS_EDIT_CARD; isEditCard: boolean }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_SAME_ADDRESS, sameAddress: boolean }
  | { type: ActionType.SET_FACILITY_NAME; facilityName: string }
  | { type: ActionType.SET_FACILITY_ID; facilityId: string }
  | { type: ActionType.SET_DOCTOR_NAME; doctorName: string }
  | { type: ActionType.SET_KIN_CONTACT_ID; kinContactId: string }
  | { type: ActionType.SET_ATTACHMENT_URL; attachmentUrl: string }
  | { type: ActionType.SET_PAYMENT_METHOD, paymentMethod: string }
  | { type: ActionType.SET_IS_APPOINTMENT, isAppointment: boolean }
  | { type: ActionType.SET_CONSENT_AGREED, consentAgreed: boolean }
  | { type: ActionType.SET_ANCHOR_EL; anchorEl: HTMLElement | null }
  | { type: ActionType.SET_ANCHOR_EL; anchorEl: HTMLElement | null }
  | { type: ActionType.SET_BASIC_CONTACT_ID; basicContactId: string }
  | { type: ActionType.SET_DELETE_PATIENT_ID; deletePatientId: string }
  | { type: ActionType.SET_GUARDIAN_CONTACT_ID; guardianContactId: string }
  | { type: ActionType.SET_PATIENTS, patients: PatientsPayload['patients'] }
  | { type: ActionType.SET_ATTACHMENT_ID; attachmentId: string | undefined }
  | { type: ActionType.SET_ATTACHMENT_ID; attachmentId: string | undefined }
  | { type: ActionType.SET_EMERGENCY_CONTACT_ID; emergencyContactId: string }
  | { type: ActionType.SET_GUARANTOR_CONTACT_ID; guarantorContactId: string }
  | { type: ActionType.SET_PATIENT_DATA; patientData: PatientPayload['patient'] }
  | { type: ActionType.SET_ATTACHMENT_DATA; attachmentData: AttachmentPayload['attachment'] }
  | { type: ActionType.SET_ATTACHMENTS_DATA; attachmentsData: AttachmentsPayload['attachments'] }
  | { type: ActionType.SET_IS_CHECKED; isChecked: boolean }
  | { type: ActionType.SET_IS_VERIFIED; isVerified: boolean }
  | { type: ActionType.SET_ADDRESS_OPEN; addressOpen: boolean }
  | { type: ActionType.SET_DATA; data: usStreet.Candidate[] }
  | { type: ActionType.SET_OPEN_UNITS; openUnits: HTMLElement | null }
  | { type: ActionType.SET_HEIGHT_UNIT; heightUnit: { id: UnitType, name: string } }
  | { type: ActionType.SET_WEIGHT_UNIT; weightUnit: { id: WeightType, name: string } }
  | { type: ActionType.SET_HEAD_CIRCUMFERENCE_UNIT; headCircumferenceUnit: { id: HeadCircumferenceType, name: string } }
  | { type: ActionType.SET_FEVER_UNIT; feverUnit: { id: TempUnitType, name: string } }

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

    case ActionType.SET_IS_VOICE:
      return {
        ...state,
        isVoice: action.isVoice
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
      return {
        ...state,
        heightUnit: action.heightUnit
      }
    case ActionType.SET_WEIGHT_UNIT:
      return {
        ...state,
        weightUnit: action.weightUnit
      }
    case ActionType.SET_HEAD_CIRCUMFERENCE_UNIT:
      return {
        ...state,
        headCircumferenceUnit: action.headCircumferenceUnit
      }
    case ActionType.SET_FEVER_UNIT:
      return {
        ...state,
        feverUnit: action.feverUnit
      }
  }
};
