import {
  AgreementsPayload
} from "../generated/graphql";

export interface State {
  agreements: AgreementsPayload['agreements']
  agreementUrl: string
  pages: number
  page: number
  openDelete: boolean
  agreementToRemove: string
  searchQuery: string
  isFileModalOpen: boolean
}

export const initialState: State = {
  agreements: [],
  agreementUrl: '',
  pages: 0,
  page: 1,
  openDelete: false,
  agreementToRemove: '',
  searchQuery: '',
  isFileModalOpen: false,
}

export enum ActionType {
  SET_AGREEMENTS = 'SET_AGREEMENTS',
  SET_AGREEMENT_URL = 'SET_AGREEMENT_URL',
  SET_PAGES = 'SET_PAGES',
  SET_PAGE = 'SET_PAGE',
  SET_OPEN_DELETE = 'SET_OPEN_DELETE',
  SET_AGREEMENT_TO_REMOVE = 'SET_AGREEMENT_TO_REMOVE',
  SET_SEARCH_QUERY = 'SET_SEARCH_QUERY',
  SET_IS_FILE_MODAL_OPEN = 'SET_IS_FILE_MODAL_OPEN'
}

export type Action =
  | { type: ActionType.SET_AGREEMENTS, agreements: AgreementsPayload['agreements'] }
  | { type: ActionType.SET_AGREEMENT_URL, agreementUrl: string }
  | { type: ActionType.SET_PAGES, pages: number }
  | { type: ActionType.SET_PAGE, page: number }
  | { type: ActionType.SET_OPEN_DELETE, openDelete: boolean }
  | { type: ActionType.SET_AGREEMENT_TO_REMOVE, agreementToRemove: string }
  | { type: ActionType.SET_SEARCH_QUERY, searchQuery: string }
  | { type: ActionType.SET_IS_FILE_MODAL_OPEN, isFileModalOpen: boolean }


export const agreementReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_AGREEMENTS:
      return {
        ...state,
        agreements: action.agreements
      }

    case ActionType.SET_AGREEMENT_URL:
      return {
        ...state,
        agreementUrl: action.agreementUrl
      }

    case ActionType.SET_PAGES:
      return {
        ...state,
        pages: action.pages
      }

    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_OPEN_DELETE:
      return {
        ...state,
        openDelete: action.openDelete
      }

    case ActionType.SET_AGREEMENT_TO_REMOVE:
      return {
        ...state,
        agreementToRemove: action.agreementToRemove
      }

    case ActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.searchQuery
      }

    case ActionType.SET_IS_FILE_MODAL_OPEN:
      return {
        ...state,
        isFileModalOpen: action.isFileModalOpen
      }
  }
};
