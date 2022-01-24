import { AllDoctorPayload, FacilitiesPayload } from "../generated/graphql"

export interface State {
  facilityPages: number;
  facilityList: FacilitiesPayload['facility'];
  doctorPages: number;
  doctorList: AllDoctorPayload['doctors'];
}

export const initialState: State = {
  facilityPages: 1,
  facilityList: [],
  doctorPages: 1,
  doctorList: [],
}

export enum ActionType {
  SET_FACILITY_PAGES = "setFacilityPages",
  SET_FACILITY_LIST = "setFacilityList",
  SET_DOCTOR_PAGES = "setDoctorPages",
  SET_DOCTOR_LIST = "setDoctorList",
}

export enum ActionTypeForDoctor {
  
}

export type Action =
  | { type: ActionType.SET_FACILITY_PAGES; facilityPages: number }
  | { type: ActionType.SET_FACILITY_LIST; facilityList: FacilitiesPayload['facility'] }
  | { type: ActionType.SET_DOCTOR_PAGES; doctorPages: number }
  | { type: ActionType.SET_DOCTOR_LIST; doctorList: AllDoctorPayload['doctors'] }

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
      case ActionType.SET_DOCTOR_PAGES:
      return {
        ...state,
        doctorPages: action.doctorPages
      }
    case ActionType.SET_DOCTOR_LIST:
      return {
        ...state,
        doctorList: action.doctorList
      }
  }
};
