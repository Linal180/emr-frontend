import { AllDoctorPayload } from "../generated/graphql"

export interface State {
  page: number;
  totalPages: number;
  openDelete: boolean;
  searchQuery: string;
  deleteDoctorId: string;
  doctors: AllDoctorPayload['doctors'];
  scheduleOpenModal: boolean;
  doctorFacilityId: string;
}

export const initialState: State = {
  page: 1,
  doctors: [],
  totalPages: 0,
  searchQuery: "",
  openDelete: false,
  deleteDoctorId: "",
  scheduleOpenModal: false,
  doctorFacilityId: "",
}

export enum ActionType {
  SET_PAGE = 'SetPage',
  SET_DOCTORS = 'setDoctors',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_DELETE_DOCTOR_ID = 'setDeleteDoctorId',
  SET_SCHEDULE_OPEN_MODAL = 'setScheduleOpenModal',
  SET_DOCTOR_FACILITY_ID = 'setDoctorFacilityId',

}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_DELETE_DOCTOR_ID; deleteDoctorId: string }
  | { type: ActionType.SET_DOCTORS; doctors: AllDoctorPayload['doctors'] }
  | { type: ActionType.SET_SCHEDULE_OPEN_MODAL; scheduleOpenModal: boolean }
  | { type: ActionType.SET_DOCTOR_FACILITY_ID; doctorFacilityId: string }

export const doctorReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
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
  };
}
