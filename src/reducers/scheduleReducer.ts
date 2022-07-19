import { DaySchedule, multiOptionType } from "../interfacesTypes";
import { SlotsPayload, SchedulesPayload } from "../generated/graphql"

export interface State {
  isEdit: boolean;
  openModal: boolean;
  scheduleId: string;
  openDelete: boolean;
  scheduleIds: string[];
  doctorFacilityId: string;
  scheduleRecursion: boolean;
  slots: SlotsPayload['slots'];
  serviceIds: multiOptionType[];
  byDaySchedules: DaySchedule[];
  schedules: SchedulesPayload['schedules'];
}

export const initialState: State = {
  slots: [],
  schedules: [],
  serviceIds: [],
  isEdit: false,
  scheduleId: "",
  scheduleIds: [],
  openModal: false,
  openDelete: false,
  byDaySchedules: [],
  doctorFacilityId: "",
  scheduleRecursion: true,
}

export enum ActionType {
  SET_SLOTS = 'setSlots',
  SET_IS_EDIT = 'setIsEdit',
  SET_SCHEDULES = 'setSchedules',
  SET_SERVICE_IDS = 'serviceIds',
  SET_OPEN_MODAL = 'setOpenModal',
  SET_SCHEDULE_ID = 'setScheduleId',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_SCHEDULES_IDS = 'setScheduleIds',
  SET_BY_DAY_SCHEDULES = 'setByDaySchedules',
  SET_DOCTOR_FACILITY_ID = 'setDoctorFacilityId',
  SET_SCHEDULE_RECURSION = 'setScheduleRecursion',
}

export type Action =
  | { type: ActionType.SET_IS_EDIT; isEdit: boolean }
  | { type: ActionType.SET_SCHEDULES_IDS; scheduleIds: string[] }
  | { type: ActionType.SET_SERVICE_IDS; serviceIds: multiOptionType[] }
  | { type: ActionType.SET_SCHEDULE_ID, scheduleId: string }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_DOCTOR_FACILITY_ID; doctorFacilityId: string }
  | { type: ActionType.SET_BY_DAY_SCHEDULES; byDaySchedules: DaySchedule[] }
  | { type: ActionType.SET_OPEN_MODAL; openModal: boolean }
  | { type: ActionType.SET_SLOTS; slots: SlotsPayload['slots'] }
  | { type: ActionType.SET_SCHEDULE_RECURSION; scheduleRecursion: boolean }
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

    case ActionType.SET_SCHEDULES_IDS:
      return {
        ...state,
        scheduleIds: action.scheduleIds
      }

    case ActionType.SET_SCHEDULE_RECURSION:
      return {
        ...state,
        scheduleRecursion: action.scheduleRecursion
      }

    case ActionType.SET_SERVICE_IDS:
      return {
        ...state,
        serviceIds: action.serviceIds
      }
  };
}
