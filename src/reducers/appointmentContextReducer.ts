import { AppointmentsPayload } from "../generated/graphql"

export interface State {
  appointmentPages: number;
  appointmentList: AppointmentsPayload['appointments']
}

export const initialState: State = {
  appointmentPages: 1,
  appointmentList: [],
}

export enum ActionType {
  SET_APPOINTMENT_PAGES = "setAppointmentPages",
  SET_APPOINTMENT_LIST = "setAppointmentList",
}

export type Action =
  | { type: ActionType.SET_APPOINTMENT_PAGES; appointmentPages: number }
  | { type: ActionType.SET_APPOINTMENT_LIST; appointmentList: AppointmentsPayload['appointments'] }

export const appointmentContextReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_APPOINTMENT_PAGES:
      return {
        ...state,
        appointmentPages: action.appointmentPages
      }
    case ActionType.SET_APPOINTMENT_LIST:
      return {
        ...state,
        appointmentList: action.appointmentList
      }
  }
};
