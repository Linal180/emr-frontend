import {
  Allergies, AllergiesPayload, IcdCodes, IcdCodesPayload, IcdCodesWithSnowMedCode, PatientAllergiesPayload, PatientProblemsPayload, PatientVitalPayload, ReactionsPayload
} from "../generated/graphql";
import { multiOptionType } from "../interfacesTypes";

export interface State {
  page: number;
  itemId: string;
  isOpen: boolean;
  newRecord: string;
  totalPages: number;
  openDelete: boolean;
  allergyIds: string[];
  searchQuery: string;
  reactionPage: number;
  reactionPages: number;
  isSubModalOpen: boolean;
  allergyDeleteId: string;
  problemDeleteId: string;
  anchorEl: HTMLElement | null;
  isFormOpen: HTMLElement | null;
  isSearchOpen: HTMLElement | null;
  selectedReactions: multiOptionType[]
  reactionList: ReactionsPayload['reactions'];
  patientVitals: PatientVitalPayload['patientVital'];
  patientProblems: PatientProblemsPayload['patientProblems'],
  patientAllergies: PatientAllergiesPayload['patientAllergies'],
  selectedItem: Allergies | IcdCodesWithSnowMedCode | IcdCodes | undefined;
  searchedData: AllergiesPayload['allergies'] | IcdCodesPayload['icdCodes'];
}

export const initialState: State = {
  page: 1,
  itemId: '',
  newRecord: '',
  anchorEl: null,
  isOpen: false,
  totalPages: 0,
  allergyIds: [],
  reactionPage: 1,
  reactionPages: 1,
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
  patientProblems: [],
  patientAllergies: [],
  openDelete: false,
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_IS_OPEN = 'setIsOpen',
  SET_ITEM_ID = 'setItemId',
  SET_ANCHOR_EL = 'setAnchorEl',
  SET_NEW_RECORD = 'setNewRecord',
  SET_IS_FORM_OPEN = 'setFormOpen',
  SET_ALLERGY_IDS = 'setAllergyIds',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_IS_SEARCH_OPEN = 'setSearchOpen',
  SET_SELECTED_ITEM = 'setSelectedItem',
  SET_REACTION_PAGE = 'setReactionPage',
  SET_REACTION_PAGES = 'setReactionPages',
  SET_REACTION_LIST = 'setReactionList',
  SET_SEARCHED_DATA = 'setSearchedData',
  SET_PATIENT_VITALS = 'setPatientVitals',
  SET_PATIENT_PROBLEMS = 'setPatientProblems',
  SET_PATIENT_ALLERGIES = 'setPatientAllergies',
  SET_IS_SUB_MODAL_OPEN = "setIsSubModalOpen",
  SET_ALLERGY_DELETE_ID = "setAllergyDeleteId",
  SET_PROBLEM_DELETE_ID = "setProblemDeleteId",
  SET_SELECTED_REACTIONS = "setSelectedReactions",
}

export type Action =
  | { type: ActionType.SET_PAGE, page: number }
  | { type: ActionType.SET_ITEM_ID, itemId: string }
  | { type: ActionType.SET_IS_OPEN, isOpen: boolean }
  | { type: ActionType.SET_NEW_RECORD, newRecord: string }
  | { type: ActionType.SET_TOTAL_PAGES, totalPages: number }
  | { type: ActionType.SET_OPEN_DELETE, openDelete: boolean }
  | { type: ActionType.SET_ALLERGY_IDS, allergyIds: string[] }
  | { type: ActionType.SET_SEARCH_QUERY, searchQuery: string }
  | { type: ActionType.SET_REACTION_PAGE, reactionPage: number }
  | { type: ActionType.SET_REACTION_PAGES, reactionPages: number }
  | { type: ActionType.SET_ANCHOR_EL; anchorEl: HTMLElement | null }
  | { type: ActionType.SET_IS_FORM_OPEN, isFormOpen: HTMLElement | null }
  | { type: ActionType.SET_IS_SEARCH_OPEN, isSearchOpen: HTMLElement | null }
  | { type: ActionType.SET_SELECTED_REACTIONS, selectedReactions: multiOptionType[] }
  | { type: ActionType.SET_REACTION_LIST, reactionList: ReactionsPayload['reactions'] }
  | { type: ActionType.SET_SELECTED_ITEM, selectedItem: Allergies | IcdCodesWithSnowMedCode | IcdCodes | undefined }
  | { type: ActionType.SET_PATIENT_VITALS, patientVitals: PatientVitalPayload['patientVital'] }
  | { type: ActionType.SET_PATIENT_PROBLEMS, patientProblems: PatientProblemsPayload['patientProblems'] }
  | { type: ActionType.SET_PATIENT_ALLERGIES, patientAllergies: PatientAllergiesPayload['patientAllergies'] }
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

    case ActionType.SET_ALLERGY_IDS:
      return {
        ...state,
        allergyIds: action.allergyIds
      }

    case ActionType.SET_IS_OPEN:
      return {
        ...state,
        isOpen: action.isOpen
      }

    case ActionType.SET_OPEN_DELETE:
      return {
        ...state,
        openDelete: action.openDelete
      }

    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.totalPages
      }

    case ActionType.SET_PATIENT_ALLERGIES:
      return {
        ...state,
        patientAllergies: action.patientAllergies
      }

    case ActionType.SET_PATIENT_PROBLEMS:
      return {
        ...state,
        patientProblems: action.patientProblems
      }

    case ActionType.SET_REACTION_PAGES:
      return {
        ...state,
        reactionPages: action.reactionPages
      }
  }
};
