import { AllDoctorPayload, DoctorPayload, SchedulesPayload } from "../generated/graphql"
import { DaySchedule } from "../interfacesTypes";

export interface State {
  page: number;
  isEdit: boolean;
  scheduleId: string;
  currentTab: string;
  totalPages: number;
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
  doctorSchedules: SchedulesPayload['schedules'];
}

export const initialState: State = {
  page: 1,
  doctors: [],
  doctor: null,
  totalPages: 0,
  isEdit: false,
  scheduleId: "",
  currentTab: "1",
  searchQuery: "",
  openDelete: false,
  byDaySchedules: [],
  deleteDoctorId: "",
  doctorSchedules: [],
  deleteScheduleId: "",
  doctorFacilityId: "",
  scheduleOpenModal: false,
  openScheduleDelete: false,
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_DOCTOR = 'setDoctor',
  SET_IS_EDIT = 'setIsEdit',
  SET_DOCTORS = 'setDoctors',
  SET_SCHEDULE_ID = 'setScheduleId',
  SET_CURRENT_TAB = 'setCurrentTab',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_BY_DAY_SCHEDULES = 'setByDaySchedules',
  SET_DELETE_DOCTOR_ID = 'setDeleteDoctorId',
  SET_DOCTOR_SCHEDULES = 'setDoctorSchedules',
  SET_DOCTOR_FACILITY_ID = 'setDoctorFacilityId',
  SET_DELETE_SCHEDULE_ID = 'setDeleteScheduleId',
  SET_SCHEDULE_OPEN_MODAL = 'setScheduleOpenModal',
  SET_OPEN_SCHEDULE_DELETE = 'setOpenScheduleDelete',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_IS_EDIT; isEdit: boolean }
  | { type: ActionType.SET_SCHEDULE_ID, scheduleId: string }
  | { type: ActionType.SET_CURRENT_TAB; currentTab: string }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_DOCTOR; doctor: DoctorPayload['doctor'] }
  | { type: ActionType.SET_DELETE_DOCTOR_ID; deleteDoctorId: string }
  | { type: ActionType.SET_DELETE_SCHEDULE_ID; deleteScheduleId: string }
  | { type: ActionType.SET_DOCTOR_FACILITY_ID; doctorFacilityId: string }
  | { type: ActionType.SET_DOCTORS; doctors: AllDoctorPayload['doctors'] }
  | { type: ActionType.SET_BY_DAY_SCHEDULES; byDaySchedules: DaySchedule[] }
  | { type: ActionType.SET_SCHEDULE_OPEN_MODAL; scheduleOpenModal: boolean }
  | { type: ActionType.SET_OPEN_SCHEDULE_DELETE; openScheduleDelete: boolean }
  | { type: ActionType.SET_DOCTOR_SCHEDULES; doctorSchedules: SchedulesPayload['schedules'] }

export const doctorReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
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

    case ActionType.SET_DOCTOR_SCHEDULES:
      return {
        ...state,
        doctorSchedules: action.doctorSchedules
      }
  };
}
