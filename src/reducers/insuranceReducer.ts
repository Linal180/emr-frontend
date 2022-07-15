import { EMPTY_OPTION } from "../constants"
import { SelectorOption } from "../interfacesTypes"

export interface State {
  policyId: string
  activeStep: number
  isFormLoaded: boolean
  policyHolderId: string
  insuranceId: SelectorOption
  numberOfFiles: number
}

export const initialState: State = {
  policyId: '',
  activeStep: 0,
  isFormLoaded: true,
  policyHolderId: '',
  insuranceId: EMPTY_OPTION,
  numberOfFiles: 0
}

export enum ActionType {
  SET_POLICY_ID = 'SET_POLICY_ID',
  SET_ACTIVE_STEP = 'SET_ACTIVE_STEP',
  SET_IS_FORM_LOADED = 'SET_IS_FORM_LOADED',
  SET_POLICY_HOLDER_ID = 'SET_POLICY_HOLDER_ID',
  SET_INSURANCE_ID = 'SET_INSURANCE_ID',
  SET_NUMBER_OF_FILES = 'SET_NUMBER_OF_FILES'
}

export type Action =
  | { type: ActionType.SET_POLICY_ID, policyId: string }
  | { type: ActionType.SET_ACTIVE_STEP, activeStep: number }
  | { type: ActionType.SET_IS_FORM_LOADED, isFormLoaded: boolean }
  | { type: ActionType.SET_POLICY_HOLDER_ID, policyHolderId: string }
  | { type: ActionType.SET_INSURANCE_ID, insuranceId: SelectorOption }
  | { type: ActionType.SET_NUMBER_OF_FILES, numberOfFiles: number }

export const insuranceReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_POLICY_ID:
      return {
        ...state,
        policyId: action.policyId
      }

    case ActionType.SET_ACTIVE_STEP:
      return {
        ...state,
        activeStep: action.activeStep
      }

    case ActionType.SET_IS_FORM_LOADED:
      return {
        ...state,
        isFormLoaded: action.isFormLoaded
      }

    case ActionType.SET_POLICY_HOLDER_ID:
      return {
        ...state,
        policyHolderId: action.policyHolderId
      }

    case ActionType.SET_INSURANCE_ID:
      return {
        ...state,
        insuranceId: action.insuranceId
      }

    case ActionType.SET_NUMBER_OF_FILES:
      return {
        ...state,
        numberOfFiles: action.numberOfFiles
      }
  }
};
