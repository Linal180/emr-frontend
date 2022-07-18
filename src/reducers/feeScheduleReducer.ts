import { AllFeeSchedulesPayload } from "../generated/graphql";

export interface State {
  page: number;
  isEdit: boolean;
  totalPages: number;
  searchQuery: string;
  drawerOpened: boolean;
  feeSchedules: AllFeeSchedulesPayload['feeSchedules'];
}

export const initialState: State = {
  page: 1,
  totalPages: 0,
  isEdit: false,
  searchQuery: '',
  feeSchedules: [],
  drawerOpened: false,
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_EDIT = 'setEdit',
  SET_DRAWER = 'setDrawer',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_FEE_SCHEDULES = 'setFeeSchedules',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_EDIT; isEdit: boolean }
  | { type: ActionType.SET_DRAWER; drawerOpened: boolean }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_FEE_SCHEDULES; feeSchedules: AllFeeSchedulesPayload['feeSchedules']; }

export const feeScheduleReducer = (state: State, action: Action): State => {
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

    case ActionType.SET_FEE_SCHEDULES:
      return {
        ...state,
        feeSchedules: action.feeSchedules
      }

    case ActionType.SET_DRAWER:
      return {
        ...state,
        drawerOpened: action.drawerOpened
      }

    case ActionType.SET_EDIT:
      return {
        ...state,
        isEdit: action.isEdit
      }
  }
}