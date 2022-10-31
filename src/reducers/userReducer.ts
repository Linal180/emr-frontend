import { Doctor, Staff } from "../generated/graphql";

export interface State {
  page: number;
  isOpen: boolean;
  totalPages: number;
  searchQuery: string;
  selectedItem: Doctor | Staff | undefined;
  searchedData: Doctor[] | Staff[];
  itemId: string
}

export const initialState: State = {
  page: 1,
  isOpen: false,
  totalPages: 0,
  searchQuery: '',
  searchedData: [],
  selectedItem: undefined,
  itemId: ''
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_IS_OPEN = 'setIsOpen',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_SELECTED_ITEM = 'setSelectedItem',
  SET_SEARCHED_DATA = 'setSearchedData',
  SET_ITEM_ID = 'setItemId'
}

export type Action =
  | { type: ActionType.SET_PAGE, page: number }
  | { type: ActionType.SET_ITEM_ID, itemId: string }
  | { type: ActionType.SET_IS_OPEN, isOpen: boolean }
  | { type: ActionType.SET_TOTAL_PAGES, totalPages: number }
  | { type: ActionType.SET_SEARCH_QUERY, searchQuery: string }
  | { type: ActionType.SET_SELECTED_ITEM, selectedItem: Doctor | Staff }
  | { type: ActionType.SET_SEARCHED_DATA, searchedData: Doctor[] | Staff[] }


export const userReducer = (state: State, action: Action): State => {
  switch (action.type) {


    case ActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.searchQuery
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

    case ActionType.SET_IS_OPEN:
      return {
        ...state,
        isOpen: action.isOpen
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

    case ActionType.SET_ITEM_ID:
      return {
        ...state,
        itemId: action.itemId
      }

  }
};
