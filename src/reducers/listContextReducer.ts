import {
  FacilitiesPayload, ServicesPayload, AllDoctorPayload, ContactsPayload, PatientsPayload
} from "../generated/graphql"

export interface State {
  facilityPages: number;
  facilityList: FacilitiesPayload['facilities'];
  servicePages: number;
  serviceList: ServicesPayload['services']
  locationPages: number;
  locationList: ContactsPayload['contacts'];
  doctorPages: number;
  doctorList: AllDoctorPayload['doctors'];
  patientPages: number;
  patientList: PatientsPayload['patients'];
}

export const initialState: State = {
  facilityPages: 1,
  facilityList: [],
  servicePages: 1,
  serviceList: [],
  doctorPages: 1,
  doctorList: [],
  locationPages: 1,
  locationList: [],
  patientPages: 1,
  patientList: [],
}

export enum ActionType {
  SET_FACILITY_PAGES = "setFacilityPages",
  SET_FACILITY_LIST = "setFacilityList",
  SET_SERVICE_PAGES = "setServicePages",
  SET_SERVICE_LIST = "setServiceList",
  SET_DOCTOR_PAGES = "setDoctorPages",
  SET_DOCTOR_LIST = "setDoctorList",
  SET_LOCATION_PAGES = "setLocationPages",
  SET_LOCATION_LIST = "setLocationList",
  SET_PATIENT_PAGES = "setPatientPages",
  SET_PATIENT_LIST = "setPatientList",
}

export type Action =
  | { type: ActionType.SET_FACILITY_PAGES; facilityPages: number }
  | { type: ActionType.SET_FACILITY_LIST; facilityList: FacilitiesPayload['facilities'] }
  | { type: ActionType.SET_SERVICE_PAGES; servicePages: number }
  | { type: ActionType.SET_SERVICE_LIST; serviceList: ServicesPayload['services'] }
  | { type: ActionType.SET_DOCTOR_PAGES; doctorPages: number }
  | { type: ActionType.SET_DOCTOR_LIST; doctorList: AllDoctorPayload['doctors'] }
  | { type: ActionType.SET_LOCATION_PAGES; locationPages: number }
  | { type: ActionType.SET_LOCATION_LIST; locationList: ContactsPayload['contacts'] }
  | { type: ActionType.SET_PATIENT_PAGES; patientPages: number }
  | { type: ActionType.SET_PATIENT_LIST; patientList: PatientsPayload['patients'] }

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

    case ActionType.SET_LOCATION_PAGES:
      return {
        ...state,
        locationPages: action.locationPages
      }

    case ActionType.SET_LOCATION_LIST:
      return {
        ...state,
        locationList: action.locationList
      }

    case ActionType.SET_PATIENT_PAGES:
      return {
        ...state,
        patientPages: action.patientPages
      }

    case ActionType.SET_PATIENT_LIST:
      return {
        ...state,
        patientList: action.patientList
      }
  }
};
