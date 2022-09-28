import { FindAllIcdCodesPayload } from "../generated/graphql";

export interface State {
  page: number;
  delId: string;
  itemId: string;
  isOpen: boolean;
  data: FindAllIcdCodesPayload['icdCodes']
  totalPages: number;
  openDelete: boolean;
  searchQuery: string;
}


export const initialState: State = {
  page: 1,
  data: [],
  delId: '',
  itemId: '',
  totalPages: 0,
  openDelete: false,
  isOpen: false,
  searchQuery: ''
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_DATA = 'setData',
  SET_IS_OPEN = 'setIsOpen',
  SET_DEL_ID = 'SET_DEL_ID',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_OPEN_DELETE = 'SET_OPEN_DELETE',
  SET_SEARCH_QUERY = 'SET_SEARCH_QUERY',
  SET_ITEM_ID = 'SET_ITEM_ID'
}

export type Action =
  { type: ActionType.SET_PAGE; page: number } |
  { type: ActionType.SET_DEL_ID, delId: string; } |
  { type: ActionType.SET_ITEM_ID, itemId: string } |
  { type: ActionType.SET_IS_OPEN; isOpen: boolean } |
  { type: ActionType.SET_TOTAL_PAGES; totalPages: number } |
  { type: ActionType.SET_OPEN_DELETE, openDelete: boolean } |
  { type: ActionType.SET_SEARCH_QUERY, searchQuery: string; } |
  { type: ActionType.SET_DATA; data: FindAllIcdCodesPayload['icdCodes'] }

export const icd10Reducer = (state: State, action: Action): State => {
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

    case ActionType.SET_ITEM_ID:
      return {
        ...state,
        itemId: action.itemId
      }

    case ActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.searchQuery
      }
  }
}
