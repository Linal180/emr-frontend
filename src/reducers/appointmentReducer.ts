import { AppointmentPayload, AppointmentsPayload, DoctorSchedulePayload, FacilityPayload } from "../generated/graphql"

export interface State {
  page: number;
  offset: number;
  serviceId: string;
  totalPages: number;
  providerId: string;
  currentDate: string;
  openDelete: boolean;
  searchQuery: string;
  isInsurance: boolean;
  appointmentId: string;
  deleteAppointmentId: string;
  facility: FacilityPayload['facility'];
  appointment: AppointmentPayload['appointment'];
  availableSlots: DoctorSchedulePayload['slots'];
  appointments: AppointmentsPayload['appointments'];
}

export const initialState: State = {
  page: 1,
  offset: 0,
  serviceId: '',
  totalPages: 0,
  providerId: '',
  facility: null,
  searchQuery: '',
  currentDate: new Date().toDateString(),
  appointments: [],
  openDelete: false,
  appointmentId: '',
  appointment: null,
  isInsurance: false,
  availableSlots: [],
  deleteAppointmentId: '',
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_OFFSET = 'setOffset',
  SET_FACILITY = 'setFacility',
  SET_SERVICE_ID = 'setServiceId',
  SET_PROVIDER_ID = 'setProviderId',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_APPOINTMENT = 'setAppointment',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_CURRENT_DATE = 'setCurrentDate',
  SET_IS_INSURANCE = 'setIsInsurance',
  SET_APPOINTMENTS = 'setAppointments',
  SET_APPOINTMENT_ID = 'setAppointmentId',
  SET_AVAILABLE_SLOTS = 'setAvailableSlots',
  SET_DELETE_APPOINTMENT_ID = 'setDeleteAppointmentId',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_OFFSET, offset: number }
  | { type: ActionType.SET_SERVICE_ID, serviceId: string }
  | { type: ActionType.SET_PROVIDER_ID, providerId: string }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_CURRENT_DATE, currentDate: string }
  | { type: ActionType.SET_IS_INSURANCE; isInsurance: boolean }
  | { type: ActionType.SET_APPOINTMENT_ID; appointmentId: string }
  | { type: ActionType.SET_FACILITY; facility: FacilityPayload['facility'] }
  | { type: ActionType.SET_DELETE_APPOINTMENT_ID; deleteAppointmentId: string }
  | { type: ActionType.SET_APPOINTMENT; appointment: AppointmentPayload['appointment'] }
  | { type: ActionType.SET_APPOINTMENTS; appointments: AppointmentsPayload['appointments'] }
  | { type: ActionType.SET_AVAILABLE_SLOTS, availableSlots: DoctorSchedulePayload['slots'] }

export const appointmentReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_OFFSET:
      return {
        ...state,
        offset: action.offset
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

    case ActionType.SET_IS_INSURANCE:
      return {
        ...state,
        isInsurance: action.isInsurance
      }

    case ActionType.SET_FACILITY:
      return {
        ...state,
        facility: action.facility
      }

    case ActionType.SET_AVAILABLE_SLOTS:
      return {
        ...state,
        availableSlots: action.availableSlots
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

    case ActionType.SET_APPOINTMENT:
      return {
        ...state,
        appointment: action.appointment
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
