import { FacilitiesPayload, PracticesPayload, RolesPayload } from "../generated/graphql"

export interface State {
  isSuper: boolean;
  practiceId: string;
  rolePages: number;
  practicePages: number;
  facilityPages: number;
  roleList: RolesPayload['roles'];
  practiceList: PracticesPayload['practices'];
  facilityList: FacilitiesPayload['facilities'];
}

export const initialState: State = {
  isSuper: false,
  practiceId: '',
  rolePages: 1,
  facilityPages: 1,
  practicePages: 1,
  roleList: [],
  practiceList: [],
  facilityList: [],
}

export enum ActionType {
  SET_IS_SUPER = 'setIsSuper',
  SET_ROLE_LIST = "setRoleList",
  SET_ROLE_PAGES = "setRolePages",
  SET_PRACTICE_ID = 'setPracticeId',
  SET_FACILITY_LIST = "setFacilityList",
  SET_PRACTICE_LIST = "setPracticeList",
  SET_PRACTICE_PAGES = "setPracticePages",
  SET_FACILITY_PAGES = "setFacilityPages",
}

export type Action =
  | { type: ActionType.SET_IS_SUPER, isSuper: boolean }
  | { type: ActionType.SET_ROLE_PAGES; rolePages: number }
  | { type: ActionType.SET_PRACTICE_ID, practiceId: string }
  | { type: ActionType.SET_FACILITY_PAGES; facilityPages: number }
  | { type: ActionType.SET_PRACTICE_PAGES; practicePages: number }
  | { type: ActionType.SET_ROLE_LIST; roleList: RolesPayload['roles'] }
  | { type: ActionType.SET_PRACTICE_LIST; practiceList: PracticesPayload['practices'] }
  | { type: ActionType.SET_FACILITY_LIST; facilityList: FacilitiesPayload['facilities'] }

export const listContextReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_IS_SUPER:
      return {
        ...state,
        isSuper: action.isSuper
      }

    case ActionType.SET_ROLE_PAGES:
      return {
        ...state,
        rolePages: action.rolePages
      }

    case ActionType.SET_ROLE_LIST:
      return {
        ...state,
        roleList: action.roleList
      }

    case ActionType.SET_FACILITY_PAGES:
      return {
        ...state,
        facilityPages: action.facilityPages
      }

    case ActionType.SET_PRACTICE_ID:
      return {
        ...state,
        practiceId: action.practiceId
      }

    case ActionType.SET_FACILITY_LIST:
      return {
        ...state,
        facilityList: action.facilityList
      }

    case ActionType.SET_PRACTICE_PAGES:
      return {
        ...state,
        practicePages: action.practicePages
      }

    case ActionType.SET_PRACTICE_LIST:
      return {
        ...state,
        practiceList: action.practiceList
      }
  }
};
