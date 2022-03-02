import { PracticePayload, PracticesPayload } from "../generated/graphql"

export interface State {
  page: number;
  isAdmin: boolean;
  totalPages: number;
  openModal: boolean;
  practiceId: string;
  openDelete: boolean;
  searchQuery: string;
  deletePracticeId: string;
  practice: PracticePayload['practice'];
  practices: PracticesPayload['practices'];
}

export const initialState: State = {
  page: 1,
  totalPages: 0,
  practice: null,
  isAdmin: true,
  practices: [],
  practiceId: '',
  searchQuery: '',
  openModal: false,
  openDelete: false,
  deletePracticeId: '',
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_IS_ADMIN = 'setIsAdmin',
  SET_PRACTICE = 'setPractice',
  SET_OPEN_MODAL = 'setOpenModal',
  SET_PRACTICES = 'setPractices',
  SET_PRACTICE_ID = 'setPracticeId',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_DELETE_PRACTICE_ID = 'setDeletePracticeId',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_IS_ADMIN; isAdmin: boolean }
  | { type: ActionType.SET_OPEN_MODAL; openModal: boolean }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_PRACTICE_ID; practiceId: string }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_DELETE_PRACTICE_ID; deletePracticeId: string }
  | { type: ActionType.SET_PRACTICE; practice: PracticePayload['practice'] }
  | { type: ActionType.SET_PRACTICES; practices: PracticesPayload['practices'] }

export const practiceReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_IS_ADMIN:
      return {
        ...state,
        isAdmin: action.isAdmin
      }

    case ActionType.SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.totalPages
      }

    case ActionType.SET_PRACTICE_ID:
      return {
        ...state,
        practiceId: action.practiceId
      }

    case ActionType.SET_OPEN_MODAL:
      return {
        ...state,
        openModal: action.openModal
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

    case ActionType.SET_PRACTICE:
      return {
        ...state,
        practice: action.practice
      }

    case ActionType.SET_PRACTICES:
      return {
        ...state,
        practices: action.practices
      }

    case ActionType.SET_DELETE_PRACTICE_ID:
      return {
        ...state,
        deletePracticeId: action.deletePracticeId
      }
  }
};
