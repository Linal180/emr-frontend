import { FacilitiesPayload, FacilityPayload } from "../generated/graphql"

export interface State {
  page: number;
  totalPages: number;
  openModal: boolean;
  facilityId: string;
  openDelete: boolean;
  searchQuery: string;
  deleteFacilityId: string;
  facility: FacilityPayload['facility'];
  facilities: FacilitiesPayload['facility'];
}

export const initialState: State = {
  page: 1,
  totalPages: 0,
  facility: null,
  facilities: [],
  facilityId: '',
  searchQuery: '',
  openModal: false,
  openDelete: false,
  deleteFacilityId: '',
}

export enum ActionType {
  SET_PAGE = 'SetPage',
  SET_FACILITY = 'setFacility',
  SET_OPEN_MODAL = 'setOpenModal',
  SET_FACILITIES = 'setFacilities',
  SET_FACILITY_ID = 'setFacilityId',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_DELETE_FACILITY_ID = 'setDeleteFacilityId',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_OPEN_MODAL; openModal: boolean }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_FACILITY_ID; facilityId: string }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_DELETE_FACILITY_ID; deleteFacilityId: string }
  | { type: ActionType.SET_FACILITY; facility: FacilityPayload['facility'] }
  | { type: ActionType.SET_FACILITIES; facilities: FacilitiesPayload['facility'] }

export const facilityReducer = (state: State, action: Action): State => {
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

    case ActionType.SET_FACILITY_ID:
      return {
        ...state,
        facilityId: action.facilityId
      }

    case ActionType.SET_OPEN_MODAL:
      return {
        ...state,
        openModal: action.openModal
      }

    case ActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.searchQuery
      }

    case ActionType.SET_OPEN_DELETE:
      return {
        ...state,
        openDelete: action.openDelete
      }

    case ActionType.SET_FACILITY:
      return {
        ...state,
        facility: action.facility
      }

      case ActionType.SET_FACILITIES:
        return {
          ...state,
          facilities: action.facilities
        }

    case ActionType.SET_DELETE_FACILITY_ID:
      return {
        ...state,
        deleteFacilityId: action.deleteFacilityId
      }
  }
};
