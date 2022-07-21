import { AllCptFeeSchedulesPayload, AllFeeSchedulesPayload } from "../generated/graphql";

export interface State {
  page: number;
  isEdit: boolean;
  delFeeId: string;
  getFeeId: string;
  openDel: boolean;
  totalPages: number;
  searchQuery: string;
  drawerOpened: boolean;
  getFeeSchedule: boolean;
  feeSchedules: AllFeeSchedulesPayload['feeSchedules'];
  cptFeeSchedules: AllCptFeeSchedulesPayload['cptFeeSchedules'];
}

export const initialState: State = {
  page: 1,
  getFeeId: '',
  delFeeId: '',
  totalPages: 0,
  isEdit: false,
  openDel: false,
  searchQuery: '',
  feeSchedules: [],
  drawerOpened: false,
  cptFeeSchedules: [],
  getFeeSchedule: true,
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_EDIT = 'setEdit',
  SET_DRAWER = 'setDrawer',
  SET_DEL_OPEN = 'setDelOpen',
  SET_GET_FEE_ID = 'setGetFeeId',
  SET_DEL_FEE_ID = 'setDelFeeId',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_FEE_SCHEDULES = 'setFeeSchedules',
  SET_FEE_SCHEDULE_GET = 'setGetFeeSchedule',
  SET_CPT_FEE_SCHEDULES = 'setCptFeeSchedules',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_EDIT; isEdit: boolean }
  | { type: ActionType.SET_DEL_OPEN; openDel: boolean }
  | { type: ActionType.SET_GET_FEE_ID; getFeeId: string }
  | { type: ActionType.SET_DEL_FEE_ID; delFeeId: string }
  | { type: ActionType.SET_DRAWER; drawerOpened: boolean }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_FEE_SCHEDULE_GET; getFeeSchedule: boolean }
  | { type: ActionType.SET_FEE_SCHEDULES; feeSchedules: AllFeeSchedulesPayload['feeSchedules']; }
  | { type: ActionType.SET_CPT_FEE_SCHEDULES; cptFeeSchedules: AllCptFeeSchedulesPayload['cptFeeSchedules']; }

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

    case ActionType.SET_FEE_SCHEDULE_GET:
      return {
        ...state,
        getFeeSchedule: action.getFeeSchedule
      }

    case ActionType.SET_DEL_FEE_ID:
      return {
        ...state,
        delFeeId: action.delFeeId
      }

    case ActionType.SET_DEL_OPEN:
      return {
        ...state,
        openDel: action.openDel
      }

    case ActionType.SET_GET_FEE_ID:
      return {
        ...state,
        getFeeId: action.getFeeId
      }

    case ActionType.SET_CPT_FEE_SCHEDULES:
      return {
        ...state,
        cptFeeSchedules: action.cptFeeSchedules
      }

  }
}