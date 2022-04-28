import { Allergies, AllergiesPayload, IcdCodesPayload, ReactionsPayload } from "../generated/graphql"
import { multiOptionType } from "../interfacesTypes";

export interface State {
  itemId: string;
  selectedReactions: multiOptionType[]
  reactionList: ReactionsPayload['reactions'];
  selectedItem: Allergies | undefined;
  reactionPage: number;
  isSearchOpen: HTMLElement | null;
  isFormOpen: HTMLElement | null;
  searchedData: AllergiesPayload['allergies'] | IcdCodesPayload['icdCodes'];
}

export const initialState: State = {
  itemId: '',
  selectedReactions: [],
  reactionList: [],
  selectedItem: undefined,
  reactionPage: 1,
  isSearchOpen: null,
  isFormOpen: null,
  searchedData: [],
}

export enum ActionType {
  SET_ITEM_ID = 'setItemId',
  SET_SELECTED_REACTIONS = 'setSelectedReactions',
  SET_SELECTED_ITEM = 'setSelectedItem',
  SET_REACTION_PAGE = 'setReactionPage',
  SET_REACTION_LIST = 'setReactionList',
  SET_IS_SEARCH_OPEN = 'setSearchOpen',
  SET_IS_FORM_OPEN = 'setFormOpen',
  SET_SEARCHED_DATA = 'setSearchedData',
}

export type Action =
  | { type: ActionType.SET_SELECTED_REACTIONS, selectedReactions: multiOptionType[] }
  | { type: ActionType.SET_REACTION_LIST, reactionList: ReactionsPayload['reactions'] }
  | { type: ActionType.SET_REACTION_PAGE, reactionPage: number }
  | { type: ActionType.SET_ITEM_ID, itemId: string }
  | { type: ActionType.SET_SELECTED_ITEM, selectedItem: Allergies | undefined }
  | { type: ActionType.SET_IS_SEARCH_OPEN, isSearchOpen: HTMLElement | null }
  | { type: ActionType.SET_IS_FORM_OPEN, isFormOpen: HTMLElement | null }
  | { type: ActionType.SET_SEARCHED_DATA, searchedData: AllergiesPayload['allergies'] | IcdCodesPayload['icdCodes'] }


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

  }
};
