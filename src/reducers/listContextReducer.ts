import { FacilitiesPayload, ServicesPayload, AllDoctorPayload } from "../generated/graphql"
export interface State {
  facilityPages: number;
  servicePages: number;
  serviceList: ServicesPayload['services'];
  facilityList: FacilitiesPayload['facility'];
}

export interface State {
  facilityPages: number;
  doctorPages: number;
  doctorList: AllDoctorPayload['doctors'];
  facilityList: FacilitiesPayload['facility'];
}

export const initialState: State = {
  facilityPages: 1,
  facilityList: [],
  servicePages: 1,
  serviceList: [],
  doctorPages: 1,
  doctorList: [],
}

export enum ActionType {
  SET_DOCTOR_LIST = "setDoctorList",
  SET_SERVICE_LIST = "setServiceList",
  SET_DOCTOR_PAGES = "setDoctorPages",
  SET_SERVICE_PAGES = "setServicePages",
  SET_FACILITY_LIST = "setFacilityList",
  SET_FACILITY_PAGES = "setFacilityPages",
}

export type Action =
  | { type: ActionType.SET_DOCTOR_PAGES; doctorPages: number }
  | { type: ActionType.SET_SERVICE_PAGES; servicePages: number }
  | { type: ActionType.SET_FACILITY_PAGES; facilityPages: number }
  | { type: ActionType.SET_DOCTOR_LIST; doctorList: AllDoctorPayload['doctors'] }
  | { type: ActionType.SET_SERVICE_LIST; serviceList: ServicesPayload['services'] }
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

    case ActionType.SET_SERVICE_PAGES:
      return {
        ...state,
        servicePages: action.servicePages
      }

    case ActionType.SET_SERVICE_LIST:
      return {
        ...state,
        serviceList: action.serviceList
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
