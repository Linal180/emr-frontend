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
  userPermissions: [],
  servicePermissions: [],
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
    patientPermissions, appointmentPermissions, schedulePermissions, page, userPermissions, servicePermissions
  } = state;

  const [findAllPermissions] = useFindAllPermissionsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    async onCompleted(data) {
      if (data) {
        const { findAllPermissions: { permissions, pagination } } = data

        if (pagination) {
          const { totalPages } = pagination

          if (totalPages ? page !== totalPages : false) {
            dispatch({ type: ActionType.SET_PAGE, page: page + 1 })
          }
        }

        permissions && await updateList(permissions as PermissionsPayload['permissions'])
      }
    }
  })

  const updateList = async (list: PermissionsPayload['permissions']) => {
    list?.map(permission => {
      const { moduleType } = permission || {}

      switch (moduleType) {
        case MODULE_TYPES.Permission:
          permissions && dispatch({ type: ActionType.SET_PERMISSIONS, permissions: [permission, ...permissions] })
          break;

        case MODULE_TYPES.Practice:
          practicePermissions && dispatch({ type: ActionType.SET_PRACTICE_PERMISSIONS, practicePermissions: [permission, ...practicePermissions] })
          break;

        case MODULE_TYPES.Facility:
          facilityPermissions && dispatch({ type: ActionType.SET_FACILITY_PERMISSIONS, facilityPermissions: [permission, ...facilityPermissions] })
          break;

        case MODULE_TYPES.Provider:
          providerPermissions && dispatch({ type: ActionType.SET_PROVIDER_PERMISSIONS, providerPermissions: [permission, ...providerPermissions] })
          break;

        case MODULE_TYPES.Staff:
          staffPermissions && dispatch({ type: ActionType.SET_STAFF_PERMISSIONS, staffPermissions: [permission, ...staffPermissions] })
          break;

        case MODULE_TYPES.Patient:
          patientPermissions && dispatch({ type: ActionType.SET_PATIENT_PERMISSIONS, patientPermissions: [permission, ...patientPermissions] })
          break;

        case MODULE_TYPES.Schedule:
        case MODULE_TYPES.Schedules:
          schedulePermissions && dispatch({ type: ActionType.SET_SCHEDULE_PERMISSIONS, schedulePermissions: [permission, ...schedulePermissions] })
          break;

        case MODULE_TYPES.Appointment:
          appointmentPermissions && dispatch({ type: ActionType.SET_APPOINTMENT_PERMISSIONS, appointmentPermissions: [permission, ...appointmentPermissions] })
          break;

        case MODULE_TYPES.User:
          userPermissions && dispatch({ type: ActionType.SET_USER_PERMISSIONS, userPermissions: [permission, ...userPermissions] })
          break;

        case MODULE_TYPES.Service:
        case MODULE_TYPES.Services:
          servicePermissions && dispatch({ type: ActionType.SET_SERVICE_PERMISSIONS, servicePermissions: [permission, ...servicePermissions] })
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
        userPermissions,
        staffPermissions,
        patientPermissions,
        servicePermissions,
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
