import { AllModifiersPayload } from "../generated/graphql";

export interface State {
  page: number;
  totalPages: number;
  searchQuery: string;
  modifiers: AllModifiersPayload['modifiers']
}

export const initialState: State = {
  page: 1,
  modifiers: [],
  totalPages: 0,
  searchQuery: "",
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_MODIFIERS = 'setModifiers',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_SEARCH_QUERY = 'setSearchQuery',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_MODIFIERS; modifiers: AllModifiersPayload['modifiers'] }

export const modifiersReducer = (state: State, action: Action): State => {
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

    case ActionType.SET_MODIFIERS:
      return {
        ...state,
        modifiers: action.modifiers
      }

  }
}