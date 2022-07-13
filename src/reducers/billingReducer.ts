import { CodeTablesData } from "../interfacesTypes";
import { generateString } from "../utils";

export interface State {
  employment: boolean;
  autoAccident: boolean;
  otherAccident: boolean;
  isModalOpen: boolean;
  insuranceId: string;
  tableCodesData: CodeTablesData;
  facilityId: string;
  claimNumber: string;
  isCheckoutModalOpen: boolean
}

export const initialState: State = {
  employment: false,
  autoAccident: false,
  otherAccident: false,
  isModalOpen: false,
  insuranceId: '',
  tableCodesData: {},
  facilityId: '',
  claimNumber: generateString(4),
  isCheckoutModalOpen: false
}

export enum ActionType {
  SET_EMPLOYMENT = 'SET_EMPLOYMENT',
  SET_AUTO_ACCIDENT = 'SET_AUTO_ACCIDENT',
  SET_OTHER_ACCIDENT = 'SET_OTHER_ACCIDENT',
  SET_IS_MODAL_OPEN = 'SET_IS_MODAL_OPEN',
  SET_INSURANCE_ID = 'SET_INSURANCE_ID',
  SET_TABLE_CODES_DATA = 'SET_TABLE_CODES_DATA',
  SET_FACILITY_ID = 'SET_FACILITY_ID',
  SET_CLAIM_NUMBER = 'SET_CLAIM_NUMBER',
  SET_IS_CHECKOUT_MODAL_OPEN = 'SET_IS_CHECKOUT_MODAL_OPEN'
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
  }
};
