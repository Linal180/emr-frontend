import { AllStaffPayload, StaffPayload } from "../generated/graphql"

export interface State {
  page: number;
  isEdit: boolean;
  totalPages: number;
  openDelete: boolean;
  searchQuery: string;
  deleteStaffId: string;
  staff: StaffPayload['staff'];
  allStaff: AllStaffPayload['allstaff'];
}

export const initialState: State = {
  page: 1,
  staff: null,
  allStaff: [],
  totalPages: 0,
  isEdit: false,
  searchQuery: "",
  openDelete: false,
  deleteStaffId: "",
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_STAFF = 'setStaff',
  SET_IS_EDIT = 'setIsEdit',
  SET_ALL_STAFF = 'setAllStaff',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_DELETE_STAFF_ID = 'setDeleteStaffId',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_IS_EDIT; isEdit: boolean }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_STAFF; staff: StaffPayload['staff'] }
  | { type: ActionType.SET_DELETE_STAFF_ID; deleteStaffId: string }
  | { type: ActionType.SET_ALL_STAFF; allStaff: AllStaffPayload['allstaff'] }

export const staffReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_IS_EDIT:
      return {
        ...state,
        isEdit: action.isEdit
      }

    case ActionType.SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.totalPages
      }

    case ActionType.SET_OPEN_DELETE:
      return {
        ...state,
        openDelete: action.openDelete
      }

    case ActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.searchQuery
      }

    case ActionType.SET_STAFF:
      return {
        ...state,
        staff: action.staff
      }

    case ActionType.SET_ALL_STAFF:
      return {
        ...state,
        allStaff: action.allStaff
      }

    case ActionType.SET_DELETE_STAFF_ID:
      return {
        ...state,
        deleteStaffId: action.deleteStaffId
      }
  };
}
