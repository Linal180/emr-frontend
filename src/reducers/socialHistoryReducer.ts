import { FindAllSectionsPayload } from "../generated/graphql"

export interface State {
  page: number;
  totalPages: number;
  sections: FindAllSectionsPayload['sections']
  itemId: string;
}

export const initialState: State = {
  sections: [],
  page: 1,
  itemId: '',
  totalPages: 0,
}

export enum ActionType {
  SET_SECTIONS = 'setSections',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_PAGE = 'setPage',
  SET_ITEM_ID = 'SET_ITEM_ID',
}

export type Action =
  { type: ActionType.SET_PAGE; page: number } |
  { type: ActionType.SET_ITEM_ID, itemId: string } |
  { type: ActionType.SET_TOTAL_PAGES; totalPages: number } |
  { type: ActionType.SET_SECTIONS; sections: FindAllSectionsPayload['sections'] }


export const socialHistoryReducer = (state: State, action: Action): State => {
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

    case ActionType.SET_SECTIONS:
      return {
        ...state,
        sections: action.sections
      }

    case ActionType.SET_ITEM_ID:
      return {
        ...state,
        itemId: action.itemId
      }

  }
}