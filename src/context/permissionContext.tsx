// packages block
import { createContext, FC, useCallback, useEffect, Reducer, useReducer } from "react";
// graphql, interfaces/types, reducer and constants block
import { LIST_PAGE_LIMIT, MODULE_TYPES, TOKEN } from "../constants";
import { PermissionContextInterface } from "../interfacesTypes";
import { PermissionsPayload, useFindAllPermissionsLazyQuery } from "../generated/graphql";
import {
  Action, ActionType, initialState, permissionContextReducer, State
} from '../reducers/permissionContextReducer';

export const PermissionContext = createContext<PermissionContextInterface>({
  permissions: [],
  staffPermissions: [],
  patientPermissions: [],
  practicePermissions: [],
  schedulePermissions: [],
  facilityPermissions: [],
  providerPermissions: [],
  appointmentPermissions: [],
});

export const PermissionContextProvider: FC = ({ children }): JSX.Element => {
  const hasToken = localStorage.getItem(TOKEN);
  const [state, dispatch] = useReducer<Reducer<State, Action>>(permissionContextReducer, initialState)
  const {
    permissions, practicePermissions, facilityPermissions, providerPermissions, staffPermissions,
    patientPermissions, appointmentPermissions, schedulePermissions, page
  } = state;

  const [findAllPermissions] = useFindAllPermissionsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { findAllPermissions: { permissions, pagination } } = data

        if (pagination) {
          const { totalPages } = pagination

          if (totalPages ? page !== totalPages : false) {
            dispatch({ type: ActionType.SET_PAGE, page: page + 1})
          }
        }

        permissions && updateList(permissions as PermissionsPayload['permissions'])
      }
    }
  })

  const updateList = (list: PermissionsPayload['permissions']) => {
    list?.map(permission => {
      const { moduleType } = permission || {}

      switch (moduleType) {
        case MODULE_TYPES.Permission:
          permissions && dispatch({ type: ActionType.SET_PERMISSIONS, permissions: [...permissions, permission] })
          break;

        case MODULE_TYPES.Practice:
          practicePermissions && dispatch({ type: ActionType.SET_PRACTICE_PERMISSIONS, practicePermissions: [...practicePermissions, permission] })
          break;

        case MODULE_TYPES.Facility:
          facilityPermissions && dispatch({ type: ActionType.SET_FACILITY_PERMISSIONS, facilityPermissions: [...facilityPermissions, permission] })
          break;

        case MODULE_TYPES.Provider:
          providerPermissions && dispatch({ type: ActionType.SET_PROVIDER_PERMISSIONS, providerPermissions: [...providerPermissions, permission] })
          break;

        case MODULE_TYPES.Staff:
          staffPermissions && dispatch({ type: ActionType.SET_STAFF_PERMISSIONS, staffPermissions: [...staffPermissions, permission] })
          break;

        case MODULE_TYPES.Patient:
          patientPermissions && dispatch({ type: ActionType.SET_PATIENT_PERMISSIONS, patientPermissions: [...patientPermissions, permission] })
          break;

        case MODULE_TYPES.Schedule:
        case MODULE_TYPES.Schedules:
          schedulePermissions && dispatch({ type: ActionType.SET_SCHEDULE_PERMISSIONS, schedulePermissions: [...schedulePermissions, permission] })
          break;

        case MODULE_TYPES.Appointment:
          appointmentPermissions && dispatch({ type: ActionType.SET_APPOINTMENT_PERMISSIONS, appointmentPermissions: [...appointmentPermissions, permission] })
          break;
      }
      // eslint-disable-next-line array-callback-return
      return;
    })
  }

  const fetchAllPermissionList = useCallback(async (page = 1) => {
    try {
      await findAllPermissions({
        variables: { permissionInput: { paginationOptions: { page, limit: LIST_PAGE_LIMIT } } }
      });
    } catch { }
  }, [findAllPermissions])

  useEffect(() => { hasToken && fetchAllPermissionList(page) }, [fetchAllPermissionList, hasToken, page])

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        staffPermissions,
        patientPermissions,
        practicePermissions,
        schedulePermissions,
        facilityPermissions,
        providerPermissions,
        appointmentPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};
