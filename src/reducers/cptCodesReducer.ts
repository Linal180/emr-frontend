import { AllCptCodePayload } from "../generated/graphql";

export interface State {
  page: number;
  totalPages: number;
  searchQuery: string;
  cptCodes: AllCptCodePayload['cptCodes']
}

export const initialState: State = {
  page: 1,
  cptCodes: [],
  totalPages: 0,
  searchQuery: "",
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_CPT_CODES = 'setCptCodes',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_SEARCH_QUERY = 'setSearchQuery',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_CPT_CODES; cptCodes: AllCptCodePayload['cptCodes'] }

export const cptCodesReducer = (state: State, action: Action): State => {
  switch (action.type) {

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

    case ActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.searchQuery
      }

    case ActionType.SET_CPT_CODES:
      return {
        ...state,
        cptCodes: action.cptCodes
      }

  }
}