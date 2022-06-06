import { AllDoctorPayload, DoctorPayload, SlotsPayload, SchedulesPayload } from "../generated/graphql"
import { DaySchedule, SelectorOption } from "../interfacesTypes";

export interface State {
  page: number;
  isEdit: boolean;
  serviceId: string;
  contactId: string;
  billingId: string;
  scheduleId: string;
  currentTab: string;
  totalPages: number;
  currentDate: string;
  openDelete: boolean;
  searchQuery: string;
  deleteDoctorId: string;
  deleteScheduleId: string;
  doctorFacilityId: string;
  scheduleOpenModal: boolean;
  openScheduleDelete: boolean;
  byDaySchedules: DaySchedule[];
  doctor: DoctorPayload['doctor'];
  doctors: AllDoctorPayload['doctors'];
  doctorSlots: SlotsPayload['slots'];
  doctorSchedules: SchedulesPayload['schedules'];
  provider: SelectorOption;
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
  scheduleId: "",
  currentTab: "1",
  currentDate: '',
  searchQuery: "",
  openDelete: false,
  byDaySchedules: [],
  doctorSchedules: [],
  deleteDoctorId: "",
  doctorSlots: [],
  deleteScheduleId: "",
  doctorFacilityId: "",
  scheduleOpenModal: false,
  openScheduleDelete: false,
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
  SET_CONTACT_ID = 'setContactId',
  SET_BILLING_ID = 'setBillingId',
  SET_SERVICE_ID = 'setServiceId',
  SET_SCHEDULE_ID = 'setScheduleId',
  SET_CURRENT_TAB = 'setCurrentTab',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_CURRENT_DATE = 'setCurrentDate',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_DOCTOR_SLOTS = 'setDoctorSlots',
  SET_BY_DAY_SCHEDULES = 'setByDaySchedules',
  SET_DELETE_DOCTOR_ID = 'setDeleteDoctorId',
  SET_DOCTOR_SCHEDULES = 'setDoctorSchedules',
  SET_DOCTOR_FACILITY_ID = 'setDoctorFacilityId',
  SET_DELETE_SCHEDULE_ID = 'setDeleteScheduleId',
  SET_SCHEDULE_OPEN_MODAL = 'setScheduleOpenModal',
  SET_OPEN_SCHEDULE_DELETE = 'setOpenScheduleDelete',
  SET_PROVIDER = 'setProvider',
  SET_ALL_DOCTORS = 'setAllDoctors'
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_IS_EDIT; isEdit: boolean }
  | { type: ActionType.SET_SERVICE_ID, serviceId: string }
  | { type: ActionType.SET_BILLING_ID, billingId: string }
  | { type: ActionType.SET_CONTACT_ID, contactId: string }
  | { type: ActionType.SET_SCHEDULE_ID, scheduleId: string }
  | { type: ActionType.SET_CURRENT_TAB; currentTab: string }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_CURRENT_DATE, currentDate: string }
  | { type: ActionType.SET_DOCTOR; doctor: DoctorPayload['doctor'] }
  | { type: ActionType.SET_DELETE_DOCTOR_ID; deleteDoctorId: string }
  | { type: ActionType.SET_DELETE_SCHEDULE_ID; deleteScheduleId: string }
  | { type: ActionType.SET_DOCTOR_FACILITY_ID; doctorFacilityId: string }
  | { type: ActionType.SET_DOCTORS; doctors: AllDoctorPayload['doctors'] }
  | { type: ActionType.SET_BY_DAY_SCHEDULES; byDaySchedules: DaySchedule[] }
  | { type: ActionType.SET_SCHEDULE_OPEN_MODAL; scheduleOpenModal: boolean }
  | { type: ActionType.SET_OPEN_SCHEDULE_DELETE; openScheduleDelete: boolean }
  | { type: ActionType.SET_DOCTOR_SLOTS; doctorSlots: SlotsPayload['slots'] }
  | { type: ActionType.SET_DOCTOR_SCHEDULES, doctorSchedules: SchedulesPayload['schedules'] }
  | { type: ActionType.SET_PROVIDER, provider: SelectorOption }
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

    case ActionType.SET_OPEN_SCHEDULE_DELETE:
      return {
        ...state,
        openScheduleDelete: action.openScheduleDelete
      }

    case ActionType.SET_DELETE_SCHEDULE_ID:
      return {
        ...state,
        deleteScheduleId: action.deleteScheduleId
      }

    case ActionType.SET_SCHEDULE_ID:
      return {
        ...state,
        scheduleId: action.scheduleId
      }

    case ActionType.SET_BY_DAY_SCHEDULES:
      return {
        ...state,
        byDaySchedules: action.byDaySchedules
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

    case ActionType.SET_SCHEDULE_OPEN_MODAL:
      return {
        ...state,
        scheduleOpenModal: action.scheduleOpenModal
      }

    case ActionType.SET_DOCTOR_FACILITY_ID:
      return {
        ...state,
        doctorFacilityId: action.doctorFacilityId
      }

    case ActionType.SET_DOCTOR_SLOTS:
      return {
        ...state,
        doctorSlots: action.doctorSlots
      }

    case ActionType.SET_DOCTOR_SCHEDULES:
      return {
        ...state,
        doctorSchedules: action.doctorSchedules
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
  };
}
