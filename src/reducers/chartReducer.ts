import {
  Allergies, AllergiesPayload, IcdCodes, IcdCodesPayload, IcdCodesWithSnowMedCode, PatientVitalPayload, ReactionsPayload
} from "../generated/graphql";
import { multiOptionType } from "../interfacesTypes";

export interface State {
  itemId: string;
  newRecord: string;
  searchQuery: string;
  reactionPage: number;
  anchorEl: HTMLElement | null;
  isFormOpen: HTMLElement | null;
  isSearchOpen: HTMLElement | null;
  selectedReactions: multiOptionType[]
  reactionList: ReactionsPayload['reactions'];
  selectedItem: Allergies | IcdCodesWithSnowMedCode | IcdCodes | undefined;
  patientVitals: PatientVitalPayload['patientVital'];
  searchedData: AllergiesPayload['allergies'] | IcdCodesPayload['icdCodes'];
  isSubModalOpen: boolean;
  allergyDeleteId: string;
  problemDeleteId: string;
}

export const initialState: State = {
  itemId: '',
  newRecord: '',
  anchorEl: null,
  reactionPage: 1,
  searchQuery: '',
  isFormOpen: null,
  searchedData: [],
  reactionList: [],
  isSearchOpen: null,
  patientVitals: null,
  selectedReactions: [],
  selectedItem: undefined,
  isSubModalOpen: false,
  allergyDeleteId: '',
  problemDeleteId: '',
}

export enum ActionType {
  SET_ITEM_ID = 'setItemId',
  SET_ANCHOR_EL = 'setAnchorEl',
  SET_NEW_RECORD = 'setNewRecord',
  SET_IS_FORM_OPEN = 'setFormOpen',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_IS_SEARCH_OPEN = 'setSearchOpen',
  SET_SELECTED_ITEM = 'setSelectedItem',
  SET_REACTION_PAGE = 'setReactionPage',
  SET_REACTION_LIST = 'setReactionList',
  SET_SEARCHED_DATA = 'setSearchedData',
  SET_PATIENT_VITALS = 'setPatientVitals',
  SET_SELECTED_REACTIONS = "SET_SELECTED_REACTIONS",
  SET_IS_SUB_MODAL_OPEN = "SET_IS_SUB_MODAL_OPEN",
  SET_ALLERGY_DELETE_ID = "SET_ALLERGY_DELETE_ID",
  SET_PROBLEM_DELETE_ID = "SET_PROBLEM_DELETE_ID"
}

export type Action =
  | { type: ActionType.SET_ITEM_ID, itemId: string }
  | { type: ActionType.SET_NEW_RECORD, newRecord: string }
  | { type: ActionType.SET_SEARCH_QUERY, searchQuery: string }
  | { type: ActionType.SET_REACTION_PAGE, reactionPage: number }
  | { type: ActionType.SET_ANCHOR_EL; anchorEl: HTMLElement | null }
  | { type: ActionType.SET_IS_FORM_OPEN, isFormOpen: HTMLElement | null }
  | { type: ActionType.SET_IS_SEARCH_OPEN, isSearchOpen: HTMLElement | null }
  | { type: ActionType.SET_SELECTED_REACTIONS, selectedReactions: multiOptionType[] }
  | { type: ActionType.SET_REACTION_LIST, reactionList: ReactionsPayload['reactions'] }
  | { type: ActionType.SET_SELECTED_ITEM, selectedItem: Allergies | IcdCodesWithSnowMedCode | IcdCodes | undefined }
  | { type: ActionType.SET_PATIENT_VITALS, patientVitals: PatientVitalPayload['patientVital'] }
  | { type: ActionType.SET_SEARCHED_DATA, searchedData: AllergiesPayload['allergies'] | IcdCodesPayload['icdCodes'] }
  | { type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: boolean }
  | { type: ActionType.SET_ALLERGY_DELETE_ID, allergyDeleteId: string }
  | { type: ActionType.SET_PROBLEM_DELETE_ID, problemDeleteId: string }


export const chartReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_IS_SEARCH_OPEN:
      return {
        ...state,
        isSearchOpen: action.isSearchOpen
      }

    case ActionType.SET_ITEM_ID:
      return {
        ...state,
        itemId: action.itemId
      }

    case ActionType.SET_NEW_RECORD:
      return {
        ...state,
        newRecord: action.newRecord
      }

    case ActionType.SET_PATIENT_VITALS:
      return {
        ...state,
        patientVitals: action.patientVitals
      }

    case ActionType.SET_ANCHOR_EL:
      return {
        ...state,
        anchorEl: action.anchorEl
      }

    case ActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.searchQuery
      }

    case ActionType.SET_SELECTED_REACTIONS:
      return {
        ...state,
        selectedReactions: action.selectedReactions
      }

    case ActionType.SET_IS_FORM_OPEN:
      return {
        ...state,
        isFormOpen: action.isFormOpen
      }

    case ActionType.SET_SELECTED_ITEM:
      return {
        ...state,
        selectedItem: action.selectedItem
      }

    case ActionType.SET_SEARCHED_DATA:
      return {
        ...state,
        searchedData: action.searchedData
      }

    case ActionType.SET_REACTION_LIST:
      return {
        ...state,
        reactionList: action.reactionList
      }

    case ActionType.SET_REACTION_PAGE:
      return {
        ...state,
        reactionPage: action.reactionPage
      }

    case ActionType.SET_IS_SUB_MODAL_OPEN:
      return {
        ...state,
        isSubModalOpen: action.isSubModalOpen
      }

    case ActionType.SET_ALLERGY_DELETE_ID:
      return {
        ...state,
        allergyDeleteId: action.allergyDeleteId
      }

    case ActionType.SET_PROBLEM_DELETE_ID:
      return {
        ...state,
        problemDeleteId: action.problemDeleteId
      }

  }
};
