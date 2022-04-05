import { PermissionsPayload } from "../generated/graphql"

export interface State {
  page: number;
  permissions: PermissionsPayload['permissions'];
  staffPermissions: PermissionsPayload['permissions'];
  userPermissions: PermissionsPayload['permissions'];
  servicePermissions: PermissionsPayload['permissions'];
  patientPermissions: PermissionsPayload['permissions'];
  practicePermissions: PermissionsPayload['permissions'];
  facilityPermissions: PermissionsPayload['permissions'];
  providerPermissions: PermissionsPayload['permissions'];
  schedulePermissions: PermissionsPayload['permissions'];
  appointmentPermissions: PermissionsPayload['permissions'];
}

export const initialState: State = {
  page: 1,
  permissions: [],
  userPermissions: [],
  staffPermissions: [],
  servicePermissions: [],
  patientPermissions: [],
  practicePermissions: [],
  schedulePermissions: [],
  facilityPermissions: [],
  providerPermissions: [],
  appointmentPermissions: [],
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_PERMISSIONS = 'setPermissions',
  SET_USER_PERMISSIONS = 'setUserPermissions',
  SET_STAFF_PERMISSIONS = 'setStaffPermissions',
  SET_SERVICE_PERMISSIONS = 'setServicePermissions',
  SET_PATIENT_PERMISSIONS = 'setPatientPermissions',
  SET_PRACTICE_PERMISSIONS = 'setPracticePermissions',
  SET_SCHEDULE_PERMISSIONS = 'setSchedulePermissions',
  SET_FACILITY_PERMISSIONS = 'setFacilityPermissions',
  SET_PROVIDER_PERMISSIONS = 'setProviderPermissions',
  SET_APPOINTMENT_PERMISSIONS = 'setAppointmentPermissions',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_PERMISSIONS; permissions: PermissionsPayload['permissions'] }
  | { type: ActionType.SET_USER_PERMISSIONS; userPermissions: PermissionsPayload['permissions'] }
  | { type: ActionType.SET_STAFF_PERMISSIONS; staffPermissions: PermissionsPayload['permissions'] }
  | { type: ActionType.SET_SERVICE_PERMISSIONS; servicePermissions: PermissionsPayload['permissions'] }
  | { type: ActionType.SET_PATIENT_PERMISSIONS; patientPermissions: PermissionsPayload['permissions'] }
  | { type: ActionType.SET_PRACTICE_PERMISSIONS; practicePermissions: PermissionsPayload['permissions'] }
  | { type: ActionType.SET_SCHEDULE_PERMISSIONS; schedulePermissions: PermissionsPayload['permissions'] }
  | { type: ActionType.SET_FACILITY_PERMISSIONS; facilityPermissions: PermissionsPayload['permissions'] }
  | { type: ActionType.SET_PROVIDER_PERMISSIONS; providerPermissions: PermissionsPayload['permissions'] }
  | { type: ActionType.SET_APPOINTMENT_PERMISSIONS; appointmentPermissions: PermissionsPayload['permissions'] }

export const permissionContextReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_PERMISSIONS:
      return {
        ...state,
        permissions: action.permissions
      }

    case ActionType.SET_STAFF_PERMISSIONS:
      return {
        ...state,
        staffPermissions: action.staffPermissions
      }

    case ActionType.SET_USER_PERMISSIONS:
      return {
        ...state,
        userPermissions: action.userPermissions
      }

    case ActionType.SET_SERVICE_PERMISSIONS:
      return {
        ...state,
        servicePermissions: action.servicePermissions
      }

    case ActionType.SET_PATIENT_PERMISSIONS:
      return {
        ...state,
        patientPermissions: action.patientPermissions
      }

    case ActionType.SET_PRACTICE_PERMISSIONS:
      return {
        ...state,
        practicePermissions: action.practicePermissions
      }

    case ActionType.SET_SCHEDULE_PERMISSIONS:
      return {
        ...state,
        schedulePermissions: action.schedulePermissions
      }

    case ActionType.SET_FACILITY_PERMISSIONS:
      return {
        ...state,
        facilityPermissions: action.facilityPermissions
      }

    case ActionType.SET_PROVIDER_PERMISSIONS:
      return {
        ...state,
        providerPermissions: action.providerPermissions
      }

    case ActionType.SET_APPOINTMENT_PERMISSIONS:
      return {
        ...state,
        appointmentPermissions: action.appointmentPermissions
      }
  }
};
