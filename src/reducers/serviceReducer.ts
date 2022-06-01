import { ServicesPayload } from "../generated/graphql"
import { SelectorOption } from "../interfacesTypes";

export interface State {
  page: number;
  isEdit: boolean;
  totalPages: number;
  openModal: boolean;
  serviceId: string;
  openDelete: boolean;
  searchQuery: string;
  deleteServiceId: string;
  services: ServicesPayload['services'];
  serviceType: SelectorOption
}

export const initialState: State = {
  page: 1,
  isEdit: false,
  totalPages: 0,
  services: [],
  serviceId: '',
  searchQuery: '',
  openModal: false,
  openDelete: false,
  deleteServiceId: '',
  serviceType: {
    id: "",
    name: ""
  }
}

export enum ActionType {
  SET_PAGE = 'SetPage',
  SET_IS_EDIT = 'SetIsEdit',
  SET_SERVICES = 'setServices',
  SET_OPEN_MODAL = 'setOpenModal',
  SET_SERVICE_ID = 'setServiceId',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_DELETE_SERVICE_ID = 'setDeleteServiceId',
  SET_SERVICE_TYPE = 'setServiceType'
}

export type serviceAction =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_IS_EDIT; isEdit: boolean }
  | { type: ActionType.SET_OPEN_MODAL; openModal: boolean }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_SERVICE_ID; serviceId: string }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_DELETE_SERVICE_ID; deleteServiceId: string }
  | { type: ActionType.SET_SERVICES; services: ServicesPayload['services'] }
  | { type: ActionType.SET_SERVICE_TYPE; serviceType: SelectorOption }

export const serviceReducer = (state: State, action: serviceAction): State => {
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

    case ActionType.SET_SERVICE_ID:
      return {
        ...state,
        serviceId: action.serviceId
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

    case ActionType.SET_SERVICES:
      return {
        ...state,
        services: action.services
      }

    case ActionType.SET_DELETE_SERVICE_ID:
      return {
        ...state,
        deleteServiceId: action.deleteServiceId
      }
      
    case ActionType.SET_SERVICE_TYPE:
      return {
        ...state,
        serviceType: action.serviceType
      }
  }
};
