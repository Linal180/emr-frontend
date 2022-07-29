import { CodeTablesData } from "../interfacesTypes";

export interface State {
  facilityId: string;
  practiceId: string;
  insuranceId: string;
  claimNumber: string;
  employment: boolean;
  selectedTab: string;
  isModalOpen: boolean;
  autoAccident: boolean;
  otherAccident: boolean;
  shouldCheckout: boolean;
  isCheckoutModalOpen: boolean
  tableCodesData: CodeTablesData;
}

export const initialState: State = {
  facilityId: '',
  practiceId: '',
  claimNumber: '',
  insuranceId: '',
  selectedTab: '1',
  employment: false,
  isModalOpen: false,
  tableCodesData: {},
  autoAccident: false,
  otherAccident: false,
  shouldCheckout: false,
  isCheckoutModalOpen: false,
}

export enum ActionType {
  SET_EMPLOYMENT = 'SET_EMPLOYMENT',
  SET_FACILITY_ID = 'SET_FACILITY_ID',
  SET_PRACTICE_ID = 'SET_PRACTICE_ID',
  SET_INSURANCE_ID = 'SET_INSURANCE_ID',
  SET_SELECTED_TAB = 'SET_SELECTED_TAB',
  SET_CLAIM_NUMBER = 'SET_CLAIM_NUMBER',
  SET_AUTO_ACCIDENT = 'SET_AUTO_ACCIDENT',
  SET_IS_MODAL_OPEN = 'SET_IS_MODAL_OPEN',
  SET_OTHER_ACCIDENT = 'SET_OTHER_ACCIDENT',
  SET_SHOULD_CHECKOUT = 'SET_SHOULD_CHECKOUT',
  SET_TABLE_CODES_DATA = 'SET_TABLE_CODES_DATA',
  SET_IS_CHECKOUT_MODAL_OPEN = 'SET_IS_CHECKOUT_MODAL_OPEN',
}

export type Action =
  | { type: ActionType.SET_EMPLOYMENT, employment: boolean }
  | { type: ActionType.SET_AUTO_ACCIDENT, autoAccident: boolean }
  | { type: ActionType.SET_OTHER_ACCIDENT, otherAccident: boolean }
  | { type: ActionType.SET_IS_MODAL_OPEN, isModalOpen: boolean }
  | { type: ActionType.SET_INSURANCE_ID, insuranceId: string }
  | { type: ActionType.SET_TABLE_CODES_DATA, tableCodesData: CodeTablesData }
  | { type: ActionType.SET_FACILITY_ID, facilityId: string }
  | { type: ActionType.SET_CLAIM_NUMBER, claimNumber: string }
  | { type: ActionType.SET_IS_CHECKOUT_MODAL_OPEN, isCheckoutModalOpen: boolean }
  | { type: ActionType.SET_PRACTICE_ID, practiceId: string }
  | { type: ActionType.SET_SHOULD_CHECKOUT, shouldCheckout: boolean }
  | { type: ActionType.SET_SELECTED_TAB, selectedTab: string }


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
  }
};
