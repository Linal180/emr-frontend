import { DaySchedule } from "../interfacesTypes";
import { SlotsPayload, SchedulesPayload } from "../generated/graphql"

export interface State {
  isEdit: boolean;
  scheduleId: string;
  openDelete: boolean;
  doctorFacilityId: string;
  openModal: boolean;
  byDaySchedules: DaySchedule[];
  slots: SlotsPayload['slots'];
  schedules: SchedulesPayload['schedules'];
}

export const initialState: State = {
  isEdit: false,
  scheduleId: "",
  openDelete: false,
  byDaySchedules: [],
  slots: [],
  doctorFacilityId: "",
  openModal: false,
  schedules: [],
}

export enum ActionType {
  SET_IS_EDIT = 'setIsEdit',
  SET_SCHEDULE_ID = 'setScheduleId',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_SLOTS = 'setSlots',
  SET_BY_DAY_SCHEDULES = 'setByDaySchedules',
  SET_SCHEDULES = 'setSchedules',
  SET_DOCTOR_FACILITY_ID = 'setDoctorFacilityId',
  SET_OPEN_MODAL = 'setOpenModal',
}

export type Action =
  | { type: ActionType.SET_IS_EDIT; isEdit: boolean }
  | { type: ActionType.SET_SCHEDULE_ID, scheduleId: string }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_DOCTOR_FACILITY_ID; doctorFacilityId: string }
  | { type: ActionType.SET_BY_DAY_SCHEDULES; byDaySchedules: DaySchedule[] }
  | { type: ActionType.SET_OPEN_MODAL; openModal: boolean }
  | { type: ActionType.SET_SLOTS; slots: SlotsPayload['slots'] }
  | { type: ActionType.SET_SCHEDULES, schedules: SchedulesPayload['schedules'] }

export const scheduleReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_IS_EDIT:
      return {
        ...state,
        isEdit: action.isEdit
      }

    case ActionType.SET_OPEN_DELETE:
      return {
        ...state,
        openDelete: action.openDelete
      }

    case ActionType.SET_SCHEDULE_ID:
      return {
        ...state,
        scheduleId: action.scheduleId
      }

    case ActionType.SET_BY_DAY_SCHEDULES:
      return {
        ...state,
        byDaySchedules: action.byDaySchedules
      }

    case ActionType.SET_OPEN_MODAL:
      return {
        ...state,
        openModal: action.openModal
      }

    case ActionType.SET_DOCTOR_FACILITY_ID:
      return {
        ...state,
        doctorFacilityId: action.doctorFacilityId
      }

    case ActionType.SET_SLOTS:
      return {
        ...state,
        slots: action.slots
      }

    case ActionType.SET_SCHEDULES:
      return {
        ...state,
        schedules: action.schedules
      }
  };
}
