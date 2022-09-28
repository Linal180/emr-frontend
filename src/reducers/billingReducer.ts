import { BillingStatus } from "../generated/graphql";
import { CodeTablesData } from "../interfacesTypes";

export interface State {
  facilityId: string;
  practiceId: string;
  providerId: string;
  insuranceId: string;
  claimNumber: string;
  employment: boolean;
  selectedTab: string;
  isModalOpen: boolean;
  autoAccident: boolean;
  selfPayModal: boolean;
  otherAccident: boolean;
  shouldCheckout: boolean;
  isClaimCreated: boolean;
  isCheckoutModalOpen: boolean;
  tableCodesData: CodeTablesData;
  insuranceStatus: string;
  billingStatus: BillingStatus | null
  claimModalOpen: boolean;
  claimErrorMessages: string[]
  shouldSubmitPayment: boolean
}

export const initialState: State = {
  facilityId: '',
  practiceId: '',
  providerId: '',
  claimNumber: '',
  insuranceId: '',
  selectedTab: '1',
  employment: false,
  isModalOpen: false,
  tableCodesData: {},
  selfPayModal: false,
  autoAccident: false,
  billingStatus: null,
  otherAccident: false,
  shouldCheckout: false,
  insuranceStatus: '',
  isClaimCreated: false,
  isCheckoutModalOpen: false,
  claimModalOpen: false,
  claimErrorMessages: [],
  shouldSubmitPayment: false
}

export enum ActionType {
  SET_EMPLOYMENT = 'SET_EMPLOYMENT',
  SET_FACILITY_ID = 'SET_FACILITY_ID',
  SET_PRACTICE_ID = 'SET_PRACTICE_ID',
  SET_PROVIDER_ID = 'SET_PROVIDER_ID',
  SET_INSURANCE_ID = 'SET_INSURANCE_ID',
  SET_SELECTED_TAB = 'SET_SELECTED_TAB',
  SET_CLAIM_NUMBER = 'SET_CLAIM_NUMBER',
  SET_AUTO_ACCIDENT = 'SET_AUTO_ACCIDENT',
  SET_IS_MODAL_OPEN = 'SET_IS_MODAL_OPEN',
  SET_CLAIM_CREATED = "SET_CLAIM_CREATED",
  SET_OTHER_ACCIDENT = 'SET_OTHER_ACCIDENT',
  SET_SELF_PAY_MODAL = 'SET_SELF_PAY_MODAL',
  SET_BILLING_STATUS = 'SET_BILLING_STATUS',
  SET_SHOULD_CHECKOUT = 'SET_SHOULD_CHECKOUT',
  SET_TABLE_CODES_DATA = 'SET_TABLE_CODES_DATA',
  SET_IS_CHECKOUT_MODAL_OPEN = 'SET_IS_CHECKOUT_MODAL_OPEN',
  SET_INSURANCE_STATUS = 'SET_INSURANCE_STATUS',
  SET_CLAIM_MODAL_OPEN = 'SET_CLAIM_MODAL_OPEN',
  SET_CLAIM_ERROR_MESSAGES = 'SET_CLAIM_ERROR_MESSAGES',
  SET_SHOULD_SUBMIT_PAYMENT = 'SET_SHOULD_SUBMIT_PAYMENT'
}

export type Action =
  | { type: ActionType.SET_EMPLOYMENT, employment: boolean }
  | { type: ActionType.SET_FACILITY_ID, facilityId: string }
  | { type: ActionType.SET_PRACTICE_ID, practiceId: string }
  | { type: ActionType.SET_PROVIDER_ID, providerId: string }
  | { type: ActionType.SET_INSURANCE_ID, insuranceId: string }
  | { type: ActionType.SET_CLAIM_NUMBER, claimNumber: string }
  | { type: ActionType.SET_SELECTED_TAB, selectedTab: string }
  | { type: ActionType.SET_IS_MODAL_OPEN, isModalOpen: boolean }
  | { type: ActionType.SET_AUTO_ACCIDENT, autoAccident: boolean }
  | { type: ActionType.SET_SELF_PAY_MODAL, selfPayModal: boolean }
  | { type: ActionType.SET_OTHER_ACCIDENT, otherAccident: boolean }
  | { type: ActionType.SET_CLAIM_CREATED, isClaimCreated: boolean }
  | { type: ActionType.SET_SHOULD_CHECKOUT, shouldCheckout: boolean }
  | { type: ActionType.SET_INSURANCE_STATUS, insuranceStatus: string }
  | { type: ActionType.SET_TABLE_CODES_DATA, tableCodesData: CodeTablesData }
  | { type: ActionType.SET_BILLING_STATUS, billingStatus: BillingStatus | null }
  | { type: ActionType.SET_IS_CHECKOUT_MODAL_OPEN, isCheckoutModalOpen: boolean }
  | { type: ActionType.SET_CLAIM_MODAL_OPEN, claimModalOpen: boolean }
  | { type: ActionType.SET_CLAIM_ERROR_MESSAGES, claimErrorMessages: string[] }
  | { type: ActionType.SET_SHOULD_SUBMIT_PAYMENT, shouldSubmitPayment: boolean }


export const billingReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_EMPLOYMENT:
      return {
        ...state,
        employment: action.employment
      }

    case ActionType.SET_AUTO_ACCIDENT:
      return {
        ...state,
        autoAccident: action.autoAccident
      }

    case ActionType.SET_OTHER_ACCIDENT:
      return {
        ...state,
        otherAccident: action.otherAccident
      }

    case ActionType.SET_IS_MODAL_OPEN:
      return {
        ...state,
        isModalOpen: action.isModalOpen
      }

    case ActionType.SET_INSURANCE_ID:
      return {
        ...state,
        insuranceId: action.insuranceId
      }

    case ActionType.SET_TABLE_CODES_DATA:
      return {
        ...state,
        tableCodesData: action.tableCodesData
      }

    case ActionType.SET_FACILITY_ID:
      return {
        ...state,
        facilityId: action.facilityId
      }

    case ActionType.SET_CLAIM_NUMBER:
      return {
        ...state,
        claimNumber: action.claimNumber
      }

    case ActionType.SET_IS_CHECKOUT_MODAL_OPEN:
      return {
        ...state,
        isCheckoutModalOpen: action.isCheckoutModalOpen
      }

    case ActionType.SET_PRACTICE_ID:
      return {
        ...state,
        practiceId: action.practiceId
      }

    case ActionType.SET_SHOULD_CHECKOUT:
      return {
        ...state,
        shouldCheckout: action.shouldCheckout
      }

    case ActionType.SET_SELECTED_TAB:
      return {
        ...state,
        selectedTab: action.selectedTab
      }

    case ActionType.SET_CLAIM_CREATED:
      return {
        ...state,
        isClaimCreated: action.isClaimCreated
      }

    case ActionType.SET_PROVIDER_ID:
      return {
        ...state,
        providerId: action.providerId
      }

    case ActionType.SET_SELF_PAY_MODAL:
      return {
        ...state,
        selfPayModal: action.selfPayModal
      }

    case ActionType.SET_BILLING_STATUS:
      return {
        ...state,
        billingStatus: action.billingStatus
      }

    case ActionType.SET_INSURANCE_STATUS:
      return {
        ...state,
        insuranceStatus: action.insuranceStatus
      }

    case ActionType.SET_CLAIM_MODAL_OPEN:
      return {
        ...state,
        claimModalOpen: action.claimModalOpen
      }

    case ActionType.SET_CLAIM_ERROR_MESSAGES:
      return {
        ...state,
        claimErrorMessages: action.claimErrorMessages
      }

    case ActionType.SET_SHOULD_SUBMIT_PAYMENT:
      return {
        ...state,
        shouldSubmitPayment: action.shouldSubmitPayment
      }
  }
};
