import moment from "moment";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { AppointmentPayload, AppointmentsPayload, DoctorSlotsPayload, FacilityPayload } from "../generated/graphql"

export interface State {
  page: number;
  offset: number;
  copied: boolean;
  serviceId: string;
  totalPages: number;
  providerId: string;
  currentDate: string;
  openDelete: boolean;
  searchQuery: string;
  isInsurance: boolean;
  appointmentId: string;
  isEmployment: boolean;
  isAutoAccident: boolean;
  isOtherAccident: boolean;
  deleteAppointmentId: string;
  date: MaterialUiPickersDate;
  facility: FacilityPayload['facility'];
  availableSlots: DoctorSlotsPayload['slots'];
  appointment: AppointmentPayload['appointment'];
  appointments: AppointmentsPayload['appointments'];
}

export const initialState: State = {
  page: 1,
  serviceId: '',
  totalPages: 0,
  copied: false,
  providerId: '',
  facility: null,
  searchQuery: '',
  appointments: [],
  openDelete: false,
  appointmentId: '',
  appointment: null,
  isInsurance: false,
  availableSlots: [],
  isEmployment: false,
  isAutoAccident: false,
  isOtherAccident: false,
  deleteAppointmentId: '',
  offset: moment.tz().zone(),
  currentDate: new Date().toDateString(),
  date: new Date() as MaterialUiPickersDate,
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_DATE = 'setDate',
  SET_COPIED = 'setCopied',
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
  SET_IS_EMPLOYMENT = 'setIsEmployment',
  SET_APPOINTMENT_ID = 'setAppointmentId',
  SET_AVAILABLE_SLOTS = 'setAvailableSlots',
  SET_IS_AUTO_ACCIDENT = 'setIsAutoAccident',
  SET_IS_OTHER_ACCIDENT = 'setIsOtherAccident',
  SET_DELETE_APPOINTMENT_ID = 'setDeleteAppointmentId',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_COPIED, copied: boolean }
  | { type: ActionType.SET_SERVICE_ID, serviceId: string }
  | { type: ActionType.SET_PROVIDER_ID, providerId: string }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_DATE, date: MaterialUiPickersDate }
  | { type: ActionType.SET_CURRENT_DATE, currentDate: string }
  | { type: ActionType.SET_IS_INSURANCE; isInsurance: boolean }
  | { type: ActionType.SET_IS_EMPLOYMENT, isEmployment: boolean }
  | { type: ActionType.SET_APPOINTMENT_ID; appointmentId: string }
  | { type: ActionType.SET_IS_AUTO_ACCIDENT, isAutoAccident: boolean }
  | { type: ActionType.SET_IS_OTHER_ACCIDENT, isOtherAccident: boolean }
  | { type: ActionType.SET_FACILITY; facility: FacilityPayload['facility'] }
  | { type: ActionType.SET_DELETE_APPOINTMENT_ID; deleteAppointmentId: string }
  | { type: ActionType.SET_APPOINTMENT; appointment: AppointmentPayload['appointment'] }
  | { type: ActionType.SET_AVAILABLE_SLOTS, availableSlots: DoctorSlotsPayload['slots'] }
  | { type: ActionType.SET_APPOINTMENTS; appointments: AppointmentsPayload['appointments'] }

export const appointmentReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_DATE:
      return {
        ...state,
        date: action.date
      }

    case ActionType.SET_COPIED:
      return {
        ...state,
        copied: action.copied
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

    case ActionType.SET_IS_EMPLOYMENT:
      return {
        ...state,
        isEmployment: action.isEmployment
      }

    case ActionType.SET_IS_OTHER_ACCIDENT:
      return {
        ...state,
        isOtherAccident: action.isOtherAccident
      }

    case ActionType.SET_IS_AUTO_ACCIDENT:
      return {
        ...state,
        isAutoAccident: action.isAutoAccident
      }
  }
};
