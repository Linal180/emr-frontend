import moment from "moment";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import {
  AppointmentPayload, AppointmentsPayload, SlotsPayload, FacilityPayload, DoctorPayload, AgreementsPayload
} from "../generated/graphql"

export interface State {
  page: number;
  instance: any;
  offset: number;
  isEdit: boolean;
  agreed: boolean;
  copied: boolean;
  appEdit: boolean;
  appOpen: boolean;
  appPaid: boolean;
  serviceId: string;
  appStatus: string;
  patientId: string;
  facilityId: string;
  totalPages: number;
  providerId: string;
  appDetail: boolean;
  pageComing: number;
  currentDate: string;
  openDelete: boolean;
  searchQuery: string;
  serviceName: string;
  patientName: string;
  appInvoice: boolean;
  appPayment: boolean;
  isInsurance: boolean;
  providerName: string;
  facilityName: string;
  appStartDate: string;
  appointmentId: string;
  isEmployment: boolean;
  pageCompleted: number;
  appShowPayBtn: boolean;
  isAutoAccident: boolean;
  appInvoiceNumber: string;
  isInvoiceNumber: boolean;
  cancelAppStatus: boolean;
  isOtherAccident: boolean;
  appBillingStatus: string;
  totalPagesComing: number;
  openPatientModal: boolean;
  deleteAppointmentId: string;
  date: MaterialUiPickersDate;
  totalPagesCompleted: number;
  doctor: DoctorPayload['doctor'];
  appointmentPaymentToken: string;
  facility: FacilityPayload['facility'];
  availableSlots: SlotsPayload['slots'];
  upComing: AppointmentsPayload['appointments'];
  completed: AppointmentsPayload['appointments'];
  appointment: AppointmentPayload['appointment'];
  appointments: AppointmentsPayload['appointments'];
  externalAppointment: {
    id: string;
    price: string;
    facilityId: string;
    patientId: string;
    providerId: string;
  };
  primaryInsurance: string
  appointmentCreateType: string
  sortBy: string;
  agreements: AgreementsPayload['agreements'];
  isSignature: boolean
}

export const initialState: State = {
  page: 1,
  upComing: [],
  completed: [],
  serviceId: '',
  appStatus: '',
  doctor: null,
  totalPages: 0,
  copied: false,
  isEdit: false,
  patientId: '',
  agreed: false,
  appEdit: false,
  instance: null,
  appOpen: false,
  appPaid: false,
  pageComing: 1,
  facilityId: '',
  facility: null,
  providerId: '',
  appDetail: true,
  serviceName: '',
  patientName: '',
  searchQuery: '',
  appointments: [],
  providerName: '',
  facilityName: '',
  appStartDate: '',
  pageCompleted: 1,
  openDelete: false,
  appointmentId: '',
  appointment: null,
  appInvoice: false,
  appPayment: false,
  isInsurance: false,
  availableSlots: [],
  totalPagesComing: 0,
  isEmployment: false,
  appBillingStatus: '',
  appShowPayBtn: false,
  appInvoiceNumber: '',
  isAutoAccident: false,
  totalPagesCompleted: 0,
  cancelAppStatus: false,
  isInvoiceNumber: false,
  isOtherAccident: false,
  deleteAppointmentId: '',
  openPatientModal: false,
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
  primaryInsurance: '',
  appointmentCreateType: '',
  sortBy: 'ASC',
  agreements: [],
  isSignature: false
}


export enum ActionType {
  SET_PAGE = 'setPage',
  SET_DATE = 'setDate',
  SET_COPIED = 'setCopied',
  SET_AGREED = 'setAgreed',
  SET_DOCTOR = 'setDoctor',
  SET_IS_EDIT = 'setIsEdit',
  SET_APP_EDIT = 'setAppEdit',
  SET_APP_OPEN = 'setAppOpen',
  SET_APP_PAID = 'setAppPaid',
  SET_INSTANCE = 'setInstance',
  SET_FACILITY = 'setFacility',
  SET_UP_COMING = 'setUpComing',
  SET_COMPLETED = 'setComplete',
  SET_PATIENT_ID = 'setPatientId',
  SET_APP_DETAIL = 'setAppDetail',
  SET_APP_STATUS = 'setAppStatus',
  SET_SERVICE_ID = 'setServiceId',
  SET_PAGE_COMING = 'setPageComing',
  SET_PROVIDER_ID = 'setProviderId',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_FACILITY_ID = 'setFacilityId',
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
  SET_PROVIDER_NAME = 'setProviderName',
  SET_APP_START_DATE = 'setAppStartDate',
  SET_PAGE_COMPLETED = 'setPageCompleted',
  SET_APPOINTMENT_ID = 'setAppointmentId',
  SET_AVAILABLE_SLOTS = 'setAvailableSlots',
  SET_APP_SHOW_PAY_BTN = 'setAppShowPayBtn',
  SET_IS_AUTO_ACCIDENT = 'setIsAutoAccident',
  SET_CANCEL_APP_STATUS = 'setCancelAppStatus',
  SET_IS_OTHER_ACCIDENT = 'setIsOtherAccident',
  SET_IS_INVOICE_NUMBER = 'setIsInvoiceNumber',
  SET_TOTAL_PAGES_COMING = 'setTotalPagesComing',
  SET_APP_INVOICE_NUMBER = 'setAppInvoiceNumber',
  SET_OPEN_PATIENT_MODAL = 'setOpenPatientModal',
  SET_APP_BILLING_STATUS = 'setAppBillingStatus',
  SET_EXTERNAL_APPOINTMENT = 'setExternalAppointment',
  SET_DELETE_APPOINTMENT_ID = 'setDeleteAppointmentId',
  SET_TOTAL_PAGES_COMPLETED = 'setTotalPagesCompleted',
  SET_APPOINTMENT_PAYMENT_TOKEN = 'setAppointmentPaymentToken',
  SET_PRIMARY_INSURANCE = 'setPrimaryInsurance',
  SET_APPOINTMENT_CREATE_TYPE = 'setAppointmentCreateType',
  SET_SORT_BY = 'setSortBy',
  SET_AGREEMENTS = 'setAgreements',
  SET_SIGNATURE = 'setSignature'
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_AGREED, agreed: boolean }
  | { type: ActionType.SET_COPIED, copied: boolean }
  | { type: ActionType.SET_INSTANCE; instance: any }
  | { type: ActionType.SET_IS_EDIT, isEdit: boolean }
  | { type: ActionType.SET_APP_EDIT; appEdit: boolean }
  | { type: ActionType.SET_APP_OPEN; appOpen: boolean }
  | { type: ActionType.SET_APP_PAID; appPaid: boolean }
  | { type: ActionType.SET_APP_STATUS; appStatus: string }
  | { type: ActionType.SET_PATIENT_ID; patientId: string }
  | { type: ActionType.SET_SERVICE_ID, serviceId: string }
  | { type: ActionType.SET_APP_DETAIL; appDetail: boolean }
  | { type: ActionType.SET_PAGE_COMING; pageComing: number }
  | { type: ActionType.SET_FACILITY_ID; facilityId: string }
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
  | { type: ActionType.SET_PROVIDER_NAME; providerName: string }
  | { type: ActionType.SET_APP_START_DATE; appStartDate: string }
  | { type: ActionType.SET_IS_EMPLOYMENT, isEmployment: boolean }
  | { type: ActionType.SET_PAGE_COMPLETED; pageCompleted: number }
  | { type: ActionType.SET_APPOINTMENT_ID; appointmentId: string }
  | { type: ActionType.SET_DOCTOR; doctor: DoctorPayload['doctor'] }
  | { type: ActionType.SET_APP_SHOW_PAY_BTN; appShowPayBtn: boolean }
  | { type: ActionType.SET_IS_AUTO_ACCIDENT, isAutoAccident: boolean }
  | { type: ActionType.SET_CANCEL_APP_STATUS; cancelAppStatus: boolean }
  | { type: ActionType.SET_IS_OTHER_ACCIDENT, isOtherAccident: boolean }
  | { type: ActionType.SET_IS_INVOICE_NUMBER; isInvoiceNumber: boolean }
  | { type: ActionType.SET_TOTAL_PAGES_COMING; totalPagesComing: number }
  | { type: ActionType.SET_APP_BILLING_STATUS; appBillingStatus: string }
  | { type: ActionType.SET_APP_INVOICE_NUMBER; appInvoiceNumber: string }
  | { type: ActionType.SET_OPEN_PATIENT_MODAL; openPatientModal: boolean }
  | { type: ActionType.SET_FACILITY; facility: FacilityPayload['facility'] }
  | { type: ActionType.SET_TOTAL_PAGES_COMPLETED; totalPagesCompleted: number }
  | { type: ActionType.SET_DELETE_APPOINTMENT_ID; deleteAppointmentId: string }
  | { type: ActionType.SET_AVAILABLE_SLOTS, availableSlots: SlotsPayload['slots'] }
  | { type: ActionType.SET_UP_COMING; upComing: AppointmentsPayload['appointments'] }
  | { type: ActionType.SET_COMPLETED; completed: AppointmentsPayload['appointments'] }
  | { type: ActionType.SET_APPOINTMENT_PAYMENT_TOKEN; appointmentPaymentToken: string }
  | { type: ActionType.SET_APPOINTMENT; appointment: AppointmentPayload['appointment'] }
  | { type: ActionType.SET_APPOINTMENTS; appointments: AppointmentsPayload['appointments'] }
  | { type: ActionType.SET_PRIMARY_INSURANCE; primaryInsurance: string }
  | { type: ActionType.SET_APPOINTMENT_CREATE_TYPE; appointmentCreateType: string }
  | { type: ActionType.SET_SORT_BY; sortBy: string }
  | { type: ActionType.SET_AGREEMENTS; agreements: AgreementsPayload['agreements'] }
  | { type: ActionType.SET_SIGNATURE; isSignature: boolean }
  | {
    type: ActionType.SET_EXTERNAL_APPOINTMENT; externalAppointment: {
      id: string,
      price: string,
      facilityId: string,
      patientId: string,
      providerId: string,
    }
  }

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

    case ActionType.SET_IS_EDIT:
      return {
        ...state,
        isEdit: action.isEdit
      }

    case ActionType.SET_DATE:
      return {
        ...state,
        date: action.date
      }

    case ActionType.SET_APP_START_DATE:
      return {
        ...state,
        appStartDate: action.appStartDate
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

    case ActionType.SET_PATIENT_ID:
      return {
        ...state,
        patientId: action.patientId
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
    case ActionType.SET_PAGE_COMPLETED:
      return {
        ...state,
        pageCompleted: action.pageCompleted
      }

    case ActionType.SET_PAGE_COMING:
      return {
        ...state,
        pageComing: action.pageComing
      }
    case ActionType.SET_TOTAL_PAGES_COMING:
      return {
        ...state,
        totalPagesComing: action.totalPagesComing
      }

    case ActionType.SET_COMPLETED:
      return {
        ...state,
        completed: action.completed
      }

    case ActionType.SET_UP_COMING:
      return {
        ...state,
        upComing: action.upComing
      }
    case ActionType.SET_TOTAL_PAGES_COMPLETED:
      return {
        ...state,
        totalPagesCompleted: action.totalPagesCompleted
      }
    case ActionType.SET_PRIMARY_INSURANCE:
      return {
        ...state,
        primaryInsurance: action.primaryInsurance
      }
    case ActionType.SET_APPOINTMENT_CREATE_TYPE:
      return {
        ...state,
        appointmentCreateType: action.appointmentCreateType
      }

    case ActionType.SET_SORT_BY:
      return {
        ...state,
        sortBy: action.sortBy
      }

    case ActionType.SET_AGREEMENTS:
      return {
        ...state,
        agreements: action.agreements
      }

    case ActionType.SET_SIGNATURE:
      return {
        ...state,
        isSignature: action.isSignature
      }
  }
};
