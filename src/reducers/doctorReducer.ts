import { SelectorOption } from "../interfacesTypes";
import { AllDoctorPayload, DoctorPayload } from "../generated/graphql"

export interface State {
  page: number;
  isEdit: boolean;
  serviceId: string;
  contactId: string;
  billingId: string;
  currentTab: string;
  totalPages: number;
  currentDate: string;
  openDelete: boolean;
  openMoreInfo: boolean;
  searchQuery: string;
  deleteDoctorId: string;
  doctorFacilityId: string;
  provider: SelectorOption;
  doctor: DoctorPayload['doctor'];
  doctors: AllDoctorPayload['doctors'];
  allDoctors: AllDoctorPayload['doctors'];
}

export const initialState: State = {
  page: 1,
  doctors: [],
  allDoctors: [],
  doctor: null,
  totalPages: 0,
  contactId: '',
  billingId: '',
  serviceId: '',
  isEdit: false,
  currentTab: "1",
  currentDate: '',
  searchQuery: "",
  openDelete: false,
  openMoreInfo: false,
  deleteDoctorId: "",
  doctorFacilityId: "",
  provider: {
    id: "",
    name: ""
  }
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_DOCTOR = 'setDoctor',
  SET_IS_EDIT = 'setIsEdit',
  SET_DOCTORS = 'setDoctors',
  SET_PROVIDER = 'setProvider',
  SET_CONTACT_ID = 'setContactId',
  SET_BILLING_ID = 'setBillingId',
  SET_SERVICE_ID = 'setServiceId',
  SET_ALL_DOCTORS = 'setAllDoctors',
  SET_CURRENT_TAB = 'setCurrentTab',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_CURRENT_DATE = 'setCurrentDate',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_OPEN_MORE_INFO = 'setOpenMoreInfo',
  SET_DELETE_DOCTOR_ID = 'setDeleteDoctorId',
  SET_DOCTOR_FACILITY_ID = 'setDoctorFacilityId',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_IS_EDIT; isEdit: boolean }
  | { type: ActionType.SET_SERVICE_ID, serviceId: string }
  | { type: ActionType.SET_BILLING_ID, billingId: string }
  | { type: ActionType.SET_CONTACT_ID, contactId: string }
  | { type: ActionType.SET_CURRENT_TAB; currentTab: string }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_CURRENT_DATE, currentDate: string }
  | { type: ActionType.SET_PROVIDER, provider: SelectorOption }
  | { type: ActionType.SET_OPEN_MORE_INFO; openMoreInfo: boolean }
  | { type: ActionType.SET_DOCTOR; doctor: DoctorPayload['doctor'] }
  | { type: ActionType.SET_DELETE_DOCTOR_ID; deleteDoctorId: string }
  | { type: ActionType.SET_DOCTOR_FACILITY_ID; doctorFacilityId: string }
  | { type: ActionType.SET_DOCTORS; doctors: AllDoctorPayload['doctors'] }
  | { type: ActionType.SET_ALL_DOCTORS; allDoctors: AllDoctorPayload['doctors'] }

export const doctorReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_CONTACT_ID:
      return {
        ...state,
        contactId: action.contactId
      }

    case ActionType.SET_BILLING_ID:
      return {
        ...state,
        billingId: action.billingId
      }

    case ActionType.SET_IS_EDIT:
      return {
        ...state,
        isEdit: action.isEdit
      }

    case ActionType.SET_CURRENT_TAB:
      return {
        ...state,
        currentTab: action.currentTab
      }

    case ActionType.SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.totalPages
      }

    case ActionType.SET_OPEN_DELETE:
      return {
        ...state,
        openDelete: action.openDelete
      }

    case ActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.searchQuery
      }

    case ActionType.SET_DOCTOR:
      return {
        ...state,
        doctor: action.doctor
      }

    case ActionType.SET_ALL_DOCTORS:
      return {
        ...state,
        allDoctors: action.allDoctors
      }

    case ActionType.SET_DOCTORS:
      return {
        ...state,
        doctors: action.doctors
      }

    case ActionType.SET_DELETE_DOCTOR_ID:
      return {
        ...state,
        deleteDoctorId: action.deleteDoctorId
      }

    case ActionType.SET_DOCTOR_FACILITY_ID:
      return {
        ...state,
        doctorFacilityId: action.doctorFacilityId
      }

    case ActionType.SET_CURRENT_DATE:
      return {
        ...state,
        currentDate: action.currentDate
      }

    case ActionType.SET_SERVICE_ID:
      return {
        ...state,
        serviceId: action.serviceId
      }

    case ActionType.SET_PROVIDER:
      return {
        ...state,
        provider: action.provider
      }

    case ActionType.SET_OPEN_MORE_INFO:
      return {
        ...state,
        openMoreInfo: action.openMoreInfo
      }
  };
}
