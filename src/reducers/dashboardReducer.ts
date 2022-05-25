import { XrangePointOptionsObject } from "highcharts";

export interface State {
  practicesName: string[],
  facilitiesCount: XrangePointOptionsObject[]
}

export const initialState: State = {
  practicesName: [],
  facilitiesCount: [],
}

export enum ActionType {
  SET_PRACTICES_NAME = 'setPracticesName',
  SET_FACILITIES_COUNT = 'setFacilitiesCount'
}

export type Action =
  | { type: ActionType.SET_PRACTICES_NAME; practicesName: string[] }
  | { type: ActionType.SET_FACILITIES_COUNT; facilitiesCount: XrangePointOptionsObject[] }

export const dashboardReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PRACTICES_NAME:
      return {
        ...state,
        practicesName: action.practicesName
      }

    case ActionType.SET_FACILITIES_COUNT:
      return {
        ...state,
        facilitiesCount: action.facilitiesCount
      }
  };
}
