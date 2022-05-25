import { Dropin } from "braintree-web-drop-in";
import { AchAccountType } from "../interfacesTypes";

export interface State {
  price: string;
  appointmentPaymentToken: string;
  patientId: string;
  facilityId: string;
  providerId: string;
  showPayBtn: boolean;
  instance: Dropin | null;
  achPayment: boolean;
  ownershipType: AchAccountType;
  loader: boolean
}

export const initialState: State = {
  price: '',
  appointmentPaymentToken: '',
  patientId: '',
  facilityId: '',
  providerId: '',
  showPayBtn: false,
  instance: null,
  achPayment: false,
  ownershipType: 'personal',
  loader: false
}

export enum ActionType {
  SET_PRICE = 'setPage',
  SET_PAYMENT_TOKEN = 'setPaymentToken',
  SET_PATIENT_ID = 'setPatientId',
  SET_FACILITY_ID = 'setFacilityId',
  SET_PROVIDER_ID = 'setProviderId',
  SET_SHOW_PAY_BUTTON = 'setShowPayBtn',
  SET_INSTANCE = 'setInstance',
  SET_ACH_PAYMENT = 'setAchPayment',
  SET_OWNERSHIP_TYPE = 'setOwnershipType',
  SET_LOADER = 'setLoader'
}

export type Action = { type: ActionType.SET_PRICE; price: string } |
{ type: ActionType.SET_PAYMENT_TOKEN; appointmentPaymentToken: string } |
{ type: ActionType.SET_PATIENT_ID; patientId: string } |
{ type: ActionType.SET_FACILITY_ID; facilityId: string } |
{ type: ActionType.SET_PROVIDER_ID; providerId: string } |
{ type: ActionType.SET_SHOW_PAY_BUTTON; showPayBtn: boolean } |
{ type: ActionType.SET_INSTANCE; instance: Dropin | null } |
{ type: ActionType.SET_ACH_PAYMENT; achPayment: boolean } |
{ type: ActionType.SET_OWNERSHIP_TYPE; ownershipType: AchAccountType } |
{ type: ActionType.SET_LOADER; loader: boolean }

export const externalPaymentReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PRICE:
      return {
        ...state,
        price: action.price
      }

    case ActionType.SET_PAYMENT_TOKEN:
      return {
        ...state,
        appointmentPaymentToken: action.appointmentPaymentToken
      }

    case ActionType.SET_PATIENT_ID:
      return {
        ...state,
        patientId: action.patientId
      }

    case ActionType.SET_FACILITY_ID:
      return {
        ...state,
        facilityId: action.facilityId
      }

    case ActionType.SET_PROVIDER_ID:
      return {
        ...state,
        providerId: action.providerId
      }

    case ActionType.SET_SHOW_PAY_BUTTON:
      return {
        ...state,
        showPayBtn: action.showPayBtn
      }

    case ActionType.SET_INSTANCE:
      return {
        ...state,
        instance: action.instance
      }

    case ActionType.SET_ACH_PAYMENT:
      return {
        ...state,
        achPayment: action.achPayment
      }

    case ActionType.SET_OWNERSHIP_TYPE:
      return {
        ...state,
        ownershipType: action.ownershipType
      }
    case ActionType.SET_LOADER:
      return {
        ...state,
        loader: action.loader
      }
  }
}