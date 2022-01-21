import { ContactsPayload } from "../generated/graphql"

export interface State {
  page: number;
  isEdit: boolean;
  totalPages: number;
  openModal: boolean;
  locationId: string;
  openDelete: boolean;
  searchQuery: string;
  deleteLocationId: string;
  locations: ContactsPayload['contacts'];
}

export const initialState: State = {
  page: 1,
  isEdit: false,
  totalPages: 0,
  locations: [],
  locationId: '',
  searchQuery: '',
  openModal: false,
  openDelete: false,
  deleteLocationId: '',
}

export enum ActionType {
  SET_PAGE = 'SetPage',
  SET_IS_EDIT = 'SetIsEdit',
  SET_LOCATIONS = 'setLocations',
  SET_OPEN_MODAL = 'setOpenModal',
  SET_LOCATION_ID = 'setLocationId',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_DELETE_LOCATION_ID = 'setDeleteLocationId',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_IS_EDIT; isEdit: boolean }
  | { type: ActionType.SET_OPEN_MODAL; openModal: boolean }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_LOCATION_ID; locationId: string }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_DELETE_LOCATION_ID; deleteLocationId: string }
  | { type: ActionType.SET_LOCATIONS; locations: ContactsPayload['contacts'] }

export const locationReducer = (state: State, action: Action): State => {
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

    case ActionType.SET_LOCATION_ID:
      return {
        ...state,
        locationId: action.locationId
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

    case ActionType.SET_LOCATIONS:
      return {
        ...state,
        locations: action.locations
      }

    case ActionType.SET_DELETE_LOCATION_ID:
      return {
        ...state,
        deleteLocationId: action.deleteLocationId
      }
  }
};
