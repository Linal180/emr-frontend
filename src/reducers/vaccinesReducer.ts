export interface State {
  page: number;
  isOpen: boolean;
  totalPages: number;
}

export const initialState: State = {
  page: 1,
  totalPages: 0,
  isOpen: false,
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_IS_OPEN = 'setIsOpen',
  SET_TOTAL_PAGES = 'setTotalPages',
}

export type Action =
  { type: ActionType.SET_PAGE; page: number } |
  { type: ActionType.SET_IS_OPEN; isOpen: boolean } |
  { type: ActionType.SET_TOTAL_PAGES; totalPages: number }

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
  }
}
