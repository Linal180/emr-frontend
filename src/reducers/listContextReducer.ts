import {
  FacilitiesPayload, ServicesPayload, AllDoctorPayload, PatientsPayload, PracticesPayload, RolesPayload
} from "../generated/graphql"

export interface State {
  isSuper: boolean;
  practiceId: string;
  rolePages: number;
  roleList: RolesPayload['roles'];
  practicePages: number;
  practiceList: PracticesPayload['practices'];
  facilityPages: number;
  facilityList: FacilitiesPayload['facilities'];
  servicePages: number;
  serviceList: ServicesPayload['services']
  doctorPages: number;
  doctorList: AllDoctorPayload['doctors'];
  patientPages: number;
  patientList: PatientsPayload['patients'];
}

export const initialState: State = {
  isSuper: false,
  practiceId: '',
  rolePages: 1,
  roleList: [],
  practicePages: 1,
  practiceList: [],
  facilityPages: 1,
  facilityList: [],
  servicePages: 1,
  serviceList: [],
  doctorPages: 1,
  doctorList: [],
  patientPages: 1,
  patientList: [],
}

export enum ActionType {
  SET_IS_SUPER = 'setIsSuper',
  SET_PRACTICE_ID = 'setPracticeId',
  SET_ROLE_PAGES = "setRolePages",
  SET_ROLE_LIST = "setRoleList",
  SET_PRACTICE_PAGES = "setPracticePages",
  SET_PRACTICE_LIST = "setPracticeList",
  SET_FACILITY_PAGES = "setFacilityPages",
  SET_FACILITY_LIST = "setFacilityList",
  SET_SERVICE_PAGES = "setServicePages",
  SET_SERVICE_LIST = "setServiceList",
  SET_DOCTOR_PAGES = "setDoctorPages",
  SET_DOCTOR_LIST = "setDoctorList",
  SET_PATIENT_PAGES = "setPatientPages",
  SET_PATIENT_LIST = "setPatientList",
}

export type Action =
  | { type: ActionType.SET_IS_SUPER, isSuper: boolean }
  | { type: ActionType.SET_PRACTICE_ID, practiceId: string }
  | { type: ActionType.SET_ROLE_PAGES; rolePages: number }
  | { type: ActionType.SET_ROLE_LIST; roleList: RolesPayload['roles'] }
  | { type: ActionType.SET_FACILITY_PAGES; facilityPages: number }
  | { type: ActionType.SET_FACILITY_LIST; facilityList: FacilitiesPayload['facilities'] }
  | { type: ActionType.SET_SERVICE_PAGES; servicePages: number }
  | { type: ActionType.SET_SERVICE_LIST; serviceList: ServicesPayload['services'] }
  | { type: ActionType.SET_DOCTOR_PAGES; doctorPages: number }
  | { type: ActionType.SET_DOCTOR_LIST; doctorList: AllDoctorPayload['doctors'] }
  | { type: ActionType.SET_PRACTICE_PAGES; practicePages: number }
  | { type: ActionType.SET_PRACTICE_LIST; practiceList: PracticesPayload['practices'] }
  | { type: ActionType.SET_PATIENT_PAGES; patientPages: number }
  | { type: ActionType.SET_PATIENT_LIST; patientList: PatientsPayload['patients'] }

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
