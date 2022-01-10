import { FacilitiesPayload } from "../generated/graphql"

export interface State {
  facilityPages: number;
  facilityList: FacilitiesPayload['facility'];
}

export const initialState: State = {
  facilityPages: 1,
  facilityList: [],
}

export enum ActionType {
  SET_FACILITY_PAGES = "setFacilityPages",
  SET_FACILITY_LIST = "setFacilityList",
}

export type Action =
  | { type: ActionType.SET_FACILITY_PAGES; facilityPages: number }
  | { type: ActionType.SET_FACILITY_LIST; facilityList: FacilitiesPayload['facility'] }

export const listContextReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_FACILITY_PAGES:
      return {
        ...state,
        facilityPages: action.facilityPages
      }
    case ActionType.SET_FACILITY_LIST:
      return {
        ...state,
        facilityList: action.facilityList
      }
  }
};
