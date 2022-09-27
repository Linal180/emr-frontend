import { Cvx, FindAllCvxPayload, FindAllVaccinesPayload } from "../generated/graphql";

export interface State {
  page: number;
  delId: string;
  itemId: string;
  isOpen: boolean;
  totalPages: number;
  openDelete: boolean;
  isSubModalOpen: boolean;
  data: FindAllVaccinesPayload['vaccines']
  selectedItem: Cvx | undefined;
  searchedData: FindAllCvxPayload['cvxs'];
  searchQuery: string;
  isFormOpen: HTMLElement | null;
}

export const initialState: State = {
  page: 1,
  data: [],
  delId: '',
  itemId: '',
  totalPages: 0,
  isOpen: false,
  searchQuery: '',
  searchedData: [],
  isFormOpen: null,
  openDelete: false,
  isSubModalOpen: false,
  selectedItem: undefined,
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_DATA = 'setData',
  SET_IS_OPEN = 'setIsOpen',
  SET_DEL_ID = 'SET_DEL_ID',
  SET_ITEM_ID = 'SET_ITEM_ID',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_OPEN_DELETE = 'SET_OPEN_DELETE',
  SET_IS_FORM_OPEN = 'SET_IS_FORM_OPEN',
  SET_SEARCH_QUERY = 'SET_SEARCH_QUERY',
  SET_SELECTED_ITEM = 'SET_SELECTED_ITEM',
  SET_SEARCHED_DATA = 'SET_SEARCHED_DATA',
  SET_IS_SUB_MODAL_OPEN = 'SET_IS_SUB_MODAL_OPEN',
}

export type Action =
  { type: ActionType.SET_PAGE; page: number } |
  { type: ActionType.SET_DEL_ID, delId: string; } |
  { type: ActionType.SET_ITEM_ID, itemId: string } |
  { type: ActionType.SET_IS_OPEN; isOpen: boolean } |
  { type: ActionType.SET_TOTAL_PAGES; totalPages: number } |
  { type: ActionType.SET_OPEN_DELETE, openDelete: boolean } |
  { type: ActionType.SET_SEARCH_QUERY, searchQuery: string; } |
  { type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: boolean } |
  { type: ActionType.SET_IS_FORM_OPEN, isFormOpen: HTMLElement | null } |
  { type: ActionType.SET_SELECTED_ITEM, selectedItem: Cvx | undefined } |
  { type: ActionType.SET_DATA; data: FindAllVaccinesPayload['vaccines'] } |
  { type: ActionType.SET_SEARCHED_DATA, searchedData: FindAllCvxPayload['cvxs'] }


export const vaccinesReducer = (state: State, action: Action): State => {
  const { type } = action

  switch (type) {

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

    case ActionType.SET_IS_OPEN:
      return {
        ...state,
        isOpen: action.isOpen
      }

    case ActionType.SET_DATA:
      return {
        ...state,
        data: action.data
      }

    case ActionType.SET_OPEN_DELETE:
      return {
        ...state,
        openDelete: action.openDelete
      }

    case ActionType.SET_DEL_ID:
      return {
        ...state,
        delId: action.delId
      }

    case ActionType.SET_IS_SUB_MODAL_OPEN:
      return {
        ...state,
        isSubModalOpen: action.isSubModalOpen
      }

    case ActionType.SET_ITEM_ID:
      return {
        ...state,
        itemId: action.itemId
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

    case ActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.searchQuery
      }

    case ActionType.SET_IS_FORM_OPEN:
      return {
        ...state,
        isFormOpen: action.isFormOpen
      }
  }
}
