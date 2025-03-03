import { RolesPayload, RolePayload } from "../generated/graphql"

export interface State {
  page: number;
  roleId: string;
  totalPages: number;
  searchQuery: string;
  openModal: boolean;
  deleteRoleId: string;
  role: RolePayload['role'];
  roles: RolesPayload['roles'];
}

export const initialState: State = {
  page: 1,
  role: null,
  roles: [],
  roleId: '',
  totalPages: 0,
  searchQuery: '',
  deleteRoleId: '',
  openModal: false,
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_ROLE = 'setRole',
  SET_ROLES = 'setRoles',
  SET_ROLE_ID = 'setRoleId',
  SET_OPEN_MODAL = 'setOpenModal',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_DELETE_ROLE_ID = 'setDeleteRoleId',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_ROLE_ID; roleId: string }
  | { type: ActionType.SET_OPEN_MODAL, openModal: boolean }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_ROLE; role: RolePayload['role'] }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_ROLES; roles: RolesPayload['roles'] }
  | { type: ActionType.SET_DELETE_ROLE_ID; deleteRoleId: string }

export const roleReducer = (state: State, action: Action): State => {
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

    case ActionType.SET_OPEN_MODAL:
      return {
        ...state,
        openModal: action.openModal
      }

    case ActionType.SET_ROLE_ID:
      return {
        ...state,
        roleId: action.roleId
      }


    case ActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.searchQuery
      }

    case ActionType.SET_ROLE:
      return {
        ...state,
        role: action.role
      }

    case ActionType.SET_ROLES:
      return {
        ...state,
        roles: action.roles
      }

    case ActionType.SET_DELETE_ROLE_ID:
      return {
        ...state,
        deleteRoleId: action.deleteRoleId
      }
  };
}
