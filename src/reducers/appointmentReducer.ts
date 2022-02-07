import { AppointmentsPayload, SchedulesPayload } from "../generated/graphql"

export interface State {
  page: number;
  providerId: string;
  totalPages: number;
  openDelete: boolean;
  searchQuery: string;
  appointmentId: string;
  deleteAppointmentId: string;
  availableSchedules: SchedulesPayload['schedules']
  appointments: AppointmentsPayload['appointments'];
}

export const initialState: State = {
  page: 1,
  providerId: '',
  totalPages: 0,
  searchQuery: '',
  appointments: [],
  appointmentId: '',
  openDelete: false,
  availableSchedules: [],
  deleteAppointmentId: '',
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_PROVIDER_ID = 'setProviderId',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_APPOINTMENTS = 'setAppointments',
  SET_APPOINTMENT_ID = 'setAppointmentId',
  SET_AVAILABLE_SCHEDULES = 'setAvailableSchedules',
  SET_DELETE_APPOINTMENT_ID = 'setDeleteAppointmentId',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_PROVIDER_ID, providerId: string }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_APPOINTMENT_ID; appointmentId: string }
  | { type: ActionType.SET_DELETE_APPOINTMENT_ID; deleteAppointmentId: string }
  | { type: ActionType.SET_APPOINTMENTS; appointments: AppointmentsPayload['appointments'] }
  | { type: ActionType.SET_AVAILABLE_SCHEDULES, availableSchedules: SchedulesPayload['schedules'] }

export const appointmentReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_AVAILABLE_SCHEDULES:
      return {
        ...state,
        availableSchedules: action.availableSchedules
      }

    case ActionType.SET_PROVIDER_ID:
      return {
        ...state,
        providerId: action.providerId
      }

    case ActionType.SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.totalPages
      }

    case ActionType.SET_APPOINTMENT_ID:
      return {
        ...state,
        appointmentId: action.appointmentId
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

    case ActionType.SET_APPOINTMENTS:
      return {
        ...state,
        appointments: action.appointments
      }

    case ActionType.SET_DELETE_APPOINTMENT_ID:
      return {
        ...state,
        deleteAppointmentId: action.deleteAppointmentId
      }
  }
};
