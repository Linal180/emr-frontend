import { AUDIT_TIME_ENUMS } from "../constants";
import { UserLogsPayload } from "../generated/graphql";

export interface State {
  page: number;
  totalPages: number;
  timeDuration: string;
  userLogs: UserLogsPayload['userLogs']
}


export const initialState: State = {
  page: 1,
  userLogs: [],
  totalPages: 0,
  timeDuration: AUDIT_TIME_ENUMS[0],
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_USER_LOGS = 'setUserLogs',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_TIME_DURATION = 'setTimeDuration',
}

export type Action =
  { type: ActionType.SET_PAGE; page: number } |
  { type: ActionType.SET_TOTAL_PAGES; totalPages: number } |
  { type: ActionType.SET_TIME_DURATION; timeDuration: string } |
  { type: ActionType.SET_USER_LOGS; userLogs: UserLogsPayload['userLogs'] }


export const userLogsReducer = (state: State, action: Action): State => {
  switch (action.type) {

    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_TIME_DURATION:
      return {
        ...state,
        timeDuration: action.timeDuration
      }

    case ActionType.SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.totalPages
      }

    case ActionType.SET_USER_LOGS:
      return {
        ...state,
        userLogs: action.userLogs
      }
  }
}