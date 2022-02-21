import { AttachmentsPayload, PatientPayload, PatientsPayload } from "../generated/graphql"

export interface State {
  page: number;
  patientId: string;
  selection: string;
  employerId: string;
  totalPages: number;
  openDelete: boolean;
  searchQuery: string;
  kinContactId: string;
  basicContactId: string;
  deletePatientId: string;
  guardianContactId: string;
  guarantorContactId: string;
  emergencyContactId: string;
  patients: PatientsPayload['patients'];
  attachmentUrl: string;
  attachmentsData: AttachmentsPayload['attachments'];
  tabValue: string;
  patientData: PatientPayload['patient']
  anchorEl: HTMLElement | null;
  attachmentId: string | undefined;
  isEditCard: boolean;
}

export const initialState: State = {
  page: 1,
  patients: [],
  totalPages: 0,
  patientId: '',
  employerId: '',
  selection: 'NO',
  searchQuery: '',
  kinContactId: '',
  openDelete: false,
  basicContactId: '',
  deletePatientId: '',
  guardianContactId: '',
  emergencyContactId: '',
  guarantorContactId: '',
  attachmentUrl: '',
  attachmentsData: [],
  tabValue: '1',
  patientData: undefined,
  anchorEl: null,
  attachmentId: '',
  isEditCard: false,
}

export enum ActionType {
  SET_PAGE = 'SetPage',
  SET_PATIENTS = 'setPatients',
  SET_SELECTION = 'setSelection',
  SET_PATIENT_ID = 'setPatientId',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_EMPLOYER_ID = 'setEmployerId',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_KIN_CONTACT_ID = 'setKinContactID',
  SET_BASIC_CONTACT_ID = 'setBasicContactID',
  SET_DELETE_PATIENT_ID = 'setDeletePatientId',
  SET_GUARDIAN_CONTACT_ID = 'setGuardianContactID',
  SET_GUARANTOR_CONTACT_ID = 'setGuarantorContactId',
  SET_EMERGENCY_CONTACT_ID = 'setEmergencyContactID',
  SET_ATTACHMENT_URL = 'setAttachmentUrl',
  SET_ATTACHMENTS_DATA = 'setAttachmentsData',
  SET_TAB_VALUE = 'setTabValue',
  SET_PATIENT_DATA = 'setPatientData',
  SET_ANCHOR_EL = 'setAnchorEl',
  SET_ATTACHMENT_ID = 'setAttachmentId',
  SET_IS_EDIT_CARD = 'setIsEditCard',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_SELECTION; selection: string }
  | { type: ActionType.SET_PATIENT_ID; patientId: string }
  | { type: ActionType.SET_EMPLOYER_ID; employerId: string }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_KIN_CONTACT_ID; kinContactId: string }
  | { type: ActionType.SET_BASIC_CONTACT_ID; basicContactId: string }
  | { type: ActionType.SET_DELETE_PATIENT_ID; deletePatientId: string }
  | { type: ActionType.SET_GUARDIAN_CONTACT_ID; guardianContactId: string }
  | { type: ActionType.SET_PATIENTS, patients: PatientsPayload['patients'] }
  | { type: ActionType.SET_EMERGENCY_CONTACT_ID; emergencyContactId: string }
  | { type: ActionType.SET_GUARANTOR_CONTACT_ID; guarantorContactId: string }
  | { type: ActionType.SET_ATTACHMENT_URL; attachmentUrl: string }
  | { type: ActionType.SET_ATTACHMENTS_DATA; attachmentsData: AttachmentsPayload['attachments'] }
  | { type: ActionType.SET_TAB_VALUE; tabValue: string }
  | { type: ActionType.SET_PATIENT_DATA; patientData: PatientPayload['patient'] }
  | { type: ActionType.SET_ANCHOR_EL; anchorEl: HTMLElement | null }
  | { type: ActionType.SET_ATTACHMENT_ID; attachmentId: string | undefined }
  | { type: ActionType.SET_IS_EDIT_CARD; isEditCard: boolean }


export const patientReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
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
  }
};
