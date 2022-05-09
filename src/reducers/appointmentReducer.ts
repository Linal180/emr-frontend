import moment from "moment";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import {
  AppointmentPayload, AppointmentsPayload, SlotsPayload, FacilityPayload, DoctorPayload
} from "../generated/graphql"

export interface State {
  page: number;
  offset: number;
  agreed: boolean;
  copied: boolean;
  serviceId: string;
  totalPages: number;
  providerId: string;
  currentDate: string;
  openDelete: boolean;
  searchQuery: string;
  serviceName: string;
  patientName: string;
  isInsurance: boolean;
  providerName: string;
  facilityName: string;
  facilityId: string;
  appointmentId: string;
  isEmployment: boolean;
  isAutoAccident: boolean;
  isOtherAccident: boolean;
  openPatientModal: boolean;
  deleteAppointmentId: string;
  date: MaterialUiPickersDate;
  doctor: DoctorPayload['doctor'];
  facility: FacilityPayload['facility'];
  availableSlots: SlotsPayload['slots'];
  appointment: AppointmentPayload['appointment'];
  appointments: AppointmentsPayload['appointments'];
  externalAppointment: {
    id: string;
    price: string;
    facilityId: string;
    patientId: string;
    providerId: string;
  };
  appointmentPaymentToken: string;
  appEdit: boolean;
  instance: any;
  appOpen: boolean;
  appPaid: boolean;
  appStatus: string;
  appInvoice: boolean;
  appPayment: boolean;
  appInvoiceNumber: string;
  appShowPayBtn: boolean;
  appDetail: boolean;
  isInvoiceNumber: boolean;
  cancelAppStatus: boolean;
  appBillingStatus: string;
}

export const initialState: State = {
  page: 1,
  serviceId: '',
  appStatus: '',
  doctor: null,
  totalPages: 0,
  copied: false,
  agreed: false,
  appEdit: false,
  instance: null,
  appOpen: false,
  appPaid: false,
  facility: null,
  providerId: '',
  appDetail: true,
  serviceName: '',
  patientName: '',
  searchQuery: '',
  appointments: [],
  providerName: '',
  facilityName: '',
  facilityId: '',
  openDelete: false,
  appointmentId: '',
  appointment: null,
  isInsurance: false,
  availableSlots: [],
  appInvoice: false,
  appPayment: false,
  appInvoiceNumber: '',
  isEmployment: false,
  appShowPayBtn: false,
  isAutoAccident: false,
  cancelAppStatus: false,
  isInvoiceNumber: false,
  isOtherAccident: false,
  openPatientModal: false,
  deleteAppointmentId: '',
  appointmentPaymentToken: "",
  offset: moment.tz().utcOffset(),
  currentDate: new Date().toDateString(),
  date: new Date() as MaterialUiPickersDate,
  externalAppointment: {
    id: '',
    price: "",
    facilityId: '',
    patientId: "",
    providerId: '',
  },
  appBillingStatus: '',
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_DATE = 'setDate',
  SET_COPIED = 'setCopied',
  SET_AGREED = 'setAgreed',
  SET_DOCTOR = 'setDoctor',
  SET_APP_EDIT = 'setAppEdit',
  SET_APP_OPEN = 'setAppOpen',
  SET_APP_PAID = 'setAppPaid',
  SET_INSTANCE = 'setInstance',
  SET_FACILITY = 'setFacility',
  SET_APP_DETAIL = 'setAppDetail',
  SET_APP_STATUS = 'setAppStatus',
  SET_SERVICE_ID = 'setServiceId',
  SET_PROVIDER_ID = 'setProviderId',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_APP_INVOICE = 'setAppInvoice',
  SET_APP_PAYMENT = 'setAppPayment',
  SET_APPOINTMENT = 'setAppointment',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_CURRENT_DATE = 'setCurrentDate',
  SET_SERVICE_NAME = 'setServiceName',
  SET_PATIENT_NAME = 'setPatientName',
  SET_IS_INSURANCE = 'setIsInsurance',
  SET_APPOINTMENTS = 'setAppointments',
  SET_IS_EMPLOYMENT = 'setIsEmployment',
  SET_FACILITY_NAME = 'setFacilityName',
  SET_FACILITY_ID = 'setFacilityId',
  SET_PROVIDER_NAME = 'setProviderName',
  SET_APPOINTMENT_ID = 'setAppointmentId',
  SET_AVAILABLE_SLOTS = 'setAvailableSlots',
  SET_APP_SHOW_PAY_BTN = 'setAppShowPayBtn',
  SET_IS_AUTO_ACCIDENT = 'setIsAutoAccident',
  SET_CANCEL_APP_STATUS = 'setCancelAppStatus',
  SET_IS_OTHER_ACCIDENT = 'setIsOtherAccident',
  SET_IS_INVOICE_NUMBER = 'setIsInvoiceNumber',
  SET_APP_INVOICE_NUMBER = 'setAppInvoiceNumber',
  SET_OPEN_PATIENT_MODAL = 'setOpenPatientModal',
  SET_EXTERNAL_APPOINTMENT = 'setExternalAppointment',
  SET_DELETE_APPOINTMENT_ID = 'setDeleteAppointmentId',
  SET_APPOINTMENT_PAYMENT_TOKEN = 'setAppointmentPaymentToken',
  SET_APP_BILLING_STATUS = 'setAppBillingStatus',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_AGREED, agreed: boolean }
  | { type: ActionType.SET_COPIED, copied: boolean }
  | { type: ActionType.SET_INSTANCE; instance: any }
  | { type: ActionType.SET_APP_EDIT; appEdit: boolean }
  | { type: ActionType.SET_APP_OPEN; appOpen: boolean }
  | { type: ActionType.SET_APP_PAID; appPaid: boolean }
  | { type: ActionType.SET_APP_STATUS; appStatus: string }
  | { type: ActionType.SET_SERVICE_ID, serviceId: string }
  | { type: ActionType.SET_APP_DETAIL; appDetail: boolean }
  | { type: ActionType.SET_PROVIDER_ID, providerId: string }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_APP_INVOICE; appInvoice: boolean }
  | { type: ActionType.SET_APP_PAYMENT; appPayment: boolean }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_DATE, date: MaterialUiPickersDate }
  | { type: ActionType.SET_SERVICE_NAME; serviceName: string }
  | { type: ActionType.SET_CURRENT_DATE, currentDate: string }
  | { type: ActionType.SET_PATIENT_NAME; patientName: string }
  | { type: ActionType.SET_IS_INSURANCE; isInsurance: boolean }
  | { type: ActionType.SET_FACILITY_NAME; facilityName: string }
  | { type: ActionType.SET_FACILITY_ID; facilityId: string }
  | { type: ActionType.SET_PROVIDER_NAME; providerName: string }
  | { type: ActionType.SET_IS_EMPLOYMENT, isEmployment: boolean }
  | { type: ActionType.SET_APPOINTMENT_ID; appointmentId: string }
  | { type: ActionType.SET_DOCTOR; doctor: DoctorPayload['doctor'] }
  | { type: ActionType.SET_APP_SHOW_PAY_BTN; appShowPayBtn: boolean }
  | { type: ActionType.SET_IS_AUTO_ACCIDENT, isAutoAccident: boolean }
  | { type: ActionType.SET_CANCEL_APP_STATUS; cancelAppStatus: boolean }
  | { type: ActionType.SET_IS_OTHER_ACCIDENT, isOtherAccident: boolean }
  | { type: ActionType.SET_IS_INVOICE_NUMBER; isInvoiceNumber: boolean }
  | { type: ActionType.SET_APP_INVOICE_NUMBER; appInvoiceNumber: string }
  | { type: ActionType.SET_OPEN_PATIENT_MODAL; openPatientModal: boolean }
  | { type: ActionType.SET_FACILITY; facility: FacilityPayload['facility'] }
  | { type: ActionType.SET_DELETE_APPOINTMENT_ID; deleteAppointmentId: string }
  | { type: ActionType.SET_AVAILABLE_SLOTS, availableSlots: SlotsPayload['slots'] }
  | { type: ActionType.SET_APPOINTMENT_PAYMENT_TOKEN; appointmentPaymentToken: string }
  | { type: ActionType.SET_APPOINTMENT; appointment: AppointmentPayload['appointment'] }
  | { type: ActionType.SET_APPOINTMENTS; appointments: AppointmentsPayload['appointments'] }
  | {
    type: ActionType.SET_EXTERNAL_APPOINTMENT; externalAppointment: {
      id: string,
      price: string,
      facilityId: string,
      patientId: string,
      providerId: string,
    }
  }
  | { type: ActionType.SET_APP_BILLING_STATUS; appBillingStatus: string }


export const appointmentReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_AGREED:
      return {
        ...state,
        agreed: action.agreed
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

    case ActionType.SET_SERVICE_NAME:
      return {
        ...state,
        serviceName: action.serviceName
      }

    case ActionType.SET_PATIENT_NAME:
      return {
        ...state,
        patientName: action.patientName
      }

    case ActionType.SET_PROVIDER_NAME:
      return {
        ...state,
        providerName: action.providerName
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

    case ActionType.SET_DOCTOR:
      return {
        ...state,
        doctor: action.doctor
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
    case ActionType.SET_EXTERNAL_APPOINTMENT:
      return {
        ...state,
        externalAppointment: action.externalAppointment
      }
    case ActionType.SET_APPOINTMENT_PAYMENT_TOKEN:
      return {
        ...state,
        appointmentPaymentToken: action.appointmentPaymentToken
      }
    case ActionType.SET_APP_EDIT:
      return {
        ...state,
        appEdit: action.appEdit
      }
    case ActionType.SET_INSTANCE:
      return {
        ...state,
        instance: action.instance
      }
    case ActionType.SET_APP_OPEN:
      return {
        ...state,
        appOpen: action.appOpen
      }
    case ActionType.SET_APP_PAID:
      return {
        ...state,
        appPaid: action.appPaid
      }
    case ActionType.SET_APP_STATUS:
      return {
        ...state,
        appStatus: action.appStatus
      }
    case ActionType.SET_APP_INVOICE:
      return {
        ...state,
        appInvoice: action.appInvoice
      }
    case ActionType.SET_APP_PAYMENT:
      return {
        ...state,
        appPayment: action.appPayment
      }
    case ActionType.SET_APP_INVOICE_NUMBER:
      return {
        ...state,
        appInvoiceNumber: action.appInvoiceNumber
      }
    case ActionType.SET_APP_SHOW_PAY_BTN:
      return {
        ...state,
        appShowPayBtn: action.appShowPayBtn
      }
    case ActionType.SET_APP_DETAIL:
      return {
        ...state,
        appDetail: action.appDetail
      }
    case ActionType.SET_IS_INVOICE_NUMBER:
      return {
        ...state,
        isInvoiceNumber: action.isInvoiceNumber
      }
    case ActionType.SET_CANCEL_APP_STATUS:
      return {
        ...state,
        cancelAppStatus: action.cancelAppStatus
      }
    case ActionType.SET_APP_BILLING_STATUS:
      return {
        ...state,
        appBillingStatus: action.appBillingStatus
      }
    case ActionType.SET_OPEN_PATIENT_MODAL:
      return {
        ...state,
        openPatientModal: action.openPatientModal
      }
  }
};
