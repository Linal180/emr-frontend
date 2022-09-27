export interface State {
  page: number;
}


export const initialState: State = {
  page: 1,
}

export enum ActionType {
  SET_PAGE = 'setPage',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }

export const icd10Reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }
  }
}
